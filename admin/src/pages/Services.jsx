import { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios'
import { Plus, Edit, Trash2, Eye, EyeOff, Upload, X, Loader2, ChevronDown, ChevronRight, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

// Configuration
const CONFIG = {
  backendUrl: 'http://localhost:3000',
  maxImageSize: 5 * 1024 * 1024, // 5MB
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
  requestTimeout: 30000, // 30 seconds
  maxRetries: 3
};

const backendUrl = 'http://localhost:3000'

// Custom hook for API calls with retry logic
const useApi = () => {
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

// axios calls
const api = {
  // Fetch all services  // Fetch all services
  getServices: async () => {
    const res = await axios.get(`${backendUrl}/api/admin/services`);
    return {
      data: res.data.services,
      message: res.data.message || 'Services fetched successfully',
    };
  },

  // Create a new service
  createService: async (formData) => {
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
    const res = await axios.put(`${backendUrl}/api/admin/services/${id}`, formData, {
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
    const res = await axios.patch(`${backendUrl}/api/admin/services/${id}/status`, {
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

// Utility functions
const validateImageFile = (file) => {
  const errors = [];
  
  if (!file) return errors;
  
  if (file.size > CONFIG.maxImageSize) {
    errors.push('Image size must be less than 5MB');
  }
  
  if (!CONFIG.allowedImageTypes.includes(file.type)) {
    errors.push('Only JPEG, PNG, and WebP images are allowed');
  } 
  
  return errors;
};

const sanitizeFormData = (data) => {
  const sanitized = {};
  Object.keys(data).forEach(key => {
    if (typeof data[key] === 'string') {
      sanitized[key] = data[key].trim();
    } else {
      sanitized[key] = data[key];
    }
  });
  return sanitized;
};

// Toast notification component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
    warning: <AlertCircle className="w-5 h-5" />
  };

  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800'
  };

  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg border ${colors[type]} shadow-lg`}>
      {icons[type]}
      <span>{message}</span>
      <button onClick={onClose} className="ml-2">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

// Loading overlay component
const LoadingOverlay = ({ isLoading, message = 'Loading...' }) => {
  if (!isLoading) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 flex items-center gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        <span className="text-gray-700">{message}</span>
      </div>
    </div>
  );
};

// Main Services component
const Services = () => {
  const [services, setServices] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [toast, setToast] = useState(null);
  const [imageErrors, setImageErrors] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    price: '',
    isActive: true,
    isCategory: false,
    parentService: null
  });

  const { makeRequest, loading, error, clearError } = useApi();

  // Memoized categories for performance
  const categories = useMemo(() => 
    Object.values(services).filter(s => s.isCategory),
    [services]
  );

  const fetchServices = useCallback(async () => {
    try {
      const { data } = await makeRequest(() => api.getServices());
      
      // Organize services into hierarchy
      const categoryMap = {};
      const categories = data.services.filter(s => s.isCategory);
      
      categories.forEach(cat => {
        categoryMap[cat._id] = {
          ...cat,
          subServices: data.services.filter(s => s.parentService === cat._id)
        };
      });
      
      setServices(categoryMap);
    } catch (err) {
      showToast('Failed to load services', 'error');
    }
  }, [makeRequest]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const showToast = useCallback((message, type) => {
    setToast({ message, type });
  }, []);

  const toggleCategory = useCallback((categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  }, []);

  const handleServiceTypeChange = useCallback((e) => {
    const isCategory = e.target.value === 'category';
    setFormData(prev => ({
      ...prev,
      isCategory,
      parentService: isCategory ? null : prev.parentService
    }));
  }, []);

  const handleImageChange = useCallback((e) => {
    const file = e.target.files[0];
    setImageErrors([]);
    
    if (file) {
      const errors = validateImageFile(file);
      if (errors.length > 0) {
        setImageErrors(errors);
        setImageFile(null);
        setImagePreview(null);
        return;
      }
      
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.onerror = () => showToast('Failed to read image file', 'error');
      reader.readAsDataURL(file);
    }
  }, [showToast]);

  const handleSubmit = async () => {
    // Validate form
    const sanitized = sanitizeFormData(formData);
    
    if (!sanitized.title || !sanitized.description) {
      showToast('Title and description are required', 'error');
      return;
    }

    if (!sanitized.isCategory && !sanitized.parentService) {
      showToast('Please select a parent category for services', 'error');
      return;
    }

    try {
      const formDataObj = new FormData();
      Object.keys(sanitized).forEach(key => {
        if (sanitized[key] !== null && sanitized[key] !== undefined) {
          formDataObj.append(key, sanitized[key]);
        }
      });

      if (imageFile) {
        formDataObj.append('image', imageFile);
      }

      if (editingService) {
        await makeRequest(() => api.updateService(editingService._id, formDataObj));
        showToast('Service updated successfully', 'success');
      } else {
        await makeRequest(() => api.createService(formDataObj));
        showToast('Service created successfully', 'success');
      }

      await fetchServices();
      resetForm();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDelete = async (service) => {
    const confirmMessage = service.isCategory 
      ? `Are you sure you want to delete the category "${service.title}"? This will also delete all services in this category.`
      : `Are you sure you want to delete "${service.title}"?`;
      
    if (!window.confirm(confirmMessage)) return;

    try {
      await makeRequest(() => api.deleteService(service._id));
      showToast('Service deleted successfully', 'success');
      await fetchServices();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteImage = async (serviceId) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;
    
    try {
      await makeRequest(() => api.deleteImage(serviceId));
      showToast('Image deleted successfully', 'success');
      await fetchServices();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const toggleServiceStatus = async (service) => {
    try {
      await makeRequest(() => api.toggleServiceStatus(service._id, !service.isActive));
      showToast(`Service ${service.isActive ? 'deactivated' : 'activated'}`, 'success');
      await fetchServices();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const resetForm = useCallback(() => {
    setFormData({
      title: '',
      description: '',
      duration: '',
      price: '',
      isActive: true,
      isCategory: false,
      parentService: null
    });
    setImageFile(null);
    setImagePreview(null);
    setImageErrors([]);
    setEditingService(null);
    setShowAddForm(false);
    clearError();
  }, [clearError]);

  const startEdit = useCallback((service) => {
    setFormData({
      title: service.title,
      description: service.description,
      duration: service.duration || '',
      price: service.price || '',
      isActive: service.isActive,
      isCategory: service.isCategory,
      parentService: service.parentService || null
    });
    setImagePreview(service.image || null);
    setEditingService(service);
    setShowAddForm(true);
  }, []);

  const renderForm = () => (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          {editingService ? 'Edit Service' : 'Add New Service'}
        </h2>
        <button
          onClick={resetForm}
          className="text-gray-400 hover:text-gray-600"
          aria-label="Close form"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="serviceType" className="block text-sm font-medium mb-1">
              Service Type *
            </label>
            <select
              id="serviceType"
              value={formData.isCategory ? 'category' : 'service'}
              onChange={handleServiceTypeChange}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={editingService}
            >
              <option value="category">Category (Group of Services)</option>
              <option value="service">Individual Service</option>
            </select>
          </div>

          {!formData.isCategory && (
            <div>
              <label htmlFor="parentService" className="block text-sm font-medium mb-1">
                Parent Category *
              </label>
              <select
                id="parentService"
                value={formData.parentService || ''}
                onChange={(e) => setFormData({ ...formData, parentService: e.target.value })}
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category._id} value={category._id}>
                    {category.title}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Title *
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            maxLength={100}
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            Description *
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            required
            maxLength={500}
          />
        </div>

        {!formData.isCategory && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="duration" className="block text-sm font-medium mb-1">
                Duration
              </label>
              <input
                type="text"
                id="duration"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 30 min"
              />
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium mb-1">
                Price
              </label>
              <input
                type="text"
                id="price"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., $25"
              />
            </div>
          </div>
        )}

        <div>
          <label htmlFor="image" className="block text-sm font-medium mb-1">
            Image
          </label>
          <input
            type="file"
            id="image"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageChange}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {imageErrors.length > 0 && (
            <div className="mt-2 text-sm text-red-600">
              {imageErrors.map((error, index) => (
                <div key={index}>{error}</div>
              ))}
            </div>
          )}
          {imagePreview && (
            <div className="mt-2">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-20 h-20 object-cover rounded-md border"
              />
            </div>
          )}
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isActive"
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            className="mr-2"
          />
          <label htmlFor="isActive" className="text-sm font-medium">
            Active
          </label>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {editingService ? 'Update' : 'Create'}
          </button>
          <button
            onClick={resetForm}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  const renderServicesTable = () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Service
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Duration
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Object.values(services).map((category) => (
              <div key={category._id}>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleCategory(category._id)}
                      className="flex items-center font-medium hover:text-blue-600 focus:outline-none focus:text-blue-600"
                      aria-expanded={expandedCategories[category._id]}
                      aria-label={`Toggle ${category.title} category`}
                    >
                      {expandedCategories[category._id] ? 
                        <ChevronDown className="w-4 h-4 mr-2" /> : 
                        <ChevronRight className="w-4 h-4 mr-2" />}
                      {category.title}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Category
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleServiceStatus(category)}
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer hover:opacity-80 ${
                        category.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                      aria-label={`Toggle status for ${category.title}`}
                    >
                      {category.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(category)}
                        className="text-blue-600 hover:text-blue-900"
                        aria-label={`Edit ${category.title}`}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(category)}
                        className="text-red-600 hover:text-red-900"
                        aria-label={`Delete ${category.title}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
                {expandedCategories[category._id] && category.subServices?.map(service => (
                  <tr key={service._id}>
                    <td className="px-6 py-4 whitespace-nowrap pl-12">
                      <div className="flex items-center">
                        {service.image && (
                          <img
                            src={service.image}
                            alt={service.title}
                            className="w-8 h-8 object-cover rounded mr-3"
                          />
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">{service.title}</div>
                          <div className="text-sm text-gray-500 max-w-xs truncate">
                            {service.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      Service
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {service.duration || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {service.price || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleServiceStatus(service)}
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer hover:opacity-80 ${
                          service.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                        aria-label={`Toggle status for ${service.title}`}
                      >
                        {service.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(service)}
                          className="text-blue-600 hover:text-blue-900"
                          aria-label={`Edit ${service.title}`}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(service)}
                          className="text-red-600 hover:text-red-900"
                          aria-label={`Delete ${service.title}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        {service.image && (
                          <button
                            onClick={() => handleDeleteImage(service._id)}
                            className="text-gray-600 hover:text-gray-900"
                            aria-label={`Delete image for ${service.title}`}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </div>
            ))}
          </tbody>
        </table>
      </div>
      
      {Object.keys(services).length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">No services found. Create your first service to get started.</p>
        </div>
      )}
    </div>
  );

  if (loading && Object.keys(services).length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading services...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Manage Services</h1>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setFormData({
                title: '',
                description: '',
                duration: '',
                price: '',
                isActive: true,
                isCategory: true,
                parentService: null
              });
              setShowAddForm(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Category
          </button>
          <button
            onClick={() => {
              setFormData({
                title: '',
                description: '',
                duration: '',
                price: '',
                isActive: true,
                isCategory: false,
                parentService: null
              });
              setShowAddForm(true);
            }}
            className="bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Service
          </button>
        </div>
      </div>

      {showAddForm && renderForm()}
      {renderServicesTable()}
      
      <LoadingOverlay isLoading={loading} />
      
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

// export default Services;

// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Plus, Edit, Trash2, Eye, EyeOff, Upload, X, Loader2} from 'lucide-react';

// // Set your backend base URL here
// const backendUrl = 'http://localhost:3000'; // Replace with your actual backend URL

// const Services = () => {
//   const [services, setServices] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showAddForm, setShowAddForm] = useState(false);
//   const [editingService, setEditingService] = useState(null);
//   const [imageFile, setImageFile] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);
//   const [expandedCategories, setExpandedCategories] = useState({});
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     duration: '',
//     price: '',
//     isActive: true,
//     isCategory: false,
//     parentService: null
//   })

//   useEffect(() => {
//     fetchServices();
//   }, []);

//   const fetchServices = async () => {
//     try {
//       setLoading(true);
//       const { data } = await axios.get(`${backendUrl}/api/admin/services`);
//       // Organize services into hierarchy
//       const categories = data.services.filter(s => s.isCategory);
//       const serviceMap = {};
      
//       categories.forEach(cat => {
//         serviceMap[cat._id] = {
//           ...cat,
//           subServices: data.services.filter(s => s.parentService === cat._id)
//         };
//       });
      
//       setServices(serviceMap);
//     } catch (err) {
//       console.error('Error fetching services:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//     const toggleCategory = (categoryId) => {
//     setExpandedCategories(prev => ({
//       ...prev,
//       [categoryId]: !prev[categoryId]
//     }));
//   };


//     // Add a new function to handle category/service selection
//   const handleServiceTypeChange = (e) => {
//     const isCategory = e.target.value === 'category';
//     setFormData({
//       ...formData,
//       isCategory,
//       // Reset parentService if switching to category
//       parentService: isCategory ? null : formData.parentService
//     });
//   };



//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setImageFile(file);
//       const reader = new FileReader();
//       reader.onload = (e) => setImagePreview(e.target.result);
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const url = editingService
//         ? `${backendUrl}/api/admin/${editingService._id}/toggle`
//         : `${backendUrl}/api/admin/addservices`;

//       const method = editingService ? 'put' : 'post';
//       const formDataObj = new FormData();
//       formDataObj.append('title', formData.title);
//       formDataObj.append('description', formData.description);
//       formDataObj.append('duration', formData.duration);
//       formDataObj.append('price', formData.price);
//       formDataObj.append('isActive', formData.isActive);

//       if (imageFile) {
//         formDataObj.append('image', imageFile);
//       }

//       await axios({
//         method,
//         url,
//         data: formDataObj,
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });

//       await fetchServices();
//       resetForm();
//     } catch (err) {
//       console.error('Error saving service:', err);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!confirm('Are you sure you want to delete this service?')) return;
//     try {
//       await axios.delete(`${backendUrl}/api/admin/${id}`);
//       await fetchServices();
//     } catch (err) {
//       console.error('Error deleting service:', err);
//     }
//   };

//   const handleDeleteImage = async (serviceId) => {
//     if (!confirm('Are you sure you want to delete this image?')) return;
//     try {
//       await axios.delete(`${backendUrl}/api/admin/${serviceId}/image`);
//       await fetchServices();
//     } catch (err) {
//       console.error('Error deleting image:', err);
//     }
//   };

//   const toggleServiceStatus = async (id, currentStatus) => {
//     try {
//       await axios.patch(`${backendUrl}/api/admin/${id}/toggle`, {
//         isActive: !currentStatus
//       });
//       await fetchServices();
//     } catch (err) {
//       console.error('Error updating service status:', err);
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       title: '',
//       description: '',
//       duration: '',
//       price: '',
//       isActive: true
//     });
//     setImageFile(null);
//     setImagePreview(null);
//     setEditingService(null);
//     setShowAddForm(false);
//   };

//   const startEdit = (service) => {
//     setFormData({
//       title: service.title,
//       description: service.description,
//       duration: service.duration,
//       price: service.price,
//       isActive: service.isActive
//     });
//     setImagePreview(service.image);
//     setEditingService(service);
//     setShowAddForm(true);
//   };

//   if (loading) {
//     return <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 animate-spin" /></div>;
//   }


//    // Modify the form to include service type and parent selection
//   const renderForm = () => (
//     <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//       <h2 className="text-xl font-semibold mb-4">
//         {editingService ? 'Edit Service' : 'Add New Service'}
//       </h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm font-medium mb-1">Service Type</label>
//             <select
//               value={formData.isCategory ? 'category' : 'service'}
//               onChange={handleServiceTypeChange}
//               className="w-full border rounded-md px-3 py-2"
//               required
//             >
//               <option value="category">Category (Group of Services)</option>
//               <option value="service">Individual Service</option>
//             </select>
//           </div>
//           {!formData.isCategory && (
//             <div>
//               <label className="block text-sm font-medium mb-1">Parent Category</label>
//               <select
//                 value={formData.parentService || ''}
//                 onChange={(e) => setFormData({ ...formData, parentService: e.target.value })}
//                 className="w-full border rounded-md px-3 py-2"
//                 required
//               >
//                 <option value="">Select a category</option>
//                 {Object.values(services)
//                   .filter(s => s.isCategory)
//                   .map(category => (
//                     <option key={category._id} value={category._id}>
//                       {category.title}
//                     </option>
//                   ))}
//               </select>
//             </div>
//           )}
//         </div>

//         {/* Keep existing form fields (title, description, etc.) */}
//         {/* ... */}
//       </form>
//     </div>
//   );

//   // Modify the table to show hierarchical structure
//   const renderServicesTable = () => (
//     <div className="bg-white rounded-lg shadow-md overflow-hidden">
//       <table className="w-full">
//         <thead className="bg-gray-50">
//           <tr>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//           </tr>
//         </thead>
//         <tbody className="bg-white divide-y divide-gray-200">
//           {Object.values(services).map((category) => (
//             <>
//               <tr key={category._id} className="bg-gray-50">
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <button 
//                     onClick={() => toggleCategory(category._id)}
//                     className="flex items-center font-medium"
//                   >
//                     {expandedCategories[category._id] ? 
//                       <ChevronDown className="w-4 h-4 mr-2" /> : 
//                       <ChevronRight className="w-4 h-4 mr-2" />}
//                     {category.title}
//                   </button>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Category</td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                     category.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                   }`}>
//                     {category.isActive ? 'Active' : 'Inactive'}
//                   </span>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                   {/* Action buttons */}
//                 </td>
//               </tr>
//               {expandedCategories[category._id] && category.subServices.map(service => (
//                 <tr key={service._id} className="pl-8">
//                   <td className="px-6 py-4 whitespace-nowrap pl-8">
//                     <div className="flex items-center">
//                       <div className="ml-4">
//                         <div className="text-sm font-medium text-gray-900">{service.title}</div>
//                         <div className="text-sm text-gray-500">{service.description?.substring(0, 50)}...</div>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Service</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{service.duration}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{service.price}</td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                       service.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                     }`}>
//                       {service.isActive ? 'Active' : 'Inactive'}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                     {/* Action buttons */}
//                   </td>
//                 </tr>
//               ))}
//             </>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold">Manage Services</h1>
//         <div className="flex gap-2">
//           <button
//             onClick={() => {
//               setFormData({
//                 title: '',
//                 description: '',
//                 duration: '',
//                 price: '',
//                 isActive: true,
//                 isCategory: true,
//                 parentService: null
//               });
//               setShowAddForm(true);
//             }}
//             className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
//           >
//             <Plus className="w-4 h-4" />
//             Add Category
//           </button>
//           <button
//             onClick={() => {
//               setFormData({
//                 title: '',
//                 description: '',
//                 duration: '',
//                 price: '',
//                 isActive: true,
//                 isCategory: false,
//                 parentService: null
//               });
//               setShowAddForm(true);
//             }}
//             className="bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700 flex items-center gap-2"
//           >
//             <Plus className="w-4 h-4" />
//             Add Service
//           </button>
//         </div>
//       </div>

//       {showAddForm && renderForm()}
//       {loading ? (
//         <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 animate-spin" /></div>
//       ) : (
//         renderServicesTable()
//       )}
//     </div>
//   );
// };

  // return (
  //   <div className="container mx-auto px-4 py-8">
  //     <div className="flex justify-between items-center mb-6">
  //       <h1 className="text-3xl font-bold">Manage Services</h1>
  //       <button
  //         onClick={() => setShowAddForm(true)}
  //         className="bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700 flex items-center gap-2"
  //       >
  //         <Plus className="w-4 h-4" />
  //         Add Service
  //       </button>
  //     </div>

  //     {/* Add/Edit Form */}
  //     {showAddForm && (
  //       <div className="bg-white rounded-lg shadow-md p-6 mb-6">
  //         <h2 className="text-xl font-semibold mb-4">
  //           {editingService ? 'Edit Service' : 'Add New Service'}
  //         </h2>
  //         <form onSubmit={handleSubmit} className="space-y-4">
  //           <div>
  //             <label className="block text-sm font-medium mb-1">Title</label>
  //             <input
  //               type="text"
  //               value={formData.title}
  //               onChange={(e) => setFormData({ ...formData, title: e.target.value })}
  //               className="w-full border rounded-md px-3 py-2"
  //               required
  //             />
  //           </div>
  //           <div>
  //             <label className="block text-sm font-medium mb-1">Description</label>
  //             <textarea
  //               value={formData.description}
  //               onChange={(e) => setFormData({ ...formData, description: e.target.value })}
  //               className="w-full border rounded-md px-3 py-2"
  //               rows="3"
  //               required
  //             />
  //           </div>
  //           <div className="grid grid-cols-2 gap-4">
  //             <div>
  //               <label className="block text-sm font-medium mb-1">Duration</label>
  //               <input
  //                 type="text"
  //                 value={formData.duration}
  //                 onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
  //                 className="w-full border rounded-md px-3 py-2"
  //                 placeholder="e.g., 2-4 hours"
  //                 required
  //               />
  //             </div>
  //             <div>
  //               <label className="block text-sm font-medium mb-1">Price</label>
  //               <input
  //                 type="text"
  //                 value={formData.price}
  //                 onChange={(e) => setFormData({ ...formData, price: e.target.value })}
  //                 className="w-full border rounded-md px-3 py-2"
  //                 placeholder="e.g., ₦5,000"
  //                 required
  //               />
  //             </div>
  //           </div>

  //           <div>
  //             <label className="block text-sm font-medium mb-1">Service Image</label>
  //             <div className="space-y-3">
  //               {imagePreview && (
  //                 <div className="relative w-32 h-32 border rounded-lg overflow-hidden">
  //                   <img
  //                     src={imagePreview}
  //                     alt="Service preview"
  //                     className="w-full h-full object-cover"
  //                   />
  //                   <button
  //                     type="button"
  //                     onClick={() => {
  //                       setImageFile(null);
  //                       setImagePreview(null);
  //                     }}
  //                     className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
  //                   >
  //                     <X className="w-3 h-3" />
  //                   </button>
  //                 </div>
  //               )}
  //               <div className="flex items-center space-x-2">
  //                 <label className="flex items-center cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md border">
  //                   <Upload className="w-4 h-4 mr-2" />
  //                   Choose Image
  //                   <input
  //                     type="file"
  //                     accept="image/*"
  //                     onChange={handleImageChange}
  //                     className="hidden"
  //                   />
  //                 </label>
  //                 {editingService && editingService.image && !imageFile && (
  //                   <button
  //                     type="button"
  //                     onClick={() => handleDeleteImage(editingService._id)}
  //                     className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600"
  //                   >
  //                     Delete Current Image
  //                   </button>
  //                 )}
  //               </div>
  //               <p className="text-sm text-gray-500">Supported formats: JPG, PNG, WebP. Max size: 5MB</p>
  //             </div>
  //           </div>

  //           <div className="flex items-center gap-2">
  //             <input
  //               type="checkbox"
  //               checked={formData.isActive}
  //               onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
  //               className="rounded"
  //             />
  //             <label className="text-sm font-medium">Active</label>
  //           </div>
  //           <div className="flex gap-2">
  //             <button type="submit" className="bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700">
  //               {editingService ? 'Update' : 'Add'} Service
  //             </button>
  //             <button type="button" onClick={resetForm} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400">
  //               Cancel
  //             </button>
  //           </div>
  //         </form>
  //       </div>
  //     )}

  //     {/* Services Table */}
  //     <div className="bg-white rounded-lg shadow-md overflow-hidden">
  //       <table className="w-full">
  //         <thead className="bg-gray-50">
  //           <tr>
  //             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
  //             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
  //             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
  //             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
  //             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
  //           </tr>
  //         </thead>
  //         <tbody className="bg-white divide-y divide-gray-200">
  //           {services.map((service) => (
  //             <tr key={service._id}>
  //               <td className="px-6 py-4 whitespace-nowrap">
  //                 <div className="flex items-center">
  //                   <div className="relative">
  //                     <img
  //                       src={service.image || "/api/placeholder/40/40"}
  //                       alt={service.title}
  //                       className="w-10 h-10 rounded-full object-cover mr-3"
  //                     />
  //                     {service.image && (
  //                       <button
  //                         onClick={() => handleDeleteImage(service._id)}
  //                         className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
  //                         style={{ fontSize: '10px' }}
  //                       >
  //                         <X className="w-2 h-2" />
  //                       </button>
  //                     )}
  //                   </div>
  //                   <div>
  //                     <div className="text-sm font-medium text-gray-900">{service.title}</div>
  //                     <div className="text-sm text-gray-500">{service.description?.substring(0, 50)}...</div>
  //                   </div>
  //                 </div>
  //               </td>
  //               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{service.duration}</td>
  //               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{service.price}</td>
  //               <td className="px-6 py-4 whitespace-nowrap">
  //                 <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
  //                   service.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
  //                 }`}>
  //                   {service.isActive ? 'Active' : 'Inactive'}
  //                 </span>
  //               </td>
  //               <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
  //                 <div className="flex items-center gap-2">
  //                   <button
  //                     onClick={() => toggleServiceStatus(service._id, service.isActive)}
  //                     className="text-blue-600 hover:text-blue-900"
  //                   >
  //                     {service.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
  //                   </button>
  //                   <button
  //                     onClick={() => startEdit(service)}
  //                     className="text-indigo-600 hover:text-indigo-900"
  //                   >
  //                     <Edit className="w-4 h-4" />
  //                   </button>
  //                   <button
  //                     onClick={() => handleDelete(service._id)}
  //                     className="text-red-600 hover:text-red-900"
  //                   >
  //                     <Trash2 className="w-4 h-4" />
  //                   </button>
  //                 </div>
  //               </td>
  //             </tr>
  //           ))}
  //         </tbody>
  //       </table>
  //     </div>
  //   </div>
  // );
// };

export default Services;
