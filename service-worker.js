/**
 * HPProcessServerPapers (HPPSP) - Offline Service Worker
 * Cache versioning, offline resilience, and cache invalidation.
 * Pure Vanilla JavaScript (ES6+), zero external runtime dependencies.
 */

const CACHE_NAME = 'hppsp-v1.0.0';

// Essential static resources to pre-cache on install
const PRECACHE_ASSETS = [
  './',
  'index.html',
  '404.html',
  'favicon.svg',
  'manifest.webmanifest',
  'assets/css/style.css',
  'assets/css/responsive.css',
  'assets/css/animations.css',
  'assets/css/print.css',
  'assets/js/config.js',
  'assets/js/storage.js',
  'assets/js/main.js',
  'assets/js/exam-engine.js',
  'assets/js/question-bank.js',
  'assets/js/dashboard.js',
  'assets/js/search.js',
  'assets/images/logo-icon.svg',
  'assets/images/logo-primary.svg',
  'assets/images/logo-dark.svg',
  'data/questions/hp-process-server-2022.json',
  'data/questions/hp-gk.json',
  'data/questions/general-knowledge.json',
  'data/questions/mathematics.json',
  'data/questions/general-science.json',
  'data/questions/english.json',
  'data/questions/hindi.json',
  'data/questions/reasoning.json',
  'data/papers.json',
  'data/syllabus.json',
  'data/updates.json'
];

// Install Event
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(PRECACHE_ASSETS).catch(err => {
        console.warn('Some optional assets failed to precache:', err);
      });
    })
  );
});

// Activate Event - Clean up stale caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name.startsWith('hppsp-') && name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Network first with Cache fallback for JSON/HTML, Cache first for images/fonts
self.addEventListener('fetch', event => {
  // Only handle GET requests and http/https protocols
  if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) {
    return;
  }

  const url = new URL(event.request.url);

  // Strategy: Stale-While-Revalidate for app assets
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      const fetchPromise = fetch(event.request).then(networkResponse => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Fallback for navigation requests when offline
        if (event.request.mode === 'navigate') {
          return caches.match('404.html');
        }
      });

      return cachedResponse || fetchPromise;
    })
  );
});
