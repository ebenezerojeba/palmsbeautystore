// // // import React, { useEffect, useContext, useState } from "react";
// // // import { 
// // //   Check, 
// // //   Clock, 
// // //   Users, 
// // //   X, 
// // //   Calendar, 
// // //   Mail, 
// // //   Phone, 
// // //   Loader2, 
// // //   CheckCircle, 
// // //   XCircle, 
// // //   Filter,
// // //   TrendingUp,
// // //   Search,
// // //   MoreVertical,
// // //   Eye,
// // //   AlertCircle,
// // //   DollarSign,
// // //   Activity
// // // } from "lucide-react";
// // // import { AdminContexts } from "../context/AdminContexts";
// // // // import { AdminContexts } from "../context/AdminContexts";
// // // // Simulating navigation functionality for demo
// // // const useNavigate = () => (path) => console.log(`Navigating to: ${path}`);

// // // const Dashboard = () => {
 
// // //   const {
// // //     dashData,
// // //     getDashData,
// // //     slotDateFormat,
// // //     cancelAppointment,
// // //     completeAppointment,
// // //     confirmAppointment,
// // //     loadingId,
// // //     appointments,
// // //     getAllAppointments
// // //   } = useContext(AdminContexts); // Replace with: useContext(AdminContexts);

// // //   const [filterStatus, setFilterStatus] = useState('all');
// // //   const [searchTerm, setSearchTerm] = useState('');
// // //   const [selectedDateRange, setSelectedDateRange] = useState('today');
// // //   const [showFilters, setShowFilters] = useState(false);
// // //   const navigate = useNavigate();
  
// // //   useEffect(() => {
// // //     getDashData();
// // //     getAllAppointments();
// // //   }, []);

// // //   // Enhanced filter logic
// // //   const getFilteredAppointments = () => {
// // //     let appointmentsToFilter = filterStatus === 'all' 
// // //       ? dashData?.latestAppointments || []
// // //       : appointments || [];

// // //     // Filter by status
// // //     if (filterStatus !== 'all') {
// // //       appointmentsToFilter = appointmentsToFilter.filter(apt => apt.status === filterStatus);
// // //     }

// // //     // Filter by search term
// // //     if (searchTerm) {
// // //       appointmentsToFilter = appointmentsToFilter.filter(apt => 
// // //         apt.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // //         apt.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // //         apt.serviceTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // //         apt.services?.some(service => 
// // //           service.serviceTitle?.toLowerCase().includes(searchTerm.toLowerCase())
// // //         )
// // //       );
// // //     }

// // //     return appointmentsToFilter;
// // //   };

// // //   const getStatusStats = () => {
// // //     const stats = {
// // //       completed: dashData?.completedAppointments || 0,
// // //       pending: dashData?.pendingAppointments || 0,
// // //       confirmed: dashData?.confirmedAppointments || 0,
// // //       cancelled: dashData?.cancelledAppointments || 0,
// // //       total: dashData?.totalAppointments || 0,
// // //       revenue: dashData?.totalRevenue || 0,
// // //       noShow: dashData?.noShowAppointments || 0
// // //     };
// // //     return stats;
// // //   };

// // //   const StatCard = ({ icon, value, label, bgColor, textColor, status, trend, onClick, isRevenue = false }) => (
// // //     <div 
// // //       className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 transition-all duration-300 hover:shadow-md cursor-pointer hover:border-gray-300
// // //         ${filterStatus === status ? 'ring-2 ring-gray-500 border-gray-500' : ''}`}
// // //       onClick={() => onClick && onClick(status)}
// // //     >
// // //       <div className="flex items-center justify-between mb-4">
// // //         <div className={`${bgColor} p-3 rounded-lg`}>
// // //           {React.cloneElement(icon, {
// // //             className: `${textColor} w-6 h-6`,
// // //           })}
// // //         </div>
// // //         {trend && (
// // //           <div className="flex items-center text-green-600">
// // //             <TrendingUp className="w-4 h-4 mr-1" />
// // //             <span className="text-sm font-medium">+{trend}%</span>
// // //           </div>
// // //         )}
// // //       </div>
// // //       <div>
// // //         <p className={`text-2xl font-bold ${textColor} mb-1`}>
// // //           {isRevenue ? `$${value?.toLocaleString() || 0}` : (value || 0)}
// // //         </p>
// // //         <p className="text-sm text-gray-600">{label}</p>
// // //       </div>
// // //     </div>
// // //   );

// // //   const handleFilterClick = (status) => {
// // //     setFilterStatus(status === filterStatus ? 'all' : status);
// // //   };

// // //   const StatusBadge = ({ status }) => {
// // //     const styles = {
// // //       cancelled: "bg-red-50 text-red-700 border border-red-200",
// // //       completed: "bg-green-50 text-green-700 border border-green-200",
// // //       pending: "bg-yellow-50 text-yellow-700 border border-yellow-200",
// // //       confirmed: "bg-gray-50 text-gray-700 border border-gray-200",
// // //       'no-show': "bg-gray-50 text-gray-700 border border-gray-200",
// // //     };
    
// // //     const displayText = {
// // //       'no-show': 'No Show',
// // //       cancelled: 'Cancelled',
// // //       completed: 'Completed',
// // //       pending: 'Pending',
// // //       confirmed: 'Confirmed'
// // //     };
    
// // //     return (
// // //       <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
// // //         {displayText[status] || status}
// // //       </span>
// // //     );
// // //   };

// // //   const ActionButton = ({ onClick, icon, color, title, disabled = false, loading = false }) => (
// // //     <button
// // //       onClick={onClick}
// // //       className={`p-2 rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-not-allowed
// // //         ${color === 'red' ? 'text-red-600 border-red-200 hover:bg-red-50' :
// // //           color === 'green' ? 'text-green-600 border-green-200 hover:bg-green-50' :
// // //           color === 'gray' ? 'text-gray-600 border-gray-200 hover:bg-gray-50' :
// // //           'text-gray-600 border-gray-200 hover:bg-gray-50'}`}
// // //       disabled={disabled}
// // //       title={title}
// // //     >
// // //       {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : icon}
// // //     </button>
// // //   );

// // //   if (!dashData) {
// // //     return (
// // //       <div className="p-6 bg-gray-50 min-h-screen">
// // //         <div className="max-w-7xl mx-auto">
// // //           <div className="animate-pulse">
// // //             <div className="h-8 bg-gray-200 rounded w-64 mb-8" />
// // //             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
// // //               {[...Array(4)].map((_, i) => (
// // //                 <div key={i} className="bg-white rounded-lg shadow-sm p-6">
// // //                   <div className="h-20 bg-gray-200 rounded" />
// // //                 </div>
// // //               ))}
// // //             </div>
// // //             <div className="bg-white rounded-lg shadow-sm p-6">
// // //               <div className="h-64 bg-gray-200 rounded" />
// // //             </div>
// // //           </div>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   const stats = getStatusStats();
// // //   const filteredAppointments = getFilteredAppointments();

// // //   return (
// // //     <div className="p-6 bg-gray-50 min-h-screen">
// // //       <div className="max-w-7xl mx-auto">
// // //         {/* Header */}
// // //         <div className="mb-8">
// // //           <div className="flex flex-col md:flex-row md:items-center justify-between">
// // //             <div>
// // //               <h1 className="text-3xl font-bold text-gray-900 mb-2">
// // //                 Dashboard Overview
// // //               </h1>
// // //               <p className="text-gray-600">
// // //                 Monitor your appointments and business performance
// // //               </p>
// // //             </div>
// // //             <div className="mt-4 md:mt-0">
// // //               <button
// // //                 onClick={() => navigate('/appointments')}
// // //                 className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
// // //               >
// // //                 View All Appointments
// // //               </button>
// // //             </div>
// // //           </div>
// // //         </div>
        
// // //         {/* Stats Grid */}
// // //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
// // //           <StatCard
// // //             icon={<Activity />}
// // //             value={stats.total}
// // //             label="Total Appointments"
// // //             bgColor="bg-purple-100"
// // //             textColor="text-purple-600"
// // //             status="all"
// // //             trend={12}
// // //             onClick={() => navigate('/appointments')}
// // //           />
// // //           <StatCard
// // //             icon={<Clock />}
// // //             value={stats.pending}
// // //             label="Pending Appointments"
// // //             bgColor="bg-yellow-100"
// // //             textColor="text-yellow-600"
// // //             status="pending"
// // //             onClick={handleFilterClick}
// // //           />
// // //           <StatCard
// // //             icon={<CheckCircle />}
// // //             value={stats.confirmed}
// // //             label="Confirmed Today"
// // //             bgColor="bg-gray-100"
// // //             textColor="text-gray-600"
// // //             status="confirmed"
// // //             trend={8}
// // //             onClick={handleFilterClick}
// // //           />
// // //           <StatCard
// // //             icon={<Check />}
// // //             value={stats.completed}
// // //             label="Completed"
// // //             bgColor="bg-green-100"
// // //             textColor="text-green-600"
// // //             status="completed"
// // //             onClick={handleFilterClick}
// // //           />
// // //         </div>

// // //         {/* Additional Stats Row */}
// // //         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
// // //           <StatCard
// // //             icon={<DollarSign />}
// // //             value={stats.revenue}
// // //             label="Total Revenue"
// // //             bgColor="bg-emerald-100"
// // //             textColor="text-emerald-600"
// // //             trend={15}
// // //             isRevenue={true}
// // //           />
// // //           <StatCard
// // //             icon={<X />}
// // //             value={stats.cancelled}
// // //             label="Cancelled"
// // //             bgColor="bg-red-100"
// // //             textColor="text-red-600"
// // //             status="cancelled"
// // //             onClick={handleFilterClick}
// // //           />
// // //           <StatCard
// // //             icon={<AlertCircle />}
// // //             value={stats.noShow}
// // //             label="No Shows"
// // //             bgColor="bg-gray-100"
// // //             textColor="text-gray-600"
// // //             status="no-show"
// // //             onClick={handleFilterClick}
// // //           />
// // //         </div>

// // //         {/* Appointments Table */}
// // //         <div className="bg-white rounded-lg shadow-sm border border-gray-200">
// // //           {/* Table Header */}
// // //           <div className="border-b border-gray-200 p-6">
// // //             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
// // //               <div className="flex items-center gap-3">
// // //                 <Calendar className="w-5 h-5 text-gray-500" />
// // //                 <h2 className="text-xl font-semibold text-gray-900">
// // //                   Recent Appointments
// // //                 </h2>
// // //                 <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm">
// // //                   {filteredAppointments.length}
// // //                 </span>
// // //               </div>
              
// // //               <div className="flex items-center gap-3">
// // //                 {/* Search */}
// // //                 <div className="relative">
// // //                   <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
// // //                   <input
// // //                     type="text"
// // //                     placeholder="Search appointments..."
// // //                     value={searchTerm}
// // //                     onChange={(e) => setSearchTerm(e.target.value)}
// // //                     className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 w-64"
// // //                   />
// // //                 </div>
                
// // //                 {/* Filter Button */}
// // //                 <button
// // //                   onClick={() => setShowFilters(!showFilters)}
// // //                   className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
// // //                 >
// // //                   <Filter className="w-4 h-4" />
// // //                   Filter
// // //                 </button>
// // //               </div>
// // //             </div>

// // //             {/* Filter Pills */}
// // //             {showFilters && (
// // //               <div className="mt-4 flex flex-wrap gap-2">
// // //                 {['all', 'pending', 'confirmed', 'completed', 'cancelled', 'no-show'].map((status) => (
// // //                   <button
// // //                     key={status}
// // //                     onClick={() => handleFilterClick(status)}
// // //                     className={`px-3 py-1 rounded-full text-sm font-medium transition-colors
// // //                       ${filterStatus === status 
// // //                         ? 'bg-gray-100 text-gray-700 border border-gray-300' 
// // //                         : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
// // //                   >
// // //                     {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
// // //                   </button>
// // //                 ))}
// // //               </div>
// // //             )}
// // //           </div>

// // //           {/* Table Content */}
// // //           <div className="divide-y divide-gray-100">
// // //             {filteredAppointments.length === 0 ? (
// // //               <div className="px-6 py-12 text-center">
// // //                 <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
// // //                 <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
// // //                 <p className="text-gray-500">
// // //                   {searchTerm 
// // //                     ? "Try adjusting your search terms or filters" 
// // //                     : "No appointments match the selected criteria"}
// // //                 </p>
// // //               </div>
// // //             ) : (
// // //               filteredAppointments.map((item, index) => (
// // //                 <div
// // //                   key={item._id || index}
// // //                   className="p-6 hover:bg-gray-50 transition-colors"
// // //                 >
// // //                   <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
// // //                     {/* Main Info */}
// // //                     <div className="flex-1 min-w-0">
// // //                       <div className="flex items-center gap-3 mb-3">
// // //                         <h3 className="text-lg font-semibold text-gray-900 truncate">
// // //                           {item.serviceTitle || item.services?.[0]?.serviceTitle || 'Service'}
// // //                         </h3>
// // //                         <StatusBadge status={item.status} />
// // //                       </div>
                      
// // //                       {/* Multi-service display */}
// // //                       {item.services && item.services.length > 1 && (
// // //                         <div className="mb-3">
// // //                           <p className="text-sm text-gray-500 mb-2">Additional Services:</p>
// // //                           <div className="flex flex-wrap gap-2">
// // //                             {item.services.slice(1).map((service, idx) => (
// // //                               <span key={idx} className="text-sm bg-gray-50 text-gray-700 px-3 py-1 rounded-full border border-gray-200">
// // //                                 {service.serviceTitle}
// // //                               </span>
// // //                             ))}
// // //                           </div>
// // //                         </div>
// // //                       )}
                      
// // //                       {/* Customer & Schedule Info */}
// // //                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
// // //                         <div className="flex items-center">
// // //                           <Users className="w-4 h-4 mr-2 text-gray-400" />
// // //                           <span className="font-medium">{item.userName}</span>
// // //                         </div>
// // //                         <div className="flex items-center">
// // //                           <Mail className="w-4 h-4 mr-2 text-gray-400" />
// // //                           <span className="truncate">{item.userEmail}</span>
// // //                         </div>
// // //                         <div className="flex items-center">
// // //                           <Phone className="w-4 h-4 mr-2 text-gray-400" />
// // //                           <span>{item.userPhone}</span>
// // //                         </div>
// // //                         <div className="flex items-center">
// // //                           <Calendar className="w-4 h-4 mr-2 text-gray-400" />
// // //                           <span>
// // //                             {slotDateFormat(item.date)} at {slotDateFormat(item.time)}
// // //                           </span>
// // //                         </div>
// // //                       </div>
                      
// // //                       {/* Payment Info */}
// // //                       {item.payment && (
// // //                         <div className="mt-3">
// // //                           <span className={`inline-flex items-center text-sm px-3 py-1 rounded-full font-medium ${
// // //                             item.payment.status === 'paid' 
// // //                               ? 'bg-green-50 text-green-700 border border-green-200'
// // //                               : item.payment.status === 'failed'
// // //                               ? 'bg-red-50 text-red-700 border border-red-200'
// // //                               : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
// // //                           }`}>
// // //                             <DollarSign className="w-4 h-4 mr-1" />
// // //                             {item.payment.status.toUpperCase()} - ${item.payment.amount}
// // //                           </span>
// // //                         </div>
// // //                       )}
// // //                     </div>

// // //                     {/* Actions */}
// // //                     <div className="flex items-center gap-2">
// // //                       {item.status === 'cancelled' || item.status === 'completed' || item.status === 'no-show' ? (
// // //                         <div className="flex items-center gap-2">
// // //                           <StatusBadge status={item.status} />
// // //                           <ActionButton
// // //                             onClick={() => navigate(`/appointments/${item._id}`)}
// // //                             icon={<Eye className="w-4 h-4" />}
// // //                             color="gray"
// // //                             title="View Details"
// // //                           />
// // //                         </div>
// // //                       ) : (
// // //                         <div className="flex items-center gap-2">
// // //                           {item.status === 'pending' && (
// // //                             <ActionButton
// // //                               onClick={() => confirmAppointment && confirmAppointment(item._id)}
// // //                               icon={<CheckCircle className="w-4 h-4" />}
// // //                               color="gray"
// // //                               title="Confirm Appointment"
// // //                               disabled={loadingId === item._id}
// // //                               loading={loadingId === item._id}
// // //                             />
// // //                           )}
                          
// // //                           <ActionButton
// // //                             onClick={() => completeAppointment(item._id)}
// // //                             icon={<Check className="w-4 h-4" />}
// // //                             color="green"
// // //                             title="Mark as Completed"
// // //                             disabled={loadingId === item._id}
// // //                             loading={loadingId === item._id}
// // //                           />
                          
// // //                           <ActionButton
// // //                             onClick={() => cancelAppointment(item._id)}
// // //                             icon={<X className="w-4 h-4" />}
// // //                             color="red"
// // //                             title="Cancel Appointment"
// // //                             disabled={loadingId === item._id}
// // //                             loading={loadingId === item._id}
// // //                           />
                          
// // //                           <ActionButton
// // //                             onClick={() => navigate(`/appointments/${item._id}`)}
// // //                             icon={<MoreVertical className="w-4 h-4" />}
// // //                             color="gray"
// // //                             title="More Options"
// // //                           />
// // //                         </div>
// // //                       )}
// // //                     </div>
// // //                   </div>
// // //                 </div>
// // //               ))
// // //             )}
// // //           </div>

// // //           {/* Pagination or Load More */}
// // //           {filteredAppointments.length > 0 && (
// // //             <div className="border-t border-gray-200 px-6 py-4">
// // //               <div className="flex items-center justify-between">
// // //                 <p className="text-sm text-gray-700">
// // //                   Showing {filteredAppointments.length} appointments
// // //                 </p>
// // //                 <button
// // //                   onClick={() => navigate('/appointments')}
// // //                   className="text-gray-600 hover:text-gray-700 text-sm font-medium"
// // //                 >
// // //                   View all appointments →
// // //                 </button>
// // //               </div>
// // //             </div>
// // //           )}
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default Dashboard;


























