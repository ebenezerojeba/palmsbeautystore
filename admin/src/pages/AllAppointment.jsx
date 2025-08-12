// // import React, { useState, useContext, useEffect } from "react";
// // import {
// //   X,
// //   Check,
// //   Loader,
// //   Calendar,
// //   List,
// //   ChevronLeft,
// //   ChevronRight,
// //   Clock,
// //   User,
// //   Phone,
// //   Mail,
// //   Filter,
// //   Search,
// //   Download
// // } from "lucide-react";
// // import { AdminContexts } from "../context/AdminContexts";

// // const AllAppointments = () => {
// //   const {
// //     appointments,
// //     getAllAppointments,
// //     cancelAppointment,
// //     isCompleted,
// //     slotDateFormat,
// //     loadingStates
// //   } = useContext(AdminContexts);

// //   useEffect(() => {
// //     getAllAppointments();
// //   }, []);

// //   // State management
// //   const [view, setView] = useState('calendar');
// //   const [currentDate, setCurrentDate] = useState(new Date());
// //   const [selectedDate, setSelectedDate] = useState(null);
// //   const [searchTerm, setSearchTerm] = useState('');
// //   const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'pending', 'completed', 'cancelled'

// //   // Calendar functions
// //   const getDaysInMonth = (date) => {
// //     const year = date.getFullYear();
// //     const month = date.getMonth();
// //     const firstDay = new Date(year, month, 1);
// //     const lastDay = new Date(year, month + 1, 0);
// //     const daysInMonth = lastDay.getDate();
// //     const startingDayOfWeek = firstDay.getDay();

// //     const days = [];

// //     // Add empty cells for days before the first day of the month
// //     for (let i = 0; i < startingDayOfWeek; i++) {
// //       days.push(null);
// //     }

// //     // Add days of the month
// //     for (let day = 1; day <= daysInMonth; day++) {
// //       days.push(new Date(year, month, day));
// //     }

// //     return days;
// //   };

// //  const isSameDay = (d1, d2) => {
// //   const date1 = new Date(d1);
// //   const date2 = new Date(d2);
// //   return (
// //     date1.getFullYear() === date2.getFullYear() &&
// //     date1.getMonth() === date2.getMonth() &&
// //     date1.getDate() === date2.getDate()
// //   );
// // };

// // const getAppointmentsForDate = (date) => {
// //   if (!date) return [];
// //   return appointments.filter(apt => isSameDay(apt.date, date));
// // };


// //   const navigateMonth = (direction) => {
// //     setCurrentDate(prev => {
// //       const newDate = new Date(prev);
// //       newDate.setMonth(prev.getMonth() + direction);
// //       return newDate;
// //     });
// //   };

// //   // Filter appointments
// //   const filteredAppointments = appointments.filter(apt => {
// //     const matchesSearch = apt.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //       apt.serviceTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //       apt.userEmail.toLowerCase().includes(searchTerm.toLowerCase());

// //     const matchesStatus = statusFilter === 'all' ||
// //       (statusFilter === 'pending' && !apt.isCancelled && !apt.isCompleted) ||
// //       (statusFilter === 'completed' && apt.isCompleted) ||
// //       (statusFilter === 'cancelled' && apt.isCancelled);

// //     return matchesSearch && matchesStatus;
// //   });

// //   // Components
// //   const StatusBadge = ({ item }) => {
// //     if (item.isCompleted) {
// //       return <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Completed</span>;
// //     }
// //     if (item.isCancelled) {
// //       return <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">Cancelled</span>;
// //     }
// //     return <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">Pending</span>;
// //   };

// //   const ActionButton = ({ color, icon, onClick, label, disabled }) => (
// //     <button
// //       onClick={onClick}
// //       disabled={disabled}
// //       className={`flex items-center gap-2 px-3 py-1 text-xs border ${color} rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed`}
// //     >
// //       {icon}
// //       {label}
// //     </button>
// //   );

// //   const CalendarDay = ({ date, appointments: dayAppointments }) => {
// //     const isToday = date && date.toDateString() === new Date().toDateString();
// //     const isSelected = selectedDate && date && date.toDateString() === selectedDate.toDateString();

// //     return (
// //       <div
// //         className={`min-h-[100px] p-2 border border-gray-200 cursor-pointer hover:bg-gray-50 ${isToday ? 'bg-blue-50 border-blue-200' : ''
// //           } ${isSelected ? 'bg-blue-100 border-blue-300' : ''}`}
// //         onClick={() => date && setSelectedDate(date)}
// //       >
// //         {date && (
// //           <>
// //             <div className={`text-sm font-medium mb-1 ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
// //               {date.getDate()}
// //             </div>
// //             <div className="space-y-1">
// //               {dayAppointments.slice(0, 3).map((apt, idx) => (
// //                 <div
// //                   key={idx}
// //                   className={`text-xs p-1 rounded truncate ${apt.isCompleted ? 'bg-green-100 text-green-800' :
// //                       apt.isCancelled ? 'bg-red-100 text-red-800' :
// //                         'bg-blue-100 text-blue-800'
// //                     }`}
// //                   title={`${apt.time} - ${apt.userName}`}
// //                 >
// //                   {apt.time.split(' ')[0]} {apt.userName}
// //                 </div>
// //               ))}
// //               {dayAppointments.length > 3 && (
// //                 <div className="text-xs text-gray-500">
// //                   +{dayAppointments.length - 3} more
// //                 </div>
// //               )}
// //             </div>
// //           </>
// //         )}
// //       </div>
// //     );
// //   };

