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
  const { userData } = useContext(AppContext);
  const { formatNaira } = useContext(ShopContext);
  const backendUrl = "http://localhost:3000"; // Replace with your actual backend URL
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

  // Consent form
  const [consentForm, setConsentForm] = useState({
    healthConditions: "",
    allergies: "",
    medications: "",
    previousTreatments: "",
    skinSensitivities: "",
    pregnancyStatus: false,
    consentToTreatment: false,
    consentToPhotography: false,
    emergencyContact: {
      name: "",
      phone: "",
      relationship: ""
    }
  });
  const [showConsentForm, setShowConsentForm] = useState(true);

  // Add to your state
  const [providers, setProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [showProviderSelection, setShowProviderSelection] = useState(false);
  const [providerSchedule, setProviderSchedule] = useState(null);
  const [showProviderSchedule, setShowProviderSchedule] = useState(false);




  // Function to fetch provider schedule
  const fetchProviderSchedule = async (providerId) => {
    try {
      const startDate = new Date().toISOString().split('T')[0];
      const endDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      const res = await fetch(
        `${backendUrl}/api/provider/${providerId}/schedule?startDate=${startDate}&endDate=${endDate}`
      );
      const data = await res.json();

      if (data.success) {
        setProviderSchedule(data.schedule);
        setShowProviderSchedule(true);
      }
    } catch (err) {
      console.error("Error fetching provider schedule:", err);
      toast.error("Failed to load schedule");
    }
  };


  // Add this useEffect to fetch providers
  // Update your useEffect for fetching providers
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setIsLoading(true);
        const queryParams = new URLSearchParams({
          serviceId: id,
          date: selectedDate || new Date().toISOString().split('T')[0]
        });

        const res = await fetch(`${backendUrl}/api/provider?${queryParams.toString()}`);

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();

        if (data.success) {
          setProviders(data.providers || []);
          // Auto-select first provider if only one exists
          if (data.providers.length === 1) {
            setSelectedProvider(data.providers[0]);
          }
        } else {
          console.error("Failed to fetch providers:", data.message);
          setProviders([]);
        }
      } catch (err) {
        console.error("Error fetching providers:", err);
        toast.error("Failed to load available stylists");
        setProviders([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProviders();
    }
  }, [id, selectedDate, backendUrl]);

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


  const getTotalDuration = () => {
    const total = selectedServices.reduce((total, service) => {
      const duration = parseInt(service.duration) || 90; // Ensure consistent parsing
      return total + duration;
    }, 0);
    console.log('Total duration calculated:', total, 'from services:', selectedServices);
    return total;
  };
  // Fetching available slots
  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (selectedServices.length === 0 || !selectedProvider) return;

      setIsLoading(true);
      try {
        const startDate = new Date().toISOString().split('T')[0];
        const endDate = new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        const servicesForSlots = selectedServices.map(service => ({
          _id: service._id,
          title: service.title,
          duration: service.duration || 90,
          price: service.price
        }));

        const queryParams = new URLSearchParams({
          serviceId: id,
          providerId: selectedProvider._id, // Add provider ID
          startDate,
          endDate,
          selectedServices: JSON.stringify(servicesForSlots)
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
        } else if (data.providers) {
          // Handle the new response format with providers
          setAvailableSlots(data.providers.flatMap(p => p.availableSlots));
        }
        else {
          setAvailableSlots([]);
        }
      } catch (err) {
        console.error('Error fetching slots:', err);
        toast.error("Failed to fetch available slots");
        setAvailableSlots([]);
      } finally {
        setIsLoading

        setIsLoading(false);
      }
    };

    fetchAvailableSlots();
  }, [selectedServices, selectedProvider, id, backendUrl]);

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
    if (!consentForm.consentToTreatment) {
      toast.warn("Please provide consent for treatment");
      return false;
    }
    if (!selectedProvider) {
      toast.warn("Please select a stylist");
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
      // Prepare booking data
      const bookingData = {
        services: selectedServices.map((service, index) => ({
          serviceId: service._id,
          serviceTitle: service.title,
          providerId: selectedProvider._id,
          duration: parseInt(service.duration) || 90,
          price: parseFloat(service.price) || 0,
          order: index + 1
        })),


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
        },

        // Consent form

        consentForm: {
          healthConditions: consentForm.healthConditions,
          allergies: consentForm.allergies,
          consentToTreatment: consentForm.consentToTreatment,
          // medications: consentForm.medications,
          // previousTreatments: consentForm.previousTreatments,
          // skinSensitivities: consentForm.skinSensitivities,
          // pregnancyStatus: consentForm.pregnancyStatus,
          // consentToPhotography: consentForm.consentToPhotography,
          // emergencyContact: consentForm.emergencyContact,
          submittedAt: new Date().toISOString()
        },
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


  // Schedule modal component

  const ProviderScheduleModal = () => {
    const [isLoading, setIsLoading] = useState(!providerSchedule);

    useEffect(() => {
      if (!providerSchedule && selectedProvider) {
        fetchProviderSchedule(selectedProvider._id);
      }
    }, [providerSchedule, selectedProvider]);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedProvider?.name}'s Schedule
              </h3>
              <button onClick={() => setShowProviderSchedule(false)} className="p-2 text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {isLoading ? (
              <div className="text-center py-8">
                <Loader2 className="animate-spin h-8 w-8 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Loading schedule...</p>
              </div>
            ) : providerSchedule ? (
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Working Hours</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {providerSchedule.workingHours?.map(wh => (
                      <div key={wh.dayOfWeek} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">
                          {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][wh.dayOfWeek]}
                        </span>
                        <span className={wh.isWorking ? "text-green-600" : "text-red-600"}>
                          {wh.isWorking ? `${wh.startTime} - ${wh.endTime}` : 'Not working'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {providerSchedule.breaks?.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Scheduled Breaks</h4>
                    <div className="space-y-2">
                      {providerSchedule.breaks.map((breakItem, index) => (
                        <div key={index} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{new Date(breakItem.date).toLocaleDateString()}</p>
                              <p className="text-sm text-gray-600">{breakItem.startTime} - {breakItem.endTime}</p>
                              {breakItem.reason && <p className="text-sm text-gray-600 mt-1">Reason: {breakItem.reason}</p>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {providerSchedule.vacationDays?.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Vacation Days</h4>
                    <div className="space-y-2">
                      {providerSchedule.vacationDays.map((vacation, index) => (
                        <div key={index} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">
                                {new Date(vacation.startDate).toLocaleDateString()} - {new Date(vacation.endDate).toLocaleDateString()}
                              </p>
                              {vacation.reason && <p className="text-sm text-gray-600 mt-1">Reason: {vacation.reason}</p>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No schedule information available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // / Add provider selection component
  const ProviderSelectionModal = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [providersList, setProvidersList] = useState([]);

    useEffect(() => {
      const fetchProvidersForModal = async () => {
        try {
          setIsLoading(true);
          const queryParams = new URLSearchParams({
            serviceId: id,
            date: selectedDate || new Date().toISOString().split('T')[0]
          });

          const res = await fetch(`${backendUrl}/api/provider?${queryParams.toString()}`);
          const data = await res.json();

          if (data.success) {
            setProvidersList(data.providers || []);
          } else {
            toast.error("Failed to load stylists");
            setProvidersList([]);
          }
        } catch (err) {
          console.error("Error fetching providers:", err);
          toast.error("Failed to load stylists");
          setProvidersList([]);
        } finally {
          setIsLoading(false);
        }
      };

      if (showProviderSelection) {
        fetchProvidersForModal();
      }
    }, [showProviderSelection, id, selectedDate, backendUrl]);

    const fetchAllProviders = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`${backendUrl}/api/provider`);
        const data = await res.json();

        if (data.success) {
          setProvidersList(data.providers || []);
        }
      } catch (err) {
        console.error("Error fetching all providers:", err);
        toast.error("Failed to load stylists");
      }
      finally {
        setIsLoading(false);
      }
    }


    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Select Your Stylist
              </h3>
              <button onClick={() => setShowProviderSelection(false)} className="p-2 text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="animate-spin h-8 w-8 text-gray-400 mr-2" />
                <span>Loading stylists...</span>
              </div>
            ) : providersList.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <User className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No stylists available for this service</p>
                <p className="text-sm mt-1">Please try another service or contact us</p>
                <button className="text-blue-500" onClick={() => { fetchAllProviders() }}>Show all available stylists</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {providersList.map(provider => (
                  <div
                    key={provider._id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedProvider?._id === provider._id
                      ? 'border-pink-500 bg-pink-50'
                      : 'border-gray-200 hover:border-gray-300'
                      }`}
                    onClick={() => {
                      setSelectedProvider(provider);
                      setShowProviderSelection(false);
                    }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                        {provider.profileImage ? (
                          <img
                            src={provider.profileImage}
                            alt={provider.name}
                            className="w-16 h-16 rounded-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center"
                          style={{ display: provider.profileImage ? 'none' : 'flex' }}>
                          <User className="h-8 w-8 text-gray-400" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{provider.name}</h4>
                        <div className="flex items-center mt-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < Math.floor(provider.rating?.average || 0)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                                }`}
                            />
                          ))}
                          <span className="text-sm text-gray-600 ml-1">
                            ({provider.rating?.count || 0})
                          </span>
                        </div>
                        {provider.specialties && (
                          <p className="text-sm text-gray-500 mt-1">
                            Specializes in: {provider.specialties.join(', ')}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

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



            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Select Your Stylist</h3>
              </div>

              <div className="flex items-center space-x-4">
                {selectedProvider ? (
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg flex-1">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      {selectedProvider.profileImage ? (
                        <img src={selectedProvider.profileImage} alt={selectedProvider.name} className="w-12 h-12 rounded-full object-cover" />
                      ) : (
                        <User className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{selectedProvider.name}</h4>
                      <div className="flex items-center mt-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${i < Math.floor(selectedProvider.rating?.average || 0)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                              }`}
                          />
                        ))}
                        <span className="text-xs text-gray-600 ml-1">
                          ({selectedProvider.rating?.count || 0})
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowProviderSelection(true)}
                      className="text-pink-600 hover:text-pink-800 text-sm font-medium"
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowProviderSelection(true)}
                    className="flex items-center text-pink-600 hover:text-pink-800 p-3 border border-dashed border-gray-300 rounded-lg flex-1"
                  >
                    <User className="h-5 w-5 mr-2" />
                    Select a stylist
                  </button>
                )}

                {selectedProvider && (
                  <button
                    onClick={() => fetchProviderSchedule(selectedProvider._id)}
                    className="p-3 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg"
                    title="View schedule"
                  >
                    <Calendar className="h-5 w-5" />
                  </button>
                )}
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

                  {!selectedProvider ? (
                    <div className="text-center py-12 text-gray-500">
                      <User className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>Please select a stylist first</p>
                      <button
                        onClick={() => setShowProviderSelection(true)}
                        className="text-pink-600 hover:text-pink-800 mt-2"
                      >
                        Choose Stylist
                      </button>
                    </div>
                  ) : isLoading ? (
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
                            {daySlot.dayOfWeek?.substring(0, 3)}
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
                      <p>No available slots found for {selectedProvider.name}</p>
                      <p className="text-sm">Please try a different stylist or contact us</p>
                      <button
                        onClick={() => setShowProviderSelection(true)}
                        className="text-pink-600 hover:text-pink-800 mt-2 text-sm"
                      >
                        Choose another stylist
                      </button>
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
                              className={`p-3 text-sm font-medium rounded-lg border transition-all ${selectedTime === timeSlot.time
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

            {/* <!-- Thank you message --> */}



            <p class="text-gray-700">
              <span class="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-gray-700 text-lg">
                Thank you for booking with us!
              </span> All prices displayed on the website are tax inclusive. Add-ons such as braiding, extensions, wash, and detangling will be calculated during checkout.
            </p>

            {/* <!-- Important note --> */}
            <div class="bg-gray-100 border-l-4 border-gray-500 p-4 rounded-r">
              <p class="text-gray-800 font-medium">Please note:</p>
              <p class="text-gray-700">The time indicated per appointment are estimations and can vary based on size of head, quantity of braids and length in comparison to your height.</p>
            </div>

            {/* <!-- Additional information --> */}



            {/* Terms and Policies */}
            <div className="bg-white rounded-lg shadow-sm">

              <div className="p-1 space-y-4">
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

                </div>
              </div>
            </div>
          </div>

          {/* Consent Form */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-1 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Consent Form
                </h3>
                <button
                  // onClick={() => setShowConsentForm(!showConsentForm)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  {/* {showConsentForm ? 'Hide Form' : 'Show Form'} */}
                </button>
              </div>
            </div>

            {showConsentForm && (
              <div className="p-6 space-y-6">
                {/* Health Information */}
                <div className="space-y-4">
                  {/* <h4 className="font-medium text-gray-900">Health Information</h4> */}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Do you have any health conditions we should be aware of?
                    </label>
                    <textarea
                      value={consentForm.healthConditions}
                      onChange={(e) => setConsentForm({ ...consentForm, healthConditions: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="2"
                      placeholder="Please list any relevant health conditions..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Allergies (especially to hair products, chemicals, or materials)
                    </label>
                    <textarea
                      value={consentForm.allergies}
                      onChange={(e) => setConsentForm({ ...consentForm, allergies: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="2"
                      placeholder="List any known allergies..."
                    />
                  </div>
                </div>

                {/* Consent Checkboxes */}
                <div className="space-y-4">
                  {/* <h4 className="font-medium text-gray-900">Consent & Agreement</h4> */}

                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        id="consent-treatment"
                        checked={consentForm.consentToTreatment}
                        onChange={(e) => setConsentForm({ ...consentForm, consentToTreatment: e.target.checked })}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded mt-1"
                      />
                      <label htmlFor="consent-treatment" className="text-sm text-gray-700">
                        I consent to receive the selected beauty/hair services and understand the procedures involved
                      </label>
                    </div>

                    {/* <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="consent-photography"
              checked={consentForm.consentToPhotography}
              onChange={(e) => setConsentForm({...consentForm, consentToPhotography: e.target.checked})}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded mt-1"
            />
            <label htmlFor="consent-photography" className="text-sm text-gray-700">
              I consent to before/after photos being taken for portfolio purposes (optional)
            </label>
          </div> */}
                  </div>
                </div>
              </div>
            )}
          </div>


          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm sticky top-8">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Booking Summary
                </h3>
              </div>

              {/* // In your sidebar booking summary, add this section: */}
              {selectedProvider && (
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      {selectedProvider.profileImage ? (
                        <img src={selectedProvider.profileImage} alt={selectedProvider.name} className="w-12 h-12 rounded-full object-cover" />
                      ) : (
                        <User className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{selectedProvider.name}</h4>
                      <div className="flex items-center mt-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${i < Math.floor(selectedProvider.rating?.average || 0)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                              }`}
                          />
                        ))}
                        <span className="text-xs text-gray-600 ml-1">
                          ({selectedProvider.rating?.count || 0})
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowProviderSelection(true)}
                    className="text-xs text-pink-600 hover:text-pink-800 mt-2"
                  >
                    Change stylist
                  </button>
                </div>
              )}

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
                      {/* In your date selection section */}
                      {!selectedProvider ? (
                        <div className="text-center py-12 text-gray-500">
                          <User className="h-12 w-12 mx-auto mb-3 opacity-50" />
                          <p>Please select a stylist first</p>
                          <button
                            onClick={() => setShowProviderSelection(true)}
                            className="text-pink-600 hover:text-pink-800 mt-2"
                          >
                            Choose Stylist
                          </button>
                        </div>
                      ) : isLoading ? (
                        <div className="flex justify-center items-center py-12">
                          <Loader2 className="h-8 w-8 animate-spin text-pink-600" />
                          <span className="ml-2 text-gray-600">Loading available slots...</span>
                        </div>
                      ) : availableSlots.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
                          {availableSlots.map((slot, index) => (
                            <button
                              key={index}
                              onClick={() => setSelectedSlot(slot)}
                              className={`px-4 py-2 rounded-lg border text-sm font-medium transition
          ${selectedSlot === slot
                                  ? "bg-pink-600 text-white border-pink-600"
                                  : "bg-white text-gray-700 border-gray-300 hover:border-pink-400"
                                }`}
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12 text-gray-500">
                          <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                          <p>No available slots for this stylist</p>
                        </div>
                      )}

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
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    {/* <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" /> */}
                    <p>Select date and time to see summary</p>
                  </div>
                )}
              </div>

              <div className="p-6 flex justify-center">
                <button
                  onClick={handleBooking}
                  disabled={isBooking || !selectedDate || !selectedTime || !agreeToCancellationPolicy || !consentForm.consentToTreatment}
                  className="bg-pink-900 text-white py-3 px-4 rounded-lg justify-center items-center font-medium hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed "
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
// In your Add Service modal, enhance the service cards:
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

                          {/* Add provider availability info */}
                          <div className="mt-2 text-xs text-gray-500">
                            Available with {service.providers?.length || 0} stylists
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

      {/* // Add to your UI somewhere appropriate */}
      <div className="flex items-center space-x-4 mb-4">
        <button
          onClick={() => setShowProviderSelection(true)}
          className="flex items-center text-pink-600 hover:text-pink-800"
        >
          <User className="h-4 w-4 mr-1" />
          {selectedProvider ? `Stylist: ${selectedProvider.name}` : 'Select Stylist'}
        </button>

        {selectedProvider && (
          <button
            onClick={() => fetchProviderSchedule(selectedProvider._id)}
            className="flex items-center text-gray-600 hover:text-gray-800 text-sm"
          >
            <Calendar className="h-4 w-4 mr-1" />
            View Schedule
          </button>
        )}
      </div>

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

      {/* // Add these at the end of your return statement, before the closing </div> */}
      {showProviderSelection && <ProviderSelectionModal />}
      {showProviderSchedule && <ProviderScheduleModal />}

    </div>
  );
};

export default Appointment;