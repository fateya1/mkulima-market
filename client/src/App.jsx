import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import NetworkStatus from './components/common/NetworkStatus';
import { checkAuthStatus } from './store/slices/authSlice';
import SplashScreen from './screens/SplashScreen';
import AuthStack from './navigation/AuthStack';
import MainNavigator from './navigation/MainNavigator';
import OfflineNotice from './components/common/OfflineNotice';

const App = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, isLoading } = useSelector(state => state.auth);
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    const prepareApp = async () => {
      // Check authentication status, load initial data, etc.
      await dispatch(checkAuthStatus());
      setIsAppReady(true);
    };

    prepareApp();
  }, [dispatch]);

  if (!isAppReady || isLoading) {
    return <SplashScreen />;
  }

  return (
    <>
      <NetworkStatus />
      <OfflineNotice />
      <Routes>
        {!isAuthenticated ? (
          <Route path="/*" element={<AuthStack />} />
        ) : (
          <Route path="/*" element={<MainNavigator />} />
        )}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default App;

// import React from 'react'
// import MkulimaMarketComponentDemo from '../MkulimaMarketUIComponents'
//
// const App = () => {
//   return (
//     <MkulimaMarketComponentDemo />
//   )
// }
//
// export default App
