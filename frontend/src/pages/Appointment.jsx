// import React, { useContext, useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { AppContext } from "../context/AppContext";
// import { toast } from "react-toastify";
// import BookingModal from "../components/BookingModal";
// import { Loader } from "lucide-react";
// import { ShopContext } from "../context/ShopContext";

// const Appointment = () => {
//   const { id } = useParams();
//   const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
//   const navigate = useNavigate();
//   const { backendUrl } = useContext(AppContext);
//   const {formatNaira} = useContext(ShopContext);

//   const [serviceInfo, setServiceInfo] = useState(null);
//   const [serviceSlot, setServiceSlot] = useState([]);
//   const [slotIndex, setSlotIndex] = useState(0);
//   const [slotTime, setSlotTime] = useState("");
//   const [bookedSlots, setBookedSlots] = useState([]);
//   const [showConfirmation, setShowConfirmation] = useState(false);
//   const [confirmationDetails, setConfirmationDetails] = useState(null);
//   const [calendarLink, setCalendarLink] = useState(null);
//   const [isBooking, setIsBooking] = useState(false);

//   useEffect(() => {
//     const fetchService = async () => {
//       try {
//         const res = await fetch(`${backendUrl}/api/services/services/${id}`);
//         const data = await res.json();
//         if (data.service) {
//           setServiceInfo(data.service);
//         } else {
//           toast.error("Service not found");
//         }
//       } catch (err) {
//         toast.error("Failed to fetch service");
//       }
//     };

//     const fetchBookedSlots = async () => {
//       try {
//         const res = await fetch(`${backendUrl}/api/appointment/booked-slots`);
//         const data = await res.json();
//         setBookedSlots(data);
//       } catch (err) {
//         toast.error("Failed to fetch booked slots");
//       }
//     };

//     fetchService();
//     fetchBookedSlots();
//   }, [id, backendUrl]);

//   const isSlotBooked = (datetime, time) => {
//     const dateString = datetime.toISOString().split("T")[0];
//     return bookedSlots.some(
//       (slot) => slot.date === dateString && slot.time === time
//     );
//   };




//   const getAvailableSlot = () => {
//     let today = new Date();
//     let currentHour = today.getHours();
//     let currentMinutes = today.getMinutes();
//     let slots = [];

//     for (let i = 0; i < 10; i++) {
//       let currentDate = new Date(today);
//       currentDate.setDate(today.getDate() + i);
//       let dayOfWeek = currentDate.getDay();

//       if (dayOfWeek === 0) continue; // Closed on Sunday

//       let startTime = new Date(currentDate);
//       let endTime = new Date(currentDate);

//       startTime.setHours(dayOfWeek === 6 ? 12 : 9, 0, 0, 0); // Sat: 12pm, others: 9am
//       endTime.setHours(22, 0, 0, 0); // 10pm

//       let timeSlots = [];
//       while (startTime < endTime) {
//         let formattedTime = startTime.toLocaleTimeString([], {
//           hour: "2-digit",
//           minute: "2-digit",
//         });

//         if (
//           i === 0 &&
//           (startTime.getHours() < currentHour ||
//             (startTime.getHours() === currentHour &&
//               startTime.getMinutes() < currentMinutes))
//         ) {
//           startTime.setMinutes(startTime.getMinutes() + 90);
//           continue;
//         }

//         if (!isSlotBooked(startTime, formattedTime)) {
//           timeSlots.push({
//             datetime: new Date(startTime),
//             time: formattedTime,
//           });
//         }

//         startTime.setMinutes(startTime.getMinutes() + 90);
//       }

//       if (timeSlots.length > 0) {
//         slots.push(timeSlots);
//       }
//     }

//     setServiceSlot(slots);
//   };

//   useEffect(() => {
//     if (serviceInfo && bookedSlots.length >= 0) {
//       getAvailableSlot();
//     }
//   }, [serviceInfo, bookedSlots]);

