import axios from 'axios';
import { API_BASE_URL } from '../config/constants';
import { storageService } from './storageService';

// JWT constants
const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'user_data';

/**
 * Authentication service for MkulimaMarket platform
 * Handles user authentication, registration, verification, and session management
 * Designed for mobile-first, offline-resilient functionality in rural areas
 */
class AuthService {
  constructor() {
    // Set up axios instance for authentication requests
    this.authAxios = axios.create({
      baseURL: `${API_BASE_URL}/auth`,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Set up axios interceptor for handling authentication errors
    this.authAxios.interceptors.response.use(
      (response) => response,
      async (error) => {
        // Handle unauthorized errors (401) by attempting to refresh token
        if (error.response && error.response.status === 401) {
          return this.handleUnauthorizedError(error);
        }

        return Promise.reject(error);
      }
    );
  }

  /**
   * Register a new user with phone number
   * @param {string} phoneNumber - User's phone number in international format
   * @param {string} userType - Type of user (farmer, buyer, transporter)
   * @returns {Promise} - Response with registration status
   */
  async register(phoneNumber, userType) {
    try {
      // Validate phone number format (simple E.164 format check)
      if (!this.validatePhoneNumber(phoneNumber)) {
        throw new Error('Invalid phone number format');
      }

      const response = await this.authAxios.post('/register', {
        phoneNumber,
        userType
      });

      // Store phone number in session for OTP verification
      storageService.setItem('pending_phone', phoneNumber);
      storageService.setItem('pending_user_type', userType);

      return {
        success: true,
        message: response.data.message,
        otpRequestId: response.data.otpRequestId
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || error.message
      };
    }
  }

  /**
   * Verify OTP code sent to user's phone
   * @param {string} otpCode - The verification code received by SMS
   * @param {string} otpRequestId - ID from the registration response
   * @returns {Promise} - Response with verification status
   */
  async verifyOtp(otpCode, otpRequestId) {
    try {
      const phoneNumber = storageService.getItem('pending_phone');
      const userType = storageService.getItem('pending_user_type');

      if (!phoneNumber) {
        throw new Error('Phone number not found. Please register again.');
      }

      const response = await this.authAxios.post('/verify', {
        phoneNumber,
        otpCode,
        otpRequestId,
        userType
      });

      // If verification successful, store tokens and user info
      if (response.data.token) {
        this.setSession(response.data);

        // Clear pending registration data
        storageService.removeItem('pending_phone');
        storageService.removeItem('pending_user_type');
      }

      return {
        success: true,
        message: response.data.message,
        user: response.data.user
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || error.message
      };
    }
  }

  /**
   * Login with phone number
   * @param {string} phoneNumber - User's phone number
   * @returns {Promise} - Response with login status
   */
  async login(phoneNumber) {
    try {
      // Validate phone number format
      if (!this.validatePhoneNumber(phoneNumber)) {
        throw new Error('Invalid phone number format');
      }

      const response = await this.authAxios.post('/login', { phoneNumber });

      // Store phone number in session for OTP verification
      storageService.setItem('pending_phone', phoneNumber);

      return {
        success: true,
        message: response.data.message,
        otpRequestId: response.data.otpRequestId
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || error.message
      };
    }
  }

  /**
   * Complete login process by verifying OTP
   * @param {string} otpCode - The verification code received by SMS
   * @param {string} otpRequestId - ID from the login response
   * @returns {Promise} - Response with login status
   */
  async verifyLogin(otpCode, otpRequestId) {
    try {
      const phoneNumber = storageService.getItem('pending_phone');

      if (!phoneNumber) {
        throw new Error('Phone number not found. Please login again.');
      }

      const response = await this.authAxios.post('/verify-login', {
        phoneNumber,
        otpCode,
        otpRequestId
      });

      // If verification successful, store tokens and user info
      if (response.data.token) {
        this.setSession(response.data);

        // Clear pending login data
        storageService.removeItem('pending_phone');
      }

      return {
        success: true,
        message: response.data.message,
        user: response.data.user
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || error.message
      };
    }
  }

  /**
   * Logout the current user
   * @returns {Promise} - Response with logout status
   */
  async logout() {
    try {
      // Call logout endpoint if online
      if (navigator.onLine) {
        await this.authAxios.post('/logout', {}, {
          headers: { Authorization: `Bearer ${this.getToken()}` }
        });
      }

      // Clear session data regardless of online status
      this.clearSession();

      return {
        success: true,
        message: 'Logged out successfully'
      };
    } catch (error) {
      // Still clear session even if request fails
      this.clearSession();

      return {
        success: true,
        message: 'Logged out successfully'
      };
    }
  }

  /**
   * Get the current authenticated user
   * @returns {Object|null} - User data or null if not authenticated
   */
  getCurrentUser() {
    return JSON.parse(storageService.getItem(USER_KEY));
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} - True if user is authenticated
   */
  isAuthenticated() {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  /**
   * Get authentication token
   * @returns {string|null} - JWT token or null
   */
  getToken() {
    return storageService.getItem(TOKEN_KEY);
  }

  /**
   * Set authentication session data
   * @param {Object} data - Session data including token, refresh token and user info
   * @private
   */
  setSession(data) {
    storageService.setItem(TOKEN_KEY, data.token);
    storageService.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
    storageService.setItem(USER_KEY, JSON.stringify(data.user));
  }

  /**
   * Clear authentication session data
   * @private
   */
  clearSession() {
    storageService.removeItem(TOKEN_KEY);
    storageService.removeItem(REFRESH_TOKEN_KEY);
    storageService.removeItem(USER_KEY);
  }

  /**
   * Handle unauthorized error by attempting to refresh token
   * @param {Error} error - Original error object
   * @returns {Promise} - Promise resolving to original request with new token
   * @private
   */
  async handleUnauthorizedError(error) {
    const originalRequest = error.config;

    // Prevent infinite loops
    if (originalRequest._retry) {
      this.clearSession();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    // Try to refresh the token
    try {
      const refreshToken = storageService.getItem(REFRESH_TOKEN_KEY);

      if (!refreshToken) {
        this.clearSession();
        return Promise.reject(error);
      }

      const response = await this.authAxios.post('/refresh-token', {
        refreshToken
      });

      // Update session with new tokens
      this.setSession(response.data);

      // Update authorization header and retry original request
      originalRequest.headers.Authorization = `Bearer ${response.data.token}`;
      return axios(originalRequest);
    } catch (refreshError) {
      // If refresh fails, clear session and force re-login
      this.clearSession();
      return Promise.reject(refreshError);
    }
  }

  /**
   * Check if token is expired
   * @param {string} token - JWT token
   * @returns {boolean} - True if token is expired
   * @private
   */
  isTokenExpired(token) {
    try {
      // Extract payload from JWT
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(window.atob(base64));

      // Check if token is expired
      return payload.exp < Date.now() / 1000;
    } catch (error) {
      return true;
    }
  }

  /**
   * Validate phone number format (simple E.164 format check)
   * @param {string} phoneNumber - Phone number to validate
   * @returns {boolean} - True if valid
   * @private
   */
  validatePhoneNumber(phoneNumber) {
    // Simple regex for international format: +country_code followed by digits
    // Specific to Kenya numbers (+254), but can be expanded as needed
    const phoneRegex = /^\+\d{1,4}\d{9,12}$/;
    return phoneRegex.test(phoneNumber);
  }

  /**
   * Update user profile
   * @param {Object} userData - Updated user data
   * @returns {Promise} - Response with update status
   */
  async updateProfile(userData) {
    try {
      const response = await this.authAxios.put('/profile', userData, {
        headers: { Authorization: `Bearer ${this.getToken()}` }
      });

      // Update stored user data
      const currentUser = this.getCurrentUser();
      const updatedUser = { ...currentUser, ...response.data.user };
      storageService.setItem(USER_KEY, JSON.stringify(updatedUser));

      return {
        success: true,
        message: response.data.message,
        user: updatedUser
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || error.message
      };
    }
  }
}

// Create and export singleton instance
const authService = new AuthService();
export default authService;
