// import appointmentModel from "../models/appointment.js";
// import createCalendarEvent from "../utils/calendarGenerator.js";
// import path from "path"; // Add this import
// import fs from "fs";
// import { fileURLToPath } from "url";
// // import sendAppointmentNotification from "../utils/emailSender.js";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const bookAppointment = async (req, res) => {
//   try {
//     const { serviceId, serviceTitle, date, time, userId } = req.body;


//     // Check if slot is already booked
//     const existingAppointment = await appointmentModel.findOne({
//       date: new Date(date),
//       time,
//       isCompleted: false
//     });

//     if (existingAppointment) {
//       return res.status(409).json({ 
//         message: "This slot is already booked. Please select another time." 
//       });
//     }

//     // Save the appointment to the database
//     const newAppointment = new appointmentModel({
//       serviceId,
//       serviceTitle,
//       date,
//       time,
//       userId,
//     });
//     await newAppointment.save();

//     const icsFilePath = await createCalendarEvent(newAppointment);

//     // Send email notification
//     // sendAppointmentNotification(newAppointment);

//     res.status(201).json({
//       message: "Booking successful!",
//       appointment: newAppointment,
//       calendarLink: `/download-calendar/${newAppointment._id}`,
//     });
//   } catch (error) {
//     console.error("Error creating booking:", error);
//     res.status(500).json({ message: "Failed to create booking" });
//   }
// };


// // New function to get booked slots
// const getBookedSlots = async (req, res) => {
//   try {
//     const appointments = await appointmentModel.find(
//       { isCompleted: false }, // Only get active appointments
//       'date time' // Only select needed fields
//     );
    
//     // Format the appointments for the frontend
//     const bookedSlots = appointments.map(appointment => ({
//       date: appointment.date.toISOString().split('T')[0],
//       time: appointment.time,
//       serviceId: appointment.serviceId
//     }));

//     res.status(200).json(bookedSlots);
//   } catch (error) {
//     console.error("Error fetching booked slots:", error);
//     res.status(500).json({ message: "Failed to fetch booked slots" });
//   }
// };





// const downloadCalendar = async (req, res) => {
//   try {
//     const { appointmentId } = req.params;
//     const filePath = path.join(
//       __dirname,
//       "..",
//       "calendar",
//       `event-${appointmentId}.ics`
//     );

//     if (!fs.existsSync(filePath)) {
//       return res.status(404).send("File not found");
//     }

//     res.setHeader("Content-Type", "text/calendar");

//     res.setHeader(
//       "Content-Disposition",
//       `attachment; filename=event-${appointmentId}.ics`
//     );

//     fs.createReadStream(filePath).pipe(res);
//   } catch (error) {
//     console.error("Error downloading calendar:", error);

//     res.status(500).send("Internal server error");
//   }
// };


// // New function to cancel appointment
// const cancelAppointment = async (req, res) => {
//   try {
//     const { appointmentId } = req.body;

//     console.log("Cancelling appointment with ID", appointmentId)

//     const appointment = await appointmentModel.findByIdAndUpdate(appointmentId, {isCancelled: true, cancelledAt: new Date()}, {new: true}
//     );

//     if (!appointment) {
//       return res.status(404).json({ message: "Appointment not found" });
//     }

//     res.status(200).json({ 
//       success: true,
//       message: "Appointment cancelled successfully",
//       appointment 
//     });
//   } catch (error) {
//     console.error("Error cancelling appointment:", error);
//     res.status(500).json({ message: "Failed to cancel appointment" });
//   }
// };


// export { bookAppointment, downloadCalendar, getBookedSlots, cancelAppointment };




// import { appointmentModel, businessHoursModel } from "../models/appointment.js";
import createCalendarEvent from "../utils/calendarGenerator.js";
import { initializePayment, verifyPayment } from "../utils/paymentService.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import appointmentModel from "../models/appointment.js";
import serviceModel from "../models/serviceModel.js";
import userModel from "../models/userModel.js";
import businessHoursModel from "../models/businessModel.js";
import Stripe from 'stripe';
import { getBusinessHours } from "./businessController.js";
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




// const getAvailableSlots = async (req, res) => {
//   try {
//     const { serviceId, startDate, endDate, duration } = req.query;
    
//     // Use provided duration or default to 90 minutes
//     const appointmentDuration = parseInt(duration) || 90;
    
//     // Your existing slot generation logic here...
//       const businessHours = await businessHoursModel.find().sort({ dayOfWeek: 1 });
    
//     if (!businessHours.length) {
//       return res.status(404).json({ message: "Business hours not configured" });
//     }
//     // But now consider the total duration when checking availability
    
//     const start = new Date(startDate);
//     const end = new Date(endDate);
//     const availableSlots = [];
    
//     // Generate time slots (9 AM to 6 PM, 30-minute intervals)
//     const timeSlots = [];
//     for (let hour = 9; hour < 18; hour++) {
//       for (let minute = 0; minute < 60; minute += 30) {
//         const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
//         timeSlots.push(timeString);
//       }
//     }
    
//     // Check each day in the range
//     for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
//       const daySlots = [];
//       const dayOfWeek = d.toLocaleDateString('en-US', { weekday: 'long' });
      
//       // Check each time slot
//       for (const timeSlot of timeSlots) {
//         // Check if this slot can accommodate the full duration
//         const slotStart = new Date(d);
//         const [hours, minutes] = timeSlot.split(':').map(Number);
//         slotStart.setHours(hours, minutes, 0, 0);
        
//         const slotEnd = new Date(slotStart.getTime() + appointmentDuration * 60000);
        
//         // Don't allow slots that go past 6 PM
//         if (slotEnd.getHours() >= 18) {
//           continue;
//         }
        