//   useEffect(() => {
//     setSlotTime("");
//   }, [slotIndex]);

//   const handleBooking = async () => {
//     if (!slotTime) return toast.warn("Please select a time slot");
//     if (!userDetails.name || !userDetails.email || !userDetails.phone) {
//       return toast.warn("Please fill in all required fields");
//     }

//     const selectedDate = serviceSlot[slotIndex][0].datetime
//       .toISOString()
//       .split("T")[0];

//     if (isSlotBooked(serviceSlot[slotIndex][0].datetime, slotTime)) {
//       toast.error("Slot has just been booked. Try another.");
//       getAvailableSlot();
//       return;
//     }

//     const bookingData = {
//       userId,
//       serviceId: serviceInfo._id,
//       serviceTitle: serviceInfo.title,
//       duration: serviceInfo.duration,
//       date: selectedDate,
//       time: slotTime,
      
//     };

//     setIsBooking(true);

//     try {
//       const res = await fetch(`${backendUrl}/api/appointment/book-appointment`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(bookingData),
//       });

//       if (res.ok) {
//         const data = await res.json();
//         toast.success("Appointment booked successfully!");
//         setCalendarLink(data.calendarLink);
//         setBookedSlots([
//           ...bookedSlots,
//           { date: selectedDate, time: slotTime, serviceId: serviceInfo._id },
//         ]);
//         getAvailableSlot();
//         setSlotTime("");
//         setConfirmationDetails({
//           ...bookingData,
//           price: serviceInfo.price,
//         });
//         setShowConfirmation(true);
//       } else {
//         toast.error("Booking failed. Please try again.");
//       }
//     } catch (err) {
//       toast.error("Something went wrong. Please try again.");
//     } finally {
//       setIsBooking(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-6 px-4 sm:py-12 sm:px-6 lg:px-8">
//       <div className="max-w-xl mx-auto">
//         <div className="bg-white rounded-xl shadow-md overflow-hidden">
//           <div className="p-4 sm:p-8">
//             {serviceInfo?.image && (
//               <div className="relative h-48 sm:h-64 mb-4 overflow-hidden rounded-lg">
//                 <img
//                   src={serviceInfo.image}
//                   alt={serviceInfo.title}
//                   className="object-cover w-full h-full"
//                 />
//               </div>
//             )}
//             <h1 className="text-3xl font-bold text-gray-900 mb-2">
//               {serviceInfo?.title}
//             </h1>
//             <p className="text-gray-600 text-lg">{serviceInfo?.description}</p>
//           </div>
//           <div className="px-4 sm:px-8 py-4 bg-gray-50 border-t">
//             <div className="flex items-baseline">
//               <span className="text-gray-700 font-medium">Price:</span>
//               <span className="ml-2 text-2xl font-bold text-gray-900">
//                 {formatNaira(serviceInfo?.price? serviceInfo.price : 0)}
//               </span>
//             </div>
//             <div className="mt-4 text-gray-600 font-medium">
//               Duration: {serviceInfo?.duration}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Slots & Booking */}
//       <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
//         <p>Available Booking Slots</p>
//         <div className="flex gap-3 overflow-x-scroll mt-4 scrollbar-hide">
//           {serviceSlot.length > 0 ? (
//             serviceSlot.map((daySlots, index) => (
//               <div
//                 key={index}
//                 className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
//                   slotIndex === index ? "bg-gray-700 text-white" : "border-gray-400"
//                 }`}
//                 onClick={() => setSlotIndex(index)}
//               >
//                 <p>{daysOfWeek[daySlots[0].datetime.getDay()]}</p>
//                 <p>{daySlots[0].datetime.getDate()}</p>
//               </div>
//             ))
//           ) : (
//             <p className="text-gray-500">No available slots for the next 10 days</p>
//           )}
//         </div>

