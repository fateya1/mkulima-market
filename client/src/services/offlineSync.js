import { openDB } from 'idb';
// import { store } from '../store';
// import { syncListings, syncTransactions } from '../store/slices/offlineDataSlice';
import { api } from '../services/api';

// Initialize IndexedDB
const initDB = async () => {
  return openDB('mkulimaMarketDB', 1, {
    upgrade(db) {
      // Create object stores
      if (!db.objectStoreNames.contains('listings')) {
        db.createObjectStore('listings', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('transactions')) {
        db.createObjectStore('transactions', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('syncQueue')) {
        db.createObjectStore('syncQueue', { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains('userData')) {
        db.createObjectStore('userData', { keyPath: 'id' });
      }
    }
  });
};

// Save data for offline access
export const saveOfflineData = async (storeName, data) => {
  const db = await initDB();
  const tx = db.transaction(storeName, 'readwrite');
  const store = tx.objectStore(storeName);

  if (Array.isArray(data)) {
    for (const item of data) {
      await store.put(item);
    }
  } else {
    await store.put(data);
  }

  await tx.done;
};

// Get offline data
export const getOfflineData = async (storeName, key = null) => {
  const db = await initDB();
  const tx = db.transaction(storeName, 'readonly');
  const store = tx.objectStore(storeName);

  if (key) {
    return store.get(key);
  } else {
    return store.getAll();
  }
};

// Add operation to sync queue
export const addToSyncQueue = async (operation) => {
  const db = await initDB();
  const tx = db.transaction('syncQueue', 'readwrite');
  const store = tx.objectStore('syncQueue');
  await store.add({
    ...operation,
    timestamp: new Date().toISOString(),
    synced: false
  });
  await tx.done;
};

// Synchronize offline data when online
export const synchronizeData = async () => {
  if (!navigator.onLine) return;

  const db = await initDB();
  const queue = await db.getAll('syncQueue');
  const pendingOperations = queue.filter(op => !op.synced);

  for (const operation of pendingOperations) {
    try {
      const { type, endpoint, data, method, id } = operation;

      // Handle different operation types
      if (type === 'listing') {
        if (method === 'POST') {
          await store.dispatch(api.endpoints.createListing.initiate(data));
        } else if (method === 'PUT') {
          await store.dispatch(api.endpoints.updateListing.initiate({ id, ...data }));
        }
      } else if (type === 'transaction') {
        if (method === 'POST') {
          await store.dispatch(api.endpoints.createTransaction.initiate(data));
        } else if (method === 'PUT') {
          await store.dispatch(api.endpoints.updateTransaction.initiate({ id, ...data }));
        }
      }

      // Mark as synced
      const tx = db.transaction('syncQueue', 'readwrite');
      const store = tx.objectStore('syncQueue');
      const item = await store.get(operation.id);
      await store.put({ ...item, synced: true });
      await tx.done;
    } catch (error) {
      console.error('Sync error:', error);
      // Will retry on next sync
    }
  }

  // Fetch latest data after sync
  await store.dispatch(syncListings());
  await store.dispatch(syncTransactions());
};

// Listen for online status and sync when connection is restored
export const initOfflineSync = () => {
  window.addEventListener('online', synchronizeData);
};
