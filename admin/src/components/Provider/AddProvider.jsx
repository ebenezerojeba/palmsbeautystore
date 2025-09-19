// import { useState } from "react";
// import axios from 'axios'
// import { useContext } from "react";
// import { AdminContexts } from "../context/AdminContexts";
// import {toast} from 'react-toastify';
// import {X, ChevronDown,ChevronRight} from 'lucide-react'
//  // Add Provider Modal Component
//   export const AddProviderModal = ({ onClose, onAdd }) => {
//     const [formData, setFormData] = useState({
//       name: '',
//       email: '',
//       phone: '',
//       bio: '',
//       services: [],
//       workingHours: [
//         { dayOfWeek: 0, isWorking: false, startTime: '09:00', endTime: '17:00' },
//         { dayOfWeek: 1, isWorking: true, startTime: '09:00', endTime: '17:00' },
//         { dayOfWeek: 2, isWorking: true, startTime: '09:00', endTime: '17:00' },
//         { dayOfWeek: 3, isWorking: true, startTime: '09:00', endTime: '17:00' },
//         { dayOfWeek: 4, isWorking: true, startTime: '09:00', endTime: '17:00' },
//         { dayOfWeek: 5, isWorking: true, startTime: '09:00', endTime: '17:00' },
//         { dayOfWeek: 6, isWorking: false, startTime: '09:00', endTime: '17:00' }
//       ],
//       bookingBuffer: 15,
//       profileImage: null
//     });
//     const [errors, setErrors] = useState({});
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [showWorkingHours, setShowWorkingHours] = useState(false);
//     // const {backendUrl} = useContext(AdminContexts)
//     const backendUrl = "http://localhost:3000"

//       const addProvider = async (formData) => {
//         try {
//           const response = await axios.post(
//             `${backendUrl}/api/admin/createprovider`,
//             formData,
//             {
//               headers: {
//                 "Content-Type": "multipart/form-data",
//               },
//             }
//           );
//           return response.data;
//         } catch (error) {
//           console.error("Failed to add provider:", error);
//           throw error.response?.data || error;
//         }
//       }

//     const handleChange = (e) => {
//       const { name, value, type, checked } = e.target;
//       setFormData(prev => ({
//         ...prev,
//         [name]: type === 'checkbox' ? checked : value
//       }));

//       // Clear error when field is edited
//       if (errors[name]) {
//         setErrors(prev => ({
//           ...prev,
//           [name]: ''
//         }));
//       }
//     };

//     const handleServiceChange = (serviceId) => {
//       setFormData(prev => {
//         const services = [...prev.services];
//         const index = services.indexOf(serviceId);

//         if (index > -1) {
//           services.splice(index, 1);
//         } else {
//           services.push(serviceId);
//         }

//         return { ...prev, services };
//       });
//     };
//     const handleWorkingHoursChange = (dayIndex, field, value) => {
//       setFormData(prev => {
//         const workingHours = [...prev.workingHours];
//         workingHours[dayIndex] = {
//           ...workingHours[dayIndex],
//           [field]: value // Remove the string comparison, just use the value directly
//         };
//         return { ...prev, workingHours };
//       });
//     };

//     const handleImageChange = (e) => {
//   const file = e.target.files[0];
//   if (file) {
//     if (!file.type.startsWith('image/')) {
//       alert('Please select an image file');
//       return;
//     }
    