// // import React, { useEffect, useContext, useState } from "react";
// // import { 
// //   Check, 
// //   Clock, 
// //   Users, 
// //   X, 
// //   Calendar, 
// //   Mail, 
// //   Phone, 
// //   Loader2, 
// //   CheckCircle, 
// //   XCircle, 
// //   Filter,
// //   TrendingUp,
// //   Search,
// //   MoreVertical,
// //   Eye,
// //   AlertCircle,
// //   DollarSign,
// //   Activity,
// //   Notebook,
// //   NotebookPen
// // } from "lucide-react";
// // import { AdminContexts } from "../context/AdminContexts";

// // // Simulating navigation functionality for demo
// // const useNavigate = () => (path) => console.log(`Navigating to: ${path}`);

// // const Dashboard = () => {
 
// //   const {
// //     dashData,
// //     getDashData,
// //     slotDateFormat,
// //     cancelAppointment,
// //     completeAppointment,
// //     confirmAppointment,
// //     loadingId,
// //     appointments,
// //     getAllAppointments
// //   } = useContext(AdminContexts);

// //   const [filterStatus, setFilterStatus] = useState('all');
// //   const [searchTerm, setSearchTerm] = useState('');
// //   const [selectedDateRange, setSelectedDateRange] = useState('today');
// //   const [showFilters, setShowFilters] = useState(false);
// //   const navigate = useNavigate();
  
// //   useEffect(() => {
// //     getDashData();
// //     getAllAppointments();
// //   }, []);

// //   // Enhanced handlers that refresh data after operation
// //   const handleCancelAppointment = async (appointmentId) => {
// //     try {
// //       await cancelAppointment(appointmentId);
// //       // Refresh both dashboard data and appointments list
// //       await Promise.all([getDashData(), getAllAppointments()]);
// //     } catch (error) {
// //       console.error('Error cancelling appointment:', error);
// //     }
// //   };

// //   const handleCompleteAppointment = async (appointmentId) => {
// //     try {
// //       await completeAppointment(appointmentId);
// //       // Refresh both dashboard data and appointments list
// //       await Promise.all([getDashData(), getAllAppointments()]);
// //     } catch (error) {
// //       console.error('Error completing appointment:', error);
// //     }
// //   };

// //   const handleConfirmAppointment = async (appointmentId) => {
// //     try {
// //       await confirmAppointment(appointmentId);
// //       // Refresh both dashboard data and appointments list
// //       await Promise.all([getDashData(), getAllAppointments()]);
// //     } catch (error) {
// //       console.error('Error confirming appointment:', error);
// //     }
// //   };

// //   // Enhanced filter logic
// //   const getFilteredAppointments = () => {
// //     let appointmentsToFilter = filterStatus === 'all' 
// //       ? dashData?.latestAppointments || []
// //       : appointments || [];

// //     // Filter by status
// //     if (filterStatus !== 'all') {
// //       appointmentsToFilter = appointmentsToFilter.filter(apt => apt.status === filterStatus);
// //     }

// //     // Filter by search term
// //     if (searchTerm) {
// //       appointmentsToFilter = appointmentsToFilter.filter(apt => 
// //         apt.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //         apt.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //         apt.serviceTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //         apt.services?.some(service => 
// //           service.serviceTitle?.toLowerCase().includes(searchTerm.toLowerCase())
// //         )
// //       );
// //     }

// //     return appointmentsToFilter;
// //   };

// //   const getStatusStats = () => {
// //     const stats = {
// //       completed: dashData?.completedAppointments || 0,
// //       pending: dashData?.pendingAppointments || 0,
// //       confirmed: dashData?.confirmedAppointments || 0,
// //       cancelled: dashData?.cancelledAppointments || 0,
// //       total: dashData?.totalAppointments || 0,
// //       revenue: dashData?.totalRevenue || 0,
// //       noShow: dashData?.noShowAppointments || 0
// //     };
// //     return stats;
// //   };

// //   const StatCard = ({ icon, value, label, bgColor, textColor, status, trend, onClick, isRevenue = false }) => (
// //     <div 
// //       className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 transition-all duration-300 hover:shadow-md cursor-pointer hover:border-gray-300
// //         ${filterStatus === status ? 'ring-2 ring-gray-500 border-gray-500' : ''}`}
// //       onClick={() => onClick && onClick(status)}
// //     >
// //       <div className="flex items-center justify-between mb-4">
// //         <div className={`${bgColor} p-3 rounded-lg`}>
// //           {React.cloneElement(icon, {
// //             className: `${textColor} w-6 h-6`,
// //           })}
// //         </div>
// //         {trend && (
// //           <div className="flex items-center text-green-600">
// //             <TrendingUp className="w-4 h-4 mr-1" />
// //             <span className="text-sm font-medium">+{trend}%</span>
// //           </div>
// //         )}
// //       </div>
// //       <div>
// //         <p className={`text-2xl font-bold ${textColor} mb-1`}>
// //           {isRevenue ? `$${value?.toLocaleString() || 0}` : (value || 0)}
// //         </p>
// //         <p className="text-sm text-gray-600">{label}</p>
// //       </div>
// //     </div>
// //   );

// //   const handleFilterClick = (status) => {
// //     setFilterStatus(status === filterStatus ? 'all' : status);
// //   };

// //   const StatusBadge = ({ status, item }) => {
// //     // Handle both status property and legacy isCancelled/isCompleted properties
// //     let actualStatus = status;
// //     if (item && !status) {
// //       if (item.isCompleted) actualStatus = 'completed';
// //       else if (item.isCancelled) actualStatus = 'cancelled';
// //       else actualStatus = 'pending';
// //     }

// //     const styles = {
// //       cancelled: "bg-red-50 text-red-700 border border-red-200",
// //       completed: "bg-green-50 text-green-700 border border-green-200",
// //       pending: "bg-yellow-50 text-yellow-700 border border-yellow-200",
// //       confirmed: "bg-gray-50 text-gray-700 border border-gray-200",
// //       'no-show': "bg-gray-50 text-gray-700 border border-gray-200",
// //     };
    
// //     const displayText = {
// //       'no-show': 'No Show',
// //       cancelled: 'Cancelled',
// //       completed: 'Completed',
// //       pending: 'Pending',
// //       confirmed: 'Confirmed'
// //     };
    
// //     return (
// //       <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[actualStatus]}`}>
// //         {displayText[actualStatus] || actualStatus}
// //       </span>
// //     );
// //   };

// //   const ActionButton = ({ onClick, icon, color, title, disabled = false, loading = false }) => (
// //     <button
// //       onClick={onClick}
// //       className={`p-2 rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-not-allowed
// //         ${color === 'red' ? 'text-red-600 border-red-200 hover:bg-red-50' :
// //           color === 'green' ? 'text-green-600 border-green-200 hover:bg-green-50' :
// //           color === 'gray' ? 'text-gray-600 border-gray-200 hover:bg-gray-50' :
// //           'text-gray-600 border-gray-200 hover:bg-gray-50'}`}
// //       disabled={disabled}
// //       title={title}
// //     >
// //       {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : icon}
// //     </button>
// //   );

// //   if (!dashData) {
// //     return (
// //       <div className="p-6 bg-gray-50 min-h-screen">
// //         <div className="max-w-7xl mx-auto">
// //           <div className="animate-pulse">
// //             <div className="h-8 bg-gray-200 rounded w-64 mb-8" />
// //             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
// //               {[...Array(4)].map((_, i) => (
// //                 <div key={i} className="bg-white rounded-lg shadow-sm p-6">
// //                   <div className="h-20 bg-gray-200 rounded" />
// //                 </div>
// //               ))}
// //             </div>
// //             <div className="bg-white rounded-lg shadow-sm p-6">
// //               <div className="h-64 bg-gray-200 rounded" />
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   const stats = getStatusStats();
// //   const filteredAppointments = getFilteredAppointments();

// //   return (
// //     <div className="p-6 bg-gray-50 min-h-screen">
// //       <div className="max-w-7xl mx-auto">
// //         {/* Header */}
// //         <div className="mb-8">
// //           <div className="flex flex-col md:flex-row md:items-center justify-between">
// //             <div>
// //               <h1 className="text-3xl font-bold text-gray-900 mb-2">
// //                 Dashboard Overview
// //               </h1>
// //               <p className="text-gray-600">
// //                 Monitor your appointments and business performance
// //               </p>
// //             </div>
// //             <div className="mt-4 md:mt-0">
// //               <button
// //                 onClick={() => navigate('/appointments')}
// //                 className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
// //               >
// //                 View All Appointments
// //               </button>
// //             </div>
// //           </div>
// //         </div>
        
// //         {/* Stats Grid */}
// //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
// //           <StatCard
// //             icon={<Activity />}
// //             value={stats.total}
// //             label="Total Appointments"
// //             bgColor="bg-purple-100"
// //             textColor="text-purple-600"
// //             status="all"
// //             trend={12}
// //             onClick={() => navigate('/appointments')}
// //           />
// //           <StatCard
// //             icon={<Clock />}
// //             value={stats.pending}
// //             label="Pending Appointments"
// //             bgColor="bg-yellow-100"
// //             textColor="text-yellow-600"
// //             status="pending"
// //             onClick={handleFilterClick}
// //           />
// //           <StatCard
// //             icon={<CheckCircle />}
// //             value={stats.confirmed}
// //             label="Confirmed Today"
// //             bgColor="bg-gray-100"
// //             textColor="text-gray-600"
// //             status="confirmed"
// //             trend={8}
// //             onClick={handleFilterClick}
// //           />
// //           <StatCard
// //             icon={<Check />}
// //             value={stats.completed}
// //             label="Completed"
// //             bgColor="bg-green-100"
// //             textColor="text-green-600"
// //             status="completed"
// //             onClick={handleFilterClick}
// //           />
// //         </div>

