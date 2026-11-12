/**
 * HPProcessServerPapers (HPPSP) - Centralized Configuration & Base Path Resolver
 * Supports both GitHub Pages project URLs (/HPProcessServerPapers/) and Custom Domains (/)
 */
(function(window) {
  'use strict';

  // Determine base path dynamically from window.location
  function detectBasePath() {
    const pathname = window.location.pathname;
    // Check if hosted under a repository subpath (e.g. /HPProcessServerPapers/...)
    const repoMatch = pathname.match(/^\/([^\/]+)\//);
    
    // If running on github.io and has a repo folder name
    if (window.location.hostname.endsWith('github.io') && repoMatch) {
      return '/' + repoMatch[1] + '/';
    }
    
    // Check if the path starts with /hp-high-court-process-server-papers/ or /HPProcessServerPapers/
    if (pathname.toLowerCase().startsWith('/hp-high-court-process-server-papers/')) {
      return '/hp-high-court-process-server-papers/';
    }
    if (pathname.toLowerCase().startsWith('/hpprocessserverpapers/')) {
      return '/HPProcessServerPapers/';
    }

    // Default to root
    return '/';
  }

  const BASE_PATH = detectBasePath();

  const HPPSP_CONFIG = {
    siteName: 'HPProcessServerPapers',
    brandShort: 'HPPSP',
    basePath: BASE_PATH,
    productionDomain: 'https://xpert4cyber.github.io/hp-high-court-process-server-papers',
    canonicalBase: 'https://xpert4cyber.github.io/hp-high-court-process-server-papers/',
    defaultLanguage: 'en',
    
    // Resolver for assets and routes
    resolvePath: function(relativePath) {
      if (!relativePath) return BASE_PATH;
      // Strip leading slashes to avoid root override
      const cleanPath = relativePath.replace(/^\/+/, '');
      return BASE_PATH + cleanPath;
    },

    // Theme Management
    getTheme: function() {
      return localStorage.getItem('hppsp_theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    },

    setTheme: function(theme) {
      localStorage.setItem('hppsp_theme', theme);
      document.documentElement.setAttribute('data-theme', theme);
    },

    initTheme: function() {
      const current = this.getTheme();
      document.documentElement.setAttribute('data-theme', current);
    }
  };

  // Initialize theme immediately to prevent flashing
  HPPSP_CONFIG.initTheme();

  window.HPPSP_CONFIG = HPPSP_CONFIG;
})(window);
