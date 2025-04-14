import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// import { useFetchDashboardDataQuery } from '../store/api/dashboardApi';
import FarmerDashboard from '../components/dashboard/FarmerDashboard';
import BuyerDashboard from '../components/dashboard/BuyerDashboard';
import TransporterDashboard from '../components/dashboard/TransporterDashboard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { getOfflineData } from '../services/offlineSync';
// import { setDashboardData } from '../store/slices/offlineDataSlice';

const HomeScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userType, user } = useSelector(state => state.auth);
  const isOnline = useSelector(state => state.ui.isOnline);
  const { dashboardData } = useSelector(state => state.offlineData);

  const { data, isLoading, isError, refetch } = useFetchDashboardDataQuery(
    { userType },
    { skip: !isOnline } // Skip query when offline
  );

  useEffect(() => {
    const loadOfflineData = async () => {
      if (!isOnline && !dashboardData) {
        try {
          const offlineData = await getOfflineData('userData', 'dashboard');
          if (offlineData) {
            dispatch(setDashboardData(offlineData));
          }
        } catch (error) {
          console.error('Error loading offline dashboard data:', error);
        }
      }
    };

    loadOfflineData();
  }, [isOnline, dashboardData, dispatch]);

  // Determine which dashboard to show based on user type
  const renderDashboard = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }

    if (isError) {
      return (
        <ErrorMessage
          message="Couldn't load dashboard data"
          onRetry={isOnline ? refetch : null}
        />
      );
    }

    const displayData = isOnline ? data : dashboardData;

    if (!displayData) {
      return <ErrorMessage message="No data available" />;
    }

    switch (userType) {
      case 'farmer':
        return <FarmerDashboard data={displayData} user={user} isOnline={isOnline} />;
      case 'buyer':
        return <BuyerDashboard data={displayData} user={user} isOnline={isOnline} />;
      case 'transporter':
        return <TransporterDashboard data={displayData} user={user} isOnline={isOnline} />;
      default:
        return <ErrorMessage message="Unknown user type" />;
    }
  };

  return (
    <div className="home-screen">
      <header className="screen-header">
        <h1>Welcome, {user?.full_name || 'User'}</h1>
        <button
          className="icon-button"
          onClick={() => navigate('/notifications')}
          aria-label="Notifications"
        >
          <i className="notification-icon" />
        </button>
      </header>
      <div className="dashboard-container">
        {renderDashboard()}
      </div>
    </div>
  );
};

export default HomeScreen;