// //   const AppointmentDetails = ({ appointment }) => (
// //     <div className="bg-white border rounded-lg p-4 shadow-sm">
// //       <div className="flex justify-between items-start mb-
// //         <h3 className="font-semibold text-lg">{appointment.userName}</h3>
// //         <StatusBadge item={appointment} />
// //       </div>

// //       <div className="space-y-2 text-sm text-gray-600">
// //         <div className="flex items-center gap-2">
// //           <Clock className="w-4 h-4" />
// //           {appointment.time}
// //         </div>
// //         <div className="flex items-center gap-2">
// //           <User className="w-4 h-4" />
// //           {appointment.serviceTitle}
// //         </div>
// //         <div className="flex items-center gap-2">
// //           <Phone className="w-4 h-4" />
// //           {appointment.userPhone}
// //         </div>
// //         <div className="flex items-center gap-2">
// //           <Mail className="w-4 h-4" />
// //           {appointment.userEmail}
// //         </div>
// //       </div>

// //       {!appointment.isCancelled && !appointment.isCompleted && (
// //         <div className="flex gap-2 mt-4">
// //           <ActionButton
// //             color="border-red-400 text-red-600"
// //             icon={loadingStates.cancelOperation ?
// //               <Loader className="w-4 h-4 animate-spin" /> :
// //               <X className="w-4 h-4" />}
// //             onClick={() => cancelAppointment(appointment._id)}
// //             label={loadingStates.cancelOperation ? "Cancelling..." : "Cancel"}
// //             disabled={loadingStates.cancelOperation || loadingStates.completeOperation}
// //           />
// //           <ActionButton
// //             color="border-green-500 text-green-600"
// //             icon={loadingStates.completeOperation ?
// //               <Loader className="w-4 h-4 animate-spin" /> :
// //               <Check className="w-4 h-4" />}
// //             onClick={() => isCompleted(appointment._id)}
// //             label={loadingStates.completeOperation ? "Completing..." : "Complete"}
// //             disabled={loadingStates.cancelOperation || loadingStates.completeOperation}
// //           />
// //         </div>
// //       )}
// //     </div>
// //   );

// //   if (loadingStates.appointments) {
// //     return (
// //       <div className="w-full p-4 md:p-6">
// //         <div className="w-full max-w-7xl mx-auto">
// //           <div className="animate-pulse">
// //             <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
// //             <div className="h-10 bg-gray-200 rounded w-full mb-4"></div>
// //             <div className="grid grid-cols-7 gap-2">
// //               {[...Array(35)].map((_, i) => (
// //                 <div key={i} className="h-24 bg-gray-200 rounded"></div>
// //               ))}
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="w-full p-4 md:p-6 bg-gray-50 min-h-screen">
// //       <div className="w-full max-w-7xl mx-auto">
// //         {/* Header */}
// //         <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
// //           <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
// //             <h1 className="text-2xl font-bold text-gray-900">Appointment Management</h1>

// //             {/* View Toggle */}
// //             <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
// //               <button
// //                 onClick={() => setView('calendar')}
// //                 className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${view === 'calendar' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
// //                   }`}
// //               >
// //                 <Calendar className="w-4 h-4" />
// //                 Calendar
// //               </button>
// //               <button
// //                 onClick={() => setView('list')}
// //                 className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${view === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
// //                   }`}
// //               >
// //                 <List className="w-4 h-4" />
// //                 List
// //               </button>
// //             </div>
// //           </div>

// //           {/* Filters */}
// //           <div className="flex flex-wrap gap-4 mt-4">
// //             <div className="flex-1 min-w-[200px]">
// //               <div className="relative">
// //                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
// //                 <input
// //                   type="text"
// //                   placeholder="Search appointments..."
// //                   className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //                   value={searchTerm}
// //                   onChange={(e) => setSearchTerm(e.target.value)}
// //                 />
// //               </div>
// //             </div>

// //             <select
// //               className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //               value={statusFilter}
// //               onChange={(e) => setStatusFilter(e.target.value)}
// //             >
// //               <option value="all">All Status</option>
// //               <option value="pending">Pending</option>
// //               <option value="completed">Completed</option>
// //               <option value="cancelled">Cancelled</option>
// //             </select>

// //             <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
// //               <Download className="w-4 h-4" />
// //               Export
// //             </button>
// //           </div>
// //         </div>

// //         {/* Calendar View */}
// //         {view === 'calendar' && (
// //           <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
// //             <div className="xl:col-span-3">
// //               <div className="bg-white rounded-lg shadow-sm">
// //                 {/* Calendar Header */}
// //                 <div className="flex items-center justify-between p-6 border-b">
// //                   <h2 className="text-xl font-semibold">
// //                     {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
// //                   </h2>
// //                   <div className="flex gap-2">
// //                     <button
// //                       onClick={() => navigateMonth(-1)}
// //                       className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
// //                     >
// //                       <ChevronLeft className="w-5 h-5" />
// //                     </button>
// //                     <button
// //                       onClick={() => navigateMonth(1)}
// //                       className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
// //                     >
// //                       <ChevronRight className="w-5 h-5" />
// //                     </button>
// //                   </div>
// //                 </div>

// //                 {/* Calendar Grid */}
// //                 <div className="p-6">
// //                   {/* Days of week header */}
// //                   <div className="grid grid-cols-7 gap-1 mb-2">
// //                     {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
// //                       <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
// //                         {day}
// //                       </div>
// //                     ))}
// //                   </div>

// //                   {/* Calendar days */}
// //                   <div className="grid grid-cols-7 gap-1">
// //                     {getDaysInMonth(currentDate).map((date, index) => (
// //                       <CalendarDay
// //                         key={index}
// //                         date={date}
// //                         appointments={date ? getAppointmentsForDate(date) : []}
// //                       />
// //                     ))}
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>

// //             {/* Selected Date Details */}
// //             <div className="xl:col-span-1">
// //               <div className="bg-white rounded-lg shadow-sm p-6">
// //                 <h3 className="text-lg font-semibold mb-4">
// //                   {selectedDate ?
// //                     `Appointments for ${selectedDate.toLocaleDateString('en-US', {
// //                       weekday: 'long',
// //                       month: 'short',
// //                       day: 'numeric'
// //                     })}` :
// //                     'Select a date'
// //                   }
// //                 </h3>

// //                 {selectedDate && (
// //                   <div className="space-y-4">
// //                     {getAppointmentsForDate(selectedDate).length === 0 ? (
// //                       <p className="text-gray-500 text-center py-8">No appointments scheduled</p>
// //                     ) : (
// //                       getAppointmentsForDate(selectedDate).map((apt, idx) => (
// //                         <AppointmentDetails key={idx} appointment={apt} />
// //                       ))
// //                     )}
// //                   </div>
// //                 )}
// //               </div>
// //             </div>
// //           </div>
// //         )}

// //         {/* List View */}
// //         {view === 'list' && (
// //           <div className="bg-white rounded-lg shadow-sm overflow-hidden">
// //             <div className="overflow-x-auto">
// //               <table className="w-full">
// //                 <thead className="bg-gray-50">
// //                   <tr>
// //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                       Customer
// //                     </th>
// //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                       Service
// //                     </th>
// //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                       Date & Time
// //                     </th>
// //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                       Contact
// //                     </th>
// //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                       Status
// //                     </th>
// //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                       Actions
// //                     </th>
// //                   </tr>
// //                 </thead>
// //                 <tbody className="bg-white divide-y divide-gray-200">
// //                   {filteredAppointments.map((appointment, index) => (
// //                     <tr key={index} className="hover:bg-gray-50">
// //                       <td className="px-6 py-4">
// //                         <div>
// //                           <div className="text-sm font-medium text-gray-900">
// //                             {appointment.userName}
// //                           </div>
// //                           <div className="text-sm text-gray-500">
// //                             {appointment.userEmail}
// //                           </div>
// //                         </div>
// //                       </td>
// //                       <td className="px-6 py-4 text-sm text-gray-900">
// //                         {appointment.serviceTitle}
// //                       </td>
// //                       <td className="px-6 py-4 text-sm text-gray-900">
// //                         <div>{slotDateFormat(appointment.date)}</div>
// //                         <div className="text-gray-500">{appointment.time}</div>
// //                       </td>
// //                       <td className="px-6 py-4 text-sm text-gray-900">
// //                         {appointment.userPhone}
// //                       </td>
// //                       <td className="px-6 py-4">
// //                         <StatusBadge item={appointment} />
// //                       </td>
// //                       <td className="px-6 py-4">
// //                         {!appointment.isCancelled && !appointment.isCompleted && (
// //                           <div className="flex gap-2">
// //                             <ActionButton
// //                               color="border-red-400 text-red-600"
// //                               icon={loadingStates.cancelOperation ?
// //                                 <Loader className="w-4 h-4 animate-spin" /> :
// //                                 <X className="w-4 h-4" />}
// //                               onClick={() => cancelAppointment(appointment._id)}
// //                               label="Cancel"
// //                               disabled={loadingStates.cancelOperation || loadingStates.completeOperation}
// //                             />
// //                             <ActionButton
// //                               color="border-green-500 text-green-600"
// //                               icon={loadingStates.completeOperation ?
// //                                 <Loader className="w-4 h-4 animate-spin" /> :
// //                                 <Check className="w-4 h-4" />}
// //                               onClick={() => isCompleted(appointment._id)}
// //                               label="Complete"
// //                               disabled={loadingStates.cancelOperation || loadingStates.completeOperation}
// //                             />
// //                           </div>
// //                         )}
// //                       </td>
// //                     </tr>
// //                   ))}
// //                 </tbody>
// //               </table>
// //             </div>

