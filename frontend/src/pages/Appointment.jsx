// import React, { useContext, useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { AppContext } from "../context/AppContext";
// import { toast } from "react-toastify";
// import BookingModal from "../components/BookingModal";
// import { Loader } from "lucide-react";

// const Appointment = () => {
//   const { id } = useParams();
//   const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
//   const navigate = useNavigate();
//   const { braidingServices, beautyServices, backendUrl } =
//     useContext(AppContext);
//   const [serviceInfo, setServiceInfo] = useState(null);
//   const [serviceSlot, setServiceSlot] = useState([]);
//   const [slotIndex, setSlotIndex] = useState(0);
//   const [slotTime, setSlotTime] = useState("");
//   const [bookedSlots, setBookedSlots] = useState([]);
//   const [userDetails, setUserDetails] = useState({
//     name: "",
//     email: "",
//     phone: "",
//   });
//   const [showConfirmation, setShowConfirmation] = useState(false);
//   const [confirmationDetails, setConfirmationDetails] = useState(null);
//   const [calendarLink, setCalendarLink] = useState(null);
//   const [isBooking, setIsBooking] = useState(false);

//   // const backendUrl = "http://localhost:3000"
//   // const [isLoading, setIsLoading] = useState(false)
//   // Fetch service info and booked slots
//   useEffect(() => {
//     const fetchData = async () => {
//       if (braidingServices && beautyServices) {
//         const allServices = [...beautyServices, ...braidingServices];
//         const service = allServices.find((service) => service._id === id);

        
//         setServiceInfo(service);

//         try {
//           // Fetch booked slots from the backend
//           const response = await fetch(
//             `${backendUrl}/api/appointment/booked-slots`,
//             {
//               method: "GET",
//               headers: {
//                 "Content-Type": "application/json",
//               },
//             }
//           );
//           if (response.ok) {
//             const data = await response.json();
//             setBookedSlots(data);
//           }
//         } catch (error) {
//           console.error("Error fetching booked slots:", error);
//           toast.error("Error loading availability. Please try again.");
//         }
//       }
  
//     }

//     fetchData();
//   }, [braidingServices, beautyServices, id, backendUrl]);

//   // Check if a slot is booked
//   const isSlotBooked = (datetime, time) => {
//     const dateString = datetime.toISOString().split("T")[0];
//     return bookedSlots.some(
//       (slot) =>
//         slot.date === dateString &&
//         slot.time === time
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

//       // Skip Sundays (Closed)
//       if (dayOfWeek === 0) continue;

//       let startTime = new Date(currentDate);
//       let endTime = new Date(currentDate);

//       startTime.setHours(dayOfWeek === 6 ? 12 : 9, 0, 0, 0);
//       endTime.setHours(22, 0, 0, 0);

//       let timeSlots = [];
//       while (startTime < endTime) {
//         let formattedTime = startTime.toLocaleTimeString([], {
//           hour: "2-digit",
//           minute: "2-digit",
//         });

//         // Check if slot is already booked
//         let isBooked = isSlotBooked(startTime, formattedTime);

//         // **Skip past times only for today**
//         if (
//           i === 0 && // Checking today's date
//           (startTime.getHours() < currentHour ||
//             (startTime.getHours() === currentHour &&
//               startTime.getMinutes() < currentMinutes))
//         ) {
//           startTime.setMinutes(startTime.getMinutes() + 90);
//           continue;
//         }

//         if (!isBooked) {
//           timeSlots.push({
//             datetime: new Date(startTime),
//             time: formattedTime,
//           });
//         }

//         startTime.setMinutes(startTime.getMinutes() + 90);
//       }

//       // Only add the day if it has available slots
//       if (timeSlots.length > 0) {
//         slots.push(timeSlots);
//       }
//     }

//     setServiceSlot(slots);
//   };

//   // Handle booking submission
//   const handleBooking = async () => {
//     if (!slotTime) {
//       toast.warn("Please select a time slot");
//       return;
//     }

//     if (!userDetails.name || !userDetails.email || !userDetails.phone) {
//       toast.warn("Please fill in all required fields");
//       return;
//     }

//     const selectedDate = serviceSlot[slotIndex][0].datetime
//       .toISOString()
//       .split("T")[0];

//     // Check again if slot is already booked (prevent race conditions)
//     if (isSlotBooked(serviceSlot[slotIndex][0].datetime, slotTime)) {
//       toast.error(
//         "Sorry, this slot has just been booked. Please select another time."
//       );
//       getAvailableSlot(); // Refresh available slots
//       return;
//     }

