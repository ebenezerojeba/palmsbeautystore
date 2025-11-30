import React, { useState, useContext, useEffect, useCallback, useMemo } from "react";
import {
  X,
  Check,
  Loader,
  Calendar,
  List,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  Phone,
  Mail,
  Search,
  AlertCircle,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { AdminContexts } from "../context/AdminContexts";
import { toast } from "react-toastify";
// import { backendUrl } from "../App";

const AllAppointments = () => {
  const {
    appointments,
    getAllAppointments,
    cancelAppointment,
    completeAppointment, 
    slotDateFormat,
    loadingStates,
    loadingId,
    
  } = useContext(AdminContexts);

  // State management
  const [hasInitialLoad, setHasInitialLoad] = useState(false);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [view, setView] = useState('list');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Add appointment modal state
const [showAddModal, setShowAddModal] = useState(false);
const [providers, setProviders] = useState([]);
const [services, setServices] = useState([]);
const [addingAppointment, setAddingAppointment] = useState(false);
const [newAppointment, setNewAppointment] = useState({
  userName: '',
  userEmail: '',
  userPhone: '',
  providerId: '',
  services: [],
  date: '',
  time: '',
  clientNotes: '',
  paymentStatus: 'pending',
  paymentAmount: ''
});

const backendUrl = import.meta.env.VITE_BACKEND_URL;
// Fetch providers and services for the add modal

// Then fix the useEffect:
useEffect(() => {
  const fetchProvidersAndServices = async () => {
    if (!showAddModal) return;
    
    try {
      
      
      // Fetch providers

      const providersRes = await fetch(`${backendUrl}/api/provider`);
      
      if (!providersRes.ok) {
        throw new Error(`Providers fetch failed: ${providersRes.status}`);
      }
      
      const providersData = await providersRes.json();
      
      if (providersData.success) {
        setProviders(providersData.providers || []);
        console.log(`✅ Loaded ${providersData.providers.length} providers`);
      } else {
        setProviders([]);
      }

      // Fetch services
      const servicesRes = await fetch(`${backendUrl}/api/services/only-services`);

      if (!servicesRes.ok) {
        throw new Error(`Services fetch failed: ${servicesRes.status}`);
      }
      
      const servicesData = await servicesRes.json();
    
      
     if (servicesData.success && servicesData.services) {
        setServices(servicesData.services);
        
      } else if (servicesData.services) {
        // Handle case where response doesn't have success flag
        setServices(servicesData.services);
       
      } else {
        setServices([]);
      }
      
    } catch (err) {
   
      alert('Failed to load providers and services: ' + err.message);
      
      // Set empty arrays so the UI doesn't break
      setProviders([]);
      setServices([]);
    }
  };

  fetchProvidersAndServices();
}, [showAddModal, backendUrl]);
  // Fixed useEffect with proper dependencies
  useEffect(() => {
    if (!hasInitialLoad && !loadingStates?.appointments && getAllAppointments) {
      setHasInitialLoad(true);
      getAllAppointments().catch(err => {
        console.error('Failed to load appointments:', err);
        setError('Failed to load appointments. Please refresh the page or try again.');
      });
    }
  }, [hasInitialLoad, loadingStates?.appointments, getAllAppointments]);

  // Color palette for providers
  const providerColors = [
    { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200', accent: 'bg-purple-500' },
    { bg: 'bg-pink-100', text: 'text-pink-800', border: 'border-pink-200', accent: 'bg-pink-500' },
    { bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-200', accent: 'bg-indigo-500' },
    { bg: 'bg-cyan-100', text: 'text-cyan-800', border: 'border-cyan-200', accent: 'bg-cyan-500' },
    { bg: 'bg-teal-100', text: 'text-teal-800', border: 'border-teal-200', accent: 'bg-teal-500' },
    { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-200', accent: 'bg-emerald-500' },
    { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-200', accent: 'bg-amber-500' },
    { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-200', accent: 'bg-orange-500' },
    { bg: 'bg-rose-100', text: 'text-rose-800', border: 'border-rose-200', accent: 'bg-rose-500' },
    { bg: 'bg-violet-100', text: 'text-violet-800', border: 'border-violet-200', accent: 'bg-violet-500' },
    { bg: 'bg-lime-100', text: 'text-lime-800', border: 'border-lime-200', accent: 'bg-lime-500' }
  ];

  // Fixed status logic - prioritize boolean flags for consistency
  const getAppointmentStatus = useCallback((appointment) => {
    if (appointment?.isCompleted) return 'completed';
    if (appointment?.isCancelled) return 'cancelled';
    
    if (appointment?.status) {
      const status = appointment.status.toLowerCase();
      if (['completed', 'cancelled', 'confirmed', 'no-show', 'pending'].includes(status)) {
        return status;
      }
    }
    
    return 'pending';
  }, []);

  // Consistent action logic for both views
  const canTakeActions = useCallback((appointment) => {
    const status = getAppointmentStatus(appointment);
    return !appointment.isCompleted && 
           !appointment.isCancelled && 
           status !== 'completed' && 
           status !== 'cancelled' &&
           status !== 'no-show' &&
           appointment._id &&
           loadingId !== appointment._id;
  }, [getAppointmentStatus, loadingId]);

  // Get unique providers for color assignment
  const uniqueProviders = useMemo(() => {
    if (!appointments) return [];
    const providers = [...new Set(appointments.map(apt => apt.providerName).filter(Boolean))];
    return providers;
  }, [appointments]);

  // Function to get consistent color for a provider
  const getProviderColor = useCallback((providerName) => {
    if (!providerName) return providerColors[0];
    const providerIndex = uniqueProviders.indexOf(providerName);
    const colorIndex = providerIndex >= 0 ? providerIndex % providerColors.length : 0;
    return providerColors[colorIndex];
  }, [uniqueProviders, providerColors]);

  // Function to get appointment styling based on status and provider
  const getAppointmentStyling = useCallback((appointment) => {
    const status = getAppointmentStatus(appointment);
    const providerColor = getProviderColor(appointment.providerName);
    
    // Override colors for certain statuses
    if (status === 'completed') {
      return {
        bg: 'bg-green-100',
        text: 'text-green-800',
        border: 'border-green-200',
        accent: 'bg-green-500'
      };
    }
    if (status === 'cancelled') {
      return {
        bg: 'bg-red-100',
        text: 'text-red-800',
        border: 'border-red-200',
        accent: 'bg-red-500'
      };
    }
    if (status === 'no-show') {
      return {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        border: 'border-gray-200',
        accent: 'bg-gray-500'
      };
    }
    
    return providerColor;
  }, [getAppointmentStatus, getProviderColor]);


const handleAddAppointment = async (e) => {
  e.preventDefault();
  setAddingAppointment(true);

  try {
    // Validate that at least one service is selected
    if (newAppointment.services.length === 0) {
      alert('Please select at least one service');
      setAddingAppointment(false);
      return;
    }

    // Prepare the appointment data
    const appointmentData = {
      services: newAppointment.services,
      date: newAppointment.date,
      time: newAppointment.time,
      providerId: newAppointment.providerId,
      userName: newAppointment.userName,
      userEmail: newAppointment.userEmail,
      userPhone: newAppointment.userPhone,
      clientNotes: newAppointment.clientNotes,
      paymentStatus: newAppointment.paymentStatus,
      paymentAmount: parseFloat(newAppointment.paymentAmount) || 0,
      consentForm: {
        healthConditions: '',
        allergies: '',
        consentToTreatment: true,
      }
    };

    console.log('Sending appointment data:', appointmentData);

    const res = await fetch(`${backendUrl}/api/admin/create-appointment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(appointmentData)
    });

    const data = await res.json();
    

    if (data.success) {
      // Close modal
      setShowAddModal(false);
      toast.success(data.message || 'Appointment created successfully');
      
      // Reset form
      setNewAppointment({
        userName: '',
        userEmail: '',
        userPhone: '',
        providerId: '',
        services: [],
        date: '',
        time: '',
        clientNotes: '',
        paymentStatus: 'pending',
        paymentAmount: ''
      });
      
 
      try {
        await getAllAppointments();
      } catch (refreshError) {
        console.error('Error refreshing appointments:', refreshError);
        alert('Appointment created but failed to refresh list. Please reload the page.');
      }
    } else {
      toast.error(data.message || 'Failed to create appointment');
    }
  } catch (error) {
    console.error('Error creating appointment:', error);
    alert('Failed to create appointment: ' + error.message);
  } finally {
    setAddingAppointment(false);
  }
};

const handleServiceSelect = (service) => {
  const isSelected = newAppointment.services.some(s => s.serviceId === service._id);
  
  if (isSelected) {
    setNewAppointment(prev => ({
      ...prev,
      services: prev.services.filter(s => s.serviceId !== service._id)
    }));
  } else {
    setNewAppointment(prev => ({
      ...prev,
      services: [...prev.services, {
        serviceId: service._id,
        serviceTitle: service.title,
        duration: service.duration || 90,
        price: service.price || 0
      }]
    }));
  }
};

  // Enhanced error handling with user feedback
const handleCancelAppointment = useCallback(async (appointmentId) => {
  try {
    if (!appointmentId) {
      toast.error("Invalid appointment ID");
      return;
    }

    setActionError(null);
    
    // Fix: Pass all three required parameters
    // cancelAppointment expects: (cancelledBy, appointmentId, reason)
    await cancelAppointment('admin', appointmentId, 'Cancelled by admin');
    
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    setActionError('Failed to cancel appointment. Please try again.');
    toast.error('Failed to cancel appointment. Please try again.');
  }
}, [cancelAppointment]);

  // Calendar functions
  const getDaysInMonth = useCallback((date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  }, []);

  const isSameDay = useCallback((d1, d2) => {
    if (!d1 || !d2) return false;
    const date1 = new Date(d1);
    const date2 = new Date(d2);
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }, []);

  const getAppointmentsForDate = useCallback((date) => {
    if (!date || !appointments) return [];
    return appointments.filter(apt => isSameDay(apt.date, date));
  }, [appointments, isSameDay]);

  const navigateMonth = useCallback((direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  }, []);

  // Memoized filtered appointments for performance
  const filteredAppointments = useMemo(() => {
    if (!appointments) return [];
    
    return appointments.filter(apt => {
      if (!apt) return false;
      
      const matchesSearch = (
        apt.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.serviceTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.userPhone?.toLowerCase().includes(searchTerm.toLowerCase())
      );

      const status = getAppointmentStatus(apt);
      const matchesStatus = statusFilter === 'all' ||
        (statusFilter === 'pending' && (status === 'pending' || status === 'confirmed')) ||
        (statusFilter === 'completed' && status === 'completed') ||
        (statusFilter === 'cancelled' && status === 'cancelled');

      return matchesSearch && matchesStatus;
    });
  }, [appointments, searchTerm, statusFilter, getAppointmentStatus]);
  
  // Error Alert Component
  const ErrorAlert = ({ error, onDismiss }) => {
    if (!error) return null;
    
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-4">
        <span className="block sm:inline">{error}</span>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="absolute top-0 bottom-0 right-0 px-4 py-3 hover:bg-red-100 rounded-r"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  };

  // Simplified Consent Form Display
  const ConsentFormDisplay = ({ consentForm }) => {
    if (!consentForm) return null;
    
    const hasHealthConditions = consentForm.healthConditions?.trim();
    const hasAllergies = consentForm.allergies?.trim();
    
    if (!hasHealthConditions && !hasAllergies) return null;
    
    return (
      <div className="mb-4">
        <div className="text-xs font-medium text-gray-500 mb-1">Consent Form</div>
        <div className="text-sm text-gray-700 bg-blue-50 p-2 rounded border-l-4 border-blue-200">
          {hasHealthConditions && (
            <div>Health Condition: {consentForm.healthConditions}</div>
          )}
          {hasAllergies && (
            <div>Allergies: {consentForm.allergies}</div>
          )}
        </div>
      </div>
    );
  };

  // StatusBadge component
  const StatusBadge = ({ appointment }) => {
    const status = getAppointmentStatus(appointment);
    
    const statusConfig = {
      completed: {
        className: "bg-green-100 text-green-800",
        // icon: <CheckCircle2 className="w-3 h-3" />,
        label: "Completed"
      },
      cancelled: {
        className: "bg-red-100 text-red-800",
        // icon: <XCircle className="w-3 h-3" />,
        label: "Cancelled"
      },
      confirmed: {
        className: "bg-blue-100 text-blue-800",
        // icon: <CheckCircle2 className="w-3 h-3" />,
        label: "Confirmed"
      },
      'no-show': {
        className: "bg-gray-100 text-gray-800",
        // icon: <XCircle className="w-3 h-3" />,
        label: "No Show"
      },
      pending: {
        className: "bg-amber-100 text-amber-800",
        // icon: <AlertCircle className="w-3 h-3" />,
        label: "Pending"
      }
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs ${config.className} rounded-full font-medium`}>
        {config.icon}
        {config.label}
      </span>
    );
  };

  const ActionButton = ({ color, icon, onClick, label, disabled, appointmentId, action }) => {
    const isProcessing = loadingId === appointmentId;
    
    return (
      <button
        onClick={onClick}
        disabled={disabled || isProcessing}
        className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium border ${color} rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 min-w-[80px] sm:min-w-[90px]`}
        aria-label={`${action} appointment`}
      >
        {isProcessing ? <Loader className="w-3 h-3 animate-spin" /> : icon}
        <span className="whitespace-nowrap">{isProcessing ? `${action}ing...` : label}</span>
      </button>
    );
  };

  const CalendarDay = ({ date, appointments: dayAppointments }) => {
    const isToday = date && date.toDateString() === new Date().toDateString();
    const isSelected = selectedDate && date && date.toDateString() === selectedDate.toDateString();

    return (
      <div
        className={`min-h-[100px] sm:min-h-[120px] p-1 sm:p-2 border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${
          isToday ? 'bg-blue-50 border-blue-200' : ''
        } ${isSelected ? 'bg-blue-100 border-blue-300' : ''}`}
        onClick={() => date && setSelectedDate(date)}
      >
        {date && (
          <>
            <div className={`text-xs sm:text-sm font-medium mb-2 ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
              {date.getDate()}
            </div>
            <div className="space-y-1">
              {dayAppointments.slice(0, 3).map((apt, idx) => {
                const styling = getAppointmentStyling(apt);
                return (
                  <div
                    key={apt._id || idx}
                    className={`text-xs p-2 rounded-md border ${styling.bg} ${styling.text} ${styling.border} transition-colors relative overflow-hidden`}
                    title={`${apt.time} - ${apt.userName} - ${apt.serviceTitle} (${apt.providerName})`}
                  >
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${styling.accent}`}></div>
                    
                    <div className="ml-1">
                      <div className="font-bold text-xs truncate mb-1">
                        {apt.userName}
                      </div>
                      <div className="font-medium text-xs truncate mb-1">
                        {apt.serviceTitle}
                      </div>
                      <div className="font-semibold text-xs truncate opacity-90">
                        {apt.providerName || 'No Provider'}
                      </div>
                      <div className="text-xs opacity-75 mt-1">
                        {apt.time}
                      </div>
                    </div>
                  </div>
                );
              })}
              {dayAppointments.length > 3 && (
                <div className="text-xs text-gray-500 font-medium pl-1">
                  +{dayAppointments.length - 3} more
                </div>
              )}
            </div>
          </>
        )}
      </div>
    );
  };

  const AppointmentCard = ({ appointment }) => {
    const canTakeAction = canTakeActions(appointment);

    // Format date for display
    const formatDate = (dateString) => {
      try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Invalid Date';
        return date.toLocaleDateString('en-US', {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      } catch (error) {
        return 'Invalid Date';
      }
    };

    // Format duration
    const formatDuration = (minutes) => {
      if (!minutes || isNaN(minutes)) return 'N/A';
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      if (hours > 0 && mins > 0) {
        return `${hours}h ${mins}m`;
      } else if (hours > 0) {
        return `${hours}h`;
      } else {
        return `${mins}m`;
      }
    };

    const serviceTitle = appointment.services && appointment.services.length > 0 
      ? appointment.services[0].serviceTitle 
      : appointment.serviceTitle || 'Service not specified';

    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200 max-w-sm mx-auto">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-gray-900 truncate">
              {appointment.userName || 'Unknown User'}
            </h3>
          </div>
          <div className="flex-shrink-0">
            <StatusBadge appointment={appointment} />
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{appointment.userPhone || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Mail className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{appointment.userEmail || 'N/A'}</span>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-3 mb-4 space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 flex-shrink-0 text-gray-500" />
            <span className="font-medium text-gray-900">{formatDate(appointment.date)}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 flex-shrink-0 text-gray-500" />
            <span className="text-gray-700">{appointment.time || 'N/A'}</span>
            <span className="text-gray-500">({formatDuration(appointment.totalDuration)})</span>
          </div>
          
          <div className="flex items-start gap-2 text-sm">
            <User className="w-4 h-4 flex-shrink-0 text-gray-500 mt-0.5" />
            <div>
              <div className="font-medium text-gray-900">{serviceTitle}</div>
              <div className="text-gray-600 mt-1">
                <span className="text-xs">Stylist: </span>
                <span className="font-medium">{appointment.providerName || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

        {appointment.clientNotes && appointment.clientNotes.trim() && (
          <div className="mb-4">
            <div className="text-xs font-medium text-gray-500 mb-1">Notes:</div>
            <div className="text-sm text-gray-700 bg-blue-50 p-2 rounded border-l-4 border-blue-200">
              {appointment.clientNotes}
            </div>
          </div>
        )}

        <ConsentFormDisplay consentForm={appointment.consentForm} />

        {canTakeAction && (
          <div className="flex flex-col sm:flex-row gap-2 pt-3 border-t border-gray-100">
            <ActionButton
              color="border-red-300 text-red-600 hover:border-red-400 focus:ring-red-500"
              icon={<X className="w-3 h-3" />}
              onClick={() => handleCancelAppointment(appointment._id)}
              label="Cancel"
              appointmentId={appointment._id}
              action="Cancel"
              disabled={!appointment._id}
            />
            <ActionButton
              color="border-green-300 text-green-600 hover:border-green-400 focus:ring-green-500"
              icon={<Check className="w-3 h-3" />}
              onClick={() => handleCompleteAppointment(appointment._id)}
              label="Complete"
              appointmentId={appointment._id}
              action="Complete"
              disabled={!appointment._id}
            />
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="text-xs text-gray-500">
            {appointment.bookedAt ? (
              <>
                Booked on {new Date(appointment.bookedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </>
            ) : (
              'Booking date not available'
            )}
          </div>
        </div>
      </div>
    );
  };

  // Loading state
  if (loadingStates?.appointments) {
    return (
      <div className="w-full p-4 md:p-6">
        <div className="w-full max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-64"></div>
            <div className="h-16 bg-gray-200 rounded w-full"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full p-4 md:p-6">
        <div className="w-full max-w-7xl mx-auto text-center py-12">
          <AlertCircle className="mx-auto h-12 w-12 text-red-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to load appointments</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={() => {
              setError(null);
              setHasInitialLoad(false);
            }}
            className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (!appointments || appointments.length === 0) {
    return (
      <div className="w-full p-4 md:p-6">
        <div className="w-full max-w-7xl mx-auto text-center py-12">
          <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
          <p className="text-gray-500">No appointments have been scheduled yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="w-full max-w-7xl mx-auto">
        {/* Error Display */}
        <ErrorAlert 
          error={actionError} 
          onDismiss={() => setActionError(null)} 
        />

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Appointment Management
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({filteredAppointments.length} appointments)
                </span>
              </h1>

<div className="w-full flex flex-1 sm:flex-row sm:items-center sm:justify-between gap-3">

  <button
    onClick={() => setShowAddModal(true)}
    className="px-4 py-2 bg-pink-700 text-white rounded-lg hover:bg-pink-700 transition-colors text-sm font-medium w-fit"
  >
    + Create Appointment
  </button>

  <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 w-fit">
    <button
      onClick={() => setView('calendar')}
      className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${view === 'calendar' ? 'bg-white text-pink-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
    >
      <Calendar className="w-4 h-4" />
      <span className="hidden sm:inline">Calendar</span>
    </button>

    <button
      onClick={() => setView('list')}
      className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${view === 'list' ? 'bg-white text-pink-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
    >
      <List className="w-4 h-4" />
      <span className="hidden sm:inline">List</span>
    </button>
  </div>

</div>

            </div>



        
          </div>
        </div>

        {/* Calendar View */}
        {view === 'calendar' && (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 sm:gap-6">
            <div className="xl:col-span-3">
              <div className="bg-white rounded-lg shadow-sm">
                <div className="flex items-center justify-between p-4 sm:p-6 border-b">
                  <h2 className="text-lg sm:text-xl font-semibold">
                    {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </h2>
                  <div className="flex gap-1">
                    <button
                      onClick={() => navigateMonth(-1)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      aria-label="Previous month"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => navigateMonth(1)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      aria-label="Next month"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="p-4 sm:p-6">
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                      <div key={day} className="p-1 sm:p-2 text-center text-xs sm:text-sm font-medium text-gray-500">
                        <span className="sm:hidden">{day[0]}</span>
                        <span className="hidden sm:inline">{day}</span>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1">
                    {getDaysInMonth(currentDate).map((date, index) => (
                      <CalendarDay
                        key={index}
                        date={date}
                        appointments={date ? getAppointmentsForDate(date) : []}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="xl:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                <h3 className="text-lg font-semibold mb-4">
                  {selectedDate ?
                    `${selectedDate.toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'short',
                      day: 'numeric'
                    })}` :
                    'Select a date'
                  }
                </h3>

                {selectedDate && (
                  <div className="space-y-4">
                    {getAppointmentsForDate(selectedDate).length === 0 ? (
                      <p className="text-gray-500 text-center py-8 text-sm">No appointments scheduled</p>
                    ) : (
                      getAppointmentsForDate(selectedDate).map((apt) => (
                        <AppointmentCard key={apt._id} appointment={apt} />
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* List View */}
        {view === 'list' && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="block sm:hidden">
              {filteredAppointments.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
                  <p className="text-gray-500 text-sm">Try adjusting your search or filter criteria.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredAppointments.map((appointment) => (
                    <div key={appointment._id} className="p-4">
                      <AppointmentCard appointment={appointment} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Service
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Provider
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
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
                  {filteredAppointments.map((appointment) => {
                    const canTakeAction = canTakeActions(appointment);

                    return (
                      <tr key={appointment._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {appointment.userName || 'Unknown User'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {appointment.userEmail || 'N/A'}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {appointment.serviceTitle || 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {appointment.providerName || 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div>{slotDateFormat ? slotDateFormat(appointment.date) : new Date(appointment.date).toLocaleDateString()}</div>
                          <div className="text-gray-500">{appointment.time || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {appointment.userPhone || 'N/A'}
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge appointment={appointment} />
                        </td>
                        <td className="px-6 py-4">
                          {canTakeAction && (
                            <div className="flex flex-wrap gap-2">
                              <ActionButton
                                color="border-red-400 text-red-600 hover:border-red-500 focus:ring-red-500"
                                icon={<X className="w-3 h-3" />}
                                onClick={() => handleCancelAppointment(appointment._id)}
                                label="Cancel"
                                appointmentId={appointment._id}
                                action="Cancel"
                                disabled={!appointment._id}
                              />
                              <ActionButton
                                color="border-green-500 text-green-600 hover:border-green-600 focus:ring-green-500"
                                icon={<Check className="w-3 h-3" />}
                                onClick={() => handleCompleteAppointment(appointment._id)}
                                label="Complete"
                                appointmentId={appointment._id}
                                action="Complete"
                                disabled={!appointment._id}
                              />
                            </div>
                          )}
                          {!canTakeAction && (
                            <span className="text-xs text-gray-400">No actions available</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {filteredAppointments.length === 0 && (
                <div className="text-center py-12">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
                  <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {/* Add Appointment Modal */}
{showAddModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Add New Appointment</h3>
          <button
            onClick={() => setShowAddModal(false)}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <form onSubmit={handleAddAppointment} className="p-6 space-y-4">
        {/* Customer Information */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Customer Information</h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                required
                value={newAppointment.userName}
                onChange={(e) => setNewAppointment(prev => ({ ...prev, userName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500"
                placeholder="Customer name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                required
                value={newAppointment.userEmail}
                onChange={(e) => setNewAppointment(prev => ({ ...prev, userEmail: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500"
                placeholder="customer@email.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={newAppointment.userPhone}
                onChange={(e) => setNewAppointment(prev => ({ ...prev, userPhone: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500"
                placeholder="123-456-7890"
              />
            </div>
          </div>
        </div>

        {/* Provider Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Provider/Stylist *
          </label>
          <select
            required
            value={newAppointment.providerId}
            onChange={(e) => setNewAppointment(prev => ({ ...prev, providerId: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500"
          >
            <option value="">Select a provider</option>
            {providers.map(provider => (
              <option key={provider._id} value={provider._id}>
                {provider.name}
              </option>
            ))}
          </select>
        </div>

        {/* Services Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Services * (Select one or more)
          </label>
          <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-md p-2 space-y-2">
            {services.map(service => {
              const isSelected = newAppointment.services.some(s => s.serviceId === service._id);
              return (
                <div
                  key={service._id}
                  onClick={() => handleServiceSelect(service)}
                  className={`p-3 rounded-md cursor-pointer transition-colors ${
                    isSelected 
                      ? 'bg-pink-100 border-2 border-pink-500' 
                      : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{service.title}</span>
                    <span className="text-sm text-gray-600">${service.price}</span>
                  </div>
                  <div className="text-xs text-gray-500">{service.duration} mins</div>
                </div>
              );
            })}
          </div>
          {newAppointment.services.length > 0 && (
            <div className="mt-2 text-sm text-gray-600">
              Selected: {newAppointment.services.length} service(s) - 
              Total: ${newAppointment.services.reduce((sum, s) => sum + s.price, 0)}
            </div>
          )}
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date *
            </label>
            <input
              type="date"
              required
              value={newAppointment.date}
              onChange={(e) => setNewAppointment(prev => ({ ...prev, date: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Time *
            </label>
            <input
              type="time"
              required
              value={newAppointment.time}
              onChange={(e) => setNewAppointment(prev => ({ ...prev, time: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500"
            />
          </div>
        </div>

        {/* Payment Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Status
            </label>
            <select
              value={newAppointment.paymentStatus}
              onChange={(e) => setNewAppointment(prev => ({ ...prev, paymentStatus: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500"
            >
              <option value="pending">Pending</option>
              <option value="paid">Paid (Cash/Other)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount Paid
            </label>
            <input
              type="number"
              value={newAppointment.paymentAmount}
              onChange={(e) => setNewAppointment(prev => ({ ...prev, paymentAmount: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500"
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            value={newAppointment.clientNotes}
            onChange={(e) => setNewAppointment(prev => ({ ...prev, clientNotes: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500"
            rows="3"
            placeholder="Any special notes..."
          />
        </div>

        {/* Submit Button */}
        <div className="flex gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={() => setShowAddModal(false)}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={addingAppointment || newAppointment.services.length === 0}
            className="flex-1 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {addingAppointment ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Appointment'
            )}
          </button>
        </div>
      </form>
    </div>
  </div>
)}
    </div>
  );
};

export default AllAppointments;
