import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load user from token on app startup
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        // Set auth token header
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // Get user data
        const res = await axios.get('/api/v1/users/me');
        setUser(res.data.data);
      } catch (err) {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        setError('Authentication failed. Please login again.');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Login user
  const login = async (phoneNumber, password) => {
    try {
      const res = await axios.post('/api/v1/auth/login', { phoneNumber, password });

      // Save token and set auth header
      localStorage.setItem('token', res.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;

      // Get user data
      const userRes = await axios.get('/api/v1/users/me');
      setUser(userRes.data.data);

      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      return { success: false, error: err.response?.data?.message || 'Login failed' };
    }
  };

  // Register user
  const register = async (userData) => {
    try {
      const res = await axios.post('/api/v1/auth/register', userData);

      // Save token and set auth header
      localStorage.setItem('token', res.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;

      // Get user data
      const userRes = await axios.get('/api/v1/users/me');
      setUser(userRes.data.data);

      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      return { success: false, error: err.response?.data?.message || 'Registration failed' };
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      const res = await axios.put('/api/v1/users/profile', profileData);
      setUser(res.data.data);
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Profile update failed');
      return { success: false, error: err.response?.data?.message || 'Profile update failed' };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      error,
      login,
      register,
      logout,
      updateProfile,
      setError
    }}>
      {children}
    </AuthContext.Provider>
  );
};
