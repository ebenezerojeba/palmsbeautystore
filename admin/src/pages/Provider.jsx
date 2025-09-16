import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  User, 
  Calendar, 
  Clock, 
  Star, 
  Phone, 
  Mail, 
  Plus, 
  Search, 
  Filter,
  MapPin,
  Edit,
  Trash2,
  Eye,
  UserPlus,
  Settings,
  ChevronDown,
  ChevronRight,
  CheckCircle,
  XCircle,
  Save,
  X,
  AlertCircle,
  Clock4
} from 'lucide-react';


const Provider = () => {
  const [providers, setProviders] = useState([]);
  const [services, setServices] = useState([]);
  const [servicesWithProvider, setServicesWithProvider] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [view, setView] = useState('grid');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceFilter, setServiceFilter] = useState('');
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [editingProvider, setEditingProvider] = useState(null);
  const [providerSchedule, setProviderSchedule] = useState(null);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showAddProviderModal, setShowAddProviderModal] = useState(false)

  const backendUrl = "http://localhost:3000";

  useEffect(() => {
    loadProviders();
    loadServices();
    loadServicesWithProviders();
  }, []);

  const showMessage = (type, message) => {
    if (type === 'success') {
      setSuccess(message);
      setError('');
      setTimeout(() => setSuccess(''), 5000);
    } else {
      setError(message);
      setSuccess('');
      setTimeout(() => setError(''), 5000);
    }
  };

  const loadProviders = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${backendUrl}/api/provider`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      
      if (data.success) {
        setProviders(data.providers || []);
      } else {
        throw new Error(data.message || 'Failed to load providers');
      }
    } catch (error) {
      console.error('Failed to load providers:', error);
      showMessage('error', 'Failed to load providers: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

 
const loadServices = async () => {
  try {
    setLoading(true);
    setError(null);
    
    const response = await axios.get(`${backendUrl}/api/services/all-services`, {
      timeout: 10000, // 10 second timeout
    });
    
    setServices(response.data.services || []);
  } catch (err) {
    let errorMessage = 'Something went wrong';
    
    if (err.code === 'ECONNABORTED') {
      errorMessage = 'Request timeout. Please try again.';
    } else if (err.response?.status === 404) {
      errorMessage = 'Services not found';
    } else if (err.response?.status >= 500) {
      errorMessage = 'Server error. Please try again later.';
    } else if (err.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err.message) {
      errorMessage = err.message;
    }
    
    setError(errorMessage);
  } finally {
    setLoading(false);
  }
};
 

const addProvider = async (formData) => {
   try {
    const response = await axios.post(
      `${backendUrl}/api/admin/createprovider`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to add provider:", error);
    throw error.response?.data || error;
  }
}
  const loadServicesWithProviders = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/admin/services-with-providers`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      
     if (data.success) {
  const parentServices = (data.services || []).filter(s => s.isCategory === true);
  setServicesWithProvider(parentServices);
}

    } catch (error) {
      console.error('Failed to load services with providers:', error);
      showMessage('error', 'Failed to load services with providers: ' + error.message);
    }
  };

  const loadProviderSchedule = async (providerId) => {
    setScheduleLoading(true);
    try {
      const startDate = new Date().toISOString().split('T')[0];
      const endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const response = await fetch(
        `${backendUrl}/api/provider/${providerId}/schedule?startDate=${startDate}&endDate=${endDate}`
      );
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      
      if (data.success) {
        setProviderSchedule(data.schedule);
      } else {
        throw new Error(data.message || 'Failed to load schedule');
      }
    } catch (error) {
      console.error('Failed to load schedule:', error);
      showMessage('error', 'Failed to load schedule: ' + error.message);
    } finally {
      setScheduleLoading(false);
    }
  };

  // FIXED FRONTEND CODE:
