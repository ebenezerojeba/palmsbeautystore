import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { toast } from "react-toastify";
 // For notifications

const Appointment = () => {
  const { id } = useParams();
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const navigate = useNavigate()
  const { braidingServices } = useContext(AppContext);
  const [serviceInfo, setServiceInfo] = useState(null);
  const [serviceSlot, setServiceSlot] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState('');
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    phone: '',
  });

  // Fetch service info
  useEffect(() => {
    if (braidingServices) {
      const service = braidingServices.find(service => service.id === Number(id));
      setServiceInfo(service);
    }
  }, [braidingServices, id]);

  // Generate available slots
  const getAvailableSlot = () => {
    let today = new Date();
    let slots = [];

    for (let i = 0; i < 10; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);
      let dayOfWeek = currentDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

      // Skip Sundays (Closed)
      if (dayOfWeek === 0) {
        continue; // Do not add empty slots for Sunday
      }

      let startTime = new Date(currentDate);
      let endTime = new Date(currentDate);

      // Set the correct start time based on the day of the week
      startTime.setHours(dayOfWeek === 6 ? 12 : 9, 0, 0, 0); // Saturday: 12 PM, Weekdays: 9 AM
      endTime.setHours(22, 0, 0, 0); // Closing time (10 PM)

      let timeSlots = [];
      while (startTime < endTime) {
        let formattedTime = startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        timeSlots.push({
          datetime: new Date(startTime),
          time: formattedTime,
        });
        // Increment by 30 minutes
        startTime.setMinutes(startTime.getMinutes() + 30);
      }

      slots.push(timeSlots); // Only push slots if it's not Sunday
    }

    setServiceSlot(slots);
  };

  // Handle booking submission
  const handleBooking = async () => {
    if (!slotTime) {
      toast.warn('Please select a time slot');
      return;
    }

    if (!userDetails.name || !userDetails.email || !userDetails.phone) {
    toast.warn('Please fill in all required fields');
      return;
    }

    const bookingData = {
      serviceId: serviceInfo.id,
      serviceTitle: serviceInfo.title,
      date: serviceSlot[slotIndex][0].datetime.toISOString().split('T')[0], // Selected date
      time: slotTime,
      userDetails,
    };

    try {
      // Send booking data to the backend
      const response = await fetch('http://localhost:3000/api/appointment/book-appointment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (response.ok) {
        const data = await response.json()
        toast.success('Appointment booked successfully!');
        // navigate('/', scrollTo(0,0))


        // Provide download link for the .ics file
      // const downloadLink =  data.calendarLink;
      const downloadLink = `http://localhost:3000/api/appointment${data.calendarLink}`;
      window.open(downloadLink, '_blank'); // Open the download link in a new tab

        // Reset form
        setUserDetails({ name: '', email: '', phone: '' });
        setSlotTime('');
      } else {
        toast.error('Failed to book appointment. Please try again.');
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast.error('An error occurred. Please try again.');
    }
  };

  useEffect(() => {
    if (serviceInfo) {
      getAvailableSlot();
    }
  }, [serviceInfo]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto">
        <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
          <div className="p-6 sm:p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
              {serviceInfo?.title}
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed">
              {serviceInfo?.description}
            </p>
          </div>

          <div className="px-6 sm:px-8 py-4 bg-gray-50 border-t border-gray-100">
            <div className="flex items-baseline">
              <span className="text-gray-700 font-medium">Price:</span>
              <span className="ml-2 text-2xl font-bold text-green-600">
                ₦{serviceInfo?.price?.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
        <p>Booking Slots</p>
        <div className="flex gap-3 items-center w-full overflow-x-scroll scrollbar-hide mt-4">
          {serviceSlot.length > 0 ? (
            serviceSlot.map((daySlots, index) => (
              <div
                key={index}
                className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
                  slotIndex === index ? 'bg-gray-700 text-white' : 'border-gray-400'
                }`}
                onClick={() => setSlotIndex(index)}
              >
                <p>{daySlots.length > 0 && daysOfWeek[daySlots[0].datetime.getDay()]}</p>
                <p>{daySlots.length > 0 && daySlots[0].datetime.getDate()}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No available slots</p>
          )}
        </div>

        <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4">
          {serviceSlot.length &&
            serviceSlot[slotIndex].map((item, index) => (
              <p
                onClick={() => setSlotTime(item.time)}
                className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${
                  item.time === slotTime ? 'bg-gray-700 text-white text-lg' : 'text-gray-400 border border-gray-400'
                }`}
                key={index}
              >
                {item.time.toLowerCase()}
              </p>
            ))}
        </div>

        {/* User Details Form */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Details</h2>
          <form onSubmit={handleBooking} className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              value={userDetails.name}
              onChange={(e) => setUserDetails({ ...userDetails, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700"
              required
            />
            <input
              type="email"
              placeholder="Email Address"
              value={userDetails.email}
              onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700"
              required
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={userDetails.phone}
              onChange={(e) => setUserDetails({ ...userDetails, phone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-700"
              required
            />
          </form>
        </div>

        {/* Booking Button */}
        <button
          onClick={handleBooking}
          className="w-full mt-8 bg-gray-800 text-white py-3 px-6 rounded-lg font-semibold tracking-wide transition duration-200 hover:bg-gray-700 focus:ring-4 focus:ring-gray-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Book Appointment
        </button>
      </div>
    </div>
  );
};

export default Appointment;