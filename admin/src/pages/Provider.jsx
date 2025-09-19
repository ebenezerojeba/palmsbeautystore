import React, { useState, useEffect, useMemo } from 'react';
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
  Clock4,
  Check,
  ChevronUp
} from 'lucide-react';
import { toast } from 'react-toastify'
import ScheduleManagement from '../components/Provider/ScheduleManagement';
import EditProvider from '../components/Provider/EditProvider';

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


  const [providerAppointments, setProviderAppointments] = useState([]);
  const [todaysAppointments, setTodaysAppointments] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [appointmentStats, setAppointmentStats] = useState(null);
  const [appointmentsLoading, setAppointmentsLoading] = useState(false);
  // Add this state to track initial load
const [initialLoadComplete, setInitialLoadComplete] = useState(false);
// Add this near your other state declarations:
const selectedProviderId = useMemo(() => selectedProvider?._id, [selectedProvider?._id]);

// Then use this in your useEffect:
useEffect(() => {
  if (selectedProviderId && view === 'appointments' && !appointmentsLoading) {
    loadProviderAppointments(selectedProviderId);
  }
}, [selectedProviderId, view]); // Much more stable dependencies

  // const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // const backendUrl = "https://palmsbeautystore-backend.onrender.com"
  const backendUrl = "http://localhost:3000"

  useEffect(() => {
    loadProviders();
    loadServices();
    loadServicesWithProviders();
  }, []);

  useEffect(() => {
  let isMounted = true;
  const abortController = new AbortController();


  const loadData = async () => {
    if (selectedProvider && view === 'appointments') {
      try {
        await loadProviderAppointments(selectedProvider._id);
      } catch (error) {
        if (isMounted) {
          console.error('Failed to load appointments:', error);
        }
      }
    }
  };

  loadData();

  return () => {
    isMounted = false;
    abortController.abort();
  };
}, [selectedProvider, view]);

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
        toast.success('Working hours updated successfully!');
        await loadProviders();
        setView('grid')

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

    Object.keys(data).forEach((key) => {
      if (key === "profileImagePreview") return; // don't send preview
      if (key === "profileImage" && data[key] instanceof File) {
        formData.append("profileImage", data[key]); // file
      } else {
        formData.append(key, data[key]);
      }
    });

    const response = await fetch(`${backendUrl}/api/admin/${providerId}`, {
      method: "PUT",
      body: formData,
    });

    // Parse the response JSON
    const result = await response.json();

    if (result.success) {
      toast.success(result.message || "Provider updated successfully");
      loadProviders(); // Refresh the providers list
      setView('grid'); // Go back to grid view
      return result;
    } else {
      toast.error(result.message || "Failed to update provider");
      return null;
    }
  } catch (error) {
    console.error('Error updating provider:', error);
    toast.error("An error occurred while updating the provider");
    return null;
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


  // Fetch all appointments for a provider
const fetchProviderAppointments = async (providerId) => {
  try {
    const response = await fetch(`${backendUrl}/api/provider/${providerId}/appointments`);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching provider appointments:', error);
    throw error;
  }
};

// Fetch today's appointments - FIXED ENDPOINT
const fetchTodaysAppointments = async (providerId) => {
  try {
    const response = await fetch(
      `${backendUrl}/api/provider/${providerId}/todays-appointments`
    );
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching today's appointments:", error);
    throw error;
  }
};

// Fetch upcoming appointments - FIXED ENDPOINT
const fetchUpcomingAppointments = async (providerId) => {
  try {
    const response = await fetch(
      `${backendUrl}/api/provider/${providerId}/upcoming-appointments`
    );
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching upcoming appointments:', error);
    throw error;
  }
};

// Fetch appointment statistics
const fetchAppointmentStats = async (providerId) => {
  try {
    const response = await fetch(
      `${backendUrl}/api/provider/${providerId}/appointment-stats`
    );
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching appointment stats:', error);
    throw error;
  }
};


const loadProviderAppointment = async (providerId) => {
  console.log('Loading appointments for provider:', providerId);
  
  setAppointmentsLoading(true);
  try {
    const endpoints = [
      `${backendUrl}/api/provider/${providerId}/appointments`,
      `${backendUrl}/api/provider/${providerId}/todays-appointments`,
      `${backendUrl}/api/provider/${providerId}/upcoming-appointments`,
      `${backendUrl}/api/provider/${providerId}/appointment-stats`
    ];
    
    console.log('API endpoints:', endpoints);
    
    const responses = await Promise.all(endpoints.map(url => fetch(url)));
    console.log('Response statuses:', responses.map(r => r.status));
    
    const data = await Promise.all(responses.map(r => r.json()));
    console.log('Response data:', data);
    
    // ... rest of your function
    
  } catch (error) {
    console.error('Detailed error:', error);
  }
};


const loadProviderAppointments = async (providerId) => {
  if (!providerId) return;
  if (appointmentsLoading) {
    console.log('Appointments already loading, skipping...');
    return;
  }
  
  console.log('Loading appointments for:', providerId);
  
  setAppointmentsLoading(true);
  try {
    // Use Promise.allSettled instead of Promise.all to handle failures gracefully
    const results = await Promise.allSettled([
      fetchProviderAppointments(providerId),
      fetchTodaysAppointments(providerId),
      fetchUpcomingAppointments(providerId),
      fetchAppointmentStats(providerId)
    ]);

    // Process each result individually
    const [allAppointments, todayAppointments, upcomingAppointments, stats] = results;

    setProviderAppointments(
      allAppointments.status === 'fulfilled' 
        ? allAppointments.value.appointments || [] 
        : []
    );
    
    setTodaysAppointments(
      todayAppointments.status === 'fulfilled' 
        ? todayAppointments.value.appointments || [] 
        : []
    );
    
    setUpcomingAppointments(
      upcomingAppointments.status === 'fulfilled' 
        ? upcomingAppointments.value.appointments || [] 
        : []
    );
    
    setAppointmentStats(
      stats.status === 'fulfilled' 
        ? stats.value.stats || null 
        : null
    );
    
    setInitialLoadComplete(true);
    
  } catch (error) {
    console.error('Unexpected error in loadProviderAppointments:', error);
  } finally {
    setAppointmentsLoading(false);
  }
};
  const MessageAlert = () => {
    if (!error && !success) return null;

    return (
      <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${success ? 'bg-green-100 text-green-800 border border-green-200' :
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



  const AppointmentStatsCards = ({ stats, loading }) => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (!stats) return null;

    const statCards = [
      {
        title: 'Total Appointments',
        value: stats.total || 0,
        icon: Calendar,
        color: 'text-gray-600',
        bgColor: 'bg-gray-50'
      },
      {
        title: 'Today\'s Appointments',
        value: stats.today || 0,
        icon: Clock,
        color: 'text-green-600',
        bgColor: 'bg-green-50'
      },
      {
        title: 'Upcoming',
        value: stats.upcoming || 0,
        icon: Clock4,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50'
      },
      {
        title: 'Completed',
        value: stats.completed || 0,
        icon: CheckCircle,
        color: 'text-purple-600',
        bgColor: 'bg-purple-50'
      }
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };




const AppointmentsSection = React.memo(({
  appointments,
  title,
  emptyMessage = "No appointments found",
  loading = false
}) => {
  // Memoize the appointments to prevent unnecessary re-renders
  const memoizedAppointments = React.useMemo(() => appointments, [appointments]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse">
              <div className="h-16 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <span className="text-sm text-gray-500">({appointments.length})</span>
        </div>

        {appointments.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">{emptyMessage}</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {appointments.map((appointment) => (
              <div key={appointment._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <User className="w-8 h-8 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {appointment.client?.name || appointment.clientName || 'Unknown Client'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {appointment.service?.title || appointment.serviceName || 'Unknown Service'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(appointment.date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    {appointment.startTime} - {appointment.endTime}
                  </p>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                    }`}>
                    {appointment.status || 'pending'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  });



  const ProviderCard = ({ provider }) => {
    if (!provider) return null;

    const rating = provider.rating || { average: 0, count: 0 };
    const imageUrl = provider.profileImage
      ? `${backendUrl}/${provider.profileImage.replace(/\\/g, "/")}`
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(provider.name || "Unknown")}&size=64&background=3b89f6&color=ffffff`;


    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
        <div className="p-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <img
                src={imageUrl}
                alt={provider.name || "Unknown Provider"}
                className="w-16 h-16 rounded-full object-cover"
              />

              {/* <img
                src={
                  provider.profileImage ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    provider.name || 'Unknown'
                  )}&size=64&background=3b89f6&color=ffffff`
                }
                alt={provider.name || 'Unknown Provider'}
                className="w-16 h-16 rounded-full object-cover"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    provider.name || 'Unknown'
                  )}&size=64&background=3b82f6&color=ffffff`;
                }}
              /> */}
              <div className="flex items-center justify-center mt-2">
                {provider.isActive ? (
                  <span className="flex items-center text-green-600 text-xs">
                    <Check size={12} className="mr-1" />
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
                {/* <div className="flex items-center space-x-1 flex-wrap max-w-[140px] sm:max-w-none">
  <Star className="w-4 h-4 text-yellow-400 flex-shrink-0" />
  <span className="text-sm font-medium text-gray-700 break-words">
    {rating.average > 0 ? (
      `${rating.average.toFixed(1)} (${rating.count} reviews)`
    ) : (
      "No rating provided yet"
    )}
  </span>
</div> */}


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
                            className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-md"
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

          <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setSelectedProvider(provider);
                  setView("detail");
                }}
                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {/* <Eye className="w-4 h-4 mr-1" /> */}
                View
              </button>
              <button
                onClick={() => {
                  setSelectedProvider(provider);
                  loadProviderAppointments(provider._id);
                  setView("appointments");
                }}
                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {/* <Calendar className="w-4 h-4 mr-1" /> */}
                Appointments
              </button>
              <button
                onClick={() => {
                  setSelectedProvider(provider);
                  loadProviderSchedule(provider._id);
                  setView("schedule");
                }}
                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {/* <Calendar className="w-4 h-4 mr-1" /> */}
                Schedule
              </button>

            </div>

            <div className="flex justify-end">
              <button
                onClick={() => {
                  setEditingProvider(provider);
                  setView("edit-provider");
                }}
                className="p-2 text-gray-600 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
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
      // Replace with a safer version if needed
  // useEffect(() => {
  //   if (provider?.services) {
  //     // Only log once on mount, not on every render
  //     console.log('Provider services loaded:', provider.services.length);
  //   }
  // }, []);
    // useEffect(() => {
    //   if (selectedProvider && selectedProvider.services) {
    //     console.log('Provider services structure:', selectedProvider.services);
    //     selectedProvider.services.forEach((service, index) => {
    //       console.log(`Service ${index}:`, service);
    //     });
    //   }
    // }, [selectedProvider]);
    // if (!provider) return null;

    const [expanded, setExpanded] = useState(false);
    const [showAllServices, setShowAllServices] = useState(false);
    const [showAllAvailable, setShowAllAvailable] = useState(false);
    const [showHours, setShowHours] = useState(false);
    const maxVisibleAvailable = 3;


    const maxVisibleServices = 3;
    const maxLength = 120; // characters before truncation

    const toggleExpanded = () => setExpanded(!expanded);

    const displayText =
      provider.bio && provider.bio.length > maxLength && !expanded
        ? provider.bio.slice(0, maxLength) + "..."
        : provider.bio;

    const rating = provider.rating || { average: 0, count: 0 };
    const imageUrl = provider.profileImage
      ? `${backendUrl}/${provider.profileImage.replace(/\\/g, "/")}`
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(provider.name || "Unknown")}&size=64&background=3b89f6&color=ffffff`;



    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setView('grid')}
              className="text-gray-600 hover:text-gray-700 font-medium"
            >
              ← Back
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

        <div className="sm:p-6 p-4">
          <div className="flex flex-col sm:flex-row items-start sm:space-x-6 space-y-4 sm:space-y-0">

            <div className="flex-shrink-0">
              <img
                src={imageUrl}
                alt={provider.name || "Unknown Provider"}
                className="w-16 h-16 rounded-full object-cover"
              />
              {/* <img
              src={
                provider.profileImage ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  provider.name || 'Unknown'
                )}&size=128&background=3b82f6&color=ffffff`
              }
              alt={provider.name || 'Unknown Provider'}
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover"

              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  provider.name || 'Unknown'
                )}&size=128&background=3b82f6&color=ffffff`;
              }}
            /> */}
            </div>

            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 mb-4">
                {/* Provider name */}
                <h1 className="text-base sm:text-xl md:text-2xl font-bold text-gray-900">
                  {provider.name || "Unknown Provider"}
                </h1>

                {/* Rating always visible */}
                <div className="flex items-center mt-1 sm:mt-0">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current" />
                  <span className="ml-1 text-sm sm:text-base font-medium text-gray-700">
                    {rating.average > 0
                      ? `${rating.average.toFixed(1)} (${rating.count} reviews)`
                      : "0.0 (0 reviews)"}
                  </span>
                </div>

                {/* Status badge */}
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1 sm:mt-0 ${provider.isActive
                    ? "bg-green-00 text-green-800"
                    : "bg-red-00 text-red-800"
                    }`}
                >
                  {provider.isActive ? (
                    <>
                      <CheckCircle size={12} className="mr-1" />
                      Active
                    </>
                  ) : (
                    <>
                      <XCircle size={12} className="mr-1" />
                      Inactive
                    </>
                  )}
                </span>
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
                <p className="text-gray-600">
                  {displayText || "No bio available"}
                  {provider.bio && provider.bio.length > maxLength && (
                    <button
                      onClick={toggleExpanded}
                      className="ml-2 text-green-700 text-sm font-medium hover:underline"
                    >
                      {expanded ? "See less" : "See more"}
                    </button>
                  )}
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Assigned Services</h3>
                <button
                  onClick={() => setShowAddServiceModal(true)}
                  className="text-gray-600 hover:text-gray-700 text-sm font-medium"
                >
                  + Add Service
                </button>
              </div>
              <div className="space-y-1">
                {provider.services && provider.services.length > 0 ? (
                  <>
                    {(showAllServices
                      ? provider.services
                      : provider.services.slice(0, maxVisibleServices)
                    ).map((service) => {
                      const serviceId = service._id || service.serviceId;
                      const serviceTitle = service.title || service.name || 'Unnamed Service';

                      return (
                        <div
                          key={serviceId}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div>
                            <h4 className="font-medium text-gray-900">{serviceTitle}</h4>
                            <h6 className="text-sm text-gray-600">ID: {serviceId}</h6>
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
                    })}

                    {provider.services && provider.services.length > maxVisibleServices && (
                      <div className="flex justify-end mt-2">
                        <button
                          onClick={() => setShowAllServices(!showAllServices)}
                          className="text-green-600 text-sm font-medium hover:underline"
                        >
                          {showAllServices ? "See less" : "See all services"}
                        </button>
                      </div>
                    )}

                  </>
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
                  return !provider.services?.some(ps => {
                    const assignedServiceId = ps._id || ps.serviceId;
                    return assignedServiceId === serviceId;
                  });
                }).length > 0 ? (
                  <>
                    {services
                      .filter(service => {
                        const serviceId = service._id;
                        return !provider.services?.some(ps => {
                          const assignedServiceId = ps._id || ps.serviceId;
                          return assignedServiceId === serviceId;
                        });
                      })
                      .slice(0, showAllAvailable ? undefined : maxVisibleAvailable) // <= only show 3 unless expanded
                      .map((service) => (
                        <div
                          key={service._id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
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
                      ))}

                    {services.filter(service => {
                      const serviceId = service._id;
                      return !provider.services?.some(ps => {
                        const assignedServiceId = ps._id || ps.serviceId;
                        return assignedServiceId === serviceId;
                      });
                    }).length > maxVisibleAvailable && (
                        <div className='flex justify-end mt-2'>
                          <button
                            onClick={() => setShowAllAvailable(!showAllAvailable)}
                            className=" text-green-600 text-sm font-medium hover:underline mt-2"
                          >
                            {showAllAvailable ? "See less" : `See all available services`}
                          </button>
                        </div>
                      )}
                  </>
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
                {/* Header with toggle */}
                <button
                  onClick={() => setShowHours(!showHours)}
                  className="flex items-center text-lg font-semibold text-gray-900 focus:outline-none"
                >
                  Working Hours
                  {showHours ? (
                    <ChevronUp className="w-5 h-5 ml-2 text-gray-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 ml-2 text-gray-600" />
                  )}
                </button>

                <button
                  onClick={() => {
                    loadProviderSchedule(provider._id);
                    setView("schedule");
                  }}
                  className="text-gray-600 hover:text-gray-700 text-sm font-medium"
                >
                  Edit Schedule
                </button>
              </div>

              {/* Collapsible section */}
              {showHours && (
                <div className="space-y-2">
                  {[
                    "Sunday",
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
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
                            : "Closed"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Appointment Overview</h3>
            <button
              onClick={() => loadProviderAppointments(provider._id)}
              disabled={appointmentsLoading}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              {appointmentsLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                  Loading...
                </>
              ) : (
                'Refresh Data'
              )}
            </button>
          </div>

          <AppointmentStatsCards
            stats={appointmentStats}
            loading={appointmentsLoading}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AppointmentsSection
              appointments={todaysAppointments}
              title="Today's Appointments"
              emptyMessage="No appointments scheduled for today"
              loading={appointmentsLoading}
            />

            <AppointmentsSection
              appointments={upcomingAppointments}
              title="Upcoming Appointments"
              emptyMessage="No upcoming appointments"
              loading={appointmentsLoading}
            />
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
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
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-lg hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
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

  const AppointmentsView = ({ provider }) => {
    useEffect(() => {
      if (provider) {
        loadProviderAppointments(provider._id);
      }
    }, [provider]);

    if (!provider) return null;

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            {/* Back button */}
            <button
              onClick={() => setView("detail")}
              className="text-gray-600 hover:text-gray-700 font-medium text-sm sm:text-base"
            >
              ← Back to Provider Details
            </button>

            {/* Title */}
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 text-center sm:text-left">
              Appointments for {provider.name}
            </h2>

            {/* Spacer for alignment on larger screens */}
            <div className="hidden sm:block w-24"></div>
          </div>
        </div>


        <div className="p-6">
          <AppointmentStatsCards
            stats={appointmentStats}
            loading={appointmentsLoading}
          />

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <AppointmentsSection
              appointments={todaysAppointments}
              title="Today's Appointments"
              emptyMessage="No appointments today"
              loading={appointmentsLoading}
            />

            <AppointmentsSection
              appointments={upcomingAppointments}
              title="Upcoming Appointments"
              emptyMessage="No upcoming appointments"
              loading={appointmentsLoading}
            />

            <AppointmentsSection
              appointments={providerAppointments.slice(0, 10)} // Show recent 10
              title="Recent Appointments"
              emptyMessage="No appointment history"
              loading={appointmentsLoading}
            />
          </div>

          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">All Appointments</h3>
              <button
                onClick={() => loadProviderAppointments(provider._id)}
                disabled={appointmentsLoading}
                className="text-gray-600 hover:text-gray-700 text-sm font-medium"
              >
                Refresh
              </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              {appointmentsLoading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading appointments...</p>
                </div>
              ) : providerAppointments.length === 0 ? (
                <div className="p-8 text-center">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No appointments found for this provider</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {providerAppointments.map((appointment) => (
                        <tr key={appointment._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <User className="w-8 h-8 text-gray-400 mr-3" />
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {appointment.client?.name || appointment.clientName || 'Unknown'}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {appointment.client?.email || appointment.clientEmail || ''}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {appointment.service?.title || appointment.serviceName || 'Unknown Service'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(appointment.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {appointment.startTime} - {appointment.endTime}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                              appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                  appointment.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                                    'bg-gray-100 text-gray-800'
                              }`}>
                              {appointment.status || 'pending'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };


  const GridView = () => {
    return (
      <div className="w-full overflow-x-hidden">
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Service Providers</h1>

            <button
              onClick={() => setShowAddProviderModal(true)}
              className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors w-full sm:w-auto justify-center"
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Add Provider
            </button>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search providers by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              />
            </div>

            <div className="relative w-full sm:w-64">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={serviceFilter}
                onChange={(e) => setServiceFilter(e.target.value)}
                className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-black bg-white"
              >
                <option value="">All Services</option>
                {services.map(service => (
                  <option key={service._id} value={service._id}>
                    {service.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {filteredProviders.map(provider => (
        <ProviderCard
          key={provider._id} 
          provider={provider}
          onViewDetails={(provider) => {
            setSelectedProvider(provider);
            setView("detail");
          }}
          onViewAppointments={(provider) => {
            setSelectedProvider(provider);
            loadProviderAppointments(provider._id);
            setView("appointments");
          }}
          onViewSchedule={(provider) => {
            setSelectedProvider(provider);
            loadProviderSchedule(provider._id);
            setView("schedule");
          }}
          onEdit={(provider) => {
            setEditingProvider(provider);
            setView("edit-provider");
          }}
        />
      ))}
          </div>
        )}
      </div>
    );
  };

  // Replace the main container at the end of your component
  // Main render logic
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <MessageAlert />

      <div className="max-w-7xl mx-auto w-full overflow-hidden">
        {view === 'grid' && <GridView />}

      
      {view === 'detail' && selectedProvider && (
  <ProviderDetail
    provider={selectedProvider}
    services={services}
    onBack={() => setView('grid')}
    onAddService={addServiceToProvider}
    onRemoveService={removeServiceFromProvider}
    onViewSchedule={(provider) => {
      loadProviderSchedule(provider._id);
      setView("schedule");
    }}
    appointmentStats={appointmentStats}
    todaysAppointments={todaysAppointments}
    upcomingAppointments={upcomingAppointments}
    appointmentsLoading={appointmentsLoading}
    onLoadAppointments={loadProviderAppointments}
  />
)}



      

        {view === 'schedule' && selectedProvider && (
          <ScheduleManagement
            provider={selectedProvider}
            onUpdateWorkingHours={updateProviderWorkingHours}
            onBack={() => setView("detail")}
          />
        )}
        {view === 'appointments' && selectedProvider && (
          <AppointmentsView provider={selectedProvider} />
        )}

        {view === 'edit-provider' && editingProvider && (
          <EditProvider
            provider={editingProvider}
            onSave={updateProvider}
            onCancel={() => setView('grid')}
            backendUrl={backendUrl}
          />
        )}

        {showAddProviderModal && (
          <AddProviderModal
            onClose={() => setShowAddProviderModal(false)}
            onAdd={addProvider}
            services={services}
            backendUrl={backendUrl}
          />
        )}

      </div>
    </div>
  );
};

export default Provider;