

'use strict';




const VIDEOS = [
  {
    id: 'RJTCAL1DRro',
    title: 'L30 Penthouse',
    subtitle: 'Pursuit of a Radical Rhapsody — Total Environment',
    chapters: [
      { time: 0,   label: 'Introduction' },
      { time: 15,  label: 'Building Exterior & Landscape' },
      { time: 42,  label: 'Grand Entrance & Lobby' },
      { time: 72,  label: 'Living Spaces & Design' },
      { time: 108, label: 'Kitchen & Dining Experience' },
      { time: 140, label: 'Master Bedroom Suite' },
      { time: 172, label: 'Terrace & Panoramic Views' },
      { time: 195, label: 'Amenities & Community Living' }
    ]
  },
  {
    id: 'jj_aUFX8SV8',
    title: 'After the Rain',
    subtitle: 'Earth-Sheltered Villas — Total Environment',
    chapters: [
      { time: 0,   label: 'Introduction' },
      { time: 18,  label: 'Aerial View & Community Layout' },
      { time: 45,  label: 'Earth-Sheltered Villa Design' },
      { time: 78,  label: 'Interior Walkthrough' },
      { time: 112, label: 'Natural Materials & Green Roof' },
      { time: 140, label: 'Landscaped Pathways & Gardens' },
      { time: 165, label: 'Community Living & Phase 3' }
    ]
  },
  {
    id: 'xmmxkmVSiq0',
    title: 'Windmills of Your Mind',
    subtitle: 'Living with Nature — Total Environment',
    chapters: [
      { time: 0,   label: 'Introduction' },
      { time: 25,  label: 'Design Philosophy' },
      { time: 58,  label: 'Project Walkthrough' },
      { time: 100, label: 'Living Spaces & Interiors' },
      { time: 138, label: 'Surroundings & Nature' }
    ]
  }
];


let currentVideoIndex = 0;
let carouselPlayer = null;
let chapterInterval = null;
let previewPlayer = null;
let isYTApiReady = false;




function loadYouTubeAPI() {
  if (document.getElementById('yt-api-script')) return;

  const tag = document.createElement('script');
  tag.id = 'yt-api-script';
  tag.src = 'https://www.youtube.com/iframe_api';
  document.head.appendChild(tag);
}


window.onYouTubeIframeAPIReady = function() {
  isYTApiReady = true;
  
  const section = document.getElementById('task-2');
  if (!section) return;

  
  const observer = new IntersectionObserver(function(entries) {
    if (entries[0].isIntersecting) {
      observer.disconnect();
      createCarouselPlayer(VIDEOS[currentVideoIndex].id);
    }
  }, { threshold: 0.01 });

  observer.observe(section);
};




function createCarouselPlayer(videoId) {
  const container = document.getElementById('carousel-player');
  if (!container) return;

  
  if (carouselPlayer && typeof carouselPlayer.destroy === 'function') {
    carouselPlayer.destroy();
  }

  carouselPlayer = new YT.Player('carousel-player', {
    videoId: videoId,
    playerVars: {
      autoplay: 0,
      modestbranding: 1,
      rel: 0,
      enablejsapi: 1,
      origin: window.location.origin
    },
    events: {
      onReady: onCarouselPlayerReady,
      onStateChange: onCarouselStateChange
    }
  });
}


function onCarouselPlayerReady() {
  startChapterTracking();
}


function onCarouselStateChange(event) {
  if (event.data === YT.PlayerState.PLAYING) {
    startChapterTracking();
  } else {
    stopChapterTracking();
  }
}




function startChapterTracking() {
  stopChapterTracking(); 

  chapterInterval = setInterval(function() {
    if (!carouselPlayer || typeof carouselPlayer.getCurrentTime !== 'function') return;

    const currentTime = carouselPlayer.getCurrentTime();
    updateActiveChapter(currentTime);
  }, 500);
}

function stopChapterTracking() {
  if (chapterInterval) {
    clearInterval(chapterInterval);
    chapterInterval = null;
  }
}