// //         {/* Additional Stats Row */}
// //         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
// //           <StatCard
// //             icon={<DollarSign />}
// //             value={stats.revenue}
// //             label="Total Revenue"
// //             bgColor="bg-emerald-100"
// //             textColor="text-emerald-600"
// //             trend={15}
// //             isRevenue={true}
// //           />
// //           <StatCard
// //             icon={<X />}
// //             value={stats.cancelled}
// //             label="Cancelled"
// //             bgColor="bg-red-100"
// //             textColor="text-red-600"
// //             status="cancelled"
// //             onClick={handleFilterClick}
// //           />
// //         </div>

// //         {/* Appointments Table */}
// //         <div className="bg-white rounded-lg shadow-sm border border-gray-200">
// //           {/* Table Header */}
// //           <div className="border-b border-gray-200 p-6">
// //             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
// //               <div className="flex items-center gap-3">
// //                 <Calendar className="w-5 h-5 text-gray-500" />
// //                 <h2 className="text-xl font-semibold text-gray-900">
// //                   Recent Appointments
// //                 </h2>
// //                 <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm">
// //                   {filteredAppointments.length}
// //                 </span>
// //               </div>
              
// //             </div>

// //             {/* Filter Pills */}
// //             {showFilters && (
// //               <div className="mt-4 flex flex-wrap gap-2">
// //                 {['all', 'pending', 'confirmed', 'completed', 'cancelled', 'no-show'].map((status) => (
// //                   <button
// //                     key={status}
// //                     onClick={() => handleFilterClick(status)}
// //                     className={`px-3 py-1 rounded-full text-sm font-medium transition-colors
// //                       ${filterStatus === status 
// //                         ? 'bg-gray-100 text-gray-700 border border-gray-300' 
// //                         : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
// //                   >
// //                     {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
// //                   </button>
// //                 ))}
// //               </div>
// //             )}
// //           </div>

// //           {/* Table Content */}
// //           <div className="divide-y divide-gray-100">
// //             {filteredAppointments.length === 0 ? (
// //               <div className="px-6 py-12 text-center">
// //                 <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
// //                 <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
// //                 <p className="text-gray-500">
// //                   {searchTerm 
// //                     ? "Try adjusting your search terms or filters" 
// //                     : "No appointments match the selected criteria"}
// //                 </p>
// //               </div>
// //             ) : (
// //               filteredAppointments.map((item, index) => (
// //                 <div
// //                   key={item._id || index}
// //                   className="p-6 hover:bg-gray-50 transition-colors"
// //                 >
// //                   <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
// //                     {/* Main Info */}
// //                     <div className="flex-1 min-w-0">
// //                       <div className="flex items-center gap-3 mb-3">
// //                         <h3 className="text-lg font-semibold text-gray-900 truncate">
// //                           {item.serviceTitle || item.services?.[0]?.serviceTitle || 'Service'}
// //                         </h3>
// //                         <StatusBadge status={item.status} item={item} />
// //                       </div>
                      
// //                       {/* Multi-service display */}
// //                       {item.services && item.services.length > 1 && (
// //                         <div className="mb-3">
// //                           <p className="text-sm text-gray-500 mb-2">Additional Services:</p>
// //                           <div className="flex flex-wrap gap-2">
// //                             {item.services.slice(1).map((service, idx) => (
// //                               <span key={idx} className="text-sm bg-gray-50 text-gray-700 px-3 py-1 rounded-full border border-gray-200">
// //                                 {service.serviceTitle}
// //                               </span>
// //                             ))}
// //                           </div>
// //                         </div>
// //                       )}
                      
// //                       {/* Customer & Schedule Info */}
// //                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
// //                         <div className="flex items-center">
// //                           <Users className="w-4 h-4 mr-2 text-gray-400" />
// //                           <span className="font-medium">{item.userName}</span>
// //                         </div>
// //                         <div className="flex items-center">
// //                           <Mail className="w-4 h-4 mr-2 text-gray-400" />
// //                           <span className="truncate">{item.userEmail}</span>
// //                         </div>
// //                         <div className="flex items-center">
// //                           <Phone className="w-4 h-4 mr-2 text-gray-400" />
// //                           <span>{item.userPhone}</span>
// //                         </div>
// //                         <div className="flex items-center">
// //                           <NotebookPen className="w-4 h-4 mr-2 text-gray-400" />
// //                           <span>{item.clientNotes}</span>
// //                         </div>
// //                         <div className="flex items-center">
// //                           <Calendar className="w-4 h-4 mr-2 text-gray-400" />
// //                           <span>
// //                             {slotDateFormat(item.date)} at {slotDateFormat(item.time)}
// //                           </span>
// //                         </div>
// //                       </div>
                      
// //                       {/* Payment Info */}
// //                       {item.payment && (
// //                         <div className="mt-3">
// //                           <span className={`inline-flex items-center text-sm px-3 py-1 rounded-full font-medium ${
// //                             item.payment.status === 'paid' 
// //                               ? 'bg-green-50 text-green-700 border border-green-200'
// //                               : item.payment.status === 'failed'
// //                               ? 'bg-red-50 text-red-700 border border-red-200'
// //                               : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
// //                           }`}>
// //                             <DollarSign className="w-4 h-4 mr-1" />
// //                             {item.payment.status.toUpperCase()} - ${item.payment.amount}
// //                           </span>
// //                         </div>
// //                       )}
// //                     </div>

// //                     {/* Actions */}
// //                     <div className="flex items-center gap-2">
// //                       {(item.status === 'cancelled' || item.status === 'completed' || item.status === 'no-show' || item.isCancelled || item.isCompleted) ? (
// //                         <div className="flex items-center gap-2">
// //                           <StatusBadge status={item.status} item={item} />
// //                           <ActionButton
// //                             onClick={() => navigate(`/appointments/${item._id}`)}
// //                             icon={<Eye className="w-4 h-4" />}
// //                             color="gray"
// //                             title="View Details"
// //                           />
// //                         </div>
// //                       ) : (
// //                         <div className="flex items-center gap-2">
// //                           {(item.status === 'pending' || (!item.status && !item.isCompleted && !item.isCancelled)) && (
// //                             <ActionButton
// //                               onClick={() => handleConfirmAppointment(item._id)}
// //                               icon={<CheckCircle className="w-4 h-4" />}
// //                               color="gray"
// //                               title="Confirm Appointment"
// //                               disabled={loadingId === item._id}
// //                               loading={loadingId === item._id}
// //                             />
// //                           )}
                          
// //                           <ActionButton
// //                             onClick={() => handleCompleteAppointment(item._id)}
// //                             icon={<Check className="w-4 h-4" />}
// //                             color="green"
// //                             title="Mark as Completed"
// //                             disabled={loadingId === item._id}
// //                             loading={loadingId === item._id}
// //                           />
                          
// //                           <ActionButton
// //                             onClick={() => handleCancelAppointment(item._id)}
// //                             icon={<X className="w-4 h-4" />}
// //                             color="red"
// //                             title="Cancel Appointment"
// //                             disabled={loadingId === item._id}
// //                             loading={loadingId === item._id}
// //                           />
                          
// //                           <ActionButton
// //                             onClick={() => navigate(`/appointments/${item._id}`)}
// //                             icon={<MoreVertical className="w-4 h-4" />}
// //                             color="gray"
// //                             title="More Options"
// //                           />
// //                         </div>
// //                       )}
// //                     </div>
// //                   </div>
// //                 </div>
// //               ))
// //             )}
// //           </div>

// //           {/* Pagination or Load More */}
// //           {filteredAppointments.length > 0 && (
// //             <div className="border-t border-gray-200 px-6 py-4">
// //               <div className="flex items-center justify-between">
// //                 <p className="text-sm text-gray-700">
// //                   Showing {filteredAppointments.length} appointments
// //                 </p>
// //                 <button
// //                   onClick={() => navigate('/appointments')}
// //                   className="text-gray-600 hover:text-gray-700 text-sm font-medium"
// //                 >
// //                   View all appointments →
// //                 </button>
// //               </div>
// //             </div>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Dashboard;





















// import React, { useEffect, useContext, useState } from "react";
// import { 
//   Check, 
//   Clock, 
//   Users, 
//   X, 
//   Calendar, 
//   Mail, 
//   Phone, 
//   Loader2, 
//   CheckCircle, 
//   XCircle, 
//   Filter,
//   TrendingUp,
//   Search,
//   MoreVertical,
//   Eye,
//   AlertCircle,
//   DollarSign,
//   Activity,
//   Notebook,
//   NotebookPen,
//   ChevronDown
// } from "lucide-react";
// import { AdminContexts } from "../context/AdminContexts";

// // Simulating navigation functionality for demo
// const useNavigate = () => (path) => console.log(`Navigating to: ${path}`);

// const Dashboard = () => {
 
