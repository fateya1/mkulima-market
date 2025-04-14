import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// English resources
const enResources = {
  common: {
    loading: 'Loading...',
    error: 'An error occurred',
    retry: 'Retry',
    save: 'Save',
    cancel: 'Cancel',
    confirm: 'Confirm',
    continue: 'Continue'
  },
  auth: {
    login: 'Login',
    register: 'Register',
    phoneNumber: 'Phone Number',
    verificationCode: 'Verification Code',
    sendCode: 'Send Code',
    verifyCode: 'Verify Code',
    loginSuccess: 'Login successful',
    registerSuccess: 'Registration successful',
    logout: 'Logout',
    otpSent: 'Verification code sent to your phone'
  },
  marketplace: {
    myListings: 'My Listings',
    createListing: 'Create Listing',
    editListing: 'Edit Listing',
    product: 'Product',
    quantity: 'Quantity',
    price: 'Price',
    quality: 'Quality',
    availability: 'Availability',
    location: 'Location',
    description: 'Description',
    photos: 'Photos',
    addPhoto: 'Add Photo',
    listingCreated: 'Listing created successfully',
    listingUpdated: 'Listing updated successfully',
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    category: 'Category',
    noListings: 'No listings found'
  },
  transaction: {
    buy: 'Buy',
    sell: 'Sell',
    offer: 'Make Offer',
    accept: 'Accept',
    decline: 'Decline',
    negotiate: 'Negotiate',
    payment: 'Payment',
    delivery: 'Delivery',
    transport: 'Transport',
    schedule: 'Schedule',
    complete: 'Complete Transaction',
    transactionCreated: 'Transaction created successfully',
    waitingForConfirmation: 'Waiting for confirmation',
    paymentReceived: 'Payment received',
    productDelivered: 'Product delivered',
    rating: 'Rate this transaction',
    submitRating: 'Submit Rating',
    transactionHistory: 'Transaction History'
  },
  errors: {
    networkError: 'Network connection error. Please try again later.',
    authError: 'Authentication failed. Please check your credentials.',
    permissionError: 'You do not have permission to perform this action.',
    validationError: 'Please check your information and try again.',
    serverError: 'Server error. Please try again later.'
  },
  offline: {
    offlineMode: 'You are currently offline',
    queuedActions: 'Actions will be completed when you are back online',
    syncComplete: 'Your data has been synchronized'
  }
};

// Swahili resources
const swResources = {
  common: {
    loading: 'Inapakia...',
    error: 'Hitilafu imetokea',
    retry: 'Jaribu tena',
    save: 'Hifadhi',
    cancel: 'Ghairi',
    confirm: 'Thibitisha',
    continue: 'Endelea'
  },
  auth: {
    login: 'Ingia',
    register: 'Jiandikishe',
    phoneNumber: 'Nambari ya Simu',
    verificationCode: 'Nambari ya Uthibitisho',
    sendCode: 'Tuma Nambari',
    verifyCode: 'Thibitisha Nambari',
    loginSuccess: 'Umeingia kwa mafanikio',
    registerSuccess: 'Umejiandikisha kwa mafanikio',
    logout: 'Toka',
    otpSent: 'Nambari ya uthibitisho imetumwa kwenye simu yako'
  },
  marketplace: {
    myListings: 'Orodha Zangu',
    createListing: 'Unda Orodha',
    editListing: 'Hariri Orodha',
    product: 'Bidhaa',
    quantity: 'Kiasi',
    price: 'Bei',
    quality: 'Ubora',
    availability: 'Upatikanaji',
    location: 'Eneo',
    description: 'Maelezo',
    photos: 'Picha',
    addPhoto: 'Ongeza Picha',
    listingCreated: 'Orodha imeundwa kwa mafanikio',
    listingUpdated: 'Orodha imesasishwa kwa mafanikio',
    search: 'Tafuta',
    filter: 'Chuja',
    sort: 'Panga',
    category: 'Kategoria',
    noListings: 'Hakuna orodha zilizopatikana'
  },
  transaction: {
    buy: 'Nunua',
    sell: 'Uza',
    offer: 'Toa Ofa',
    accept: 'Kubali',
    decline: 'Kataa',
    negotiate: 'Jadiliana',
    payment: 'Malipo',
    delivery: 'Utoaji',
    transport: 'Usafiri',
    schedule: 'Ratiba',
    complete: 'Kamilisha Muamala',
    transactionCreated: 'Muamala umeundwa kwa mafanikio',
    waitingForConfirmation: 'Inasubiri uthibitisho',
    paymentReceived: 'Malipo yamepokelewa',
    productDelivered: 'Bidhaa imetolewa',
    rating: 'Tathmini muamala huu',
    submitRating: 'Wasilisha Tathmini',
    transactionHistory: 'Historia ya Muamala'
  },
  errors: {
    networkError: 'Hitilafu ya muunganisho wa mtandao. Tafadhali jaribu tena baadaye.',
    authError: 'Uthibitishaji umeshindwa. Tafadhali angalia namba yako.',
    permissionError: 'Huna ruhusa ya kutekeleza tendo hili.',
    validationError: 'Tafadhali angalia taarifa zako na ujaribu tena.',
    serverError: 'Hitilafu ya seva. Tafadhali jaribu tena baadaye.'
  },
  offline: {
    offlineMode: 'Kwa sasa uko nje ya mtandao',
    queuedActions: 'Vitendo vitakamilishwa utakaporudi mtandaoni',
    syncComplete: 'Data yako imesawazishwa'
  }
};

// Function to initialize i18n
const initializeI18n = async () => {
  await i18n
    .use(Backend) // Load translations via xhr
    .use(LanguageDetector) // Detect user language
    .use(initReactI18next) // Pass i18n down to react-i18next
    .init({
      resources: {
        en: enResources,
        sw: swResources
      },
      fallbackLng: 'sw', // Default language is Swahili per user research
      debug: process.env.NODE_ENV === 'development',

      // Common namespace used around the app
      ns: ['common', 'auth', 'marketplace', 'transaction', 'errors', 'offline'],
      defaultNS: 'common',

      interpolation: {
        escapeValue: false // React already escapes by default
      },

      detection: {
        // Order and from where user language should be detected
        order: ['localStorage', 'navigator'],

        // Cache user language on localStorage
        caches: ['localStorage'],

        // Keys to lookup language in localStorage
        lookupLocalStorage: 'mkulimaMarketLanguage',
      },

      react: {
        useSuspense: false // Needed for handling server-side rendering
      }
    });

  return i18n;
};

// Language utility functions
const languageUtils = {
  // Change language programmatically
  changeLanguage: (language) => {
    i18n.changeLanguage(language);
    localStorage.setItem('mkulimaMarketLanguage', language);
  },

  // Get current language
  getCurrentLanguage: () => {
    return i18n.language;
  },

  // Get supported languages
  getSupportedLanguages: () => {
    return [
      { code: 'sw', name: 'Kiswahili' },
      { code: 'en', name: 'English' }
    ];
  },

  // Check if current language is RTL
  isRTL: () => {
    // For future RTL language support
    const rtlLanguages = [];
    return rtlLanguages.includes(i18n.language);
  }
};

export { initializeI18n, languageUtils };
export default i18n;
