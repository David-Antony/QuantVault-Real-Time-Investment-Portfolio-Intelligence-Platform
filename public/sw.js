/**
 * QuantVault Service Worker
 * Enables offline access, background sync, and PWA installation.
 */

const CACHE_NAME = 'quantvault-v1';
const STATIC_ASSETS = [
  '/login.html',
  '/signup.html',
  '/css/styles.css',
  '/js/api/apiClient.js',
  '/js/api/authApi.js',
  '/js/auth.js',
  '/images/futuristic_fintech_bg.png',
  '/manifest.json'
];

// ── Install: cache all static assets ──────────────────────────
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
});

// ── Activate: delete old caches ────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// ── Fetch: network-first with cache fallback ───────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Skip non-GET and API requests (always network)
  if (request.method !== 'GET' || request.url.includes('/api/')) return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});

// ── Push Notifications ─────────────────────────────────────────
self.addEventListener('push', (event) => {
  if (!event.data) return;

  let data;
  try { data = event.data.json(); }
  catch { data = { title: 'QuantVault Alert', body: event.data.text() }; }

  const options = {
    body: data.body || 'A price alert was triggered.',
    icon: '/images/futuristic_fintech_bg.png',
    badge: '/images/futuristic_fintech_bg.png',
    tag: data.tag || 'qv-alert',
    data: { url: data.url || '/alerts.html' },
    actions: [
      { action: 'view', title: '📊 View Alerts' },
      { action: 'dismiss', title: 'Dismiss' }
    ],
    vibrate: [200, 100, 200]
  };

  event.waitUntil(
    self.registration.showNotification(data.title || '🔔 QuantVault Alert', options)
  );
});

// ── Notification click ──────────────────────────────────────────
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'dismiss') return;

  const url = event.notification.data?.url || '/alerts.html';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      const existing = windowClients.find((w) => w.url.includes(url) && 'focus' in w);
      if (existing) return existing.focus();
      return clients.openWindow(url);
    })
  );
});
