// listingsApi.js - API service for managing product listings

/**
 * API service for handling product listings
 * Implements the functionality described in the MkulimaMarket platform
 */
class ListingsApi {
  constructor(baseUrl = 'https://api.mkulimamarket.co.ke/v1') {
    this.baseUrl = baseUrl;
    this.endpoints = {
      listings: `${baseUrl}/listings`,
      products: `${baseUrl}/products`,
      locations: `${baseUrl}/users/locations`,
      categories: `${baseUrl}/products/categories`,
      marketPrices: `${baseUrl}/market-prices`,
    };
  }

  /**
   * Get all product categories
   * @returns {Promise} Promise with product categories
   */
  async getProductCategories() {
    try {
      const response = await fetch(this.endpoints.categories);
      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching product categories:', error);
      throw error;
    }
  }

  /**
   * Get products by category ID
   * @param {string} categoryId - ID of the product category
   * @returns {Promise} Promise with products in the category
   */
  async getProductsByCategory(categoryId) {
    try {
      const response = await fetch(`${this.endpoints.products}?category_id=${categoryId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching products by category:', error);
      throw error;
    }
  }

  /**
   * Get current market prices for a product
   * @param {string} productId - ID of the product
   * @param {string} locationId - Optional location ID for regional prices
   * @returns {Promise} Promise with market price information
   */
  async getMarketPrices(productId, locationId = null) {
    try {
      let url = `${this.endpoints.marketPrices}?product_id=${productId}`;
      if (locationId) {
        url += `&location_id=${locationId}`;
      }
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch market prices: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching market prices:', error);
      throw error;
    }
  }

  /**
   * Create a new product listing
   * @param {Object} listingData - Data for the new listing
   * @returns {Promise} Promise with the created listing
   */
  async createListing(listingData) {
    try {
      const response = await fetch(this.endpoints.listings, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify(listingData)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Failed to create listing: ${error.message || response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating listing:', error);
      throw error;
    }
  }

  /**
   * Upload photos for a listing
   * @param {string} listingId - ID of the listing 
   * @param {FileList|File[]} photos - Photos to upload
   * @returns {Promise} Promise with upload results
   */
  async uploadListingPhotos(listingId, photos) {
    try {
      const formData = new FormData();
      Array.from(photos).forEach((photo, index) => {
        formData.append(`photo_${index}`, photo);
      });
      
      const response = await fetch(`${this.endpoints.listings}/${listingId}/photos`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`Failed to upload photos: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error uploading listing photos:', error);
      throw error;
    }
  }

  /**
   * Get user's locations
   * @returns {Promise} Promise with user locations
   */
  async getUserLocations() {
    try {
      const response = await fetch(this.endpoints.locations, {
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch locations: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching user locations:', error);
      throw error;
    }
  }

  /**
   * Get auth token from storage
   * @returns {string} Authentication token
   */
  getAuthToken() {
    return localStorage.getItem('mkulima_auth_token');
  }

  /**
   * Get a specific listing by ID
   * @param {string} id - Listing ID
   * @returns {Promise} Promise with listing details
   */
  async getListing(id) {
    try {
      const response = await fetch(`${this.endpoints.listings}/${id}`, {
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch listing: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching listing:', error);
      throw error;
    }
  }

  /**
   * Update an existing listing
   * @param {string} id - Listing ID
   * @param {Object} updateData - Updated listing data
   * @returns {Promise} Promise with updated listing
   */
  async updateListing(id, updateData) {
    try {
      const response = await fetch(`${this.endpoints.listings}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify(updateData)
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update listing: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating listing:', error);
      throw error;
    }
  }
}

// Create a singleton instance
const listingsApiInstance = new ListingsApi();

/**
 * Custom hook alternative for creating a listing
 * @returns {Object} Object with mutation functions and state
 */
export const useCreateListingMutation = () => {
  return {
    mutateAsync: async (listingData) => {
      try {
        return await listingsApiInstance.createListing(listingData);
      } catch (error) {
        console.error('Error creating listing:', error);
        throw error;
      }
    },
    mutate: (listingData, { onSuccess, onError } = {}) => {
      listingsApiInstance.createListing(listingData)
        .then(data => {
          if (onSuccess) onSuccess(data);
          return data;
        })
        .catch(error => {
          console.error('Error creating listing:', error);
          if (onError) onError(error);
          throw error;
        });
    }
  };
};

/**
 * Custom hook alternative for uploading listing photos
 * @returns {Object} Object with mutation functions and state
 */
export const useUploadListingPhotosMutation = () => {
  return {
    mutateAsync: async ({ listingId, photos }) => {
      try {
        return await listingsApiInstance.uploadListingPhotos(listingId, photos);
      } catch (error) {
        console.error('Error uploading photos:', error);
        throw error;
      }
    },
    mutate: ({ listingId, photos }, { onSuccess, onError } = {}) => {
      listingsApiInstance.uploadListingPhotos(listingId, photos)
        .then(data => {
          if (onSuccess) onSuccess(data);
          return data;
        })
        .catch(error => {
          console.error('Error uploading photos:', error);
          if (onError) onError(error);
          throw error;
        });
    }
  };
};

/**
 * Custom hook alternative for fetching product categories
 * @returns {Function} Function to fetch product categories
 */
export const useProductCategories = () => {
  const fetchCategories = async () => {
    try {
      return await listingsApiInstance.getProductCategories();
    } catch (error) {
      console.error('Error fetching product categories:', error);
      throw error;
    }
  };
  
  return { data: null, isLoading: false, error: null, refetch: fetchCategories };
};

/**
 * Custom hook alternative for fetching products by category
 * @param {string} categoryId - ID of the category to fetch products for
 * @returns {Function} Function to fetch products by category
 */
export const useProductsByCategory = (categoryId) => {
  const fetchProducts = async () => {
    if (!categoryId) return null;
    
    try {
      return await listingsApiInstance.getProductsByCategory(categoryId);
    } catch (error) {
      console.error('Error fetching products by category:', error);
      throw error;
    }
  };
  
  return { data: null, isLoading: false, error: null, refetch: fetchProducts };
};

/**
 * Custom hook alternative for fetching market prices
 * @param {string} productId - ID of the product
 * @param {string|null} locationId - Optional location ID
 * @returns {Function} Function to fetch market prices
 */
export const useMarketPrices = (productId, locationId = null) => {
  const fetchMarketPrices = async () => {
    if (!productId) return null;
    
    try {
      return await listingsApiInstance.getMarketPrices(productId, locationId);
    } catch (error) {
      console.error('Error fetching market prices:', error);
      throw error;
    }
  };
  
  return { data: null, isLoading: false, error: null, refetch: fetchMarketPrices };
};

/**
 * Custom hook alternative for fetching user locations
 * @returns {Function} Function to fetch user locations
 */
export const useUserLocations = () => {
  const fetchLocations = async () => {
    try {
      return await listingsApiInstance.getUserLocations();
    } catch (error) {
      console.error('Error fetching user locations:', error);
      throw error;
    }
  };
  
  return { data: null, isLoading: false, error: null, refetch: fetchLocations };
};

/**
 * Custom hook alternative for fetching a specific listing
 * @param {string} id - Listing ID
 * @returns {Function} Function to fetch listing details
 */
export const useListing = (id) => {
  const fetchListing = async () => {
    if (!id) return null;
    
    try {
      return await listingsApiInstance.getListing(id);
    } catch (error) {
      console.error('Error fetching listing:', error);
      throw error;
    }
  };
  
  return { data: null, isLoading: false, error: null, refetch: fetchListing };
};

/**
 * Custom hook alternative for updating an existing listing
 * @returns {Object} Object with mutation functions and state
 */
export const useUpdateListingMutation = () => {
  return {
    mutateAsync: async ({ id, updateData }) => {
      try {
        return await listingsApiInstance.updateListing(id, updateData);
      } catch (error) {
        console.error('Error updating listing:', error);
        throw error;
      }
    },
    mutate: ({ id, updateData }, { onSuccess, onError } = {}) => {
      listingsApiInstance.updateListing(id, updateData)
        .then(data => {
          if (onSuccess) onSuccess(data);
          return data;
        })
        .catch(error => {
          console.error('Error updating listing:', error);
          if (onError) onError(error);
          throw error;
        });
    }
  };
};

export default listingsApiInstance;