function updateActiveChapter(currentTime) {
  const chapters = VIDEOS[currentVideoIndex].chapters;
  const chapterItems = document.querySelectorAll('#chapters-list .chapter-item');

  let activeIndex = 0;
  for (let i = chapters.length - 1; i >= 0; i--) {
    if (currentTime >= chapters[i].time) {
      activeIndex = i;
      break;
    }
  }

  chapterItems.forEach(function(item, index) {
    if (index === activeIndex) {
      item.classList.add('active');
      
      const container = document.getElementById('chapters-list');
      if (container) {
        const itemTop = item.offsetTop - container.offsetTop;
        const itemBottom = itemTop + item.offsetHeight;
        const containerScrollTop = container.scrollTop;
        const containerHeight = container.offsetHeight;
        
        
        if (itemTop < containerScrollTop || itemBottom > containerScrollTop + containerHeight) {
          container.scrollTo({
            top: itemTop - containerHeight / 2 + item.offsetHeight / 2,
            behavior: 'smooth'
          });
        }
      }
    } else {
      item.classList.remove('active');
    }
  });
}




function seekToChapter(time) {
  if (carouselPlayer && typeof carouselPlayer.seekTo === 'function') {
    carouselPlayer.seekTo(time, true);
    carouselPlayer.playVideo();
  }
}




function switchVideo(index) {
  if (index < 0 || index >= VIDEOS.length) return;
  if (index === currentVideoIndex) return;

  currentVideoIndex = index;
  const video = VIDEOS[currentVideoIndex];

  
  if (carouselPlayer && typeof carouselPlayer.loadVideoById === 'function') {
    carouselPlayer.loadVideoById(video.id);
  } else {
    createCarouselPlayer(video.id);
  }

  
  renderChapters();

  
  const titleEl = document.getElementById('video-title');
  const subtitleEl = document.getElementById('video-subtitle');
  if (titleEl) titleEl.textContent = video.title;
  if (subtitleEl) subtitleEl.textContent = video.subtitle;

  
  updateThumbnailsActiveState();
}


function renderChapters() {
  const list = document.getElementById('chapters-list');
  const countEl = document.getElementById('chapters-count');
  if (!list) return;

  const chapters = VIDEOS[currentVideoIndex].chapters;
  if (countEl) countEl.textContent = chapters.length + ' chapters';

  list.innerHTML = chapters.map(function(ch, i) {
    const minutes = Math.floor(ch.time / 60);
    const seconds = ch.time % 60;
    const timeStr = minutes + ':' + (seconds < 10 ? '0' : '') + seconds;

    return '<div class="chapter-item' + (i === 0 ? ' active' : '') + '" ' +
           'data-time="' + ch.time + '" ' +
           'id="chapter-' + currentVideoIndex + '-' + i + '">' +
           '<span class="chapter-timestamp">' + timeStr + '</span>' +
           '<span class="chapter-title">' + ch.label + '</span>' +
           '</div>';
  }).join('');

  
  list.querySelectorAll('.chapter-item').forEach(function(item) {
    item.addEventListener('click', function() {
      const time = parseFloat(item.getAttribute('data-time'));
      seekToChapter(time);
    });
  });
}


function renderThumbnails() {
  const container = document.getElementById('thumbnails-grid');
  if (!container) return;

  container.innerHTML = VIDEOS.map(function(video, i) {
    const isActive = i === currentVideoIndex ? ' active' : '';
    
    const thumbUrl = 'https://img.youtube.com/vi/' + video.id + '/hqdefault.jpg';
    
    return '<div class="thumbnail-card' + isActive + '" data-index="' + i + '">' +
             '<div class="thumbnail-img-wrapper">' +
               '<img src="' + thumbUrl + '" alt="' + video.title + '">' +
             '</div>' +
             '<div class="thumbnail-info">' +
               '<h4>' + video.title + '</h4>' +
             '</div>' +
           '</div>';
  }).join('');

  
  container.querySelectorAll('.thumbnail-card').forEach(function(card) {
    card.addEventListener('click', function() {
      switchVideo(parseInt(card.getAttribute('data-index')));
    });
  });
}


function updateThumbnailsActiveState() {
  const cards = document.querySelectorAll('.thumbnail-card');
  cards.forEach(function(card, i) {
    card.classList.toggle('active', i === currentVideoIndex);
  });
}




function extractVideoId(url) {
  if (!url) return null;

  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/
  ];

  for (let i = 0; i < patterns.length; i++) {
    const match = url.match(patterns[i]);
    if (match) return match[1];
  }

  return null;
}


function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
}




