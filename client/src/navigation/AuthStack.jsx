import { Routes, Route, Navigate } from 'react-router-dom';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import UserTypeScreen from '../screens/auth/UserTypeScreen';
import OnboardingScreen from '../screens/auth/OnboardingScreen';
import PhoneVerificationScreen from '../screens/auth/PhoneVerificationScreen';

const AuthStack = () => {
  return (
    <Routes>
      <Route path="/" element={<OnboardingScreen />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/register" element={<RegisterScreen />} />
      <Route path="/user-type" element={<UserTypeScreen />} />
      <Route path="/verify-phone" element={<PhoneVerificationScreen />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AuthStack;
