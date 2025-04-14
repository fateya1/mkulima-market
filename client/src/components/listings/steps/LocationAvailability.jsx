// LocationAvailability.jsx - Step 3 of the create listing flow
import React, { useState, useEffect } from 'react';
import listingsApi from '../../../store/api/listingsApi';

/**
 * Third step in product listing creation flow
 * Handles location setting and availability period for the listing
 */
const LocationAvailability = ({ onNext, onBack, initialData = {}, onDataChange }) => {
  const [userLocations, setUserLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    location: {
      location_id: initialData.location?.location_id || '',
      display_precision: initialData.location?.display_precision || 'ward',
      new_location: initialData.location?.new_location || false,
      address_description: initialData.location?.address_description || '',
      county: initialData.location?.county || '',
      sub_county: initialData.location?.sub_county || '',
      ward: initialData.location?.ward || '',
      latitude: initialData.location?.latitude || '',
      longitude: initialData.location?.longitude || ''
    },
    availability: {
      start_date: initialData.availability?.start_date || '',
      end_date: initialData.availability?.end_date || '',
      is_recurring: initialData.availability?.is_recurring || false,
      days_available: initialData.availability?.days_available || []
    },
    ...initialData
  });

  // Load user locations when component mounts
  useEffect(() => {
    const loadUserLocations = async () => {
      try {
        setLoading(true);
        const data = await listingsApi.getUserLocations();
        setUserLocations(data);
        setLoading(false);
      } catch (err) {
        console.error('Error loading user locations:', err);
        setLoading(false);
      }
    };

    loadUserLocations();
  }, []);

  // Update parent component when form data changes
  useEffect(() => {
    if (onDataChange) {
      onDataChange(formData);
    }
  }, [formData, onDataChange]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith('location.')) {
      const locationField = name.split('.')[1];
      const fieldValue = type === 'checkbox' ? checked : value;

      setFormData({
        ...formData,
        location: {
          ...formData.location,
          [locationField]: fieldValue
        }
      });
    } else if (name.startsWith('availability.')) {
      const availabilityField = name.split('.')[1];
      const fieldValue = type === 'checkbox' ? checked : value;

      if (name === 'availability.days_available') {
        // Handle multiple checkbox selections for days
        const dayValue = value;
        const currentDays = [...formData.availability.days_available];

        if (checked) {
          // Add the day if it's not already in the array
          if (!currentDays.includes(dayValue)) {
            currentDays.push(dayValue);
          }
        } else {
          // Remove the day from the array
          const index = currentDays.indexOf(dayValue);
          if (index !== -1) {
            currentDays.splice(index, 1);
          }
        }

        setFormData({
          ...formData,
          availability: {
            ...formData.availability,
            days_available: currentDays
          }
        });
      } else {
        setFormData({
          ...formData,
          availability: {
            ...formData.availability,
            [availabilityField]: fieldValue
          }
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Handle location selection from existing locations
  const handleLocationSelect = (locationId) => {
    // Find the selected location from userLocations
    const selectedLocation = userLocations.find(loc => loc.id === locationId);

    if (selectedLocation) {
      setFormData({
        ...formData,
        location: {
          ...formData.location,
          location_id: locationId,
          new_location: false,
          address_description: selectedLocation.address_description || '',
          county: selectedLocation.county || '',
          sub_county: selectedLocation.sub_county || '',
          ward: selectedLocation.ward || '',
          latitude: selectedLocation.latitude || '',
          longitude: selectedLocation.longitude || ''
        }
      });
    }
  };

  // Format date string for date inputs
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  // Validate form before proceeding to next step
  const validateForm = () => {
    // Validate location data
    if (!formData.location.new_location && !formData.location.location_id) {
      setError('Please select a location or create a new one');
      return false;
    }

    if (formData.location.new_location) {
      if (!formData.location.county || !formData.location.sub_county || !formData.location.ward) {
        setError('Please provide complete location information');
        return false;
      }
    }

    // Validate availability data
    if (!formData.availability.start_date) {
      setError('Please specify when the product will be available');
      return false;
    }

    if (!formData.availability.end_date) {
      setError('Please specify until when the product will be available');
      return false;
    }

    const startDate = new Date(formData.availability.start_date);
    const endDate = new Date(formData.availability.end_date);

    if (startDate > endDate) {
      setError('End date must be after start date');
      return false;
    }

    if (formData.availability.is_recurring && formData.availability.days_available.length === 0) {
      setError('Please select at least one day when the product is available');
      return false;
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (validateForm()) {
      onNext(formData);
    }
  };

  // Location display precision options
  const precisionOptions = [
    { value: 'exact', label: 'Exact Location (Most Precise)' },
    { value: 'ward', label: 'Ward Level (Recommended)' },
    { value: 'sub_county', label: 'Sub-County Level' },
    { value: 'county', label: 'County Level (Least Precise)' }
  ];

  // Days of week for recurring availability
  const daysOfWeek = [
    { value: 'monday', label: 'Monday' },
    { value: 'tuesday', label: 'Tuesday' },
    { value: 'wednesday', label: 'Wednesday' },
    { value: 'thursday', label: 'Thursday' },
    { value: 'friday', label: 'Friday' },
    { value: 'saturday', label: 'Saturday' },
    { value: 'sunday', label: 'Sunday' }
  ];

  // Component for the map preview (would integrate with Google Maps or similar)
  const MapPreview = () => (
    <div className="bg-gray-200 h-48 rounded-lg flex items-center justify-center">
      <span className="text-gray-500">Map preview would appear here</span>
    </div>
  );

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Location & Availability</h2>

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Location Section */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-700 mb-3">Product Location</h3>

          {/* Existing Locations */}
          {!loading && userLocations.length > 0 && (
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Select from your existing locations
              </label>
              <div className="grid grid-cols-1 gap-2 mb-3">
                {userLocations.map((location) => (
                  <label
                    key={location.id}
                    className={`
                      flex items-center p-3 border rounded-lg cursor-pointer transition-colors
                      ${formData.location.location_id === location.id
                        ? 'bg-green-100 border-green-500 text-green-700'
                        : 'border-gray-300 hover:bg-gray-50'}
                    `}
                  >
                    <input
                      type="radio"
                      name="location.location_id"
                      value={location.id}
                      checked={formData.location.location_id === location.id}
                      onChange={() => handleLocationSelect(location.id)}
                      className="mr-2"
                    />
                    <div>
                      <p className="font-medium">{location.address_description}</p>
                      <p className="text-sm text-gray-600">
                        {location.ward}, {location.sub_county}, {location.county}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Option to add new location */}
          <div className="mb-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="location.new_location"
                checked={formData.location.new_location}
                onChange={handleChange}
                className="rounded text-green-600 focus:ring-green-500 h-5 w-5"
              />
              <span className="ml-2 text-gray-700">
                Add a new location
              </span>
            </label>
          </div>

          {/* New Location Form */}
          {formData.location.new_location && (
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 mb-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Location Description
                  </label>
                  <input
                    type="text"
                    name="location.address_description"
                    value={formData.location.address_description}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="E.g., Farm near Mwiki Primary School"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">
                      County *
                    </label>
                    <input
                      type="text"
                      name="location.county"
                      value={formData.location.county}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="County"
                      required={formData.location.new_location}
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-1">
                      Sub-County *
                    </label>
                    <input
                      type="text"
                      name="location.sub_county"
                      value={formData.location.sub_county}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Sub-County"
                      required={formData.location.new_location}
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-1">
                      Ward *
                    </label>
                    <input
                      type="text"
                      name="location.ward"
                      value={formData.location.ward}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Ward"
                      required={formData.location.new_location}
                    />
                  </div>
                </div>

                {/* Map Preview - This would integrate with actual mapping APIs in production */}
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Map Location
                  </label>
                  <MapPreview />
                  <p className="text-sm text-gray-600 mt-1">
                    This would allow users to pick their location on a map in the actual implementation
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Location Privacy Settings */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Location Privacy
            </label>
            <div className="grid grid-cols-1 gap-2">
              {precisionOptions.map((option) => (
                <label
                  key={option.value}
                  className={`
                    flex items-center p-3 border rounded-lg cursor-pointer transition-colors
                    ${formData.location.display_precision === option.value
                      ? 'bg-green-100 border-green-500 text-green-700'
                      : 'border-gray-300 hover:bg-gray-50'}
                  `}
                >
                  <input
                    type="radio"
                    name="location.display_precision"
                    value={option.value}
                    checked={formData.location.display_precision === option.value}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  {option.label}
                </label>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-1">
              This controls how precisely your location is shown to buyers before they contact you
            </p>
          </div>
        </div>

        {/* Availability Section */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-700 mb-3">Product Availability</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Available From *
              </label>
              <input
                type="date"
                name="availability.start_date"
                value={formatDateForInput(formData.availability.start_date)}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                min={formatDateForInput(new Date())}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Available Until *
              </label>
              <input
                type="date"
                name="availability.end_date"
                value={formatDateForInput(formData.availability.end_date)}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                min={formatDateForInput(formData.availability.start_date || new Date())}
                required
              />
            </div>
          </div>

          {/* Recurring Availability */}
          <div className="mb-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="availability.is_recurring"
                checked={formData.availability.is_recurring}
                onChange={handleChange}
                className="rounded text-green-600 focus:ring-green-500 h-5 w-5"
              />
              <span className="ml-2 text-gray-700">
                This product is available on specific days only
              </span>
            </label>
          </div>

          {/* Days Selection for Recurring Availability */}
          {formData.availability.is_recurring && (
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Select days when the product is available
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {daysOfWeek.map((day) => (
                  <label
                    key={day.value}
                    className={`
                      flex items-center p-3 border rounded-lg cursor-pointer transition-colors
                      ${formData.availability.days_available.includes(day.value)
                        ? 'bg-green-100 border-green-500 text-green-700'
                        : 'border-gray-300 hover:bg-gray-50'}
                    `}
                  >
                    <input
                      type="checkbox"
                      name="availability.days_available"
                      value={day.value}
                      checked={formData.availability.days_available.includes(day.value)}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    {day.label}
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="mt-6 flex justify-between gap-4">
          <button
            type="button"
            onClick={() => onBack(formData)}
            className="w-1/2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition duration-200"
          >
            Back
          </button>
          <button
            type="submit"
            className="w-1/2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-200"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
};

export default LocationAvailability;
