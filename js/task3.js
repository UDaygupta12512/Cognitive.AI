'use strict';


let leadPlayer = null;
let leadTimerInterval = null;
let formTriggered = false;
let formDismissed = false;


const FORM_TRIGGER_SECONDS = 6;
const LEADS_STORAGE_KEY = 'cognitive_ai_leads';



function initLeadForm() {
  const section = document.getElementById('task-3');
  if (!section) return;

  
  const observer = new IntersectionObserver(function(entries) {
    if (entries[0].isIntersecting) {
      observer.disconnect(); 
      checkApiAndCreatePlayer();
    }
  }, { threshold: 0.01 });

  observer.observe(section);

  
  setupFormListeners();

  
  displayStoredLeads();
}

function checkApiAndCreatePlayer() {
  
  if (typeof YT !== 'undefined' && YT.Player) {
    createLeadPlayer();
  } else {
    const apiCheck = setInterval(function() {
      if (typeof YT !== 'undefined' && YT.Player) {
        clearInterval(apiCheck);
        createLeadPlayer();
      }
    }, 200);
  }
}

function createLeadPlayer() {
  const container = document.getElementById('lead-player');
  if (!container) return;

  leadPlayer = new YT.Player('lead-player', {
    events: {
      onReady: onLeadPlayerReady,
      onStateChange: onLeadStateChange
    }
  });
}

function onLeadPlayerReady() {
  updateCountdownBadge(0);
}



function onLeadStateChange(event) {
  
  if (event.data === YT.PlayerState.PLAYING) {
    
    if (formTriggered && !formDismissed) {
      leadPlayer.pauseVideo();
      return;
    }
    
    startPlaybackTimer();
  } else {
    
    stopPlaybackTimer();
  }
}

function startPlaybackTimer() {
  stopPlaybackTimer(); 

  if (formTriggered) return;

  leadTimerInterval = setInterval(function() {
    if (!leadPlayer || typeof leadPlayer.getCurrentTime !== 'function') return;

    let playedSeconds = leadPlayer.getCurrentTime();
    updateCountdownBadge(playedSeconds);

    
    if (playedSeconds >= FORM_TRIGGER_SECONDS && !formTriggered) {
      formTriggered = true;
      stopPlaybackTimer();
      showLeadForm();
    }
  }, 250);
}

function stopPlaybackTimer() {
  if (leadTimerInterval) {
    clearInterval(leadTimerInterval);
    leadTimerInterval = null;
  }
}



function updateCountdownBadge(playedSeconds) {
  const badge = document.getElementById('countdown-badge');
  const text = document.getElementById('countdown-text');
  if (!badge || !text) return;

  if (formTriggered || formDismissed) {
    badge.classList.add('hidden');
    return;
  }

  const remaining = Math.max(0, FORM_TRIGGER_SECONDS - playedSeconds);
  if (playedSeconds > 0) {
    text.textContent = 'Form in ' + remaining.toFixed(1) + 's';
    badge.classList.remove('hidden');
  } else {
    text.textContent = 'Play video to see form';
    badge.classList.remove('hidden');
  }
}

function hideCountdownBadge() {
  const badge = document.getElementById('countdown-badge');
  if (badge) badge.classList.add('hidden');
}



function showLeadForm() {
  const overlay = document.getElementById('lead-overlay');
  if (!overlay) return;

  
  if (leadPlayer && typeof leadPlayer.pauseVideo === 'function') {
    leadPlayer.pauseVideo();
  }

  
  overlay.classList.add('visible');

  
  hideCountdownBadge();

  
  setTimeout(function() {
    const firstInput = document.getElementById('lead-name');
    if (firstInput) firstInput.focus();
  }, 500);
}

function hideLeadForm() {
  const overlay = document.getElementById('lead-overlay');
  if (!overlay) return;

  overlay.classList.remove('visible');
  formDismissed = true;

  
  if (leadPlayer && typeof leadPlayer.playVideo === 'function') {
    leadPlayer.playVideo();
  }
}



