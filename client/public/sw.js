self.addEventListener('install', (e) => self.skipWaiting());
self.addEventListener('activate', (e) => self.clients.claim());

// Optional no-op fetch keeps things simple. Add real caching later if you want offline.
self.addEventListener('fetch', () => {});