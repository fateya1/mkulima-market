import React, { useState, useEffect } from 'react';

const OfflineNotice = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);

      // When coming back online, show the notice for 3 seconds before auto-hiding
      setIsCollapsed(false);
      const timer = setTimeout(() => {
        setIsCollapsed(true);
      }, 3000);

      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOffline(true);
      setIsCollapsed(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Handle manual dismiss of the notice
  const handleDismiss = () => {
    setIsCollapsed(true);
  };

  // If there's no connectivity issue, don't render anything
  if (!isOffline && isCollapsed) {
    return null;
  }

  return (
    <div className={`fixed bottom-0 left-0 right-0 transition-transform duration-300 ${isCollapsed ? 'translate-y-full' : 'translate-y-0'}`}>
      <div className={`p-4 ${isOffline ? 'bg-orange-600' : 'bg-green-600'} text-white shadow-lg`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {isOffline ? (
              <>
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636a9 9 0 010 12.728m-12.728 0a9 9 0 010-12.728m9.9 2.829a5 5 0 010 7.07m-7.07 0a5 5 0 010-7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
                <span className="font-medium">You're offline</span>
              </>
            ) : (
              <>
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-medium">You're back online!</span>
              </>
            )}
          </div>

          {isOffline && (
            <div className="flex items-center">
              <span className="text-sm mr-4">Some features may be limited</span>
              <button
                onClick={handleDismiss}
                className="p-1 rounded-full hover:bg-white/20 focus:outline-none"
                aria-label="Dismiss notification"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {isOffline && (
          <div className="mt-2 text-sm">
            <p>Don't worry - you can still view existing data and create listings. Changes will sync when your connection returns.</p>
            <div className="mt-3 flex space-x-3">
              <button className="px-4 py-1 bg-white text-orange-600 rounded-full text-sm font-medium">
                View Offline Guide
              </button>
              <button onClick={handleDismiss} className="px-4 py-1 bg-white/20 text-white rounded-full text-sm font-medium">
                Dismiss
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OfflineNotice;