//     const bookingData = {
//       serviceId: serviceInfo.id,
//       serviceTitle: serviceInfo.title,
//       duration: serviceInfo.duration,
//       date: selectedDate,
//       time: slotTime,
//       userDetails,
//     };

//     setIsBooking(true);

//     try {
//       const response = await fetch(
//         `${backendUrl}/api/appointment/book-appointment`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(bookingData),
//         }
//       );

//       // Prepare confrimation data
//       const confirmationData = {
//         ...bookingData,
//         price: serviceInfo.price,
//         serviceId: serviceInfo.id,
//       };

//       if (response.ok) {
//         const data = await response.json();
//         toast.success("Appointment booked successfully!");

//         // Store calender link
//         setCalendarLink(data.calendarLink);

//         // Download calendar file
//         // const downloadLink = `${backendUrl}/api/appointment${data.calendarLink}`;
//         // window.open(downloadLink, "_blank");

//         // Update booked slots and refresh available slots
//         setBookedSlots([
//           ...bookedSlots,
//           { date: selectedDate, time: slotTime, serviceId: serviceInfo.id },
//         ]);
//         getAvailableSlot();

//         // Reset form
//         setUserDetails({ name: "", email: "", phone: "" });
//         setSlotTime("");

//         // Show Modal
//         setConfirmationDetails(confirmationData);
//         setShowConfirmation(true);
//       } else {
//         toast.error("Failed to book appointment. Please try again.");
//       }
//     } catch (error) {
//       console.error("Error booking appointment:", error);
//       toast.error("An error occurred. Please try again.");
//     } finally {
//       setIsBooking(false);
//     }
//   };

//   useEffect(() => {
//     if (serviceInfo && bookedSlots.length >= 0) {
//       getAvailableSlot();
//     }
//   }, [serviceInfo, bookedSlots]);

//   // Reset selected time when changing date
//   useEffect(() => {
//     setSlotTime("");
//   }, [slotIndex]);


//     return(
      
//     <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-6 px-4 sm:py-12 sm:px-6 lg:px-8">
//     <div className="max-w-xl mx-auto">
//       {/* Service Info Card */}
//       <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
//         <div className="p-4 sm:p-8">
//           {serviceInfo?.image && (
//             <div className="relative h-48 sm:h-64 mb-4 overflow-hidden rounded-lg">
//               <img
//                 src={serviceInfo.image}
//                 alt={serviceInfo.title}
//                 className="object-cover w-full h-full"
//               />
//             </div>
//           )}
//           <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 tracking-tight">
//             {serviceInfo?.title || 'Service Title'}
//           </h1>
//           <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
//             {serviceInfo?.description || 'Service description'}
//           </p>
//         </div>

//         <div className="px-4 sm:px-8 py-4 bg-gray-50 border-t border-gray-100">
//           <div className="flex items-baseline">
//             <span className="text-gray-700 font-medium">Price:</span>
//             <span className="ml-2 text-xl sm:text-2xl font-bold text-green-600">
//               {serviceInfo?.price?.toLocaleString() || '0'}
//             </span>

//           </div>
      
       
//           <div className="flex items-center gap-2 mt-4">
              
//                 <span className="text-gray-600 font-medium">
//                   Duration: {serviceInfo?.duration || 'N/A'}
//                 </span>
//               </div>

//         </div>
//       </div>
//     </div>

//       <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
//         <p>Available Booking Slots</p>
//         <div className="flex gap-3 items-center w-full overflow-x-scroll scrollbar-hide mt-4">
//           {serviceSlot.length > 0 ? (
//             serviceSlot.map((daySlots, index) => (
//               <div
//                 key={index}
//                 className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
//                   slotIndex === index
//                     ? "bg-gray-700 text-white"
//                     : "border-gray-400"
//                 }`}
//                 onClick={() => setSlotIndex(index)}
//               >
//                 <p>
//                   {daySlots.length > 0 &&
//                     daysOfWeek[daySlots[0].datetime.getDay()]}
//                 </p>
//                 <p>{daySlots.length > 0 && daySlots[0].datetime.getDate()}</p>
//               </div>
//             ))
//           ) : (
//             <p className="text-gray-500">
//               No available slots for the next 10 days
//             </p>
//           )}
//         </div>

//         <div className="flex flex-wrap items-center gap-3 w-full mt-4">
//           {serviceSlot.length > 0 &&
//             serviceSlot[slotIndex]?.map((item, index) => (
//               <p
//                 onClick={() => setSlotTime(item.time)}
//                 className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${
//                   item.time === slotTime
//                     ? "bg-gray-700 text-white text-lg"
//                     : "text-gray-400 border border-gray-400"
//                 }`}
//                 key={index}
//               >
//                 {item.time.toLowerCase()}
//               </p>
//             ))}
//         </div>