//   const {
//     dashData,
//     getDashData,
//     slotDateFormat,
//     cancelAppointment,
//     completeAppointment,
//     confirmAppointment,
//     loadingId,
//     appointments,
//     getAllAppointments
//   } = useContext(AdminContexts);

//   const [filterStatus, setFilterStatus] = useState('all');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedDateRange, setSelectedDateRange] = useState('today');
//   const [showFilters, setShowFilters] = useState(false);
//   const [expandedCard, setExpandedCard] = useState(null);
//   const navigate = useNavigate();
  
//   useEffect(() => {
//     getDashData();
//     getAllAppointments();
//   }, []);

//   // Enhanced handlers that refresh data after operation
//   const handleCancelAppointment = async (appointmentId) => {
//     try {
//       await cancelAppointment(appointmentId);
//       await Promise.all([getDashData(), getAllAppointments()]);
//     } catch (error) {
//       console.error('Error cancelling appointment:', error);
//     }
//   };

//   const handleCompleteAppointment = async (appointmentId) => {
//     try {
//       await completeAppointment(appointmentId);
//       await Promise.all([getDashData(), getAllAppointments()]);
//     } catch (error) {
//       console.error('Error completing appointment:', error);
//     }
//   };

//   const handleConfirmAppointment = async (appointmentId) => {
//     try {
//       await confirmAppointment(appointmentId);
//       await Promise.all([getDashData(), getAllAppointments()]);
//     } catch (error) {
//       console.error('Error confirming appointment:', error);
//     }
//   };

//   // Enhanced filter logic
//   const getFilteredAppointments = () => {
//     let appointmentsToFilter = filterStatus === 'all' 
//       ? dashData?.latestAppointments || []
//       : appointments || [];

//     // Filter by status
//     if (filterStatus !== 'all') {
//       appointmentsToFilter = appointmentsToFilter.filter(apt => apt.status === filterStatus);
//     }

//     // Filter by search term
//     if (searchTerm) {
//       appointmentsToFilter = appointmentsToFilter.filter(apt => 
//         apt.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         apt.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         apt.serviceTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         apt.services?.some(service => 
//           service.serviceTitle?.toLowerCase().includes(searchTerm.toLowerCase())
//         )
//       );
//     }

//     return appointmentsToFilter;
//   };

//   const getStatusStats = () => {
//     const stats = {
//       completed: dashData?.completedAppointments || 0,
//       pending: dashData?.pendingAppointments || 0,
//       confirmed: dashData?.confirmedAppointments || 0,
//       cancelled: dashData?.cancelledAppointments || 0,
//       total: dashData?.totalAppointments || 0,
//       revenue: dashData?.totalRevenue || 0,
//       noShow: dashData?.noShowAppointments || 0
//     };
//     return stats;
//   };

//   const StatCard = ({ icon, value, label, bgColor, textColor, status, trend, onClick, isRevenue = false }) => (
//     <div 
//       className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 transition-all duration-300 hover:shadow-md cursor-pointer hover:border-gray-300
//         ${filterStatus === status ? 'ring-2 ring-gray-500 border-gray-500' : ''}`}
//       onClick={() => onClick && onClick(status)}
//     >
//       <div className="flex items-center justify-between mb-3 sm:mb-4">
//         <div className={`${bgColor} p-2 sm:p-3 rounded-lg`}>
//           {React.cloneElement(icon, {
//             className: `${textColor} w-4 h-4 sm:w-6 sm:h-6`,
//           })}
//         </div>
//         {trend && (
//           <div className="flex items-center text-green-600">
//             <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
//             <span className="text-xs sm:text-sm font-medium">+{trend}%</span>
//           </div>
//         )}
//       </div>
//       <div>
//         <p className={`text-lg sm:text-2xl font-bold ${textColor} mb-1`}>
//           {isRevenue ? `${value?.toLocaleString() || 0}` : (value || 0)}
//         </p>
//         <p className="text-xs sm:text-sm text-gray-600">{label}</p>
//       </div>
//     </div>
//   );

//   const handleFilterClick = (status) => {
//     setFilterStatus(status === filterStatus ? 'all' : status);
//   };

//   const StatusBadge = ({ status, item }) => {
//     // Handle both status property and legacy isCancelled/isCompleted properties
//     let actualStatus = status;
//     if (item && !status) {
//       if (item.isCompleted) actualStatus = 'completed';
//       else if (item.isCancelled) actualStatus = 'cancelled';
//       else actualStatus = 'pending';
//     }

//     const styles = {
//       cancelled: "bg-red-50 text-red-700 border border-red-200",
//       completed: "bg-green-50 text-green-700 border border-green-200",
//       pending: "bg-yellow-50 text-yellow-700 border border-yellow-200",
//       confirmed: "bg-gray-50 text-gray-700 border border-gray-200",
//       // 'no-show': "bg-gray-50 text-gray-700 border border-gray-200",
//     };
    
//     const displayText = {
//       // 'no-show': 'No Show',
//       cancelled: 'Cancelled',
//       completed: 'Completed',
//       pending: 'Pending',
//       confirmed: 'Confirmed'
//     };
    
//     return (
//       <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[actualStatus]}`}>
//         {displayText[actualStatus] || actualStatus}
//       </span>
//     );
//   };

//   const ActionButton = ({ onClick, icon, color, title, disabled = false, loading = false, compact = false }) => (
//     <button
//       onClick={onClick}
//       className={`${compact ? 'p-1.5' : 'p-2'} rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-not-allowed
//         ${color === 'red' ? 'text-red-600 border-red-200 hover:bg-red-50' :
//           color === 'green' ? 'text-green-600 border-green-200 hover:bg-green-50' :
//           color === 'gray' ? 'text-gray-600 border-gray-200 hover:bg-gray-50' :
//           'text-gray-600 border-gray-200 hover:bg-gray-50'}`}
//       disabled={disabled}
//       title={title}
//     >
//       {loading ? <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" /> : 
//        React.cloneElement(icon, { className: `w-3 h-3 sm:w-4 sm:h-4` })}
//     </button>
//   );

//   if (!dashData) {
//     return (
//       <div className="p-3 sm:p-6 bg-gray-50 min-h-screen">
//         <div className="max-w-7xl mx-auto">
//           <div className="animate-pulse">
//             <div className="h-6 sm:h-8 bg-gray-200 rounded w-48 sm:w-64 mb-6 sm:mb-8" />
//             <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
//               {[...Array(4)].map((_, i) => (
//                 <div key={i} className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
//                   <div className="h-16 sm:h-20 bg-gray-200 rounded" />
//                 </div>
//               ))}
//             </div>
//             <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
//               <div className="h-48 sm:h-64 bg-gray-200 rounded" />
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const stats = getStatusStats();
//   const filteredAppointments = getFilteredAppointments();

//   return (
//     <div className="p-3 sm:p-6 bg-gray-50 min-h-screen">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-6 sm:mb-8">
//           <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center justify-between">
//             <div>
//               <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
//                 Dashboard Overview
//               </h1>
//               <p className="text-sm sm:text-base text-gray-600">
//                 Monitor your appointments and business performance
//               </p>
//             </div>
//             <div className="w-full sm:w-auto">
//               <button
//                 onClick={() => navigate('/appointments')}
//                 className="w-full sm:w-auto bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm sm:text-base"
//               >
//                 View All Appointments
//               </button>
//             </div>
//           </div>
//         </div>
        
//         {/* Stats Grid - Mobile: 2 columns, Desktop: 4 columns */}
//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
//           <StatCard
//             icon={<Activity />}
//             value={stats.total}
//             label="Total Appointments"
//             bgColor="bg-purple-100"
//             textColor="text-purple-600"
//             status="all"
//             trend={12}
//             onClick={() => navigate('/appointments')}
//           />
//           <StatCard
//             icon={<Clock />}
//             value={stats.pending}
//             label="Pending Appointments"
//             bgColor="bg-yellow-100"
//             textColor="text-yellow-600"
//             status="pending"
//             onClick={handleFilterClick}
//           />
//           <StatCard
//             icon={<CheckCircle />}
//             value={stats.confirmed}
//             label="Confirmed Today"
//             bgColor="bg-gray-100"
//             textColor="text-gray-600"
//             status="confirmed"
//             trend={8}
//             onClick={handleFilterClick}
//           />
//           <StatCard
//             icon={<Check />}
//             value={stats.completed}
//             label="Completed"
//             bgColor="bg-green-100"
//             textColor="text-green-600"
//             status="completed"
//             onClick={handleFilterClick}
//           />
//         </div>

//         {/* Additional Stats Row - Mobile: 1 column, Tablet: 2 columns, Desktop: 3 columns */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 mb-6 sm:mb-8">
//           <StatCard
//             icon={<DollarSign />}
//             value={stats.revenue}
//             label="Total Revenue"
//             bgColor="bg-emerald-100"
//             textColor="text-emerald-600"
//             trend={15}
//             isRevenue={true}
//           />
//           <StatCard
//             icon={<X />}
//             value={stats.cancelled}
//             label="Cancelled"
//             bgColor="bg-red-100"
//             textColor="text-red-600"
//             status="cancelled"
//             onClick={handleFilterClick}
//           />

//         </div>

