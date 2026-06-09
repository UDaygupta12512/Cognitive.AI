

'use strict';


function initNavigation() {
  const navTabs = document.querySelector('.nav-tabs');
  const navIndicator = document.querySelector('.nav-indicator');
  const tabs = document.querySelectorAll('.nav-tab');
  const sections = document.querySelectorAll('.task-section');
  const hamburger = document.querySelector('.nav-hamburger');
  const mobileMenu = document.querySelector('.nav-mobile-menu');
  const mobileTabs = document.querySelectorAll('.mobile-tab');

  
  function moveIndicator(tab) {
    if (!navIndicator || !navTabs) return;

    const navRect = navTabs.getBoundingClientRect();
    const tabRect = tab.getBoundingClientRect();

    const offsetLeft = tabRect.left - navRect.left;
    navIndicator.style.width = tabRect.width + 'px';
    navIndicator.style.transform = 'translateX(' + offsetLeft + 'px)';
  }

  
  function activateTab(targetId) {
    
    tabs.forEach(function(t) { t.classList.remove('active'); });
    mobileTabs.forEach(function(t) { t.classList.remove('active'); });
    sections.forEach(function(s) { s.classList.remove('active'); });

    
    const activeTab = document.querySelector('.nav-tab[data-target="' + targetId + '"]');
    const activeMobileTab = document.querySelector('.mobile-tab[data-target="' + targetId + '"]');
    const activeSection = document.getElementById(targetId);

    if (activeTab) {
      activeTab.classList.add('active');
      moveIndicator(activeTab);
    }
    if (activeMobileTab) {
      activeMobileTab.classList.add('active');
    }
    if (activeSection) {
      activeSection.classList.add('active');
    }

    
    if (hamburger && mobileMenu) {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    }

    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  

  
  tabs.forEach(function(tab) {
    tab.addEventListener('click', function() {
      const target = tab.getAttribute('data-target');
      if (target) activateTab(target);
    });
  });

  
  mobileTabs.forEach(function(tab) {
    tab.addEventListener('click', function() {
      const target = tab.getAttribute('data-target');
      if (target) activateTab(target);
    });
  });

  
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function() {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });
  }

  
  const initialActive = document.querySelector('.nav-tab.active');
  if (initialActive) {
    moveIndicator(initialActive);
  }

  
  window.addEventListener('resize', function() {
    const currentActive = document.querySelector('.nav-tab.active');
    if (currentActive) {
      moveIndicator(currentActive);
    }
  });
}


document.addEventListener('DOMContentLoaded', initNavigation);
