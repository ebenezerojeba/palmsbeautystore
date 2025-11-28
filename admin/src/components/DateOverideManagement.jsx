// // import React, { useState } from 'react';
// // import { Calendar, X, Plus, Clock, Trash2, AlertCircle } from 'lucide-react';

// // const DateOverrideManagement = ({
// //     provider,
// //     onUpdateDateOverrides,
// //     onBack
// // }) => {
// //     const [dateOverrides, setDateOverrides] = useState(provider.dateOverrides || []);
// //     const [showAddForm, setShowAddForm] = useState(false);
// //     const [newOverride, setNewOverride] = useState({
// //         date: '',
// //         isClosed: false,
// //         customHours: { startTime: '', endTime: '' },
// //         blockedTimeSlots: []
// //     });
// //     const [isSaving, setIsSaving] = useState(false);

// //     // Add new blocked time slot to the form
// //     const addBlockedTimeSlot = () => {
// //         setNewOverride(prev => ({
// //             ...prev,
// //             blockedTimeSlots: [
// //                 ...prev.blockedTimeSlots,
// //                 { startTime: '', endTime: '', reason: '' }
// //             ]
// //         }));
// //     };

// //     // Remove blocked time slot from form
// //     const removeBlockedTimeSlot = (index) => {
// //         setNewOverride(prev => ({
// //             ...prev,
// //             blockedTimeSlots: prev.blockedTimeSlots.filter((_, i) => i !== index)
// //         }));
// //     };

// //     // Update blocked time slot in form
// //     const updateBlockedTimeSlot = (index, field, value) => {
// //         setNewOverride(prev => ({
// //             ...prev,
// //             blockedTimeSlots: prev.blockedTimeSlots.map((slot, i) =>
// //                 i === index ? { ...slot, [field]: value } : slot
// //             )
// //         }));
// //     };

// //     // Add new override to list
// //     const handleAddOverride = () => {
// //         if (!newOverride.date) {
// //             alert('Please select a date');
// //             return;
// //         }

// //         // Check if date already has an override
// //         const existingIndex = dateOverrides.findIndex(o => o.date === newOverride.date);

// //         if (existingIndex >= 0) {
// //             // Update existing override
// //             const updated = [...dateOverrides];
// //             updated[existingIndex] = { ...newOverride, createdAt: new Date() };
// //             setDateOverrides(updated);
// //         } else {
// //             // Add new override
// //             setDateOverrides([...dateOverrides, { ...newOverride, createdAt: new Date() }]);
// //         }

// //         // Reset form
// //         setNewOverride({
// //             date: '',
// //             isClosed: false,
// //             customHours: { startTime: '', endTime: '' },
// //             blockedTimeSlots: []
// //         });
// //         setShowAddForm(false);
// //     };

// //     // Remove override
// //     const handleRemoveOverride = (date) => {
// //         setDateOverrides(dateOverrides.filter(o => o.date !== date));
// //     };

// //     // Save all overrides
// //     const handleSave = async () => {
// //         setIsSaving(true);
// //         try {
// //             await onUpdateDateOverrides(provider._id, dateOverrides);
// //         } catch (error) {
// //             console.error('Error saving date overrides:', error);
// //         } finally {
// //             setIsSaving(false);
// //         }
// //     };

// //     // Format date for display
// //     const formatDateDisplay = (dateStr) => {
// //         const date = new Date(dateStr + 'T00:00:00');
// //         return date.toLocaleDateString('en-US', {
// //             weekday: 'long',
// //             year: 'numeric',
// //             month: 'long',
// //             day: 'numeric'
// //         });
// //     };

// //     // Sort overrides by date
// //     const sortedOverrides = [...dateOverrides].sort((a, b) =>
// //         new Date(a.date) - new Date(b.date)
// //     );

// //     return (
// //         <div className="bg-white rounded-xl shadow-sm border border-gray-200">
// //             {/* Header */}
// //             <div className="p-4 sm:p-6 border-b border-gray-200">
// //                 <div className="flex items-center justify-between">
// //                     <button
// //                         onClick={onBack}
// //                         className="text-gray-600 hover:text-gray-700 font-medium text-sm"
// //                     >
// //                         ← Back
// //                     </button>
// //                     <h2 className="text-xl font-semibold text-gray-900">
// //                         Date Overrides for {provider.name}
// //                     </h2>
// //                     <div className="w-16"></div>
// //                 </div>
// //             </div>

// //             <div className="p-6 space-y-6">
// //                 {/* Info Alert */}
// //                 <div className="bg-green-50 border border-blue-200 rounded-lg p-4 flex items-start space-x-3">
// //                     <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
// //                     <div className="text-sm text-blue-800">
// //                         <p className="font-medium mb-1">How Date Overrides Work:</p>
// //                         <ul className="list-disc list-inside space-y-1 text-blue-700">
// //                             <li>Block entire days (e.g., holidays, vacation days)</li>
// //                             <li>Set custom hours for specific dates (e.g., early closing)</li>
// //                             <li>Block specific time slots (e.g., meetings, breaks)</li>
// //                             <li>These overrides only affect the specific date, not recurring schedules</li>
// //                         </ul>
// //                     </div>
// //                 </div>

// //                 {/* Add New Override Button */}
// //                 {!showAddForm && (
// //                     <button
// //                         onClick={() => setShowAddForm(true)}
// //                         className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors flex items-center justify-center space-x-2"
// //                     >
// //                         <Plus className="w-5 h-5" />
// //                         <span>Add Date Override</span>
// //                     </button>
// //                 )}