// //             {filteredAppointments.length === 0 && (
// //               <div className="text-center py-12">
// //                 <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
// //                 <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
// //                 <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
// //               </div>
// //             )}
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default AllAppointments;

























// import React, { useState, useContext, useEffect } from "react";
// import {
//   X,
//   Check,
//   Loader,
//   Calendar,
//   List,
//   ChevronLeft,
//   ChevronRight,
//   Clock,
//   User,
//   Phone,
//   Mail,
//   Filter,
//   Search,
//   Download
// } from "lucide-react";
// import { AdminContexts } from "../context/AdminContexts";

// const AllAppointments = () => {
//   const {
//     appointments,
//     getAllAppointments,
//     cancelAppointment,
//     isCompleted,
//     slotDateFormat,
//     loadingStates
//   } = useContext(AdminContexts);

//   useEffect(() => {
//     getAllAppointments();
//   }, []);

//   // State management
//   const [view, setView] = useState('calendar');
//   const [currentDate, setCurrentDate] = useState(new Date());
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('all');

//   // Enhanced handlers that refresh data after operation
//   const handleCancelAppointment = async (appointmentId) => {
//     try {
//       await cancelAppointment(appointmentId);
//       // Refresh the appointments list after successful cancellation
//       await getAllAppointments();
//     } catch (error) {
//       console.error('Error cancelling appointment:', error);
//     }
//   };

//   const handleCompleteAppointment = async (appointmentId) => {
//     try {
//       await isCompleted(appointmentId);
//       // Refresh the appointments list after successful completion
//       await getAllAppointments();
//     } catch (error) {
//       console.error('Error completing appointment:', error);
//     }
//   };

//   // Calendar functions
//   const getDaysInMonth = (date) => {
//     const year = date.getFullYear();
//     const month = date.getMonth();
//     const firstDay = new Date(year, month, 1);
//     const lastDay = new Date(year, month + 1, 0);
//     const daysInMonth = lastDay.getDate();
//     const startingDayOfWeek = firstDay.getDay();

//     const days = [];

//     // Add empty cells for days before the first day of the month
//     for (let i = 0; i < startingDayOfWeek; i++) {
//       days.push(null);
//     }

//     // Add days of the month
//     for (let day = 1; day <= daysInMonth; day++) {
//       days.push(new Date(year, month, day));
//     }

//     return days;
//   };

//  const isSameDay = (d1, d2) => {
//   const date1 = new Date(d1);
//   const date2 = new Date(d2);
//   return (
//     date1.getFullYear() === date2.getFullYear() &&
//     date1.getMonth() === date2.getMonth() &&
//     date1.getDate() === date2.getDate()
//   );
// };

// const getAppointmentsForDate = (date) => {
//   if (!date) return [];
//   return appointments.filter(apt => isSameDay(apt.date, date));
// };

//   const navigateMonth = (direction) => {
//     setCurrentDate(prev => {
//       const newDate = new Date(prev);
//       newDate.setMonth(prev.getMonth() + direction);
//       return newDate;
//     });
//   };

//   // Filter appointments
//   const filteredAppointments = appointments.filter(apt => {
//     const matchesSearch = apt.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       apt.serviceTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       apt.userEmail.toLowerCase().includes(searchTerm.toLowerCase());

//     const matchesStatus = statusFilter === 'all' ||
//       (statusFilter === 'pending' && !apt.isCancelled && !apt.isCompleted) ||
//       (statusFilter === 'completed' && apt.isCompleted) ||
//       (statusFilter === 'cancelled' && apt.isCancelled);

//     return matchesSearch && matchesStatus;
//   });

//   // Components
//   const StatusBadge = ({ item }) => {
//     if (item.isCompleted) {
//       return <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Completed</span>;
//     }
//     if (item.isCancelled) {
//       return <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">Cancelled</span>;
//     }
//     return <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">Pending</span>;
//   };

//   const ActionButton = ({ color, icon, onClick, label, disabled }) => (
//     <button
//       onClick={onClick}
//       disabled={disabled}
//       className={`flex items-center gap-2 px-3 py-1 text-xs border ${color} rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all`}
//     >
//       {icon}
//       {label}
//     </button>
//   );

//   const CalendarDay = ({ date, appointments: dayAppointments }) => {
//     const isToday = date && date.toDateString() === new Date().toDateString();
//     const isSelected = selectedDate && date && date.toDateString() === selectedDate.toDateString();