//         <div className="flex flex-wrap gap-3 mt-4">
//           {serviceSlot[slotIndex]?.map((item, index) => (
//             <p
//               key={index}
//               onClick={() => setSlotTime(item.time)}
//               className={`text-sm font-light px-5 py-2 rounded-full cursor-pointer ${
//                 item.time === slotTime
//                   ? "bg-gray-700 text-white text-lg"
//                   : "text-gray-400 border border-gray-400"
//               }`}
//             >
//               {item.time.toLowerCase()}
//             </p>
//           ))}
//         </div>

//         <div className="mt-8">
//           <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Details</h2>
//           <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
//             <input
//               type="text"
//               placeholder="Full Name"
//               value={userDetails.name}
//               onChange={(e) =>
//                 setUserDetails({ ...userDetails, name: e.target.value })
//               }
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-700"
//               required
//             />
//             <input
//               type="email"
//               placeholder="Email Address"
//               value={userDetails.email}
//               onChange={(e) =>
//                 setUserDetails({ ...userDetails, email: e.target.value })
//               }
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-700"
//               required
//             />
//             <input
//               type="tel"
//               placeholder="Phone Number"
//               value={userDetails.phone}
//               onChange={(e) =>
//                 setUserDetails({ ...userDetails, phone: e.target.value })
//               }
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-700"
//               required
//             />
//           </form>
//         </div>

//         <button
//           disabled={isBooking}
//           onClick={handleBooking}
//           className="w-full mt-8 bg-gray-800 text-white py-3 px-6 rounded-lg font-semibold tracking-wide transition duration-200 hover:bg-gray-700 focus:ring-4 focus:ring-gray-200 disabled:opacity-50"
//         >
//           {isBooking ? <Loader /> : "Book Appointment"}
//         </button>

//         <BookingModal
//           isOpen={showConfirmation}
//           onClose={() => setShowConfirmation(false)}
//           bookingDetails={confirmationDetails}
//           onDownloadCalendar={() => {
//             if (calendarLink) {
//               window.open(
//                 `${backendUrl}/api/appointment${calendarLink}`,
//                 "_blank"
//               );
//             }
//           }}
//         />
//       </div>
//     </div>
//   );
// };

// export default Appointment;






















// import React, { useState, useEffect, useContext } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { AppContext } from "../context/AppContext";
// import { ShopContext } from "../context/ShopContext";
// import { toast } from "react-toastify";
// import { 
//   Loader, 
//   Calendar, 
//   Clock, 
//   User, 
//   Mail, 
//   Phone, 
//   CreditCard,
//   AlertCircle,
//   CheckCircle,
//   XCircle
// } from "lucide-react";

// const Appointment = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { backendUrl, userData } = useContext(AppContext);
//   const { formatNaira } = useContext(ShopContext);

//   // Service and user state
//   const [serviceInfo, setServiceInfo] = useState(null);
//   // const [userId, setUserId] = useState("user123"); // Replace with actual user context
  
//   // Appointment booking state
//   const [availableSlots, setAvailableSlots] = useState([]);
//   const [selectedDate, setSelectedDate] = useState("");
//   const [selectedTime, setSelectedTime] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [isBooking, setIsBooking] = useState(false);
  
  
//   // Payment and confirmation state
//   const [showPayment, setShowPayment] = useState(false);
//   const [paymentUrl, setPaymentUrl] = useState("");
//   const [appointmentId, setAppointmentId] = useState("");

//   // Fetch service information
//   useEffect(() => {
//     const fetchService = async () => {
//       try {
//         const res = await fetch(`${backendUrl}/api/services/services/${id}`);
//         const data = await res.json();
//         if (data.service) {
//           setServiceInfo(data.service);
//         } else {
//           toast.error("Service not found");
//           navigate("/services");
//         }
//       } catch (err) {
//         toast.error("Failed to fetch service details");
//         navigate("/services");
//       }
//     };

//     if (id) {
//       fetchService();
//     }
//   }, [id, backendUrl, navigate]);

