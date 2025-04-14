import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Star, User, Phone, MessageCircle, TruckIcon, Calendar, Shield, Clock, AlertCircle } from 'lucide-react';

const ListingDetailScreen = () => {
  const [listing, setListing] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showContact, setShowContact] = useState(false);

  useEffect(() => {
    const fetchListingData = async () => {
      try {
        // This would be replaced with actual API call
        // const response = await api.get(`/listings/${listingId}`);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));

        // Mock data for demonstration
        const mockListing = {
          id: 'L12345',
          title: 'Premium Fresh Tomatoes',
          description: 'High quality tomatoes, freshly harvested from my farm in Kiambu. Deep red color, firm texture, and excellent flavor. Ideal for restaurants and retailers.',
          price: {
            amount: 45,
            currency: 'KES',
            unit: 'kg',
            isNegotiable: true,
            minAcceptable: 40
          },
          quantity: {
            available: 150,
            unit: 'kg',
            minimum: 20
          },
          quality: {
            description: 'Grade A - Premium quality',
            attributes: {
              size: 'Medium to Large',
              color: 'Deep Red',
              damage: 'Less than 2%',
              ripeness: 'Fully ripe, ready for immediate use'
            }
          },
          images: [
            'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=1000',
            'https://images.unsplash.com/photo-1561136594-7f68413baa99?q=80&w=1000',
            'https://images.unsplash.com/photo-1471194402529-8e0f5a675de6?q=80&w=1000'
          ],
          location: {
            display: 'Kiambu County, 20km from Nairobi',
            coordinates: [-1.1713, 36.8315]
          },
          seller: {
            id: 'U789',
            name: 'David Kimani',
            rating: 4.8,
            reviewCount: 24,
            verificationLevel: 'standard',
            memberSince: '2023-09-01'
          },
          availability: {
            startDate: '2025-04-05',
            endDate: '2025-04-25',
            isRecurring: false
          },
          delivery: {
            options: ['pickup', 'delivery'],
            transportAvailable: true,
            estimatedCost: {
              amount: 500,
              currency: 'KES',
              description: 'Per trip within 20km'
            }
          },
          views: 78,
          createdAt: '2025-04-03T10:15:30Z',
          updatedAt: '2025-04-03T10:15:30Z'
        };

        setListing(mockListing);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching listing data:', error);
        setIsLoading(false);
      }
    };

    fetchListingData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700"></div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="p-4 text-center">
        <p>Could not load listing information. Please try again.</p>
        <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg">
          Retry
        </button>
      </div>
    );
  }

  const verificationBadge = () => {
    switch (listing.seller.verificationLevel) {
      case 'basic':
        return <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">Basic</span>;
      case 'standard':
        return <span className="text-xs bg-green-200 text-green-700 px-2 py-1 rounded-full">Verified</span>;
      case 'enhanced':
        return <span className="text-xs bg-blue-200 text-blue-700 px-2 py-1 rounded-full">Enhanced</span>;
      default:
        return null;
    }
  };

  const calculateTimeRemaining = () => {
    const endDate = new Date(listing.availability.endDate);
    const now = new Date();
    const diffTime = endDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
      return 'Listing expired';
    } else if (diffDays === 1) {
      return '1 day remaining';
    } else {
      return `${diffDays} days remaining`;
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen pb-16">
      {/* Header with back button */}
      <div className="bg-white p-4 shadow-sm flex items-center">
        <button className="mr-4">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-semibold">Listing Details</h1>
      </div>

      {/* Image Gallery */}
      <div className="relative">
        <div className="bg-black h-64 w-full">
          {listing.images && listing.images.length > 0 ? (
            <img
              src={listing.images[selectedImage]}
              alt={listing.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <p className="text-gray-500">No image available</p>
            </div>
          )}
        </div>

        {/* Thumbnail navigation */}
        {listing.images && listing.images.length > 1 && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-2">
            {listing.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`w-2 h-2 rounded-full ${selectedImage === index ? 'bg-white' : 'bg-white bg-opacity-50'}`}
              />
            ))}
          </div>
        )}

        {/* Availability badge */}
        <div className="absolute top-2 right-2">
          <div className="bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-md flex items-center">
            <Clock size={12} className="mr-1" />
            {calculateTimeRemaining()}
          </div>
        </div>
      </div>

      {/* Listing Header Information */}
      <div className="p-4 bg-white shadow-sm">
        <h1 className="text-xl font-semibold">{listing.title}</h1>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center text-green-600 font-semibold">
            <span className="text-lg">KES {listing.price.amount}</span>
            <span className="text-gray-600 text-sm ml-1">/ {listing.price.unit}</span>
          </div>

          <div className="flex items-center">
            <MapPin size={14} className="text-gray-500 mr-1" />
            <span className="text-sm text-gray-600">{listing.location.display.split(',')[0]}</span>
          </div>
        </div>

        {listing.price.isNegotiable && (
          <div className="mt-1 text-xs text-blue-600">
            Price is negotiable
          </div>
        )}
      </div>

      {/* Seller Information */}
      <div className="mt-3 p-4 bg-white shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center">
              <User size={20} className="text-gray-600" />
            </div>
            <div className="ml-3">
              <div className="flex items-center">
                <p className="font-medium">{listing.seller.name}</p>
                <div className="ml-2">{verificationBadge()}</div>
              </div>
              <div className="flex items-center mt-1">
                <Star size={14} className="text-yellow-500" />
                <span className="text-sm ml-1">{listing.seller.rating} ({listing.seller.reviewCount} reviews)</span>
              </div>
            </div>
          </div>

          <button
            className="text-green-600 text-sm font-medium"
            onClick={() => setShowContact(!showContact)}
          >
            {showContact ? 'Hide Contact' : 'View Contact'}
          </button>
        </div>

        {showContact && (
          <div className="mt-3 pt-3 border-t">
            <div className="flex items-center">
              <Phone size={16} className="text-gray-600 mr-2" />
              <span>+254712345678</span>
            </div>
          </div>
        )}
      </div>

      {/* Listing Details */}
      <div className="mt-3 p-4 bg-white shadow-sm">
        <h2 className="font-semibold text-gray-800">Details</h2>

        <div className="mt-3 space-y-4">
          <div>
            <h3 className="text-sm text-gray-600">Description</h3>
            <p className="mt-1">{listing.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm text-gray-600">Quantity Available</h3>
              <p className="font-medium mt-1">{listing.quantity.available} {listing.quantity.unit}</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-600">Minimum Order</h3>
              <p className="font-medium mt-1">{listing.quantity.minimum} {listing.quantity.unit}</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm text-gray-600">Quality</h3>
            <p className="font-medium mt-1">{listing.quality.description}</p>
            <div className="mt-2 space-y-1">
              {Object.entries(listing.quality.attributes).map(([key, value]) => (
                <div key={key} className="text-sm">
                  <span className="text-gray-600 capitalize">{key}:</span> {value}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm text-gray-600">Availability</h3>
            <div className="flex items-center mt-1">
              <Calendar size={16} className="text-gray-600 mr-2" />
              <p>{new Date(listing.availability.startDate).toLocaleDateString('en-GB', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })} - {new Date(listing.availability.endDate).toLocaleDateString('en-GB', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm text-gray-600">Delivery Options</h3>
            <div className="mt-1">
              {listing.delivery.options.includes('pickup') && (
                <div className="flex items-center mb-1">
                  <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center mr-2">
                    <div className="w-2 h-2 rounded-full bg-green-600"></div>
                  </div>
                  <span>Pickup available at farm location</span>
                </div>
              )}

              {listing.delivery.options.includes('delivery') && (
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center mr-2">
                    <div className="w-2 h-2 rounded-full bg-green-600"></div>
                  </div>
                  <span>Delivery available</span>
                </div>
              )}

              {listing.delivery.transportAvailable && (
                <div className="mt-2 flex items-center text-sm text-gray-600">
                  <TruckIcon size={14} className="mr-1" />
                  <span>Transport cost: KES {listing.delivery.estimatedCost.amount} ({listing.delivery.estimatedCost.description})</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="mt-3 p-4 bg-white shadow-sm">
        <div className="flex items-center text-xs text-gray-500">
          <Clock size={12} className="mr-1" />
          <span>Listed on {new Date(listing.createdAt).toLocaleDateString('en-GB', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}</span>
          <div className="mx-2">•</div>
          <div className="flex items-center">
            <span>ID: {listing.id}</span>
          </div>
          <div className="mx-2">•</div>
          <div className="flex items-center">
            <span>{listing.views} views</span>
          </div>
        </div>

        <div className="mt-4 flex items-center text-xs">
          <Shield size={12} className="text-green-600 mr-1" />
          <span className="text-gray-600">Listing is verified for quality and accuracy</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-md">
        <div className="flex space-x-3">
          <button className="flex-1 flex items-center justify-center bg-white border border-green-600 text-green-600 py-3 rounded-lg font-medium">
            <MessageCircle size={18} className="mr-2" />
            Message
          </button>

          <button className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium">
            Start Transaction
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListingDetailScreen;
