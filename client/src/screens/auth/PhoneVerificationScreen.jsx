import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, RefreshCw } from 'lucide-react';

const PhoneVerificationScreen = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef([]);

  // Mock phone number - in a real app, this would come from context or previous form
  const phoneNumber = "07XXXXXXXX";

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Focus first input on component mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) {
      // If pasting a full OTP code
      const pastedOtp = value.slice(0, 6).split('');
      const newOtp = [...otp];

      for (let i = 0; i < pastedOtp.length; i++) {
        if (i + index < 6) {
          newOtp[i + index] = pastedOtp[i];
        }
      }

      setOtp(newOtp);

      // Focus on the next empty input or the last input
      for (let i = 0; i < 6; i++) {
        if (!newOtp[i] && inputRefs.current[i]) {
          inputRefs.current[i].focus();
          break;
        } else if (i === 5) {
          inputRefs.current[5].focus();
        }
      }
    } else {
      // Regular single digit input
      if (/^[0-9]?$/.test(value)) {
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input if a digit was entered
        if (value && index < 5 && inputRefs.current[index + 1]) {
          inputRefs.current[index + 1].focus();
        }
      }
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace to move to previous input
    if (e.key === 'Backspace' && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleResendOtp = async () => {
    setIsResending(true);

    try {
      // API call would go here to resend OTP
      // await resendOtp(phoneNumber);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Reset countdown and clear any errors
      setCountdown(60);
      setError('');
    } catch (err) {
      setError('Failed to resend verification code. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const otpValue = otp.join('');

    // Validate that all digits are entered
    if (otpValue.length !== 6 || !/^\d+$/.test(otpValue)) {
      setError('Please enter a valid 6-digit verification code');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // API call would go here to verify OTP
      // await verifyOtp(phoneNumber, otpValue);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Navigate to onboarding after successful verification
      navigate('/onboarding');
    } catch (err) {
      setError('Invalid verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img
          className="mx-auto h-16 w-auto"
          src="/api/placeholder/120/120"
          alt="MkulimaMarket"
        />
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Verify Your Phone
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          We've sent a 6-digit verification code to<br />
          <span className="font-medium text-gray-900">{phoneNumber}</span>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2 text-center">
                Enter verification code
              </label>
              <div className="flex justify-center space-x-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={el => inputRefs.current[index] = el}
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-xl font-semibold border-2 rounded-md focus:ring-green-500 focus:border-green-500"
                  />
                ))}
              </div>

              <div className="mt-8">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Verifying...
                    </span>
                  ) : (
                    'Verify'
                  )}
                </button>
              </div>
            </div>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500 mb-4">
              Didn't receive a code?
            </p>
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={countdown > 0 || isResending}
              className={`text-green-600 hover:text-green-500 font-medium text-sm ${countdown > 0 || isResending ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            >
              {isResending ? (
                <span className="flex items-center justify-center">
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Resending...
                </span>
              ) : countdown > 0 ? (
                `Resend code in ${countdown}s`
              ) : (
                'Resend verification code'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhoneVerificationScreen;
