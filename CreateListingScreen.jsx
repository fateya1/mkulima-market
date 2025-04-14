import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";

// Components
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import ImageUploader from "../../components/ui/ImageUploader";
import TextInput from "../../components/ui/TextInput";

// Redux actions
import { useAddListingMutation } from "../../services/api";
import { showToast } from "../../store/slices/uiSlice";

const CreateListingScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [addListing, { isLoading }] = useAddListingMutation();
  const { user } = useSelector((state) => state.auth);
  const [images, setImages] = useState([]);

  // Define validation schema
  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required").max(100, "Title is too long"),
    description: Yup.string().required("Description is required").max(2000, "Description is too long"),
    price: Yup.number().required("Price is required").positive("Price must be positive"),
    category: Yup.string().required("Category is required"),
    condition: Yup.string().required("Condition is required"),
  });

  // Initialize form
  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      price: "",
      category: "",
      condition: "new",
      location: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        // Prepare listing data
        const listingData = {
          ...values,
          price: parseFloat(values.price),
          images: images,
          seller: user.id,
          createdAt: new Date().toISOString(),
        };

        // Submit to API
        const response = await addListing(listingData).unwrap();
        
        // Show success message
        dispatch(showToast({
          message: "Your listing has been created successfully!",
          type: "success",
        }));

        // Navigate to the new listing
        navigate(`/marketplace/listing/${response.id}`);
      } catch (error) {
        console.error("Failed to create listing:", error);
        
        // Show error message
        dispatch(showToast({
          message: error.data?.message || "Failed to create listing. Please try again.",
          type: "error",
        }));
      }
    },
  });

  // Handle image upload
  const handleImageUpload = (uploadedImages) => {
    setImages([...images, ...uploadedImages]);
  };

  // Handle image removal
  const handleImageRemove = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Create New Listing</h1>

      <Card>
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Image uploader */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Images (up to 5)
            </label>
            <ImageUploader
              images={images}
              onUpload={handleImageUpload}
              onRemove={handleImageRemove}
              maxImages={5}
            />
            <p className="text-sm text-gray-500 mt-1">
              First image will be used as the cover. You can drag to reorder.
            </p>
          </div>

          {/* Basic details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextInput
              label="Title"
              name="title"
              placeholder="What are you selling?"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.title && formik.errors.title}
              required
            />

            <TextInput
              label="Price"
              name="price"
              type="number"
              placeholder="0.00"
              value={formik.values.price}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.price && formik.errors.price}
              prefixIcon="$"
              required
            />
          </div>

          {/* Category and condition */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="category" className="block text-sm font-medium mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                name="category"
                className="w-full p-2 border rounded-md"
                value={formik.values.category}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value="">Select a category</option>
                <option value="electronics">Electronics</option>
                <option value="clothing">Clothing</option>
                <option value="home">Home & Garden</option>
                <option value="sports">Sports & Outdoors</option>
                <option value="toys">Toys & Games</option>
                <option value="vehicles">Vehicles</option>
                <option value="other">Other</option>
              </select>
              {formik.touched.category && formik.errors.category && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.category}</p>
              )}
            </div>

            <div>
              <label htmlFor="condition" className="block text-sm font-medium mb-2">
                Condition <span className="text-red-500">*</span>
              </label>
              <select
                id="condition"
                name="condition"
                className="w-full p-2 border rounded-md"
                value={formik.values.condition}
                onChange={formik.handleChange}
              >
                <option value="new">New</option>
                <option value="like-new">Like New</option>
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="salvage">For Parts or Not Working</option>
              </select>
            </div>
          </div>

          {/* Location */}
          <TextInput
            label="Location"
            name="location"
            placeholder="City, State"
            value={formik.values.location}
            onChange={formik.handleChange}
          />

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              rows={6}
              className="w-full p-2 border rounded-md"
              placeholder="Describe your item in detail. Include important information such as features, specifications, age, and any flaws or damage."
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.description && formik.errors.description && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.description}</p>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading || !formik.isValid}
              loading={isLoading}
            >
              {isLoading ? "Creating..." : "Create Listing"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CreateListingScreen;