// //                 {/* Add Override Form */}
// //                 {showAddForm && (
// //                     <div className="bg-gray-50 rounded-lg p-6 space-y-4 border border-gray-200">
// //                         <div className="flex items-center justify-between mb-4">
// //                             <h3 className="text-lg font-semibold text-gray-900">New Date Override</h3>
// //                             <button
// //                                 onClick={() => setShowAddForm(false)}
// //                                 className="text-gray-400 hover:text-gray-600"
// //                             >
// //                                 <X className="w-5 h-5" />
// //                             </button>
// //                         </div>

// //                         {/* Date Picker */}
// //                         <div>
// //                             <label className="block text-sm font-medium text-gray-700 mb-2">
// //                                 Select Date
// //                             </label>
// //                             <input
// //                                 type="date"
// //                                 value={newOverride.date}
// //                                 onChange={(e) => setNewOverride({ ...newOverride, date: e.target.value })}
// //                                 min={new Date().toISOString().split('T')[0]}
// //                                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
// //                             />
// //                         </div>

// //                         {/* Close Entire Day Option */}
// //                         <div className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-gray-200">
// //                             <input
// //                                 type="checkbox"
// //                                 id="closeDay"
// //                                 checked={newOverride.isClosed}
// //                                 onChange={(e) => setNewOverride({
// //                                     ...newOverride,
// //                                     isClosed: e.target.checked,
// //                                     customHours: e.target.checked ? { startTime: '', endTime: '' } : newOverride.customHours,
// //                                     blockedTimeSlots: e.target.checked ? [] : newOverride.blockedTimeSlots
// //                                 })}
// //                                 className="h-4 w-4 text-gray-600 rounded focus:ring-gray-500"
// //                             />
// //                             <label htmlFor="closeDay" className="text-sm font-medium text-gray-700">
// //                                 Close entire day (no appointments available)
// //                             </label>
// //                         </div>

// //                         {/* Custom Hours */}
// //                         {!newOverride.isClosed && (
// //                             <div className="space-y-4">
// //                                 <div>
// //                                     <label className="block text-sm font-medium text-gray-700 mb-2">
// //                                         Custom Hours (Optional)
// //                                     </label>
// //                                     <div className="flex items-center space-x-4">
// //                                         <div className="flex-1">
// //                                             <label className="block text-xs text-gray-600 mb-1">Start Time</label>
// //                                             <input
// //                                                 type="time"
// //                                                 value={newOverride.customHours.startTime}
// //                                                 onChange={(e) => setNewOverride({
// //                                                     ...newOverride,
// //                                                     customHours: { ...newOverride.customHours, startTime: e.target.value }
// //                                                 })}
// //                                                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500"
// //                                             />
// //                                         </div>
// //                                         <div className="flex-1">
// //                                             <label className="block text-xs text-gray-600 mb-1">End Time</label>
// //                                             <input
// //                                                 type="time"
// //                                                 value={newOverride.customHours.endTime}
// //                                                 onChange={(e) => setNewOverride({
// //                                                     ...newOverride,
// //                                                     customHours: { ...newOverride.customHours, endTime: e.target.value }
// //                                                 })}
// //                                                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500"
// //                                             />
// //                                         </div>
// //                                     </div>
// //                                 </div>

// //                                 {/* Blocked Time Slots */}
// //                                 <div>
// //                                     <div className="flex items-center justify-between mb-2">
// //                                         <label className="block text-sm font-medium text-gray-700">
// //                                             Block Specific Time Slots (Optional)
// //                                         </label>
// //                                         <button
// //                                             onClick={addBlockedTimeSlot}
// //                                             className="text-sm text-gray-600 hover:text-gray-800 flex items-center space-x-1"
// //                                         >
// //                                             <Plus className="w-4 h-4" />
// //                                             <span>Add Slot</span>
// //                                         </button>
// //                                     </div>

// //                                     {newOverride.blockedTimeSlots.map((slot, index) => (
// //                                         <div key={index} className="bg-white p-3 rounded-lg border border-gray-200 mb-2">
// //                                             <div className="flex items-center space-x-2 mb-2">
// //                                                 <input
// //                                                     type="time"
// //                                                     value={slot.startTime}
// //                                                     onChange={(e) => updateBlockedTimeSlot(index, 'startTime', e.target.value)}
// //                                                     className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
// //                                                     placeholder="Start"
// //                                                 />
// //                                                 <span className="text-gray-500">to</span>
// //                                                 <input
// //                                                     type="time"
// //                                                     value={slot.endTime}
// //                                                     onChange={(e) => updateBlockedTimeSlot(index, 'endTime', e.target.value)}
// //                                                     className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
// //                                                     placeholder="End"
// //                                                 />
// //                                                 <button
// //                                                     onClick={() => removeBlockedTimeSlot(index)}
// //                                                     className="text-red-500 hover:text-red-700"
// //                                                 >
// //                                                     <Trash2 className="w-4 h-4" />
// //                                                 </button>
// //                                             </div>
// //                                             <input
// //                                                 type="text"
// //                                                 value={slot.reason}
// //                                                 onChange={(e) => updateBlockedTimeSlot(index, 'reason', e.target.value)}
// //                                                 placeholder="Reason (optional)"
// //                                                 className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
// //                                             />
// //                                         </div>
// //                                     ))}
// //                                 </div>
// //                             </div>
// //                         )}

