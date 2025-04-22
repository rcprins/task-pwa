const CACHE_NAME = 'task-pwa-cache-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/main-JCMNBBMW.js',
  '/manifest.webmanifest',
  '/favicon.ico'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request);
    })
  );
});

self.addEventListener('sync', event => {
    if (event.tag === 'sync-notes') {
      event.waitUntil(syncTaskEvents());
    }
  });
  
  async function syncTaskEvents() {
    debugger;
    // const db = await openDB(); // Implement opening IndexedDB
    // const unsynced = await db.getAll('outbox'); // Replace with your logic
  
    // for (const note of unsynced) {
    //   try {
    //     await fetch('/api/notes', {
    //       method: 'POST',
    //       body: JSON.stringify(note),
    //       headers: { 'Content-Type': 'application/json' }
    //     });
    //     await db.delete('outbox', note.id); // Clear after sync
    //   } catch (err) {
    //     console.error('[SW] Sync failed', err);
    //   }
    // }
  }
  