//         // Check for conflicts with existing appointments
//         const conflictingAppointment = await appointmentModel.findOne({
//           date: {
//             $gte: new Date(d.getFullYear(), d.getMonth(), d.getDate()),
//             $lt: new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1)
//           },
//           status: { $in: ['pending', 'confirmed'] },
//           $or: [
//             // New appointment starts during existing appointment
//             {
//               $and: [
//                 { time: { $lte: timeSlot } },
//                 { $expr: {
//                   $gte: [
//                     { $dateAdd: {
//                       startDate: {
//                         $dateFromParts: {
//                           year: { $year: "$date" },
//                           month: { $month: "$date" },
//                           day: { $dayOfMonth: "$date" },
//                           hour: { $toInt: { $substr: ["$time", 0, 2] } },
//                           minute: { $toInt: { $substr: ["$time", 3, 2] } }
//                         }
//                       },
//                       unit: "minute",
//                       amount: { $ifNull: ["$totalDuration", { $toInt: "$duration" }] }
//                     }},
//                     slotStart
//                   ]
//                 }}
//               ]
//             },
//             // Existing appointment starts during new appointment
//             {
//               $and: [
//                 { time: { $gte: timeSlot } },
//                 { time: { $lt: slotEnd.toTimeString().slice(0, 5) } }
//               ]
//             }
//           ]
//         });
        
//         if (!conflictingAppointment) {
//           daySlots.push({
//             time: timeSlot,
//             available: true
//           });
//         }
//       }
      
//       if (daySlots.length > 0) {
//         availableSlots.push({
//           date: d.toISOString().split('T')[0],
//           dayOfWeek,
//           slots: daySlots
//         });
//       }
//     }
    
//     res.status(200).json({
//       availableSlots,
//       appointmentDuration,
//       message: `Available slots for ${appointmentDuration} minute appointment`
//     });
    
//   } catch (error) {
//     console.error("Error fetching available slots:", error);
//     res.status(500).json({ message: "Failed to fetch available slots" });
//   }
// };








// // // Get business hours and available slots

// Working One

// const getAvailableSlots = async (req, res) => {
//   try {
//     const { serviceId, startDate, endDate } = req.query;
    
//     // Get business hours
//     const businessHours = await businessHoursModel.find().sort({ dayOfWeek: 1 });
    
//     if (!businessHours.length) {
//       return res.status(404).json({ message: "Business hours not configured" });
//     }
    
//     const start = new Date(startDate || new Date());
//     const end = new Date(endDate || new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)); // 10 days ahead
    
//     const availableSlots = [];
    
//     for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
//       const dayOfWeek = d.getDay();
//       const businessDay = businessHours.find(bh => bh.dayOfWeek === dayOfWeek);
      
//       if (!businessDay || !businessDay.isOpen) continue;
      
//       const dateStr = d.toISOString().split('T')[0];
      
//       // Get existing appointments for this date
//       const existingAppointments = await appointmentModel.find({
//         date: new Date(dateStr),
//         status: { $in: ['pending', 'confirmed'] }
//       }).select('time duration');
      
//       const slots = generateTimeSlots(businessDay, existingAppointments, new Date(d));
      
//       if (slots.length > 0) {
//         availableSlots.push({
//           date: dateStr,
//           dayOfWeek: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dayOfWeek],
//           slots
//         });
//       }
//     }
    
//     res.status(200).json({ availableSlots });
//   } catch (error) {
//     console.error("Error fetching available slots:", error);
//     res.status(500).json({ message: "Failed to fetch available slots" });
//   }
// };

// // Helper function to generate time slots
// const generateTimeSlots = (businessDay, existingAppointments, date) => {
//   const slots = [];
//   const now = new Date();
//   const isToday = date.toDateString() === now.toDateString();
  
//   const [openHour, openMinute] = businessDay.openTime.split(':').map(Number);
//   const [closeHour, closeMinute] = businessDay.closeTime.split(':').map(Number);
  
//   let currentTime = new Date(date);
//   currentTime.setHours(openHour, openMinute, 0, 0);
  
//   const endTime = new Date(date);
//   endTime.setHours(closeHour, closeMinute, 0, 0);
  
//   // If it's today, start from current time + buffer
//   if (isToday && now > currentTime) {
//     currentTime = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours buffer
//     currentTime.setMinutes(Math.ceil(currentTime.getMinutes() / 30) * 30); // Round to nearest 30 min
//   }
  
//   while (currentTime < endTime) {
//     const timeStr = currentTime.toTimeString().slice(0, 5);
    
//     // Check if slot conflicts with existing appointments
//     const hasConflict = existingAppointments.some(apt => {
//       const aptStart = new Date(date);
//       const [aptHour, aptMinute] = apt.time.split(':').map(Number);
//       aptStart.setHours(aptHour, aptMinute);
//       const aptEnd = new Date(aptStart.getTime() + apt.duration * 60000);
      
//       const slotEnd = new Date(currentTime.getTime() + businessDay.slotDuration * 60000);
      
//       return (currentTime < aptEnd && slotEnd > aptStart);
//     });
    
//     // Check if slot conflicts with break time
//     let inBreak = false;
//     if (businessDay.breakStart && businessDay.breakEnd) {
//       const [breakStartHour, breakStartMinute] = businessDay.breakStart.split(':').map(Number);
//       const [breakEndHour, breakEndMinute] = businessDay.breakEnd.split(':').map(Number);
      
//       const breakStart = new Date(date);
//       breakStart.setHours(breakStartHour, breakStartMinute);
//       const breakEnd = new Date(date);
//       breakEnd.setHours(breakEndHour, breakEndMinute);
      
//       inBreak = currentTime < breakEnd && currentTime >= breakStart;
//     }
    
//     if (!hasConflict && !inBreak) {
//       slots.push({
//         time: timeStr,
//         available: true
//       });
//     }
    
//     currentTime.setMinutes(currentTime.getMinutes() + businessDay.slotDuration);
//   }
  
//   return slots;
// };




// LATEST WORKING CODE
// const getAvailableSlots = async (req, res) => {
//   try {
//     const { serviceId, startDate, endDate, selectedServices } = req.query;
    
//     // Parse selectedServices if provided (for multiple service bookings)
//     let servicesToBook = [];
//     if (selectedServices) {
//       try {
//         servicesToBook = JSON.parse(selectedServices);
//       } catch (e) {
//         console.error('Error parsing selectedServices:', e);
//       }
//     }
    
//     // Calculate total duration needed for the services
//     const totalServiceDuration = servicesToBook.length > 0 
//       ? servicesToBook.reduce((total, service) => total + (service.duration || 90), 0)
//       : 90; // Default duration if no services specified
    
//     // Get business hours with caching
//     const businessHours = await getBusinessHours();
    
//     if (!businessHours.length) {
//       return res.status(404).json({ message: "Business hours not configured" });
//     }
    
