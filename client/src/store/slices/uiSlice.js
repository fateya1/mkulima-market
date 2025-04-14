/**
 * MkulimaMarket - UI Slice
 * 
 * This module manages the UI state for the MkulimaMarket platform,
 * implementing a mobile-first design approach with accessibility
 * considerations for rural users with varying levels of digital literacy.
 */

import { createSlice } from '@reduxjs/toolkit';

// Define available themes based on the design system
const themes = {
  light: {
    primary: '#2E8B57', // Green
    primaryLight: '#4CAF50',
    primaryDark: '#1B5E20',
    secondary: '#8B4513', // Brown
    secondaryLight: '#A1887F',
    secondaryDark: '#5D4037',
    accent: '#1976D2', // Blue
    accentLight: '#42A5F5',
    accentDark: '#0D47A1',
    highlight: '#FF8C00', // Orange
    highlightLight: '#FFA726',
    highlightDark: '#E65100',
    text: '#424242',
    textSecondary: '#757575',
    background: '#F5F5F5',
    cardBackground: '#FFFFFF',
    border: '#EEEEEE',
    success: '#4CAF50',
    error: '#F44336',
    warning: '#FFC107',
    info: '#2196F3'
  },
  highContrast: {
    primary: '#1B5E20',
    primaryLight: '#2E8B57',
    primaryDark: '#0A3A12',
    secondary: '#5D4037',
    secondaryLight: '#8B4513',
    secondaryDark: '#3E2723',
    accent: '#0D47A1',
    accentLight: '#1976D2',
    accentDark: '#062B6F',
    highlight: '#E65100',
    highlightLight: '#FF8C00',
    highlightDark: '#BF360C',
    text: '#000000',
    textSecondary: '#212121',
    background: '#FFFFFF',
    cardBackground: '#F5F5F5',
    border: '#757575',
    success: '#1B5E20',
    error: '#B71C1C',
    warning: '#E65100',
    info: '#0D47A1'
  },
};

themes.dataSaving = {
  // Same as light theme but optimized for data saving mode
  // (fewer images, compressed assets, etc.)
  ...themes?.light
}

// Define available languages
const languages = {
  en: 'English',
  sw: 'Kiswahili',
  kik: 'Kikuyu',
  luo: 'Luo',
  kam: 'Kamba',
  kal: 'Kalenjin'
};

