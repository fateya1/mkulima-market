// ProductDetails.jsx - Step 1 of the create listing flow
import React, { useState, useEffect } from 'react';
import listingsApi from '../../../store/api/listingsApi';

/**
 * First step in product listing creation flow
 * Allows selection of product category, specific product, and quantity
 */
const ProductDetails = ({ onNext, initialData = {}, onDataChange }) => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    category_id: initialData.category_id || '',
    product_id: initialData.product_id || '',
    quantity: initialData.quantity || {
      value: '',
      unit: 'kg',
      is_estimated: false
    },
    ...initialData
  });

  // Load product categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const data = await listingsApi.getProductCategories();
        setCategories(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load product categories. Please try again.');
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  // Load products when category is selected
  useEffect(() => {
    const loadProducts = async () => {
      if (!formData.category_id) return;

      try {
        setLoading(true);
        const data = await listingsApi.getProductsByCategory(formData.category_id);
        setProducts(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load products. Please try again.');
        setLoading(false);
      }
    };

    loadProducts();
  }, [formData.category_id]);

  // Update parent component when form data changes
  useEffect(() => {
    if (onDataChange) {
      onDataChange(formData);
    }
  }, [formData, onDataChange]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'quantity.value') {
      setFormData({
        ...formData,
        quantity: {
          ...formData.quantity,
          value: value
        }
      });
    } else if (name === 'quantity.unit') {
      setFormData({
        ...formData,
        quantity: {
          ...formData.quantity,
          unit: value
        }
      });
    } else if (name === 'quantity.is_estimated') {
      setFormData({
        ...formData,
        quantity: {
          ...formData.quantity,
          is_estimated: checked
        }
      });
    } else if (name === 'category_id') {
      setFormData({
        ...formData,
        category_id: value,
        product_id: '' // Reset product when category changes
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Validate form before proceeding to next step
  const validateForm = () => {
    if (!formData.category_id) {
      setError('Please select a product category');
      return false;
    }
    if (!formData.product_id) {
      setError('Please select a specific product');
      return false;
    }
    if (!formData.quantity.value) {
      setError('Please enter the quantity');
      return false;
    }
    if (isNaN(formData.quantity.value) || Number(formData.quantity.value) <= 0) {
      setError('Please enter a valid quantity');
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

  // Common measurement units in Kenya
  const units = [
    { value: 'kg', label: 'Kilograms (kg)' },
    { value: 'bags', label: 'Bags' },
    { value: 'crates', label: 'Crates' },
    { value: 'tons', label: 'Tons' },
    { value: 'bunches', label: 'Bunches' }
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Product Details</h2>

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Product Category Selection */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Product Category *
          </label>
          <select
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            disabled={loading}
            required
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Specific Product Selection */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Specific Product *
          </label>
          <select
            name="product_id"
            value={formData.product_id}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            disabled={loading || !formData.category_id}
            required
          >
            <option value="">Select a product</option>
            {products.map(product => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </div>

        {/* Quantity Section */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Quantity *
          </label>
          <div className="flex space-x-2">
            <div className="flex-1">
              <input
                type="number"
                name="quantity.value"
                value={formData.quantity.value}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Enter quantity"
                min="0"
                step="0.01"
                required
              />
            </div>
            <div className="w-1/3">
              <select
                name="quantity.unit"
                value={formData.quantity.unit}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                {units.map((unit) => (
                  <option key={unit.value} value={unit.value}>
                    {unit.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Estimated Quantity Toggle */}
          <div className="mt-2">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="quantity.is_estimated"
                checked={formData.quantity.is_estimated}
                onChange={handleChange}
                className="rounded text-green-600 focus:ring-green-500 h-5 w-5"
              />
              <span className="ml-2 text-gray-700">
                This is an estimated quantity
              </span>
            </label>
          </div>
        </div>

        {/* Continue Button */}
        <div className="mt-6">
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-200"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Continue'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductDetails;
