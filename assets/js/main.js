/**
 * HPProcessServerPapers (HPPSP) - Global Website Script
 * Handles navigation, theme toggling, search modal, toast alerts, and PWA registration.
 */
(function(window, document) {
  'use strict';

  function initAll() {
    initThemeToggle();
    initMobileNav();
    initSearchShortcut();
    initBackToTop();
    initServiceWorker();
    updateFooterYear();
  }

  // Ensure scripts run whether DOMContentLoaded has already fired or not
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  // -------------------------------------------------------------
  // Theme Toggler
  // -------------------------------------------------------------
  function initThemeToggle() {
    const toggleBtn = document.getElementById('theme-toggle');
    if (!toggleBtn) return;

    function updateIcon(theme) {
      toggleBtn.innerHTML = theme === 'dark' 
        ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>'
        : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
      toggleBtn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    }

    const currentTheme = window.HPPSP_CONFIG ? window.HPPSP_CONFIG.getTheme() : 'light';
    updateIcon(currentTheme);

    toggleBtn.addEventListener('click', function() {
      const active = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      if (window.HPPSP_CONFIG) {
        window.HPPSP_CONFIG.setTheme(active);
      } else {
        document.documentElement.setAttribute('data-theme', active);
        localStorage.setItem('hppsp_theme', active);
      }
      updateIcon(active);
      showToast('Theme updated to ' + active + ' mode');
    });
  }

  // -------------------------------------------------------------
  // Mobile Navigation Menu
  // -------------------------------------------------------------
  function initMobileNav() {
    const navToggle = document.getElementById('nav-toggle');
    const mainNav = document.getElementById('main-nav');
    if (!navToggle || !mainNav) return;

    navToggle.addEventListener('click', function() {
      const isOpen = mainNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!mainNav.contains(e.target) && !navToggle.contains(e.target) && mainNav.classList.contains('open')) {
        mainNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Mobile dropdown toggle
    const dropdownToggles = mainNav.querySelectorAll('.dropdown-toggle');
    dropdownToggles.forEach(btn => {
      btn.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          const parent = btn.closest('.nav-dropdown');
          if (parent) parent.classList.toggle('active');
        }
      });
    });
  }

  // -------------------------------------------------------------
  // Keyboard Shortcut for Search (Ctrl+K or /)
  // -------------------------------------------------------------
  function initSearchShortcut() {
    window.addEventListener('keydown', function(e) {
      if ((e.ctrlKey && e.key === 'k') || (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA')) {
        e.preventDefault();
        const searchInput = document.getElementById('global-search') || document.querySelector('.search-input');
        if (searchInput) {
          searchInput.focus();
        } else {
          // Open search modal if present
          const searchModal = document.getElementById('search-modal');
          if (searchModal) searchModal.classList.add('open');
        }
      }
    });
  }

  // -------------------------------------------------------------
  // Toast Notification
  // -------------------------------------------------------------
  window.showToast = function(message, duration) {
    duration = duration || 3000;
    let toast = document.getElementById('hppsp-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'hppsp-toast';
      toast.style.cssText = 'position:fixed;bottom:24px;right:24px;background:#0f172a;color:#ffffff;padding:12px 20px;border-radius:10px;box-shadow:0 10px 25px rgba(0,0,0,0.3);z-index:9999;font-weight:600;font-size:0.9rem;border-left:4px solid #10b981;transition:all 0.3s ease;opacity:0;transform:translateY(20px);';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';

    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(function() {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(20px)';
    }, duration);
  };

  // -------------------------------------------------------------
  // Back to Top / Go to Top Controls
  // -------------------------------------------------------------
  function getScrollTop() {
    return window.pageYOffset || 
           (document.documentElement && document.documentElement.scrollTop) || 
           (document.body && document.body.scrollTop) || 
           (window.scrollY !== undefined ? window.scrollY : 0);
  }

  function scrollToTop(e) {
    if (e) {
      if (typeof e.preventDefault === 'function') e.preventDefault();
      if (typeof e.stopPropagation === 'function') e.stopPropagation();
    }

    // Modern smooth scroll on window
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    } catch (err) {
      window.scrollTo(0, 0);
    }

    // Also trigger on documentElement / body for broad browser compatibility
    try {
      if (document.documentElement && typeof document.documentElement.scrollTo === 'function') {
        document.documentElement.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      }
    } catch (err) {
      if (document.documentElement) document.documentElement.scrollTop = 0;
    }

    try {
      if (document.body && typeof document.body.scrollTo === 'function') {
        document.body.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      }
    } catch (err) {
      if (document.body) document.body.scrollTop = 0;
    }

    // Safety fallback: if after 350ms the page hasn't moved to top, jump
    setTimeout(function() {
      if (getScrollTop() > 5) {
        window.scrollTo(0, 0);
        if (document.documentElement) document.documentElement.scrollTop = 0;
        if (document.body) document.body.scrollTop = 0;
      }
    }, 400);

    return false;
  }

  // Expose globally so inline onclick handlers can always invoke it
  window.scrollToTop = scrollToTop;

  function initBackToTop() {
    // 1. Global event delegation: catches ANY click on Go to Top triggers
    document.addEventListener('click', function(e) {
      const trigger = e.target.closest('.footer-go-top-btn, #footer-go-to-top, #back-to-top, [data-action="go-to-top"], a[href="#top"]');
      if (trigger) {
        scrollToTop(e);
      }
    });

    // 2. Ensure floating back-to-top button exists in DOM
    let floatingBtn = document.getElementById('back-to-top');
    if (!floatingBtn) {
      floatingBtn = document.createElement('button');
      floatingBtn.id = 'back-to-top';
      floatingBtn.type = 'button';
      floatingBtn.setAttribute('aria-label', 'Back to top of page');
      floatingBtn.setAttribute('title', 'Go to top');
      floatingBtn.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="18 15 12 9 6 15"></polyline></svg>';
      document.body.appendChild(floatingBtn);
    }

    // 3. Scroll listener to reveal floating button
    function updateFloatingVisibility() {
      if (getScrollTop() > 200) {
        floatingBtn.classList.add('visible');
      } else {
        floatingBtn.classList.remove('visible');
      }
    }

    let scrollRaf;
    window.addEventListener('scroll', function() {
      if (!scrollRaf) {
        scrollRaf = requestAnimationFrame(function() {
          scrollRaf = null;
          updateFloatingVisibility();
        });
      }
    }, { passive: true });

    window.addEventListener('resize', updateFloatingVisibility, { passive: true });
    updateFloatingVisibility();
  }

  // -------------------------------------------------------------
  // Footer Year Sync
  // -------------------------------------------------------------
  function updateFooterYear() {
    const yearEl = document.getElementById('current-year');
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  }

  // -------------------------------------------------------------
  // PWA Service Worker Registration
  // -------------------------------------------------------------
  function initServiceWorker() {
    if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
      const basePath = window.HPPSP_CONFIG ? window.HPPSP_CONFIG.basePath : '/';
      const swUrl = basePath + 'service-worker.js';
      navigator.serviceWorker.register(swUrl, { scope: basePath })
        .then(function(reg) {
          console.log('HPPSP Service Worker registered successfully at scope:', reg.scope);
        })
        .catch(function(err) {
          console.warn('Service Worker registration skipped or failed:', err);
        });
    }
  }
})(window, document);
