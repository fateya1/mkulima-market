import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { checkAuthStatus } from './store/slices/authSlice';
import { toggleDarkMode } from './store/slices/uiSlice';

// Layout components
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Auth screens
import LoginScreen from './screens/auth/LoginScreen';
import RegisterScreen from './screens/auth/RegisterScreen';
import ForgotPasswordScreen from './screens/auth/ForgotPasswordScreen';

// Main app screens
import DashboardScreen from './screens/dashboard/DashboardScreen';
import ProfileScreen from './screens/profile/ProfileScreen';
import MarketplaceScreen from './screens/marketplace/MarketplaceScreen';
import ListingDetailScreen from './screens/marketplace/ListingDetailScreen';
import CreateListingScreen from './screens/marketplace/CreateListingScreen';
import TransactionsScreen from './screens/transactions/TransactionsScreen';
import SettingsScreen from './screens/settings/SettingsScreen';
import NotFoundScreen from './screens/NotFoundScreen';

// Toast notification component
import ToastContainer from './components/ui/ToastContainer';

const App = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { darkMode } = useSelector((state) => state.ui);

  // Check authentication status when app loads
  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  // Apply dark mode class to body element
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  return (
    <Router>
      <div className={`app ${darkMode ? 'dark-theme' : 'light-theme'}`}>
        <Routes>
          {/* Auth routes */}
          <Route path="/auth" element={<AuthLayout />}>
            <Route path="login" element={!isAuthenticated ? <LoginScreen /> : <Navigate to="/dashboard" replace />} />
            <Route path="register" element={!isAuthenticated ? <RegisterScreen /> : <Navigate to="/dashboard" replace />} />
            <Route path="forgot-password" element={<ForgotPasswordScreen />} />
          </Route>

          {/* Protected routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={isAuthenticated ? <DashboardScreen /> : <Navigate to="/auth/login" replace />} />
            <Route path="profile" element={isAuthenticated ? <ProfileScreen /> : <Navigate to="/auth/login" replace />} />
            <Route path="marketplace">
              <Route index element={<MarketplaceScreen />} />
              <Route path="listing/:id" element={<ListingDetailScreen />} />
              <Route path="create" element={isAuthenticated ? <CreateListingScreen /> : <Navigate to="/auth/login" replace />} />
            </Route>
            <Route path="transactions" element={isAuthenticated ? <TransactionsScreen /> : <Navigate to="/auth/login" replace />} />
            <Route path="settings" element={isAuthenticated ? <SettingsScreen /> : <Navigate to="/auth/login" replace />} />
          </Route>

          {/* 404 route */}
          <Route path="*" element={<NotFoundScreen />} />
        </Routes>

        {/* Global toast notifications */}
        <ToastContainer />
      </div>
    </Router>
  );
};

export default App;
