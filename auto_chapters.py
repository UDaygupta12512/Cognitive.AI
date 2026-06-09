import sys
import re
import json

try:
    from youtube_transcript_api import YouTubeTranscriptApi
except ImportError:
    print("Error: youtube-transcript-api is not installed.")
    print("Please install it by running: pip install youtube-transcript-api")
    sys.exit(1)

def extract_video_id(url):
    
    
    match = re.search(r'(?:v=|youtu\.be/)([^&]+)', url)
    if match:
        return match.group(1)
    return None

def format_time(seconds):
    
    minutes = int(seconds // 60)
    secs = int(seconds % 60)
    return f"{minutes}:{secs:02d}"

def detect_chapters(video_id):
    
    print(f"Fetching transcript for video ID: {video_id}...")
    
    try:
        api = YouTubeTranscriptApi()
        transcript_list = api.list(video_id)
        transcript = transcript_list.find_generated_transcript(['en', 'en-US', 'en-GB'])
        transcript_data = transcript.fetch()
    except Exception as e:
        try:
            transcript = transcript_list.find_manually_created_transcript(['en', 'en-US', 'en-GB'])
            transcript_data = transcript.fetch()
        except Exception as e:
            print(f"\n[ERROR] Failed to fetch transcript for this video.")
            print(f"Reason: {str(e)}")
            print("\nNote: Automated chapter detection relies on video transcripts. "
                  "If the video is a Live Stream, or if the uploader disabled captions, "
                  "an AI system cannot 'read' the video without a heavy audio processing backend.")
            return []

    print(f"Transcript fetched successfully ({len(transcript_data)} segments).")
    print("Analyzing text to detect suitable chapter points...\n")

    
    chapters = []
    chapters.append({"time": 0, "label": "Introduction"})
    
    current_time = 0
    chapter_interval = 180  
    
    for i, segment in enumerate(transcript_data):
        
        start = getattr(segment, 'start', None)
        if start is None and isinstance(segment, dict):
            start = segment.get('start')
            
        
        if start - current_time > chapter_interval:
            chapters.append({
                "time": int(start),
                "label": f"Topic segment starting at {format_time(start)}"
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

    return chapters

def generate_embed_code(video_id, chapters):
    
    
    chapters_json = json.dumps(chapters, indent=2)
    
    code = f
    return code

if __name__ == "__main__":
    print("==================================================")
    print("   AUTOMATED VIDEO CHAPTERS & CODE GENERATOR")
    print("==================================================\n")
    
    url = input("Enter YouTube URL: ").strip()
    video_id = extract_video_id(url)
    
    if not video_id:
        print("Invalid YouTube URL.")
        sys.exit(1)
        
    chapters = detect_chapters(video_id)
    
    if chapters:
        print("\n--- DETECTED CHAPTERS ---")
        for ch in chapters:
            print(f"[{format_time(ch['time'])}] {ch['label']}")
            
        print("\n--- GENERATED EMBED CODE ---")
        print(generate_embed_code(video_id, chapters))