//         {/* Appointments Table */}
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200">
//           {/* Table Header */}
//           <div className="border-b border-gray-200 p-4 sm:p-6">
//             <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center justify-between">
//               <div className="flex items-center gap-2 sm:gap-3">
//                 <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
//                 <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
//                   Recent Appointments
//                 </h2>
//                 <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs sm:text-sm">
//                   {filteredAppointments.length}
//                 </span>
//               </div>
              
//               {/* Mobile: Stack search and filter, Desktop: Side by side */}
//               <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
//                 {/* Search */}
//                 <div className="relative">
//                   <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                   <input
//                     type="text"
//                     placeholder="Search..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 w-full sm:w-48 text-sm"
//                   />
//                 </div>
                
//                 {/* Filter Button */}
//                 <button
//                   onClick={() => setShowFilters(!showFilters)}
//                   className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
//                 >
//                   <Filter className="w-4 h-4" />
//                   <span className="sm:inline">Filter</span>
//                   <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
//                 </button>
//               </div>
//             </div>

//             {/* Filter Pills */}
//             {showFilters && (
//               <div className="mt-4 flex flex-wrap gap-2">
//                 {['all', 'pending', 'confirmed', 'completed', 'cancelled', 'no-show'].map((status) => (
//                   <button
//                     key={status}
//                     onClick={() => handleFilterClick(status)}
//                     className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-colors
//                       ${filterStatus === status 
//                         ? 'bg-gray-600 text-white' 
//                         : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
//                   >
//                     {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Table Content - Card Layout for Mobile */}
//           <div className="divide-y divide-gray-100">
//             {filteredAppointments.length === 0 ? (
//               <div className="px-4 sm:px-6 py-8 sm:py-12 text-center">
//                 <Calendar className="w-8 h-8 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-3 sm:mb-4" />
//                 <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
//                 <p className="text-sm sm:text-base text-gray-500">
//                   {searchTerm 
//                     ? "Try adjusting your search terms or filters" 
//                     : "No appointments match the selected criteria"}
//                 </p>
//               </div>
//             ) : (
//               filteredAppointments.map((item, index) => {
//                 const isExpanded = expandedCard === item._id;
                
//                 return (
//                   <div
//                     key={item._id || index}
//                     className="p-4 sm:p-6 hover:bg-gray-50 transition-colors"
//                   >
//                     {/* Mobile Card Layout */}
//                     <div className="block sm:hidden">
//                       <div className="flex items-start justify-between mb-3">
//                         <div className="flex-1 min-w-0">
//                           <h3 className="text-base font-semibold text-gray-900 truncate mb-1">
//                             {item.serviceTitle || item.services?.[0]?.serviceTitle || 'Service'}
//                           </h3>
//                           <p className="text-sm text-gray-600 mb-2">{item.userName}</p>
//                           <StatusBadge status={item.status} item={item} />
//                         </div>
//                         <button
//                           onClick={() => setExpandedCard(isExpanded ? null : item._id)}
//                           className="p-1 text-gray-400 hover:text-gray-600"
//                         >
//                           <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
//                         </button>
//                       </div>

//                       {/* Basic Info Always Visible */}
//                       <div className="text-sm text-gray-600 mb-3">
//                         <div className="flex items-center mb-1">
//                           <Calendar className="w-3 h-3 mr-2 text-gray-400" />
//                           <span>
//                             {slotDateFormat(item.date)} at {slotDateFormat(item.time)}
//                           </span>
//                         </div>
//                       </div>

//                       {/* Expandable Details */}
//                       {isExpanded && (
//                         <div className="space-y-3 mb-4">
//                           {/* Multi-service display */}
//                           {item.services && item.services.length > 1 && (
//                             <div>
//                               <p className="text-xs text-gray-500 mb-2">Additional Services:</p>
//                               <div className="flex flex-wrap gap-1">
//                                 {item.services.slice(1).map((service, idx) => (
//                                   <span key={idx} className="text-xs bg-gray-50 text-gray-700 px-2 py-1 rounded-full border border-gray-200">
//                                     {service.serviceTitle}
//                                   </span>
//                                 ))}
//                               </div>
//                             </div>
//                           )}
                          
//                           {/* Contact Info */}
//                           <div className="space-y-2 text-sm text-gray-600">
//                             <div className="flex items-center">
//                               <Mail className="w-3 h-3 mr-2 text-gray-400" />
//                               <span className="truncate">{item.userEmail}</span>
//                             </div>
//                             <div className="flex items-center">
//                               <Phone className="w-3 h-3 mr-2 text-gray-400" />
//                               <span>{item.userPhone}</span>
//                             </div>
//                             {item.clientNotes && (
//                               <div className="flex items-start">
//                                 <NotebookPen className="w-3 h-3 mr-2 text-gray-400 mt-0.5" />
//                                 <span className="text-xs">{item.clientNotes}</span>
//                               </div>
//                             )}
//                           </div>
                          
//                           {/* Payment Info */}
//                           {item.payment && (
//                             <div>
//                               <span className={`inline-flex items-center text-xs px-2 py-1 rounded-full font-medium ${
//                                 item.payment.status === 'paid' 
//                                   ? 'bg-green-50 text-green-700 border border-green-200'
//                                   : item.payment.status === 'failed'
//                                   ? 'bg-red-50 text-red-700 border border-red-200'
//                                   : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
//                               }`}>
//                                 <DollarSign className="w-3 h-3 mr-1" />
//                                 {item.payment.status.toUpperCase()} - ${item.payment.amount}
//                               </span>
//                             </div>
//                           )}
//                         </div>
//                       )}

//                       {/* Actions */}
//                       <div className="flex items-center gap-2 mt-3">
//                         {(item.status === 'cancelled' || item.status === 'completed' || item.status === 'no-show' || item.isCancelled || item.isCompleted) ? (
//                           <ActionButton
//                             onClick={() => navigate(`/appointments/${item._id}`)}
//                             icon={<Eye />}
//                             color="gray"
//                             title="View Details"
//                             compact={true}
//                           />
//                         ) : (
//                           <>
//                             {(item.status === 'pending' || (!item.status && !item.isCompleted && !item.isCancelled)) && (
//                               <ActionButton
//                                 onClick={() => handleConfirmAppointment(item._id)}
//                                 icon={<CheckCircle />}
//                                 color="gray"
//                                 title="Confirm"
//                                 disabled={loadingId === item._id}
//                                 loading={loadingId === item._id}
//                                 compact={true}
//                               />
//                             )}
                            
//                             <ActionButton
//                               onClick={() => handleCompleteAppointment(item._id)}
//                               icon={<Check />}
//                               color="green"
//                               title="Complete"
//                               disabled={loadingId === item._id}
//                               loading={loadingId === item._id}
//                               compact={true}
//                             />
                            
//                             <ActionButton
//                               onClick={() => handleCancelAppointment(item._id)}
//                               icon={<X />}
//                               color="red"
//                               title="Cancel"
//                               disabled={loadingId === item._id}
//                               loading={loadingId === item._id}
//                               compact={true}
//                             />
                            
//                             <ActionButton
//                               onClick={() => navigate(`/appointments/${item._id}`)}
//                               icon={<MoreVertical />}
//                               color="gray"
//                               title="More"
//                               compact={true}
//                             />
//                           </>
//                         )}
//                       </div>
//                     </div>

//                     {/* Desktop Layout */}
//                     <div className="hidden sm:block">
//                       <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
//                         {/* Main Info */}
//                         <div className="flex-1 min-w-0">
//                           <div className="flex items-center gap-3 mb-3">
//                             <h3 className="text-lg font-semibold text-gray-900 truncate">
//                               {item.serviceTitle || item.services?.[0]?.serviceTitle || 'Service'}
//                             </h3>
//                             <StatusBadge status={item.status} item={item} />
//                           </div>
                          
//                           {/* Multi-service display */}
//                           {item.services && item.services.length > 1 && (
//                             <div className="mb-3">
//                               <p className="text-sm text-gray-500 mb-2">Additional Services:</p>
//                               <div className="flex flex-wrap gap-2">
//                                 {item.services.slice(1).map((service, idx) => (
//                                   <span key={idx} className="text-sm bg-gray-50 text-gray-700 px-3 py-1 rounded-full border border-gray-200">
//                                     {service.serviceTitle}
//                                   </span>
//                                 ))}
//                               </div>
//                             </div>
//                           )}
                          
//                           {/* Customer & Schedule Info */}
//                           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
//                             <div className="flex items-center">
//                               <Users className="w-4 h-4 mr-2 text-gray-400" />
//                               <span className="font-medium">{item.userName}</span>
//                             </div>
//                             <div className="flex items-center">
//                               <Mail className="w-4 h-4 mr-2 text-gray-400" />
//                               <span className="truncate">{item.userEmail}</span>
//                             </div>
//                             <div className="flex items-center">
//                               <Phone className="w-4 h-4 mr-2 text-gray-400" />
//                               <span>{item.userPhone}</span>
//                             </div>
//                             {item.clientNotes && (
//                               <div className="flex items-center">
//                                 <NotebookPen className="w-4 h-4 mr-2 text-gray-400" />
//                                 <span className="truncate">{item.clientNotes}</span>
//                               </div>
//                             )}
//                             <div className="flex items-center">
//                               <Calendar className="w-4 h-4 mr-2 text-gray-400" />
//                               <span>
//                                 {slotDateFormat(item.date)} at {slotDateFormat(item.time)}
//                               </span>
//                             </div>
//                           </div>
                          
