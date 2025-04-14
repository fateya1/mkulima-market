import React, { useState, useEffect } from 'react';
import { Search, Filter, ChevronRight, AlertCircle, CheckCircle, Clock, Loader } from 'lucide-react';

const TransactionsScreen = () => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    date: 'all',
    type: 'all'
  });

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        // This would be an actual API call in production
        // const response = await api.get('/transactions');

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock data for demonstration
        const mockTransactions = [
          {
            id: 'T12345',
            productName: 'Fresh Tomatoes',
            quantity: '50 kg',
            totalAmount: 4500,
            status: 'completed',
            date: '2025-04-07',
            otherParty: {
              name: 'Mohammed Ismail',
              type: 'buyer'
            },
            paymentStatus: 'paid'
          },
          {
            id: 'T12346',
            productName: 'Kale (Sukuma Wiki)',
            quantity: '30 kg',
            totalAmount: 1200,
            status: 'in_progress',
            date: '2025-04-09',
            otherParty: {
              name: 'Priscilla Muthoni',
              type: 'buyer'
            },
            paymentStatus: 'pending'
          },
          {
            id: 'T12347',
            productName: 'Capsicum',
            quantity: '25 kg',
            totalAmount: 3750,
            status: 'initiated',
            date: '2025-04-10',
            otherParty: {
              name: 'John Odhiambo',
              type: 'buyer'
            },
            paymentStatus: 'not_started'
          },
          {
            id: 'T12348',
            productName: 'Maize',
            quantity: '200 kg',
            totalAmount: 8000,
            status: 'cancelled',
            date: '2025-04-02',
            otherParty: {
              name: 'Sara Akinyi',
              type: 'buyer'
            },
            paymentStatus: 'refunded'
          },
          {
            id: 'T12349',
            productName: 'Onions',
            quantity: '40 kg',
            totalAmount: 3200,
            status: 'completed',
            date: '2025-04-05',
            otherParty: {
              name: 'Mohammed Ismail',
              type: 'buyer'
            },
            paymentStatus: 'paid'
          },
        ];

        setTransactions(mockTransactions);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const getFilteredTransactions = () => {
    let filtered = transactions;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        transaction =>
          transaction.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          transaction.otherParty.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          transaction.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by status
    if (filters.status !== 'all') {
      filtered = filtered.filter(transaction => transaction.status === filters.status);
    }

    // Filter by tab
    if (activeTab === 'active') {
      filtered = filtered.filter(transaction =>
        ['initiated', 'in_progress'].includes(transaction.status)
      );
    } else if (activeTab === 'completed') {
      filtered = filtered.filter(transaction =>
        ['completed', 'cancelled'].includes(transaction.status)
      );
    }

    return filtered;
  };

  const renderStatusBadge = (status) => {
    switch (status) {
      case 'initiated':
        return (
          <span className="flex items-center text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            <Clock size={12} className="mr-1" />
            Initiated
          </span>
        );
      case 'in_progress':
        return (
          <span className="flex items-center text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
            <Loader size={12} className="mr-1" />
            In Progress
          </span>
        );
      case 'completed':
        return (
          <span className="flex items-center text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
            <CheckCircle size={12} className="mr-1" />
            Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="flex items-center text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
            <AlertCircle size={12} className="mr-1" />
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen pb-6">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm">
        <h1 className="text-xl font-semibold">Transactions</h1>
      </div>

      {/* Search and Filter */}
      <div className="p-4">
        <div className="flex">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search transactions"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400 h-5 w-5" />
          </div>
          <button
            className="ml-2 p-2 border border-gray-300 rounded-lg flex items-center justify-center bg-white"
            onClick={() => setFilterVisible(!filterVisible)}
          >
            <Filter className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {filterVisible && (
          <div className="mt-4 bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-medium mb-2">Filter Transactions</h3>

            <div className="mb-3">
              <label className="block text-sm text-gray-600 mb-1">Status</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-lg"
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              >
                <option value="all">All Statuses</option>
                <option value="initiated">Initiated</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="block text-sm text-gray-600 mb-1">Date</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-lg"
                value={filters.date}
                onChange={(e) => setFilters({ ...filters, date: e.target.value })}
              >
                <option value="all">All Time</option>
                <option value="this_week">This Week</option>
                <option value="this_month">This Month</option>
                <option value="last_month">Last Month</option>
              </select>
            </div>

            <div className="flex justify-end">
              <button
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg mr-2"
                onClick={() => {
                  setFilters({
                    status: 'all',
                    date: 'all',
                    type: 'all'
                  });
                }}
              >
                Reset
              </button>
              <button
                className="bg-green-600 text-white px-4 py-2 rounded-lg"
                onClick={() => setFilterVisible(false)}
              >
                Apply
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Transaction Tabs */}
      <div className="px-4">
        <div className="flex border-b">
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'active' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-600'}`}
            onClick={() => setActiveTab('active')}
          >
            Active
          </button>
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'completed' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-600'}`}
            onClick={() => setActiveTab('completed')}
          >
            Completed
          </button>
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'all' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-600'}`}
            onClick={() => setActiveTab('all')}
          >
            All
          </button>
        </div>
      </div>

      {/* Transactions List */}
      <div className="mt-4">
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700"></div>
          </div>
        ) : getFilteredTransactions().length === 0 ? (
          <div className="text-center p-8">
            <p className="text-gray-600">No transactions found</p>
            {searchQuery && (
              <button
                className="mt-2 text-green-600 font-medium"
                onClick={() => setSearchQuery('')}
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          getFilteredTransactions().map((transaction) => (
            <div key={transaction.id} className="bg-white mb-3 mx-4 rounded-lg shadow-sm overflow-hidden">
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{transaction.productName}</h3>
                    <p className="text-sm text-gray-600">{transaction.quantity}</p>
                  </div>
                  <div>
                    {renderStatusBadge(transaction.status)}
                  </div>
                </div>

                <div className="mt-3 flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-500">Transaction with</p>
                    <p className="text-sm font-medium">{transaction.otherParty.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Amount</p>
                    <p className="text-sm font-semibold">KES {transaction.totalAmount.toLocaleString()}</p>
                  </div>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    {new Date(transaction.date).toLocaleDateString('en-GB', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                  <button className="flex items-center text-green-600 text-sm font-medium">
                    View Details
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TransactionsScreen;