// Create the UI slice
const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    // Theme settings
    theme: 'light',
    fontSize: 'medium',
    reduceMotion: false,
    highContrast: false,
    
    // Language settings
    language: 'sw', // Default to Swahili based on user research
    
    // Connection status
    isOnline: true,
    lowBandwidth: false,
    
    // Navigation
    currentScreen: 'home',
    navigationHistory: ['home'],
    
    // UI Mode settings
    dataSavingMode: false,
    offlineMode: false,
    
    // Accessibility settings
    screenReaderEnabled: false,
    
    // Interface preferences
    useIcons: true, // User preference for icon-based or text-based UI
    showTutorials: true,
    tutorialStep: 0,
    tutorialCompleted: {},
    
    // Notifications and alerts
    notifications: [],
    activeAlert: null,
    toasts: [], // Added toasts array to store toast notifications
    
    // Loading states
    isLoading: false,
    loadingMessage: '',
    
    // Modal control
    activeModal: null,
    modalData: null
  },
  reducers: {
    // Theme actions
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    setFontSize: (state, action) => {
      state.fontSize = action.payload;
    },
    toggleReduceMotion: (state) => {
      state.reduceMotion = !state.reduceMotion;
    },
    toggleHighContrast: (state) => {
      state.highContrast = !state.highContrast;
      state.theme = state.highContrast ? 'highContrast' : 'light';
    },
    
    // Language actions
    setLanguage: (state, action) => {
      if (languages[action.payload]) {
        state.language = action.payload;
      }
    },
    
    // Connection status actions
    setOnlineStatus: (state, action) => {
      state.isOnline = action.payload;
    },
    setConnectionType: (state, action) => {
      state.lowBandwidth = action.payload === '2g' || action.payload === 'slow-3g';
    },
    
    // Navigation actions
    navigateTo: (state, action) => {
      state.navigationHistory.push(action.payload);
      state.currentScreen = action.payload;
    },
    goBack: (state) => {
      if (state.navigationHistory.length > 1) {
        state.navigationHistory.pop();
        state.currentScreen = state.navigationHistory[state.navigationHistory.length - 1];
      }
    },
    resetNavigation: (state) => {
      state.navigationHistory = ['home'];
      state.currentScreen = 'home';
    },
    
    // UI Mode actions
    setDataSavingMode: (state, action) => {
      state.dataSavingMode = action.payload;
      
      // Automatically apply the data-saving theme if enabled
      if (action.payload) {
        state.theme = 'dataSaving';
      } else if (state.theme === 'dataSaving') {
        // Reset to default or high contrast if previously in data saving mode
        state.theme = state.highContrast ? 'highContrast' : 'light';
      }
    },
    setOfflineMode: (state, action) => {
      state.offlineMode = action.payload;
    },
    
    // Accessibility actions
    setScreenReaderEnabled: (state, action) => {
      state.screenReaderEnabled = action.payload;
    },
    
    // Interface preferences actions
    setUseIcons: (state, action) => {
      state.useIcons = action.payload;
    },
    setShowTutorials: (state, action) => {
      state.showTutorials = action.payload;
    },
    setTutorialStep: (state, action) => {
      state.tutorialStep = action.payload;
    },
    completeTutorial: (state, action) => {
      state.tutorialCompleted[action.payload] = true;
      state.tutorialStep = 0;
    },
    resetTutorials: (state) => {
      state.tutorialCompleted = {};
      state.showTutorials = true;
    },
    
    // Notification actions
    addNotification: (state, action) => {
      state.notifications.push({
        id: Date.now(),
        ...action.payload,
        timestamp: Date.now()
      });
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    
    // Toast notifications actions
    showToast: (state, action) => {
      const newToast = {
        id: Date.now(),
        message: action.payload.message,
        type: action.payload.type || 'info', // info, success, warning, error
        duration: action.payload.duration || 3000, // Default 3 seconds
        timestamp: Date.now()
      };
      state.toasts.push(newToast);
    },
    removeToast: (state, action) => {
      state.toasts = state.toasts.filter(toast => toast.id !== action.payload);
    },
    clearToasts: (state) => {
      state.toasts = [];
    },
    
    // Alert actions
    showAlert: (state, action) => {
      state.activeAlert = {
        id: Date.now(),
        ...action.payload
      };
    },
    dismissAlert: (state) => {
      state.activeAlert = null;
    },
    
    // Loading state actions
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setLoadingMessage: (state, action) => {
      state.loadingMessage = action.payload;
    },
    
    // Modal actions
    showModal: (state, action) => {
      state.activeModal = action.payload.type;
      state.modalData = action.payload.data;
    },
    hideModal: (state) => {
      state.activeModal = null;
      state.modalData = null;
    }
  }
});

// Export actions
export const {
  // Theme actions
  setTheme,
  setFontSize,
  toggleReduceMotion,
  toggleHighContrast,
  
  // Language actions
  setLanguage,
  
  // Connection status actions
  setOnlineStatus,
  setConnectionType,
  
  // Navigation actions
  navigateTo,
  goBack,
  resetNavigation,
  
  // UI Mode actions
  setDataSavingMode,
  setOfflineMode,
  
  // Accessibility actions
  setScreenReaderEnabled,
  
  // Interface preferences actions
  setUseIcons,
  setShowTutorials,
  setTutorialStep,
  completeTutorial,
  resetTutorials,
  
  // Notification actions
  addNotification,
  removeNotification,
  clearNotifications,
  
  // Toast actions
  showToast,
  removeToast,
  clearToasts,
  
  // Alert actions
  showAlert,
  dismissAlert,
  
  // Loading state actions
  setLoading,
  setLoadingMessage,
  
  // Modal actions
  showModal,
  hideModal
} = uiSlice.actions;

// Export reducer
export default uiSlice.reducer;