//     const start = new Date(startDate || new Date());
//     const end = new Date(endDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)); // 14 days ahead
    
//     const availableSlots = [];
//     const now = new Date(); // Get current time once for consistency
    
//     // Process each day in the date range
//     for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
//       const dayOfWeek = d.getDay();
//       const businessDay = businessHours.find(bh => bh.dayOfWeek === dayOfWeek);
      
//       // Skip if business is closed on this day
//       if (!businessDay || !businessDay.isOpen) continue;
      
//       const dateStr = d.toISOString().split('T')[0];
      
//       // Get existing appointments for this date
//       const existingAppointments = await appointmentModel.find({
//         date: new Date(dateStr),
//         status: { $in: ['pending', 'confirmed'] }
//       }).select('time duration totalDuration services');
      
//       const slots = generateTimeSlots(businessDay, existingAppointments, new Date(d), now, totalServiceDuration);
      
//       if (slots.length > 0) {
//         availableSlots.push({
//           date: dateStr,
//           dayOfWeek: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dayOfWeek],
//           slots
//         });
//       }
//     }
    
//     res.status(200).json({ availableSlots });
//   } catch (error) {
//     console.error("Error fetching available slots:", error);
//     res.status(500).json({ message: "Failed to fetch available slots" });
//   }
// };

// // Optimized helper function to generate time slots
// const generateTimeSlots = (businessDay, existingAppointments, date, currentDateTime, requiredDuration = 90) => {
//   const slots = [];
//   const isToday = date.toDateString() === currentDateTime.toDateString();
  
//   // Parse business hours
//   const [openHour, openMinute] = businessDay.openTime.split(':').map(Number);
//   const [closeHour, closeMinute] = businessDay.closeTime.split(':').map(Number);
  
//   // Set up time boundaries
//   let currentTime = new Date(date);
//   currentTime.setHours(openHour, openMinute, 0, 0);
  
//   const endTime = new Date(date);
//   endTime.setHours(closeHour, closeMinute, 0, 0);
  
//   // For today, ensure we only show future slots with proper buffer
//   if (isToday) {
//     const now = new Date(currentDateTime);
//     const minTime = new Date(now.getTime() + 30 * 60 * 1000); // 30 minutes buffer from current time
    
//     // If minimum time is after business opening, start from minimum time
//     if (minTime > currentTime) {
//       currentTime = new Date(minTime);
//     }
    
//     // Round up to next slot interval
//     const slotDuration = businessDay.slotDuration || 90;
//     const currentMinutes = currentTime.getMinutes();
//     const minutesToAdd = slotDuration - (currentMinutes % slotDuration);
    
//     if (minutesToAdd !== slotDuration && minutesToAdd > 0) {
//       currentTime.setMinutes(currentMinutes + minutesToAdd);
//       currentTime.setSeconds(0);
//       currentTime.setMilliseconds(0);
//     }
//   }
  
//   // Pre-process existing appointments for faster conflict checking
//   const appointmentTimes = existingAppointments.map(apt => {
//     const [aptHour, aptMinute] = apt.time.split(':').map(Number);
//     const aptStart = new Date(date);
//     aptStart.setHours(aptHour, aptMinute, 0, 0);
    
//     // Calculate duration - handle both old and new schema
//     let aptDuration;
//     if (apt.totalDuration) {
//       aptDuration = apt.totalDuration; // New schema with multiple services
//     } else if (apt.services && apt.services.length > 0) {
//       // Calculate total duration from services array
//       aptDuration = apt.services.reduce((total, service) => total + (service.duration || 90), 0);
//     } else {
//       // Fallback to old duration field
//       aptDuration = parseInt(apt.duration) || 90;
//     }
    
//     const aptEnd = new Date(aptStart.getTime() + aptDuration * 60000);
//     return { start: aptStart, end: aptEnd };
//   });
  
//   // Pre-process break time if exists
//   let breakStart = null;
//   let breakEnd = null;
//   if (businessDay.breakStart && businessDay.breakEnd) {
//     const [breakStartHour, breakStartMinute] = businessDay.breakStart.split(':').map(Number);
//     const [breakEndHour, breakEndMinute] = businessDay.breakEnd.split(':').map(Number);
    
//     breakStart = new Date(date);
//     breakStart.setHours(breakStartHour, breakStartMinute, 0, 0);
//     breakEnd = new Date(date);
//     breakEnd.setHours(breakEndHour, breakEndMinute, 0, 0);
//   }
  
//   const slotDuration = businessDay.slotDuration || 90;
  
//   // Generate time slots
//   while (currentTime < endTime) {
//     // Use the required duration for this specific booking
//     const slotEnd = new Date(currentTime.getTime() + requiredDuration * 60000);
    
//     // Skip if slot would extend past closing time
//     if (slotEnd > endTime) break;
    
//     // CRITICAL FIX: For today, skip any slots that have already passed
//     if (isToday) {
//       const bufferTime = new Date(currentDateTime.getTime() + 30 * 60 * 1000);
      
//       // If this slot starts before the buffer time, skip it
//       if (currentTime < bufferTime) {
//         currentTime.setMinutes(currentTime.getMinutes() + slotDuration);
//         continue;
//       }
//     }
    
//     // Check for appointment conflicts
//     const hasConflict = appointmentTimes.some(apt => 
//       currentTime < apt.end && slotEnd > apt.start
//     );
    
//     // Check for break time conflicts
//     const inBreak = breakStart && breakEnd && 
//       currentTime < breakEnd && slotEnd > breakStart;
    
//     if (!hasConflict && !inBreak) {
//       const timeStr = currentTime.toTimeString().slice(0, 5);
//       slots.push({
//         time: timeStr,
//         available: true,
//         duration: requiredDuration
//       });
//     }
    
//     // Move to next slot (use business slot duration for intervals)
//     currentTime.setMinutes(currentTime.getMinutes() + slotDuration);
//   }
  
//   return slots;
// };









// // / New Multiple Service Appointment Controller Function
// // ============================================================================

// const bookMultipleAppointment = async (req, res) => {
//   try {
//     const { services, date, time, totalAmount } = req.body;
//     const userId = req.userId;

//     // Validation
//     if (!services || !Array.isArray(services) || services.length === 0) {
//       return res.status(400).json({ message: "At least one service is required" });
//     }

//     if (!time || !date) {
//       return res.status(400).json({ message: "Date and time are required" });
//     }