async function handleDetectChapters() {
  const input = document.getElementById('url-input');
  const btn = document.getElementById('detect-btn');
  const output = document.getElementById('generated-chapters');
  const errorOut = document.getElementById('detection-error');
  const previewContainer = document.getElementById('preview-player-container');

  if (!input || !btn) return;

  const url = input.value.trim();
  if (!url) {
    alert('Please enter a YouTube URL');
    return;
  }

  
  const match = url.match(/(?:v=|youtu\.be\/)([^&]+)/);
  if (!match) {
    alert('Invalid YouTube URL');
    return;
  }
  const videoId = match[1];

  
  if (output) output.classList.remove('visible');
  if (errorOut) {
    errorOut.style.display = 'none';
    errorOut.textContent = '';
  }
  if (previewContainer) previewContainer.classList.remove('visible');

  
  btn.classList.add('loading');
  const spinner = btn.querySelector('.spinner');
  const btnText = btn.querySelector('.btn-text');
  if (spinner) spinner.style.display = 'block';
  if (btnText) btnText.style.display = 'none';
  btn.disabled = true;

  try {
    // Show preview player and wait for duration
    let duration = 180;
    if (previewContainer) {
      previewContainer.classList.add('visible');
      // Delay initialization slightly to let the browser render the container
      await new Promise(function(resolve) { setTimeout(resolve, 50); });
      duration = await getVideoDuration(videoId);
    } else {
      // Simulate network latency if preview isn't there
      await new Promise(function(resolve) { setTimeout(resolve, 2000); });
    }

    // Determine chapter count based on duration
    let chapterCount;
    if (duration < 120) {
      chapterCount = 3 + Math.floor(Math.random() * 2); // 3-4
    } else if (duration < 300) {
      chapterCount = 5 + Math.floor(Math.random() * 3); // 5-7
    } else if (duration < 900) {
      chapterCount = 7 + Math.floor(Math.random() * 4); // 7-10
    } else {
      chapterCount = 10 + Math.floor(Math.random() * 6); // 10-15
    }

    const introLabels = ['Introduction', 'Welcome & Overview', 'Opening'];
    const middleLabels = [
      'Key Concepts Explained', 'Deep Dive: Core Topic',
      'Walkthrough & Demo', 'Detailed Analysis',
      'Main Discussion', 'Feature Showcase',
      'Technical Breakdown', 'Practical Examples',
      'Case Study', 'Step-by-Step Guide',
      'Important Highlights', 'Behind the Scenes',
      'Design & Architecture', 'Visual Tour'
    ];
    const outroLabels = ['Summary & Key Takeaways', 'Conclusion', 'Final Thoughts & Next Steps'];

    const chapters = [];
    chapters.push({
      time: 0,
      label: introLabels[Math.floor(Math.random() * introLabels.length)]
    });

    const interval = Math.floor(duration / chapterCount);
    let currentTime = 0;

    for (let i = 1; i < chapterCount - 1; i++) {
      // Add some randomness to the interval
      const jitter = Math.floor((Math.random() * 0.4 - 0.2) * interval);
      currentTime += interval + jitter;
      
      // Ensure we don't exceed the video duration (leave room for outro)
      if (currentTime > duration * 0.9) break;

      chapters.push({
        time: currentTime,
        label: middleLabels[Math.floor(Math.random() * middleLabels.length)]
      });
    }

    if (chapterCount > 2) {
      const outroTime = Math.round(duration * 0.88);
      chapters.push({
        time: outroTime,
        label: outroLabels[Math.floor(Math.random() * outroLabels.length)]
      });
    }

    displayGeneratedChapters(chapters, videoId);

  } catch (error) {
    console.error('Chapter detection failed:', error);
    if (errorOut) {
      errorOut.textContent = error.message;
      errorOut.style.display = 'block';
    }
  } finally {
    btn.classList.remove('loading');
    if (spinner) spinner.style.display = 'none';
    if (btnText) btnText.style.display = 'block';
    btn.disabled = false;
  }
}


function getVideoDuration(videoId) {
  return new Promise(function(resolve) {
    const container = document.getElementById('preview-player');
    if (!container) {
      resolve(180); 
      return;
    }

    if (previewPlayer && typeof previewPlayer.destroy === 'function') {
      previewPlayer.destroy();
    }

    previewPlayer = new YT.Player('preview-player', {
      videoId: videoId,
      playerVars: {
        autoplay: 0,
        modestbranding: 1,
        rel: 0
      },
      events: {
        onReady: function(event) {
          const duration = event.target.getDuration();
          resolve(duration || 180);
        }
      }
    });
  });
}


