// import { useState } from "react";
// import {Save} from 'lucide-react'
// import {toast} from 'react-toastify'

//   export const ScheduleManagement = ({ provider }) => {
//     const backendUrl = "http://localhost:3000"
//     const [workingHours, setWorkingHours] = useState(
//       provider.workingHours && provider.workingHours.length > 0
//         ? provider.workingHours
//         : [
//           { dayOfWeek: 0, isWorking: false, startTime: '09:00', endTime: '17:00' },
//           { dayOfWeek: 1, isWorking: true, startTime: '09:00', endTime: '17:00' },
//           { dayOfWeek: 2, isWorking: true, startTime: '09:00', endTime: '17:00' },
//           { dayOfWeek: 3, isWorking: true, startTime: '09:00', endTime: '17:00' },
//           { dayOfWeek: 4, isWorking: true, startTime: '09:00', endTime: '17:00' },
//           { dayOfWeek: 5, isWorking: true, startTime: '09:00', endTime: '17:00' },
//           { dayOfWeek: 6, isWorking: false, startTime: '09:00', endTime: '17:00' }
//         ]
//     );
//     const [isSaving, setIsSaving] = useState(false);
//     const [providers, setProviders] = useState(false)
//     const [selectedProvider, setSelectedProvider] = useState(false)

//       const loadProviders = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch(`${backendUrl}/api/provider`);
//       if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

//       const data = await response.json();

//       if (data.success) {
//         setProviders(data.providers || []);
//       } else {
//         throw new Error(data.message || 'Failed to load providers');
//       }
//     } catch (error) {
//       console.error('Failed to load providers:', error);
//       toast.error('error', 'Failed to load providers: ' + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };
    

//     const updateWorkingDay = (dayOfWeek, field, value) => {
//       setWorkingHours(prev => {
//         const newHours = [...prev];
//         const dayIndex = newHours.findIndex(wh => wh.dayOfWeek === dayOfWeek);

//         if (dayIndex !== -1) {
//           newHours[dayIndex] = { ...newHours[dayIndex], [field]: value };
//         } else {
//           // Create new working day if it doesn't exist
//           const defaultTime = field === 'startTime' ? value :
//             field === 'endTime' ? value : '09:00';
//           newHours.push({
//             dayOfWeek,
//             isWorking: field === 'isWorking' ? value : false,
//             startTime: field === 'startTime' ? value : defaultTime,
//             endTime: field === 'endTime' ? value : '17:00'
//           });
//         }

//         return newHours.sort((a, b) => a.dayOfWeek - b.dayOfWeek);
//       });
//     };

    
//   const updateProviderWorkingHours = async (providerId, workingHours) => {
//     try {
//       const response = await fetch(
//         `${backendUrl}/api/provider/${providerId}/working-hours`,
//         {
//           method: 'PUT',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({ workingHours }),
//         }
//       );

//       if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

//       const result = await response.json();

//       if (result.success) {
//         toast.success('Working hours updated successfully!');
//         await loadProviders();

//         // Update selected provider
//         if (selectedProvider && selectedProvider._id === providerId) {
//           const updatedProvider = providers.find(p => p._id === providerId);
//           if (updatedProvider) {
//             setSelectedProvider(updatedProvider);
//           }
//         }
//       } else {
//         throw new Error(result.message || 'Failed to update working hours');
//       }
//     } catch (error) {
//       console.error('Failed to update working hours:', error);
//       toast.error('error', 'Failed to update working hours: ' + error.message);
//     }
//   };

//     const handleSave = async () => {
//       setIsSaving(true);
//       try {
//         await updateProviderWorkingHours(provider._id, workingHours);
//       } catch (error) {
//         console.error('Error saving schedule:', error);
//       } finally {
//         setIsSaving(false);
//       }
//     };

//     const dayNames = [
//       'Sunday',
//       'Monday',
//       'Tuesday',
//       'Wednesday',
//       'Thursday',
//       'Friday',
//       'Saturday'
//     ];

//     return (
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200">
//         <div className="p-4 sm:p-6 border-b border-gray-200">
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
//             {/* Back button */}
//             <button
//               onClick={() => setView("detail")}
//               className="text-gray-600 hover:text-gray-700 font-medium text-sm sm:text-base"
//             >
//               ← Back to Provider Details
//             </button>

//             {/* Title */}
//             <h2 className="text-lg sm:text-xl font-semibold text-gray-900 text-center sm:text-left">
//               Schedule for {provider.name}
//             </h2>

//             {/* Spacer for alignment on larger screens */}
//             <div className="hidden sm:block w-24"></div>
//           </div>
//         </div>


//         <div className="p-6">
//           <div className="max-w-2xl mx-auto">
//             <div className="space-y-4">
//               {dayNames.map((dayName, index) => {
//                 const daySchedule = workingHours.find(wh => wh.dayOfWeek === index) ||
//                   { dayOfWeek: index, isWorking: false, startTime: '09:00', endTime: '17:00' };

//                 return (
//                   <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//                     <div className="flex items-center space-x-4">
//                       <input
//                         type="checkbox"
//                         checked={daySchedule.isWorking}
//                         onChange={(e) => updateWorkingDay(index, 'isWorking', e.target.checked)}
//                         className="h-4 w-4 text-gray-600 rounded focus:ring-gray-500"
//                       />
//                       <span className="w-24 font-medium text-gray-700">{dayName}</span>
//                     </div>

//                     {daySchedule.isWorking ? (
//                       <div className="flex items-center space-x-3">
//                         <div className="flex items-center space-x-2">
//                           <label className="text-sm text-gray-600">From:</label>
//                           <input
//                             type="time"
//                             value={daySchedule.startTime}
//                             onChange={(e) => updateWorkingDay(index, 'startTime', e.target.value)}
//                             className="px-2 py-1 border border-gray-300 rounded text-sm"
//                           />
//                         </div>
//                         <div className="flex items-center space-x-2">
//                           <label className="text-sm text-gray-600">To:</label>
//                           <input
//                             type="time"
//                             value={daySchedule.endTime}
//                             onChange={(e) => updateWorkingDay(index, 'endTime', e.target.value)}
//                             className="px-2 py-1 border border-gray-300 rounded text-sm"
//                           />
//                         </div>
//                       </div>
//                     ) : (
//                       <span className="text-sm text-gray-500">Closed</span>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>

//             <div className="mt-8 flex justify-end space-x-3">
//               <button
//                 onClick={() => setView('detail')}
//                 className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSave}
//                 disabled={isSaving}
//                 className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-lg hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center"
//               >
//                 {isSaving ? (
//                   <>
//                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                     Saving...
//                   </>
//                 ) : (
//                   <>
//                     <Save className="w-4 h-4 mr-2" />
//                     Save Schedule
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };









import React, { useState } from 'react';
import { Save, X } from 'lucide-react';

export const ScheduleManagement = ({ 
  provider, 
  onUpdateWorkingHours, 
  onBack 
}) => {
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
      await onUpdateWorkingHours(provider._id, workingHours);
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
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Back button */}
          <button
            onClick={onBack}
            className="text-gray-600 hover:text-gray-700 font-medium text-sm sm:text-base"
          >
            ← Back to Provider Details
          </button>

          {/* Title */}
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 text-center sm:text-left">
            Schedule for {provider.name}
          </h2>

          {/* Spacer for alignment on larger screens */}
          <div className="hidden sm:block w-24"></div>
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
                      className="h-4 w-4 text-gray-600 rounded focus:ring-gray-500"
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
              onClick={onBack}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-lg hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center"
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

export default ScheduleManagement;