// //                         {/* Form Actions */}
// //                         <div className="flex justify-end space-x-3 pt-4">
// //                             <button
// //                                 onClick={() => setShowAddForm(false)}
// //                                 className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
// //                             >
// //                                 Cancel
// //                             </button>
// //                             <button
// //                                 onClick={handleAddOverride}
// //                                 className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-lg hover:bg-gray-700"
// //                             >
// //                                 Add Override
// //                             </button>
// //                         </div>
// //                     </div>
// //                 )}

// //                 {/* Existing Overrides List */}
// //                 <div className="space-y-3">
// //                     <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
// //                         Current Overrides ({sortedOverrides.length})
// //                     </h3>

// //                     {sortedOverrides.length === 0 ? (
// //                         <div className="text-center py-8 text-gray-500">
// //                             <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-400" />
// //                             <p>No date overrides configured</p>
// //                         </div>
// //                     ) : (
// //                         sortedOverrides.map((override, index) => (
// //                             <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
// //                                 <div className="flex items-start justify-between mb-2">
// //                                     <div>
// //                                         <div className="font-semibold text-gray-900 mb-1">
// //                                             {formatDateDisplay(override.date)}
// //                                         </div>
// //                                         {override.isClosed ? (
// //                                             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
// //                                                 Closed All Day
// //                                             </span>
// //                                         ) : (
// //                                             <div className="space-y-1">
// //                                                 {override.customHours?.startTime && (
// //                                                     <div className="flex items-center text-sm text-gray-600">
// //                                                         <Clock className="w-4 h-4 mr-1" />
// //                                                         Custom Hours: {override.customHours.startTime} - {override.customHours.endTime}
// //                                                     </div>
// //                                                 )}
// //                                                 {override.blockedTimeSlots?.length > 0 && (
// //                                                     <div className="text-sm text-gray-600">
// //                                                         <div className="font-medium">Blocked Slots:</div>
// //                                                         {override.blockedTimeSlots.map((slot, i) => (
// //                                                             <div key={i} className="ml-4">
// //                                                                 • {slot.startTime} - {slot.endTime}
// //                                                                 {slot.reason && <span className="text-gray-500"> ({slot.reason})</span>}
// //                                                             </div>
// //                                                         ))}
// //                                                     </div>
// //                                                 )}
// //                                             </div>
// //                                         )}
// //                                     </div>
// //                                     <button
// //                                         onClick={() => handleRemoveOverride(override.date)}
// //                                         className="text-red-500 hover:text-red-700"
// //                                     >
// //                                         <Trash2 className="w-5 h-5" />
// //                                     </button>
// //                                 </div>
// //                             </div>
// //                         ))
// //                     )}
// //                 </div>

// //                 {/* Save Button */}
// //                 <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
// //                     <button
// //                         onClick={onBack}
// //                         className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
// //                     >
// //                         Cancel
// //                     </button>
// //                     <button
// //                         onClick={handleSave}
// //                         disabled={isSaving}
// //                         className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-lg hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
// //                     >
// //                         {isSaving ? (
// //                             <>
// //                                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
// //                                 Saving...
// //                             </>
// //                         ) : (
// //                             <>
// //                                 <Calendar className="w-4 h-4 mr-2" />
// //                                 Save Overrides
// //                             </>
// //                         )}
// //                     </button>
// //                 </div>
// //             </div>
// //         </div>
// //     );
// // };

// // export default DateOverrideManagement;


















// import React, { useState } from 'react';
// import { Calendar, X, Plus, Clock, Trash2, AlertCircle, Edit } from 'lucide-react';
// import { useContext } from 'react';
// import { useEffect } from 'react';

// const DateOverrideManagement = ({ 
//   provider, 
//   onUpdateDateOverrides,
//   onBack 
// }) => {
//   const [dateOverrides, setDateOverrides] = useState(provider.dateOverrides || []);
//   const [showAddForm, setShowAddForm] = useState(false);
//   const [editingOverride, setEditingOverride] = useState(null);
//   const [newOverride, setNewOverride] = useState({
//     date: '',
//     isClosed: false,
//     customHours: { startTime: '', endTime: '' },
//     blockedTimeSlots: []
//   });
//   const [isSaving, setIsSaving] = useState(false);
//   const backendUrl = import.meta.env.VITE_BACKEND_URL


//     useEffect(() => {
//     fetchDateOverrides();
//   }, [provider._id]);

//   const fetchDateOverrides = async () => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       const response = await fetch(`${backendUrl}/api/provider/${provider._id}/date-overrides`);
//       const data = await response.json();
      
//       if (data.success) {
//         setDateOverrides(data.dateOverrides || []);
//       } else {
//         setError(data.message || 'Failed to fetch date overrides');
//       }
//     } catch (err) {
//       console.error('Error fetching date overrides:', err);
//       setError('Failed to load date overrides. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };


//   // Sync with provider prop when it changes
//   React.useEffect(() => {
//     if (provider.dateOverrides) {
//       setDateOverrides(provider.dateOverrides);
//     }
//   }, [provider.dateOverrides]);

//   // Add new blocked time slot to the form
//   const addBlockedTimeSlot = () => {
//     setNewOverride(prev => ({
//       ...prev,
//       blockedTimeSlots: [
//         ...prev.blockedTimeSlots,
//         { startTime: '', endTime: '', reason: '' }
//       ]
//     }));
//   };

