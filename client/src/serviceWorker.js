/* eslint-disable no-restricted-globals */

// This service worker can be customized for the MkulimaMarket application
// based on the requirements outlined in the documentation

// Import Workbox
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js');

// Use with precache injection
workbox.precaching.precacheAndRoute(self.__WB_MANIFEST || []);

// Cache the Google Fonts stylesheets with a stale-while-revalidate strategy
workbox.routing.registerRoute(
  /^https:\/\/fonts\.googleapis\.com/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'google-fonts-stylesheets',
  })
);

// Cache the underlying font files with a cache-first strategy for 1 year
workbox.routing.registerRoute(
  /^https:\/\/fonts\.gstatic\.com/,
  new workbox.strategies.CacheFirst({
    cacheName: 'google-fonts-webfonts',
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.ExpirationPlugin({
        maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
        maxEntries: 30,
      }),
    ],
  })
);

// Cache images with a cache-first strategy
workbox.routing.registerRoute(
  /\.(?:png|gif|jpg|jpeg|webp|svg)$/,
  new workbox.strategies.CacheFirst({
    cacheName: 'images',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
      }),
    ],
  })
);

// Cache static assets (JS and CSS) with a stale-while-revalidate strategy
workbox.routing.registerRoute(
  /\.(?:js|css)$/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'static-resources',
  })
);

// Cache the Mapbox API requests (used for location services)
workbox.routing.registerRoute(
  /^https:\/\/api\.mapbox\.com\/*/,
  new workbox.strategies.NetworkFirst({
    cacheName: 'mapbox',
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({ statuses: [0, 200] }),
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 30,
        maxAgeSeconds: 7 * 24 * 60 * 60, // 1 week
      }),
    ],
  })
);

// Cache the API requests
workbox.routing.registerRoute(
  /^https:\/\/api\.mkulimamarket\.co\.ke\/v1\//,
  new workbox.strategies.NetworkFirst({
    cacheName: 'api-responses',
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 24 * 60 * 60, // 24 hours
      }),
    ],
  })
);

// Serve cached content for the app shell (HTML and offline page)
workbox.routing.registerRoute(
  /\/(?:index|offline)\.html$/,
  new workbox.strategies.NetworkFirst({
    cacheName: 'pages',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 10,
        maxAgeSeconds: 24 * 60 * 60, // 24 hours
      }),
    ],
  })
);

// Default handler for navigation requests
workbox.routing.setDefaultHandler(
  new workbox.strategies.NetworkFirst({
    cacheName: 'default-cache',
  })
);

// Fallback for all navigation requests if they fail
workbox.routing.setCatchHandler(async ({ event }) => {
  if (event.request.destination === 'document') {
    return workbox.precaching.matchPrecache('/offline.html');
  }
  
  return Response.error();
});

// Background sync for offline transactions
self.addEventListener('sync', (event) => {
  if (event.tag === 'syncPendingTransactions') {
    event.waitUntil(syncPendingTransactions());
  }
});

async function syncPendingTransactions() {
  const db = await openDatabase();
  const pendingTransactions = await getPendingTransactions(db);
  
  for (const transaction of pendingTransactions) {
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transaction.data),
      });
      
      if (response.ok) {
        await markTransactionComplete(db, transaction.id);
      }
    } catch (error) {
      console.error('Failed to sync transaction', error);
    }
  }
}

async function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('MkulimaMarketDB', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('pendingTransactions')) {
        db.createObjectStore('pendingTransactions', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

async function getPendingTransactions(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('pendingTransactions', 'readonly');
    const store = transaction.objectStore('pendingTransactions');
    const request = store.getAll();
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

async function markTransactionComplete(db, id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('pendingTransactions', 'readwrite');
    const store = transaction.objectStore('pendingTransactions');
    const request = store.delete(id);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

// Handle push notifications
self.addEventListener('push', (event) => {
  const data = event.data.json();
  
  const options = {
    body: data.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/',
    },
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const urlToOpen = event.notification.data.url;
  
  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    })
    .then((windowClients) => {
      // Check if there is already a window/tab open with the target URL
      const matchingClient = windowClients.find((windowClient) => {
        return windowClient.url === urlToOpen;
      });
      
      // If so, focus on it
      if (matchingClient) {
        return matchingClient.focus();
      }
      
      // If not, open a new window/tab
      return clients.openWindow(urlToOpen);
    })
  );
});
