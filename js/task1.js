

'use strict';

function initCarousel3D() {
  const wrapper = document.querySelector('.carousel-3d-wrapper');
  const cards = document.querySelectorAll('.card-3d');
  const nextBtn = document.getElementById('carousel-3d-next');
  
  if (cards.length === 0) {
    console.error('[Task 1] Carousel cards not found!');
    return;
  }
  console.log('[Task 1] Carousel initialized with', cards.length, 'cards');

  let currentIndex = 1; 
  let autoPlayInterval = null;
  const AUTO_PLAY_DELAY = 3000; 

  function updateCarousel() {
    cards.forEach((card, index) => {
      
      let diff = index - currentIndex;
      
      if (diff < -1) diff += cards.length;
      if (diff > 1) diff -= cards.length;

      
      card.className = 'card-3d'; 
      
      if (diff === 0) {
        card.classList.add('active');
      } else if (diff === -1) {
        card.classList.add('prev');
      } else if (diff === 1) {
        card.classList.add('next');
      } else if (diff < -1) {
        card.classList.add('hidden-left');
      } else if (diff > 1) {
        card.classList.add('hidden-right');
      }
    });
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % cards.length;
    updateCarousel();
  }

  function startAutoPlay() {
    stopAutoPlay();
    autoPlayInterval = setInterval(nextSlide, AUTO_PLAY_DELAY);
    console.log('[Task 1] Autoplay started');
  }

  function stopAutoPlay() {
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
      autoPlayInterval = null;
      console.log('[Task 1] Autoplay paused');
    }
  }

  const prevBtn = document.getElementById('carousel-3d-prev');

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      startAutoPlay(); 
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + cards.length) % cards.length;
      updateCarousel();
      startAutoPlay(); 
    });
  }

  
  cards.forEach((card, index) => {
    card.addEventListener('click', () => {
      if (index !== currentIndex) {
        currentIndex = index;
        updateCarousel();
        startAutoPlay(); 
      }
    });
  });

  
  updateCarousel();
  
  
  setTimeout(startAutoPlay, 500);
}


if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCarousel3D);
} else {
  initCarousel3D();
}
