// import React, { useState } from 'react';
// import { Save, X } from 'lucide-react';

// export const ScheduleManagement = ({ 
//   provider, 
//   onUpdateWorkingHours, 
//   onBack 
// }) => {
//   const [workingHours, setWorkingHours] = useState(
//     provider.workingHours && provider.workingHours.length > 0
//       ? provider.workingHours
//       : [
//         { dayOfWeek: 0, isWorking: false, startTime: '09:00', endTime: '17:00' },
//         { dayOfWeek: 1, isWorking: true, startTime: '09:00', endTime: '17:00' },
//         { dayOfWeek: 2, isWorking: true, startTime: '09:00', endTime: '17:00' },
//         { dayOfWeek: 3, isWorking: true, startTime: '09:00', endTime: '17:00' },
//         { dayOfWeek: 4, isWorking: true, startTime: '09:00', endTime: '17:00' },
//         { dayOfWeek: 5, isWorking: true, startTime: '09:00', endTime: '17:00' },
//         { dayOfWeek: 6, isWorking: false, startTime: '09:00', endTime: '17:00' }
//       ]
//   );
//   const [isSaving, setIsSaving] = useState(false);

//   const updateWorkingDay = (dayOfWeek, field, value) => {
//     setWorkingHours(prev => {
//       const newHours = [...prev];
//       const dayIndex = newHours.findIndex(wh => wh.dayOfWeek === dayOfWeek);

//       if (dayIndex !== -1) {
//         newHours[dayIndex] = { ...newHours[dayIndex], [field]: value };
//       } else {
//         // Create new working day if it doesn't exist
//         const defaultTime = field === 'startTime' ? value :
//           field === 'endTime' ? value : '09:00';
//         newHours.push({
//           dayOfWeek,
//           isWorking: field === 'isWorking' ? value : false,
//           startTime: field === 'startTime' ? value : defaultTime,
//           endTime: field === 'endTime' ? value : '17:00'
//         });
//       }

//       return newHours.sort((a, b) => a.dayOfWeek - b.dayOfWeek);
//     });
//   };