//     // Get user data
//     const userData = await userModel.findById(userId);
//     if (!userData) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Check if the time slot is available for the total duration
//     const appointmentDate = new Date(date);
//     const existingAppointment = await appointmentModel.findOne({
//       date: appointmentDate,
//       time,
//       status: { $in: ['pending', 'confirmed'] }
//     });

//     if (existingAppointment) {
//       return res.status(409).json({ 
//         message: "This slot is no longer available. Please select another time." 
//       });
//     }

//     // Validate services and calculate totals
//     let calculatedAmount = 0;
//     let calculatedDuration = 0;
//     const processedServices = services.map((service, index) => {
//       calculatedAmount += service.price;
//       calculatedDuration += service.duration;
//       return {
//         serviceId: service.serviceId,
//         serviceTitle: service.serviceTitle,
//         duration: service.duration,
//         price: service.price,
//         order: index + 1
//       };
//     });

//     // Use calculated amount if totalAmount is not provided or invalid
//     const finalAmount = totalAmount && totalAmount > 0 ? totalAmount : calculatedAmount;

//     // Security check: verify amounts match (with small tolerance for rounding)
//     if (Math.abs(finalAmount - calculatedAmount) > 0.01) {
//       return res.status(400).json({ 
//         message: "Price calculation mismatch. Please refresh and try again." 
//       });
//     }

//     // Create appointment with multiple services
//     const newAppointment = await appointmentModel.create({
//       userId,
//       services: processedServices,
      
//       // For backward compatibility, set primary service (first one)
//       serviceId: processedServices[0].serviceId,
//       serviceTitle: processedServices.length > 1 
//         ? `${processedServices[0].serviceTitle} + ${processedServices.length - 1} more`
//         : processedServices[0].serviceTitle,
      
//       userName: userData.name,
//       userEmail: userData.email,
//       userPhone: userData.phone,
//       date: appointmentDate,
//       time,
//       totalDuration: calculatedDuration, // Add this field
//       status: 'pending',
//       payment: {
//         amount: finalAmount, // Ensure this is always set
//         currency: 'CAD', // 
//         status: 'pending'
//       }
//     });

//     // Create Stripe checkout session
//     const lineItems = processedServices.map(service => ({
//       price_data: {
//         currency: 'cad', // Change to ngn for Nigerian Naira
//         product_data: {
//           name: service.serviceTitle,
//           description: `Duration: ${service.duration} minutes`
//         },
//         unit_amount: Math.round(service.price * 100), // Stripe expects kobo for NGN
//       },
//       quantity: 1
//     }));

//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ['card'],
//       line_items: lineItems,
//       mode: 'payment',
//       customer_email: userData.email,
//       success_url: `${process.env.FRONTEND_URL}/appointment/verify/${newAppointment._id}?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `${process.env.FRONTEND_URL}/appointment/cancelled`,
//       metadata: {
//         appointmentId: newAppointment._id.toString(),
//         isMultipleService: 'true',
//         serviceCount: processedServices.length.toString()
//       }
//     });

//     res.status(201).json({
//       message: "Appointment created successfully. Please complete payment.",
//       appointment: newAppointment,
//       paymentUrl: session.url
//     });

//   } catch (error) {
//     console.error("Error booking multiple appointment:", error);
//     res.status(500).json({ 
//       message: error.message || "Failed to book appointment" 
//     });
//   }
// };

// Enhanced getAvailableSlots with duration validation
// const getAvailableSlots = async (req, res) => {
//   try {
//     const { serviceId, startDate, endDate, selectedServices } = req.query;
    
//     console.log('Received query params:', { serviceId, startDate, endDate, selectedServices });
    
//     // Parse selectedServices if provided
//     let servicesToBook = [];
//     if (selectedServices) {
//       try {
//         servicesToBook = JSON.parse(selectedServices);
//         console.log('Parsed services:', servicesToBook);
//       } catch (e) {
//         console.error('Error parsing selectedServices:', e);
//         return res.status(400).json({ message: "Invalid selectedServices format" });
//       }
//     }
    
//     // Calculate total duration needed for the services
//     const totalServiceDuration = servicesToBook.length > 0 
//       ? servicesToBook.reduce((total, service) => total + (parseInt(service.duration) || 90), 0)
//       : 90;
    
//     console.log('Total service duration calculated:', totalServiceDuration);
    
//     // VALIDATION: Check if duration is reasonable
//     const MAX_SINGLE_DAY_DURATION = 600; // 10 hours in minutes
//     if (totalServiceDuration > MAX_SINGLE_DAY_DURATION) {
//       return res.status(400).json({ 
//         message: `Service duration (${totalServiceDuration} minutes) exceeds maximum allowed duration of ${MAX_SINGLE_DAY_DURATION} minutes (10 hours). Please book multiple appointments or contact us directly.`,
//         code: 'DURATION_TOO_LONG'
//       });
//     }
    
//     // Get business hours with caching
//     const businessHours = await getBusinessHours();
    
//     if (!businessHours.length) {
//       return res.status(404).json({ message: "Business hours not configured" });
//     }
    
//     const start = new Date(startDate || new Date());
//     const end = new Date(endDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000));
    
//     const availableSlots = [];
//     const now = new Date();
    
//     // Proper date loop
//     for (let d = new Date(start); d <= end; d = new Date(d.getTime() + 24 * 60 * 60 * 1000)) {
//       const dayOfWeek = d.getDay();
//       const businessDay = businessHours.find(bh => bh.dayOfWeek === dayOfWeek);
      
//       // Skip if business is closed on this day
//       if (!businessDay || !businessDay.isOpen) continue;
      
//       // Check if the business day is long enough for the service
//       const businessDayDuration = calculateBusinessDayDuration(businessDay);
//       if (businessDayDuration < totalServiceDuration) {
//         console.log(`Skipping ${d.toISOString().split('T')[0]} - business day too short (${businessDayDuration} min) for service (${totalServiceDuration} min)`);
//         continue;
//       }
      
//       const dateStr = d.toISOString().split('T')[0];
      
//       // Get existing appointments for this date
//       const existingAppointments = await appointmentModel.find({
//         date: new Date(dateStr),
//         status: { $in: ['pending', 'confirmed'] }
//       }).select('time duration totalDuration services');
      