//   // Remove blocked time slot from form
//   const removeBlockedTimeSlot = (index) => {
//     setNewOverride(prev => ({
//       ...prev,
//       blockedTimeSlots: prev.blockedTimeSlots.filter((_, i) => i !== index)
//     }));
//   };

//   // Update blocked time slot in form
//   const updateBlockedTimeSlot = (index, field, value) => {
//     setNewOverride(prev => ({
//       ...prev,
//       blockedTimeSlots: prev.blockedTimeSlots.map((slot, i) => 
//         i === index ? { ...slot, [field]: value } : slot
//       )
//     }));
//   };

//   // Add new override to list or update existing
//   const handleAddOverride = () => {
//     if (!newOverride.date) {
//       alert('Please select a date');
//       return;
//     }

//     // Validation: Check if custom hours are valid
//     if (!newOverride.isClosed && newOverride.customHours.startTime && newOverride.customHours.endTime) {
//       const [startHour, startMin] = newOverride.customHours.startTime.split(':').map(Number);
//       const [endHour, endMin] = newOverride.customHours.endTime.split(':').map(Number);
//       if ((endHour * 60 + endMin) <= (startHour * 60 + startMin)) {
//         alert('End time must be after start time');
//         return;
//       }
//     }

//     // Check if date already has an override
//     const existingIndex = dateOverrides.findIndex(o => o.date === newOverride.date);
    
//     if (existingIndex >= 0) {
//       // Update existing override
//       const updated = [...dateOverrides];
//       updated[existingIndex] = { 
//         ...newOverride, 
//         createdAt: updated[existingIndex].createdAt || new Date() 
//       };
//       setDateOverrides(updated);
//     } else {
//       // Add new override
//       setDateOverrides([...dateOverrides, { ...newOverride, createdAt: new Date() }]);
//     }

//     // Reset form
//     setNewOverride({
//       date: '',
//       isClosed: false,
//       customHours: { startTime: '', endTime: '' },
//       blockedTimeSlots: []
//     });
//     setShowAddForm(false);
//     setEditingOverride(null);
//   };

//   // Edit existing override
//   const handleEditOverride = (override) => {
//     setNewOverride({
//       date: override.date,
//       isClosed: override.isClosed || false,
//       customHours: override.customHours || { startTime: '', endTime: '' },
//       blockedTimeSlots: override.blockedTimeSlots || []
//     });
//     setEditingOverride(override.date);
//     setShowAddForm(true);
//   };

//   // Cancel editing
//   const handleCancelEdit = () => {
//     setNewOverride({
//       date: '',
//       isClosed: false,
//       customHours: { startTime: '', endTime: '' },
//       blockedTimeSlots: []
//     });
//     setShowAddForm(false);
//     setEditingOverride(null);
//   };

//   // Remove override
//   const handleRemoveOverride = (date) => {
//     setDateOverrides(dateOverrides.filter(o => o.date !== date));
//   };

//   // Save all overrides
//   const handleSave = async () => {
//     setIsSaving(true);
//     try {
//       await onUpdateDateOverrides(provider._id, dateOverrides);
//     } catch (error) {
//       console.error('Error saving date overrides:', error);
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   // Format date for display
//   const formatDateDisplay = (dateStr) => {
//     const date = new Date(dateStr + 'T00:00:00');
//     return date.toLocaleDateString('en-US', { 
//       weekday: 'long', 
//       year: 'numeric', 
//       month: 'long', 
//       day: 'numeric' 
//     });
//   };

//   // Sort overrides by date
//   const sortedOverrides = [...dateOverrides].sort((a, b) => 
//     new Date(a.date) - new Date(b.date)
//   );

//   return (
//     <div className="bg-white rounded-xl shadow-sm border border-gray-200">
//       {/* Header */}
//       <div className="p-4 sm:p-6 border-b border-gray-200">
//         <div className="flex items-center justify-between">
//           <button
//             onClick={onBack}
//             className="text-gray-600 hover:text-gray-700 font-medium text-sm"
//           >
//             ← Back
//           </button>
//           <h2 className="text-xl font-semibold text-gray-900">
//             Date Overrides for {provider.name}
//           </h2>
//           <div className="w-16"></div>
//         </div>
//       </div>

//       <div className="p-6 space-y-6">
//         {/* Info Alert */}
//         <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start space-x-3">
//           <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
//           <div className="text-sm text-blue-800">
//             <p className="font-medium mb-1">How Date Overrides Work:</p>
//             <ul className="list-disc list-inside space-y-1 text-blue-700">
//               <li>Block entire days (e.g., holidays, vacation days)</li>
//               <li>Set custom hours for specific dates (e.g., early closing)</li>
//               <li>Block specific time slots (e.g., meetings, breaks)</li>
//               <li>These overrides only affect the specific date, not recurring schedules</li>
//             </ul>
//           </div>
//         </div>

//         {/* Add New Override Button */}
//         {!showAddForm && (
//           <button
//             onClick={() => setShowAddForm(true)}
//             className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors flex items-center justify-center space-x-2"
//           >
//             <Plus className="w-5 h-5" />
//             <span>Add Date Override</span>
//           </button>
//         )}

//         {/* Add Override Form */}
//         {showAddForm && (
//           <div className="bg-gray-50 rounded-lg p-6 space-y-4 border border-gray-200">
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-lg font-semibold text-gray-900">
//                 {editingOverride ? 'Edit Date Override' : 'New Date Override'}
//               </h3>
//               <button
//                 onClick={handleCancelEdit}
//                 className="text-gray-400 hover:text-gray-600"
//               >
//                 <X className="w-5 h-5" />
//               </button>
//             </div>

