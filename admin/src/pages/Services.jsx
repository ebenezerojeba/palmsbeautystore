import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Plus, Edit, Trash2, Loader2, ChevronDown, ChevronRight, AlertCircle, CheckCircle, XCircle, X } from 'lucide-react';
import { LoadingOverlay } from '../components/Loader';
import { api, useApi } from '../hooks/api.js';
import { Toast } from '../components/Toast.jsx';
import { sanitizeFormData, validateImageFile } from '../utils/utility.js';

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

  const hasServices = Object.values(services).some(cat => cat.subServices && cat.subServices.length > 0);

  const fetchServices = useCallback(async () => {
    try {
      const { data } = await makeRequest(() => api.getServices());
      console.log('Fetched services:', data);

      const categoryMap = {};
      const categories = data.filter(s => s.isCategory);

      categories.forEach(cat => {
        categoryMap[cat._id] = {
          ...cat,
          subServices: data.filter(s => s.parentService === cat._id),
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
    const sanitized = sanitizeFormData(formData);

    if (!sanitized.title) {
      showToast('Title required', 'error');
      return;
    }

    if (!sanitized.isCategory && !sanitized.parentService) {
      showToast('Please select a parent category for services', 'error');
      return;
    }

    try {
      const formDataObj = new FormData();
      Object.keys(sanitized).forEach((key) => {
        if (sanitized[key] !== null && sanitized[key] !== undefined) {
          formDataObj.append(key, sanitized[key]);
        }
      });
      if (imageFile) {
        formDataObj.append('image', imageFile);
      }

      if (editingService) {
        if (editingService.isCategory) {
          await makeRequest(() => api.updateCategory(editingService._id, formDataObj));
          showToast('Category updated successfully', 'success');
        } else {
          await makeRequest(() => api.updateService(editingService._id, formDataObj));
          showToast('Service updated successfully', 'success');
        }
      } else {
        if (sanitized.isCategory) {
          await makeRequest(() => api.createCategory(formDataObj));
          showToast('Category created successfully', 'success');
        } else {
          await makeRequest(() => api.createService(formDataObj));
          showToast('Service created successfully', 'success');
        }
      }

      await fetchServices();
      resetForm();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDelete = async (item) => {
    const confirmMessage = item.isCategory
      ? `Are you sure you want to delete the category "${item.title}"? This will also delete all services under it.`
      : `Are you sure you want to delete "${item.title}"?`;

    if (!window.confirm(confirmMessage)) return;

    try {
      if (item.isCategory) {
        await makeRequest(() => api.deleteCategory(item._id));
      } else {
        await makeRequest(() => api.deleteService(item._id));
      }
      showToast('Deleted successfully', 'success');
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

  const toggleServiceStatus = async (item) => {
    try {
      if (item.isCategory) {
        await makeRequest(() => api.toggleCategoryStatus(item._id, !item.isActive));
      } else {
        await makeRequest(() => api.toggleServiceStatus(item._id, !item.isActive));
      }
      showToast(`${item.title} ${item.isActive ? 'deactivated' : 'activated'}`, 'success');
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
      image: service.image || '',
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

  const startAddCategory = () => {
    setFormData({
      title: '',
      description: '',
      duration: '',
      price: '',
      isActive: true,
      isCategory: true,
      parentService: null
    });
    setImageFile(null);
    setImagePreview(null);
    setImageErrors([]);
    setEditingService(null);
    setShowAddForm(true);
  };

  const startAddService = () => {
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
    setShowAddForm(true);
  };

  const renderForm = () => (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <h2 className="text-xl font-semibold">
          {editingService
            ? editingService.isCategory
              ? 'Edit Category'
              : 'Edit Service'
            : formData.isCategory
              ? 'Add New Category'
              : 'Add New Service'}
        </h2>

        <button
          onClick={resetForm}
          className="text-gray-400 hover:text-gray-600 p-1"
          aria-label="Close form"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <span className="text-red-700 text-sm">{error}</span>
        </div>
      )}

      <div className="space-y-4">
        {/* Service Type - Only show if not editing and not adding category specifically */}
        {!editingService && !formData.isCategory && (
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
        )}

        {/* Parent Service for services */}
        {!formData.isCategory && editingService && (
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

        {/* Only show description for categories or if editing/adding service */}
       {!formData.isCategory && (
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
)}


        {/* Duration and Price only for services */}
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

        {/* Image upload only for services */}
        {!formData.isCategory && (
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
        )}

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

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
              {hasServices && (
  <>
    <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
      Duration
    </th>
    <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
      Price
    </th>
  </>
)}

              <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Service
              </th>
              <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                Type
              </th>
              {/* <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                Duration
              </th>
              <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                Price
              </th> */}
              <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            
            {Object.values(services).map((category) => (
              <React.Fragment key={category._id}>
                <tr className="bg-gray-50">
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                    
                    <button
                      onClick={() => toggleCategory(category._id)}
                      className="flex items-center font-medium hover:text-blue-600 focus:outline-none focus:text-blue-600 text-left"
                      aria-expanded={expandedCategories[category._id]}
                      aria-label={`Toggle ${category.title} category`}
                    >
                      {expandedCategories[category._id] ?
                        <ChevronDown className="w-4 h-4 mr-2 flex-shrink-0" /> :
                        <ChevronRight className="w-4 h-4 mr-2 flex-shrink-0" />}
                      <span className="truncate">{category.title}</span>
                    </button>
                  </td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                    Category
                  </td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">-</td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">-</td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleServiceStatus(category)}
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer hover:opacity-80 ${
                        category.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                      aria-label={`Toggle status for ${category.title}`}
                    >
                      {category.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-1 md:gap-2">
                      <button
                        onClick={() => startEdit(category)}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        aria-label={`Edit ${category.title}`}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(category)}
                        className="text-red-600 hover:text-red-900 p-1"
                        aria-label={`Delete ${category.title}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
                {expandedCategories[category._id] && category.subServices?.map(service => (
                  
                  <tr key={service._id} className="hover:bg-gray-50">
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap pl-6 md:pl-12">
                      {hasServices && (
  <>
    <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden md:table-cell">
      {service.duration || '-'}
    </td>
    <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden md:table-cell">
      {service.price || '-'}
    </td>
  </>
)}

                      <div className="flex items-center">
                        {service.image && (
                          <img
                            src={service.image}
                            alt={service.title}
                            className="w-6 h-6 md:w-8 md:h-8 object-cover rounded mr-2 md:mr-3 flex-shrink-0"
                          />
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium text-gray-900 truncate">{service.title}</div>
                          <div className="text-xs md:text-sm text-gray-500 truncate max-w-xs">
                            {service.description}
                          </div>
                          {/* Show duration and price on mobile */}
                          <div className="md:hidden text-xs text-gray-500 mt-1">
                            {service.duration && <span>Duration: {service.duration}</span>}
                            {service.duration && service.price && <span> • </span>}
                            {service.price && <span>Price: {service.price}</span>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                      Service
                    </td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden md:table-cell">
                      {service.duration || '-'}
                    </td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden md:table-cell">
                      {service.price || '-'}
                    </td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleServiceStatus(service)}
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer hover:opacity-80 ${
                          service.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                        aria-label={`Toggle status for ${service.title}`}
                      >
                        {service.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-1 md:gap-2">
                        <button
                          onClick={() => startEdit(service)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          aria-label={`Edit ${service.title}`}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(service)}
                          className="text-red-600 hover:text-red-900 p-1"
                          aria-label={`Delete ${service.title}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        {service.image && (
                          <button
                            onClick={() => handleDeleteImage(service._id)}
                            className="text-gray-600 hover:text-gray-900 p-1"
                            aria-label={`Delete image for ${service.title}`}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </React.Fragment>
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
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Manage Services</h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button
            onClick={startAddCategory}
            className="bg-gray-600 text-white px-4 py-2 rounded-md flex items-center justify-center gap-2 hover:bg-gray-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Category
          </button>
          <button
            onClick={startAddService}
            className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
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

export default Services;