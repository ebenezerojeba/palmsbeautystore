// import { useContext, useEffect, useState } from 'react';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import { AppContext } from '../context/AppContext';

// const MyAppointments = () => {
//   const { userData, backendUrl, token } = useContext(AppContext);
//   const [appointments, setAppointments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const fetchAppointments = async () => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       // Verify we have the required data
//       if (!userData?._id || !token) {
//         throw new Error('Missing user data or authentication');
//       }

//       const { data } = await axios.get(
//         `${backendUrl}/api/appointment/user/${userData._id}`,
//         {
//           headers: { 
//             Authorization: `Bearer ${token}`  // Proper auth header format
//           }
//         }
//       );

//       if (data.success) {
//         setAppointments(data.appointments);
//       } else {
//         setError(data.message || 'Failed to load appointments');
//       }
//     } catch (error) {
//       console.error('Fetch error:', error);
//       setError(error.response?.data?.message || error.message || "Failed to fetch appointments");
      
//       // Handle unauthorized (401) errors
//       if (error.response?.status === 401) {
//         toast.error('Session expired. Please login again.');
//         // Optionally redirect to login
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCancelAppointment = async (appointmentId) => {
//     const reason = window.prompt("Please enter your cancellation reason:");
//     if (!reason) return;

//     try {
//       const { data } = await axios.put(
//         `${backendUrl}/api/appointment/cancel`,
//         {
//           appointmentId,
//           cancelledBy: 'client',
//           reason,
//         },
//         { 
//           headers: { 
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       if (data.success) {
//         toast.success(data.message);
//         await fetchAppointments(); // Refresh the list
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       console.error('Cancellation error:', error);
//       toast.error(error.response?.data?.message || "Failed to cancel appointment");
//     }
//   };

//   useEffect(() => {
//     if (userData?._id && token) {
//       fetchAppointments();
//     }
//   }, [userData?._id, token]);

//   if (loading) return <div className="text-center p-8">Loading appointments...</div>;
//   if (error) return <div className="text-red-500 p-4">Error: {error}</div>;

//   return (
//     <div className="p-4 max-w-4xl mx-auto">
//       <h2 className="text-2xl font-bold mb-6">My Appointments</h2>
      
//       {appointments.length === 0 ? (
//         <div className="text-center py-8">
//           <p className="text-gray-600">You have no upcoming appointments.</p>
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {appointments.map((appt) => (
//             <div key={appt._id} className="border rounded-lg p-4 shadow-sm bg-white">
//               <div className="flex justify-between items-start">
//                 <div>
//                   <h3 className="text-lg font-semibold">
//                     {appt.serviceTitle || "Appointment"}
//                   </h3>
//                   <p className="text-sm text-gray-600">
//                     {new Date(appt.date).toLocaleDateString()} at {appt.time}
//                   </p>
//                 </div>
//                 <span className={`px-2 py-1 rounded text-xs font-medium ${
//                   appt.status === 'confirmed' ? 'bg-green-100 text-green-800' :
//                   appt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
//                   'bg-red-100 text-red-800'
//                 }`}>
//                   {appt.status}
//                 </span>
//               </div>

//               {appt.status !== 'cancelled' && (
//                 <button
//                   onClick={() => handleCancelAppointment(appt._id)}
//                   className="mt-3 text-sm text-red-600 hover:text-red-800"
//                 >
//                   Cancel Appointment
//                 </button>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default MyAppointments;























import { useContext, useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext';
import { Calendar, Clock, User, AlertCircle, CheckCircle, XCircle, RotateCcw, Filter, Search } from 'lucide-react';

const MyAppointments = () => {
  const { userData, backendUrl, token } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [cancellingId, setCancellingId] = useState(null);

  const fetchAppointments = useCallback(async (showRefresh = false) => {
    try {
      if (showRefresh) setIsRefreshing(true);
      else setLoading(true);
      
      setError(null);
      
      if (!userData?._id || !token) {
        throw new Error('Missing user data or authentication');
      }

      const { data } = await axios.get(
        `${backendUrl}/api/appointment/user/${userData._id}`,
        {
          headers: { 
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (data.success) {
        setAppointments(data.appointments);
      } else {
        setError(data.message || 'Failed to load appointments');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setError(error.response?.data?.message || error.message || "Failed to fetch appointments");
      
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
      }
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [userData?._id, token, backendUrl]);

  const handleCancelAppointment = async (appointmentId) => {
    const reason = window.prompt("Please enter your cancellation reason:");
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
            'Content-Type': 'application/json'
          }
        }
      );

      if (data.success) {
        toast.success(data.message);
        await fetchAppointments(true);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Cancellation error:', error);
      toast.error(error.response?.data?.message || "Failed to cancel appointment");
    } finally {
      setCancellingId(null);
    }
  };

  // Memoized filtered appointments for performance
  const filteredAppointments = useMemo(() => {
    return appointments.filter(appt => {
      const matchesSearch = appt.serviceTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           new Date(appt.date).toLocaleDateString().includes(searchTerm);
      const matchesStatus = statusFilter === 'all' || appt.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [appointments, searchTerm, statusFilter]);

  // Get status counts for filter badges
  const statusCounts = useMemo(() => {
    return appointments.reduce((acc, appt) => {
      acc[appt.status] = (acc[appt.status] || 0) + 1;
      return acc;
    }, {});
  }, [appointments]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'pending': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'cancelled': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
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
      year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
    });
  };

  useEffect(() => {
    if (userData?._id && token) {
      fetchAppointments();
    }
  }, [fetchAppointments]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your appointments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to Load Appointments</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => fetchAppointments()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
              <p className="text-gray-600 mt-1">Manage and track your upcoming appointments</p>
            </div>
            <button
              onClick={() => fetchAppointments(true)}
              disabled={isRefreshing}
              className="flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <RotateCcw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{appointments.length}</p>
                </div>
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Confirmed</p>
                  <p className="text-2xl font-bold text-emerald-600">{statusCounts.confirmed || 0}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-amber-600">{statusCounts.pending || 0}</p>
                </div>
                <Clock className="w-8 h-8 text-amber-600" />
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Cancelled</p>
                  <p className="text-2xl font-bold text-red-600">{statusCounts.cancelled || 0}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search appointments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="pending">Pending</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Appointments List */}
        {filteredAppointments.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {appointments.length === 0 ? 'No appointments yet' : 'No matching appointments'}
            </h3>
            <p className="text-gray-600">
              {appointments.length === 0 
                ? 'Your upcoming appointments will appear here.' 
                : 'Try adjusting your search or filter criteria.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((appt) => (
              <div 
                key={appt._id} 
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <User className="w-5 h-5 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {appt.serviceTitle || "General Appointment"}
                        </h3>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
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
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(appt.status)}`}>
                      {getStatusIcon(appt.status)}
                      {appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
                    </span>
                    
                    {appt.status !== 'cancelled' && (
                      <button
                        onClick={() => handleCancelAppointment(appt._id)}
                        disabled={cancellingId === appt._id}
                        className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {cancellingId === appt._id ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-600"></div>
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