//                           {/* Payment Info */}
//                           {item.payment && (
//                             <div className="mt-3">
//                               <span className={`inline-flex items-center text-sm px-3 py-1 rounded-full font-medium ${
//                                 item.payment.status === 'paid' 
//                                   ? 'bg-green-50 text-green-700 border border-green-200'
//                                   : item.payment.status === 'failed'
//                                   ? 'bg-red-50 text-red-700 border border-red-200'
//                                   : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
//                               }`}>
//                                 <DollarSign className="w-4 h-4 mr-1" />
//                                 {item.payment.status.toUpperCase()} - ${item.payment.amount}
//                               </span>
//                             </div>
//                           )}
//                         </div>

//                         {/* Actions */}
//                         <div className="flex items-center gap-2">
//                           {(item.status === 'cancelled' || item.status === 'completed' || item.status === 'no-show' || item.isCancelled || item.isCompleted) ? (
//                             <div className="flex items-center gap-2">
//                               <ActionButton
//                                 onClick={() => navigate(`/appointments/${item._id}`)}
//                                 icon={<Eye />}
//                                 color="gray"
//                                 title="View Details"
//                               />
//                             </div>
//                           ) : (
//                             <div className="flex items-center gap-2">
//                               {(item.status === 'pending' || (!item.status && !item.isCompleted && !item.isCancelled)) && (
//                                 <ActionButton
//                                   onClick={() => handleConfirmAppointment(item._id)}
//                                   icon={<CheckCircle />}
//                                   color="gray"
//                                   title="Confirm Appointment"
//                                   disabled={loadingId === item._id}
//                                   loading={loadingId === item._id}
//                                 />
//                               )}
                              
//                               <ActionButton
//                                 onClick={() => handleCompleteAppointment(item._id)}
//                                 icon={<Check />}
//                                 color="green"
//                                 title="Mark as Completed"
//                                 disabled={loadingId === item._id}
//                                 loading={loadingId === item._id}
//                               />
                              
//                               <ActionButton
//                                 onClick={() => handleCancelAppointment(item._id)}
//                                 icon={<X />}
//                                 color="red"
//                                 title="Cancel Appointment"
//                                 disabled={loadingId === item._id}
//                                 loading={loadingId === item._id}
//                               />
                              
//                               <ActionButton
//                                 onClick={() => navigate(`/appointments/${item._id}`)}
//                                 icon={<MoreVertical />}
//                                 color="gray"
//                                 title="More Options"
//                               />
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Dashboard;
























