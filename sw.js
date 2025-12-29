const CACHE_NAME = 'studentscan-v2'; // Changed to v2 to force update
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon.png'
];

// Install Service Worker
self.addEventListener('install', (event) => {
  // Forces the waiting service worker to become the active service worker
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching assets for v2');
      return cache.addAll(ASSETS);
    })
  );
});

// Activate and Clean Up Old Caches (v1 is deleted here)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    }).then(() => self.clients.claim()) // Takes control of the page immediately
  );
});

// Fetch logic
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