//   // Fetch available slots
//   useEffect(() => {
//     const fetchAvailableSlots = async () => {
//       if (!serviceInfo) return;
      
//       setIsLoading(true);
//       try {
//         const startDate = new Date().toISOString().split('T')[0];
//         const endDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        
//         const res = await fetch(
//           `${backendUrl}/api/appointment/available-slots?serviceId=${id}&startDate=${startDate}&endDate=${endDate}`
//         );
//         const data = await res.json();
        
//         if (data.availableSlots) {
//           setAvailableSlots(data.availableSlots);
//         }
//       } catch (err) {
//         toast.error("Failed to fetch available slots");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchAvailableSlots();
//   }, [serviceInfo, id, backendUrl]);


//   // Handle appointment booking
//  const handleBooking = async () => {
//   if (!selectedDate || !selectedTime) {
//     toast.warn("Please select a date and time");
//     return;
//   }

//   if (!userData) {
//     toast.warn("User information not available");
//     return;
//   }
//       // 1. Get token from where you stored it (e.g., localStorage)
//     const token = localStorage.getItem('token'); // Most common case
    
//     // 2. Verify token exists
//     if (!token) {
//       alert("Please log in first!");
//       return;
//     }

//   setIsBooking(true);
  
//   try {
//  const bookingData = {
//   serviceId: serviceInfo._id,
//   serviceTitle: serviceInfo.title,
//   date: selectedDate,
//   time: selectedTime,
//   duration: serviceInfo.duration || 90,
//   amount: serviceInfo.price
// };

//     const res = await fetch(`${backendUrl}/api/appointment/book-appointment`, {
//       method: "POST",
//         headers: {
//     'Content-Type': 'application/json',
//     'Authorization': `Bearer ${token}`  // ⚠️ MUST INCLUDE THIS
//   },
//       body: JSON.stringify(bookingData),
//     });

//     const data = await res.json(); // Add this line to parse the response

//     if (res.ok) {
//       setAppointmentId(data.appointment._id);
//       setPaymentUrl(data.paymentUrl);
//       setShowPayment(true);
//       toast.success("Appointment created! Please complete payment to confirm.");
//     } else {
//       toast.error(data.message || "Booking failed. Please try again.");
//     }
//   } catch (err) {
//     console.error("Booking error:", err);
//     toast.error("Something went wrong. Please try again.");
//   } finally {
//     setIsBooking(false);
//   }
// };

//   // Handle payment redirect
//   const handlePayment = () => {
//     if (paymentUrl) {
//       window.location.href = paymentUrl;
//     }
//   };

//   // Format date for display
//   const formatDate = (dateStr) => {
//     const date = new Date(dateStr);
//     return date.toLocaleDateString('en-US', {
//       weekday: 'long',
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric'
//     });
//   };

//   if (!serviceInfo) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <Loader className="animate-spin h-8 w-8 text-gray-600" />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
//       <div className="max-w-4xl mx-auto">
//         {/* Service Information Card */}
//         <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
//           {serviceInfo.image && (
//             <div className="relative h-64 md:h-80">
//               <img
//                 src={serviceInfo.image}
//                 alt={serviceInfo.title}
//                 className="w-full h-full object-cover"
//               />
//               <div className="absolute inset-0 bg-black bg-opacity-30"></div>
//               <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
//                 <h1 className="text-3xl md:text-4xl font-bold mb-2">
//                   {serviceInfo.title}
//                 </h1>
//                 <p className="text-lg opacity-90">{serviceInfo.description}</p>
//               </div>
//             </div>
//           )}
          
//           <div className="p-6">
//             <div className="grid md:grid-cols-2 gap-6">
//               <div className="flex items-center space-x-4">
//                 <CreditCard className="h-6 w-6 text-green-600" />
//                 <div>
//                   <p className="text-sm text-gray-600">Price</p>
//                   <p className="text-2xl font-bold text-gray-900">
//                     {formatNaira(serviceInfo.price)}
//                   </p>
//                 </div>
//               </div>
              