//         {/* User Details Form */}
//         <div className="mt-8">
//           <h2 className="text-xl font-semibold text-gray-900 mb-4">
//             Your Details
//           </h2>
//           <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
//             <input
//               type="text"
//               placeholder="Full Name"
//               value={userDetails.name}
//               onChange={(e) =>
//                 setUserDetails({ ...userDetails, name: e.target.value })
//               }
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700"
//               required
//             />
//             <input
//               type="email"
//               placeholder="Email Address"
//               value={userDetails.email}
//               onChange={(e) =>
//                 setUserDetails({ ...userDetails, email: e.target.value })
//               }
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700"
//               required
//             />
//             <input
//               type="tel"
//               placeholder="Phone Number"
//               value={userDetails.phone}
//               onChange={(e) =>
//                 setUserDetails({ ...userDetails, phone: e.target.value })
//               }
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700"
//               required
//             />
//           </form>
//         </div>

//         {/* Booking Button */}
//         <button
//           disabled={isBooking}
//           onClick={handleBooking}
//           className="w-full mt-8 bg-gray-800 text-white py-3 px-6 rounded-lg font-semibold tracking-wide transition duration-200 cursor-pointer hover:bg-gray-700 focus:ring-4 focus:ring-gray-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
//         >
//           {isBooking ? <Loader /> : "Book Appoinment"}
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




import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import BookingModal from "../components/BookingModal";
import { Loader } from "lucide-react";