//       console.log(`Existing appointments for ${dateStr}:`, existingAppointments);
      
//       const slots = generateTimeSlots(businessDay, existingAppointments, new Date(d), now, totalServiceDuration);
      
//       console.log(`Generated ${slots.length} slots for ${dateStr}`);
      
//       // Only include dates that have available slots
//       if (slots.length > 0) {
//         availableSlots.push({
//           date: dateStr,
//           dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek],
//           slots,
//           businessDayDuration // Include this for frontend reference
//         });
//       }
//     }
    
//     console.log('Final available slots:', availableSlots.length);
    
//     // If no slots available due to duration, provide helpful message
//     if (availableSlots.length === 0 && totalServiceDuration > 300) { // 5+ hours
//       return res.status(200).json({ 
//         availableSlots: [],
//         message: `No available time slots found for services requiring ${totalServiceDuration} minutes. Consider booking multiple shorter appointments or contact us directly.`,
//         suggestedAction: 'SPLIT_APPOINTMENT'
//       });
//     }
    
//     res.status(200).json({ availableSlots });
//   } catch (error) {
//     console.error("Error fetching available slots:", error);
//     res.status(500).json({ message: "Failed to fetch available slots" });
//   }
// };

// // Helper function to calculate business day duration
// const calculateBusinessDayDuration = (businessDay) => {
//   const [openHour, openMinute] = businessDay.openTime.split(':').map(Number);
//   const [closeHour, closeMinute] = businessDay.closeTime.split(':').map(Number);
  
//   const openTime = openHour * 60 + openMinute;
//   const closeTime = closeHour * 60 + closeMinute;
//   let totalDuration = closeTime - openTime;
  
//   // Subtract break time if exists
//   if (businessDay.breakStart && businessDay.breakEnd) {
//     const [breakStartHour, breakStartMinute] = businessDay.breakStart.split(':').map(Number);
//     const [breakEndHour, breakEndMinute] = businessDay.breakEnd.split(':').map(Number);
    
//     const breakStart = breakStartHour * 60 + breakStartMinute;
//     const breakEnd = breakEndHour * 60 + breakEndMinute;
//     const breakDuration = breakEnd - breakStart;
    
//     totalDuration -= breakDuration;
//   }
  
//   return totalDuration;
// };

// // Enhanced slot generation with better validation
// const generateTimeSlots = (businessDay, existingAppointments, date, currentDateTime, requiredDuration = 90) => {
//   const slots = [];
//   const isToday = date.toDateString() === currentDateTime.toDateString();
  
//   // Parse business hours
//   const [openHour, openMinute] = businessDay.openTime.split(':').map(Number);
//   const [closeHour, closeMinute] = businessDay.closeTime.split(':').map(Number);
  
//   // Set up time boundaries
//   const businessStart = new Date(date);
//   businessStart.setHours(openHour, openMinute, 0, 0);
  
//   const businessEnd = new Date(date);
//   businessEnd.setHours(closeHour, closeMinute, 0, 0);
  
//   // Calculate actual available duration (considering breaks)
//   const businessDayDuration = calculateBusinessDayDuration(businessDay);
  
//   // Early return if service is too long for this business day
//   if (requiredDuration > businessDayDuration) {
//     console.log(`Service duration (${requiredDuration} min) exceeds business day duration (${businessDayDuration} min)`);
//     return slots;
//   }
  
//   // For today, calculate minimum start time (current time + 30 min buffer)
//   let earliestStartTime = new Date(businessStart);
//   if (isToday) {
//     const minTime = new Date(currentDateTime.getTime() + 30 * 60 * 1000);
//     if (minTime > businessStart) {
//       earliestStartTime = new Date(minTime);
//     }
//   }
  
//   // Create comprehensive blocked time periods
//   const blockedPeriods = [];
  
//   // Add existing appointments as blocked periods
//   existingAppointments.forEach(apt => {
//     const [aptHour, aptMinute] = apt.time.split(':').map(Number);
//     const aptStart = new Date(date);
//     aptStart.setHours(aptHour, aptMinute, 0, 0);
    
//     // Calculate appointment duration properly
//     let aptDuration;
//     if (apt.totalDuration && apt.totalDuration > 0) {
//       aptDuration = apt.totalDuration;
//     } else if (apt.services && apt.services.length > 0) {
//       aptDuration = apt.services.reduce((total, service) => total + (service.duration || 90), 0);
//     } else if (apt.duration) {
//       aptDuration = parseInt(apt.duration) || 90;
//     } else {
//       aptDuration = 90;
//     }
    
//     const aptEnd = new Date(aptStart.getTime() + aptDuration * 60000);
//     blockedPeriods.push({ start: aptStart, end: aptEnd });
//   });
  
//   // Add break times as blocked periods
//   if (businessDay.breakStart && businessDay.breakEnd) {
//     const [breakStartHour, breakStartMinute] = businessDay.breakStart.split(':').map(Number);
//     const [breakEndHour, breakEndMinute] = businessDay.breakEnd.split(':').map(Number);
    
//     const breakStart = new Date(date);
//     breakStart.setHours(breakStartHour, breakStartMinute, 0, 0);
//     const breakEnd = new Date(date);
//     breakEnd.setHours(breakEndHour, breakEndMinute, 0, 0);
    
//     blockedPeriods.push({ start: breakStart, end: breakEnd });
//   }
  
//   // Use appropriate slot intervals - for long services, use larger intervals
//   let slotInterval = businessDay.slotDuration || 30;
//   if (requiredDuration >= 300) { // 5+ hours
//     slotInterval = Math.max(slotInterval, 60); // Use at least 1-hour intervals
//   }
  
//   // Generate potential time slots
//   let currentSlotTime = new Date(earliestStartTime);
  
//   // Round up to next slot interval
//   const currentMinutes = currentSlotTime.getMinutes();
//   const remainder = currentMinutes % slotInterval;
//   if (remainder !== 0) {
//     currentSlotTime.setMinutes(currentMinutes + (slotInterval - remainder));
//   }
//   currentSlotTime.setSeconds(0);
//   currentSlotTime.setMilliseconds(0);
  
//   // Generate slots until business closes
//   while (currentSlotTime < businessEnd) {
//     const slotEnd = new Date(currentSlotTime.getTime() + requiredDuration * 60000);
    
