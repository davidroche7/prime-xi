/* PRIME XI service worker — offline support for a fully static site.
 * Pages: network-first with cache fallback. Assets: cache-first (Next.js
 * assets are content-hashed, so stale entries are impossible).
 * ponytail: no precache manifest — offline covers previously visited pages;
 * add a build-time precache list if store review demands cold-start offline. */
const CACHE = "prime-xi-v1";

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (e) => {
  const { request } = e;
  if (request.method !== "GET" || new URL(request.url).origin !== location.origin) return;

  const cachePut = (res) => {
    if (res.ok) {
      const copy = res.clone();
      caches.open(CACHE).then((c) => c.put(request, copy));
    }
    return res;
  };

  if (request.mode === "navigate") {
    e.respondWith(fetch(request).then(cachePut).catch(() => caches.match(request)));
  } else {
    e.respondWith(caches.match(request).then((hit) => hit || fetch(request).then(cachePut)));
  }
});