const addServiceToProvider = async (providerId, serviceId) => {
  try {
    console.log('Adding service to provider:', { providerId, serviceId }); // Debug log
    
    const response = await fetch(
      `${backendUrl}/api/admin/service/${serviceId}/provider/${providerId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
       
        },
        // Add empty body since your backend doesn't expect body data
        body: JSON.stringify({})
      }
    );

    console.log('Response status:', response.status); // Debug log
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('Success result:', result); // Debug log
    
    if (result.success) {
      showMessage('success', 'Service added successfully!');
      await Promise.all([loadProviders(), loadServices()]);
      
      // Update selected provider if it's the one being modified
      if (selectedProvider && selectedProvider._id === providerId) {
        const updatedProvider = providers.find(p => p._id === providerId);
        if (updatedProvider) {
          setSelectedProvider(updatedProvider);
        }
      }
    } else {
      throw new Error(result.message || 'Failed to add service');
    }
  } catch (error) {
    console.error('Failed to add service:', error);
    showMessage('error', 'Failed to add service: ' + error.message);
    throw error; // Re-throw so the modal can handle it
  }
};

  const removeServiceFromProvider = async (providerId, serviceId) => {
    if (!window.confirm('Are you sure you want to remove this service from the provider?')) {
      return;
    }

    try {
      const response = await fetch(
        `${backendUrl}/api/admin/service/${serviceId}/provider/${providerId}`,
        { 
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const result = await response.json();
      
      if (result.success) {
        showMessage('success', 'Service removed successfully!');
        await Promise.all([loadProviders(), loadServices()]);
        
        // Update selected provider if it's the one being modified
        if (selectedProvider && selectedProvider._id === providerId) {
          const updatedProvider = providers.find(p => p._id === providerId);
          if (updatedProvider) {
            setSelectedProvider(updatedProvider);
          }
        }
      } else {
        throw new Error(result.message || 'Failed to remove service');
      }
    } catch (error) {
      console.error('Failed to remove service:', error);
      showMessage('error', 'Failed to remove service: ' + error.message);
    }
  };

  const updateProviderWorkingHours = async (providerId, workingHours) => {
    try {
      const response = await fetch(
        `${backendUrl}/api/provider/${providerId}/working-hours`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ workingHours }),
        }
      );
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const result = await response.json();
      
      if (result.success) {
        showMessage('success', 'Working hours updated successfully!');
        await loadProviders();
        
        // Update selected provider
        if (selectedProvider && selectedProvider._id === providerId) {
          const updatedProvider = providers.find(p => p._id === providerId);
          if (updatedProvider) {
            setSelectedProvider(updatedProvider);
          }
        }
      } else {
        throw new Error(result.message || 'Failed to update working hours');
      }
    } catch (error) {
      console.error('Failed to update working hours:', error);
      showMessage('error', 'Failed to update working hours: ' + error.message);
    }
  };
const updateProvider = async (providerId, data) => {
  try {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      formData.append(key, data[key]);
    });

    if (data.profileImage) {
      formData.append("profileimage", data.profileImage); 
    }

    const response = await fetch(`${backendUrl}/api/admin/${providerId}`, {
      method: "PUT",
      body: formData
    });

    const result = await response.json();
    console.log(result);
  } catch (error) {
    console.error("Error:", error);
  }
};

  const filteredProviders = providers.filter(provider => {
    if (!provider) return false;
    
    const matchesSearch = provider.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         provider.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesService = !serviceFilter || 
                          (provider.services && provider.services.some(s => s._id === serviceFilter));
    return matchesSearch && matchesService;
  });

  const MessageAlert = () => {
    if (!error && !success) return null;
    
    return (
      <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
        success ? 'bg-green-100 text-green-800 border border-green-200' : 
                 'bg-red-100 text-red-800 border border-red-200'
      }`}>
        <div className="flex items-center">
          {success ? (
            <CheckCircle className="w-5 h-5 mr-2" />
          ) : (
            <AlertCircle className="w-5 h-5 mr-2" />
          )}
          <span className="text-sm font-medium">{success || error}</span>
          <button
            onClick={() => {
              setSuccess('');
              setError('');
            }}
            className="ml-2 text-current hover:text-opacity-75"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  const ProviderCard = ({ provider }) => {
    if (!provider) return null;

    const rating = provider.rating || { average: 0, count: 0 };
    
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
        <div className="p-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <img
                src={
                  provider.profileImage ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    provider.name || 'Unknown'
                  )}&size=64&background=3b82f6&color=ffffff`
                }
                alt={provider.name || 'Unknown Provider'}
                className="w-16 h-16 rounded-full object-cover"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    provider.name || 'Unknown'
                  )}&size=64&background=3b82f6&color=ffffff`;
                }}
              />
              <div className="flex items-center justify-center mt-2">
                {provider.isActive ? (
                  <span className="flex items-center text-green-600 text-xs">
                    <CheckCircle size={12} className="mr-1" />
                    Active
                  </span>
                ) : (
                  <span className="flex items-center text-red-600 text-xs">
                    <XCircle size={12} className="mr-1" />
                    Inactive
                  </span>
                )}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {provider.name || 'Unknown Provider'}
                </h3>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium text-gray-700">
                    {rating.average > 0 ? (
                      `${rating.average.toFixed(1)} (${rating.count} reviews)`
                    ) : (
                      'No ratings yet'
                    )}
                  </span>
                </div>
              </div>

              <div className="mt-1 space-y-1">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="w-4 h-4 mr-2" />
                  {provider.email || 'No email'}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  {provider.phone || "No phone number"}
                </div>
              </div>

              <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                {provider.bio || "No bio available"}
              </p>

              <div className="mt-3">
              <div className="flex flex-wrap gap-1">
  {provider.services && provider.services.length > 0 ? (
    <>
      {provider.services.slice(0, 3).map((service) => {
        const serviceTitle = service.title || service.name || 'Unnamed Service';
        return (
          <span
            key={service._id || service.serviceId}
            className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-md"
          >
            {serviceTitle}
          </span>
        );
      })}
      {provider.services.length > 3 && (
        <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-md">
          +{provider.services.length - 3} more
        </span>
      )}
    </>
  ) : (
    <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-500 rounded-md">
      No services assigned
    </span>
  )}
