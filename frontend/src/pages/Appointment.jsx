import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import {
  Loader,
  Calendar,
  Clock,
  CreditCard,
  AlertCircle,
  CheckCircle,
  ChevronLeft,
  Info,
  Plus,
  X,
  MapPin,
  Star,
  FileText,
  Shield,
  CreditCard as CardIcon,
  Save,
  AlertTriangle,
  User,
  Phone,
  Mail,
  MessageSquare,
  Loader2
} from "lucide-react";

const Appointment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {  userData, backendUrl } = useContext(AppContext);
  const { formatNaira } = useContext(ShopContext);
// const backendUrl = "http://localhost:3000"; // Replace with your actual backend URL
  // State management
  const [serviceInfo, setServiceInfo] = useState(null);
  const [allServices, setAllServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showAddService, setShowAddService] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState("");
  const [appointmentId, setAppointmentId] = useState("");
  const [expandedDates, setExpandedDates] = useState({});

  // New enhanced state
  const [clientNotes, setClientNotes] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [agreeToCancellationPolicy, setAgreeToCancellationPolicy] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [savePaymentMethod, setSavePaymentMethod] = useState(false);
  const [savedCards, setSavedCards] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("new");
  const [showCancellationPolicy, setShowCancellationPolicy] = useState(false);
  const [showTermsConditions, setShowTermsConditions] = useState(false);
  // Preferences and settings
  const [reminderPreferences, setReminderPreferences] = useState({
    email24h: false,
    email2h: false,
    sms24h: false,
    sms2h: false
  });
 

  // Fetch service information and all services
  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/services/services/${id}`);
        const data = await res.json();
        if (data.service) {
          setServiceInfo(data.service);
          setSelectedServices([data.service]);
        } else {
          toast.error("Service not found");
          navigate("/services");
        }
      } catch (err) {
        toast.error("Failed to fetch service details");
        navigate("/services");
      }
    };

    const fetchAllServices = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/services/only-services`);
        const data = await res.json();
        if (data.services) {
          setAllServices(data.services);
        }
      } catch (err) {
        console.error("Failed to fetch all services");
      }
    };

    // Fetch saved payment methods
    const fetchSavedCards = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await fetch(`${backendUrl}/api/payment/saved-cards`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.cards) {
          setSavedCards(data.cards);
        }
      } catch (err) {
        console.log("No saved cards found");
      }
    };

    if (id) {
      fetchService();
      fetchAllServices();
      fetchSavedCards();
    }
  }, [id, backendUrl, navigate]);

  // Update reminder preferences when userData changes
  useEffect(() => {
    if (userData) {
      // You could fetch user's saved preferences here if needed
    }
  }, [userData]);

  // Calculate total price
  const getTotalPrice = () => {
    return selectedServices.reduce((total, service) => total + Number(service.price || 0), 0);
  };

