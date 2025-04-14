import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import BottomNavigation from '../navigation/BottomNavigation';
import HomeScreen from '../screens/HomeScreen';
import MarketplaceScreen from '../screens/marketplace/MarketplaceScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import TransactionsScreen from '../screens/transactions/TransactionsScreen';
import CreateListingScreen from '../screens/marketplace/CreateListingScreen';
import ListingDetailScreen from '../screens/marketplace/ListingDetailScreen';
import TransactionDetailScreen from '../screens/transactions/TransactionDetailScreen';
import TransportScreen from '../screens/transport/TransportScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import SettingsScreen from '../screens/profile/SettingsScreen';

const MainNavigator = () => {
  const { userType } = useSelector(state => state.auth);

  return (
    <>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/marketplace" element={<MarketplaceScreen />} />
        <Route path="/marketplace/listing/:id" element={<ListingDetailScreen />} />
        <Route path="/marketplace/create" element={<CreateListingScreen />} />
        <Route path="/transactions" element={<TransactionsScreen />} />
        <Route path="/transactions/:id" element={<TransactionDetailScreen />} />
        <Route path="/transport" element={<TransportScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
        <Route path="/notifications" element={<NotificationsScreen />} />
        <Route path="/settings" element={<SettingsScreen />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <BottomNavigation userType={userType} />
    </>
  );
};

export default MainNavigator;