//             {/* Date Picker */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Select Date
//               </label>
//               <input
//                 type="date"
//                 value={newOverride.date}
//                 onChange={(e) => setNewOverride({ ...newOverride, date: e.target.value })}
//                 min={new Date().toISOString().split('T')[0]}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
//               />
//             </div>

//             {/* Close Entire Day Option */}
//             <div className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-gray-200">
//               <input
//                 type="checkbox"
//                 id="closeDay"
//                 checked={newOverride.isClosed}
//                 onChange={(e) => setNewOverride({ 
//                   ...newOverride, 
//                   isClosed: e.target.checked,
//                   customHours: e.target.checked ? { startTime: '', endTime: '' } : newOverride.customHours,
//                   blockedTimeSlots: e.target.checked ? [] : newOverride.blockedTimeSlots
//                 })}
//                 className="h-4 w-4 text-gray-600 rounded focus:ring-gray-500"
//               />
//               <label htmlFor="closeDay" className="text-sm font-medium text-gray-700">
//                 Close entire day (no appointments available)
//               </label>
//             </div>

//             {/* Custom Hours */}
//             {!newOverride.isClosed && (
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Custom Hours (Optional)
//                   </label>
//                   <div className="flex items-center space-x-4">
//                     <div className="flex-1">
//                       <label className="block text-xs text-gray-600 mb-1">Start Time</label>
//                       <input
//                         type="time"
//                         value={newOverride.customHours.startTime}
//                         onChange={(e) => setNewOverride({
//                           ...newOverride,
//                           customHours: { ...newOverride.customHours, startTime: e.target.value }
//                         })}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500"
//                       />
//                     </div>
//                     <div className="flex-1">
//                       <label className="block text-xs text-gray-600 mb-1">End Time</label>
//                       <input
//                         type="time"
//                         value={newOverride.customHours.endTime}
//                         onChange={(e) => setNewOverride({
//                           ...newOverride,
//                           customHours: { ...newOverride.customHours, endTime: e.target.value }
//                         })}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500"
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 {/* Blocked Time Slots */}
//                 <div>
//                   <div className="flex items-center justify-between mb-2">
//                     <label className="block text-sm font-medium text-gray-700">
//                       Block Specific Time Slots (Optional)
//                     </label>
//                     <button
//                       onClick={addBlockedTimeSlot}
//                       className="text-sm text-gray-600 hover:text-gray-800 flex items-center space-x-1"
//                     >
//                       <Plus className="w-4 h-4" />
//                       <span>Add Slot</span>
//                     </button>
//                   </div>

//                   {newOverride.blockedTimeSlots.map((slot, index) => (
//                     <div key={index} className="bg-white p-3 rounded-lg border border-gray-200 mb-2">
//                       <div className="flex items-center space-x-2 mb-2">
//                         <input
//                           type="time"
//                           value={slot.startTime}
//                           onChange={(e) => updateBlockedTimeSlot(index, 'startTime', e.target.value)}
//                           className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
//                           placeholder="Start"
//                         />
//                         <span className="text-gray-500">to</span>
//                         <input
//                           type="time"
//                           value={slot.endTime}
//                           onChange={(e) => updateBlockedTimeSlot(index, 'endTime', e.target.value)}
//                           className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
//                           placeholder="End"
//                         />
//                         <button
//                           onClick={() => removeBlockedTimeSlot(index)}
//                           className="text-red-500 hover:text-red-700"
//                         >
//                           <Trash2 className="w-4 h-4" />
//                         </button>
//                       </div>
//                       <input
//                         type="text"
//                         value={slot.reason}
//                         onChange={(e) => updateBlockedTimeSlot(index, 'reason', e.target.value)}
//                         placeholder="Reason (optional)"
//                         className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
//                       />
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Form Actions */}
//             <div className="flex justify-end space-x-3 pt-4">
//               <button
//                 onClick={handleCancelEdit}
//                 className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleAddOverride}
//                 className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-lg hover:bg-gray-700"
//               >
//                 {editingOverride ? 'Update Override' : 'Add Override'}
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Existing Overrides List */}
//         <div className="space-y-3">
//           <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
//             Current Overrides ({sortedOverrides.length})
//           </h3>
          
//           {sortedOverrides.length === 0 ? (
//             <div className="text-center py-8 text-gray-500">
//               <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-400" />
//               <p>No date overrides configured</p>
//             </div>
//           ) : (
//             sortedOverrides.map((override, index) => (
//               <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
//                 <div className="flex items-start justify-between">
//                   <div className="flex-1">
//                     <div className="font-semibold text-gray-900 mb-1">
//                       {formatDateDisplay(override.date)}
//                     </div>
//                     {override.isClosed ? (
//                       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
//                         Closed All Day
//                       </span>
//                     ) : (
//                       <div className="space-y-1">
//                         {override.customHours?.startTime && override.customHours?.endTime && (
//                           <div className="flex items-center text-sm text-gray-600">
//                             <Clock className="w-4 h-4 mr-1" />
//                             Custom Hours: {override.customHours.startTime} - {override.customHours.endTime}
//                           </div>
//                         )}
//                         {override.blockedTimeSlots?.length > 0 && (
//                           <div className="text-sm text-gray-600">
//                             <div className="font-medium">Blocked Slots:</div>
//                             {override.blockedTimeSlots.map((slot, i) => (
//                               <div key={i} className="ml-4">
//                                 • {slot.startTime} - {slot.endTime} 
//                                 {slot.reason && <span className="text-gray-500"> ({slot.reason})</span>}
//                               </div>
//                             ))}
//                           </div>
//                         )}
//                         {!override.customHours?.startTime && !override.blockedTimeSlots?.length && (
//                           <span className="text-sm text-gray-500 italic">Using regular schedule</span>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                   <div className="flex items-center space-x-2 ml-4">
//                     <button
//                       onClick={() => handleEditOverride(override)}
//                       className="text-blue-500 hover:text-blue-700 p-1 rounded hover:bg-blue-50"
//                       title="Edit override"
//                     >
//                       <Edit className="w-5 h-5" />
//                     </button>
//                     <button
//                       onClick={() => handleRemoveOverride(override.date)}
//                       className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50"
//                       title="Delete override"
//                     >
//                       <Trash2 className="w-5 h-5" />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>