// const getTotalDuration = () => {
//   const total = selectedServices.reduce((total, service) => total + Number(service.duration || 90), 0);
//   console.log('Total duration calculated:', total, 'from services:', selectedServices);
//   return total;
// }
const getTotalDuration = () => {
  const total = selectedServices.reduce((total, service) => {
    const duration = parseInt(service.duration) || 90; // Ensure consistent parsing
    return total + duration;
  }, 0);
  console.log('Total duration calculated:', total, 'from services:', selectedServices);
  return total;
};
//Updated useEffect for fetching available slots
useEffect(() => {
  const fetchAvailableSlots = async () => {
    if (selectedServices.length === 0) return;

    setIsLoading(true);
    try {
      const startDate = new Date().toISOString().split('T')[0];
      const endDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      // Prepare services data with better structure
      const servicesForSlots = selectedServices.map(service => ({
        _id: service._id,
        title: service.title,
        duration: service.duration || 90,
        price: service.price
      }));

      // Prepare query parameters
      const queryParams = new URLSearchParams({
        serviceId: id,
        startDate,
        endDate,
        selectedServices: JSON.stringify(servicesForSlots)
      });

      console.log('Fetching slots with params:', {
        serviceId: id,
        startDate,
        endDate,
        selectedServices: servicesForSlots,
        totalDuration: getTotalDuration()
      });

      const res = await fetch(
        `${backendUrl}/api/appointment/available-slots?${queryParams.toString()}`
      );
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      console.log('Received slots data:', data);

      if (data.availableSlots) {
        setAvailableSlots(data.availableSlots);
      } else {
        setAvailableSlots([]);
      }
    } catch (err) {
      console.error('Error fetching slots:', err);
      toast.error("Failed to fetch available slots");
      setAvailableSlots([]);
    } finally {
      setIsLoading(false);
    }
  };

  fetchAvailableSlots();
}, [selectedServices, id, backendUrl]);

  // Add service to selection
  // const addService = (service) => {
  //   const isAlreadySelected = selectedServices.some(s => s._id === service._id);
  //   if (!isAlreadySelected) {
  //     setSelectedServices([...selectedServices, service]);
  //     setShowAddService(false);
  //     setSelectedDate("");
  //     setSelectedTime("");
  //     toast.success(`${service.title} added to your appointment`);
  //   } else {
  //     toast.info("This service is already selected");
  //   }
  // };

  const addService = (service) => {
  const isAlreadySelected = selectedServices.some(s => s._id === service._id);
  if (!isAlreadySelected) {
    const serviceToAdd = {
      ...service,
      _id: service._id,
      title: service.title,
      duration: parseInt(service.duration) || 90, // Consistent parsing
      price: parseFloat(service.price) || 0
    };
    
    setSelectedServices(prev => [...prev, serviceToAdd]);
    setShowAddService(false);
    
    // Reset date/time when services change
    setSelectedDate("");
    setSelectedTime("");
    
    toast.success(`${service.title} added to your appointment`);
  } else {
    toast.info("This service is already selected");
  }
};

  // Remove service from selection
  const removeService = (serviceId) => {
    if (selectedServices.length === 1) {
      toast.warn("You must have at least one service selected");
      return;
    }

    setSelectedServices(selectedServices.filter(s => s._id !== serviceId));
    setSelectedDate("");
    setSelectedTime("");
    toast.success("Service removed from appointment");
  };

  // Validation function
  const validateBookingData = () => {
    if (!selectedDate || !selectedTime) {
      toast.warn("Please select a date and time");
      return false;
    }

    if (!userData) {
      toast.warn("Please log in to book an appointment");
      return false;
    }

    if (!agreeToCancellationPolicy) {
      toast.warn("Please agree to the cancellation policy");
      return false;
    }

    return true;
  };

  // Handle appointment booking with enhanced data
  const handleBooking = async () => {
    if (!validateBookingData()) return;

    if (!userData) {
      toast.warn("User information not available");
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("Please log in first!");
      return;
    }

    setIsBooking(true);

    try {
     // In your frontend handleBooking function, ensure services are properly formatted:
const bookingData = {
  services: selectedServices.map((service, index) => ({
    serviceId: service._id,
    serviceTitle: service.title,
    duration: parseInt(service.duration) || 90, // Ensure it's a number
    price: parseFloat(service.price) || 0,      // Ensure it's a number
    order: index + 1
  })),
  // ... rest of your booking data

        
        // Appointment details
        date: selectedDate,
        time: selectedTime,
        totalDuration: getTotalDuration(),
        
        // Payment information
        payment: {
          amount: getTotalPrice(),
          currency: "CAD", 
          paymentMethod: selectedPaymentMethod === "new" ? "new_card" : selectedPaymentMethod
        },

        // User information (denormalized as per your schema)
        userName: `${userData.firstName || ''} ${userData.lastName || ''}`.trim(),
        userEmail: userData.email,
        userPhone: userData.phone,
        
        // Notes and requests
        clientNotes,
        specialRequests,
        
        // Preferences
        reminderPreferences,
        
        // Payment preferences
        paymentPreferences: {
          savePaymentMethod,
          selectedPaymentMethod
        },

        // Agreement confirmations
        agreementConfirmations: {
          cancellationPolicy: agreeToCancellationPolicy,
          termsAndConditions: agreeToTerms
        }
      };

      const res = await fetch(`${backendUrl}/api/appointment/book-multiple-appointment`, {
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

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0 && mins > 0) {
      return `${hours}h ${mins}m`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return `${mins}m`;
    }
  };

   // Format time range display
  const formatTimeRange = (startTime, duration) => {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const startDate = new Date();
    startDate.setHours(startHour, startMinute, 0, 0);
    
    const endDate = new Date(startDate.getTime() + duration * 60 * 1000);
    const endTime = endDate.toTimeString().slice(0, 5);
    
    return `${startTime} - ${endTime}`;
  };

// Toggle date expansion
  const toggleDateExpansion = (date) => {
    setExpandedDates(prev => ({
      ...prev,
      [date]: !prev[date]
    }));
  };

  // Get service duration category
  const getDurationCategory = (duration) => {
    if (duration <= 120) return 'short'; // ≤ 2 hours
    if (duration <= 480) return 'medium'; // ≤ 8 hours
    return 'long'; // > 8 hours
  };

  // Get category styling
  const getCategoryStyle = (category) => {
    switch (category) {
      case 'short':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'medium':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'long':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  }

    const totalDuration = getTotalDuration();
  const durationCategory = getDurationCategory(totalDuration);
  const isLongService = totalDuration > 480; // More than 8 hours



  if (!serviceInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading service details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ChevronLeft className="h-5 w-5 mr-1" />
              Back
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Book Appointment</h1>
            <div></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Service Hero */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* {serviceInfo.image && (
                <div className="h-48 sm:h-64">
                  <img
                    src={serviceInfo.image}
                    alt={serviceInfo.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex items-center space-x-3 mt-4">
                  <input
                    type="checkbox"
                    id="first-time-client"
                    checked={isFirstTimeClient}
                    onChange={(e) => setIsFirstTimeClient(e.target.checked)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded"
                  />
                  <label htmlFor="first-time-client" className="text-sm text-gray-700">
                    This is my first time booking with this service provider
                  </label>
                </div>
              )} */}
              {/* <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {serviceInfo.title}
                    </h2>
                    <p className="text-gray-600 mb-4">{serviceInfo.description}</p>
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        {formatDuration(serviceInfo.duration || 90)}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <CreditCard className="h-4 w-4 mr-1" />
                        {formatNaira(serviceInfo.price)}
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}
            {/* </div> */}



          </div>
            {/* Selected Services */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Selected Services ({selectedServices.length})
                  </h3>
                  <button
                    onClick={() => setShowAddService(true)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Plus className="h-4 w-4" />
                    {/* Add Service */}
                  </button>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {selectedServices.map((service) => (
                  <div key={service._id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-base font-medium text-gray-900">
                          {service.title}
                        </h4>
                        <p className="text-sm text-gray-500 mt-1">
                          {service.description}
                        </p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-sm text-gray-500">
                            {formatDuration(service.duration || 90)}
                          </span>
                          <span className="text-base font-medium text-gray-900">
                            {formatNaira(service.price)}
                          </span>
                        </div>
                      </div>
                      {selectedServices.length > 1 && (
                        <button
                          onClick={() => removeService(service._id)}
                          className="ml-4 p-1 text-gray-400 hover:text-red-500"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes and Special Requests */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  {/* <MessageSquare className="h-5 w-5 mr-2" /> */}
                  Additional Information
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes for your appointment
                  </label>
                  <textarea
                    value={clientNotes}
                    onChange={(e) => setClientNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                    rows="3"
                    placeholder=""
                  />
                </div>
                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Special Requests
                  </label>
                  <textarea
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="2"
                    placeholder="Any special accommodations or requests..."
                  />
                </div> */}
              </div>
            </div>

            {/* Date & Time Selection */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Choose Date & Time
                </h3>
              </div>

              <div className="p-6 space-y-6">
                {/* Date Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select Date
                  </label>

                  {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="animate-spin h-6 w-6 text-pink-600 mr-2" />
                      <span className="text-gray-600">Loading available dates...</span>
                    </div>
                  ) : availableSlots.length > 0 ? (
                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
                      {availableSlots.map((daySlot, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setSelectedDate(daySlot.date);
                            setSelectedTime("");
                          }}
                          className={`p-3 text-center rounded-lg border transition-all ${selectedDate === daySlot.date
                              ? "border-pink-500 bg-pink-50 text-gray-700"
                              : "border-gray-200 hover:border-gray-300 text-gray-700"
                            }`}
                        >
                          <div className="text-xs font-medium">
                            {daySlot.dayOfWeek.substring(0, 3)}
                          </div>
                          <div className="text-lg font-bold mt-1">
                            {new Date(daySlot.date).getDate()}
                          </div>
                          <div className="text-xs">
                            {new Date(daySlot.date).toLocaleString('default', { month: 'short' })}
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      {/* <AlertCircle className="h-8 w-8 mx-auto mb-2" /> */}
                      <p>No available slots found</p>
                      <p className="text-sm">Please try different services or contact us</p>
                    </div>
                  )}
                </div>

                {/* Time Selection */}
                {selectedDate && (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-3">
      Select Time
      {getTotalDuration() > 480 && (
        <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
          Extended Service ({formatDuration(getTotalDuration())})
        </span>
      )}
    </label>

    {(() => {
      const selectedDay = availableSlots.find(slot => slot.date === selectedDate);
      return selectedDay ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {selectedDay.slots.map((timeSlot, index) => (
            <button
              key={index}
              onClick={() => setSelectedTime(timeSlot.time)}
              className={`p-3 text-sm font-medium rounded-lg border transition-all ${
                selectedTime === timeSlot.time
                  ? "border-pink-500 bg-pink-50 text-gray-900"
                  : "border-gray-200 hover:border-gray-300 text-gray-700"
              }`}
            >
              <div>{timeSlot.time}</div>
              {timeSlot.spansMultipleDays && (
                <div className="text-xs text-orange-600 hidden mt-1">Multi-day</div>
              )}
              {timeSlot.estimatedEndTime && timeSlot.estimatedEndTime !== 'Next Day' && (
                <div className="text-xs text-gray-500">
                  End: {timeSlot.estimatedEndTime}
                </div>
              )}
            </button>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>No available time slots for this date</p>
        </div>
      );
    })()}
  </div>
)}
              </div>
            </div>

          <div class="bg-gray-50 p-6 rounded-2xl shadow-sm space-y-4 text-gray-700 text-sm leading-relaxed">
  <p>
     <span className="font-extra-bold">Thanks for booking with us</span>. All prices displayed on the website are tax inclusive. Add-ons such as braiding, extensions, wash, and detangling will be calculated during checkout.
  </p>

  <p className="text-lg">Please note ; the time indicated per appointment are estimations and can vary based on size of head, quantity of braids and length in comparison to your height. </p>
 
</div>


            {/* Payment Method Selection */}
            {/* <div className="bg-white rounded-lg shadow-sm"> */}
              {/* <div className="p-6 border-b border-gray-200">

                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <CardIcon className="h-5 w-5 mr-2" />
                  Payment Method
                </h3>
              </div>
              <div className="p-6 space-y-4">
                {savedCards.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-700">Saved Payment Methods</h4>
                    {savedCards.map((card) => (
                      <div key={card.id} className="flex items-center space-x-3">
                        <input
                          type="radio"
                          id={`card-${card.id}`}
                          name="paymentMethod"
                          value={card.id}
                          checked={selectedPaymentMethod === card.id}
                          onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor={`card-${card.id}`} className="flex items-center space-x-2 text-sm text-gray-700">
                          <CreditCard className="h-4 w-4" />
                          <span>**** **** **** {card.last4}</span>
                          <span className="text-gray-500">({card.brand})</span>
                        </label>
                      </div>
                    ))}
                  </div>
                )} 

                
                <div className="flex items-center space-x-3 mt-4">
                  <input
                    type="checkbox"
                    id="save-payment"
                    checked={savePaymentMethod}
                    onChange={(e) => setSavePaymentMethod(e.target.checked)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded"
                  />
                  <label htmlFor="save-payment" className="text-sm text-gray-700">
                    Save this payment method for future appointments
                  </label>
                </div> */}
              {/* </div>  */}
            {/* </div> */}

           

            {/* Terms and Policies */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  {/* <Shield className="h-5 w-5 mr-2" /> */}
                  Terms & Policies
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start">
                    {/* <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" /> */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-800 mb-2">
                        Cancellation Policy
                      </h4>
                   
                      <button
                        onClick={() => setShowCancellationPolicy(true)}
                        className="text-sm text-gray-800 underline hover:text-gray-900"
                      >
                        Read full cancellation policy
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="agree-cancellation"
                      checked={agreeToCancellationPolicy}
                      onChange={(e) => setAgreeToCancellationPolicy(e.target.checked)}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded mt-1"
                    />
                    <label htmlFor="agree-cancellation" className="text-sm text-gray-700">
                      I understand and agree to the cancellation policy *
                    </label>
                  </div>
{/* 
                   <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="agree-terms"
                      checked={agreeToTerms}
                      onChange={(e) => setAgreeToTerms(e.target.checked)}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded mt-1"
                    />
                    <label htmlFor="agree-terms" className="text-sm text-gray-700">
                      I agree to the{" "}
                      <button
                        onClick={() => setShowTermsConditions(true)}
                        className="text-blue-600 underline hover:text-blue-800"
                      >
                        terms and conditions
                      </button>{" "}
                      and{" "}
                      <button
                        onClick={() => window.open('/privacy-policy', '_blank')}
                        className="text-blue-600 underline hover:text-blue-800"
                      >
                        privacy policy
                      </button>
                      *
                    </label>
                  </div>  */}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm sticky top-8">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Booking Summary
                </h3>
              </div>

              <div className="p-6 space-y-4">
                {selectedDate && selectedTime ? (
                  <>
                    <div className="bg-gray-100 rounded-lg p-4">
                      <div className="flex items-center text-gray-700 mb-2">
                        {/* <Calendar className="h-4 w-4 mr-2" /> */}
                        <span className="font-medium">
                          {formatDate(selectedDate)}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        {/* <Clock className="h-4 w-4 mr-2" /> */}
                        <span className="font-medium">{selectedTime}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {selectedServices.map((service) => (
                        <div key={service._id} className="flex justify-between text-sm">
                          <span className="text-gray-600">{service.title}</span>
                          <span className="font-medium">{formatNaira(service.price)}</span>
                        </div>
                      ))}

                      <div className="border-t border-gray-200 pt-3 space-y-2">
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Duration:</span>
                          <span>{formatDuration(getTotalDuration())}</span>
                        </div>
                        <div className="flex justify-between text-base font-semibold">
                          <span>Price:</span>
                          <span>{formatNaira(getTotalPrice())}</span>
                        </div>
                      </div>
                    </div>

                    {/* Client Summary */}
                 
                  </>
                ) :(
                  <div className="text-center py-8 text-gray-500">
                    {/* <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" /> */}
                    <p>Select date and time to see summary</p>
                  </div>
                )}
              </div>

              <div className="p-6 flex justify-center">
                <button
                  onClick={handleBooking}
                  disabled={isBooking || !selectedDate || !selectedTime || !agreeToCancellationPolicy}
                  className= "bg-pink-900 text-white py-3 px-4 rounded-lg justify-center items-center font-medium hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed "
                >
                  {isBooking ? (
                    <>
                      <Loader className="animate-spin h-4 w-4 mr-2" />
                      Creating...
                    </>
                  ) : (
                    `Book Now - ${formatNaira(getTotalPrice())}`
                  )}
                </button>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Service Modal */}
      {showAddService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Add Another Service
                </h3>
                <button
                  onClick={() => setShowAddService(false)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="space-y-4">
                {allServices
                  .filter(service => !selectedServices.some(s => s._id === service._id))
                  .map((service) => (
                    <div key={service._id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{service.title}</h4>
                          <p className="text-sm text-gray-500 mt-1">{service.description}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className="text-sm text-gray-500">
                              {formatDuration(service.duration)}
                            </span>
                            <span className="text-sm font-medium text-gray-900">
                              {formatNaira(service.price)}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => addService(service)}
                          className="ml-4 px-4 py-2 bg-pink-800 text-white rounded-lg hover:bg-pink-700 transition-colors text-sm font-medium"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancellation Policy Modal */}
      {showCancellationPolicy && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Cancellation Policy
                </h3>
                <button
                  onClick={() => setShowCancellationPolicy(false)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div class="bg-gray-50 p-6 rounded-2xl shadow-md text-gray-700 text-sm leading-relaxed space-y-4">
  <p>
    We ask that you please reschedule or cancel your appointment 48 before hand to enable us give a  client your spot  or you may be charged 50% of the price of your appointment .
  </p>

  <p>
    All prices displayed on the website are <span class="font-semibold">taxes included</span> and finalized. Add-ons (braiding extensions, wash, or detangling services) will be calculated during checkout.
  </p>

  <div>
    <h2 class="text-base font-bold text-gray-900 mb-2">Service Cancellation Policy</h2>
    <ol class="list-decimal list-inside space-y-2">
      <li>
        <span class="font-semibold">Cancellation by the Customer:</span> Customers may reschedule their service once by providing written notice to 
        <a href="mailto:Stylebyesther@palmsbeautystore.com" class="text-blue-600 underline">Stylebyesther@palmsbeautystore.com</a> 
        <span class="font-semibold">48 hours</span> before their appointment. The notice must include the customer's name, contact information, and service details. 
        <span class="font-semibold">Booking fees are not refundable.</span>
      </li>
      <li>
        <span class="font-semibold">Cancellations by Palmsbeautystore:</span> Palmsbeautystore reserves the right to cancel a service in cases of non-payment, violation of terms, or breach of agreement. Notice will be provided, and refunds will apply only if the service provider is unavailable due to unforeseen circumstances.
      </li>
    </ol>
  </div>
</div>

{/* 
            <div className="p-6 overflow-y-auto max-h-[60vh]">
             <div className="prose prose-sm max-w-none">
  <h4 className="text-base font-semibold mb-3">Appointment Cancellation Policy</h4>
  <p className="mb-4">
    We ask that you please reschedule or cancel at least <strong>1 hour</strong> before the beginning of your appointment or you may be charged a <strong>50% cancellation fee</strong> based on the price of your scheduled appointment.
  </p>
  <p className="mb-4">
    All prices displayed on the website are <strong>tax-inclusive</strong> and final. Add-ons such as braiding extensions, wash, or detangling services (if provided by the client) will be calculated during checkout.
  </p>

  <h4 className="text-base font-semibold mb-3">Service Cancellation Policy</h4>
  <ul className="list-disc pl-6 space-y-2 mb-4">
    <li>
      <strong>Cancellation by the Customer:</strong> Customers may reschedule their service once by providing written notice to <a href="mailto:Stylebyesther@palmsbeautystore.com" className="text-blue-600 underline">Stylebyesther@palmsbeautystore.com</a> at least <strong>48 hours</strong> before their appointment time. The cancellation notice must include the customer’s name, contact information, and service details. <strong>Booking fees are not refundable.</strong>
    </li>
    <li>
      <strong>Cancellation by Palmsbeautystore:</strong> Palmsbeautystore reserves the right to cancel a service in the event of non-payment, violation of terms and conditions, or any other breach of the service agreement. Customers will be notified in such cases. <strong>Refunds will apply</strong> only in the event of unavailability of a service provider due to unforeseen circumstances.
    </li>
  </ul>
</div>
</div> */}

            <div className="p-6 border-t border-gray-200">
              <button
                onClick={() => setShowCancellationPolicy(false)}
                className="w-full bg-pink-900 text-white py-2 px-4 rounded-lg hover:bg-pink-700 transition-colors"
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Terms & Conditions Modal */}
      {showTermsConditions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Terms & Conditions
                </h3>
                <button
                  onClick={() => setShowTermsConditions(false)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="prose prose-sm max-w-none">
                <h4 className="text-base font-semibold mb-3">Service Agreement</h4>
                <p className="mb-4">
                  By booking an appointment, you agree to the following terms and conditions:
                </p>

                <h4 className="text-base font-semibold mb-3">1. Appointment Booking</h4>
                <ul className="list-disc pl-6 space-y-1 mb-4">
                  <li>All appointments must be booked in advance</li>
                  <li>Payment is required at time of booking to secure your appointment</li>
                  <li>Appointment times are subject to availability</li>
                </ul>

                <h4 className="text-base font-semibold mb-3">2. Client Responsibilities</h4>
                <ul className="list-disc pl-6 space-y-1 mb-4">
                  <li>Arrive on time for your scheduled appointment</li>
                  <li>Provide accurate health and contact information</li>
                  <li>Inform us of any allergies, medical conditions, or concerns</li>
                  <li>Follow pre and post-appointment care instructions</li>
                </ul>

                <h4 className="text-base font-semibold mb-3">3. Privacy & Confidentiality</h4>
                <p className="mb-4">
                  All client information is kept strictly confidential in accordance with our privacy policy. 
                  We do not share personal information with third parties without explicit consent.
                </p>

                <h4 className="text-base font-semibold mb-3">4. Liability</h4>
                <p className="mb-4">
                  While we maintain the highest standards of safety and professionalism, clients participate 
                  in services at their own risk. Please inform us of any medical conditions that may affect 
                  your treatment.
                </p>

                <h4 className="text-base font-semibold mb-3">5. Payment Terms</h4>
                <ul className="list-disc pl-6 space-y-1 mb-4">
                  <li>Payment is due at time of booking</li>
                  <li>Refunds are subject to our cancellation policy</li>
                  <li>Prices are subject to change without notice</li>
                </ul>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200">
              <button
                onClick={() => setShowTermsConditions(false)}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                You are almost there!
              </h3>
              <p className="text-gray-600 mb-6">
                Complete payment to confirm your booking
              </p>

              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                <p className="font-medium text-gray-900 mb-2">
                  {formatDate(selectedDate)} at {selectedTime}
                </p>
                <div className="space-y-1 text-sm text-gray-600">
                  {selectedServices.map((service) => (
                    <p key={service._id}>• {service.title}</p>
                  ))}
                </div>
                <div className="border-t border-gray-200 mt-3 pt-3">
                  <div className="flex justify-between font-semibold">
                    <span>Total:</span>
                    <span>{formatNaira(getTotalPrice())}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePayment}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors mb-4"
              >
                Pay Now - {formatNaira(getTotalPrice())}
              </button>

             
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointment
