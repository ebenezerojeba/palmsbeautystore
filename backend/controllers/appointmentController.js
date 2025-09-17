import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import appointmentModel from "../models/appointment.js";
import userModel from "../models/userModel.js";
import Stripe from 'stripe';
import providerModel from "../models/providerModel.js";
import dotenv from "dotenv";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get user appointments
const getUserAppointments = async (req, res) => {
  try {
    // Verify the requested userId matches the authenticated user
    if (req.params.userId !== req.userId) {
      return res.status(403).json({ 
        success: false,
        message: "Unauthorized access to appointments" 
      });
    }
    
    const appointments = await appointmentModel.find({ userId: req.params.userId })
      .sort({ date: 1, time: 1 })  // Sort by upcoming first
      .lean();

    if (!appointments.length) {
      return res.status(200).json({ 
        success: true,
        message: "No appointments found",
        appointments: []
      });
    }

    res.status(200).json({
      success: true,
      appointments
    });

  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch appointments" 
    });
  }
};

// Cancel appointment
const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId, reason, cancelledBy } = req.body;

    // Validate input
    if (!appointmentId || !reason) {
      return res.status(400).json({
        success: false,
        message: "Appointment ID and reason are required"
      });
    }

    // Fetch the appointment
    const appointment = await appointmentModel.findById(appointmentId);

    // Check if appointment exists
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found"
      });
    }

    // Check if appointment has a userId
    if (!appointment.userId) {
      return res.status(400).json({
        success: false,
        message: "Appointment is missing user ID"
      });
    }

    // Confirm user is authorized to cancel the appointment
    if (appointment.userId.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to cancel this appointment"
      });
    }

    // Prevent duplicate cancellations
    if (appointment.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: "Appointment is already cancelled"
      });
    }

    // Calculate refund eligibility
    const appointmentDate = new Date(appointment.date);
    const [hours, minutes] = appointment.time.split(':').map(Number);
    appointmentDate.setHours(hours, minutes, 0, 0);

    const hoursUntilAppointment = (appointmentDate - new Date()) / (1000 * 60 * 60);
    const refundEligible = hoursUntilAppointment > 24;

    // Update appointment
    appointment.status = 'cancelled';
    appointment.cancellation = {
      cancelledBy,
      reason,
      refundEligible,
      cancellationFee: refundEligible ? 0 : Math.floor(appointment.payment?.amount * 0.1) || 0
    };
    appointment.cancelledAt = new Date();

    await appointment.save();

    return res.status(200).json({
      success: true,
      message: "Appointment cancelled successfully",
      appointment
    });

  } catch (error) {
    console.error("Error cancelling appointment:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to cancel appointment"
    });
  }
};


