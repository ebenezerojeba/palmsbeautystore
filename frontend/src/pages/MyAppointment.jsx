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
  Search
} from 'lucide-react';
import { AppContext } from '../context/AppContext';

// Utility functions
const getStatusIcon = (status) => {
  const icons = {
    confirmed: <CheckCircle className="w-4 h-4" />,
    pending: <Clock className="w-4 h-4" />,
    cancelled: <XCircle className="w-4 h-4" />,
  };
  return icons[status] || <AlertCircle className="w-4 h-4" />;
};

const getStatusColor = (status) => {
  const colors = {
    confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    cancelled: 'bg-red-50 text-red-700 border-red-200',
  };
  return colors[status] || 'bg-gray-50 text-gray-700 border-gray-200';
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

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center text-gray-600">
        <div>
          <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          Loading appointments...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white shadow-md p-6 rounded-lg text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold mb-2">Something went wrong</h2>
          <p className="mb-4 text-gray-500">{error}</p>
          <button
            onClick={() => fetchAppointments()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
          <p className="text-sm text-gray-600">Track and manage your appointments.</p>
        </div>
        <button
          onClick={() => fetchAppointments(true)}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50"
          aria-label="Refresh Appointments"
        >
          <RotateCcw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

     

      {/* Search + Filter */}
      {/* <div className="bg-white p-4 rounded-lg shadow-sm border mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            aria-label="Search Appointments"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search by service or date..."
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            aria-label="Filter by status"
          >
            <option value="all">All Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div> */}

      {/* Appointment List */}
      {filteredAppointments.length === 0 ? (
        <div className="bg-white p-12 rounded-xl shadow-sm border text-center">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No Appointments</h3>
          <p className="text-gray-500">
            {appointments.length === 0
              ? 'You haven’t booked any appointments yet.'
              : 'No matching appointments found.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((appt) => (
            <div
              key={appt._id}
              className="bg-white border rounded-xl shadow-sm p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-md transition-shadow"
            >
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{appt.serviceTitle}</h3>
                <div className="text-sm text-gray-600 mt-1 flex flex-wrap gap-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(appt.date)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{appt.time}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full border ${getStatusColor(
                    appt.status
                  )}`}
                >
                  {getStatusIcon(appt.status)}
                  {appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
                </span>
                {appt.status !== 'cancelled' && (
                  <button
                    onClick={() => handleCancelAppointment(appt._id)}
                    disabled={cancellingId === appt._id}
                    className="flex items-center text-red-600 hover:text-red-700 text-sm gap-1 px-3 py-1 hover:bg-red-50 rounded disabled:opacity-50"
                  >
                    {cancellingId === appt._id ? (
                      <>
                        <div className="animate-spin w-3 h-3 border-2 border-b-transparent border-red-500 rounded-full"></div>
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
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAppointments;
