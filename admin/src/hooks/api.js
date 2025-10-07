import { useCallback } from "react";

import { useState } from "react";
import axios from "axios";

// const backendUrl = "https://palmsbeautystore-backend.onrender.com"

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const CONFIG = {
  backendUrl: backendUrl,
  maxImageSize: 5 * 1024 * 1024, // 5MB
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
  requestTimeout: 30000, // 30 seconds
  maxRetries: 3
};



// / Custom hook for API calls with retry logic
export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  

  const makeRequest = useCallback(async (requestFn, retries = CONFIG.maxRetries) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await requestFn();
      return result;
    } catch (err) {
      if (retries > 0 && err.response?.status >= 500) {
        // Retry on server errors
        await new Promise(resolve => setTimeout(resolve, 1000));
        return makeRequest(requestFn, retries - 1);
      }
      
      const errorMessage = err.response?.data?.message || err.message || 'An unexpected error occurred';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return { makeRequest, loading, error, clearError: () => setError(null) };
};

export const api = {
  // Fetch all services  // Fetch all services
  getServices: async () => {
    const res = await axios.get(`${backendUrl}/api/admin/services`);
     console.log("API response in getServices:", res.data);
    return {
      data: res.data.services,
      message: res.data.message || 'Services fetched successfully',
    };
  },

// Create a new category
createCategory: async (formData) => {
  const res = await axios.post(`${backendUrl}/api/admin/addcategory`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return {
    data: res.data,
    message: res.data.message || 'Category created successfully',
  };
},

// Update a category
updateCategory: async (id, formData) => {
  const res = await axios.put(`${backendUrl}/api/admin/updatecategory/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return {
    data: res.data,
    message: res.data.message || 'Category updated successfully',
  };
},

// Delete a category
deleteCategory: async (id) => {
  const res = await axios.delete(`${backendUrl}/api/admin/deletecategory/${id}`);
  return {
    data: res.data,
    message: res.data.message || 'Category deleted successfully',
  };
},

// Toggle category status
toggleCategoryStatus: async (id, status) => {
  const res = await axios.patch(`${backendUrl}/api/admin/${id}/toggle`, {
    isActive: status,
  });
  return {
    data: res.data,
    message: res.data.message || 'Category status updated',
  };
},



  // Create a new service
  createService: async (formData) => {
    for (let [key, value] of formData.entries()) {
  console.log(key, value)
}
    console.log("Form data in createService:", formData);
    const res = await axios.post(`${backendUrl}/api/admin/addservices`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return {
      data: res.data,
      message: 'Service created successfully',
    };
  },

  // Update existing service
  updateService: async (id, formData) => {
    const res = await axios.put(`${backendUrl}/api/admin/updateservice/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return {
      data: res.data,
      message: 'Service updated successfully',
    };
  },

  // Delete service
  deleteService: async (id) => {
    const res = await axios.delete(`${backendUrl}/api/admin/services/${id}`);
    return {
      data: res.data,
      message: res.data.message || 'Service deleted successfully',
    };
  },

  // Toggle service status
  toggleServiceStatus: async (id, status) => {
    const res = await axios.patch(`${backendUrl}/api/admin//${id}/status`, {
      isActive: status,
    });
    return {
      data: res.data,
      message: res.data.message || 'Service status updated',
    };
  },

  // Delete image from service
  deleteImage: async (id) => {
    const res = await axios.delete(`${backendUrl}/api/admin/services/${id}/image`);
    return {
      data: res.data,
      message: res.data.message || 'Image deleted successfully',
    };
  },


};