//               <div className="flex items-center space-x-4">
//                 <Clock className="h-6 w-6 text-blue-600" />
//                 <div>
//                   <p className="text-sm text-gray-600">Duration</p>
//                   <p className="text-lg font-semibold text-gray-900">
//                     {serviceInfo.duration || 90} 
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="grid lg:grid-cols-2 gap-8">
//           {/* Booking Form */}
//           <div className="bg-white rounded-2xl shadow-lg p-6">
//             <h2 className="text-2xl font-bold text-gray-900 mb-6">
//               Book Your Appointment
//             </h2>

//             {/* Date Selection */}
//             <div className="mb-6">
//               <label className="block text-sm font-medium text-gray-700 mb-3">
//                 <Calendar className="inline h-4 w-4 mr-2" />
//                 Select Date
//               </label>
              
//               {isLoading ? (
//                 <div className="flex items-center justify-center py-8">
//                   <Loader className="animate-spin h-6 w-6 text-gray-600" />
//                   <span className="ml-2 text-gray-600">Loading available dates...</span>
//                 </div>
//               ) : availableSlots.length > 0 ? (
//                 <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
//                   {availableSlots.map((daySlot, index) => (
//                     <button
//                       key={index}
//                       onClick={() => {
//                         setSelectedDate(daySlot.date);
//                         setSelectedTime("");
//                       }}
//                       className={`p-3 rounded-lg border text-center transition-all ${
//                         selectedDate === daySlot.date
//                           ? "bg-blue-600 text-white border-blue-600"
//                           : "bg-gray-50 text-gray-700 border-gray-200 hover:border-blue-300"
//                       }`}
//                     >
//                       <div className="text-xs font-medium">
//                         {daySlot.dayOfWeek}
//                       </div>
//                       <div className="text-sm">
//                         {new Date(daySlot.date).getDate()}
//                       </div>
//                     </button>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="text-center py-8 text-gray-500">
//                   <AlertCircle className="h-8 w-8 mx-auto mb-2" />
//                   <p>No available slots in the next 14 days</p>
//                 </div>
//               )}
//             </div>

//             {/* Time Selection */}
//             {selectedDate && (
//               <div className="mb-6">
//                 <label className="block text-sm font-medium text-gray-700 mb-3">
//                   <Clock className="inline h-4 w-4 mr-2" />
//                   Select Time
//                 </label>
                
//                 {(() => {
//                   const selectedDay = availableSlots.find(slot => slot.date === selectedDate);
//                   return selectedDay ? (
//                     <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
//                       {selectedDay.slots.map((timeSlot, index) => (
//                         <button
//                           key={index}
//                           onClick={() => setSelectedTime(timeSlot.time)}
//                           className={`p-2 rounded-lg text-sm transition-all ${
//                             selectedTime === timeSlot.time
//                               ? "bg-blue-600 text-white"
//                               : "bg-gray-100 text-gray-700 hover:bg-blue-100"
//                           }`}
//                         >
//                           {timeSlot.time}
//                         </button>
//                       ))}
//                     </div>
//                   ) : null;
//                 })()}
//               </div>
//             )}
//             </div>

//             {/* Book Button */}
//          <button
//   onClick={handleBooking}
//   disabled={isBooking || !selectedDate || !selectedTime}
//   className="mt-6 w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold tracking-wide transition duration-200 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
// >
//   {isBooking ? (
//     <>
//       <Loader className="animate-spin h-5 w-5 mr-2" />
//       Creating Appointment...
//     </>
//   ) : (
//     `Book Appointment - ${formatNaira(serviceInfo.price)}`
//   )}
// </button>

//           </div>

//           {/* Appointment Summary */}
//           <div className="bg-white rounded-2xl shadow-lg p-6">
//             <h3 className="text-xl font-bold text-gray-900 mb-6">
//               Appointment Summary
//             </h3>
            
