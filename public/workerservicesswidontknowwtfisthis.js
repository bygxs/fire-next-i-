/* // this maybe good for chache but it unon /// <reference lib="webworker" />
const CACHE_NAME = 'your-app-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/styles.css',
    // Add other files you want to cache
];
self.addEventListener('install', (event) => {
    event.waitUntil(caches.open(CACHE_NAME)
        .then(cache => cache.addAll(urlsToCache)));
});
self.addEventListener('fetch', (event) => {
    event.respondWith(caches.match(event.request)
        .then(response => response || fetch(event.request)));
});
self.addEventListener('activate', (event) => {
    event.waitUntil(caches.keys().then(cacheNames => {
        return Promise.all(cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
                return caches.delete(cacheName);
            }
        }));
    }));
});
export {};
 */