function setupFormListeners() {
  const submitBtn = document.getElementById('lead-submit');
  if (submitBtn) {
    submitBtn.addEventListener('click', handleFormSubmit);
  }

  const skipBtn = document.getElementById('lead-skip');
  if (skipBtn) {
    skipBtn.addEventListener('click', function(e) {
      e.preventDefault();
      hideLeadForm();
    });
  }

  const clearBtn = document.getElementById('clear-leads');
  if (clearBtn) {
    clearBtn.addEventListener('click', clearStoredLeads);
  }

  const formInputs = document.querySelectorAll('.lead-form-card .form-input');
  formInputs.forEach(function(input) {
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') handleFormSubmit();
    });

    input.addEventListener('input', function() {
      const group = input.closest('.form-group');
      if (group) group.classList.remove('error');
    });
  });
}

function handleFormSubmit() {
  const nameInput = document.getElementById('lead-name');
  const emailInput = document.getElementById('lead-email');
  const phoneInput = document.getElementById('lead-phone');

  if (!nameInput || !emailInput || !phoneInput) return;

  let isValid = true;

  if (nameInput.value.trim().length < 2) {
    showFieldError(nameInput, 'Please enter your full name');
    isValid = false;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(emailInput.value.trim())) {
    showFieldError(emailInput, 'Please enter a valid email address');
    isValid = false;
  }

  const phoneDigits = phoneInput.value.replace(/\D/g, '');
  if (phoneDigits.length < 10) {
    showFieldError(phoneInput, 'Please enter a valid phone number');
    isValid = false;
  }

  if (!isValid) return;

  const lead = {
    name: nameInput.value.trim(),
    email: emailInput.value.trim(),
    phone: phoneInput.value.trim(),
    timestamp: new Date().toISOString(),
    videoTime: (leadPlayer && typeof leadPlayer.getCurrentTime === 'function' ? leadPlayer.getCurrentTime().toFixed(1) : '6.0') + 's'
  };

  saveLead(lead);
  showFormSuccess();
}

function showFieldError(input, message) {
  const group = input.closest('.form-group');
  if (!group) return;

  group.classList.add('error');
  const errorEl = group.querySelector('.form-error');
  if (errorEl) errorEl.textContent = message;
}

function showFormSuccess() {
  const formContent = document.getElementById('lead-form-content');
  const successContent = document.getElementById('lead-success');

  if (formContent) formContent.style.display = 'none';
  if (successContent) successContent.classList.add('visible');

  setTimeout(function() {
    hideLeadForm();
    if (formContent) formContent.style.display = '';
    if (successContent) successContent.classList.remove('visible');
    displayStoredLeads();
  }, 2500);
}



function saveLead(lead) {
  const leads = getStoredLeads();
  leads.push(lead);
  localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(leads));
}

function getStoredLeads() {
  try {
    return JSON.parse(localStorage.getItem(LEADS_STORAGE_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function displayStoredLeads() {
  const wrapper = document.getElementById('leads-table-wrapper');
  const tbody = document.getElementById('leads-tbody');
  if (!wrapper || !tbody) return;

  const leads = getStoredLeads();

  if (leads.length === 0) {
    wrapper.classList.remove('visible');
    return;
  }

  wrapper.classList.add('visible');
  tbody.innerHTML = leads.map(function(lead, i) {
    const date = new Date(lead.timestamp);
    const dateStr = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return '<tr>' +
           '<td>' + (i + 1) + '</td>' +
           '<td>' + escapeHtml(lead.name) + '</td>' +
           '<td>' + escapeHtml(lead.email) + '</td>' +
           '<td>' + escapeHtml(lead.phone) + '</td>' +
           '<td>' + dateStr + '</td>' +
           '<td>' + (lead.videoTime || '-') + '</td>' +
           '</tr>';
  }).join('');
}

function clearStoredLeads() {
  localStorage.removeItem(LEADS_STORAGE_KEY);
  displayStoredLeads();
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}


document.addEventListener('DOMContentLoaded', initLeadForm);
