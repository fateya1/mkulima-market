import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../store/slices/authSlice';
import listingsReducer from '../store/slices/listingsSlice';
import transactionsReducer from '../store/slices/transactionsSlice';
import offlineDataReducer from '../store/slices/offlineDataSlice';
import uiReducer from '../store/slices/uiSlice.js';
import { api } from '../services/api.js';

const rootReducer = combineReducers({
  auth: authReducer,
  listings: listingsReducer,
  transactions: transactionsReducer,
  offlineData: offlineDataReducer,
  ui: uiReducer,
  [api.reducerPath]: api.reducer,
});

export default rootReducer;