//   const handleSave = async () => {
//     setIsSaving(true);
//     try {
//       await onUpdateWorkingHours(provider._id, workingHours);
//     } catch (error) {
//       console.error('Error saving schedule:', error);
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const dayNames = [
//     'Sunday',
//     'Monday',
//     'Tuesday',
//     'Wednesday',
//     'Thursday',
//     'Friday',
//     'Saturday'
//   ];

//   return (
//     <div className="ml-18 bg-white rounded-xl shadow-sm border border-gray-200">
//       <div className="p-4 sm:p-6 border-b border-gray-200">
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
//           {/* Back button */}
//           <button
//             onClick={onBack}
//             className="text-gray-600 hover:text-gray-700 font-medium text-sm sm:text-base"
//           >
//             ← Back to Provider Details
//           </button>

//           {/* Title */}
//           <h2 className="text-lg sm:text-xl font-semibold text-gray-900 text-center sm:text-left">
//             Schedule for {provider.name}
//           </h2>

//           {/* Spacer for alignment on larger screens */}
//           <div className="hidden sm:block w-24"></div>
//         </div>
//       </div>

//       <div className="p-6">
//         <div className="max-w-2xl mx-auto">
//           <div className="space-y-4">
//             {dayNames.map((dayName, index) => {
//               const daySchedule = workingHours.find(wh => wh.dayOfWeek === index) ||
//                 { dayOfWeek: index, isWorking: false, startTime: '09:00', endTime: '17:00' };

//               return (
//                 <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//                   <div className="flex items-center space-x-4">
//                     <input
//                       type="checkbox"
//                       checked={daySchedule.isWorking}
//                       onChange={(e) => updateWorkingDay(index, 'isWorking', e.target.checked)}
//                       className="h-4 w-4 text-gray-600 rounded focus:ring-gray-500"
//                     />
//                     <span className="w-24 font-medium text-gray-700">{dayName}</span>
//                   </div>

//                   {daySchedule.isWorking ? (
//                     <div className="flex items-center space-x-3">
//                       <div className="flex items-center space-x-2">
//                         <label className="text-sm text-gray-600">From:</label>
//                         <input
//                           type="time"
//                           value={daySchedule.startTime}
//                           onChange={(e) => updateWorkingDay(index, 'startTime', e.target.value)}
//                           className="px-2 py-1 border border-gray-300 rounded text-sm"
//                         />
//                       </div>
//                       <div className="flex items-center space-x-2">
//                         <label className="text-sm text-gray-600">To:</label>
//                         <input
//                           type="time"
//                           value={daySchedule.endTime}
//                           onChange={(e) => updateWorkingDay(index, 'endTime', e.target.value)}
//                           className="px-2 py-1 border border-gray-300 rounded text-sm"
//                         />
//                       </div>
//                     </div>
//                   ) : (
//                     <span className="text-sm text-gray-500">Closed</span>
//                   )}
//                 </div>
//               );
//             })}
//           </div>

//           <div className="mt-8 flex justify-end space-x-3">
//             <button
//               onClick={onBack}
//               className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleSave}
//               disabled={isSaving}
//               className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-lg hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center"
//             >
//               {isSaving ? (
//                 <>
//                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                   Saving...
//                 </>
//               ) : (
//                 <>
//                   <Save className="w-4 h-4 mr-2" />
//                   Save Schedule
//                 </>
//               )}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ScheduleManagement;













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

  // Shorter day names for mobile
  const shortDayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header - Mobile Responsive */}
      <div className="p-3 sm:p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
          {/* Back button */}
          <button
            onClick={onBack}
            className="text-gray-600 hover:text-gray-700 font-medium text-sm self-start"
          >
            ← Back
          </button>

          {/* Title */}
          <h2 className="text-base sm:text-xl font-semibold text-gray-900">
            Schedule for {provider.name}
          </h2>

          {/* Spacer for alignment on larger screens */}
          <div className="hidden sm:block w-24"></div>
        </div>
      </div>

      <div className="p-3 sm:p-6">
        <div className="w-full max-w-2xl mx-auto">
          <div className="space-y-2 sm:space-y-4">
            {dayNames.map((dayName, index) => {
              const daySchedule = workingHours.find(wh => wh.dayOfWeek === index) ||
                { dayOfWeek: index, isWorking: false, startTime: '09:00', endTime: '17:00' };

              return (
                <div 
                  key={index} 
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-gray-50 rounded-lg gap-3"
                >
                  {/* Day name and checkbox */}
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={daySchedule.isWorking}
                      onChange={(e) => updateWorkingDay(index, 'isWorking', e.target.checked)}
                      className="h-4 w-4 text-gray-600 rounded focus:ring-gray-500 flex-shrink-0"
                    />
                    <span className="font-medium text-gray-700 text-sm sm:text-base min-w-[60px] sm:min-w-[100px]">
                      <span className="sm:hidden">{shortDayNames[index]}</span>
                      <span className="hidden sm:inline">{dayName}</span>
                    </span>
                  </div>

                  {/* Time inputs or Closed label */}
                  {daySchedule.isWorking ? (
                    <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2 xs:gap-3 pl-7 sm:pl-0">
                      <div className="flex items-center gap-2">
                        <label className="text-xs sm:text-sm text-gray-600 w-10 sm:w-auto flex-shrink-0">From:</label>
                        <input
                          type="time"
                          value={daySchedule.startTime}
                          onChange={(e) => updateWorkingDay(index, 'startTime', e.target.value)}
                          className="flex-1 xs:flex-none px-2 py-1.5 border border-gray-300 rounded text-xs sm:text-sm min-w-0"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="text-xs sm:text-sm text-gray-600 w-10 sm:w-auto flex-shrink-0">To:</label>
                        <input
                          type="time"
                          value={daySchedule.endTime}
                          onChange={(e) => updateWorkingDay(index, 'endTime', e.target.value)}
                          className="flex-1 xs:flex-none px-2 py-1.5 border border-gray-300 rounded text-xs sm:text-sm min-w-0"
                        />
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs sm:text-sm text-gray-500 pl-7 sm:pl-0">Closed</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Action Buttons - Mobile Responsive */}
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
            <button
              onClick={onBack}
              className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors order-2 sm:order-1"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-lg hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center order-1 sm:order-2"
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