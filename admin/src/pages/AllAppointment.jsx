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

const AllAppointments = () => {
  const {
    appointments,
    getAllAppointments,
    cancelAppointment,
    completeAppointment, 
    slotDateFormat,
    loadingStates,
    loadingId 
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

  // Enhanced error handling with user feedback
  const handleCancelAppointment = useCallback(async (appointmentId) => {
    try {
      setActionError(null);
      await cancelAppointment(appointmentId);
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      setActionError('Failed to cancel appointment. Please try again.');
    }
  }, [cancelAppointment]);

  const handleCompleteAppointment = useCallback(async (appointmentId) => {
    try {
      setActionError(null);
      await completeAppointment(appointmentId);
    } catch (error) {
      console.error('Error completing appointment:', error);
      setActionError('Failed to complete appointment. Please try again.');
    }
  }, [completeAppointment]);

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
        icon: <CheckCircle2 className="w-3 h-3" />,
        label: "Completed"
      },
      cancelled: {
        className: "bg-red-100 text-red-800",
        icon: <XCircle className="w-3 h-3" />,
        label: "Cancelled"
      },
      confirmed: {
        className: "bg-blue-100 text-blue-800",
        icon: <CheckCircle2 className="w-3 h-3" />,
        label: "Confirmed"
      },
      'no-show': {
        className: "bg-gray-100 text-gray-800",
        icon: <XCircle className="w-3 h-3" />,
        label: "No Show"
      },
      pending: {
        className: "bg-amber-100 text-amber-800",
        icon: <AlertCircle className="w-3 h-3" />,
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

              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 w-fit">
                <button
                  onClick={() => setView('calendar')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    view === 'calendar' ? 'bg-white text-pink-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span className="hidden sm:inline">Calendar</span>
                </button>
                <button
                  onClick={() => setView('list')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    view === 'list' ? 'bg-white text-pink-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <List className="w-4 h-4" />
                  <span className="hidden sm:inline">List</span>
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 min-w-0">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search appointments..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <select
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all text-sm min-w-0 flex-shrink-0"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending/Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
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
    </div>
  );
};

export default AllAppointments;
