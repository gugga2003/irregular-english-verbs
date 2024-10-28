const CACHE_NAME = 'verbs-cache-v1';
// Reemplaza 'english-verbs-pwa' con el nombre de tu repositorio
const REPO_NAME = '/irregular-english-verbs';

const urlsToCache = [
  REPO_NAME + '/',
  REPO_NAME + '/index.html',
  REPO_NAME + '/manifest.json',
  REPO_NAME + '/icons/icon-192x192.png',
  REPO_NAME + '/icons/icon-256x256.png',
  REPO_NAME + '/icons/icon-384x384.png',
  REPO_NAME + '/icons/icon-512x512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request)
          .then((response) => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
            return response;
          });
      })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
