import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useCreateListingMutation } from "../../store/api/listingsApi";
import { addToSyncQueue, saveOfflineData } from "../../services/offlineSync";
import StepProgressBar from "../../components/common/StepProgressBar";
import ProductDetails from "../../components/listings/steps/ProductDetails";
import QualityAndPrice from "../../components/listings/steps/QualityAndPrice";
import LocationAvailability from "../../components/listings/steps/LocationAvailability";
import PhotosAndReview from "../../components/listings/steps/PhotosAndReview";
import SuccessScreen from "../../components/common/SuccessScreen";
import { showToast } from "../../store/slices/uiSlice";

const CreateListingScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isOnline = useSelector((state) => state.ui.isOnline);
  const [createListing, { isLoading }] = useCreateListingMutation();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    productId: "",
    title: "",
    description: "",
    quantity: {
      value: "",
      unit: "kg",
      remaining: "",
    },
    price: {
      amount: "",
      currency: "KES",
      isNegotiable: true,
      minAcceptable: "",
    },
    quality: {
      description: "",
      attributes: {},
      images: [],
    },
    location: {
      locationId: "",
      displayPrecision: "ward",
    },
    availability: {
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 30)),
      isRecurring: false,
    },
    status: "active",
    visibility: {
      isPublic: true,
    },
  });

  const [isSuccess, setIsSuccess] = useState(false);

  const handleStepChange = (step) => {
    setCurrentStep(step);
    window.scrollTo(0, 0);
  };

  const updateFormData = (data) => {
    setFormData((prevData) => ({
      ...prevData,
      ...data,
    }));
  };

  const handleSubmit = async () => {
    try {
      // If online, submit directly to API
      if (isOnline) {
        const result = await createListing(formData).unwrap();

        // Save to offline storage for access when offline
        await saveOfflineData("listings", result);

        setIsSuccess(true);
      } else {
        // If offline, store in sync queue for later
        const tempId = `temp_${Date.now()}`;
        const offlineData = {
          ...formData,
          id: tempId,
          createdAt: new Date().toISOString(),
          status: "pending_sync",
        };

        // Save to offline storage
        await saveOfflineData("listings", offlineData);

        // Add to sync queue
        await addToSyncQueue({
          type: "listing",
          method: "POST",
          data: formData,
          endpoint: "/listings",
          timestamp: new Date().toISOString(),
        });

        dispatch(
          showToast({
            message:
              "Listing saved and will be uploaded when you are back online",
            type: "info",
          }),
        );

        setIsSuccess(true);
      }
    } catch (error) {
      dispatch(
        showToast({
          message:
            error.message || "Failed to create listing. Please try again.",
          type: "error",
        }),
      );
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ProductDetails
            formData={formData}
            updateFormData={updateFormData}
            onNext={() => handleStepChange(2)}
          />
        );
      case 2:
        return (
          <QualityAndPrice
            formData={formData}
            updateFormData={updateFormData}
            onNext={() => handleStepChange(3)}
            onBack={() => handleStepChange(1)}
          />
        );
      case 3:
        return (
          <LocationAvailability
            formData={formData}
            updateFormData={updateFormData}
            onNext={() => handleStepChange(4)}
            onBack={() => handleStepChange(2)}
          />
        );
      case 4:
        return (
          <PhotosAndReview
            formData={formData}
            updateFormData={updateFormData}
            onSubmit={handleSubmit}
            onBack={() => handleStepChange(3)}
            isLoading={isLoading}
          />
        );
      default:
        return null;
    }
  };

  if (isSuccess) {
    return (
      <SuccessScreen
        title="Listing Created!"
        message="Your product has been listed successfully."
        primaryAction={{
          label: "View Listing",
          onPress: () => navigate("/marketplace"),
        }}
        secondaryAction={{
          label: "Create Another Listing",
          onPress: () => {
            setFormData({
              productId: "",
              title: "",
              description: "",
              quantity: {
                value: "",
                unit: "kg",
                remaining: "",
              },
              price: {
                amount: "",
                currency: "KES",
                isNegotiable: true,
                minAcceptable: "",
              },
              quality: {
                description: "",
                attributes: {},
                images: [],
              },
              location: {
                locationId: "",
                displayPrecision: "ward",
              },
              availability: {
                startDate: new Date(),
                endDate: new Date(
                  new Date().setDate(new Date().getDate() + 30),
                ),
                isRecurring: false,
              },
              status: "active",
              visibility: {
                isPublic: true,
              },
            });
            setCurrentStep(1);
            setIsSuccess(false);
          },
        }}
      />
    );
  }

  return (
    <div className="create-listing">
      <header className="screen-header">
        <h1>Create Listing</h1>
        <StepProgressBar currentStep={currentStep} totalSteps={4} />
      </header>
      <div className="listing-form-container">{renderStep()}</div>
    </div>
  );
};

export default CreateListingScreen;
