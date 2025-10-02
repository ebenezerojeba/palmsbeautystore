import React, { useContext, useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  Calendar,
  Clock,
  User,
  AlertCircle,
  CheckCircle,
  XCircle,
  RotateCcw,
  Filter,
  Search,
  Award,
  MapPin,
  Phone
} from 'lucide-react';
import { AppContext } from '../context/AppContext';

// Utility functions
const getStatusIcon = (status) => {
  const icons = {
    confirmed: <CheckCircle className="w-5 h-5" />,
    pending: <Clock className="w-5 h-5" />,
    cancelled: <XCircle className="w-5 h-5" />,
    completed: <Award className="w-5 h-5" />,
  };
  return icons[status] || <AlertCircle className="w-5 h-5" />;
};

const getStatusColor = (status) => {
  const colors = {
    confirmed: 'bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-800 border-emerald-200 shadow-emerald-100',
    pending: 'bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-800 border-amber-200 shadow-amber-100',
    cancelled: 'bg-gradient-to-r from-red-50 to-rose-50 text-red-800 border-red-200 shadow-red-100',
    completed: 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-800 border-blue-200 shadow-blue-100',
  };
  return colors[status] || 'bg-gradient-to-r from-gray-50 to-slate-50 text-gray-800 border-gray-200 shadow-gray-100';
};

const getCardGradient = (status) => {
  const gradients = {
    confirmed: 'bg-gradient-to-r from-emerald-500/5 to-green-500/5 border-l-emerald-400',
    pending: 'bg-gradient-to-r from-amber-500/5 to-yellow-500/5 border-l-amber-400',
    cancelled: 'bg-gradient-to-r from-red-500/5 to-rose-500/5 border-l-red-400',
    completed: 'bg-gradient-to-r from-blue-500/5 to-indigo-500/5 border-l-blue-400',
  };
  return gradients[status] || 'bg-gradient-to-r from-gray-500/5 to-slate-500/5 border-l-gray-400';
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';

  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
  });
};

const MyAppointments = () => {
  const { userData, backendUrl, token } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [cancellingId, setCancellingId] = useState(null);

  const fetchAppointments = useCallback(async (showRefresh = false) => {
    if (!userData?._id || !token) return;

    try {
      showRefresh ? setIsRefreshing(true) : setLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/appointment/user/${userData._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setAppointments(data.appointments);
      } else {
        throw new Error(data.message || 'Failed to load appointments');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message);
      if (err.response?.status === 401) toast.error('Session expired. Please login again.');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [backendUrl, userData?._id, token]);

  const handleCancelAppointment = async (appointmentId) => {
    const reason = prompt('Please enter a cancellation reason:');
    if (!reason) return;

    setCancellingId(appointmentId);
    try {
      const { data } = await axios.put(
        `${backendUrl}/api/appointment/cancel`,
        {
          appointmentId,
          cancelledBy: 'client',
          reason,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        await fetchAppointments(true);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to cancel appointment');
    } finally {
      setCancellingId(null);
    }
  };

  const filteredAppointments = useMemo(() => {
    return appointments.filter((appt) => {
      const matchesSearch =
        appt.serviceTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        new Date(appt.date).toLocaleDateString().includes(searchTerm);
      const matchesStatus = statusFilter === 'all' || appt.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [appointments, searchTerm, statusFilter]);

  const statusCounts = useMemo(() => {
    return appointments.reduce((acc, appt) => {
      acc[appt.status] = (acc[appt.status] || 0) + 1;
      return acc;
    }, {});
  }, [appointments]);

  // Check if appointment can be cancelled
  const canCancelAppointment = (appointment) => {
    const nonCancellableStatuses = ['cancelled', 'completed'];
    return !nonCancellableStatuses.includes(appointment.status);
  };

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin h-16 w-16 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-6"></div>
            <div className="absolute inset-0 h-16 w-16 border-4 border-transparent border-b-blue-400 rounded-full animate-pulse mx-auto"></div>
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Loading your appointments</h2>
          <p className="text-gray-500">Please wait a moment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 flex items-center justify-center p-4">
        <div className="bg-white shadow-xl p-8 rounded-2xl text-center max-w-md border border-red-100">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Oops! Something went wrong</h2>
          <p className="mb-6 text-gray-600 leading-relaxed">{error}</p>
          <button
            onClick={() => fetchAppointments()}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 font-medium shadow-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                My Appointments
              </h1>
              <p className="text-gray-600 mt-2">Track and manage your appointments</p>
            </div>
            <button
              onClick={() => fetchAppointments(true)}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-all duration-200 shadow-sm hover:shadow-md"
              aria-label="Refresh Appointments"
            >
              <RotateCcw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="font-medium">Refresh</span>
            </button>
          </div>

    </div>

        {/* Appointment List */}
        {filteredAppointments.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-12 h-12 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No Appointments Found</h3>
            <p className="text-gray-600 text-lg max-w-md mx-auto">
              {appointments.length === 0
                ? 'You haven\'t booked any appointments yet. Start by scheduling your first appointment!'
                : 'No matching appointments found. Try adjusting your search or filter criteria.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((appt, index) => (
              <div
                key={appt._id}
                className={`bg-white rounded-2xl shadow-sm border-l-4 ${getCardGradient(appt.status)} p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl ${getCardGradient(appt.status)} border`}>
                        {getStatusIcon(appt.status)}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{appt.serviceTitle}</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-blue-500" />
                            <span className="font-medium">{formatDate(appt.date)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-green-500" />
                            <span className="font-medium">{appt.time}</span>
                          </div>
                          {appt.doctorName && (
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-purple-500" />
                              <span className="font-medium">Dr. {appt.doctorName}</span>
                            </div>
                          )}
                        </div>
                        {appt.notes && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-700">{appt.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full border-2 ${getStatusColor(
                        appt.status
                      )} shadow-sm`}
                    >
                      {getStatusIcon(appt.status)}
                      {appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
                    </span>
                    
                    {canCancelAppointment(appt) && (
                      <button
                        onClick={() => handleCancelAppointment(appt._id)}
                        disabled={cancellingId === appt._id}
                        className="flex items-center text-red-600 hover:text-red-700 text-sm gap-2 px-4 py-2 hover:bg-red-50 rounded-xl border border-red-200 hover:border-red-300 transition-all duration-200 disabled:opacity-50 font-medium"
                      >
                        {cancellingId === appt._id ? (
                          <>
                            <div className="animate-spin w-4 h-4 border-2 border-b-transparent border-red-500 rounded-full"></div>
                            Cancelling...
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4" />
                            Cancel
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAppointments;


