const getAvailableSlots = async (req, res) => {
  try {
    const { serviceId, providerId, startDate, endDate, selectedServices } = req.query;

    console.log("🔍 Request params:", { serviceId, providerId, startDate, endDate });

    // Validate serviceId
    if (!serviceId || serviceId === 'undefined' || serviceId === 'null') {
      return res.status(400).json({ 
        message: "Service ID is required",
        received: serviceId
      });
    }

    if (!serviceId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ 
        message: "Invalid service ID format",
        serviceId: serviceId
      });
    }

    // Parse selected services and calculate total duration
    let servicesToBook = [];
    if (selectedServices) {
      try {
        servicesToBook = JSON.parse(selectedServices);
      } catch (e) {
        return res.status(400).json({ message: "Invalid selectedServices format" });
      }
    }

    const totalServiceDuration = servicesToBook.length > 0 
      ? servicesToBook.reduce((total, service) => total + (parseInt(service.duration) || 90), 0)
      : 90;

    console.log("📊 Total service duration:", totalServiceDuration, "minutes");

    // Set date range
    const start = new Date(startDate || new Date());
    const end = new Date(endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));

    // Find providers for this service
    let availableProviders = [];
    
    if (providerId && providerId !== 'undefined') {
      const provider = await providerModel.findById(providerId).populate('services');
      if (provider && provider.isActive) {
        availableProviders = [provider];
      }
    } else {
      availableProviders = await providerModel.find({ 
        services: { $in: [serviceId] }, 
        isActive: true 
      }).populate('services');
    }

    console.log("👥 Available providers:", availableProviders.length);

    if (availableProviders.length === 0) {
      return res.status(404).json({ message: "No providers available for this service" });
    }

    // Generate UNIQUE available slots (NO DUPLICATES)
    const uniqueSlots = await generateUniqueAvailableSlots(
      start,
      end,
      totalServiceDuration,
      availableProviders
    );

    console.log("✅ Final unique slots:", uniqueSlots.length);

    res.status(200).json({ 
      availableSlots: uniqueSlots,
      totalDuration: totalServiceDuration,
      providers: availableProviders.map(p => ({
        _id: p._id,
        name: p.name,
        profileImage: p.profileImage,
        rating: p.rating
      })),
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error("❌ Error fetching available slots:", error);
    res.status(500).json({ 
      message: "Failed to fetch available slots",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// FIXED: Generate unique slots - eliminates duplicates completely
const generateUniqueAvailableSlots = async (start, end, totalDuration, providers) => {
  const uniqueSlotsMap = new Map(); // Key: "YYYY-MM-DD", Value: slot data
  const now = new Date();

  console.log("🔄 Generating unique slots...");

  // Loop through each date
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    const dayOfWeek = d.getDay();
    const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek];

    console.log(`📅 Processing date: ${dateStr} (${dayName})`);

    // Find the BEST available slots for this specific date
    const bestSlotsForDate = await findBestAvailableSlotsForDate(
      d, 
      totalDuration, 
      providers, 
      now
    );

    // Only add to map if we found valid slots (prevents duplicates)
    if (bestSlotsForDate.length > 0) {
      uniqueSlotsMap.set(dateStr, {
        date: dateStr,
        dayOfWeek: dayName,
        slots: bestSlotsForDate,
        totalDuration,
        isLongDuration: totalDuration > 480
      });

      console.log(`✅ Added ${bestSlotsForDate.length} slots for ${dateStr}`);
    } else {
      console.log(`❌ No valid slots for ${dateStr}`);
    }
  }

  // Convert map to array and sort by date
  const uniqueSlots = Array.from(uniqueSlotsMap.values()).sort((a, b) => 
    new Date(a.date) - new Date(b.date)
  );

  console.log("🎯 Total unique date slots:", uniqueSlots.length);
  return uniqueSlots;
};

// FIXED: Find best slots for a specific date with proper provider scheduling
const findBestAvailableSlotsForDate = async (date, totalDuration, providers, currentTime) => {
  const availableSlots = [];
  const isToday = date.toDateString() === currentTime.toDateString();
  
  console.log(`🔍 Finding slots for ${date.toISOString().split('T')[0]}, Duration: ${totalDuration}min`);

  // Handle very long services (10+ hours) - Multi-day scheduling
  if (totalDuration >= 600) {
    console.log("🕰️ Handling very long service (10+ hours)");
    return await handleMultiDayService(date, totalDuration, providers);
  }

  // Generate time slots based on service duration and business logic
  const potentialTimeSlots = generateSmartTimeSlots(date, totalDuration, isToday, currentTime);
  console.log(`⏰ Generated ${potentialTimeSlots.length} potential time slots`);

  // For each time slot, find the FIRST available provider (prevents duplicates)
  for (const timeSlot of potentialTimeSlots) {
    console.log(`🔍 Checking time slot: ${timeSlot.time}`);

    // Find the first available provider for this time slot
    const availableProvider = await findFirstAvailableProvider(
      providers,
      date,
      timeSlot.time,
      totalDuration
    );

    if (availableProvider) {
      console.log(`✅ Found provider ${availableProvider.name} for ${timeSlot.time}`);
      
      availableSlots.push({
        time: timeSlot.time,
        available: true,
        duration: totalDuration,
        providerId: availableProvider._id,
        providerName: availableProvider.name,
        estimatedEndTime: timeSlot.endTime,
        isLongDuration: totalDuration > 480,
        providerInfo: {
          _id: availableProvider._id,
          name: availableProvider.name,
          profileImage: availableProvider.profileImage,
          rating: availableProvider.rating
        }
      });
    } else {
      console.log(`❌ No provider available for ${timeSlot.time}`);
    }
  }

  console.log(`🎯 Final available slots for date: ${availableSlots.length}`);
  return availableSlots;
};

// FIXED: Generate smart time slots that respect business hours and service duration
const generateSmartTimeSlots = (date, duration, isToday, currentTime) => {
  const slots = [];
  
  console.log(`⚙️ Generating smart time slots for duration: ${duration} minutes`);

  // Determine business hours based on service duration
  let businessStart, businessEnd, slotInterval;

  if (duration >= 480) { // 8+ hours
    businessStart = isToday ? Math.max(currentTime.getHours() + 1, 8) : 8;
    businessEnd = 9; // Must start by 9 AM for 8+ hour services
    slotInterval = 60; // 1-hour intervals
    console.log("🕰️ Long service (8+ hours): Start 8-9 AM only");
  } else if (duration >= 360) { // 6+ hours  
    businessStart = isToday ? Math.max(currentTime.getHours() + 1, 9) : 9;
    businessEnd = 12; // Must start by 12 PM for 6+ hour services
    slotInterval = 30;
    console.log("🕰️ Medium service (6+ hours): Start 9 AM - 12 PM");
  } else if (duration >= 240) { // 4+ hours
    businessStart = isToday ? Math.max(currentTime.getHours() + 1, 9) : 9;
    businessEnd = 16; // Must start by 4 PM for 4+ hour services  
    slotInterval = 30;
    console.log("🕰️ Medium service (4+ hours): Start 9 AM - 4 PM");
  } else { // Regular services
    businessStart = isToday ? Math.max(currentTime.getHours() + 1, 9) : 9;
    businessEnd = 18; // Can start as late as 6 PM
    slotInterval = 30;
    console.log("🕰️ Regular service: Start 9 AM - 6 PM");
  }

  // Generate time slots within business constraints
  for (let hour = businessStart; hour <= businessEnd; hour++) {
    for (let minute = 0; minute < 60; minute += slotInterval) {
      const timeSlot = new Date(date);
      timeSlot.setHours(hour, minute, 0, 0);
      
      // Calculate end time
      const endTime = new Date(timeSlot.getTime() + duration * 60000);
      
      // Ensure service ends by 10 PM (22:00)
      if (endTime.getHours() <= 22) {
        const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const endTimeStr = `${endTime.getHours().toString().padStart(2, '0')}:${endTime.getMinutes().toString().padStart(2, '0')}`;
        
        slots.push({
          time: timeStr,
          endTime: endTimeStr
        });
      }
    }
  }

  console.log(`✅ Generated ${slots.length} time slots`);
  return slots;
};

// FIXED: Find first available provider (prevents multiple providers for same slot)
const findFirstAvailableProvider = async (providers, date, time, duration) => {
  console.log(`🔍 Checking ${providers.length} providers for ${time}`);

  for (const provider of providers) {
    console.log(`👤 Checking provider: ${provider.name}`);
    
    const isAvailable = await checkProviderAvailabilityStrict(
      provider._id,
      date,
      time,
      duration,
      provider.workingHours
    );

    if (isAvailable) {
      console.log(`✅ Provider ${provider.name} is available`);
      return provider;
    } else {
      console.log(`❌ Provider ${provider.name} is not available`);
    }
  }

  return null; // No provider available
};

// FIXED: Strict provider availability check that respects working hours
const checkProviderAvailabilityStrict = async (providerId, date, time, duration, workingHours) => {
  try {
    console.log(`🔍 Checking strict availability for provider ${providerId}`);

    // Check provider's working hours first
    const dayOfWeek = date.getDay();
    const providerDay = workingHours.find(wh => wh.dayOfWeek === dayOfWeek && wh.isWorking);

    if (!providerDay) {
      console.log(`❌ Provider doesn't work on day ${dayOfWeek}`);
      return false;
    }

    console.log(`📋 Provider hours: ${providerDay.startTime} - ${providerDay.endTime}`);

    // Parse requested time
    const [requestHour, requestMinute] = time.split(':').map(Number);
    const requestDateTime = new Date(date);
    requestDateTime.setHours(requestHour, requestMinute, 0, 0);

    // Parse provider's working hours
    const [startHour, startMinute] = providerDay.startTime.split(':').map(Number);
    const [endHour, endMinute] = providerDay.endTime.split(':').map(Number);
    
    const workStart = new Date(date);
    workStart.setHours(startHour, startMinute, 0, 0);
    
    const workEnd = new Date(date);
    workEnd.setHours(endHour, endMinute, 0, 0);

    // Check if requested time is within working hours
    if (requestDateTime < workStart) {
      console.log(`❌ Requested time ${time} is before work start ${providerDay.startTime}`);
      return false;
    }

    // Calculate service end time
    const serviceEnd = new Date(requestDateTime.getTime() + duration * 60000);

    // Check if service ends after working hours
    if (serviceEnd > workEnd) {
      console.log(`❌ Service would end at ${serviceEnd.toTimeString().slice(0,5)} after work end ${providerDay.endTime}`);
      return false;
    }

    // Check for existing appointments
    const dateStr = date.toISOString().split('T')[0];
    const existingAppointments = await appointmentModel.find({
      providerId,
      date: dateStr,
      status: { $in: ['pending', 'confirmed'] }
    }).select('time totalDuration duration');

    console.log(`📅 Found ${existingAppointments.length} existing appointments`);

    // Check for time conflicts with buffer
    for (const apt of existingAppointments) {
      const [aptHour, aptMinute] = apt.time.split(':').map(Number);
      const aptStart = new Date(date);
      aptStart.setHours(aptHour, aptMinute, 0, 0);
      
      const aptDuration = apt.totalDuration || apt.duration || 90;
      const aptEnd = new Date(aptStart.getTime() + aptDuration * 60000);

      // Add buffer time
      const bufferedRequestStart = new Date(requestDateTime.getTime() - BUFFER_MINUTES * 60000);
      const bufferedRequestEnd = new Date(serviceEnd.getTime() + BUFFER_MINUTES * 60000);
      const bufferedAptStart = new Date(aptStart.getTime() - BUFFER_MINUTES * 60000);
      const bufferedAptEnd = new Date(aptEnd.getTime() + BUFFER_MINUTES * 60000);

      // Check for overlap
      const hasOverlap = (
        (bufferedRequestStart >= bufferedAptStart && bufferedRequestStart < bufferedAptEnd) ||
        (bufferedRequestEnd > bufferedAptStart && bufferedRequestEnd <= bufferedAptEnd) ||
        (bufferedRequestStart <= bufferedAptStart && bufferedRequestEnd >= bufferedAptEnd)
      );

      if (hasOverlap) {
        console.log(`❌ Conflict with appointment ${apt.time} - ${aptEnd.toTimeString().slice(0,5)}`);
        return false;
      }
    }

    console.log(`✅ Provider is available for ${time}`);
    return true;

  } catch (error) {
    console.error('❌ Error checking provider availability:', error);
    return false;
  }
};

// FIXED: Handle multi-day services (10+ hours)
const handleMultiDayService = async (startDate, totalDuration, providers) => {
  console.log(`🗓️ Handling multi-day service: ${totalDuration} minutes`);
  
  const slots = [];
  const maxDailyHours = 8 * 60; // 8 hours per day
  const daysNeeded = Math.ceil(totalDuration / maxDailyHours);

  console.log(`📊 Days needed: ${daysNeeded}`);

  // Check each provider for consecutive day availability
  for (const provider of providers) {
    const canSchedule = await checkConsecutiveDaysAvailability(
      provider._id,
      startDate,
      daysNeeded,
      provider.workingHours
    );

    if (canSchedule) {
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + daysNeeded - 1);

      slots.push({
        time: "08:00", // Start early for multi-day services
        available: true,
        duration: totalDuration,
        providerId: provider._id,
        providerName: provider.name,
        isMultiDay: true,
        daysNeeded: daysNeeded,
        endDate: endDate.toISOString().split('T')[0],
        estimatedEndTime: `Day ${daysNeeded} - 4:00 PM`,
        isLongDuration: true,
        providerInfo: {
          _id: provider._id,
          name: provider.name,
          profileImage: provider.profileImage,
          rating: provider.rating
        }
      });

      console.log(`✅ Multi-day slot created for ${provider.name}`);
      break; // Only need one provider for multi-day
    }
  }

  return slots;
};

// Check consecutive days availability for multi-day services
const checkConsecutiveDaysAvailability = async (providerId, startDate, daysNeeded, workingHours) => {
  console.log(`🔍 Checking ${daysNeeded} consecutive days for provider ${providerId}`);

  for (let i = 0; i < daysNeeded; i++) {
    const checkDate = new Date(startDate);
    checkDate.setDate(checkDate.getDate() + i);
    
    const dayOfWeek = checkDate.getDay();
    const providerDay = workingHours.find(wh => wh.dayOfWeek === dayOfWeek && wh.isWorking);

    if (!providerDay) {
      console.log(`❌ Provider doesn't work on day ${i + 1}`);
      return false;
    }

    // Check for existing appointments
    const dateStr = checkDate.toISOString().split('T')[0];
    const existingAppointments = await appointmentModel.find({
      providerId,
      date: dateStr,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (existingAppointments.length > 0) {
      console.log(`❌ Provider has appointments on day ${i + 1}`);
      return false;
    }
  }

  console.log(`✅ Provider available for all ${daysNeeded} consecutive days`);
  return true;
};



const bookMultipleAppointment = async (req, res) => {
  try {
    const { services, date, time, totalAmount, clientNotes, consentForm } = req.body;
    let { providerId } = req.body;
    const userId = req.userId;

    console.log("📝 Booking request:", { services, date, time, providerId, userId });

    // Validation
    if (!services || !Array.isArray(services) || services.length === 0) {
      return res.status(400).json({ message: "At least one service is required" });
    }

    if (!consentForm?.consentToTreatment) {
      return res.status(400).json({ message: "Treatment consent is required" });
    }

    // Get user data
    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    // Calculate service totals
    const { calculatedDuration, calculatedAmount, processedServices } = calculateServiceTotals(services);

    // Validate provider availability one final time
    if (providerId) {
      const provider = await providerModel.findById(providerId);
      if (!provider || !provider.isActive) {
        return res.status(404).json({ message: "Provider not available" });
      }

      const isStillAvailable = await checkProviderAvailabilityStrict(
        providerId,
        new Date(date),
        time,
        calculatedDuration,
        provider.workingHours
      );

      if (!isStillAvailable) {
        return res.status(409).json({ 
          message: "This time slot is no longer available. Please select a different time." 
        });
      }
    } else {
      return res.status(400).json({ message: "Provider ID is required" });
    }

    // Get provider data
    const providerData = await providerModel.findById(providerId);

    // Create appointment date object
    const appointmentDate = new Date(date);
    const [hour, minute] = time.split(':').map(Number);
    appointmentDate.setHours(hour, minute, 0, 0);

    // Create the appointment
    const newAppointment = await appointmentModel.create({
      userId,
      providerId,
      providerName: providerData.name,
      services: processedServices,
      serviceId: services[0].serviceId,
      serviceTitle: services.length > 1 
        ? `${services[0].serviceTitle} + ${services.length - 1} more`
        : services[0].serviceTitle,
      userName: userData.name,
      userEmail: userData.email,
      userPhone: userData.phone,
      date: appointmentDate,
      time,
      clientNotes: clientNotes,
      totalDuration: calculatedDuration,
      isLongDuration: calculatedDuration > 480,
      isMultiDay: calculatedDuration >= 600,
      status: 'pending',
      payment: {
        amount: calculatedAmount,
        currency: 'CAD',
        status: 'pending'
      }
    });

    // / Add this after creating the appointment, before the Stripe session
const emailData = {
  appointmentId: newAppointment._id.toString(),
  clientName: userData.name,
  clientEmail: userData.email,
  clientPhone: userData.phone,
  providerName: providerData.name,
  providerEmail: providerData.email, // Make sure your provider model has email
  services: processedServices,
  date: appointmentDate,
  time,
  totalAmount: calculatedAmount,
  clientNotes,
};

// Send emails (don't await to avoid blocking the response)
// sendAppointmentEmails(emailData)
//   .then(result => {
//     console.log('📧 Email sending result:', result);
//   })
//   .catch(error => {
//     console.error('📧 Email sending error:', error);
//   });

    console.log("✅ Appointment created successfully");

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'cad',
          product_data: {
            name: `${services.length > 1 ? 'Multiple Services' : services[0].serviceTitle}`,
            description: `Appointment with ${providerData.name} on ${date} at ${time}`,
          },
          unit_amount: Math.round(calculatedAmount * 100), // Convert to cents
        },
        quantity: 1,
      }],
      mode: 'payment',
       success_url: `${process.env.FRONTEND_URL}/appointment/verify/${newAppointment._id}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/appointment/cancelled`,      metadata: {
        appointmentId: newAppointment._id.toString(),
        userId: userId.toString(),
        providerId: providerId.toString(),
      },
      customer_email: userData.email,
    });

    console.log("💳 Stripe session created:", session.id);
    console.log("💳 Payment URL:", session.url);
    
    res.status(201).json({
      message: "Appointment created successfully. Please complete payment.",
      appointment: newAppointment,
      paymentUrl: session.url,  // <-- THIS WAS MISSING!
      assignedProvider: {
        _id: providerData._id,
        name: providerData.name,
        profileImage: providerData.profileImage
      }
    });

  } catch (error) {
    console.error("❌ Error booking appointment:", error);
    res.status(500).json({ 
      message: error.message || "Failed to book appointment" 
    });
  }
};


// Helper function to calculate service totals
const calculateServiceTotals = (services) => {
  let calculatedDuration = 0;
  let calculatedAmount = 0;
  
  const processedServices = services.map((service, index) => {
    const servicePrice = parseFloat(service.price) || 0;
    const serviceDuration = parseInt(service.duration) || 90;
    
    calculatedAmount += servicePrice;
    calculatedDuration += serviceDuration;
    
    return {
      serviceId: service.serviceId,
      serviceTitle: service.serviceTitle,
      duration: serviceDuration,
      price: servicePrice,
      order: index + 1
    };
  });

  return {
    calculatedDuration,
    calculatedAmount,
    processedServices
  };
};


// Adjust this import path based on your project

const bookAppointment = async (req, res) => {
  try {
    const { serviceId, serviceTitle, date, time, duration, amount } = req.body;
    const userId = req.userId;

    if (!time || !serviceId) {
      return res.status(400).json({ message: "Required fields are missing" });
    }

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingAppointment = await appointmentModel.findOne({
      date: new Date(date),
      time,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (existingAppointment) {
      return res.status(409).json({ 
        message: "This slot is no longer available. Please select another time." 
      });
    }

    // Convert single service to services array format
    const serviceData = {
      serviceId,
      serviceTitle,
      duration: parseInt(duration) || 90,
      price: amount,
      order: 1
    };

    const newAppointment = await appointmentModel.create({
      userId,
      services: [serviceData], // Store as array for consistency
      
      // Keep backward compatibility fields
      serviceId,
      serviceTitle,
      duration: duration.toString(),
      totalDuration: parseInt(duration) || 90,
      
      userName: userData.name,
      userEmail: userData.email,
      userPhone: userData.phone,
      date: new Date(date),
      time,
      status: 'pending',
      payment: {
        amount,
        status: 'pending'
      }
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'cad',
          product_data: {
            name: serviceTitle
          },
          unit_amount: amount * 100,
        },
        quantity: 1
      }],
      mode: 'payment',
      customer_email: userData.email,
      success_url: `${process.env.FRONTEND_URL}/appointment/verify/${newAppointment._id}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/appointment/cancelled`,
      metadata: {
        appointmentId: newAppointment._id.toString()
      }
    });

    res.status(201).json({
      message: "Appointment created. Please complete payment.",
      appointment: newAppointment,
      paymentUrl: session.url
    });

  } catch (error) {
    console.error("Error booking appointment:", error);
    res.status(500).json({ message: error.message || "Failed to book appointment" });
  }
}

// NEW FUNCTION - Handle Stripe redirect (GET request)
const handleStripeRedirect = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { session_id } = req.query;

    if (!session_id) {
      return res.redirect(`${process.env.FRONTEND_URL}/appointment/error?message=Invalid session`);
    }

    // Redirect to your frontend verification page with the data
    const redirectUrl = `${process.env.FRONTEND_URL}/verify-payment?appointmentId=${appointmentId}&sessionId=${session_id}`;
    res.redirect(redirectUrl);

  } catch (error) {
    console.error("Error handling Stripe redirect:", error);
    res.redirect(`${process.env.FRONTEND_URL}/appointment/error?message=Verification failed`);
  }
};


const verifyAppointmentPayment = async (req, res) => {
  try {
    console.log("🔍 Starting payment verification...");
    console.log("Request body:", req.body);
    console.log("User ID from token:", req.userId);
    
    const { sessionId, appointmentId } = req.body;

    // Validate required fields
    if (!sessionId || !appointmentId) {
      console.log("❌ Missing required fields");
      return res.status(400).json({ 
        success: false,
        message: "Session ID and Appointment ID are required" 
      });
    }

    // Find appointment with FIXED field name - use userId instead of user
    console.log("🔍 Looking for appointment:", appointmentId, "for user:", req.userId);
    const appointment = await appointmentModel.findOne({
      _id: appointmentId,
      userId: req.userId // FIXED: Changed from 'user' to 'userId'
    });

    if (!appointment) {
      console.log("❌ Appointment not found or doesn't belong to user");
      return res.status(404).json({ 
        success: false,
        message: "Appointment not found or access denied" 
      });
    }

    console.log("✅ Appointment found:", appointment._id);
    console.log("Current appointment status:", appointment.status);
    console.log("Current payment status:", appointment.payment?.status);

    // Check if already verified
    if (appointment.payment?.status === 'paid') {
      console.log("⚠️ Payment already verified");
      return res.json({
        success: true,
        message: "Payment already verified",
        appointment
      });
    }

    // Retrieve Stripe session
    console.log("🔍 Retrieving Stripe session:", sessionId);
    let session;
    try {
      session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ['payment_intent']
      });
      console.log("✅ Stripe session retrieved successfully");
      console.log("Session payment_status:", session.payment_status);
      console.log("Session status:", session.status);
    } catch (stripeError) {
      console.error("❌ Stripe session retrieval failed:", stripeError.message);
      return res.status(400).json({
        success: false,
        message: "Invalid payment session",
        details: stripeError.message
      });
    }

    // Handle different payment statuses
    if (session.payment_status === 'unpaid') {
      console.log("⏳ Payment still unpaid");
      return res.status(200).json({
        success: false,
        status: 'processing',
        message: "Payment is being processed",
        payment_status: session.payment_status
      });
    }

    if (session.payment_status !== 'paid') {
      console.log("❌ Payment not completed, status:", session.payment_status);
      return res.status(200).json({
        success: false,
        message: `Payment ${session.payment_status}. Please try again or contact support.`,
        payment_status: session.payment_status,
        session_status: session.status
      });
    }

    // Payment is successful, update appointment
    console.log("✅ Payment confirmed, updating appointment...");
    
    appointment.payment = {
      status: 'paid',
      transactionId: session.payment_intent.id,
      paymentDate: new Date(),
      amount: session.amount_total / 100
    };
    appointment.status = 'confirmed';
    appointment.confirmedAt = new Date();

    await appointment.save();
    console.log("✅ Appointment updated successfully");

    return res.json({
      success: true,
      message: "Payment verified and appointment confirmed",
      appointment
    });

  } catch (error) {
    console.error("💥 Payment verification error:", error);
    console.error("Error stack:", error.stack);
    
    let statusCode = 500;
    let message = "Payment verification failed";
    let details = error.message;

    // Handle specific error types
    if (error.name === 'CastError') {
      statusCode = 400;
      message = "Invalid appointment ID format";
    } else if (error.type === 'StripeInvalidRequestError') {
      statusCode = 400;
      message = "Invalid Stripe session";
      details = error.raw?.message || error.message;
    } else if (error.name === 'ValidationError') {
      statusCode = 400;
      message = "Data validation failed";
      details = Object.values(error.errors).map(e => e.message).join(', ');
    }
    
    res.status(statusCode).json({ 
      success: false,
      message,
      details,
      error_type: error.name || error.type
    });
  }
};

// Update appointment notes (for service provider)
const updateAppointmentNotes = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { preAppointment, duringAppointment, postAppointment, privateNotes } = req.body;

    const appointment = await appointmentModel.findByIdAndUpdate(
      appointmentId,
      {
        $set: {
          'serviceProviderNotes.preAppointment': preAppointment,
          'serviceProviderNotes.duringAppointment': duringAppointment,
          'serviceProviderNotes.postAppointment': postAppointment,
          'serviceProviderNotes.privateNotes': privateNotes
        }
      },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({
      message: "Notes updated successfully",
      appointment
    });

  } catch (error) {
    console.error("Error updating notes:", error);
    res.status(500).json({ message: "Failed to update notes" });
  }
};

// Complete appointment
const completeAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { postAppointmentNotes, rating } = req.body;

    const appointment = await appointmentModel.findByIdAndUpdate(
      appointmentId,
      {
        status: 'completed',
        completedAt: new Date(),
        'serviceProviderNotes.postAppointment': postAppointmentNotes,
        'followUp.rating': rating
      },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({
      message: "Appointment marked as completed",
      appointment
    });

  } catch (error) {
    console.error("Error completing appointment:", error);
    res.status(500).json({ message: "Failed to complete appointment" });
  }
};

// Download calendar event
const downloadCalendar = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const filePath = path.join(__dirname, "..", "calendar", `event-${appointmentId}.ics`);

    if (!fs.existsSync(filePath)) {
      return res.status(404).send("Calendar file not found");
    }

    res.setHeader("Content-Type", "text/calendar");
    res.setHeader("Content-Disposition", `attachment; filename=appointment-${appointmentId}.ics`);
    
    fs.createReadStream(filePath).pipe(res);
  } catch (error) {
    console.error("Error downloading calendar:", error);
    res.status(500).send("Internal server error");
  }
};

// POST /api/appointments/:id/reschedule
 const rescheduleAppointment = async (req, res) => {
  const { id } = req.params;
  const { newDate, newTime } = req.body;
  const userId = req.userId;

  const appointment = await appointmentModel.findById(id);
  if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

  // Check if slot is available (reuse your slot check function)
  const isAvailable = await checkRealTimeAvailability(newDate, newTime, appointment.totalDuration, appointment.providerId);
  if (!isAvailable.available) {
    return res.status(409).json({ message: 'Time slot not available', suggestedSlots: isAvailable.suggestedSlots });
  }

  // Save reschedule history
  appointment.rescheduleHistory.push({
    oldDate: appointment.date,
    oldTime: appointment.time,
    newDate,
    newTime,
    rescheduledBy: 'client' // or provider/admin
  });

  // Update appointment
  appointment.date = new Date(newDate);
  appointment.time = newTime;
  appointment.status = 'confirmed'; // reset if needed
  await appointment.save();

  res.json({ message: 'Appointment rescheduled successfully', appointment });
};

const getSingleAppointment = async (req, res) => {

}

export {
  getAvailableSlots,
  bookAppointment,
  verifyAppointmentPayment,
  cancelAppointment,
  updateAppointmentNotes,
  getUserAppointments,
  completeAppointment,
  downloadCalendar,
  rescheduleAppointment,
  handleStripeRedirect,
  bookMultipleAppointment,
  getSingleAppointment
};