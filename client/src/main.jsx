import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import App from './App';
import store from './store';
import './i18n'; // Internationalization setup
import './styles/global.css';
import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// Register the service worker for offline capabilities
// This is particularly important for the MkulimaMarket application
// as users may have limited connectivity in rural areas
serviceWorkerRegistration.register({
  onSuccess: (registration) => {
    console.log('MkulimaMarket is now available offline');
    // You could show a notification to the user here
  },
  onUpdate: (registration) => {
    console.log('MkulimaMarket has been updated in the background');
    // You could show a notification to the user here that 
    // allows them to refresh to get the latest version
  }
});

// Register listeners for network status changes
serviceWorkerRegistration.registerNetworkStatusListener({
  onOnline: () => {
    // Show a notification that the app is back online
    // Sync any pending transactions
    console.log('MkulimaMarket is back online');
  },
  onOffline: () => {
    // Show a notification that the app is offline
    // Enable offline mode features
    console.log('MkulimaMarket is offline, but you can still use most features');
  }
});