//             {selectedDate && selectedTime ? (
//               <div className="space-y-4">
//                 <div className="p-4 bg-blue-50 rounded-lg">
//                   <div className="flex items-center space-x-3 mb-2">
//                     <Calendar className="h-5 w-5 text-blue-600" />
//                     <span className="font-medium text-blue-900">
//                       {formatDate(selectedDate)}
//                     </span>
//                   </div>
//                   <div className="flex items-center space-x-3">
//                     <Clock className="h-5 w-5 text-blue-600" />
//                     <span className="font-medium text-blue-900">
//                       {selectedTime}
//                     </span>
//                   </div>
//                 </div>
                
//                 <div className="space-y-3 text-sm">
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Service:</span>
//                     <span className="font-medium">{serviceInfo.title}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Duration:</span>
//                     <span className="font-medium">{serviceInfo.duration || 90} </span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Price:</span>
//                     <span className="font-bold text-lg">{formatNaira(serviceInfo.price)}</span>
//                   </div>
//                 </div>
               
//               </div>
//             ) : (
//               <div className="text-center py-8 text-gray-500">
//                 <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
//                 <p>Select a date and time to see your appointment summary</p>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Payment Modal */}
//         {showPayment && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//             <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
//               <div className="text-center">
//                 <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
//                 <h3 className="text-xl font-bold text-gray-900 mb-2">
//                   Appointment Created!
//                 </h3>
//                 <p className="text-gray-600 mb-6">
//                   Please complete your payment to confirm your appointment.
//                 </p>
                
//                 <div className="space-y-3 mb-6">
//                   <button
//                     onClick={handlePayment}
//                     className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition duration-200"
//                   >
//                     Pay Now - {formatNaira(serviceInfo.price)}
//                   </button>
                  
        
//                 </div>
                
//                 <p className="text-xs text-gray-500">
//                   Your appointment slot is reserved for 15 minutes. 
//                   Please complete payment to confirm.
//                 </p>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
  
//   );
// };

// export default Appointment;





























import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import { 
  Loader, 
  Calendar, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  CreditCard,
  AlertCircle,
  CheckCircle,
  XCircle,
  ChevronRight,
  Info
} from "lucide-react";

