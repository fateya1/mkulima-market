import React from 'react';
import { CheckCircle, Share2, Eye, Plus, Home } from 'lucide-react';

const SuccessScreen = ({ listing, onCreateAnother, onViewListing, onGoHome }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-KE', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatPrice = (price) => {
    return `KES ${price}`;
  };

  // Share the listing (in a real implementation, this would use the Web Share API)
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${listing.product} for sale on MkulimaMarket`,
        text: `${listing.quantity} ${listing.unit} of ${listing.product} available for ${formatPrice(listing.price)}`,
        url: 'https://mkulimamarket.co.ke/listings/' + listing.id,
      })
        .catch((error) => console.log('Error sharing', error));
    } else {
      // Fallback for browsers that don't support the Web Share API
      alert("Use this link to share your listing: https://mkulimamarket.co.ke/listings/" + listing.id);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="bg-green-700 text-white p-6 flex flex-col items-center">
        <div className="bg-white rounded-full p-2 mb-3">
          <CheckCircle size={40} className="text-green-700" />
        </div>
        <h1 className="text-xl font-bold text-center">Listing Created Successfully!</h1>
        <p className="text-sm opacity-90 text-center mt-1">
          Your product is now visible to buyers
        </p>
      </div>

      <div className="flex-1 p-4 overflow-auto">
        {/* Listing Card */}
        <div className="bg-white rounded-lg shadow mb-4">
          {listing.photos && listing.photos.length > 0 && (
            <div className="aspect-video w-full bg-gray-200 rounded-t-lg overflow-hidden">
              <img
                src={listing.photos[0]}
                alt={listing.product}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-4">
            <h2 className="font-bold text-lg">{listing.product}</h2>
            <div className="flex justify-between items-center mt-1">
              <p className="font-medium text-green-700">{formatPrice(listing.price)}</p>
              <p className="text-gray-500 text-sm">{listing.negotiable ? 'Negotiable' : 'Fixed price'}</p>
            </div>

            <div className="mt-3 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Quantity:</span>
                <span className="font-medium">{listing.quantity} {listing.unit}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-500">Quality:</span>
                <span className="font-medium">{listing.quality}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-500">Location:</span>
                <span className="font-medium">{listing.location}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-500">Listed on:</span>
                <span className="font-medium">{formatDate(listing.createdAt || new Date())}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-500">Listing ID:</span>
                <span className="font-medium">{listing.id}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Advice Card */}
        <div className="bg-green-50 rounded-lg p-4 border border-green-200 mb-4">
          <h3 className="font-medium text-green-800 mb-2">What happens next?</h3>
          <ul className="space-y-2 text-sm text-green-700">
            <li className="flex items-start">
              <span className="mr-2 mt-0.5">•</span>
              <span>Interested buyers will contact you through the app</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 mt-0.5">•</span>
              <span>Respond to inquiries promptly to increase your chances of selling</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 mt-0.5">•</span>
              <span>Share your listing with your contacts to reach more buyers</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 mt-0.5">•</span>
              <span>Update your listing if any details change</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 bg-white shadow-inner space-y-3">
        <button
          onClick={handleShare}
          className="w-full py-3 rounded-lg flex items-center justify-center text-white font-medium bg-green-700"
        >
          <Share2 size={20} className="mr-2" />
          Share Listing
        </button>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onViewListing}
            className="py-3 rounded-lg flex items-center justify-center text-green-700 font-medium border border-green-700 bg-white"
          >
            <Eye size={18} className="mr-2" />
            View Listing
          </button>

          <button
            onClick={onCreateAnother}
            className="py-3 rounded-lg flex items-center justify-center text-green-700 font-medium border border-green-700 bg-white"
          >
            <Plus size={18} className="mr-2" />
            Create Another
          </button>
        </div>

        <button
          onClick={onGoHome}
          className="w-full py-3 rounded-lg flex items-center justify-center text-gray-600 font-medium border border-gray-300"
        >
          <Home size={18} className="mr-2" />
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default SuccessScreen;