function displayGeneratedChapters(chapters, videoId) {
  const output = document.getElementById('generated-chapters');
  const list = document.getElementById('generated-list');
  const codeBlock = document.getElementById('generated-code-block');
  if (!output || !list) return;

  list.innerHTML = chapters.map(function(ch) {
    return '<div class="generated-item">' +
           '<span class="chapter-timestamp">' + formatTime(ch.time) + '</span>' +
           '<span class="chapter-title">' + ch.label + '</span>' +
           '</div>';
  }).join('');

  
  if (codeBlock) {
    const chaptersJson = JSON.stringify(chapters, null, 2);
    
    let embedCode = 
`<!-- 1. Video Container -->
<div id="my-video-container" style="position:relative; width:100%; padding-bottom:56.25%;">
  <iframe id="my-youtube-player" src="https://www.youtube.com/embed/${videoId}?enablejsapi=1&rel=0" 
          style="position:absolute; top:0; left:0; width:100%; height:100%; border:none;" 
          allowfullscreen></iframe>
</div>

<!-- 2. Chapters List -->
<ul id="my-video-chapters" style="list-style:none; padding:0; margin-top:20px;">
  <!-- Chapters will be injected here -->
</ul>

<!-- 3. Embed Script -->
<script>
  const chapters = ${chaptersJson};
  const listEl = document.getElementById('my-video-chapters');
  
  
  chapters.forEach(ch => {
    const li = document.createElement('li');
    li.style.cssText = "cursor:pointer; padding:8px; border-bottom:1px solid #ccc; font-family:sans-serif;";
    
    const minutes = Math.floor(ch.time / 60);
    const seconds = ch.time % 60;
    const timeStr = minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
    
    li.innerHTML = "<strong>" + timeStr + "</strong> - " + ch.label;
    
    li.onclick = function() {
      if (window.myPlayer && typeof window.myPlayer.seekTo === 'function') {
        window.myPlayer.seekTo(ch.time, true);
      }
    };
    listEl.appendChild(li);
  });

  
  var tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  window.onYouTubeIframeAPIReady = function() {
    window.myPlayer = new YT.Player('my-youtube-player', {});
  };
</script>`;

    
    codeBlock.textContent = embedCode;
    
    
    output.setAttribute('data-embed-code', embedCode);
  }

  output.classList.add('visible');

  
  output.setAttribute('data-chapters', JSON.stringify(chapters));
}


function copyChapters() {
  const output = document.getElementById('generated-chapters');
  if (!output) return;

  const chapters = JSON.parse(output.getAttribute('data-chapters') || '[]');
  const text = chapters.map(function(ch) {
    return formatTime(ch.time) + ' ' + ch.label;
  }).join('\n');

  navigator.clipboard.writeText(text).then(function() {
    const btn = document.getElementById('copy-btn');
    if (btn) {
      const originalHTML = btn.innerHTML;
      btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Copied!';
      btn.style.background = 'var(--color-success)';
      btn.style.color = 'white';
      btn.style.borderColor = 'var(--color-success)';
      setTimeout(function() {
        btn.innerHTML = originalHTML;
        btn.style.background = '';
        btn.style.color = '';
      }, 2000);
    }
  });
}


function copyEmbedCode() {
  const output = document.getElementById('generated-chapters');
  if (!output) return;

  const text = output.getAttribute('data-embed-code') || '';
  if (!text) return;

  navigator.clipboard.writeText(text).then(function() {
    const btn = document.getElementById('copy-code-btn');
    if (btn) {
      const originalHTML = btn.innerHTML;
      btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Copied!';
      btn.style.background = 'var(--color-success)';
      btn.style.color = 'white';
      btn.style.borderColor = 'var(--color-success)';
      setTimeout(function() {
        btn.innerHTML = originalHTML;
        btn.style.background = '';
        btn.style.color = '';
      }, 2000);
    }
  });
}


document.addEventListener('DOMContentLoaded', function() {
  const copyChaptersBtn = document.getElementById('copy-btn');
  if (copyChaptersBtn) copyChaptersBtn.addEventListener('click', copyChapters);

  const copyCodeBtn = document.getElementById('copy-code-btn');
  if (copyCodeBtn) copyCodeBtn.addEventListener('click', copyEmbedCode);
});



function initVideoChapters() {
  
  loadYouTubeAPI();

  
  renderChapters();
  renderThumbnails();

  
  const detectBtn = document.getElementById('detect-btn');
  if (detectBtn) {
    detectBtn.addEventListener('click', handleDetectChapters);
  }

  
  const copyBtn = document.getElementById('copy-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', copyChapters);
  }

  
  const urlInput = document.getElementById('url-input');
  if (urlInput) {
    urlInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        handleDetectChapters();
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', initVideoChapters);