//     // Skip if slot would extend past closing time
//     if (slotEnd > businessEnd) {
//       currentSlotTime = new Date(currentSlotTime.getTime() + slotInterval * 60000);
//       continue;
//     }
    
//     // Check for conflicts with blocked periods
//     const hasConflict = blockedPeriods.some(blocked => {
//       return currentSlotTime < blocked.end && slotEnd > blocked.start;
//     });
    
//     // Only add slot if there's no conflict
//     if (!hasConflict) {
//       const timeStr = currentSlotTime.toTimeString().slice(0, 5);
//       slots.push({
//         time: timeStr,
//         available: true,
//         duration: requiredDuration,
//         endTime: slotEnd.toTimeString().slice(0, 5) // Add end time for reference
//       });
//     }
    
//     // Move to next slot interval
//     currentSlotTime = new Date(currentSlotTime.getTime() + slotInterval * 60000);
//   }
  
//   return slots;
// };


// Get available time slots

const BUFFER_MINUTES = 15; // Buffer between appointments
const MAX_SERVICE_DURATION_PER_DAY = 8 * 60; // 8 hours in minutes
const SLOT_INTERVAL = 30; // 30 minutes slot interval

const getAvailableSlots = async (req, res) => {
  try {
    const { serviceId, startDate, endDate, selectedServices } = req.query;
    
    // Parse selectedServices if provided
    let servicesToBook = [];
    if (selectedServices) {
      try {
        servicesToBook = JSON.parse(selectedServices);
      } catch (e) {
        return res.status(400).json({ message: "Invalid selectedServices format" });
      }
    }
    
    // Calculate total duration needed
    const totalServiceDuration = servicesToBook.length > 0 
      ? servicesToBook.reduce((total, service) => total + (parseInt(service.duration) || 90), 0)
      : 90;
    
    // Get business hours
    const businessHours = await getBusinessHours();
    if (!businessHours.length) {
      return res.status(404).json({ message: "Business hours not configured" });
    }
    
    // Set date range
    const start = new Date(startDate || new Date());
    const end = new Date(endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));
    
    // Check for multi-day services
    const isLongDuration = totalServiceDuration > 480;
    const isMultiDay = totalServiceDuration > MAX_SERVICE_DURATION_PER_DAY;
    
    if (isMultiDay) {
      return await handleMultiDayService(req, res, servicesToBook, totalServiceDuration, start, end, businessHours);
    }
    
    // Generate available slots
    const availableSlots = await generateAvailableSlots(
      start, 
      end, 
      businessHours, 
      totalServiceDuration, 
      isLongDuration
    );
    
    res.status(200).json({ 
      availableSlots,
      timestamp: new Date().toISOString() // Add timestamp for cache control
    });
  } catch (error) {
    console.error("Error fetching available slots:", error);
    res.status(500).json({ message: "Failed to fetch available slots" });
  }
};

// Generate available slots for date range
const generateAvailableSlots = async (start, end, businessHours, totalDuration, isLongDuration) => {
  const availableSlots = [];
  const now = new Date();
  
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dayOfWeek = d.getDay();
    const businessDay = businessHours.find(bh => bh.dayOfWeek === dayOfWeek);
    
    if (!businessDay || !businessDay.isOpen) continue;
    
    const dateStr = d.toISOString().split('T')[0];
    const existingAppointments = await getExistingAppointments(d, isLongDuration);
    
    const slots = generateTimeSlotsForDay(
      businessDay, 
      existingAppointments, 
      d, 
      now, 
      totalDuration,
      isLongDuration
    );
    
    if (slots.length > 0) {
      availableSlots.push({
        date: dateStr,
        dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek],
        slots,
        totalDuration,
        isLongDuration
      });
    }
  }
  
  return availableSlots;
};

// Get existing appointments with enhanced query
const getExistingAppointments = async (date, isLongDuration) => {
  const dateStr = date.toISOString().split('T')[0];
  const nextDay = new Date(date);
  nextDay.setDate(nextDay.getDate() + 1);
  const nextDayStr = nextDay.toISOString().split('T')[0];
  
  const query = {
    $or: [
      { date: dateStr, status: { $in: ['pending', 'confirmed'] } },
    ]
  };
  
  // For long duration, check previous day's appointments that might overlap
  if (isLongDuration) {
    const prevDay = new Date(date);
    prevDay.setDate(prevDay.getDate() - 1);
    const prevDayStr = prevDay.toISOString().split('T')[0];
    
    query.$or.push({
      date: prevDayStr,
      status: { $in: ['pending', 'confirmed'] },
      totalDuration: { $gt: 240 } // Only check long appointments from previous day
    });
  }
  
  return await appointmentModel.find(query)
    .select('time duration totalDuration services date');
};

// Generate time slots for a specific day
const generateTimeSlotsForDay = (businessDay, existingAppointments, date, currentTime, requiredDuration, isLongDuration) => {
  const slots = [];
  const isToday = date.toDateString() === currentTime.toDateString();
  
  // Parse business hours
  const [openHour, openMinute] = businessDay.openTime.split(':').map(Number);
  const [closeHour, closeMinute] = businessDay.closeTime.split(':').map(Number);
  
  // Set up time boundaries
  const businessStart = new Date(date);
  businessStart.setHours(openHour, openMinute, 0, 0);
  
  const businessEnd = new Date(date);
  businessEnd.setHours(closeHour, closeMinute, 0, 0);
  
  // For multi-day services, calculate how many days needed
  const dailyWorkHours = (closeHour - openHour) * 60; // minutes per day
  const isMultiDay = requiredDuration > dailyWorkHours;
  const daysNeeded = isMultiDay ? Math.ceil(requiredDuration / dailyWorkHours) : 1;
  
  // Create blocked periods
  const blockedPeriods = createBlockedPeriods(existingAppointments, date, businessStart);
  
  // Determine earliest start time
  let currentSlotTime = determineEarliestStartTime(businessStart, currentTime, isToday);
  
  // Generate slots with more flexible end time logic
  while (currentSlotTime < businessEnd) {
    const slotEnd = new Date(currentSlotTime.getTime() + Math.min(requiredDuration, dailyWorkHours) * 60000);
    
    // For long duration services, allow slots that extend beyond business hours
    const canExtendBeyondHours = requiredDuration > 240; // Services longer than 4 hours
    
    // Check if slot fits or can extend
    if (!canExtendBeyondHours && slotEnd > businessEnd) {
      currentSlotTime = new Date(currentSlotTime.getTime() + SLOT_INTERVAL * 60000);
      continue;
    }
    
    // Check for conflicts
    const bufferedStart = new Date(currentSlotTime.getTime() - BUFFER_MINUTES * 60000);
    const bufferedEnd = new Date(currentSlotTime.getTime() + BUFFER_MINUTES * 60000 + requiredDuration * 60000);
    
    if (!hasTimeConflict(bufferedStart, bufferedEnd, blockedPeriods)) {
      const timeStr = currentSlotTime.toTimeString().slice(0, 5);
      
      // Calculate actual end time
      let actualEndTime;
      let spansMultipleDays = false;
      
      if (isMultiDay) {
        spansMultipleDays = true;
        actualEndTime = 'Next Day';
      } else {
        actualEndTime = slotEnd.toTimeString().slice(0, 5);
      }
      
      slots.push({
        time: timeStr,
        available: true,
        duration: requiredDuration,
        isLongDuration: requiredDuration > 480,
        isMultiDay,
        daysNeeded,
        estimatedEndTime: actualEndTime,
        spansMultipleDays,
        canExtendBeyondHours
      });
    }
    
    currentSlotTime = new Date(currentSlotTime.getTime() + SLOT_INTERVAL * 60000);
  }
  
  return slots;
};