//     if (file.size > 5 * 1024 * 1024) {
//       alert('Image must be less than 5MB');
//       return;
//     }
    
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setFormData(prev => ({
//         ...prev,
//         profileImage: file,
//         profileImagePreview: reader.result // Add this line
//       }));
//     };
//     reader.readAsDataURL(file);
//   }
// };





//     const handleSubmit = async (e) => {
//       e.preventDefault();
//       setIsSubmitting(true)
//       try {
//         const payload = new FormData();
//         payload.append("name", formData.name);
//         payload.append("email", formData.email);
//         payload.append("phone", formData.phone);
//         payload.append("bio", formData.bio);
//         payload.append("bookingBuffer", formData.bookingBuffer);

//         // Fix: Don't stringify if services are ObjectIds
//         if (Array.isArray(formData.services)) {
//           formData.services.forEach(service => {
//             payload.append("services[]", service); // Send as array
//           });
//         }

//         // Fix: Don't stringify if workingHours is complex object
//         payload.append("workingHours", JSON.stringify(formData.workingHours));

//         if (formData.profileImage) {
//           payload.append("profileImage", formData.profileImage);
//         }

//         const result = await addProvider(payload);
//         toast.success(result.message)
//         console.log("Provider created:", result);
//       } catch (err) {
//         const errorMessage =
//           err.response?.data?.message || err.message || "Something went wrong";
//         toast.error(errorMessage);
//       }
//       finally{
//         setIsSubmitting(false)
//       }
      
//     };

//     const removeImage = () => {
//   setFormData(prev => ({
//     ...prev,
//     profileImage: null,
//     profileImagePreview: ''
//   }));
// };

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
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//         <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
//           <div className="flex items-center justify-between p-6 border-b border-gray-200">
//             <h3 className="text-lg font-semibold text-gray-900">Add New Provider</h3>
//             <button
//               onClick={onClose}
//               className="text-gray-400 hover:text-gray-600 transition-colors"
//               disabled={isSubmitting}
//             >
//               <X className="w-5 h-5" />
//             </button>
//           </div>

//           <form onSubmit={handleSubmit} className="p-6 space-y-4">


// {/* Profile Picture Upload */}
// <div className="mb-6">
//   <label className="block text-sm font-medium text-gray-700 mb-2">
//     Profile Picture
//   </label>
  
//   <div className="flex flex-col sm:flex-row sm:items-center gap-4">
//     {/* Image Preview with Edit Overlay */}
//     <div className="relative self-start sm:self-auto">
//       <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
//         {formData.profileImage ? (
//           <>
//         <img
//   src={formData.profileImagePreview || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&size=128&background=3b82f6&color=ffffff`}
//   alt="Profile preview"
//   className="w-full h-full object-cover"
// />
//             <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity duration-200 rounded-full flex items-center justify-center">
//               <span className="text-white text-xs font-medium text-center px-2">
//                 Change Image
//               </span>
//             </div>
//           </>
//         ) : (
//           <div className="flex flex-col items-center justify-center text-gray-400">
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//             </svg>
//             <span className="text-xs">No Image</span>
//           </div>
//         )}
//       </div>
//     </div>

//     {/* Upload Controls */}
//     <div className="flex-1">
//       <label
//         htmlFor="profileImage"
//         className="cursor-pointer inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//       >
//         <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
//         </svg>
//         {formData.profileImage ? 'Change Photo' : 'Upload Photo'}
//       </label>
//       <input
//         id="profileImage"
//         name="profileImage"
//         type="file"
//         accept="image/*"
//         className="sr-only"
//        onChange={handleImageChange}
//       />
      
//       <p className="mt-2 text-xs text-gray-500">
//         Recommended: Square JPG, PNG or GIF, at least 200x200 pixels, max 5MB
//       </p>
      
//       {formData.profileImage && (
//         <button
//           type="button"
//           className="mt-2 inline-flex items-center text-sm text-red-600 hover:text-red-800"
//           onClick={() => removeImage()}
//         >
//           <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//           </svg>
//           Remove Photo
//         </button>
//       )}
//     </div>
//   </div>
// </div>


//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Name *
//                 </label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleChange}
//                   className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent ${errors.name ? 'border-red-500' : 'border-gray-300'
//                     }`}
//                   disabled={isSubmitting}
//                 />
//                 {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Email *
//                 </label>
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent ${errors.email ? 'border-red-500' : 'border-gray-300'
//                     }`}
//                   disabled={isSubmitting}
//                 />
//                 {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Phone *
//                 </label>
//                 <input
//                   type="tel"
//                   name="phone"
//                   value={formData.phone}
//                   onChange={handleChange}
//                   className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent ${errors.phone ? 'border-red-500' : 'border-gray-300'
//                     }`}
//                   disabled={isSubmitting}
//                 />
//                 {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Booking Buffer (minutes)
//                 </label>
//                 <input
//                   type="number"
//                   name="bookingBuffer"
//                   value={formData.bookingBuffer}
//                   onChange={handleChange}
//                   min="0"
//                   max="60"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
//                   disabled={isSubmitting}
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Bio
//               </label>
//               <textarea
//                 name="bio"
//                 value={formData.bio}
//                 onChange={handleChange}
//                 rows={3}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
//                 disabled={isSubmitting}
//               />
//             </div>

// {/* 
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Services
//               </label>
//               <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto p-2 border border-gray-300 rounded-lg">
//                 {services.map(service => (
//                   <label key={service._id} className="flex items-center space-x-2">
//                     <input
//                       type="checkbox"
//                       checked={formData.services.includes(service._id)}
//                       onChange={() => handleServiceChange(service._id)}
//                       className="rounded text-gray-600 focus:ring-gray-500"
//                       disabled={isSubmitting}
//                     />
//                     <span className="text-sm text-gray-700">{service.title}</span>
//                   </label>
//                 ))}
//               </div>
//             </div> */}

//             <div>
//               <button
//                 type="button"
//                 onClick={() => setShowWorkingHours(!showWorkingHours)}
//                 className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-700 mb-2"
//               >
//                 {showWorkingHours ? (
//                   <ChevronDown className="w-4 h-4 mr-1" />
//                 ) : (
//                   <ChevronRight className="w-4 h-4 mr-1" />
//                 )}
//                 Working Hours
//               </button>

//               {showWorkingHours && (
//                 <div className="space-y-3 p-3 border border-gray-200 rounded-lg">
//                   {dayNames.map((dayName, index) => {
//                     const daySchedule =
//                       formData.workingHours[index] || {
//                         dayOfWeek: index,
//                         isWorking: false,
//                         startTime: "09:00",
//                         endTime: "17:00",
//                       };

//                     return (
//                       <div
//                         key={index}
//                         className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-2 bg-gray-50 rounded"
//                       >
//                         <div className="flex items-center space-x-3 w-full sm:w-32">
//                           <input
//                             type="checkbox"
//                             checked={daySchedule.isWorking}
//                             onChange={(e) =>
//                               handleWorkingHoursChange(index, "isWorking", e.target.checked)
//                             }
//                             className="h-4 w-4 text-gray-600 rounded focus:ring-gray-500"
//                             disabled={isSubmitting}
//                           />
//                           <span className="font-medium text-gray-700">{dayName}</span>
//                         </div>

//                         {daySchedule.isWorking ? (
//                           <div className="flex flex-col xs:flex-row items-center gap-2 w-full sm:w-auto">
//                             <input
//                               type="time"
//                               value={daySchedule.startTime}
//                               onChange={(e) =>
//                                 handleWorkingHoursChange(index, "startTime", e.target.value)
//                               }
//                               className="px-2 py-1 border border-gray-300 rounded text-sm w-full xs:w-28"
//                               disabled={isSubmitting}
//                             />
//                             <span className="text-gray-500">to</span>
//                             <input
//                               type="time"
//                               value={daySchedule.endTime}
//                               onChange={(e) =>
//                                 handleWorkingHoursChange(index, "endTime", e.target.value)
//                               }
//                               className="px-2 py-1 border border-gray-300 rounded text-sm w-full xs:w-28"
//                               disabled={isSubmitting}
//                             />
//                           </div>
//                         ) : (
//                           <span className="text-sm text-gray-500">Closed</span>
//                         )}
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>

//             <div className="flex space-x-3 pt-4">
//               <button
//                 type="button"
//                 onClick={onClose}
//                 className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
//                 disabled={isSubmitting}
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className="flex-1 px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-lg hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
//               >
//                 {isSubmitting ? (
//                   <>
//                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                     Adding...
//                   </>
//                 ) : (
//                   'Add Provider'
//                 )}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     );
//   };

















import React, { useState } from 'react';
import { X, ChevronDown, ChevronRight, UserPlus } from 'lucide-react';

const AddProviderModal = ({ 
  onClose, 
  onAdd,
  services,
  backendUrl
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    services: [],
    workingHours: [
      { dayOfWeek: 0, isWorking: false, startTime: '09:00', endTime: '17:00' },
      { dayOfWeek: 1, isWorking: true, startTime: '09:00', endTime: '17:00' },
      { dayOfWeek: 2, isWorking: true, startTime: '09:00', endTime: '17:00' },
      { dayOfWeek: 3, isWorking: true, startTime: '09:00', endTime: '17:00' },
      { dayOfWeek: 4, isWorking: true, startTime: '09:00', endTime: '17:00' },
      { dayOfWeek: 5, isWorking: true, startTime: '09:00', endTime: '17:00' },
      { dayOfWeek: 6, isWorking: false, startTime: '09:00', endTime: '17:00' }
    ],
    bookingBuffer: 15,
    profileImage: null,
    profileImagePreview: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showWorkingHours, setShowWorkingHours] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleServiceChange = (serviceId) => {
    setFormData(prev => {
      const services = [...prev.services];
      const index = services.indexOf(serviceId);

      if (index > -1) {
        services.splice(index, 1);
      } else {
        services.push(serviceId);
      }

      return { ...prev, services };
    });
  };

  const handleWorkingHoursChange = (dayIndex, field, value) => {
    setFormData(prev => {
      const workingHours = [...prev.workingHours];
      workingHours[dayIndex] = {
        ...workingHours[dayIndex],
        [field]: value
      };
      return { ...prev, workingHours };
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        alert('Image must be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          profileImage: file,
          profileImagePreview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      profileImage: null,
      profileImagePreview: ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("email", formData.email);
      payload.append("phone", formData.phone);
      payload.append("bio", formData.bio);
      payload.append("bookingBuffer", formData.bookingBuffer);

      if (Array.isArray(formData.services)) {
        formData.services.forEach(service => {
          payload.append("services[]", service);
        });
      }

      payload.append("workingHours", JSON.stringify(formData.workingHours));

      if (formData.profileImage) {
        payload.append("profileImage", formData.profileImage);
      }

      await onAdd(payload);
    } catch (error) {
      console.error('Error adding provider:', error);
    } finally {
      setIsSubmitting(false);
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Add New Provider</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isSubmitting}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Profile Picture Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Picture
            </label>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="relative self-start sm:self-auto">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
                  {formData.profileImagePreview ? (
                    <>
                      <img
                        src={formData.profileImagePreview}
                        alt="Profile preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity duration-200 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-medium text-center px-2">
                          Change Image
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <span className="text-xs">No Image</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1">
                <label
                  htmlFor="profileImage"
                  className="cursor-pointer inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  {formData.profileImagePreview ? 'Change Photo' : 'Upload Photo'}
                </label>
                <input
                  id="profileImage"
                  name="profileImage"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleImageChange}
                />
                
                <p className="mt-2 text-xs text-gray-500">
                  Recommended: Square JPG, PNG or GIF, at least 200x200 pixels, max 5MB
                </p>
                
                {formData.profileImagePreview && (
                  <button
                    type="button"
                    className="mt-2 inline-flex items-center text-sm text-red-600 hover:text-red-800"
                    onClick={removeImage}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Remove Photo
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                disabled={isSubmitting}
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                disabled={isSubmitting}
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                disabled={isSubmitting}
              />
              {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Booking Buffer (minutes)
              </label>
              <input
                type="number"
                name="bookingBuffer"
                value={formData.bookingBuffer}
                onChange={handleChange}
                min="0"
                max="60"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Services
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto p-2 border border-gray-300 rounded-lg">
              {services.map(service => (
                <label key={service._id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.services.includes(service._id)}
                    onChange={() => handleServiceChange(service._id)}
                    className="rounded text-gray-600 focus:ring-gray-500"
                    disabled={isSubmitting}
                  />
                  <span className="text-sm text-gray-700">{service.title}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={() => setShowWorkingHours(!showWorkingHours)}
              className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-700 mb-2"
            >
              {showWorkingHours ? (
                <ChevronDown className="w-4 h-4 mr-1" />
              ) : (
                <ChevronRight className="w-4 h-4 mr-1" />
              )}
              Working Hours
            </button>

            {showWorkingHours && (
              <div className="space-y-3 p-3 border border-gray-200 rounded-lg">
                {dayNames.map((dayName, index) => {
                  const daySchedule = formData.workingHours[index] || {
                    dayOfWeek: index,
                    isWorking: false,
                    startTime: "09:00",
                    endTime: "17:00",
                  };

                  return (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-2 bg-gray-50 rounded"
                    >
                      <div className="flex items-center space-x-3 w-full sm:w-32">
                        <input
                          type="checkbox"
                          checked={daySchedule.isWorking}
                          onChange={(e) =>
                            handleWorkingHoursChange(index, "isWorking", e.target.checked)
                          }
                          className="h-4 w-4 text-gray-600 rounded focus:ring-gray-500"
                          disabled={isSubmitting}
                        />
                        <span className="font-medium text-gray-700">{dayName}</span>
                      </div>

                      {daySchedule.isWorking ? (
                        <div className="flex flex-col xs:flex-row items-center gap-2 w-full sm:w-auto">
                          <input
                            type="time"
                            value={daySchedule.startTime}
                            onChange={(e) =>
                              handleWorkingHoursChange(index, "startTime", e.target.value)
                            }
                            className="px-2 py-1 border border-gray-300 rounded text-sm w-full xs:w-28"
                            disabled={isSubmitting}
                          />
                          <span className="text-gray-500">to</span>
                          <input
                            type="time"
                            value={daySchedule.endTime}
                            onChange={(e) =>
                              handleWorkingHoursChange(index, "endTime", e.target.value)
                            }
                            className="px-2 py-1 border border-gray-300 rounded text-sm w-full xs:w-28"
                            disabled={isSubmitting}
                          />
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">Closed</span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-lg hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Adding...
                </>
              ) : (
                'Add Provider'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProviderModal;