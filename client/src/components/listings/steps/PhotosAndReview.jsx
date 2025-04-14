import React, { useState } from 'react';
import { Camera, Upload, Edit, Check, ArrowRight } from 'lucide-react';

const PhotosAndReview = ({ productData, onEdit, onSubmit }) => {
  const [photos, setPhotos] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddPhoto = (e) => {
    // In a real implementation, this would handle file upload
    // For demo purposes, we're just creating placeholder URLs
    if (e.target.files && e.target.files[0]) {
      const newPhotos = [...photos];
      newPhotos.push(URL.createObjectURL(e.target.files[0]));
      setPhotos(newPhotos);
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      onSubmit({ ...productData, photos });
    }, 1000);
  };

  const formatPrice = (price) => {
    return `KES ${price}`;
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="bg-green-700 text-white p-4">
        <h1 className="text-xl font-bold">Step 4: Add Photos & Review</h1>
        <p className="text-sm opacity-90">Clear photos help your product sell faster</p>
      </div>

      <div className="flex-1 p-4 overflow-auto">
        {/* Photo Upload Section */}
        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <h2 className="font-medium text-lg mb-2">Product Photos</h2>
          <p className="text-gray-600 text-sm mb-4">Add up to 4 clear photos of your product</p>

          <div className="grid grid-cols-2 gap-2 mb-4">
            {photos.map((photo, index) => (
              <div key={index} className="aspect-square rounded-lg bg-gray-200 overflow-hidden">
                <img src={photo} alt={`Product photo ${index + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}

            {photos.length < 4 && (
              <label className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer bg-gray-50">
                <Camera size={32} className="text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">Add Photo</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleAddPhoto} />
              </label>
            )}
          </div>

          <div className="flex items-center">
            <div className="flex-1">
              <label className="flex items-center gap-2 text-green-700 font-medium cursor-pointer">
                <Upload size={20} />
                <span>Upload from gallery</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleAddPhoto} />
              </label>
            </div>

            <div className="flex-1">
              <label className="flex items-center gap-2 text-green-700 font-medium cursor-pointer">
                <Camera size={20} />
                <span>Take photo</span>
                <input type="file" className="hidden" accept="image/*" capture="environment" onChange={handleAddPhoto} />
              </label>
            </div>
          </div>
        </div>

        {/* Product Review Section */}
        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-medium text-lg">Review Details</h2>
            <button onClick={() => onEdit('details')} className="text-green-700 flex items-center">
              <Edit size={16} className="mr-1" />
              <span className="text-sm">Edit</span>
            </button>
          </div>

          <div className="border-b pb-2 mb-2">
            <p className="text-gray-500 text-sm">Product</p>
            <p className="font-medium">{productData.product}</p>
          </div>

          <div className="border-b pb-2 mb-2">
            <p className="text-gray-500 text-sm">Quantity</p>
            <p className="font-medium">{productData.quantity} {productData.unit}</p>
          </div>

          <div className="flex justify-between border-b pb-2 mb-2">
            <div>
              <p className="text-gray-500 text-sm">Price</p>
              <p className="font-medium">{formatPrice(productData.price)}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Negotiable</p>
              <p className="font-medium">{productData.negotiable ? 'Yes' : 'No'}</p>
            </div>
          </div>

          <div className="border-b pb-2 mb-2">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm">Quality</p>
                <p className="font-medium">{productData.quality}</p>
              </div>
              <button onClick={() => onEdit('quality')} className="text-green-700 flex items-center">
                <Edit size={16} className="mr-1" />
                <span className="text-sm">Edit</span>
              </button>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm">Location</p>
                <p className="font-medium">{productData.location}</p>
              </div>
              <button onClick={() => onEdit('location')} className="text-green-700 flex items-center">
                <Edit size={16} className="mr-1" />
                <span className="text-sm">Edit</span>
              </button>
            </div>
          </div>
        </div>

        {/* Market Information */}
        <div className="bg-green-50 rounded-lg p-4 border border-green-200 mb-4">
          <h3 className="font-medium text-green-800 mb-2">Market Information</h3>
          <p className="text-sm text-green-700 mb-1">Current average price: KES 45-50 per kg</p>
          <p className="text-sm text-green-700">Demand: High in Nairobi, Moderate in local markets</p>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="p-4 bg-white shadow-inner">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || photos.length === 0}
          className={`w-full py-3 rounded-lg flex items-center justify-center text-white font-medium ${isSubmitting || photos.length === 0 ? 'bg-gray-400' : 'bg-green-700'}`}
        >
          {isSubmitting ? (
            <>Processing...</>
          ) : (
            <>
              Submit Listing
              <ArrowRight size={20} className="ml-2" />
            </>
          )}
        </button>
        <p className="text-center text-xs text-gray-500 mt-2">
          By submitting, you agree to our marketplace terms and conditions
        </p>
      </div>
    </div>
  );
};

export default PhotosAndReview;