// Create blocked periods from existing appointments and breaks
const createBlockedPeriods = (appointments, date, businessStart, breakStart, breakEnd) => {
  const blockedPeriods = [];
  
  // Add appointments as blocked periods
  appointments.forEach(apt => {
    const [aptHour, aptMinute] = apt.time.split(':').map(Number);
    const aptStart = new Date(date);
    aptStart.setHours(aptHour, aptMinute, 0, 0);
    
    const aptDuration = apt.totalDuration || 
                       (apt.services?.reduce((sum, s) => sum + (s.duration || 0), 0)) || 
                       apt.duration || 
                       90;
    
    const aptEnd = new Date(aptStart.getTime() + aptDuration * 60000);
    
    // If appointment started previous day but extends into current day
    if (aptStart < businessStart && aptEnd > businessStart) {
      blockedPeriods.push({ start: businessStart, end: aptEnd });
    } else {
      blockedPeriods.push({ start: aptStart, end: aptEnd });
    }
  });
  
  // Add break time as blocked period
  if (breakStart && breakEnd) {
    blockedPeriods.push({ start: breakStart, end: breakEnd });
  }
  
  // Sort by start time
  blockedPeriods.sort((a, b) => a.start - b.start);
  
  return blockedPeriods;
};

// Determine earliest possible start time
const determineEarliestStartTime = (businessStart, currentTime, isToday) => {
  if (!isToday) return new Date(businessStart);
  
  // For today, don't allow slots that start within 30 minutes
  const minStartTime = new Date(currentTime.getTime() + 30 * 60 * 1000);
  return minStartTime > businessStart ? minStartTime : new Date(businessStart);
};

// Check for time conflicts
const hasTimeConflict = (start, end, blockedPeriods) => {
  return blockedPeriods.some(blocked => {
    return (
      (start >= blocked.start && start < blocked.end) ||
      (end > blocked.start && end <= blocked.end) ||
      (start <= blocked.start && end >= blocked.end)
    );
  });
};

// Handle multi-day services
const handleMultiDayService = async (req, res, services, totalDuration, start, end, businessHours) => {
  const availableSlots = [];
  const daysNeeded = Math.ceil(totalDuration / MAX_SERVICE_DURATION_PER_DAY);
  
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const consecutiveDays = [];
    let canSchedule = true;
    
    // Check consecutive days availability
    for (let i = 0; i < daysNeeded; i++) {
      const checkDate = new Date(d.getTime() + i * 24 * 60 * 60 * 1000);
      const dayOfWeek = checkDate.getDay();
      const businessDay = businessHours.find(bh => bh.dayOfWeek === dayOfWeek);
      
      if (!businessDay || !businessDay.isOpen) {
        canSchedule = false;
        break;
      }
      
      consecutiveDays.push({ date: checkDate, businessDay });
    }
    
    if (canSchedule) {
      // Check for conflicts across all days
      const hasConflicts = await checkMultiDayConflicts(consecutiveDays);
      
      if (!hasConflicts) {
        const dateStr = d.toISOString().split('T')[0];
        const dayOfWeek = d.getDay();
        const [openHour, openMinute] = consecutiveDays[0].businessDay.openTime.split(':').map(Number);
        const timeStr = `${openHour.toString().padStart(2, '0')}:${openMinute.toString().padStart(2, '0')}`;
        
        availableSlots.push({
          date: dateStr,
          dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek],
          slots: [{
            time: timeStr,
            available: true,
            duration: totalDuration,
            isMultiDay: true,
            daysSpanned: daysNeeded,
            endDate: consecutiveDays[daysNeeded - 1].date.toISOString().split('T')[0]
          }],
          totalDuration,
          isLongDuration: true,
          isMultiDay: true
        });
      }
    }
  }
  
  res.status(200).json({ availableSlots });
};

// Check for multi-day conflicts
const checkMultiDayConflicts = async (consecutiveDays) => {
  for (const dayInfo of consecutiveDays) {
    const dateStr = dayInfo.date.toISOString().split('T')[0];
    const existingAppointments = await appointmentModel.find({
      date: new Date(dateStr),
      status: { $in: ['pending', 'confirmed'] }
    });
    
    if (existingAppointments.length > 0) {
      return true;
    }
  }
  return false;
};

