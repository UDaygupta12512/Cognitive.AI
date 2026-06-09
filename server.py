import http.server
import socketserver
import urllib.parse
import json
import re
import sys
import os

try:
    from youtube_transcript_api import YouTubeTranscriptApi
except ImportError:
    YouTubeTranscriptApi = None

PORT = int(os.environ.get('PORT', 8080))

def format_time(seconds):
    minutes = int(seconds // 60)
    secs = int(seconds % 60)
    return f"{minutes}:{secs:02d}"

class MyHttpRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/api/chapters':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            try:
                data = json.loads(post_data.decode('utf-8'))
                url = data.get('url', '')
                
                
                match = re.search(r'(?:v=|youtu\.be/)([^&]+)', url)
                if not match:
                    self.send_response(400)
                    self.send_header('Content-type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps({'error': 'Invalid YouTube URL'}).encode('utf-8'))
                    return
                
                video_id = match.group(1)
                
                if not YouTubeTranscriptApi:
                    self.send_response(500)
                    self.send_header('Content-type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps({'error': 'youtube-transcript-api is not installed on the server.'}).encode('utf-8'))
                    return
                
                
                api = YouTubeTranscriptApi()
                try:
                    transcript_list = api.list(video_id)
                    
                    transcript = transcript_list.find_generated_transcript(['en', 'en-US', 'en-GB'])
                    transcript_data = transcript.fetch()
                except Exception as e:
                    
                    try:
                        transcript = transcript_list.find_manually_created_transcript(['en', 'en-US', 'en-GB'])
                        transcript_data = transcript.fetch()
                    except Exception as fallback_e:
                        self.send_response(400)
                        self.send_header('Content-type', 'application/json')
                        self.end_headers()
                        self.wfile.write(json.dumps({
                            'error': 'Failed to fetch transcript. The video might be a Live Stream, or captions are disabled.'
                        }).encode('utf-8'))
                        return

                
                chapters = []
                chapters.append({"time": 0, "label": "Introduction"})
                
                current_time = 0
                chapter_interval = 180  
                
                for segment in transcript_data:
                    
                    start = getattr(segment, 'start', None)
                    if start is None and isinstance(segment, dict):
                        start = segment.get('start')
                        
                    if start - current_time > chapter_interval:
                        chapters.append({
                            "time": int(start),
                            "label": f"Topic starting at {format_time(start)}"
                        })
                        current_time = start

                if len(chapters) > 1:
                    last_segment = transcript_data[-1]
                    last_start = getattr(last_segment, 'start', None)
                    if last_start is None and isinstance(last_segment, dict):
                        last_start = last_segment.get('start')
                        
                    chapters.append({
                        "time": int(last_start),
                        "label": "Conclusion"
                    })

                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({
                    'videoId': video_id,
                    'chapters': chapters
                }).encode('utf-8'))
                
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': str(e)}).encode('utf-8'))
            return
            
        
        self.send_response(501)
        self.end_headers()

Handler = MyHttpRequestHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print("Serving at port", PORT)
    print("API endpoint available at POST /api/chapters")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    httpd.server_close()
