import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks for listings operations
export const fetchListings = createAsyncThunk(
  'listings/fetchListings',
  async ({ filters = {}, page = 1, limit = 20 }, { rejectWithValue }) => {
    try {
      const response = await api.get('/listings', { params: { ...filters, page, limit } });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch listings');
    }
  }
);

export const fetchListingById = createAsyncThunk(
  'listings/fetchListingById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/listings/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch listing');
    }
  }
);

export const createListing = createAsyncThunk(
  'listings/createListing',
  async (listingData, { rejectWithValue }) => {
    try {
      const response = await api.post('/listings', listingData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to create listing');
    }
  }
);

export const updateListing = createAsyncThunk(
  'listings/updateListing',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/listings/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update listing');
    }
  }
);

export const deleteListing = createAsyncThunk(
  'listings/deleteListing',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/listings/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to delete listing');
    }
  }
);

export const fetchNearbyListings = createAsyncThunk(
  'listings/fetchNearbyListings',
  async ({ latitude, longitude, radius = 50, productId = null }, { rejectWithValue }) => {
    try {
      const params = { latitude, longitude, radius };
      if (productId) params.productId = productId;

      const response = await api.get('/listings/nearby', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch nearby listings');
    }
  }
);

const initialState = {
  listings: [],
  currentListing: null,
  nearbyListings: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
    limit: 20
  },
  filters: {
    product: null,
    priceRange: null,
    location: null,
    quality: null,
    availability: null
  }
};

const listingSlice = createSlice({
  name: 'listings',
  initialState,
  reducers: {
    setListingFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearListingFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearCurrentListing: (state) => {
      state.currentListing = null;
    },
    setPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Listings
      .addCase(fetchListings.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchListings.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.listings = action.payload.items;
        state.pagination = {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          totalItems: action.payload.totalItems,
          limit: action.payload.limit
        };
      })
      .addCase(fetchListings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Fetch Listing by ID
      .addCase(fetchListingById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchListingById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentListing = action.payload;
      })
      .addCase(fetchListingById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Create Listing
      .addCase(createListing.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createListing.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.listings.unshift(action.payload);
        state.currentListing = action.payload;
      })
      .addCase(createListing.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Update Listing
      .addCase(updateListing.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateListing.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Update in the listings array
        const index = state.listings.findIndex(listing => listing.id === action.payload.id);
        if (index !== -1) {
          state.listings[index] = action.payload;
        }
        // Update current listing if it's the one being edited
        if (state.currentListing && state.currentListing.id === action.payload.id) {
          state.currentListing = action.payload;
        }
      })
      .addCase(updateListing.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Delete Listing
      .addCase(deleteListing.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteListing.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.listings = state.listings.filter(listing => listing.id !== action.payload);
        if (state.currentListing && state.currentListing.id === action.payload) {
          state.currentListing = null;
        }
      })
      .addCase(deleteListing.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Fetch Nearby Listings
      .addCase(fetchNearbyListings.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchNearbyListings.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.nearbyListings = action.payload;
      })
      .addCase(fetchNearbyListings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export const {
  setListingFilters,
  clearListingFilters,
  clearCurrentListing,
  setPage
} = listingSlice.actions;

export default listingSlice.reducer;
