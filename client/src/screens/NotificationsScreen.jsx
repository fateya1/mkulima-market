import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, AlertCircle, DollarSign, MessageCircle, Truck, Package, ShoppingBag, Star, Clock, ChevronRight, Bell, Settings } from 'lucide-react';

const NotificationsScreen = ({ onBack }) => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [hasUnread, setHasUnread] = useState(false);

  // Mock data fetch
  useEffect(() => {
    // Simulate API call
    const fetchNotifications = async () => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));

      const mockNotifications = [
        {
          id: 'notif-001',
          type: 'transaction_update',
          title: 'Transaction Confirmed',
          message: 'Your transaction for 500kg of Maize has been confirmed by Mohammed Ismail.',
          timestamp: '2025-04-10T09:15:30Z',
          isRead: false,
          actionUrl: '/transactions/TR-2025-04789',
          relatedId: 'TR-2025-04789'
        },
        {
          id: 'notif-002',
          type: 'payment',
          title: 'Payment Received',
          message: 'You have received KES 10,500 for your Potatoes transaction.',
          timestamp: '2025-04-09T14:22:45Z',
          isRead: true,
          actionUrl: '/transactions/TR-2025-04732',
          relatedId: 'TR-2025-04732'
        },
        {
          id: 'notif-003',
          type: 'transport',
          title: 'Transport Arranged',
          message: 'Samuel Njoroge has confirmed transport for your Maize delivery.',
          timestamp: '2025-04-09T11:05:12Z',
          isRead: false,
          actionUrl: '/transport/TR-2025-04789',
          relatedId: 'TR-2025-04789'
        },
        {
          id: 'notif-004',
          type: 'message',
          title: 'New Message',
          message: 'You have a new message from Jane Wanjiku regarding your Beans inquiry.',
          timestamp: '2025-04-08T16:37:20Z',
          isRead: true,
          actionUrl: '/messages/MSG-2025-08764',
          relatedId: 'MSG-2025-08764'
        },
        {
          id: 'notif-005',
          type: 'market_update',
          title: 'Price Alert',
          message: 'Maize prices have increased by 15% in your region in the last week.',
          timestamp: '2025-04-08T08:10:05Z',
          isRead: true,
          actionUrl: '/market/maize',
          relatedId: null
        },
        {
          id: 'notif-006',
          type: 'transaction_update',
          title: 'Transaction Completed',
          message: 'Your transaction for 300kg of Tomatoes has been marked as completed.',
          timestamp: '2025-04-07T15:45:30Z',
          isRead: true,
          actionUrl: '/transactions/TR-2025-04720',
          relatedId: 'TR-2025-04720'
        },
        {
          id: 'notif-007',
          type: 'system',
          title: 'Profile Verification',
          message: 'Your profile verification is complete. You now have full access to all features.',
          timestamp: '2025-04-07T10:20:15Z',
          isRead: true,
          actionUrl: '/profile',
          relatedId: null
        },
        {
          id: 'notif-008',
          type: 'transaction_update',
          title: 'New Purchase Offer',
          message: 'You have received a purchase offer for your Avocados listing.',
          timestamp: '2025-04-06T13:40:22Z',
          isRead: false,
          actionUrl: '/listings/LST-2025-03456',
          relatedId: 'LST-2025-03456'
        }
      ];

      setNotifications(mockNotifications);
      setIsLoading(false);

      // Check if there are any unread notifications
      setHasUnread(mockNotifications.some(notif => !notif.isRead));
    };

    fetchNotifications();
  }, []);

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, isRead: true })));
    setHasUnread(false);
  };

  // Mark individual notification as read
  const markAsRead = (id) => {
    setNotifications(notifications.map(notif =>
      notif.id === id ? { ...notif, isRead: true } : notif
    ));

    // Check if there are any remaining unread notifications
    const updatedNotifications = notifications.map(notif =>
      notif.id === id ? { ...notif, isRead: true } : notif
    );
    setHasUnread(updatedNotifications.some(notif => !notif.isRead));
  };

  // Filter notifications based on active tab
  const filteredNotifications = notifications.filter(notif => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !notif.isRead;
    if (activeTab === 'transactions') return notif.type.includes('transaction');
    if (activeTab === 'messages') return notif.type === 'message';
    return true;
  });

  // Format timestamp to relative time
  const formatRelativeTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) {
      return 'Just now';
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }

    // For older notifications, return the actual date
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-KE', options);
  };

  // Get appropriate icon for notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'transaction_update':
        return <ShoppingBag className="w-6 h-6 text-blue-500" />;
      case 'payment':
        return <DollarSign className="w-6 h-6 text-green-500" />;
      case 'transport':
        return <Truck className="w-6 h-6 text-orange-500" />;
      case 'message':
        return <MessageCircle className="w-6 h-6 text-purple-500" />;
      case 'market_update':
        return <Package className="w-6 h-6 text-indigo-500" />;
      case 'system':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      default:
        return <Bell className="w-6 h-6 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="p-1 mr-4 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Notifications</h1>
            <p className="text-sm text-gray-500">{notifications.length} notifications</p>
          </div>
        </div>
        <div className="flex space-x-2">
          {hasUnread && (
            <button
              onClick={markAllAsRead}
              className="text-blue-600 text-sm font-medium"
            >
              Mark all as read
            </button>
          )}
          <button className="p-1 rounded-full hover:bg-gray-100">
            <Settings className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white flex border-b border-gray-200 overflow-x-auto">
        <button
          className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${activeTab === 'all' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('all')}
        >
          All
        </button>
        <button
          className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${activeTab === 'unread' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('unread')}
        >
          Unread {hasUnread && <span className="ml-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">New</span>}
        </button>
        <button
          className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${activeTab === 'transactions' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('transactions')}
        >
          Transactions
        </button>
        <button
          className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${activeTab === 'messages' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('messages')}
        >
          Messages
        </button>
      </div>

      {/* Notifications List */}
      <div className="py-2">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-gray-700 font-medium mb-1">No notifications</h3>
            <p className="text-gray-500 text-sm">
              {activeTab === 'unread'
                ? "You're all caught up!"
                : activeTab === 'all'
                  ? "You don't have any notifications yet."
                  : `You don't have any ${activeTab} notifications.`
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredNotifications.map(notification => (
              <div
                key={notification.id}
                className={`px-4 py-3 ${!notification.isRead ? 'bg-blue-50' : 'bg-white'}`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex">
                  <div className="mr-3 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className={`font-medium ${!notification.isRead ? 'text-blue-900' : 'text-gray-900'}`}>
                        {notification.title}
                      </h3>
                      <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">
                        {formatRelativeTime(notification.timestamp)}
                      </span>
                    </div>
                    <p className={`text-sm ${!notification.isRead ? 'text-blue-800' : 'text-gray-600'}`}>
                      {notification.message}
                    </p>

                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 text-gray-400 mr-1" />
                        <span className="text-xs text-gray-500">
                          {new Date(notification.timestamp).toLocaleTimeString('en-KE', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <button className="text-blue-600 text-xs flex items-center">
                        View Details
                        <ChevronRight className="w-4 h-4 ml-0.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsScreen;
