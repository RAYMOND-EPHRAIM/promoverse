self.addEventListener('install', (e) => {
    console.log('[ServiceWorker] Install');
    self.skipWaiting();
  });
  
  self.addEventListener('activate', (e) => {
    console.log('[ServiceWorker] Activate');
    return self.clients.claim();
  });
  
  self.addEventListener('fetch', (event) => {
    event.respondWith(
      caches.open('promoverse-cache').then((cache) =>
        cache.match(event.request).then((response) =>
          response || fetch(event.request).then((resp) => {
            cache.put(event.request, resp.clone());
            return resp;
          })
        )
      )
    );
  });
  