//         {/* Save Button */}
//         <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
//           <button
//             onClick={onBack}
//             className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSave}
//             disabled={isSaving}
//             className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-lg hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
//           >
//             {isSaving ? (
//               <>
//                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                 Saving...
//               </>
//             ) : (
//               <>
//                 <Calendar className="w-4 h-4 mr-2" />
//                 Save Overrides
//               </>
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DateOverrideManagement;













import React, { useState, useEffect } from 'react';
import { Calendar, X, Plus, Clock, Trash2, AlertCircle, Edit, RefreshCw } from 'lucide-react';

const DateOverrideManagement = ({ 
  provider, 
  onBack,
  onUpdateDateOverrides,
  apiBaseUrl = 'http://localhost:8000/api/provider' // Make this configurable
}) => {
  const [dateOverrides, setDateOverrides] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingOverride, setEditingOverride] = useState(null);

  const [newOverride, setNewOverride] = useState({
    date: '',
    isClosed: false,
    customHours: { startTime: '', endTime: '' },
    blockedTimeSlots: []
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingDate, setDeletingDate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Fetch date overrides on mount
  useEffect(() => {
    fetchDateOverrides();
  }, [provider._id]);

  const fetchDateOverrides = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${backendUrl}/api/provider/${provider._id}/date-overrides`);
      const data = await response.json();
      
      if (data.success) {
        setDateOverrides(data.dateOverrides || []);
      } else {
        setError(data.message || 'Failed to fetch date overrides');
      }
    } catch (err) {
      console.error('Error fetching date overrides:', err);
      setError('Failed to load date overrides. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Add new blocked time slot to the form
  const addBlockedTimeSlot = () => {
    setNewOverride(prev => ({
      ...prev,
      blockedTimeSlots: [
        ...prev.blockedTimeSlots,
        { startTime: '', endTime: '', reason: '' }
      ]
    }));
  };

  // Remove blocked time slot from form
  const removeBlockedTimeSlot = (index) => {
    setNewOverride(prev => ({
      ...prev,
      blockedTimeSlots: prev.blockedTimeSlots.filter((_, i) => i !== index)
    }));
  };

  // Update blocked time slot in form
  const updateBlockedTimeSlot = (index, field, value) => {
    setNewOverride(prev => ({
      ...prev,
      blockedTimeSlots: prev.blockedTimeSlots.map((slot, i) => 
        i === index ? { ...slot, [field]: value } : slot
      )
    }));
  };

  // Add new override to list or update existing
  const handleAddOverride = () => {
    if (!newOverride.date) {
      alert('Please select a date');
      return;
    }

    // Validation: Check if custom hours are valid
    if (!newOverride.isClosed && newOverride.customHours.startTime && newOverride.customHours.endTime) {
      const [startHour, startMin] = newOverride.customHours.startTime.split(':').map(Number);
      const [endHour, endMin] = newOverride.customHours.endTime.split(':').map(Number);
      if ((endHour * 60 + endMin) <= (startHour * 60 + startMin)) {
        alert('End time must be after start time');
        return;
      }
    }

    // Validate blocked time slots
    if (!newOverride.isClosed && newOverride.blockedTimeSlots.length > 0) {
      for (const slot of newOverride.blockedTimeSlots) {
        if (!slot.startTime || !slot.endTime) {
          alert('Please fill in all blocked time slot times');
          return;
        }
        const [startHour, startMin] = slot.startTime.split(':').map(Number);
        const [endHour, endMin] = slot.endTime.split(':').map(Number);
        if ((endHour * 60 + endMin) <= (startHour * 60 + startMin)) {
          alert('Blocked slot end time must be after start time');
          return;
        }
      }
    }

    // Check if date already has an override
    const existingIndex = dateOverrides.findIndex(o => o.date === newOverride.date);
    
    if (existingIndex >= 0) {
      // Update existing override
      const updated = [...dateOverrides];
      updated[existingIndex] = { 
        ...newOverride, 
        createdAt: updated[existingIndex].createdAt || new Date() 
      };
      setDateOverrides(updated);
    } else {
      // Add new override
      setDateOverrides([...dateOverrides, { ...newOverride, createdAt: new Date() }]);
    }

    // Reset form
    setNewOverride({
      date: '',
      isClosed: false,
      customHours: { startTime: '', endTime: '' },
      blockedTimeSlots: []
    });
    setShowAddForm(false);
    setEditingOverride(null);
  };

  // Edit existing override
  const handleEditOverride = (override) => {
    setNewOverride({
      date: override.date,
      isClosed: override.isClosed || false,
      customHours: override.customHours || { startTime: '', endTime: '' },
      blockedTimeSlots: override.blockedTimeSlots || []
    });
    setEditingOverride(override.date);
    setShowAddForm(true);
    // Scroll to form
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setNewOverride({
      date: '',
      isClosed: false,
      customHours: { startTime: '', endTime: '' },
      blockedTimeSlots: []
    });
    setShowAddForm(false);
    setEditingOverride(null);
  };

  // Remove override
  const handleRemoveOverride = (date) => {
    if (confirm(`Are you sure you want to remove the override for ${formatDateDisplay(date)}?`)) {
      setDateOverrides(dateOverrides.filter(o => o.date !== date));
    }
  };

  // Save all overrides to backend
//   const handleSave = async () => {
//     setIsSaving(true);
//     setError(null);
//     try {
//       const response = await fetch(`${apiBaseUrl}/${provider._id}/date-overrides`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ dateOverrides })
//       });

//       const data = await response.json();

//       if (data.success) {
//         alert('Date overrides saved successfully!');
//         // Optionally refresh the data
//         await fetchDateOverrides();
//       } else {
//         setError(data.message || 'Failed to save date overrides');
//         alert('Failed to save: ' + (data.message || 'Unknown error'));
//       }
//     } catch (err) {
//       console.error('Error saving date overrides:', err);
//       setError('Failed to save date overrides. Please try again.');
//       alert('Failed to save date overrides. Please try again.');
//     } finally {
//       setIsSaving(false);
//     }
//   };
  // Save all overrides
  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onUpdateDateOverrides(provider._id, dateOverrides);
    } catch (error) {
      console.error('Error saving date overrides:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Format date for display
  const formatDateDisplay = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-CA', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };


  const handleDeleteOverride = async (date) => {
    if (!confirm(`Are you sure you want to remove the override for ${formatDateDisplay(date)}?`)) {
      return;
    }

    setIsDeleting(true);
    setDeletingDate(date);
    setError(null);

    try {
      const response = await fetch(
        `${backendUrl}/api/provider/${provider._id}/date-overrides/${date}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      const data = await response.json();

      if (data.success) {
        // Remove from local state immediately
        setDateOverrides(dateOverrides.filter(o => o.date !== date));
        
        // Show success message
        alert('Override deleted successfully!');
        
        // Optionally refresh from backend to ensure sync
        await fetchDateOverrides();
      } else {
        throw new Error(data.message || 'Failed to delete override');
      }
    } catch (err) {
      console.error('Error deleting override:', err);
      setError('Failed to delete override: ' + err.message);
      alert('Failed to delete override. Please try again.');
    } finally {
      setIsDeleting(false);
      setDeletingDate(null);
    }
  };

  // ✅ NEW: Delete all overrides
  const handleDeleteAllOverrides = async () => {
    if (!confirm(`Are you sure you want to delete ALL ${dateOverrides.length} override(s)? This action cannot be undone.`)) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const response = await fetch(
        `${backendUrl}/api/provider/${provider._id}/date-overrides`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      const data = await response.json();

      if (data.success) {
        // Clear local state
        setDateOverrides([]);
        
        // Show success message
        alert('All overrides deleted successfully!');
        
        // Refresh from backend
        await fetchDateOverrides();
      } else {
        throw new Error(data.message || 'Failed to delete all overrides');
      }
    } catch (err) {
      console.error('Error deleting all overrides:', err);
      setError('Failed to delete all overrides: ' + err.message);
      alert('Failed to delete all overrides. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  // ✅ NEW: Bulk delete selected overrides
  const handleBulkDelete = async (dates) => {
    if (dates.length === 0) return;

    if (!confirm(`Are you sure you want to delete ${dates.length} override(s)?`)) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const response = await fetch(
        `${backendUrl}/api/provider/${provider._id}/date-overrides/bulk-delete`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ dates })
        }
      );

      const data = await response.json();

      if (data.success) {
        // Remove from local state
        setDateOverrides(dateOverrides.filter(o => !dates.includes(o.date)));
        
        // Show success message
        alert(`Successfully deleted ${data.deletedCount} override(s)!`);
        
        // Refresh from backend
        await fetchDateOverrides();
      } else {
        throw new Error(data.message || 'Failed to delete overrides');
      }
    } catch (err) {
      console.error('Error bulk deleting overrides:', err);
      setError('Failed to delete overrides: ' + err.message);
      alert('Failed to delete overrides. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };


  // Sort overrides by date
  const sortedOverrides = [...dateOverrides].sort((a, b) => 
    new Date(a.date) - new Date(b.date)
  );

  // Check if there are unsaved changes
  const hasUnsavedChanges = JSON.stringify(dateOverrides) !== JSON.stringify(provider.dateOverrides || []);

  return (
    <div className="bg-white ml-18 rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="text-gray-600 hover:text-gray-700 font-medium text-sm"
          >
            ← Back
          </button>
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-semibold text-gray-900">
              Date Overrides for {provider.name}
            </h2>
            <button
              onClick={fetchDateOverrides}
              disabled={isLoading}
              className="text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-100"
              title="Refresh"
            >
              <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
          <div className="w-16"></div>
        </div>

      </div>

      <div className="p-6 space-y-6">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-red-800">{error}</div>
          </div>
        )}

       

        {/* Add New Override Button */}
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors flex items-center justify-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Date Override</span>
          </button>
        )}

        {/* Add/Edit Override Form */}
        {showAddForm && (
          <div className="bg-gray-50 rounded-lg p-6 space-y-4 border-2 border-green-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingOverride ? `Edit Override for ${formatDateDisplay(editingOverride)}` : 'New Date Override'}
              </h3>
              <button
                onClick={handleCancelEdit}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Date Picker */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Date
              </label>
              <input
                type="date"
                value={newOverride.date}
                onChange={(e) => setNewOverride({ ...newOverride, date: e.target.value })}
                disabled={!!editingOverride}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              {editingOverride && (
                <p className="mt-1 text-xs text-gray-500">Date cannot be changed when editing</p>
              )}
            </div>

            {/* Close Entire Day Option */}
            <div className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-gray-200">
              <input
                type="checkbox"
                id="closeDay"
                checked={newOverride.isClosed}
                onChange={(e) => setNewOverride({ 
                  ...newOverride, 
                  isClosed: e.target.checked,
                  customHours: e.target.checked ? { startTime: '', endTime: '' } : newOverride.customHours,
                  blockedTimeSlots: e.target.checked ? [] : newOverride.blockedTimeSlots
                })}
                className="h-4 w-4 text-gray-600 rounded focus:ring-gray-500"
              />
              <label htmlFor="closeDay" className="text-sm font-medium text-gray-700">
                Close entire day (no appointments available)
              </label>
            </div>

            {/* Custom Hours */}
            {!newOverride.isClosed && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Custom Hours (Optional - leave empty to use regular schedule)
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <label className="block text-xs text-gray-600 mb-1">Start Time</label>
                      <input
                        type="time"
                        value={newOverride.customHours.startTime}
                        onChange={(e) => setNewOverride({
                          ...newOverride,
                          customHours: { ...newOverride.customHours, startTime: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-gray-600 mb-1">End Time</label>
                      <input
                        type="time"
                        value={newOverride.customHours.endTime}
                        onChange={(e) => setNewOverride({
                          ...newOverride,
                          customHours: { ...newOverride.customHours, endTime: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Blocked Time Slots */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Block Specific Time Slots
                    </label>
                    <button
                      onClick={addBlockedTimeSlot}
                      className="text-sm text-gray-600 hover:text-gray-800 flex items-center space-x-1"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Slot</span>
                    </button>
                  </div>

                  {newOverride.blockedTimeSlots.map((slot, index) => (
                    <div key={index} className="bg-white p-3 rounded-lg border border-gray-200 mb-2">
                      <div className="flex items-center space-x-2 mb-2">
                        <input
                          type="time"
                          value={slot.startTime}
                          onChange={(e) => updateBlockedTimeSlot(index, 'startTime', e.target.value)}
                          className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                          placeholder="Start"
                        />
                        <span className="text-gray-500">to</span>
                        <input
                          type="time"
                          value={slot.endTime}
                          onChange={(e) => updateBlockedTimeSlot(index, 'endTime', e.target.value)}
                          className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                          placeholder="End"
                        />
                        <button
                          onClick={() => removeBlockedTimeSlot(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddOverride}
                className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-lg hover:bg-gray-700"
              >
                {editingOverride ? 'Update Override' : 'Add Override'}
              </button>
            </div>
          </div>
        )}

        {/* Existing Overrides List */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Current Overrides ({sortedOverrides.length})
          </h3>

              {/* ✅ NEW: Delete All Button */}
            {sortedOverrides.length > 0 && (
              <button
                onClick={handleDeleteAllOverrides}
                disabled={isDeleting}
                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete All
                  </>
                )}
              </button>
            )}
          
          {isLoading ? (
            <div className="text-center py-8">
              <RefreshCw className="w-8 h-8 mx-auto mb-3 text-gray-400 animate-spin" />
              <p className="text-gray-500">Loading overrides...</p>
            </div>
          ) : sortedOverrides.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p>No date overrides configured</p>
            </div>
          ) : (
            sortedOverrides.map((override, index) => (
              <div 
                key={index} 
                className={`bg-white border rounded-lg p-4 hover:shadow-md transition-shadow ${
                  editingOverride === override.date ? 'border-green-400 border-2' : 'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 mb-1">
                      {formatDateDisplay(override.date)}
                    </div>
                    {override.isClosed ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Closed All Day
                      </span>
                    ) : (
                      <div className="space-y-1">
                        {override.customHours?.startTime && override.customHours?.endTime && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="w-4 h-4 mr-1" />
                            Custom Hours: {override.customHours.startTime} - {override.customHours.endTime}
                          </div>
                        )}
                        {override.blockedTimeSlots?.length > 0 && (
                          <div className="text-sm text-gray-600">
                            <div className="font-medium">Blocked Slots:</div>
                            {override.blockedTimeSlots.map((slot, i) => (
                              <div key={i} className="ml-4">
                                • {slot.startTime} - {slot.endTime} 
                                {slot.reason && <span className="text-gray-500"> ({slot.reason})</span>}
                              </div>
                            ))}
                          </div>
                        )}
                        {!override.customHours?.startTime && !override.blockedTimeSlots?.length && (
                          <span className="text-sm text-gray-500 italic">Using regular schedule</span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleEditOverride(override)}
                      className="text-green-700 hover:text-green-700 p-1 rounded hover:bg-green-50"
                      title="Edit override"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
            
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Save Button */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <button
            onClick={onBack}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || !hasUnsavedChanges}
            className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-lg hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Calendar className="w-4 h-4 mr-2" />
                Save Overrides
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DateOverrideManagement;