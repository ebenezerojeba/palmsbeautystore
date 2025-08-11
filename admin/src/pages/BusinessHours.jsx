// import React, { useState, useEffect, useContext } from 'react';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import { AdminContexts } from '../context/AdminContexts';

// const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// const AdminBusinessHours = ({ token }) => {
//   const [businessHours, setBusinessHours] = useState([]);
//   const [loading, setLoading] = useState(false);
//   // const {backendUrl} = useContext(AdminContexts);
//   const backendUrl = "https://palmsbeautystore-backend.onrender.com"
//   // const backendUrl = "http://localhost:3000"
//   // Load current hours
//   useEffect(() => {
//     fetchHours();
//   }, []);

//   const fetchHours = async () => {
//     try {
//       const { data } = await axios.get(`${backendUrl}/api/business/hours`);
//       setBusinessHours(data.businessHours);
//     } catch (err) {
//       toast.error("Failed to load business hours");
//     }
//   };

//   // Set default hours
//   const handleSetDefaultHours = async () => {
//     if (!window.confirm("This will overwrite all existing business hours. Continue?")) return;

//     try {
//       setLoading(true);
//       const { data } = await axios.post(
//         `${backendUrl}/api/business/defaulthours`,
//         {},
//         { headers: { token } }
//       );
//       toast.success(data.message);
//       fetchHours();
//     } catch (err) {
//       toast.error("Failed to set default hours");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Update custom hours
//   const handleUpdateHours = async () => {
//     try {
//       setLoading(true);
//       const { data } = await axios.put(
//         `${backendUrl}/api/business/updatehours`,
//         { businessHours },
//         { headers: { token } }
//       );
//       toast.success(data.message);
//     } catch (err) {
//       toast.error("Failed to update hours");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (index, field, value) => {
//     const updated = [...businessHours];
//     updated[index][field] = field === "isOpen" ? value === "true" : value;
//     setBusinessHours(updated);
//   };

//   return (
//     <div className="p-4 max-w-4xl mx-auto bg-white rounded shadow">
//       <h2 className="text-2xl font-bold mb-4">Manage Business Hours</h2>

//       <div className="overflow-x-auto">
//         <table className="min-w-full text-sm">
//           <thead>
//             <tr className="bg-gray-100 text-left">
//               <th className="p-2">Day</th>
//               <th className="p-2">Open</th>
//               <th className="p-2">Open Time</th>
//               <th className="p-2">Close Time</th>
//               <th className="p-2">Break Start</th>
//               <th className="p-2">Break End</th>
//               <th className="p-2">Slot Duration (min)</th>
//             </tr>
//           </thead>
//           <tbody>
//             {businessHours.map((hour, index) => (
//               <tr key={index} className="border-b">
//                 <td className="p-2">{days[hour.dayOfWeek]}</td>
//                 <td className="p-2">
//                   <select
//                     value={hour.isOpen}
//                     onChange={(e) => handleChange(index, "isOpen", e.target.value)}
//                     className="border p-1"
//                   >
//                     <option value="true">Yes</option>
//                     <option value="false">No</option>
//                   </select>
//                 </td>
//                 <td className="p-2">
//                   <input
//                     type="time"
//                     value={hour.openTime}
//                     onChange={(e) => handleChange(index, "openTime", e.target.value)}
//                     className="border p-1"
//                   />
//                 </td>
//                 <td className="p-2">
//                   <input
//                     type="time"
//                     value={hour.closeTime}
//                     onChange={(e) => handleChange(index, "closeTime", e.target.value)}
//                     className="border p-1"
//                   />
//                 </td>
//                 <td className="p-2">
//                   <input
//                     type="time"
//                     value={hour.breakStart || ''}
//                     onChange={(e) => handleChange(index, "breakStart", e.target.value)}
//                     className="border p-1"
//                   />
//                 </td>
//                 <td className="p-2">
//                   <input
//                     type="time"
//                     value={hour.breakEnd || ''}
//                     onChange={(e) => handleChange(index, "breakEnd", e.target.value)}
//                     className="border p-1"
//                   />
//                 </td>
//                 <td className="p-2">
//                   <input
//                     type="number"
//                     value={hour.slotDuration}
//                     onChange={(e) => handleChange(index, "slotDuration", e.target.value)}
//                     className="border p-1 w-20"
//                     min="15"
//                     step="15"
//                   />
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <div className="flex gap-4 mt-6">
//         <button
//           onClick={handleUpdateHours}
//           disabled={loading}
//           className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
//         >
//           {loading ? "Saving..." : "Save Business Hours"}
//         </button>

//         <button
//           onClick={handleSetDefaultHours}
//           disabled={loading}
//           className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
//         >
//           {loading ? "Setting..." : "Set Default Hours"}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default AdminBusinessHours;


import React, { useState, useEffect } from 'react';
import axios from 'axios';

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const AdminBusinessHours = ({ token }) => {
  const [businessHours, setBusinessHours] = useState([]);
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const backendUrl = "https://palmsbeautystore-backend.onrender.com";

  useEffect(() => {
    fetchHours();
  }, []);

  const fetchHours = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/business/hours`, {
        headers: { token }
      });
      if (data.businessHours && data.businessHours.length) {
        setBusinessHours(data.businessHours);
      } else {
        setBusinessHours(days.map((_, idx) => ({
          dayOfWeek: idx,
          isOpen: false,
          openTime: "09:00",
          closeTime: "17:00",
          breakStart: "",
          breakEnd: "",
          slotDuration: 30
        })));
      }
    } catch (err) {
      console.error("Failed to load business hours", err);
    } finally {
      setLoading(false);
    }
  };

  const calculateDayDuration = (hour) => {
    if (!hour.isOpen || !hour.openTime || !hour.closeTime) return 0;

    const [openHour, openMinute] = hour.openTime.split(':').map(Number);
    const [closeHour, closeMinute] = hour.closeTime.split(':').map(Number);

    const openTime = openHour * 60 + openMinute;
    const closeTime = closeHour * 60 + closeMinute;
    let totalDuration = closeTime - openTime;

    if (hour.breakStart && hour.breakEnd) {
      const [breakStartHour, breakStartMinute] = hour.breakStart.split(':').map(Number);
      const [breakEndHour, breakEndMinute] = hour.breakEnd.split(':').map(Number);
      const breakStart = breakStartHour * 60 + breakStartMinute;
      const breakEnd = breakEndHour * 60 + breakEndMinute;
      totalDuration -= breakEnd - breakStart;
    }
    return Math.max(0, totalDuration);
  };

  const validateHours = () => {
    const errors = {};
    businessHours.forEach((hour, index) => {
      const dayErrors = [];
      if (hour.isOpen) {
        if (hour.openTime >= hour.closeTime) {
          dayErrors.push('Close time must be after open time');
        }
        if (hour.breakStart && hour.breakEnd) {
          if (hour.breakStart >= hour.breakEnd) {
            dayErrors.push('Break end must be after break start');
          }
          if (hour.breakStart < hour.openTime || hour.breakEnd > hour.closeTime) {
            dayErrors.push('Break times must be within business hours');
          }
        }
        const dayDuration = calculateDayDuration(hour);
        if (dayDuration < 60) {
          dayErrors.push(`Day too short (${dayDuration} min). Minimum 60 minutes recommended.`);
        }
        if (dayDuration > 600) {
          dayErrors.push(`Very long day (${dayDuration} min = ${Math.round(dayDuration / 60)}h). Consider if this is intentional.`);
        }
        if (hour.slotDuration < 15) {
          dayErrors.push('Slot duration should be at least 15 minutes');
        }
        if (hour.slotDuration > dayDuration) {
          dayErrors.push('Slot duration cannot be longer than business day');
        }
      }
      if (dayErrors.length > 0) {
        errors[index] = dayErrors;
      }
    });
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSetDefaultHours = async () => {
    if (!window.confirm("This will overwrite all existing business hours. Continue?")) return;
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${backendUrl}/api/business/defaulthours`,
        {},
        { headers: { token } }
      );
      console.log(data.message);
      fetchHours();
      setValidationErrors({});
    } catch (err) {
      console.error("Failed to set default hours", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateHours = async () => {
    if (!validateHours()) {
      console.error("Please fix validation errors before saving");
      return;
    }
    try {
      setLoading(true);
      const { data } = await axios.put(
        `${backendUrl}/api/business/updatehours`,
        { businessHours },
        { headers: { token } }
      );
      console.log(data.message);
      setValidationErrors({});
    } catch (err) {
      console.error("Failed to update hours", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (index, field, value) => {
    const updated = [...businessHours];
    updated[index][field] = field === "isOpen" ? value === "true" : value;
    setBusinessHours(updated);
    if (validationErrors[index]) {
      const newErrors = { ...validationErrors };
      delete newErrors[index];
      setValidationErrors(newErrors);
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Manage Business Hours</h2>

      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded">
        <h3 className="font-semibold text-blue-800 mb-2">Important Notes:</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Services longer than 10 hours (600 minutes) cannot be booked online</li>
          <li>• Slot duration determines booking intervals (recommended: 30-90 minutes)</li>
          <li>• Break times will block appointments during those hours</li>
          <li>• Very long business days may affect system performance</li>
        </ul>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">Day</th>
              <th className="p-2">Open</th>
              <th className="p-2">Open Time</th>
              <th className="p-2">Close Time</th>
              <th className="p-2">Break Start</th>
              <th className="p-2">Break End</th>
              <th className="p-2">Slot Duration (min)</th>
              <th className="p-2">Day Duration</th>
            </tr>
          </thead>
          <tbody>
            {businessHours.map((hour, index) => {
              const dayDuration = calculateDayDuration(hour);
              const hasErrors = validationErrors[index];
              return (
                <tr key={index} className={`border-b ${hasErrors ? 'bg-red-50' : ''}`}>
                  <td className="p-2 font-medium">{days[hour.dayOfWeek]}</td>
                  <td className="p-2">
                    <select
                      value={hour.isOpen}
                      onChange={(e) => handleChange(index, "isOpen", e.target.value)}
                      className="border p-1 rounded"
                    >
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </td>
                  <td className="p-2">
                    <input
                      type="time"
                      value={hour.openTime}
                      onChange={(e) => handleChange(index, "openTime", e.target.value)}
                      className="border p-1 rounded"
                      disabled={!hour.isOpen}
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="time"
                      value={hour.closeTime}
                      onChange={(e) => handleChange(index, "closeTime", e.target.value)}
                      className="border p-1 rounded"
                      disabled={!hour.isOpen}
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="time"
                      value={hour.breakStart || ''}
                      onChange={(e) => handleChange(index, "breakStart", e.target.value)}
                      className="border p-1 rounded"
                      disabled={!hour.isOpen}
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="time"
                      value={hour.breakEnd || ''}
                      onChange={(e) => handleChange(index, "breakEnd", e.target.value)}
                      className="border p-1 rounded"
                      disabled={!hour.isOpen}
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      value={hour.slotDuration}
                      onChange={(e) => handleChange(index, "slotDuration", e.target.value)}
                      className="border p-1 w-20 rounded"
                      min="15"
                      step="15"
                      disabled={!hour.isOpen}
                    />
                  </td>
                  <td className="p-2">
                    <span className={`text-xs px-2 py-1 rounded ${
                      !hour.isOpen ? 'bg-gray-200 text-gray-600' :
                      dayDuration < 60 ? 'bg-red-200 text-red-700' :
                      dayDuration > 600 ? 'bg-yellow-200 text-yellow-700' :
                      'bg-green-200 text-green-700'
                    }`}>
                      {hour.isOpen ? `${dayDuration} min (${Math.round(dayDuration/60*10)/10}h)` : 'Closed'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {Object.keys(validationErrors).length > 0 && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
          <h3 className="font-semibold text-red-800 mb-2">Validation Errors:</h3>
          {Object.entries(validationErrors).map(([index, errors]) => (
            <div key={index} className="mb-2">
              <div className="font-medium text-red-700">{days[businessHours[index]?.dayOfWeek]}:</div>
              <ul className="text-sm text-red-600 ml-4">
                {errors.map((error, i) => (
                  <li key={i}>• {error}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-4 mt-6">
        <button
          onClick={handleUpdateHours}
          disabled={loading || Object.keys(validationErrors).length > 0}
          className={`py-2 px-4 rounded text-white ${
            loading || Object.keys(validationErrors).length > 0
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {loading ? "Saving..." : "Save Business Hours"}
        </button>

        <button
          onClick={handleSetDefaultHours}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded disabled:bg-gray-400"
        >
          {loading ? "Setting..." : "Set Default Hours"}
        </button>

        <button
          onClick={validateHours}
          className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded"
        >
          Validate Hours
        </button>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded">
        <h3 className="font-semibold mb-2">Weekly Summary:</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Open Days:</span>
            <span className="ml-2 font-medium">
              {businessHours.filter(h => h.isOpen).length} / 7
            </span>
          </div>
          <div>
            <span className="text-gray-600">Total Hours:</span>
            <span className="ml-2 font-medium">
              {Math.round(businessHours.reduce((total, h) => total + calculateDayDuration(h), 0) / 60 * 10) / 10}h
            </span>
          </div>
          <div>
            <span className="text-gray-600">Longest Day:</span>
            <span className="ml-2 font-medium">
              {Math.round(Math.max(...businessHours.map(calculateDayDuration)) / 60 * 10) / 10}h
            </span>
          </div>
          <div>
            <span className="text-gray-600">Max Service:</span>
            <span className="ml-2 font-medium">
              {Math.min(600, Math.max(...businessHours.map(calculateDayDuration)))} min
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBusinessHours;





