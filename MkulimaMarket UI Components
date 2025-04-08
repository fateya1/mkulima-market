import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Search, 
  Phone, 
  User, 
  Star, 
  MessageCircle, 
  MapPin, 
  Calendar, 
  Truck, 
  AlertCircle, 
  Camera, 
  BarChart2, 
  DollarSign, 
  Check, 
  X
} from 'lucide-react';

// App wrapper with the main color scheme
const AppWrapper = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 font-sans">
      <div className="max-w-md mx-auto bg-white shadow-lg">
        {children}
      </div>
    </div>
  );
};

// Primary header component with branding
const Header = ({ title, showBack = false, onBack = () => {} }) => {
  return (
    <div className="sticky top-0 z-50 bg-green-600 text-white p-4 shadow-md">
      <div className="flex items-center justify-between">
        {showBack ? (
          <button onClick={onBack} className="text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        ) : (
          <div className="flex items-center space-x-1">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
              <div className="w-6 h-6 text-green-600 flex items-center justify-center font-bold">M</div>
            </div>
            <div className="font-bold">MkulimaMarket</div>
          </div>
        )}
        <div className="text-lg font-semibold">{title}</div>
        <button className="text-white">
          <User size={24} />
        </button>
      </div>
    </div>
  );
};

// Language selector component
const LanguageSelector = () => {
  const [language, setLanguage] = useState('Swahili');
  const [isOpen, setIsOpen] = useState(false);
  
  const languages = ['Swahili', 'English', 'Kikuyu', 'Luo', 'Kamba'];
  
  return (
    <div className="relative">
      <button 
        className="flex items-center justify-between w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <div className="text-gray-800">{language}</div>
        </div>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      
      {isOpen && (
        <div className="absolute w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
          {languages.map((lang) => (
            <button
              key={lang}
              className={`w-full p-3 text-left hover:bg-gray-100 ${language === lang ? 'bg-green-50 text-green-700' : 'text-gray-800'}`}
              onClick={() => {
                setLanguage(lang);
                setIsOpen(false);
              }}
            >
              {lang}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Primary Button Component
const PrimaryButton = ({ children, onClick, className = "", disabled = false }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow transition duration-200 flex items-center justify-center ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  );
};

// Secondary Button Component
const SecondaryButton = ({ children, onClick, className = "", disabled = false }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-3 px-4 border border-green-600 text-green-600 bg-white hover:bg-green-50 font-medium rounded-lg shadow-sm transition duration-200 flex items-center justify-center ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  );
};

// Search bar component with location
const SearchBar = ({ placeholder = "Search products or buyers" }) => {
  return (
    <div className="p-4 sticky top-16 z-40 bg-white shadow-sm">
      <div className="relative flex items-center">
        <Search size={20} className="absolute left-3 text-gray-400" />
        <input
          type="text"
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>
      <div className="flex items-center mt-2 text-sm text-gray-500">
        <MapPin size={16} className="mr-1 text-green-600" />
        <span>Machakos County</span>
      </div>
    </div>
  );
};

// Product Card Component for listings
const ProductCard = ({ product, onPress }) => {
  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden m-3 border border-gray-200"
      onClick={onPress}
    >
      <div className="flex">
        <div className="w-1/3 h-32 bg-gray-200 relative">
          {product.image ? (
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <Camera size={24} />
            </div>
          )}
        </div>
        <div className="w-2/3 p-3">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
            <div className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
              {product.quantity} {product.unit}
            </div>
          </div>
          
          <div className="flex items-center mt-1 text-sm text-gray-500">
            <MapPin size={14} className="mr-1" />
            <span>{product.location}</span>
          </div>
          
          <div className="flex items-center mt-1 text-sm text-gray-500">
            <Calendar size={14} className="mr-1" />
            <span>{product.availability}</span>
          </div>
          
          <div className="flex justify-between items-center mt-2">
            <div className="text-lg font-bold text-green-700">
              KES {product.price}
              <span className="text-xs text-gray-500 font-normal">/{product.unit}</span>
            </div>
            <div className="flex items-center text-sm">
              <Star size={14} className="text-yellow-500 mr-1" />
              <span>{product.rating}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Farmer Profile Card Component
const FarmerCard = ({ farmer, onPress }) => {
  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden m-3 border border-gray-200"
      onClick={onPress}
    >
      <div className="p-4">
        <div className="flex items-center">
          <div className="w-14 h-14 bg-gray-200 rounded-full mr-3 overflow-hidden">
            {farmer.image ? (
              <img src={farmer.image} alt={farmer.name} className="w-full h-full object-cover" />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <User size={24} />
              </div>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{farmer.name}</h3>
            <div className="flex items-center text-sm text-gray-500">
              <MapPin size={14} className="mr-1" />
              <span>{farmer.location}</span>
            </div>
          </div>
          <div className="ml-auto flex flex-col items-end">
            <div className="flex items-center text-sm mb-1">
              <Star size={16} className="text-yellow-500 mr-1" />
              <span className="font-medium">{farmer.rating}</span>
            </div>
            <div className="text-xs text-gray-500">{farmer.transactionCount} sales</div>
          </div>
        </div>
        
        <div className="mt-3 border-t border-gray-200 pt-3">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Available Products:</h4>
          <div className="flex flex-wrap gap-2">
            {farmer.products.map((product, i) => (
              <div key={i} className="bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs">
                {product}
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-between mt-4">
          <SecondaryButton className="mr-2 py-2">
            <Phone size={16} className="mr-1" /> Call
          </SecondaryButton>
          <PrimaryButton className="ml-2 py-2">
            <MessageCircle size={16} className="mr-1" /> Message
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};

// Transport Card Component
const TransportCard = ({ transport, onPress }) => {
  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden m-3 border border-gray-200"
      onClick={onPress}
    >
      <div className="p-4">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full mr-3 flex items-center justify-center text-blue-600">
            <Truck size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{transport.provider}</h3>
            <div className="text-sm text-gray-500">{transport.vehicleType}</div>
          </div>
          <div className="ml-auto">
            <div className="text-lg font-bold text-green-700">
              KES {transport.rate}
            </div>
            <div className="text-xs text-gray-500 text-right">{transport.rateUnit}</div>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-3 text-sm">
          <div className="flex items-center text-gray-500">
            <MapPin size={16} className="mr-1" />
            <span>{transport.distance} km away</span>
          </div>
          <div className="flex items-center">
            <Star size={16} className="text-yellow-500 mr-1" />
            <span className="font-medium">{transport.rating}</span>
          </div>
        </div>
        
        <div className="mt-3 text-sm text-gray-600">
          <div className="flex justify-between border-t border-gray-200 pt-2">
            <span>Capacity:</span>
            <span className="font-medium">{transport.capacity}</span>
          </div>
          <div className="flex justify-between mt-1">
            <span>Available:</span>
            <span className="font-medium">{transport.availability}</span>
          </div>
          <div className="flex justify-between mt-1">
            <span>Completed trips:</span>
            <span className="font-medium">{transport.completedTrips}</span>
          </div>
        </div>
        
        <PrimaryButton className="mt-4">
          Book Transport
        </PrimaryButton>
      </div>
    </div>
  );
};

// Bottom Navigation Component
const BottomNav = ({ active }) => {
  const items = [
    { key: 'home', label: 'Home', icon: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg> },
    { key: 'market', label: 'Market', icon: <BarChart2 size={24} /> },
    { key: 'sell', label: 'Sell', icon: <DollarSign size={24} /> },
    { key: 'transport', label: 'Transport', icon: <Truck size={24} /> },
    { key: 'profile', label: 'Profile', icon: <User size={24} /> },
  ];
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="max-w-md mx-auto flex justify-between">
        {items.map((item) => (
          <button 
            key={item.key} 
            className={`flex flex-col items-center justify-center p-2 flex-1 ${active === item.key ? 'text-green-600' : 'text-gray-500'}`}
          >
            {item.icon}
            <span className="text-xs mt-1">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

// Market Price Card Component
const MarketPriceCard = ({ title, data }) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden m-3 border border-gray-200">
      <div className="p-4">
        <div 
          className="flex justify-between items-center cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
        
        {expanded && (
          <div className="mt-3 border-t border-gray-200 pt-3">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500">
                  <th className="pb-2">Product</th>
                  <th className="pb-2">Current Price</th>
                  <th className="pb-2">Change</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index} className="border-t border-gray-100">
                    <td className="py-2">{item.product}</td>
                    <td className="py-2 font-medium">KES {item.price}/{item.unit}</td>
                    <td className={`py-2 ${item.change > 0 ? 'text-green-600' : item.change < 0 ? 'text-red-600' : 'text-gray-500'}`}>
                      {item.change > 0 ? '+' : ''}{item.change}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// Transaction Status Card Component
const TransactionStatusCard = ({ transaction }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'in_progress': return 'bg-blue-100 text-blue-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };
  
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <Check size={16} />;
      case 'pending': return <AlertCircle size={16} />;
      case 'in_progress': return <Truck size={16} />;
      case 'cancelled': return <X size={16} />;
      default: return <AlertCircle size={16} />;
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden m-3 border border-gray-200">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{transaction.product}</h3>
            <div className="text-sm text-gray-500 mt-1">{transaction.quantity} {transaction.unit} • KES {transaction.price}</div>
          </div>
          <div className={`px-3 py-1 rounded-full flex items-center text-xs font-medium ${getStatusColor(transaction.status)}`}>
            {getStatusIcon(transaction.status)}
            <span className="ml-1">{transaction.statusText}</span>
          </div>
        </div>
        
        <div className="flex items-center mt-3 text-sm text-gray-500">
          <div className="flex items-center">
            {transaction.buyer.image ? (
              <img src={transaction.buyer.image} alt={transaction.buyer.name} className="w-6 h-6 rounded-full mr-1" />
            ) : (
              <User size={16} className="mr-1" />
            )}
            <span>{transaction.buyer.name}</span>
          </div>
          <div className="mx-2">•</div>
          <div className="flex items-center">
            <Calendar size={14} className="mr-1" />
            <span>{transaction.date}</span>
          </div>
        </div>
        
        <div className="flex mt-4">
          <SecondaryButton className="mr-2 py-2">
            <MessageCircle size={16} className="mr-1" /> Message
          </SecondaryButton>
          <PrimaryButton className="ml-2 py-2">
            View Details
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};

// Quality Selection Component with visual indicators
const QualitySelector = ({ onChange }) => {
  const [selected, setSelected] = useState('medium');
  
  const qualities = [
    { id: 'premium', label: 'Premium', description: 'Highest quality, perfect condition' },
    { id: 'good', label: 'Good', description: 'Good quality, minor imperfections' },
    { id: 'medium', label: 'Medium', description: 'Average quality, some imperfections' },
    { id: 'fair', label: 'Fair', description: 'Below average, visible defects' }
  ];
  
  const handleSelect = (quality) => {
    setSelected(quality);
    if (onChange) {
      onChange(quality);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Product Quality</h3>
      <div className="space-y-2">
        {qualities.map((quality) => (
          <div 
            key={quality.id}
            className={`p-3 rounded-lg border ${selected === quality.id ? 'border-green-600 bg-green-50' : 'border-gray-200'} cursor-pointer`}
            onClick={() => handleSelect(quality.id)}
          >
            <div className="flex items-center">
              <div className={`w-4 h-4 rounded-full mr-3 flex-shrink-0 ${selected === quality.id ? 'bg-green-600' : 'border border-gray-400'}`}>
                {selected === quality.id && (
                  <div className="w-full h-full flex items-center justify-center text-white">
                    <Check size={12} />
                  </div>
                )}
              </div>
              <div>
                <div className="font-medium text-gray-800">{quality.label}</div>
                <div className="text-xs text-gray-500">{quality.description}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Sample data for demonstrations
const sampleProducts = [
  {
    id: 1,
    name: 'Fresh Tomatoes',
    quantity: '50',
    unit: 'kg',
    location: 'Machakos',
    availability: 'Available now',
    price: '45',
    rating: '4.5',
    image: '/api/placeholder/400/320'
  },
  {
    id: 2,
    name: 'Maize',
    quantity: '200',
    unit: 'kg',
    location: 'Nakuru',
    availability: 'Available in 2 days',
    price: '30',
    rating: '4.2',
    image: null
  }
];

const sampleFarmers = [
  {
    id: 1,
    name: 'Jane Wanjiku',
    location: 'Kakamega County',
    rating: '4.7',
    transactionCount: 27,
    image: null,
    products: ['Maize', 'Beans', 'Potatoes']
  }
];

const sampleTransport = [
  {
    id: 1,
    provider: 'Samuel Njoroge',
    vehicleType: 'Pickup Truck',
    rate: '1,500',
    rateUnit: 'per trip',
    distance: '3.5',
    rating: '4.6',
    capacity: '750 kg',
    availability: 'Today',
    completedTrips: 43
  }
];

const sampleMarketPrices = [
  { product: 'Tomatoes', price: '45', unit: 'kg', change: 5 },
  { product: 'Maize', price: '30', unit: 'kg', change: -2 },
  { product: 'Potatoes', price: '35', unit: 'kg', change: 0 },
  { product: 'Beans', price: '80', unit: 'kg', change: 3 }
];

const sampleTransaction = {
  id: 1,
  product: 'Fresh Tomatoes',
  quantity: '50',
  unit: 'kg',
  price: '2,250',
  status: 'in_progress',
  statusText: 'In Transit',
  date: 'Apr 5, 2025',
  buyer: {
    name: 'Mohammed Ismail',
    image: null
  }
};

// Combine components to show examples
const MkulimaMarketComponentDemo = () => {
  return (
    <AppWrapper>
      <Header title="Home" />
      
      <div className="py-4 px-4 bg-white">
        <h2 className="text-xl font-bold mb-4">MkulimaMarket Components</h2>
        <p className="text-gray-600 mb-8">Mobile-first UI components for the agricultural marketplace platform.</p>
        
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-3">Language Selection</h3>
          <LanguageSelector />
        </div>
        
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-3">Search</h3>
          <SearchBar />
        </div>
        
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-3">Product Listings</h3>
          {sampleProducts.map(product => (
            <ProductCard key={product.id} product={product} onPress={() => {}} />
          ))}
        </div>
        
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-3">Farmer Profile</h3>
          {sampleFarmers.map(farmer => (
            <FarmerCard key={farmer.id} farmer={farmer} onPress={() => {}} />
          ))}
        </div>
        
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-3">Transport Listings</h3>
          {sampleTransport.map(transport => (
            <TransportCard key={transport.id} transport={transport} onPress={() => {}} />
          ))}
        </div>
        
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-3">Market Price Information</h3>
          <MarketPriceCard title="Current Market Prices" data={sampleMarketPrices} />
        </div>
        
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-3">Transaction Status</h3>
          <TransactionStatusCard transaction={sampleTransaction} />
        </div>
        
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-3">Quality Selection</h3>
          <QualitySelector onChange={() => {}} />
        </div>
        
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-3">Action Buttons</h3>
          <div className="space-y-3">
            <PrimaryButton>Post Your Product</PrimaryButton>
            <SecondaryButton>View More Options</SecondaryButton>
          </div>
        </div>
      </div>
      
      <div className="pb-20">
        <BottomNav active="home" />
      </div>
    </AppWrapper>
  );
};

export default MkulimaMarketComponentDemo;
