import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';

const OnboardingScreen = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  // In a real app, this state might include more detailed information gathered during onboarding
  const [userProgress, setUserProgress] = useState({
    step1Completed: false,
    step2Completed: false,
    step3Completed: false,
    step4Completed: false
  });

  const onboardingSteps = [
    {
      id: 'welcome',
      title: 'Welcome to MkulimaMarket',
      description: 'Connect directly with buyers and sellers in the agricultural marketplace',
      image: '/api/placeholder/300/200',
      imageAlt: 'Welcome to MkulimaMarket'
    },
    {
      id: 'listings',
      title: 'Create Listings',
      description: 'List your products with detailed information about quality, quantity, and pricing',
      image: '/api/placeholder/300/200',
      imageAlt: 'Create product listings'
    },
    {
      id: 'connections',
      title: 'Connect with Buyers',
      description: 'Find buyers for your products and negotiate directly without middlemen',
      image: '/api/placeholder/300/200',
      imageAlt: 'Connect with buyers'
    },
    {
      id: 'payments',
      title: 'Secure Payments',
      description: 'Use our integrated payment system with M-Pesa for secure transactions',
      image: '/api/placeholder/300/200',
      imageAlt: 'Secure payments'
    }
  ];

  const handleNextStep = () => {
    if (currentStep < onboardingSteps.length - 1) {
      // Update progress for current step
      setUserProgress({
        ...userProgress,
        [`step${currentStep + 1}Completed`]: true
      });

      // Move to next step
      setCurrentStep(currentStep + 1);
    } else {
      // Mark last step as completed
      setUserProgress({
        ...userProgress,
        [`step${currentStep + 1}Completed`]: true
      });

      // If we've completed all steps, show completion state
      setIsCompleted(true);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    // In a real app, this would save onboarding completion status to user profile
    navigate('/home');
  };

  const handleSkip = () => {
    // Mark all steps as completed
    setUserProgress({
      step1Completed: true,
      step2Completed: true,
      step3Completed: true,
      step4Completed: true
    });

    // Navigate to home
    navigate('/home');
  };

  const currentStepData = onboardingSteps[currentStep];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Progress Indicator */}
      <div className="w-full px-4 pt-4">
        <div className="flex justify-between items-center mb-8">
          {onboardingSteps.map((step, index) => (
            <div
              key={step.id}
              className="flex flex-col items-center"
            >
              <div
                className={`w-3 h-3 rounded-full mb-1 ${index < currentStep || userProgress[`step${index + 1}Completed`]
                    ? 'bg-green-600'
                    : index === currentStep
                      ? 'bg-green-400'
                      : 'bg-gray-300'
                  }`}
              />
              <div
                className={`h-1 ${index === onboardingSteps.length - 1 ? 'w-0' : 'w-full'
                  } ${index < currentStep || userProgress[`step${index + 1}Completed`]
                    ? 'bg-green-600'
                    : 'bg-gray-300'
                  }`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-grow flex flex-col items-center justify-center px-4 py-8">
        {!isCompleted ? (
          <>
            <div className="text-center mb-8">
              <img
                src={currentStepData.image}
                alt={currentStepData.imageAlt}
                className="mx-auto mb-6 rounded-lg"
              />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {currentStepData.title}
              </h2>
              <p className="text-gray-600 mx-auto max-w-md">
                {currentStepData.description}
              </p>
            </div>
          </>
        ) : (
          <div className="text-center mb-8">
            <div className="mb-6 flex justify-center">
              <CheckCircle className="h-24 w-24 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              You're all set!
            </h2>
            <p className="text-gray-600 mx-auto max-w-md">
              You're ready to start using MkulimaMarket to connect with agricultural buyers and sellers.
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="px-4 py-6 bg-white border-t border-gray-200">
        <div className="flex justify-between">
          {!isCompleted ? (
            <>
              <div>
                {currentStep > 0 ? (
                  <button
                    onClick={handlePreviousStep}
                    className="flex items-center text-gray-600 hover:text-gray-900"
                  >
                    <ChevronLeft className="h-5 w-5 mr-1" />
                    Back
                  </button>
                ) : (
                  <button
                    onClick={handleSkip}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Skip
                  </button>
                )}
              </div>
              <button
                onClick={handleNextStep}
                className="flex items-center bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-medium"
              >
                {currentStep === onboardingSteps.length - 1 ? 'Finish' : 'Next'}
                {currentStep < onboardingSteps.length - 1 && (
                  <ChevronRight className="h-5 w-5 ml-1" />
                )}
              </button>
            </>
          ) : (
            <button
              onClick={handleComplete}
              className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md font-medium"
            >
              Get Started
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingScreen;