//     return (
//       <div
//         className={`min-h-[100px] p-2 border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${isToday ? 'bg-blue-50 border-blue-200' : ''
//           } ${isSelected ? 'bg-blue-100 border-blue-300' : ''}`}
//         onClick={() => date && setSelectedDate(date)}
//       >
//         {date && (
//           <>
//             <div className={`text-sm font-medium mb-1 ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
//               {date.getDate()}
//             </div>
//             <div className="space-y-1">
//               {dayAppointments.slice(0, 3).map((apt, idx) => (
//                 <div
//                   key={idx}
//                   className={`text-xs p-1 rounded truncate ${apt.isCompleted ? 'bg-green-100 text-green-800' :
//                       apt.isCancelled ? 'bg-red-100 text-red-800' :
//                         'bg-blue-100 text-blue-800'
//                     }`}
//                   title={`${apt.time} - ${apt.userName}`}
//                 >
//                   {apt.time.split(' ')[0]} {apt.userName}
//                 </div>
//               ))}
//               {dayAppointments.length > 3 && (
//                 <div className="text-xs text-gray-500">
//                   +{dayAppointments.length - 3} more
//                 </div>
//               )}
//             </div>
//           </>
//         )}
//       </div>
//     );
//   };

//   const AppointmentDetails = ({ appointment }) => (
//     <div className="bg-white border rounded-lg p-4 shadow-sm">
//       <div className="flex justify-between items-start mb-3">
//         <h3 className="font-semibold text-lg">{appointment.userName}</h3>
//         <StatusBadge item={appointment} />
//       </div>

//       <div className="space-y-2 text-sm text-gray-600">
//         <div className="flex items-center gap-2">
//           <Clock className="w-4 h-4" />
//           {appointment.time}
//         </div>
//         <div className="flex items-center gap-2">
//           <User className="w-4 h-4" />
//           {appointment.serviceTitle}
//         </div>
//         <div className="flex items-center gap-2">
//           <Phone className="w-4 h-4" />
//           {appointment.userPhone}
//         </div>
//         <div className="flex items-center gap-2">
//           <Mail className="w-4 h-4" />
//           {appointment.userEmail}
//         </div>
//       </div>

//       {!appointment.isCancelled && !appointment.isCompleted && (
//         <div className="flex gap-2 mt-4">
//           <ActionButton
//             color="border-red-400 text-red-600"
//             icon={loadingStates.cancelOperation ?
//               <Loader className="w-4 h-4 animate-spin" /> :
//               <X className="w-4 h-4" />}
//             onClick={() => handleCancelAppointment(appointment._id)}
//             label={loadingStates.cancelOperation ? "Cancelling..." : "Cancel"}
//             disabled={loadingStates.cancelOperation || loadingStates.completeOperation}
//           />
//           <ActionButton
//             color="border-green-500 text-green-600"
//             icon={loadingStates.completeOperation ?
//               <Loader className="w-4 h-4 animate-spin" /> :
//               <Check className="w-4 h-4" />}
//             onClick={() => handleCompleteAppointment(appointment._id)}
//             label={loadingStates.completeOperation ? "Completing..." : "Complete"}
//             disabled={loadingStates.cancelOperation || loadingStates.completeOperation}
//           />
//         </div>
//       )}
//     </div>
//   );

//   if (loadingStates.appointments) {
//     return (
//       <div className="w-full p-4 md:p-6">
//         <div className="w-full max-w-7xl mx-auto">
//           <div className="animate-pulse">
//             <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
//             <div className="h-10 bg-gray-200 rounded w-full mb-4"></div>
//             <div className="grid grid-cols-7 gap-2">
//               {[...Array(35)].map((_, i) => (
//                 <div key={i} className="h-24 bg-gray-200 rounded"></div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full p-4 md:p-6 bg-gray-50 min-h-screen">
//       <div className="w-full max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
//           <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
//             <h1 className="text-2xl font-bold text-gray-900">Appointment Management</h1>

//             {/* View Toggle */}
//             <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
//               <button
//                 onClick={() => setView('calendar')}
//                 className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${view === 'calendar' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
//                   }`}
//               >
//                 <Calendar className="w-4 h-4" />
//                 Calendar
//               </button>
//               <button
//                 onClick={() => setView('list')}
//                 className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${view === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
//                   }`}
//               >
//                 <List className="w-4 h-4" />
//                 List
//               </button>
//             </div>
//           </div>

//           {/* Filters */}
//           <div className="flex flex-wrap gap-4 mt-4">
//             <div className="flex-1 min-w-[200px]">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                 <input
//                   type="text"
//                   placeholder="Search appointments..."
//                   className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>
//             </div>

//             <select
//               className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//               value={statusFilter}
//               onChange={(e) => setStatusFilter(e.target.value)}
//             >
//               <option value="all">All Status</option>
//               <option value="pending">Pending</option>
//               <option value="completed">Completed</option>
//               <option value="cancelled">Cancelled</option>
//             </select>

//             <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
//               <Download className="w-4 h-4" />
//               Export
//             </button>
//           </div>
//         </div>