// Selectors
export const selectTheme = (state) => themes[state.ui.theme];
export const selectActiveTheme = (state) => themes[state.ui.theme];
export const selectLanguage = (state) => state.ui.language;
export const selectFontSize = (state) => state.ui.fontSize;
export const selectCurrentScreen = (state) => state.ui.currentScreen;
export const selectIsLoading = (state) => state.ui.isLoading;
export const selectLoadingMessage = (state) => state.ui.loadingMessage;
export const selectActiveModal = (state) => state.ui.activeModal;
export const selectModalData = (state) => state.ui.modalData;
export const selectNotifications = (state) => state.ui.notifications;
export const selectToasts = (state) => state.ui.toasts; // Added toasts selector
export const selectActiveAlert = (state) => state.ui.activeAlert;
export const selectIsOnline = (state) => state.ui.isOnline;
export const selectIsLowBandwidth = (state) => state.ui.lowBandwidth;
export const selectIsDataSavingMode = (state) => state.ui.dataSavingMode;
export const selectIsOfflineMode = (state) => state.ui.offlineMode;
export const selectShowTutorials = (state) => state.ui.showTutorials;
export const selectTutorialStep = (state) => state.ui.tutorialStep;
export const selectTutorialCompleted = (state, tutorial) => state.ui.tutorialCompleted[tutorial] || false;
export const selectUseIcons = (state) => state.ui.useIcons;
export const selectReduceMotion = (state) => state.ui.reduceMotion;
export const selectHighContrast = (state) => state.ui.highContrast;
export const selectScreenReaderEnabled = (state) => state.ui.screenReaderEnabled;

// Initialize UI based on device capabilities and preferences
export const initializeUI = () => (dispatch) => {
  // Check for connection type
  if (navigator.connection) {
    dispatch(setConnectionType(navigator.connection.effectiveType));
    
    // Set up listener for connection changes
    navigator.connection.addEventListener('change', () => {
      dispatch(setConnectionType(navigator.connection.effectiveType));
    });
  }
  
  // Check for online status
  dispatch(setOnlineStatus(navigator.onLine));
  window.addEventListener('online', () => dispatch(setOnlineStatus(true)));
  window.addEventListener('offline', () => dispatch(setOnlineStatus(false)));
  
  // Check for prefers-reduced-motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    dispatch(toggleReduceMotion());
  }
  
  // Check for prefers-color-scheme
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    dispatch(setTheme('dark'));
  }
  
  // Check stored preferences if available
  try {
    const storedPreferences = localStorage.getItem('mkulimaMarketPreferences');
    if (storedPreferences) {
      const preferences = JSON.parse(storedPreferences);
      
      if (preferences.language) dispatch(setLanguage(preferences.language));
      if (preferences.fontSize) dispatch(setFontSize(preferences.fontSize));
      if (preferences.highContrast) dispatch(toggleHighContrast());
      if (preferences.reduceMotion) dispatch(toggleReduceMotion());
      if (preferences.useIcons !== undefined) dispatch(setUseIcons(preferences.useIcons));
      if (preferences.showTutorials !== undefined) dispatch(setShowTutorials(preferences.showTutorials));
      if (preferences.tutorialCompleted) {
        Object.entries(preferences.tutorialCompleted).forEach(([key, value]) => {
          if (value) dispatch(completeTutorial(key));
        });
      }
    }
  } catch (error) {
    console.error('Error loading preferences:', error);
  }
};

// Helper function to persist UI preferences to local storage
export const persistUIPreferences = (state) => {
  try {
    const preferences = {
      language: state.ui.language,
      fontSize: state.ui.fontSize,
      highContrast: state.ui.highContrast,
      reduceMotion: state.ui.reduceMotion,
      useIcons: state.ui.useIcons,
      showTutorials: state.ui.showTutorials,
      tutorialCompleted: state.ui.tutorialCompleted
    };
    
    localStorage.setItem('mkulimaMarketPreferences', JSON.stringify(preferences));
  } catch (error) {
    console.error('Error saving preferences:', error);
  }
};