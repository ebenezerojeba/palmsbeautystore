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
  Star
} from "lucide-react";

const Appointment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { backendUrl, userData } = useContext(AppContext);
  const { formatNaira } = useContext(ShopContext);

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

    if (id) {
      fetchService();
      fetchAllServices();
    }
  }, [id, backendUrl, navigate]);

  // Calculate total price
  const getTotalPrice = () => {
    return selectedServices.reduce((total, service) => total + Number(service.price || 0), 0);
  };

  // Fetch available slots
  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (selectedServices.length === 0) return;

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
  const addService = (service) => {
    const isAlreadySelected = selectedServices.some(s => s._id === service._id);
    if (!isAlreadySelected) {
      setSelectedServices([...selectedServices, service]);
      setShowAddService(false);
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
      toast.error("Please log in first!");
      return;
    }

    setIsBooking(true);

    try {
      const bookingData = {
        services: selectedServices.map(service => ({
          serviceId: service._id,
          serviceTitle: service.title,
          duration: service.duration || 90,
          price: service.price
        })),
        date: selectedDate,
        time: selectedTime,
        totalAmount: getTotalPrice()
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
              {serviceInfo.image && (
                <div className="h-48 sm:h-64">
                  <img
                    src={serviceInfo.image}
                    alt={serviceInfo.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-6">
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
              </div>
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
                    <Plus className="h-4 w-4 mr-2" />
                    Add Service
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
                      <Loader className="animate-spin h-6 w-6 text-blue-600 mr-2" />
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
                              ? "border-blue-500 bg-blue-50 text-blue-700"
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
                      <AlertCircle className="h-8 w-8 mx-auto mb-2" />
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
                    </label>

                    {(() => {
                      const selectedDay = availableSlots.find(slot => slot.date === selectedDate);
                      return selectedDay ? (
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                          {selectedDay.slots.map((timeSlot, index) => (
                            <button
                              key={index}
                              onClick={() => setSelectedTime(timeSlot.time)}
                              className={`p-3 text-sm font-medium rounded-lg border transition-all ${selectedTime === timeSlot.time
                                  ? "border-blue-500 bg-blue-50 text-blue-700"
                                  : "border-gray-200 hover:border-gray-300 text-gray-700"
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
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center text-blue-700 mb-2">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span className="font-medium">
                          {formatDate(selectedDate)}
                        </span>
                      </div>
                      <div className="flex items-center text-blue-700">
                        <Clock className="h-4 w-4 mr-2" />
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

                      <div className="border-t border-gray-200 pt-3">
                        <div className="flex justify-between text-base font-semibold">
                          <span>Total</span>
                          <span>{formatNaira(getTotalPrice())}</span>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Select date and time to see summary</p>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-gray-200">
                <button
                  onClick={handleBooking}
                  disabled={isBooking || !selectedDate || !selectedTime}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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

                <div className="mt-3 flex items-start text-xs text-gray-500">
                  <Info className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                  <p>Payment required to confirm appointment</p>
                </div>
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
                          className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
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

export default Appointment;