//         {/* Calendar View */}
//         {view === 'calendar' && (
//           <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
//             <div className="xl:col-span-3">
//               <div className="bg-white rounded-lg shadow-sm">
//                 {/* Calendar Header */}
//                 <div className="flex items-center justify-between p-6 border-b">
//                   <h2 className="text-xl font-semibold">
//                     {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
//                   </h2>
//                   <div className="flex gap-2">
//                     <button
//                       onClick={() => navigateMonth(-1)}
//                       className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//                     >
//                       <ChevronLeft className="w-5 h-5" />
//                     </button>
//                     <button
//                       onClick={() => navigateMonth(1)}
//                       className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//                     >
//                       <ChevronRight className="w-5 h-5" />
//                     </button>
//                   </div>
//                 </div>

//                 {/* Calendar Grid */}
//                 <div className="p-6">
//                   {/* Days of week header */}
//                   <div className="grid grid-cols-7 gap-1 mb-2">
//                     {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
//                       <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
//                         {day}
//                       </div>
//                     ))}
//                   </div>

//                   {/* Calendar days */}
//                   <div className="grid grid-cols-7 gap-1">
//                     {getDaysInMonth(currentDate).map((date, index) => (
//                       <CalendarDay
//                         key={index}
//                         date={date}
//                         appointments={date ? getAppointmentsForDate(date) : []}
//                       />
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Selected Date Details */}
//             <div className="xl:col-span-1">
//               <div className="bg-white rounded-lg shadow-sm p-6">
//                 <h3 className="text-lg font-semibold mb-4">
//                   {selectedDate ?
//                     `Appointments for ${selectedDate.toLocaleDateString('en-US', {
//                       weekday: 'long',
//                       month: 'short',
//                       day: 'numeric'
//                     })}` :
//                     'Select a date'
//                   }
//                 </h3>

