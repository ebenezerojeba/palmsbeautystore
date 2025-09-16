import React, { useState, useEffect } from 'react';
import { useServiceVariants } from '../hooks/useServiceVariants';
import { ServiceSelector, VariantSelector } from '../components/ServiceSelector';

const Booking = () => {
  // Your existing state
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const backendUrl = 'http://localhost:3000'; // Adjust as needed

  // Add the variant hook
  const {
    services,
    selectedService,
    selectedVariant,
    providers,
    loading,
    loadServices,
    selectService,
    selectVariant,
    resetSelection,
    getCurrentSelection,
    isUsingVariants
  } = useServiceVariants();

  // Load services on mount
  useEffect(() => {
    loadServices();
  }, []);

  // Your existing functions...
  const handleDateChange = (date) => {
    setSelectedDate(date);
    // Your existing logic
  };

  const handleProviderChange = (provider) => {
    setSelectedProvider(provider);
    // Your existing logic
  };

  // Updated booking submission
  const handleBookingSubmit = async () => {
    const selection = getCurrentSelection();
    
    const bookingData = {
      // Use the same service ID for all variants
      serviceId: selection.serviceId,
      // Include variant ID if it's a variant
      ...(selection.variantId && { variantId: selection.variantId }),
      providerId: selectedProvider._id,
      date: selectedDate,
      time: selectedTime,
      // Other booking data...
      serviceName: selection.serviceName,
      variantName: selection.variantName,
      price: selection.price,
      duration: selection.duration
    };

    try {
      // Your existing booking API call
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
        // setAppointmentId(data.appointment._id);
        // setPaymentUrl(data.paymentUrl);
        // setShowPayment(true);
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
  return (
    <div className="booking-container">
      {/* Step 1: Service Selection */}
      {!selectedService && (
        <ServiceSelector
          services={services}
          onSelectService={selectService}
          loading={loading}
          selectedService={selectedService}
        />
      )}

      {/* Step 2: Variant Selection (only if service has variants) */}
      {selectedService && isUsingVariants && !selectedVariant && (
        <VariantSelector
          service={selectedService}
          onSelectVariant={selectVariant}
          selectedVariant={selectedVariant}
          onBack={resetSelection}
        />
      )}

      {/* Step 3: Provider Selection (your existing component) */}
      {selectedService && (!isUsingVariants || selectedVariant) && (
        <div>
          <h3>Select Provider</h3>
          {/* Your existing provider selection UI */}
          <div className="providers-grid">
            {providers.map(provider => (
              <div
                key={provider._id}
                className={`provider-card ${selectedProvider?._id === provider._id ? 'selected' : ''}`}
                onClick={() => handleProviderChange(provider)}
              >
                <h4>{provider.name}</h4>
                <p>Rating: {provider.rating?.average || 'New'}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 4: Date & Time (your existing components) */}
      {selectedProvider && (
        <div>
          {/* Your existing date/time picker */}
          <DatePicker
            selectedDate={selectedDate}
            onChange={handleDateChange}
          />
          <TimePicker
            selectedTime={selectedTime}
            onChange={setSelectedTime}
          />
        </div>
      )}

      {/* Booking Summary */}
      {selectedService && selectedProvider && selectedDate && selectedTime && (
        <div className="booking-summary">
          <h3>Booking Summary</h3>
          <p>Service: {selectedService.title}</p>
          {selectedVariant && <p>Variant: {selectedVariant.name}</p>}
          <p>Provider: {selectedProvider.name}</p>
          <p>Date: {selectedDate}</p>
          <p>Time: {selectedTime}</p>
          <p>Price: {getCurrentSelection()?.price}</p>
          
          <button onClick={handleBookingSubmit}>
            Confirm Booking
          </button>
        </div>
      )}
    </div>
  );
};

export default Booking;