// Frontend API configuration with proper token handling

import axios from 'axios';

// API Base URL configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://palmsbeautystore-backend.onrender.com' 
    : 'http://localhost:3000');

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor to add token
apiClient.interceptors.request.use(
  (config) => {
    console.log(`Making request to: ${config.baseURL}${config.url}`);
    
    // Get token from localStorage
    const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
    
    if (token) {
      // Use the same header name that your backend expects
      config.headers['token'] = token; // Make sure this matches your backend expectation
      // Alternative: config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Log successful responses
    console.log(`Response from ${response.config.url}:`, response.status);
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    
    // Handle different error types
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout');
    } else if (error.message.includes('CORS')) {
      console.error('CORS error - check backend CORS configuration');
    } else if (error.response?.status === 401) {
      console.error('Unauthorized - clearing token and redirecting');
      localStorage.removeItem('token');
      localStorage.removeItem('adminToken');
      // Redirect to login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// API functions with proper error handling
export const fetchOrders = async () => {
  try {
    const response = await apiClient.get('/api/order/list');
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
    throw error;
  }
};

export const fetchProducts = async () => {
  try {
    const response = await apiClient.get('/api/product/list');
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const fetchUserProfile = async () => {
  try {
    const response = await apiClient.get('/api/user/get-profile');
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// Test connection function
export const testConnection = async () => {
  try {
    const response = await apiClient.get('/health');
    console.log('Backend connection successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Backend connection failed:', error);
    throw error;
  }
};

// Alternative fetch approach if axios continues to have issues
export const fetchWithFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
  
  const defaultOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'token': token }), // Add token if available
    },
    credentials: 'include', // Important for CORS
    ...options
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, defaultOptions);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error with fetch request to ${endpoint}:`, error);
    throw error;
  }
};

// Export the configured axios instance
export default apiClient;
export { API_BASE_URL };