//                 {selectedDate && (
//                   <div className="space-y-4">
//                     {getAppointmentsForDate(selectedDate).length === 0 ? (
//                       <p className="text-gray-500 text-center py-8">No appointments scheduled</p>
//                     ) : (
//                       getAppointmentsForDate(selectedDate).map((apt, idx) => (
//                         <AppointmentDetails key={idx} appointment={apt} />
//                       ))
//                     )}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* List View */}
//         {view === 'list' && (
//           <div className="bg-white rounded-lg shadow-sm overflow-hidden">
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Customer
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Service
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Date & Time
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Contact
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Status
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {filteredAppointments.map((appointment, index) => (
//                     <tr key={index} className="hover:bg-gray-50 transition-colors">
//                       <td className="px-6 py-4">
//                         <div>
//                           <div className="text-sm font-medium text-gray-900">
//                             {appointment.userName}
//                           </div>
//                           <div className="text-sm text-gray-500">
//                             {appointment.userEmail}
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 text-sm text-gray-900">
//                         {appointment.serviceTitle}
//                       </td>
//                       <td className="px-6 py-4 text-sm text-gray-900">
//                         <div>{slotDateFormat(appointment.date)}</div>
//                         <div className="text-gray-500">{appointment.time}</div>
//                       </td>
//                       <td className="px-6 py-4 text-sm text-gray-900">
//                         {appointment.userPhone}
//                       </td>
//                       <td className="px-6 py-4">
//                         <StatusBadge item={appointment} />
//                       </td>
//                       <td className="px-6 py-4">
//                         {!appointment.isCancelled && !appointment.isCompleted && (
//                           <div className="flex gap-2">
//                             <ActionButton
//                               color="border-red-400 text-red-600"
//                               icon={loadingStates.cancelOperation ?
//                                 <Loader className="w-4 h-4 animate-spin" /> :
//                                 <X className="w-4 h-4" />}
//                               onClick={() => handleCancelAppointment(appointment._id)}
//                               label="Cancel"
//                               disabled={loadingStates.cancelOperation || loadingStates.completeOperation}
//                             />
//                             <ActionButton
//                               color="border-green-500 text-green-600"
//                               icon={loadingStates.completeOperation ?
//                                 <Loader className="w-4 h-4 animate-spin" /> :
//                                 <Check className="w-4 h-4" />}
//                               onClick={() => handleCompleteAppointment(appointment._id)}
//                               label="Complete"
//                               disabled={loadingStates.cancelOperation || loadingStates.completeOperation}
//                             />
//                           </div>
//                         )}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             {filteredAppointments.length === 0 && (
//               <div className="text-center py-12">
//                 <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
//                 <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
//                 <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AllAppointments;

import React, { useState, useContext, useEffect } from "react";
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
  Filter,
  Search,
  Download,
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
    completeAppointment, // Use the correct function name
    slotDateFormat,
    loadingStates,
    loadingId // Use loadingId from context
  } = useContext(AdminContexts);

  useEffect(() => {
    getAllAppointments();
  }, []);

  // State management
  const [view, setView] = useState('list');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Color palette for appointments
  const appointmentColors = [
    'bg-blue-100 text-blue-800 border-blue-200',
    'bg-purple-100 text-purple-800 border-purple-200',
    'bg-pink-100 text-pink-800 border-pink-200',
    'bg-indigo-100 text-indigo-800 border-indigo-200',
    'bg-cyan-100 text-cyan-800 border-cyan-200',
    'bg-teal-100 text-teal-800 border-teal-200',
    'bg-emerald-100 text-emerald-800 border-emerald-200',
    'bg-lime-100 text-lime-800 border-lime-200',
    'bg-amber-100 text-amber-800 border-amber-200',
    'bg-orange-100 text-orange-800 border-orange-200',
    'bg-rose-100 text-rose-800 border-rose-200',
    'bg-violet-100 text-violet-800 border-violet-200'
  ];

  // Function to get consistent color for an appointment
  const getAppointmentColor = (appointmentId, status) => {
    if (status === 'completed') return 'bg-green-100 text-green-800 border-green-200';
    if (status === 'cancelled') return 'bg-red-100 text-red-800 border-red-200';
    if (status === 'confirmed') return 'bg-blue-100 text-blue-800 border-blue-200';
    if (status === 'no-show') return 'bg-gray-100 text-gray-800 border-gray-200';
    
    // Use appointment ID to generate consistent color for pending appointments
    const colorIndex = appointmentId ? appointmentId.length % appointmentColors.length : 0;
    return appointmentColors[colorIndex];
  };

  // Simplified handlers using context functions directly
  const handleCancelAppointment = async (appointmentId) => {
    try {
      await cancelAppointment(appointmentId);
      // The context will handle all state updates automatically
    } catch (error) {
      console.error('Error cancelling appointment:', error);
    }
  };

  const handleCompleteAppointment = async (appointmentId) => {
    try {
      await completeAppointment(appointmentId);
      // The context will handle all state updates automatically
    } catch (error) {
      console.error('Error completing appointment:', error);
    }
  };

  // Calendar functions
  const getDaysInMonth = (date) => {
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
  };

  const isSameDay = (d1, d2) => {
    const date1 = new Date(d1);
    const date2 = new Date(d2);
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const getAppointmentsForDate = (date) => {
    if (!date) return [];
    return appointments.filter(apt => isSameDay(apt.date, date));
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  // Filter appointments using the status field from your updated backend
  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = apt.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.serviceTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.userPhone.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' ||
      (statusFilter === 'pending' && (!apt.status || apt.status === 'pending')) ||
      (statusFilter === 'completed' && apt.status === 'completed') ||
      (statusFilter === 'cancelled' && apt.status === 'cancelled');

    return matchesSearch && matchesStatus;
  });

  // Updated StatusBadge component to use the status field
  const StatusBadge = ({ item }) => {
    // Support both old and new status format for backward compatibility
    const status = item.status || (item.isCompleted ? 'completed' : item.isCancelled ? 'cancelled' : 'pending');
    
    if (status === 'completed') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full font-medium">
          <CheckCircle2 className="w-3 h-3" />
          Completed
        </span>
      );
    }
    if (status === 'cancelled') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full font-medium">
          <XCircle className="w-3 h-3" />
          Cancelled
        </span>
      );
    }
    if (status === 'confirmed') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full font-medium">
          <CheckCircle2 className="w-3 h-3" />
          Confirmed
        </span>
      );
    }
    if (status === 'no-show') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full font-medium">
          <XCircle className="w-3 h-3" />
          No Show
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-amber-100 text-amber-800 rounded-full font-medium">
        <AlertCircle className="w-3 h-3" />
        Pending
      </span>
    );
  };

  const ActionButton = ({ color, icon, onClick, label, disabled, appointmentId, action }) => {
    const isProcessing = loadingId === appointmentId;
    
    return (
      <button
        onClick={onClick}
        disabled={disabled || isProcessing}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border ${color} rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1`}
      >
        {isProcessing ? <Loader className="w-3 h-3 animate-spin" /> : icon}
        <span className="hidden sm:inline">{isProcessing ? `${action}ing...` : label}</span>
      </button>
    );
  };

  const CalendarDay = ({ date, appointments: dayAppointments }) => {
    const isToday = date && date.toDateString() === new Date().toDateString();
    const isSelected = selectedDate && date && date.toDateString() === selectedDate.toDateString();

    return (
      <div
        className={`min-h-[80px] sm:min-h-[100px] p-1 sm:p-2 border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${
          isToday ? 'bg-blue-50 border-blue-200' : ''
        } ${isSelected ? 'bg-blue-100 border-blue-300' : ''}`}
        onClick={() => date && setSelectedDate(date)}
      >
        {date && (
          <>
            <div className={`text-xs sm:text-sm font-medium mb-1 ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
              {date.getDate()}
            </div>
            <div className="space-y-0.5 sm:space-y-1">
              {dayAppointments.slice(0, 2).map((apt, idx) => {
                const status = apt.status || (apt.isCompleted ? 'completed' : apt.isCancelled ? 'cancelled' : 'pending');
                const colorClass = getAppointmentColor(apt._id, status);
                return (
                  <div
                    key={idx}
                    className={`text-xs p-1 sm:p-1.5 rounded-md border ${colorClass} transition-colors`}
                    title={`${apt.time} - ${apt.userName} - ${apt.serviceTitle}`}
                  >
                    <div className="font-bold text-xs sm:text-sm truncate mb-0.5">
                      {apt.userName}
                    </div>
                    <div className="font-semibold text-xs truncate">
                      {apt.serviceTitle}
                    </div>
                  </div>
                );
              })}
              {dayAppointments.length > 2 && (
                <div className="text-xs text-gray-500 font-medium">
                  +{dayAppointments.length - 2} more
                </div>
              )}
            </div>
          </>
        )}
      </div>
    );
  };

  const AppointmentCard = ({ appointment }) => {
    // Support both old and new status format
    const status = appointment.status || (appointment.isCompleted ? 'completed' : appointment.isCancelled ? 'cancelled' : 'pending');
    const canTakeAction = status === 'pending' || (!appointment.status && !appointment.isCancelled && !appointment.isCompleted);

    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-gray-900 truncate">{appointment.userName}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
              <Phone className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{appointment.userPhone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 mt-1 sm:hidden">
              <Mail className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{appointment.userEmail}</span>
            </div>
          </div>
          <div className="flex-shrink-0">
            <StatusBadge item={appointment} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 flex-shrink-0" />
            <span>{appointment.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{appointment.serviceTitle}</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 sm:col-span-2">
            <Mail className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{appointment.userEmail}</span>
          </div>
        </div>

        {canTakeAction && (
          <div className="flex gap-2">
            <ActionButton
              color="border-red-400 text-red-600 focus:ring-red-500"
              icon={<X className="w-3 h-3" />}
              onClick={() => handleCancelAppointment(appointment._id)}
              label="Cancel"
              appointmentId={appointment._id}
              action="cancel"
              disabled={loadingId === appointment._id}
            />
            <ActionButton
              color="border-green-500 text-green-600 focus:ring-green-500"
              icon={<Check className="w-3 h-3" />}
              onClick={() => handleCompleteAppointment(appointment._id)}
              label="Complete"
              appointmentId={appointment._id}
              action="complete"
              disabled={loadingId === appointment._id}
            />
          </div>
        )}
      </div>
    );
  };

  if (loadingStates.appointments) {
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

  return (
    <div className="w-full p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="w-full max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Appointment Management</h1>

              {/* View Toggle */}
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

            {/* Filters */}
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
                  <option value="pending">Pending</option>
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
                {/* Calendar Header */}
                <div className="flex items-center justify-between p-4 sm:p-6 border-b">
                  <h2 className="text-lg sm:text-xl font-semibold">
                    {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </h2>
                  <div className="flex gap-1">
                    <button
                      onClick={() => navigateMonth(-1)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => navigateMonth(1)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Calendar Grid */}
                <div className="p-4 sm:p-6">
                  {/* Days of week header */}
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                      <div key={day} className="p-1 sm:p-2 text-center text-xs sm:text-sm font-medium text-gray-500">
                        <span className="sm:hidden">{day[0]}</span>
                        <span className="hidden sm:inline">{day}</span>
                      </div>
                    ))}
                  </div>

                  {/* Calendar days */}
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

            {/* Selected Date Details */}
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
                      getAppointmentsForDate(selectedDate).map((apt, idx) => (
                        <AppointmentCard key={idx} appointment={apt} />
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
            {/* Mobile Cards */}
            <div className="block sm:hidden">
              {filteredAppointments.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
                  <p className="text-gray-500 text-sm">Try adjusting your search or filter criteria.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredAppointments.map((appointment, index) => (
                    <div key={index} className="p-4">
                      <AppointmentCard appointment={appointment} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Desktop Table */}
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
                  {filteredAppointments.map((appointment, index) => {
                    const status = appointment.status || (appointment.isCompleted ? 'completed' : appointment.isCancelled ? 'cancelled' : 'pending');
                    const canTakeAction = status === 'pending' || (!appointment.status && !appointment.isCancelled && !appointment.isCompleted);

                    return (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {appointment.userName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {appointment.userEmail}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {appointment.serviceTitle}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div>{slotDateFormat(appointment.date)}</div>
                          <div className="text-gray-500">{appointment.time}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {appointment.userPhone}
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge item={appointment} />
                        </td>
                        <td className="px-6 py-4">
                          {canTakeAction && (
                            <div className="flex gap-2">
                              <ActionButton
                                color="border-red-400 text-red-600 focus:ring-red-500"
                                icon={<X className="w-3 h-3" />}
                                onClick={() => handleCancelAppointment(appointment._id)}
                                label="Cancel"
                                appointmentId={appointment._id}
                                action="cancel"
                                disabled={loadingId === appointment._id}
                              />
                              <ActionButton
                                color="border-green-500 text-green-600 focus:ring-green-500"
                                icon={<Check className="w-3 h-3" />}
                                onClick={() => handleCompleteAppointment(appointment._id)}
                                label="Complete"
                                appointmentId={appointment._id}
                                action="complete"
                                disabled={loadingId === appointment._id}
                              />
                            </div>
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