// Book appointment endpoint
const bookMultipleAppointment = async (req, res) => {
  try {
    const { services, date, time, totalAmount, clientNotes } = req.body;
    const userId = req.userId;

    // Validation
    if (!services || !Array.isArray(services) || services.length === 0) {
      return res.status(400).json({ message: "At least one service is required" });
    }

    // Get user data
    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    // Calculate total duration and amount
    const { calculatedDuration, calculatedAmount, processedServices } = calculateServiceTotals(services);

    // Create appointment date object
    const appointmentDate = new Date(date);
    const [hour, minute] = time.split(':').map(Number);
    appointmentDate.setHours(hour, minute, 0, 0);

    // Real-time availability check
    const availabilityCheck = await checkRealTimeAvailability(
      appointmentDate,
      time,
      calculatedDuration
    );

    if (!availabilityCheck.available) {
      return res.status(409).json({
        message: "This time slot is no longer available.",
        suggestedSlots: availabilityCheck.suggestedSlots
      });
    }

    // Enhanced validation for multi-day bookings
if (calculatedDuration > 480) { // 8+ hours
  const businessHours = await getBusinessHours();
  const appointmentDay = appointmentDate.getDay();
  const businessDay = businessHours.find(bh => bh.dayOfWeek === appointmentDay);
  
  if (!businessDay || !businessDay.isOpen) {
    return res.status(400).json({ 
      message: "Selected day is not available for business" 
    });
  }
  
  // Mark as multi-day service
  const isMultiDay = calculatedDuration > ((parseFloat(businessDay.closeTime) - parseFloat(businessDay.openTime)) * 60);
  
  if (isMultiDay) {
    console.log(`Multi-day booking: ${calculatedDuration} minutes across multiple days`);
  }
}

    // Create the appointment
    const newAppointment = await createAppointment(
      userId,
      userData,
      processedServices,
      appointmentDate,
      time,
      calculatedDuration,
      clientNotes,
      calculatedAmount
    );

    // Create Stripe checkout session
    const session = await createStripeSession(userData, processedServices, newAppointment);

    res.status(201).json({
      message: "Appointment created successfully. Please complete payment.",
      appointment: newAppointment,
      paymentUrl: session.url
    });

  } catch (error) {
    console.error("Error booking appointment:", error);
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

// Real-time availability check

const checkRealTimeAvailability = async (date, time, duration) => {
  const dateStr = date.toISOString().split('T')[0];
  
  // For multi-day services, check multiple days
  const isMultiDay = duration > 480;
  const daysToCheck = isMultiDay ? Math.ceil(duration / 480) : 1;
  
  for (let i = 0; i < daysToCheck; i++) {
    const checkDate = new Date(date);
    checkDate.setDate(checkDate.getDate() + i);
    const checkDateStr = checkDate.toISOString().split('T')[0];
    
    // Check for any existing appointments on this date
    const existingAppointments = await appointmentModel.find({
      date: checkDateStr,
      status: { $in: ['pending', 'confirmed'] }
    });
    
    // For first day, check time conflicts more carefully
    if (i === 0) {
      const [hour, minute] = time.split(':').map(Number);
      const start = new Date(checkDate);
      start.setHours(hour, minute, 0, 0);
      
      // Check for overlapping times
      const hasConflict = existingAppointments.some(apt => {
        const [aptHour, aptMinute] = apt.time.split(':').map(Number);
        const aptStart = new Date(checkDate);
        aptStart.setHours(aptHour, aptMinute, 0, 0);
        const aptEnd = new Date(aptStart.getTime() + (apt.totalDuration || 90) * 60000);
        
        const requestedEnd = new Date(start.getTime() + duration * 60000);
        
        return (
          (start >= aptStart && start < aptEnd) ||
          (requestedEnd > aptStart && requestedEnd <= aptEnd) ||
          (start <= aptStart && requestedEnd >= aptEnd)
        );
      });
      
      if (hasConflict) {
        const suggestedSlots = await findAlternativeSlots(date, time, duration);
        return { available: false, suggestedSlots };
      }
    } else {
      // For subsequent days, just check if any appointments exist
      if (existingAppointments.length > 0) {
        return { available: false, reason: `Day ${i + 1} of multi-day service is not available` };
      }
    }
  }
  
  return { available: true };
};

// Find alternative slots when requested slot is unavailable
const findAlternativeSlots = async (originalDate, originalTime, duration) => {
  const businessHours = await getBusinessHours();
  const startDate = new Date(originalDate);
  const endDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000); // Look 7 days ahead
  
  const [hour, minute] = originalTime.split(':').map(Number);
  const originalDateTime = new Date(startDate);
  originalDateTime.setHours(hour, minute, 0, 0);
  
  // Get all available slots in the next 7 days
  const allSlots = await generateAvailableSlots(
    startDate,
    endDate,
    businessHours,
    duration,
    duration > 480
  );
  
  // Sort by closest to original time
  const sortedSlots = allSlots
    .flatMap(day => day.slots.map(slot => ({
      date: day.date,
      time: slot.time,
      duration: slot.duration,
      distance: Math.abs(
        new Date(`${day.date}T${slot.time}`).getTime() - originalDateTime.getTime()
      )
    })))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 5); // Return top 5 closest alternatives
  
  return sortedSlots;
};

// Create appointment record
const createAppointment = async (
  userId,
  userData,
  services,
  date,
  time,
  duration,
  notes,
  amount
) => {
  const isLongDuration = duration > 480;
  
  return await appointmentModel.create({
    userId,
    services,
    serviceId: services[0].serviceId,
    serviceTitle: services.length > 1 
      ? `${services[0].serviceTitle} + ${services.length - 1} more`
      : services[0].serviceTitle,
    userName: userData.name,
    userEmail: userData.email,
    userPhone: userData.phone,
    date,
    time,
    clientNotes: notes,
    totalDuration: duration,
    isLongDuration,
    status: 'pending',
    payment: {
      amount,
      currency: 'CAD',
      status: 'pending'
    }
  });
};

// From here above

// Create Stripe checkout session
const createStripeSession = async (userData, services, appointment) => {
  const lineItems = services.map(service => ({
    price_data: {
      currency: 'cad',
      product_data: {
        name: service.serviceTitle,
        description: `Duration: ${service.duration} minutes`
      },
      unit_amount: Math.round(service.price * 100),
    },
    quantity: 1
  }));

  return await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    customer_email: userData.email,
    success_url: `${process.env.FRONTEND_URL}/appointment/verify/${appointment._id}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL}/appointment/cancelled`,
    metadata: {
      appointmentId: appointment._id.toString(),
      serviceCount: services.length.toString()
    }
  });
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




// BACKEND - Enhanced error handling and logging
// UPDATED VERIFY FUNCTION - Fixed the user field issue
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

const getSingleAppointment = async (req, res) => {
  try {
    
  } catch (error) {
    
  }
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
  getSingleAppointment,
  handleStripeRedirect,
  bookMultipleAppointment
};