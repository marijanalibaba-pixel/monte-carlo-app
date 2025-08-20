// Vrlo jednostavan SW: offline fallback + keširanje osnovnih fajlova
const CACHE = "mc-app-v1";
const ASSETS = [
  "/", 
  "/index.html",
  "/offline.html",
  "/manifest.webmanifest"
];

self.addEventListener("install", evt => {
  evt.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", evt => {
  evt.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => (k === CACHE ? null : caches.delete(k))))
    )
  );
  self.clients.claim();
});

// Network-first za navigaciju, fallback na offline.html
self.addEventListener("fetch", evt => {
  const req = evt.request;
  if (req.mode === "navigate") {
    evt.respondWith(
      fetch(req).catch(() => caches.match("/offline.html"))
    );
    return;
  }
  // Cache-first za ostalo
  evt.respondWith(
    caches.match(req).then(cached => cached || fetch(req))
  );
});