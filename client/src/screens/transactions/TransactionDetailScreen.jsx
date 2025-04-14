import React, { useState, useEffect } from 'react';
import { ArrowLeft, MessageCircle, Truck, CheckCircle, AlertCircle, Calendar, MapPin, Package, DollarSign } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const TransactionDetailScreen = ({ transaction, onBack }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [marketPriceData, setMarketPriceData] = useState([]);

  // Mock transaction if none provided for development
  const transactionData = transaction || {
    id: 'TR-2025-04789',
    product: 'Maize',
    quantity: '500',
    unit: 'kg',
    pricePerUnit: 45,
    totalAmount: 22500,
    status: 'in_progress', // initiated, agreed, in_progress, completed, cancelled, disputed
    paymentStatus: 'partial', // pending, partial, complete, refunded
    seller: {
      id: 'USR-001',
      name: 'Jane Wanjiku',
      location: 'Kakamega County',
      rating: 4.2,
      phone: '+254712345678'
    },
    buyer: {
      id: 'USR-002',
      name: 'Mohammed Ismail',
      rating: 4.5,
      phone: '+254723456789'
    },
    transport: {
      status: 'confirmed', // pending, confirmed, in_transit, delivered
      provider: 'Samuel Njoroge',
      vehicleType: 'Pickup Truck',
      fee: 1500,
      pickupDate: '2025-04-12T09:00:00Z',
      phoneNumber: '+254734567890'
    },
    quality: {
      description: 'Grade A, dried to 13% moisture content',
      images: ['/api/placeholder/400/300']
    },
    pickupLocation: 'Mumias, Kakamega County',
    deliveryLocation: 'Nakuru Town',
    scheduledDate: '2025-04-12',
    createdAt: '2025-04-08T14:23:45Z',
    lastUpdated: '2025-04-10T09:15:30Z',
    notes: 'Deliver to warehouse entrance. Call upon arrival.'
  };

  // Generate mock market price data
  useEffect(() => {
    const generateMarketPriceData = () => {
      const data = [];
      const currentPrice = transactionData.pricePerUnit;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 14);

      for (let i = 0; i < 14; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);

        // Create some random variation around the current price
        const randomVariation = Math.random() * 10 - 5;
        const price = Math.max(currentPrice + randomVariation, currentPrice * 0.8);

        data.push({
          date: date.toISOString().split('T')[0],
          price: Math.round(price * 10) / 10
        });
      }

      setMarketPriceData(data);
      setIsLoading(false);
    };

    generateMarketPriceData();
  }, [transactionData.pricePerUnit]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'initiated':
        return 'bg-yellow-100 text-yellow-800';
      case 'agreed':
        return 'bg-indigo-100 text-indigo-800';
      case 'disputed':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'complete':
        return 'bg-green-100 text-green-800';
      case 'partial':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      case 'refunded':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in_progress':
        return <Truck className="w-5 h-5 text-blue-500" />;
      case 'disputed':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-KE', options);
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
      <div className="bg-white px-4 py-3 flex items-center shadow-sm">
        <button
          onClick={onBack}
          className="p-1 mr-4 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Transaction Details</h1>
          <p className="text-sm text-gray-500">{transactionData.id}</p>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Status Card */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-medium text-gray-900">Status</h2>
            <span className={`text-sm font-medium px-3 py-1 rounded-full ${getStatusColor(transactionData.status)}`}>
              {transactionData.status.replace('_', ' ').toUpperCase()}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Payment</span>
            <span className={`text-sm font-medium px-3 py-1 rounded-full ${getPaymentStatusColor(transactionData.paymentStatus)}`}>
              {transactionData.paymentStatus.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Product Card */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h2 className="text-lg font-medium text-gray-900 mb-3">Product Details</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-sm text-gray-500">Product</p>
              <p className="font-medium">{transactionData.product}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Quantity</p>
              <p className="font-medium">{`${transactionData.quantity} ${transactionData.unit}`}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Price Per Unit</p>
              <p className="font-medium">KES {transactionData.pricePerUnit}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Amount</p>
              <p className="font-medium">KES {transactionData.totalAmount}</p>
            </div>
          </div>

          <div className="mt-3">
            <p className="text-sm text-gray-500 mb-1">Quality Description</p>
            <p className="text-sm">{transactionData.quality.description}</p>
          </div>

          {transactionData.quality.images && transactionData.quality.images.length > 0 && (
            <div className="mt-3">
              <p className="text-sm text-gray-500 mb-2">Product Images</p>
              <div className="flex overflow-x-auto space-x-2 pb-2">
                {transactionData.quality.images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Product ${index + 1}`}
                    className="w-32 h-24 object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Market Price Comparison */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h2 className="text-lg font-medium text-gray-900 mb-3">Market Price Comparison</h2>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={marketPriceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10 }}
                  tickFormatter={(value) => value.split('-').slice(1).join('/')}
                />
                <YAxis
                  tick={{ fontSize: 10 }}
                  domain={['dataMin - 5', 'dataMax + 5']}
                />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#2E8B57"
                  strokeWidth={2}
                  dot={{ r: 2 }}
                  name="Price (KES)"
                />
                {/* Add a horizontal line for the current transaction price */}
                <Line
                  type="monotone"
                  data={marketPriceData.map(item => ({
                    date: item.date,
                    price: transactionData.pricePerUnit
                  }))}
                  dataKey="price"
                  stroke="#FF8C00"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Your Price (KES)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>Last 14 days</span>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-600 rounded-sm mr-1"></div>
              <span>Market Price</span>
              <div className="w-3 h-3 bg-orange-500 rounded-sm ml-3 mr-1"></div>
              <span>Your Price</span>
            </div>
          </div>
        </div>

        {/* Parties Involved */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h2 className="text-lg font-medium text-gray-900 mb-3">Parties</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-gray-500">Seller</p>
                <p className="font-medium">{transactionData.seller.name}</p>
                <div className="flex items-center mt-1">
                  <span className="text-sm text-gray-500">Rating:</span>
                  <span className="ml-1 text-yellow-500">★</span>
                  <span className="text-sm ml-1">{transactionData.seller.rating}</span>
                </div>
              </div>
              <button className="text-blue-600 text-sm flex items-center">
                <MessageCircle className="w-4 h-4 mr-1" />
                Contact
              </button>
            </div>

            <div className="flex justify-between">
              <div>
                <p className="text-sm text-gray-500">Buyer</p>
                <p className="font-medium">{transactionData.buyer.name}</p>
                <div className="flex items-center mt-1">
                  <span className="text-sm text-gray-500">Rating:</span>
                  <span className="ml-1 text-yellow-500">★</span>
                  <span className="text-sm ml-1">{transactionData.buyer.rating}</span>
                </div>
              </div>
              <button className="text-blue-600 text-sm flex items-center">
                <MessageCircle className="w-4 h-4 mr-1" />
                Contact
              </button>
            </div>
          </div>
        </div>

        {/* Transport Details */}
        {transactionData.transport && (
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="text-lg font-medium text-gray-900 mb-3">Transport</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Status</span>
                <span className="text-sm font-medium bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                  {transactionData.transport.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Provider</span>
                <span className="text-sm">{transactionData.transport.provider}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Vehicle Type</span>
                <span className="text-sm">{transactionData.transport.vehicleType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Transport Fee</span>
                <span className="text-sm">KES {transactionData.transport.fee}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Pickup Date</span>
                <span className="text-sm">{formatDate(transactionData.transport.pickupDate)}</span>
              </div>
              <div className="mt-3">
                <button className="w-full py-2 bg-green-600 text-white rounded-lg flex justify-center items-center">
                  <Truck className="w-4 h-4 mr-2" />
                  Track Transport
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Location & Schedule */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h2 className="text-lg font-medium text-gray-900 mb-3">Location & Schedule</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <MapPin className="w-5 h-5 text-gray-500 mr-2 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Pickup Location</p>
                <p className="font-medium">{transactionData.pickupLocation}</p>
              </div>
            </div>

            <div className="flex items-start">
              <MapPin className="w-5 h-5 text-gray-500 mr-2 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Delivery Location</p>
                <p className="font-medium">{transactionData.deliveryLocation}</p>
              </div>
            </div>

            <div className="flex items-start">
              <Calendar className="w-5 h-5 text-gray-500 mr-2 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Scheduled Date</p>
                <p className="font-medium">{formatDate(transactionData.scheduledDate)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h2 className="text-lg font-medium text-gray-900 mb-3">Additional Information</h2>
          <div className="space-y-3">
            {transactionData.notes && (
              <div>
                <p className="text-sm text-gray-500">Notes</p>
                <p className="text-sm">{transactionData.notes}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-500">Created</p>
              <p className="text-sm">{formatDate(transactionData.createdAt)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Last Updated</p>
              <p className="text-sm">{formatDate(transactionData.lastUpdated)}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 mb-4">
          <button className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium">
            Complete Transaction
          </button>
          <button className="flex-1 bg-white border border-gray-300 text-gray-600 py-3 rounded-lg font-medium">
            Report Issue
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailScreen;
