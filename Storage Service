/**
 * Storage Service for MkulimaMarket
 * 
 * Provides a consistent interface for data storage with fallbacks:
 * 1. LocalStorage (primary)
 * 2. SessionStorage (fallback if LocalStorage is unavailable)
 * 3. Memory storage (fallback if web storage is unavailable)
 * 
 * This ensures data persistence works across various devices and browsers,
 * which is essential for the rural context of MkulimaMarket users.
 */

// Storage prefix to avoid conflicts with other applications
const STORAGE_PREFIX = 'mkulima_market_';

class StorageService {
  constructor() {
    this.localStorage = this.isLocalStorageAvailable() ? window.localStorage : null;
    this.sessionStorage = this.isSessionStorageAvailable() ? window.sessionStorage : null;
    
    // Memory fallback if both localStorage and sessionStorage are unavailable
    this.memoryStorage = {};
    
    // Set storage priority
    this.storageOptions = [
      { type: 'localStorage', storage: this.localStorage },
      { type: 'sessionStorage', storage: this.sessionStorage },
      { type: 'memoryStorage', storage: this.memoryStorage }
    ];
  }

  /**
   * Check if localStorage is available
   * @returns {boolean} True if available
   * @private
   */
  isLocalStorageAvailable() {
    try {
      const testKey = '__storage_test__';
      window.localStorage.setItem(testKey, testKey);
      window.localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Check if sessionStorage is available
   * @returns {boolean} True if available
   * @private
   */
  isSessionStorageAvailable() {
    try {
      const testKey = '__storage_test__';
      window.sessionStorage.setItem(testKey, testKey);
      window.sessionStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Get the first available storage option
   * @returns {Object} The storage object to use
   * @private
   */
  getStorage() {
    for (const option of this.storageOptions) {
      if (option.storage) {
        return option;
      }
    }
    // This should never happen as memoryStorage should always be available
    return { type: 'memoryStorage', storage: this.memoryStorage };
  }

  /**
   * Get prefixed key
   * @param {string} key - Original key
   * @returns {string} Prefixed key
   * @private
   */
  getPrefixedKey(key) {
    return `${STORAGE_PREFIX}${key}`;
  }

  /**
   * Set an item in storage
   * @param {string} key - Storage key
   * @param {string} value - Value to store
   * @returns {boolean} Success status
   */
  setItem(key, value) {
    const prefixedKey = this.getPrefixedKey(key);
    const { type, storage } = this.getStorage();
    
    try {
      if (type === 'memoryStorage') {
        storage[prefixedKey] = value;
      } else {
        storage.setItem(prefixedKey, value);
      }
      return true;
    } catch (error) {
      console.error(`Storage error (${type}):`, error);
      
      // If primary storage fails, try fallbacks
      if (type === 'localStorage' && this.sessionStorage) {
        try {
          this.sessionStorage.setItem(prefixedKey, value);
          return true;
        } catch (sessError) {
          this.memoryStorage[prefixedKey] = value;
          return true;
        }
      } else if (type === 'sessionStorage') {
        this.memoryStorage[prefixedKey] = value;
        return true;
      }
      
      return false;
    }
  }

  /**
   * Get an item from storage
   * @param {string} key - Storage key
   * @returns {string|null} Stored value or null if not found
   */
  getItem(key) {
    const prefixedKey = this.getPrefixedKey(key);
    
    // Try localStorage first
    if (this.localStorage) {
      const value = this.localStorage.getItem(prefixedKey);
      if (value !== null) return value;
    }
    
    // Try sessionStorage next
    if (this.sessionStorage) {
      const value = this.sessionStorage.getItem(prefixedKey);
      if (value !== null) return value;
    }
    
    // Finally, try memory storage
    if (this.memoryStorage[prefixedKey] !== undefined) {
      return this.memoryStorage[prefixedKey];
    }
    
    return null;
  }

  /**
   * Remove an item from storage
   * @param {string} key - Storage key
   * @returns {boolean} Success status
   */
  removeItem(key) {
    const prefixedKey = this.getPrefixedKey(key);
    let success = false;
    
    // Remove from all storage types to ensure it's completely gone
    if (this.localStorage) {
      try {
        this.localStorage.removeItem(prefixedKey);
        success = true;
      } catch (error) {
        console.error('localStorage removeItem error:', error);
      }
    }
    
    if (this.sessionStorage) {
      try {
        this.sessionStorage.removeItem(prefixedKey);
        success = true;
      } catch (error) {
        console.error('sessionStorage removeItem error:', error);
      }
    }
    
    if (this.memoryStorage[prefixedKey] !== undefined) {
      delete this.memoryStorage[prefixedKey];
      success = true;
    }
    
    return success;
  }

  /**
   * Clear all storage (only clears keys with our prefix)
   * @returns {boolean} Success status
   */
  clear() {
    let success = false;
    
    if (this.localStorage) {
      try {
        // Only remove items with our prefix
        Object.keys(this.localStorage)
          .filter(key => key.startsWith(STORAGE_PREFIX))
          .forEach(key => this.localStorage.removeItem(key));
        success = true;
      } catch (error) {
        console.error('localStorage clear error:', error);
      }
    }
    
    if (this.sessionStorage) {
      try {
        // Only remove items with our prefix
        Object.keys(this.sessionStorage)
          .filter(key => key.startsWith(STORAGE_PREFIX))
          .forEach(key => this.sessionStorage.removeItem(key));
        success = true;
      } catch (error) {
        console.error('sessionStorage clear error:', error);
      }
    }
    
    // Clear memory storage
    this.memoryStorage = {};
    success = true;
    
    return success;
  }

  /**
   * Get all storage keys (with prefix removed)
   * @returns {string[]} Array of keys
   */
  getKeys() {
    const keys = new Set();
    const prefixLength = STORAGE_PREFIX.length;
    
    // Get keys from localStorage
    if (this.localStorage) {
      try {
        for (let i = 0; i < this.localStorage.length; i++) {
          const key = this.localStorage.key(i);
          if (key && key.startsWith(STORAGE_PREFIX)) {
            keys.add(key.substring(prefixLength));
          }
        }
      } catch (error) {
        console.error('localStorage getKeys error:', error);
      }
    }
    
    // Get keys from sessionStorage
    if (this.sessionStorage) {
      try {
        for (let i = 0; i < this.sessionStorage.length; i++) {
          const key = this.sessionStorage.key(i);
          if (key && key.startsWith(STORAGE_PREFIX)) {
            keys.add(key.substring(prefixLength));
          }
        }
      } catch (error) {
        console.error('sessionStorage getKeys error:', error);
      }
    }
    
    // Get keys from memoryStorage
    Object.keys(this.memoryStorage)
      .filter(key => key.startsWith(STORAGE_PREFIX))
      .forEach(key => keys.add(key.substring(prefixLength)));
    
    return Array.from(keys);
  }

  /**
   * Store an object as JSON
   * @param {string} key - Storage key
   * @param {Object} value - Object to store
   * @returns {boolean} Success status
   */
  setObject(key, value) {
    try {
      const jsonValue = JSON.stringify(value);
      return this.setItem(key, jsonValue);
    } catch (error) {
      console.error('Error stringifying object:', error);
      return false;
    }
  }

  /**
   * Retrieve a stored JSON object
   * @param {string} key - Storage key
   * @param {Object} defaultValue - Default value if not found
   * @returns {Object} Parsed object or default value
   */
  getObject(key, defaultValue = null) {
    const value = this.getItem(key);
    
    if (value === null) {
      return defaultValue;
    }
    
    try {
      return JSON.parse(value);
    } catch (error) {
      console.error('Error parsing stored JSON:', error);
      return defaultValue;
    }
  }
}

// Create singleton instance
const storageService = new StorageService();
export { storageService };
