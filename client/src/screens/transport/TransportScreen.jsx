import React, { useState, useEffect } from 'react';
import { ArrowLeft, Truck, MapPin, Calendar, Search, Filter, ChevronRight, Clock, User, Package, Star, DollarSign } from 'lucide-react';

const TransportScreen = ({ onBack, onTransportSelect }) => {
  const [activeTab, setActiveTab] = useState('opportunities');
  const [transportOpportunities, setTransportOpportunities] = useState([]);
  const [myTransports, setMyTransports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    distance: 50,
    vehicleType: 'all',
    minFee: 0,
    sortBy: 'distance'
  });

  // Mock data for transport opportunities
  useEffect(() => {
    // Simulate loading from API
    setTimeout(() => {
      const mockTransportOpportunities = [
        {
          id: 'TR-001',
          product: 'Maize',
          quantity: '500 kg',
          pickup: 'Mumias, Kakamega County',
          destination: 'Nakuru Town',
          distance: 120,
          fee: 3500,
          requestedVehicle: 'Pickup Truck',
          pickupDate: '2025-04-15',
          seller: 'Jane Wanjiku',
          sellerRating: 4.2
        },
        {
          id: 'TR-002',
          product: 'Potatoes',
          quantity: '800 kg',
          pickup: 'Molo, Nakuru County',
          destination: 'Nairobi Market',
          distance: 18,
          fee: 2500,
          requestedVehicle: 'Pickup Truck',
          pickupDate: '2025-04-14',
          seller: 'David Kimani',
          sellerRating: 4.7
        },
        {
          id: 'TR-003',
          product: 'Tomatoes',
          quantity: '300 kg',
          pickup: 'Kajiado County',
          destination: 'Nairobi Market',
          distance: 25,
          fee: 1800,
          requestedVehicle: 'Van',
          pickupDate: '2025-04-13',
          seller: 'Sarah Mwangi',
          sellerRating: 4.5
        },
        {
          id: 'TR-004',
          product: 'Cabbage',
          quantity: '600 kg',
          pickup: 'Limuru, Kiambu County',
          destination: 'Westlands, Nairobi',
          distance: 12,
          fee: 1500,
          requestedVehicle: 'Pickup Truck',
          pickupDate: '2025-04-16',
          seller: 'John Kamau',
          sellerRating: 4.0
        },
        {
          id: 'TR-005',
          product: 'Bananas',
          quantity: '450 kg',
          pickup: 'Kisii County',
          destination: 'Nakuru Town',
          distance: 160,
          fee: 4500,
          requestedVehicle: 'Small Truck',
          pickupDate: '2025-04-18',
          seller: 'Grace Otieno',
          sellerRating: 4.8
        }
      ];

      const mockMyTransports = [
        {
          id: 'MT-001',
          product: 'Maize',
          quantity: '700 kg',
          pickup: 'Eldoret, Uasin Gishu County',
          destination: 'Nakuru Town',
          fee: 4000,
          status: 'confirmed', // confirmed, in_transit, completed
          pickupDate: '2025-04-12',
          seller: 'Robert Kiprop',
          sellerRating: 4.3
        },
        {
          id: 'MT-002',
          product: 'Beans',
          quantity: '400 kg',
          pickup: 'Narok County',
          destination: 'Nairobi Market',
          fee: 2800,
          status: 'in_transit',
          pickupDate: '2025-04-11',
          seller: 'Mary Wambui',
          sellerRating: 4.6
        },
        {
          id: 'MT-003',
          product: 'Onions',
          quantity: '350 kg',
          pickup: 'Karatina, Nyeri County',
          destination: 'Thika Town',
          fee: 1800,
          status: 'completed',
          pickupDate: '2025-04-09',
          seller: 'Peter Njoroge',
          sellerRating: 4.4
        }
      ];

      setTransportOpportunities(mockTransportOpportunities);
      setMyTransports(mockMyTransports);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Apply filters to opportunities
  const filteredOpportunities = transportOpportunities.filter(opportunity => {
    if (filters.distance && opportunity.distance > filters.distance) return false;
    if (filters.vehicleType !== 'all' && opportunity.requestedVehicle !== filters.vehicleType) return false;
    if (filters.minFee && opportunity.fee < filters.minFee) return false;
    return true;
  }).sort((a, b) => {
    if (filters.sortBy === 'distance') {
      return a.distance - b.distance;
    } else if (filters.sortBy === 'fee') {
      return b.fee - a.fee;
    } else if (filters.sortBy === 'date') {
      return new Date(a.pickupDate) - new Date(b.pickupDate);
    }
    return 0;
  });

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-KE', options);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'in_transit':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
      <div className="bg-white px-4 py-3 flex items-center shadow-sm">
        <button
          onClick={onBack}
          className="p-1 mr-4 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Transport</h1>
          <p className="text-sm text-gray-500">Find and manage transport opportunities</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white flex border-b border-gray-200">
        <button
          className={`flex-1 py-3 text-sm font-medium ${activeTab === 'opportunities' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('opportunities')}
        >
          Opportunities
        </button>
        <button
          className={`flex-1 py-3 text-sm font-medium ${activeTab === 'my_transports' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('my_transports')}
        >
          My Transports
        </button>
      </div>

      {activeTab === 'opportunities' && (
        <>
          {/* Search and Filter */}
          <div className="bg-white p-4 shadow-sm">
            <div className="relative">
              <input
                type="text"
                placeholder="Search destinations, products..."
                className="w-full px-10 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700"
              />
              <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
              <button
                className="absolute right-3 top-2.5"
                onClick={() => setFilterOpen(!filterOpen)}
              >
                <Filter className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Filter Panel */}
            {filterOpen && (
              <div className="mt-3 bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                <h3 className="font-medium text-gray-800 mb-3">Filters</h3>

                <div className="mb-3">
                  <label className="block text-sm text-gray-600 mb-1">Maximum Distance (km)</label>
                  <div className="flex items-center">
                    <input
                      type="range"
                      min="5"
                      max="200"
                      step="5"
                      value={filters.distance}
                      onChange={(e) => setFilters({ ...filters, distance: parseInt(e.target.value) })}
                      className="w-full"
                    />
                    <span className="ml-2 text-sm font-medium">{filters.distance} km</span>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="block text-sm text-gray-600 mb-1">Vehicle Type</label>
                  <select
                    value={filters.vehicleType}
                    onChange={(e) => setFilters({ ...filters, vehicleType: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="all">All Vehicles</option>
                    <option value="Motorcycle">Motorcycle</option>
                    <option value="Pickup Truck">Pickup Truck</option>
                    <option value="Van">Van</option>
                    <option value="Small Truck">Small Truck</option>
                    <option value="Large Truck">Large Truck</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="block text-sm text-gray-600 mb-1">Minimum Fee (KES)</label>
                  <input
                    type="number"
                    value={filters.minFee}
                    onChange={(e) => setFilters({ ...filters, minFee: parseInt(e.target.value) || 0 })}
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>

                <div className="mb-3">
                  <label className="block text-sm text-gray-600 mb-1">Sort By</label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="distance">Distance (Nearest First)</option>
                    <option value="fee">Fee (Highest First)</option>
                    <option value="date">Date (Earliest First)</option>
                  </select>
                </div>

                <div className="flex space-x-2 mt-4">
                  <button
                    className="flex-1 bg-gray-100 text-gray-600 py-2 rounded-lg text-sm font-medium"
                    onClick={() => setFilters({
                      distance: 50,
                      vehicleType: 'all',
                      minFee: 0,
                      sortBy: 'distance'
                    })}
                  >
                    Reset
                  </button>
                  <button
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm font-medium"
                    onClick={() => setFilterOpen(false)}
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Transport Opportunities List */}
          <div className="p-4">
            <div className="mb-2 flex justify-between items-center">
              <h2 className="text-md font-medium text-gray-900">Available Opportunities</h2>
              <span className="text-sm text-gray-500">{filteredOpportunities.length} found</span>
            </div>

            {filteredOpportunities.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <Truck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-gray-700 font-medium mb-1">No opportunities found</h3>
                <p className="text-gray-500 text-sm">Try adjusting your filters or check back later</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredOpportunities.map(opportunity => (
                  <div key={opportunity.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-medium text-gray-900">{opportunity.product}</h3>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <Package className="w-4 h-4 mr-1" />
                            <span>{opportunity.quantity}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-green-600 font-medium">KES {opportunity.fee}</div>
                          <div className="text-sm text-gray-500 mt-1">{opportunity.distance} km</div>
                        </div>
                      </div>

                      <div className="space-y-2 mb-3">
                        <div className="flex items-start">
                          <MapPin className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
                          <div className="flex-1">
                            <div className="text-sm text-gray-500">Pickup</div>
                            <div className="text-sm">{opportunity.pickup}</div>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <MapPin className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
                          <div className="flex-1">
                            <div className="text-sm text-gray-500">Destination</div>
                            <div className="text-sm">{opportunity.destination}</div>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <Calendar className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
                          <div className="flex-1">
                            <div className="text-sm text-gray-500">Pickup Date</div>
                            <div className="text-sm">{formatDate(opportunity.pickupDate)}</div>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <Truck className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
                          <div className="flex-1">
                            <div className="text-sm text-gray-500">Vehicle Type</div>
                            <div className="text-sm">{opportunity.requestedVehicle}</div>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <User className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
                          <div className="flex-1 flex justify-between">
                            <div>
                              <div className="text-sm text-gray-500">Seller</div>
                              <div className="text-sm">{opportunity.seller}</div>
                            </div>
                            <div className="flex items-center text-yellow-500">
                              <Star className="w-4 h-4 mr-1 fill-current" />
                              <span className="text-sm">{opportunity.sellerRating}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <button
                        className="w-full py-2 bg-green-600 text-white rounded-lg text-sm font-medium"
                        onClick={() => onTransportSelect && onTransportSelect(opportunity)}
                      >
                        Offer Transport
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {activeTab === 'my_transports' && (
        <div className="p-4">
          <div className="mb-2">
            <h2 className="text-md font-medium text-gray-900">My Transports</h2>
          </div>

          {myTransports.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <Truck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-gray-700 font-medium mb-1">No active transports</h3>
              <p className="text-gray-500 text-sm">Browse opportunities to find transport jobs</p>
            </div>
          ) : (
            <div className="space-y-3">
              {myTransports.map(transport => (
                <div key={transport.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="px-4 pt-4 pb-2">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-medium text-gray-900">{transport.product}</h3>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Package className="w-4 h-4 mr-1" />
                          <span>{transport.quantity}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-green-600 font-medium">KES {transport.fee}</div>
                        <div className={`text-xs px-2 py-0.5 rounded-full mt-1 ${getStatusColor(transport.status)}`}>
                          {transport.status.replace('_', ' ').toUpperCase()}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 mb-3">
                      <div className="flex items-start">
                        <MapPin className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
                        <div className="flex-1">
                          <div className="text-sm text-gray-500">Route</div>
                          <div className="text-sm">{transport.pickup} to {transport.destination}</div>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <Calendar className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
                        <div className="flex-1">
                          <div className="text-sm text-gray-500">Pickup Date</div>
                          <div className="text-sm">{formatDate(transport.pickupDate)}</div>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <User className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
                        <div className="flex-1 flex justify-between">
                          <div>
                            <div className="text-sm text-gray-500">Seller</div>
                            <div className="text-sm">{transport.seller}</div>
                          </div>
                          <div className="flex items-center text-yellow-500">
                            <Star className="w-4 h-4 mr-1 fill-current" />
                            <span className="text-sm">{transport.sellerRating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 px-4 py-2 flex justify-between items-center border-t border-gray-100">
                    <div className="flex items-center text-sm">
                      <Clock className="w-4 h-4 text-gray-400 mr-1" />
                      <span className="text-gray-500">
                        {transport.status === 'confirmed' ? 'Pickup scheduled' :
                          transport.status === 'in_transit' ? 'In transit' : 'Completed'}
                      </span>
                    </div>
                    <button className="text-blue-600 text-sm flex items-center">
                      Details
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TransportScreen;