const Appointment = () => {
  const { id } = useParams();
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContext);

  const [serviceInfo, setServiceInfo] = useState(null);
  const [serviceSlot, setServiceSlot] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");
  const [bookedSlots, setBookedSlots] = useState([]);
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationDetails, setConfirmationDetails] = useState(null);
  const [calendarLink, setCalendarLink] = useState(null);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/services/services/${id}`);
        const data = await res.json();
        if (data.service) {
          setServiceInfo(data.service);
        } else {
          toast.error("Service not found");
        }
      } catch (err) {
        toast.error("Failed to fetch service");
      }
    };

    const fetchBookedSlots = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/appointment/booked-slots`);
        const data = await res.json();
        setBookedSlots(data);
      } catch (err) {
        toast.error("Failed to fetch booked slots");
      }
    };

    fetchService();
    fetchBookedSlots();
  }, [id, backendUrl]);

  const isSlotBooked = (datetime, time) => {
    const dateString = datetime.toISOString().split("T")[0];
    return bookedSlots.some(
      (slot) => slot.date === dateString && slot.time === time
    );
  };

  const getAvailableSlot = () => {
    let today = new Date();
    let currentHour = today.getHours();
    let currentMinutes = today.getMinutes();
    let slots = [];

    for (let i = 0; i < 10; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);
      let dayOfWeek = currentDate.getDay();

      if (dayOfWeek === 0) continue; // Closed on Sunday

      let startTime = new Date(currentDate);
      let endTime = new Date(currentDate);

      startTime.setHours(dayOfWeek === 6 ? 12 : 9, 0, 0, 0); // Sat: 12pm, others: 9am
      endTime.setHours(22, 0, 0, 0); // 10pm

      let timeSlots = [];
      while (startTime < endTime) {
        let formattedTime = startTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        if (
          i === 0 &&
          (startTime.getHours() < currentHour ||
            (startTime.getHours() === currentHour &&
              startTime.getMinutes() < currentMinutes))
        ) {
          startTime.setMinutes(startTime.getMinutes() + 90);
          continue;
        }

        if (!isSlotBooked(startTime, formattedTime)) {
          timeSlots.push({
            datetime: new Date(startTime),
            time: formattedTime,
          });
        }

        startTime.setMinutes(startTime.getMinutes() + 90);
      }

      if (timeSlots.length > 0) {
        slots.push(timeSlots);
      }
    }

    setServiceSlot(slots);
  };

  useEffect(() => {
    if (serviceInfo && bookedSlots.length >= 0) {
      getAvailableSlot();
    }
  }, [serviceInfo, bookedSlots]);

  useEffect(() => {
    setSlotTime("");
  }, [slotIndex]);

  const handleBooking = async () => {
    if (!slotTime) return toast.warn("Please select a time slot");
    if (!userDetails.name || !userDetails.email || !userDetails.phone) {
      return toast.warn("Please fill in all required fields");
    }

    const selectedDate = serviceSlot[slotIndex][0].datetime
      .toISOString()
      .split("T")[0];

    if (isSlotBooked(serviceSlot[slotIndex][0].datetime, slotTime)) {
      toast.error("Slot has just been booked. Try another.");
      getAvailableSlot();
      return;
    }

    const bookingData = {
      serviceId: serviceInfo._id,
      serviceTitle: serviceInfo.title,
      duration: serviceInfo.duration,
      date: selectedDate,
      time: slotTime,
      userDetails,
    };

    setIsBooking(true);

    try {
      const res = await fetch(`${backendUrl}/api/appointment/book-appointment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      if (res.ok) {
        const data = await res.json();
        toast.success("Appointment booked successfully!");
        setCalendarLink(data.calendarLink);
        setBookedSlots([
          ...bookedSlots,
          { date: selectedDate, time: slotTime, serviceId: serviceInfo._id },
        ]);
        getAvailableSlot();
        setUserDetails({ name: "", email: "", phone: "" });
        setSlotTime("");
        setConfirmationDetails({
          ...bookingData,
          price: serviceInfo.price,
        });
        setShowConfirmation(true);
      } else {
        toast.error("Booking failed. Please try again.");
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-6 px-4 sm:py-12 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-4 sm:p-8">
            {serviceInfo?.image && (
              <div className="relative h-48 sm:h-64 mb-4 overflow-hidden rounded-lg">
                <img
                  src={serviceInfo.image}
                  alt={serviceInfo.title}
                  className="object-cover w-full h-full"
                />
              </div>
            )}
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {serviceInfo?.title}
            </h1>
            <p className="text-gray-600 text-lg">{serviceInfo?.description}</p>
          </div>
          <div className="px-4 sm:px-8 py-4 bg-gray-50 border-t">
            <div className="flex items-baseline">
              <span className="text-gray-700 font-medium">Price:</span>
              <span className="ml-2 text-2xl font-bold text-green-600">
                {serviceInfo?.price?.toLocaleString()}
              </span>
            </div>
            <div className="mt-4 text-gray-600 font-medium">
              Duration: {serviceInfo?.duration}
            </div>
          </div>
        </div>
      </div>

      {/* Slots & Booking */}
      <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
        <p>Available Booking Slots</p>
        <div className="flex gap-3 overflow-x-scroll mt-4 scrollbar-hide">
          {serviceSlot.length > 0 ? (
            serviceSlot.map((daySlots, index) => (
              <div
                key={index}
                className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
                  slotIndex === index ? "bg-gray-700 text-white" : "border-gray-400"
                }`}
                onClick={() => setSlotIndex(index)}
              >
                <p>{daysOfWeek[daySlots[0].datetime.getDay()]}</p>
                <p>{daySlots[0].datetime.getDate()}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No available slots for the next 10 days</p>
          )}
        </div>

        <div className="flex flex-wrap gap-3 mt-4">
          {serviceSlot[slotIndex]?.map((item, index) => (
            <p
              key={index}
              onClick={() => setSlotTime(item.time)}
              className={`text-sm font-light px-5 py-2 rounded-full cursor-pointer ${
                item.time === slotTime
                  ? "bg-gray-700 text-white text-lg"
                  : "text-gray-400 border border-gray-400"
              }`}
            >
              {item.time.toLowerCase()}
            </p>
          ))}
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Details</h2>
          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              value={userDetails.name}
              onChange={(e) =>
                setUserDetails({ ...userDetails, name: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-700"
              required
            />
            <input
              type="email"
              placeholder="Email Address"
              value={userDetails.email}
              onChange={(e) =>
                setUserDetails({ ...userDetails, email: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-700"
              required
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={userDetails.phone}
              onChange={(e) =>
                setUserDetails({ ...userDetails, phone: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-700"
              required
            />
          </form>
        </div>

        <button
          disabled={isBooking}
          onClick={handleBooking}
          className="w-full mt-8 bg-gray-800 text-white py-3 px-6 rounded-lg font-semibold tracking-wide transition duration-200 hover:bg-gray-700 focus:ring-4 focus:ring-gray-200 disabled:opacity-50"
        >
          {isBooking ? <Loader /> : "Book Appointment"}
        </button>

        <BookingModal
          isOpen={showConfirmation}
          onClose={() => setShowConfirmation(false)}
          bookingDetails={confirmationDetails}
          onDownloadCalendar={() => {
            if (calendarLink) {
              window.open(
                `${backendUrl}/api/appointment${calendarLink}`,
                "_blank"
              );
            }
          }}
        />
      </div>
    </div>
  );
};

export default Appointment;
