const CACHE = 'orbit-shell-v5';
const ASSETS = ['./', './index.html', './manifest.json', './icon.svg', './settings.js', './supabase-config.js'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith('orbit-shell-') && key !== CACHE).map(key => caches.delete(key)));
    await self.clients.claim();
    const scopePath = new URL(self.registration.scope).pathname;
    const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    const appWindows = windows.filter(client => {
      const url = new URL(client.url);
      return url.origin === self.location.origin && url.pathname.startsWith(scopePath);
    });
    await Promise.all(appWindows.map(client => client.navigate(client.url).catch(() => null)));
  })());
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith(fetch(event.request).then(response => {
    if (response.ok) {
      const copy = response.clone();
      caches.open(CACHE).then(cache => cache.put(event.request, copy));
    }
    return response;
  }).catch(() => caches.match(event.request)));
});