const Appointment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { backendUrl, userData } = useContext(AppContext);
  const { formatNaira } = useContext(ShopContext);

  const [serviceInfo, setServiceInfo] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState("");
  const [appointmentId, setAppointmentId] = useState("");
  const [activeTab, setActiveTab] = useState("details"); // 'details' or 'summary'

  // Fetch service information
  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/services/services/${id}`);
        const data = await res.json();
        if (data.service) {
          setServiceInfo(data.service);
        } else {
          toast.error("Service not found");
          navigate("/services");
        }
      } catch (err) {
        toast.error("Failed to fetch service details");
        navigate("/services");
      }
    };

    if (id) {
      fetchService();
    }
  }, [id, backendUrl, navigate]);

  // Fetch available slots
  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (!serviceInfo) return;
      
      setIsLoading(true);
      try {
        const startDate = new Date().toISOString().split('T')[0];
        const endDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        
        const res = await fetch(
          `${backendUrl}/api/appointment/available-slots?serviceId=${id}&startDate=${startDate}&endDate=${endDate}`
        );
        const data = await res.json();
        
        if (data.availableSlots) {
          setAvailableSlots(data.availableSlots);
        }
      } catch (err) {
        toast.error("Failed to fetch available slots");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAvailableSlots();
  }, [serviceInfo, id, backendUrl]);

  // Handle appointment booking
  const handleBooking = async () => {
    if (!selectedDate || !selectedTime) {
      toast.warn("Please select a date and time");
      return;
    }

    if (!userData) {
      toast.warn("User information not available");
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please log in first!");
      return;
    }

    setIsBooking(true);
    
    try {
      const bookingData = {
        serviceId: serviceInfo._id,
        serviceTitle: serviceInfo.title,
        date: selectedDate,
        time: selectedTime,
        duration: serviceInfo.duration || 90,
        amount: serviceInfo.price
      };

      const res = await fetch(`${backendUrl}/api/appointment/book-appointment`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bookingData),
      });

      const data = await res.json();

      if (res.ok) {
        setAppointmentId(data.appointment._id);
        setPaymentUrl(data.paymentUrl);
        setShowPayment(true);
        toast.success("Appointment created! Please complete payment to confirm.");
      } else {
        toast.error(data.message || "Booking failed. Please try again.");
      }
    } catch (err) {
      console.error("Booking error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsBooking(false);
    }
  };

  const handlePayment = () => {
    if (paymentUrl) {
      window.location.href = paymentUrl;
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!serviceInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader className="animate-spin h-8 w-8 text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Service Header */}
        <div className="flex items-center mb-6">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ChevronRight className="rotate-180 h-5 w-5 mr-1" />
            Back to services
          </button>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Service Details */}
          <div className="lg:w-2/3">
            {/* Service Card */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8 transition-all hover:shadow-lg">
              {serviceInfo.image && (
                <div className="relative h-64 md:h-80">
                  <img
                    src={serviceInfo.image}
                    alt={serviceInfo.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">
                      {serviceInfo.title}
                    </h1>
                    <p className="text-lg opacity-90 max-w-2xl">{serviceInfo.description}</p>
                  </div>
                </div>
              )}
              
              <div className="p-6">
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center space-x-4 bg-blue-50/50 p-4 rounded-lg flex-1 min-w-[200px]">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <CreditCard className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Price</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatNaira(serviceInfo.price)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 bg-indigo-50/50 p-4 rounded-lg flex-1 min-w-[200px]">
                    <div className="p-3 bg-indigo-100 rounded-full">
                      <Clock className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Duration</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {serviceInfo.duration || 90} minutes
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Tabs */}
            <div className="lg:hidden mb-6 bg-white rounded-xl shadow-sm p-1">
              <div className="flex">
                <button
                  onClick={() => setActiveTab("details")}
                  className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === "details" 
                      ? "bg-blue-600 text-white" 
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                >
                  Booking Details
                </button>
                <button
                  onClick={() => setActiveTab("summary")}
                  className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === "summary" 
                      ? "bg-blue-600 text-white" 
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                >
                  Appointment Summary
                </button>
              </div>
            </div>

            {/* Booking Form (Visible on mobile when details tab is active) */}
            <div className={`lg:block ${activeTab !== "details" && "hidden lg:block"}`}>
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Calendar className="h-6 w-6 mr-2 text-blue-600" />
                  Book Your Appointment
                </h2>

                {/* Date Selection */}
                <div className="mb-8">
                  <label className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                    Select Date
                  </label>
                  
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-8">
                      <Loader className="animate-spin h-8 w-8 text-blue-600 mb-3" />
                      <span className="text-gray-600">Loading available dates...</span>
                    </div>
                  ) : availableSlots.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {availableSlots.map((daySlot, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setSelectedDate(daySlot.date);
                            setSelectedTime("");
                          }}
                          className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center ${
                            selectedDate === daySlot.date
                              ? "bg-blue-600 text-white border-blue-600 shadow-md"
                              : "bg-gray-50 text-gray-700 border-gray-200 hover:border-blue-300 hover:shadow-sm"
                          }`}
                        >
                          <div className="text-xs font-medium opacity-80">
                            {daySlot.dayOfWeek.substring(0, 3)}
                          </div>
                          <div className="text-lg font-bold mt-1">
                            {new Date(daySlot.date).getDate()}
                          </div>
                          <div className="text-xs mt-1 opacity-70">
                            {new Date(daySlot.date).toLocaleString('default', { month: 'short' })}
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                      <AlertCircle className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p>No available slots in the next 14 days</p>
                    </div>
                  )}
                </div>

                {/* Time Selection */}
                {selectedDate && (
                  <div className="mb-8">
                    <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-blue-500" />
                      Select Time
                    </label>
                    
                    {(() => {
                      const selectedDay = availableSlots.find(slot => slot.date === selectedDate);
                      return selectedDay ? (
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                          {selectedDay.slots.map((timeSlot, index) => (
                            <button
                              key={index}
                              onClick={() => setSelectedTime(timeSlot.time)}
                              className={`p-3 rounded-lg text-sm font-medium transition-all ${
                                selectedTime === timeSlot.time
                                  ? "bg-blue-600 text-white shadow-md"
                                  : "bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-700"
                              }`}
                            >
                              {timeSlot.time}
                            </button>
                          ))}
                        </div>
                      ) : null;
                    })()}
                  </div>
                )}

                {/* Book Button */}
                <button
                  onClick={handleBooking}
                  disabled={isBooking || !selectedDate || !selectedTime}
                  className={`w-full py-4 px-6 rounded-xl font-semibold tracking-wide transition-all duration-200 flex items-center justify-center ${
                    isBooking || !selectedDate || !selectedTime
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl"
                  }`}
                >
                  {isBooking ? (
                    <>
                      <Loader className="animate-spin h-5 w-5 mr-2" />
                      Creating Appointment...
                    </>
                  ) : (
                    <>
                      <Calendar className="h-5 w-5 mr-2" />
                      Book Appointment - {formatNaira(serviceInfo.price)}
                    </>
                  )}
                </button>

                {/* Info Note */}
                <div className="mt-4 flex items-start text-sm text-gray-500">
                  <Info className="h-4 w-4 mr-2 mt-0.5 text-blue-500 flex-shrink-0" />
                  <p>Your appointment will be confirmed after payment is completed.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Summary (Visible on desktop or mobile when summary tab is active) */}
          <div className={`lg:w-1/3 ${activeTab !== "summary" && "hidden lg:block"}`}>
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                Appointment Summary
              </h3>
              
              {selectedDate && selectedTime ? (
                <div className="space-y-6">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="flex items-center space-x-3 mb-3">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-blue-900">
                        {formatDate(selectedDate)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-blue-900">
                        {selectedTime}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                      <span className="text-gray-600">Service:</span>
                      <span className="font-medium text-right">{serviceInfo.title}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">{serviceInfo?.duration || 90 } </span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-gray-600 font-semibold">Total:</span>
                      <span className="font-bold text-xl text-blue-700">
                        {formatNaira(serviceInfo.price)}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                  <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-gray-600">Select a date and time to see your appointment summary</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Payment Modal */}
        {showPayment && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scaleIn">
              <div className="text-center">
                <div className="relative mx-auto mb-4">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                  <div className="absolute -inset-2 rounded-full bg-green-100/50 animate-ping"></div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Appointment Reserved!
                </h3>
                <p className="text-gray-600 mb-6">
                  Complete your payment to confirm your appointment for:
                </p>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <p className="font-medium text-gray-900">
                    {formatDate(selectedDate)} at {selectedTime}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {serviceInfo.title} ({serviceInfo.duration || 90} minutes)
                  </p>
                </div>
                
                <div className="space-y-3 mb-6">
                  <button
                    onClick={handlePayment}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition duration-200 shadow-md hover:shadow-lg flex items-center justify-center"
                  >
                    <CreditCard className="h-5 w-5 mr-2" />
                    Pay Now - {formatNaira(serviceInfo.price)}
                  </button>
                  
                
                </div>
                
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 text-left">
                  <div className="flex">
                    <Info className="h-5 w-5 text-yellow-500 mr-2" />
                    <p className="text-sm text-yellow-700">
                      Your slot is reserved for 15 minutes. Complete payment to confirm.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Appointment;