import React, { useEffect, useContext, useState } from "react";
import { 
  Check, 
  Clock, 
  Users, 
  X, 
  Calendar, 
  Mail, 
  Phone, 
  Loader2, 
  CheckCircle, 
  XCircle, 
  Filter,
  TrendingUp,
  Search,
  MoreVertical,
  Eye,
  AlertCircle,
  DollarSign,
  Activity,
  Notebook,
  NotebookPen,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { AdminContexts } from "../context/AdminContexts";

const useNavigate = () => (path) => console.log(`Navigating to: ${path}`);

const Dashboard = () => {
  const {
    dashData,
    getDashData,
    slotDateFormat,
    cancelAppointment,
    completeAppointment,
    confirmAppointment,
    loadingId,
    appointments,
    getAllAppointments
  } = useContext(AdminContexts);

  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [expandedCard, setExpandedCard] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    getDashData();
    getAllAppointments();
  }, []);

  const handleCancelAppointment = async (appointmentId) => {
    try {
      await cancelAppointment(appointmentId);
      await Promise.all([getDashData(), getAllAppointments()]);
    } catch (error) {
      console.error('Error cancelling appointment:', error);
    }
  };

  const handleCompleteAppointment = async (appointmentId) => {
    try {
      await completeAppointment(appointmentId);
      await Promise.all([getDashData(), getAllAppointments()]);
    } catch (error) {
      console.error('Error completing appointment:', error);
    }
  };

  const handleConfirmAppointment = async (appointmentId) => {
    try {
      await confirmAppointment(appointmentId);
      await Promise.all([getDashData(), getAllAppointments()]);
    } catch (error) {
      console.error('Error confirming appointment:', error);
    }
  };


  
  const getFilteredAppointments = () => {
    let appointmentsToFilter = filterStatus === 'all' 
      ? dashData?.latestAppointments || []
      : appointments || [];

    if (filterStatus !== 'all') {
      appointmentsToFilter = appointmentsToFilter.filter(apt => apt.status === filterStatus);
    }

    if (searchTerm) {
      appointmentsToFilter = appointmentsToFilter.filter(apt => 
        apt.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.serviceTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.services?.some(service => 
          service.serviceTitle?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    return appointmentsToFilter;
  };

  const getStatusStats = () => {
    const stats = {
      completed: dashData?.completedAppointments || 0,
      pending: dashData?.pendingAppointments || 0,
      confirmed: dashData?.confirmedAppointments || 0,
      cancelled: dashData?.cancelledAppointments || 0,
      total: dashData?.totalAppointments || 0,
      revenue: dashData?.totalRevenue || 0,
      noShow: dashData?.noShowAppointments || 0
    };
    return stats;
  };

  const StatCard = ({ icon, value, label, bgColor, textColor, status, trend, onClick, isRevenue = false }) => (
    <div 
      className={`bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 transition-all duration-200 hover:shadow-md cursor-pointer hover:border-gray-300
        ${filterStatus === status ? 'ring-2 ring-gray-500 border-gray-500' : ''}`}
      onClick={() => onClick && onClick(status)}
    >
      <div className="flex items-center justify-between mb-2">
        <div className={`${bgColor} p-2 rounded-lg`}>
          {React.cloneElement(icon, {
            className: `${textColor} w-4 h-4 sm:w-5 sm:h-5`,
          })}
        </div>
        {trend && (
          <div className="flex items-center text-green-600 text-xs">
            <TrendingUp className="w-3 h-3 mr-1" />
            +{trend}%
          </div>
        )}
      </div>
      <div>
        <p className={`text-lg sm:text-xl font-bold ${textColor} mb-1`}>
          {isRevenue ? `${value?.toLocaleString() || 0}` : (value || 0)}
        </p>
        <p className="text-xs sm:text-sm text-gray-600">{label}</p>
      </div>
    </div>
  );

  const handleFilterClick = (status) => {
    setFilterStatus(status === filterStatus ? 'all' : status);
  };

  const StatusBadge = ({ status, item }) => {
    let actualStatus = status;
    if (item && !status) {
      if (item.isCompleted) actualStatus = 'completed';
      else if (item.isCancelled) actualStatus = 'cancelled';
      else actualStatus = 'pending';
    }

    const styles = {
      cancelled: "bg-red-50 text-red-700 border border-red-200",
      completed: "bg-green-50 text-green-700 border border-green-200",
      pending: "bg-yellow-50 text-yellow-700 border border-yellow-200",
      confirmed: "bg-gray-50 text-gray-700 border border-gray-200",
    };
    
    const displayText = {
      cancelled: 'Cancelled',
      completed: 'Completed',
      pending: 'Pending',
      confirmed: 'Confirmed'
    };
    
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[actualStatus]}`}>
        {displayText[actualStatus] || actualStatus}
      </span>
    );
  };

  const ActionButton = ({ onClick, icon, color, title, disabled = false, loading = false, compact = false }) => (
    <button
      onClick={onClick}
      className={`${compact ? 'p-1.5' : 'p-2'} rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-not-allowed
        ${color === 'red' ? 'text-red-600 border-red-200 hover:bg-red-50' :
          color === 'green' ? 'text-green-600 border-green-200 hover:bg-green-50' :
          color === 'gray' ? 'text-gray-600 border-gray-200 hover:bg-gray-50' :
          'text-gray-600 border-gray-200 hover:bg-gray-50'}`}
      disabled={disabled}
      title={title}
    >
      {loading ? <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" /> : 
       React.cloneElement(icon, { className: `w-3 h-3 sm:w-4 sm:h-4` })}
    </button>
  );

  if (!dashData) {
    return (
      <div className="p-4 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-48 mb-6" />
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm p-3 h-20" />
              ))}
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 h-48" />
          </div>
        </div>
      </div>
    );
  }

  const stats = getStatusStats();
  const filteredAppointments = getFilteredAppointments();

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col space-y-3">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Dashboard
              </h1>
              <p className="text-sm text-gray-600">
                Appointments and business performance
              </p>
            </div>
            {/* <button
              onClick={() => navigate('/appointments')}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
            >
              View All Appointments
            </button> */}
          </div>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <StatCard
            icon={<Activity />}
            value={stats.total}
            label="Total"
            bgColor="bg-purple-100"
            textColor="text-purple-600"
            status="all"
            trend={12}
            onClick={() => navigate('/appointments')}
          />
          <StatCard
            icon={<Clock />}
            value={stats.pending}
            label="Pending"
            bgColor="bg-yellow-100"
            textColor="text-yellow-600"
            status="pending"
            onClick={handleFilterClick}
          />
          <StatCard
            icon={<CheckCircle />}
            value={stats.confirmed}
            label="Confirmed"
            bgColor="bg-gray-100"
            textColor="text-gray-600"
            status="confirmed"
            onClick={handleFilterClick}
          />
          <StatCard
            icon={<Check />}
            value={stats.completed}
            label="Completed"
            bgColor="bg-green-100"
            textColor="text-green-600"
            status="completed"
            onClick={handleFilterClick}
          />
        </div>

        {/* Additional Stats Row */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <StatCard
            icon={<DollarSign />}
            value={stats.revenue}
            label="Revenue"
            bgColor="bg-emerald-100"
            textColor="text-emerald-600"
            isRevenue={true}
            trend={10}
          />
          <StatCard
            icon={<X />}
            value={stats.cancelled}
            label="Cancelled"
            bgColor="bg-red-100"
            textColor="text-red-600"
            status="cancelled"
            onClick={handleFilterClick}
          />
        </div>

        {/* Appointments Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Table Header */}
          <div className="border-b border-gray-200 p-4">
            <div className="flex flex-col space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <h2 className="text-base font-semibold text-gray-900">
                  Recent Appointments
                </h2>
                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                  {filteredAppointments.length}
                </span>
              </div>
              
              <div className="flex flex-col gap-2">
                {/* <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 w-full text-sm"
                  />
                </div> */}
                
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex w-30 items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                >
                  <Filter className="w-4 h-4" />
                  <span>Filter</span>
                  {showFilters ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Filter Pills */}
            {showFilters && (
              <div className="mt-3 flex flex-wrap gap-2">
                {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleFilterClick(status)}
                    className={`px-2 py-1 rounded-full text-xs font-medium transition-colors
                      ${filterStatus === status 
                        ? 'bg-gray-600 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Table Content */}
          <div className="divide-y divide-gray-100">
            {filteredAppointments.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <Calendar className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                <h3 className="text-sm font-medium text-gray-900 mb-1">No appointments</h3>
                <p className="text-xs text-gray-500">
                  {searchTerm 
                    ? "Try different search terms" 
                    : "No matching appointments"}
                </p>
              </div>
            ) : (
              filteredAppointments.map((item, index) => {
                const isExpanded = expandedCard === item._id;
                
                return (
                  <div
                    key={item._id || index}
                    className="p-4 hover:bg-gray-50 transition-colors"
                  >
                    {/* Mobile Card Layout */}
                    <div className="sm:hidden">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-sm font-semibold text-gray-900 truncate">
                              {item.serviceTitle || item.services?.[0]?.serviceTitle || 'Service'}
                            </h3>
                            <StatusBadge status={item.status} item={item} />
                          </div>
                          <p className="text-xs text-gray-600">{item.userName}</p>
                        </div>
                        <button
                          onClick={() => setExpandedCard(isExpanded ? null : item._id)}
                          className="p-1 text-gray-400 hover:text-gray-600"
                        >
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </button>
                      </div>

                      {/* Basic Info Always Visible */}
                      <div className="text-xs text-gray-600 mb-2">
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1 text-gray-400" />
                          <span>
                            {slotDateFormat(item.date)} • {slotDateFormat(item.time)}
                          </span>
                        </div>
                      </div>

                      {/* Expandable Details */}
                      {isExpanded && (
                        <div className="space-y-3 mb-3">
                          {/* Multi-service display */}
                          {item.services && item.services.length > 1 && (
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Additional:</p>
                              <div className="flex flex-wrap gap-1">
                                {item.services.slice(1).map((service, idx) => (
                                  <span key={idx} className="text-xs bg-gray-50 text-gray-700 px-2 py-0.5 rounded-full border border-gray-200">
                                    {service.serviceTitle}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* Contact Info */}
                          <div className="space-y-1 text-xs text-gray-600">
                            <div className="flex items-center">
                              <Mail className="w-3 h-3 mr-1 text-gray-400" />
                              <span className="truncate">{item.userEmail}</span>
                            </div>
                            <div className="flex items-center">
                              <Phone className="w-3 h-3 mr-1 text-gray-400" />
                              <span>{item.userPhone}</span>
                            </div>
                            {item.clientNotes && (
                              <div className="flex items-start">
                                <NotebookPen className="w-3 h-3 mr-1 text-gray-400 mt-0.5" />
                                <span className="text-xs">{item.clientNotes}</span>
                              </div>
                            )}
                          </div>
                          
                          {/* Payment Info */}
                          {item.payment && (
                            <div>
                              <span className={`inline-flex items-center text-xs px-2 py-0.5 rounded-full font-medium ${
                                item.payment.status === 'paid' 
                                  ? 'bg-green-50 text-green-700 border border-green-200'
                                  : item.payment.status === 'failed'
                                  ? 'bg-red-50 text-red-700 border border-red-200'
                                  : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                              }`}>
                                <DollarSign className="w-3 h-3 mr-1" />
                                {item.payment.status.toUpperCase()} - ${item.payment.amount}
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center justify-end gap-1 mt-2">
                        {(item.status === 'cancelled' || item.status === 'completed' || item.isCancelled || item.isCompleted) ? (
                          <ActionButton
                            onClick={() => navigate(`/appointments/${item._id}`)}
                            icon={<Eye />}
                            color="gray"
                            title="View"
                            compact={true}
                          />
                        ) : (
                          <>
                            {(item.status === 'pending' || (!item.status && !item.isCompleted && !item.isCancelled)) && (
                              <ActionButton
                                onClick={() => handleConfirmAppointment(item._id)}
                                icon={<CheckCircle />}
                                color="gray"
                                title="Confirm"
                                disabled={loadingId === item._id}
                                loading={loadingId === item._id}
                                compact={true}
                              />
                            )}
                            
                            <ActionButton
                              onClick={() => handleCompleteAppointment(item._id)}
                              icon={<Check />}
                              color="green"
                              title="Complete"
                              disabled={loadingId === item._id}
                              loading={loadingId === item._id}
                              compact={true}
                            />
                            
                            <ActionButton
                              onClick={() => handleCancelAppointment(item._id)}
                              icon={<X />}
                              color="red"
                              title="Cancel"
                              disabled={loadingId === item._id}
                              loading={loadingId === item._id}
                              compact={true}
                            />
                          </>
                        )}
                      </div>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden sm:block">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-sm font-semibold text-gray-900 truncate">
                              {item.serviceTitle || item.services?.[0]?.serviceTitle || 'Service'}
                            </h3>
                            <StatusBadge status={item.status} item={item} />
                          </div>
                          
                          {item.services && item.services.length > 1 && (
                            <div className="mb-2">
                              <div className="flex flex-wrap gap-1">
                                {item.services.slice(1).map((service, idx) => (
                                  <span key={idx} className="text-xs bg-gray-50 text-gray-700 px-2 py-0.5 rounded-full border border-gray-200">
                                    {service.serviceTitle}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                            <div className="flex items-center">
                              <Users className="w-3 h-3 mr-1 text-gray-400" />
                              <span>{item.userName}</span>
                            </div>
                            <div className="flex items-center">
                              <Mail className="w-3 h-3 mr-1 text-gray-400" />
                              <span className="truncate">{item.userEmail}</span>
                            </div>
                            <div className="flex items-center">
                              <Phone className="w-3 h-3 mr-1 text-gray-400" />
                              <span>{item.userPhone}</span>
                            </div>
                            <div className="flex items-center">
                              <Calendar className="w-3 h-3 mr-1 text-gray-400" />
                              <span>
                                {slotDateFormat(item.date)} • {slotDateFormat(item.time)}
                              </span>
                            </div>
                          </div>
                          
                          {item.payment && (
                            <div className="mt-2">
                              <span className={`inline-flex items-center text-xs px-2 py-0.5 rounded-full font-medium ${
                                item.payment.status === 'paid' 
                                  ? 'bg-green-50 text-green-700 border border-green-200'
                                  : item.payment.status === 'failed'
                                  ? 'bg-red-50 text-red-700 border border-red-200'
                                  : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                              }`}>
                                <DollarSign className="w-3 h-3 mr-1" />
                                {item.payment.status.toUpperCase()} - ${item.payment.amount}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-1">
                          {(item.status === 'cancelled' || item.status === 'completed' || item.isCancelled || item.isCompleted) ? (
                            <ActionButton
                              onClick={() => navigate(`/appointments/${item._id}`)}
                              icon={<Eye />}
                              color="gray"
                              title="View"
                              compact={true}
                            />
                          ) : (
                            <>
                              {(item.status === 'pending' || (!item.status && !item.isCompleted && !item.isCancelled)) && (
                                <ActionButton
                                  onClick={() => handleConfirmAppointment(item._id)}
                                  icon={<CheckCircle />}
                                  color="gray"
                                  title="Confirm"
                                  disabled={loadingId === item._id}
                                  loading={loadingId === item._id}
                                  compact={true}
                                />
                              )}
                              
                              <ActionButton
                                onClick={() => handleCompleteAppointment(item._id)}
                                icon={<Check />}
                                color="green"
                                title="Complete"
                                disabled={loadingId === item._id}
                                loading={loadingId === item._id}
                                compact={true}
                              />
                              
                              <ActionButton
                                onClick={() => handleCancelAppointment(item._id)}
                                icon={<X />}
                                color="red"
                                title="Cancel"
                                disabled={loadingId === item._id}
                                loading={loadingId === item._id}
                                compact={true}
                              />
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;