</div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setSelectedProvider(provider);
                  setView("detail");
                }}
                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Eye className="w-4 h-4 mr-1" />
                View
              </button>
              <button
                onClick={() => {
                  setSelectedProvider(provider);
                  loadProviderSchedule(provider._id);
                  setView("schedule");
                }}
                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
              >
                <Calendar className="w-4 h-4 mr-1" />
                Schedule
              </button>
            </div>

            <div className="flex space-x-1">
              <button
                onClick={() => {
                  setEditingProvider(provider);
                  setView("edit-provider");
                }}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Edit className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };


const ProviderDetail = ({ provider }) => {
  useEffect(() => {
  if (selectedProvider && selectedProvider.services) {
    console.log('Provider services structure:', selectedProvider.services);
    selectedProvider.services.forEach((service, index) => {
      console.log(`Service ${index}:`, service);
    });
  }
}, [selectedProvider]);
  if (!provider) return null;

  const rating = provider.rating || { average: 0, count: 0 };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setView('grid')}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back to Providers
          </button>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowAddServiceModal(true)}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Service
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-start space-x-6">
          <div className="flex-shrink-0">
            <img
              src={
                provider.profileImage ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  provider.name || 'Unknown'
                )}&size=128&background=3b82f6&color=ffffff`
              }
              alt={provider.name || 'Unknown Provider'}
              className="w-32 h-32 rounded-full object-cover"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  provider.name || 'Unknown'
                )}&size=128&background=3b82f6&color=ffffff`;
              }}
            />
          </div>

          <div className="flex-1">
            <div className="flex items-center space-x-4 mb-4">
              <h1 className="text-2xl font-bold text-gray-900">
                {provider.name || 'Unknown Provider'}
              </h1>
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="text-lg font-medium text-gray-700">
                  {rating.average > 0 ? (
                    `${rating.average.toFixed(1)} (${rating.count} reviews)`
                  ) : (
                    '0.0 (0 reviews)'
                  )}
                </span>
              </div>
              {provider.isActive ? (
                <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                  <CheckCircle size={12} className="mr-1" />
                  Active
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                  <XCircle size={12} className="mr-1" />
                  Inactive
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <Mail className="w-5 h-5 mr-3" />
                  <span>{provider.email || 'No email'}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="w-5 h-5 mr-3" />
                  <span>{provider.phone || 'No phone number'}</span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">About</h3>
              <p className="text-gray-600">{provider.bio || 'No bio available'}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Assigned Services</h3>
              <button
                onClick={() => setShowAddServiceModal(true)}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                + Add Service
              </button>
            </div>
          <div className="space-y-3">
  {provider.services && provider.services.length > 0 ? (
    provider.services.map((service) => {
      // Handle both service object structures
      const serviceId = service._id || service.serviceId;
      const serviceTitle = service.title || service.name || 'Unnamed Service';
      
      
      return (
        <div
          key={serviceId}
          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
        >
          <div>
            <h4 className="font-medium text-gray-900">
              {serviceTitle}
            </h4>
           < h6 className="text-sm text-gray-600">ID: {serviceId}</h6> 

           <div>
            
           </div>
          </div>
          <button
            onClick={() => removeServiceFromProvider(provider._id, serviceId)}
            className="text-red-600 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors"
            title="Remove service"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      );
    })
  ) : (
    <div className="text-center py-8">
      <div className="text-gray-400 mb-2">
        <Clock4 className="w-12 h-12 mx-auto" />
      </div>
      <p className="text-gray-500 italic">
        No services assigned to this provider
      </p>
    </div>
  )}
</div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Available Services</h3>
            </div>
          <div className="space-y-3">
  {services.filter(service => {
    const serviceId = service._id;
    // Check if this service is already assigned
    return !provider.services?.some(ps => {
      const assignedServiceId = ps._id || ps.serviceId;
      return assignedServiceId === serviceId;
    });
  }).length > 0 ? (
    services
      .filter(service => {
        const serviceId = service._id;
        return !provider.services?.some(ps => {
          const assignedServiceId = ps._id || ps.serviceId;
          return assignedServiceId === serviceId;
        });
      })
      .map((service) => (
        <div
          key={service._id}
          className="flex items-center justify-between p-3 bg-blue-50 rounded-lg"
        >
          <div>
            <h4 className="font-medium text-gray-900">{service.title || service.name}</h4>
           
          </div>
          <button
            onClick={() => addServiceToProvider(provider._id, service._id)}
            className="text-green-600 hover:text-green-700 p-1 rounded hover:bg-green-50 transition-colors"
            title="Add service"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      ))
  ) : (
    <div className="text-center py-4">
      <p className="text-gray-500 italic">
        All services are already assigned to this provider
      </p>
    </div>
  )}
</div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Working Hours</h3>
              <button
                onClick={() => {
                  loadProviderSchedule(provider._id);
                  setView('schedule');
                }}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Edit Schedule
              </button>
            </div>
            <div className="space-y-2">
              {[
                'Sunday',
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday',
              ].map((day, index) => {
                const workingDay =
                  provider.workingHours &&
                  provider.workingHours.find((wh) => wh.dayOfWeek === index);
                return (
                  <div
                    key={day}
                    className="flex justify-between items-center p-2 bg-gray-50 rounded"
                  >
                    <span className="font-medium text-gray-700">{day}</span>
                    <span className="text-gray-600">
                      {workingDay && workingDay.isWorking
                        ? `${workingDay.startTime} - ${workingDay.endTime}`
                        : 'Closed'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {showAddServiceModal && (
        <AddServiceModal
          provider={provider}
          services={services}
          onClose={() => setShowAddServiceModal(false)}
          onAdd={addServiceToProvider}
        />
      )}
    </div>
  );
};

  const AddServiceModal = ({ provider, services, onClose, onAdd }) => {
    const [selectedService, setSelectedService] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    
    const availableServices = services.filter(service => 
      !provider.services?.some(ps => ps._id === service._id)
    );

    const handleAdd = async () => {
      if (selectedService && !isAdding) {
        setIsAdding(true);
        try {
          await onAdd(provider._id, selectedService);
          onClose();
        } catch (error) {
          console.error('Error adding service:', error);
        } finally {
          setIsAdding(false);
        }
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Add Service to {provider.name}
            </h3>
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-gray-600 transition-colors"
              disabled={isAdding}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Service
            </label>
            {availableServices.length > 0 ? (
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isAdding}
              >
                <option value="">Choose a service...</option>
                {availableServices.map(service => (
                  <option key={service._id} value={service._id}>
                    {service.title})
                  </option>
                ))}
              </select>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500 italic">
                  All available services have been assigned to this provider
                </p>
              </div>
            )}
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              disabled={isAdding}
            >
              Cancel
            </button>
            {availableServices.length > 0 && (
              <button
                onClick={handleAdd}
                disabled={!selectedService || isAdding}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {isAdding ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Adding...
                  </>
                ) : (
                  'Add Service'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const ScheduleManagement = ({ provider }) => {
    const [workingHours, setWorkingHours] = useState(
      provider.workingHours && provider.workingHours.length > 0 
        ? provider.workingHours 
        : [
            { dayOfWeek: 0, isWorking: false, startTime: '09:00', endTime: '17:00' },
            { dayOfWeek: 1, isWorking: true, startTime: '09:00', endTime: '17:00' },
            { dayOfWeek: 2, isWorking: true, startTime: '09:00', endTime: '17:00' },
            { dayOfWeek: 3, isWorking: true, startTime: '09:00', endTime: '17:00' },
            { dayOfWeek: 4, isWorking: true, startTime: '09:00', endTime: '17:00' },
            { dayOfWeek: 5, isWorking: true, startTime: '09:00', endTime: '17:00' },
            { dayOfWeek: 6, isWorking: false, startTime: '09:00', endTime: '17:00' }
          ]
    );
    const [isSaving, setIsSaving] = useState(false);

    const updateWorkingDay = (dayOfWeek, field, value) => {
      setWorkingHours(prev => {
        const newHours = [...prev];
        const dayIndex = newHours.findIndex(wh => wh.dayOfWeek === dayOfWeek);
        
        if (dayIndex !== -1) {
          newHours[dayIndex] = { ...newHours[dayIndex], [field]: value };
        } else {
          // Create new working day if it doesn't exist
          const defaultTime = field === 'startTime' ? value : 
                            field === 'endTime' ? value : '09:00';
          newHours.push({
            dayOfWeek,
            isWorking: field === 'isWorking' ? value : false,
            startTime: field === 'startTime' ? value : defaultTime,
            endTime: field === 'endTime' ? value : '17:00'
          });
        }
        
        return newHours.sort((a, b) => a.dayOfWeek - b.dayOfWeek);
      });
    };

    const handleSave = async () => {
      setIsSaving(true);
      try {
        await updateProviderWorkingHours(provider._id, workingHours);
      } catch (error) {
        console.error('Error saving schedule:', error);
      } finally {
        setIsSaving(false);
      }
    };

    const dayNames = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday'
    ];

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setView('detail')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Back to Provider Details
            </button>
            <h2 className="text-xl font-semibold text-gray-900">
              Schedule for {provider.name}
            </h2>
            <div className="w-24"></div> {/* Spacer for alignment */}
          </div>
        </div>

        <div className="p-6">
          <div className="max-w-2xl mx-auto">
            <div className="space-y-4">
              {dayNames.map((dayName, index) => {
                const daySchedule = workingHours.find(wh => wh.dayOfWeek === index) || 
                                  { dayOfWeek: index, isWorking: false, startTime: '09:00', endTime: '17:00' };
                
                return (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <input
                        type="checkbox"
                        checked={daySchedule.isWorking}
                        onChange={(e) => updateWorkingDay(index, 'isWorking', e.target.checked)}
                        className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="w-24 font-medium text-gray-700">{dayName}</span>
                    </div>
                    
                    {daySchedule.isWorking ? (
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          <label className="text-sm text-gray-600">From:</label>
                          <input
                            type="time"
                            value={daySchedule.startTime}
                            onChange={(e) => updateWorkingDay(index, 'startTime', e.target.value)}
                            className="px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <label className="text-sm text-gray-600">To:</label>
                          <input
                            type="time"
                            value={daySchedule.endTime}
                            onChange={(e) => updateWorkingDay(index, 'endTime', e.target.value)}
                            className="px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">Closed</span>
                    )}
                  </div>
                );
              })}
            </div>
            
            <div className="mt-8 flex justify-end space-x-3">
              <button
                onClick={() => setView('detail')}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Schedule
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };


  const EditProvider = ({ provider, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
      name: provider.name || '',
      email: provider.email || '',
      phone: provider.phone || '',
      bio: provider.bio || '',
      isActive: provider.isActive || false
    });
    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSaving(true);
      try {
        await onSave(provider._id, formData);
      } catch (error) {
        console.error('Error saving provider:', error);
      } finally {
        setIsSaving(false);
      }
    };

    const handleChange = (field, value) => {
      setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <button
              onClick={onCancel}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Back to Providers
            </button>
            <h2 className="text-xl font-semibold text-gray-900">
              Edit Provider
            </h2>
            <div className="w-24"></div>
          </div>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => handleChange('bio', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
              ></textarea>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => handleChange('isActive', e.target.checked)}
                className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label className="text-sm text-gray-700">Active</label>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={onCancel}
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  

  const GridView = () => {
    
    return (
      <div>
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Service Providers</h1>

             <button
              onClick={() => setShowAddProviderModal(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Add Provider
            </button>
          </div>
            
        
          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search providers by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={serviceFilter}
                onChange={(e) => setServiceFilter(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black  bg-white"
              >
                <option value="">All Services</option>
{services.map(service => (
  <option key={service._id} value={service._id} style={{ color: 'black' }}>
    {service.title}
  </option>
))}
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading providers...</span>
          </div>
        ) : filteredProviders.length === 0 ? (
          <div className="text-center py-12">
            <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No providers found</h3>
            <p className="text-gray-500">
              {searchTerm || serviceFilter 
                ? "Try adjusting your search criteria or filters." 
                : "There are no providers to display."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProviders.map(provider => (
              <ProviderCard key={provider._id} provider={provider} />
            ))}
          </div>
        )}
      </div>
    );
  };

  // Add Provider Modal Component
const AddProviderModal = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    services: [],
    workingHours: [
      { dayOfWeek: 0, isWorking: false, startTime: '09:00', endTime: '17:00' },
      { dayOfWeek: 1, isWorking: true, startTime: '09:00', endTime: '17:00' },
      { dayOfWeek: 2, isWorking: true, startTime: '09:00', endTime: '17:00' },
      { dayOfWeek: 3, isWorking: true, startTime: '09:00', endTime: '17:00' },
      { dayOfWeek: 4, isWorking: true, startTime: '09:00', endTime: '17:00' },
      { dayOfWeek: 5, isWorking: true, startTime: '09:00', endTime: '17:00' },
      { dayOfWeek: 6, isWorking: false, startTime: '09:00', endTime: '17:00' }
    ],
    bookingBuffer: 15,
    profileImage: null
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showWorkingHours, setShowWorkingHours] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleServiceChange = (serviceId) => {
    setFormData(prev => {
      const services = [...prev.services];
      const index = services.indexOf(serviceId);
      
      if (index > -1) {
        services.splice(index, 1);
      } else {
        services.push(serviceId);
      }
      
      return { ...prev, services };
    });
  };
const handleWorkingHoursChange = (dayIndex, field, value) => {
  setFormData(prev => {
    const workingHours = [...prev.workingHours];
    workingHours[dayIndex] = {
      ...workingHours[dayIndex],
      [field]: value // Remove the string comparison, just use the value directly
    };
    return { ...prev, workingHours };
  });
};

  // const handleImageChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     setFormData(prev => ({
  //       ...prev,
  //       profileImage: file
  //     }));
  //   }
  // };




 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("email", formData.email);
    payload.append("phone", formData.phone);
    payload.append("bio", formData.bio);
    payload.append("bookingBuffer", formData.bookingBuffer);
    
    // Fix: Don't stringify if services are ObjectIds
    if (Array.isArray(formData.services)) {
      formData.services.forEach(service => {
        payload.append("services[]", service); // Send as array
      });
    }
    
    // Fix: Don't stringify if workingHours is complex object
    payload.append("workingHours", JSON.stringify(formData.workingHours));
    
    if (formData.profileImage) {
      payload.append("profileImage", formData.profileImage);
    }
    
    const result = await addProvider(payload);
    console.log("Provider created:", result);
  } catch (err) {
    console.error(err);
  }
};



  const dayNames = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Add New Provider</h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isSubmitting}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={isSubmitting}
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={isSubmitting}
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={isSubmitting}
              />
              {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Booking Buffer (minutes)
              </label>
              <input
                type="number"
                name="bookingBuffer"
                value={formData.bookingBuffer}
                onChange={handleChange}
                min="0"
                max="60"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isSubmitting}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isSubmitting}
            />
          </div>
{/*           
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Profile Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isSubmitting}
            />
          </div>
           */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Services
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto p-2 border border-gray-300 rounded-lg">
              {services.map(service => (
                <label key={service._id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.services.includes(service._id)}
                    onChange={() => handleServiceChange(service._id)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                    disabled={isSubmitting}
                  />
                  <span className="text-sm text-gray-700">{service.title}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <button
              type="button"
              onClick={() => setShowWorkingHours(!showWorkingHours)}
              className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 mb-2"
            >
              {showWorkingHours ? (
                <ChevronDown className="w-4 h-4 mr-1" />
              ) : (
                <ChevronRight className="w-4 h-4 mr-1" />
              )}
              Working Hours
            </button>
            
            {showWorkingHours && (
              <div className="space-y-3 p-3 border border-gray-200 rounded-lg">
                {dayNames.map((dayName, index) => {
                  const daySchedule = formData.workingHours[index] || 
                                    { dayOfWeek: index, isWorking: false, startTime: '09:00', endTime: '17:00' };
                  
                  return (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center space-x-3 w-28">
                        <input
                          type="checkbox"
                          checked={daySchedule.isWorking}
                          onChange={(e) => handleWorkingHoursChange(index, 'isWorking', e.target.checked)}
                          className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                          disabled={isSubmitting}
                        />
                        <span className="font-medium text-gray-700">{dayName}</span>
                      </div>
                      
                      {daySchedule.isWorking ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="time"
                            value={daySchedule.startTime}
                            onChange={(e) => handleWorkingHoursChange(index, 'startTime', e.target.value)}
                            className="px-2 py-1 border border-gray-300 rounded text-sm w-28"
                            disabled={isSubmitting}
                          />
                          <span className="text-gray-500">to</span>
                          <input
                            type="time"
                            value={daySchedule.endTime}
                            onChange={(e) => handleWorkingHoursChange(index, 'endTime', e.target.value)}
                            className="px-2 py-1 border border-gray-300 rounded text-sm w-28"
                            disabled={isSubmitting}
                          />
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">Closed</span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Adding...
                </>
              ) : (
                'Add Provider'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


  // Main render logic
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <MessageAlert />
      
      <div className="max-w-7xl mx-auto">
        {view === 'grid' && <GridView />}
        
        {view === 'detail' && selectedProvider && (
          <ProviderDetail provider={selectedProvider} />
        )}
        
        {view === 'schedule' && selectedProvider && (
          <ScheduleManagement provider={selectedProvider} />
        )}
        
        {view === 'edit-provider' && editingProvider && (
          <EditProvider 
            provider={editingProvider}
            onSave={updateProvider}
            onCancel={() => setView('grid')}
          />
        )}

          {showAddProviderModal && (
          <AddProviderModal 
            onClose={() => setShowAddProviderModal(false)} 
            onAdd={addProvider}
          />
        )}
      </div>
    </div>
  );
};

export default Provider;