import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import appointmentModel from "../models/appointment.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import providerModel from "../models/providerModel.js";
import dotenv from "dotenv";
import { sendBookingEmails } from "../services/emailService.js";
import { toZonedTime } from "date-fns-tz";
import { acquireBookingLock } from "../utils/bookinglock.js";
import { BUSINESS_TIMEZONE } from "../utils/dateUtils.js";
import {
  getCurrentBusinessDateTime,
  parseDateInBusinessTz,
  formatDateForDisplay,
  createBusinessDateTime,
  getBusinessDayOfWeek,
  addMinutesToDateTime,
  addDaysToDate,
  formatTimeFromDate,
  applyTimeToDate,
  getCurrentBusinessHour,
  getCurrentBusinessMinute,
  getDateRangeForQuery,
} from "../utils/dateUtils.js";
import mongoose from "mongoose";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BUFFER_MINUTES = 15; // Buffer time between appointments
















/**
 * Check if a specific date has any overrides
 * Returns the override object if found, null otherwise
 */
const getDateOverride = (provider, dateStr) => {
  if (!provider.dateOverrides || provider.dateOverrides.length === 0) {
    return null;
  }
  return provider.dateOverrides.find(override => override.date === dateStr);
};

/**
 * Check if a time slot is blocked by a date override
 */
const isTimeSlotBlocked = (dateOverride, time, duration) => {
  if (!dateOverride || !dateOverride.blockedTimeSlots) {
    return false;
  }

  const [requestHour, requestMin] = time.split(':').map(Number);
  const requestStartMinutes = requestHour * 60 + requestMin;
  const requestEndMinutes = requestStartMinutes + duration;

  // Check each blocked time slot
  for (const blockedSlot of dateOverride.blockedTimeSlots) {
    const [blockedStartHour, blockedStartMin] = blockedSlot.startTime.split(':').map(Number);
    const [blockedEndHour, blockedEndMin] = blockedSlot.endTime.split(':').map(Number);
    
    const blockedStartMinutes = blockedStartHour * 60 + blockedStartMin;
    const blockedEndMinutes = blockedEndHour * 60 + blockedEndMin;

    // Check for overlap
    const hasOverlap = !(requestEndMinutes <= blockedStartMinutes || 
                         requestStartMinutes >= blockedEndMinutes);
    
    if (hasOverlap) {
      return true;
    }
  }

  return false;
};

/**
 * Get effective working hours for a specific date
 * Takes into account both regular schedule and date overrides
 */
const getEffectiveWorkingHours = (provider, dateStr, dayOfWeek) => {
  // Check for date override first
  const dateOverride = getDateOverride(provider, dateStr);
  
  // If entire day is closed
  if (dateOverride && dateOverride.isClosed) {
    return null;
  }

  // If there are custom hours for this date
  if (dateOverride && dateOverride.customHours && 
      dateOverride.customHours.startTime && dateOverride.customHours.endTime) {
    return {
      startTime: dateOverride.customHours.startTime,
      endTime: dateOverride.customHours.endTime,
      isWorking: true
    };
  }

  // Fall back to regular weekly schedule
  const regularDay = provider.workingHours.find(
    wh => wh.dayOfWeek === dayOfWeek && wh.isWorking
  );

  return regularDay || null;
};














const checkRealTimeAvailability = async (date, time, duration, providerId) => {
  const dateObj = parseDateInBusinessTz(date);
  const provider = await providerModel.findById(providerId);

  if (!provider) {
    return { available: false, suggestedSlots: [] };
  }

  const dateStr = formatDateForDisplay(dateObj);
  
  // ✅ COMPREHENSIVE FIX: Check ALL possible date formats
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth();
  const day = dateObj.getDate();
  
  // Create multiple date variations to catch any format
  const localDateStart = new Date(year, month, day, 0, 0, 0, 0);
  const localDateEnd = new Date(year, month, day, 23, 59, 59, 999);
  const utcDateStart = new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
  const utcDateEnd = new Date(Date.UTC(year, month, day, 23, 59, 59, 999));
  
  const existingAppointments = await appointmentModel
    .find({
      providerId,
      $or: [
        { date: dateStr }, // String: "2025-12-02"
        { date: { $gte: localDateStart, $lte: localDateEnd } }, // Local Date object
        { date: { $gte: utcDateStart, $lte: utcDateEnd } }, // UTC Date object
        { date: { $regex: `^${dateStr}` } }, // String starting with date (catches ISO strings)
      ],
      status: { $in: ["pending", "confirmed", "paid"] },
    })
    .select("time totalDuration duration status date")
    .lean();

  console.log(`📅 Real-time check for ${dateStr}: Found ${existingAppointments.length} appointments`);

  const appointmentsMap = {};
  existingAppointments.forEach((apt) => {
    appointmentsMap[apt.time] = apt;
  });

  const isAvailable = checkProviderAvailabilityInstant(
    provider,
    dateObj,
    time,
    duration,
    appointmentsMap
  );

  return { available: isAvailable, suggestedSlots: [] };
};

const findBestAvailableSlotsForDate = async (
  date,
  totalDuration,
  providers,
  currentTime,
  isToday
) => {
  const dateStr = formatDateForDisplay(date);
  const dayOfWeek = getBusinessDayOfWeek(date);

  if (totalDuration >= 600) {
    return await handleMultiDayService(date, totalDuration, providers);
  }

  const workingProviders = providers.filter((provider) => {
    const providerDay = provider.workingHours.find(
      (wh) => wh.dayOfWeek === dayOfWeek && wh.isWorking
    );
    return !!providerDay;
  });

  if (workingProviders.length === 0) {
    return [];
  }

  const providerIds = workingProviders.map((p) => p._id);
  
// ✅ DEBUG: Check ALL appointments regardless of status
if (dateStr === '2025-12-02' || dateStr === '2025-12-06' || dateStr === '2025-12-07') {
  console.log(`🔍 DETAILED DEBUG for ${dateStr}`);
  const debugAppointments = await appointmentModel
    .find({
      providerId: { $in: providerIds },
      date: dateStr,
    })
    .select("date time userName status")
    .lean();
  
  console.log(`Found ${debugAppointments.length} appointments (any status):`);
  debugAppointments.forEach(apt => {
    console.log(`  - ${apt.date} at ${apt.time} | ${apt.userName} | Status: ${apt.status}`);
  });
}

  // ✅ COMPREHENSIVE FIX: Check ALL possible date formats
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  
  const localDateStart = new Date(year, month, day, 0, 0, 0, 0);
  const localDateEnd = new Date(year, month, day, 23, 59, 59, 999);
  const utcDateStart = new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
  const utcDateEnd = new Date(Date.UTC(year, month, day, 23, 59, 59, 999));
  
  const existingAppointments = await appointmentModel
    .find({
      providerId: { $in: providerIds },
      $or: [
        { date: dateStr },
        { date: { $gte: localDateStart, $lte: localDateEnd } },
        { date: { $gte: utcDateStart, $lte: utcDateEnd } },
        { date: { $regex: `^${dateStr}` } },
      ],
      status: { $in: ["pending", "confirmed", "paid"] }, 
    })
    .select("providerId time totalDuration duration status date userName")
    .lean();

  console.log(`📅 Found ${existingAppointments.length} existing appointments for ${dateStr}`);
  
  const bookedSlots = new Set();
  const appointmentsByProvider = {};
  
  existingAppointments.forEach((apt) => {
    const slotKey = `${apt.providerId}-${apt.time}`;
    bookedSlots.add(slotKey);
    
    if (!appointmentsByProvider[apt.providerId]) {
      appointmentsByProvider[apt.providerId] = {};
    }
    appointmentsByProvider[apt.providerId][apt.time] = apt;
  });

  const potentialTimeSlots = generateOptimizedTimeSlots(
    date,
    totalDuration,
    workingProviders,
    isToday,
    currentTime
  );

  if (potentialTimeSlots.length === 0) {
    return [];
  }

  const availableSlots = [];

  for (const timeSlot of potentialTimeSlots) {
    const result = await findAvailableProviderForSlot(
      workingProviders,
      date,
      timeSlot,
      totalDuration,
      appointmentsByProvider,
      bookedSlots
    );
    
    if (result !== null && result.available === true) {
      availableSlots.push(result);
    }
  }

  return availableSlots;
};

const getAvailableSlots = async (req, res) => {
  try {
    const { serviceId, providerId, startDate, endDate, selectedServices } =
      req.query;

    // Validate serviceId
    if (!serviceId || serviceId === "undefined" || serviceId === "null") {
      return res.status(400).json({
        message: "Service ID is required",
        received: serviceId,
      });
    }

    if (!serviceId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        message: "Invalid service ID format",
        serviceId: serviceId,
      });
    }

    let servicesToBook = [];
    if (selectedServices) {
      try {
        servicesToBook = JSON.parse(selectedServices);
      } catch (e) {
        return res
          .status(400)
          .json({ message: "Invalid selectedServices format" });
      }
    }

    const totalServiceDuration =
      servicesToBook.length > 0
        ? servicesToBook.reduce(
            (total, service) => total + (parseInt(service.duration) || 90),
            0
          )
        : 90;

const now = getCurrentBusinessDateTime();

// ✅ FIX: Parse dates without timezone conversion for date boundaries
let start, end;

if (startDate) {
  const [year, month, day] = startDate.split('-').map(Number);
  start = new Date(year, month - 1, day, 0, 0, 0, 0);
} else {
  start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
}

if (endDate) {
  const [year, month, day] = endDate.split('-').map(Number);
  end = new Date(year, month - 1, day, 0, 0, 0, 0);
} else {
  const futureDate = new Date(now);
  futureDate.setDate(futureDate.getDate() + 30);
  end = new Date(futureDate.getFullYear(), futureDate.getMonth(), futureDate.getDate(), 0, 0, 0, 0);
}

// Today at midnight (local time)
const todayMidnight = new Date(
  now.getFullYear(),
  now.getMonth(),
  now.getDate(),
  0,
  0,
  0,
  0
);

// Ensure we don't show past dates
const finalStart = start < todayMidnight ? todayMidnight : start;
    
    let availableProviders = [];

    if (providerId && providerId !== "undefined") {
      const provider = await providerModel
        .findById(providerId)
        .populate("services");
      if (provider && provider.isActive) {
        availableProviders = [provider];
      }
    } else {
      availableProviders = await providerModel
        .find({
          services: { $in: [serviceId] },
          isActive: true,
        })
        .populate("services");
    }

    if (availableProviders.length === 0) {
      return res
        .status(404)
        .json({ message: "No providers available for this service" });
    }

    // Generate UNIQUE available slots
    const uniqueSlots = await generateUniqueAvailableSlots(
      // start,
      finalStart,
      end,
      totalServiceDuration,
      availableProviders
    );

    res.status(200).json({
      availableSlots: uniqueSlots,
      totalDuration: totalServiceDuration,
      providers: availableProviders.map((p) => ({
        _id: p._id,
        name: p.name,
        profileImage: p.profileImage,
        rating: p.rating,
      })),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching available slots:", error);
    res.status(500).json({
      message: "Failed to fetch available slots",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

const generateUniqueAvailableSlots = async (
  start,
  end,
  totalDuration,
  providers
) => {
  const now = getCurrentBusinessDateTime();
  const dateRange = [];

  // Create today's date at midnight in LOCAL time (no timezone conversion)
  const todayMidnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0,
    0,
    0,
    0
  );

  // ✅ FIX: Generate dates using YEAR-MONTH-DAY values directly, not timezone conversion
  // Extract year, month, day from start date
  const startYear = start.getFullYear();
  const startMonth = start.getMonth();
  const startDay = start.getDate();

  const endYear = end.getFullYear();
  const endMonth = end.getMonth();
  const endDay = end.getDate();

  // Create date objects using local time constructor (no timezone shifts)
  let currentDate = new Date(startYear, startMonth, startDay, 0, 0, 0, 0);
  const endDateNormalized = new Date(endYear, endMonth, endDay, 0, 0, 0, 0);

  // Ensure we don't show past dates
  if (currentDate < todayMidnight) {
    currentDate = new Date(todayMidnight);
  }

  // Generate all dates in range
  while (currentDate <= endDateNormalized) {
    // Create a NEW independent date object for each day
    const dateToAdd = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      0,
      0,
      0,
      0
    );
    dateRange.push(dateToAdd);
    
    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Process dates in parallel batches
  const batchSize = 5;
  const allSlots = [];

  for (let i = 0; i < dateRange.length; i += batchSize) {
    const batch = dateRange.slice(i, i + batchSize);
    const batchPromises = batch.map((date) => {
      const dateStr = formatDateForDisplay(date);
      const todayStr = formatDateForDisplay(now);
      const isToday = dateStr === todayStr;

      return processDate(date, totalDuration, providers, now, isToday);
    });

    const batchResults = await Promise.all(batchPromises);
    allSlots.push(...batchResults.filter((result) => result !== null));
  }

  const todayString = formatDateForDisplay(now);
  const filteredSlots = allSlots.filter((slot) => {
    return slot.date >= todayString;
  });

  return filteredSlots.sort((a, b) => {
    // Sort by date string comparison (works with YYYY-MM-DD format)
    return a.date.localeCompare(b.date);
  });
};

const processDate = async (
  date,
  totalDuration,
  providers,
  currentTime,
  isToday
) => {
  const dateStr = formatDateForDisplay(date);
  
  // CRITICAL: Use the same timezone-aware function used elsewhere
  const dayOfWeek = getBusinessDayOfWeek(date);  // ✅ FIX: Consistent with rest of code

  const dayName = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ][dayOfWeek];

  // Check if any provider works on this day
  const hasWorkingProvider = providers.some((provider) => {
    const providerDay = provider.workingHours.find(
      (wh) => wh.dayOfWeek === dayOfWeek && wh.isWorking
    );
    return !!providerDay;
  });

  if (!hasWorkingProvider) {
    return null;
  }

  const bestSlotsForDate = await findBestAvailableSlotsForDate(
    date,
    totalDuration,
    providers,
    currentTime,
    isToday
  );

  if (bestSlotsForDate.length > 0) {
    return {
      date: dateStr,
      dayOfWeek: dayName,
      slots: bestSlotsForDate,
      totalDuration,
      isLongDuration: totalDuration > 480,
    };
  } else {
    return null;
  }
};





// const findBestAvailableSlotsForDate = async (
//   date,
//   totalDuration,
//   providers,
//   currentTime,
//   isToday
// ) => {
//   const dateStr = formatDateForDisplay(date);
//   const dayOfWeek = getBusinessDayOfWeek(date);

//   if (totalDuration >= 600) {
//     return await handleMultiDayService(date, totalDuration, providers);
//   }

//   const workingProviders = providers.filter((provider) => {
//     const providerDay = provider.workingHours.find(
//       (wh) => wh.dayOfWeek === dayOfWeek && wh.isWorking
//     );
//     return !!providerDay;
//   });

//   if (workingProviders.length === 0) {
//     return [];
//   }

//   const providerIds = workingProviders.map((p) => p._id);
  
//   // CRITICAL: Fetch ALL appointments including recently created ones
// // CRITICAL: Include ALL appointment statuses that block slots
// const existingAppointments = await appointmentModel
//   .find({
//     providerId: { $in: providerIds },
//     date: dateStr,
//     status: { $in: ["pending", "confirmed", "paid"] }, 
//   })
//   .select("providerId time totalDuration duration status")
//   .lean();

// console.log(`📅 Found ${existingAppointments.length} existing appointments for ${dateStr}`);

//   // Build a Set of booked time slots for quick lookup
//   const bookedSlots = new Set();
//   const appointmentsByProvider = {};
  
//   existingAppointments.forEach((apt) => {
//     // Create unique key for each booked slot
//     const slotKey = `${apt.providerId}-${apt.time}`;
//     bookedSlots.add(slotKey);
    
//     if (!appointmentsByProvider[apt.providerId]) {
//       appointmentsByProvider[apt.providerId] = {};
//     }
//     appointmentsByProvider[apt.providerId][apt.time] = apt;
//   });

//   const potentialTimeSlots = generateOptimizedTimeSlots(
//     date,
//     totalDuration,
//     workingProviders,
//     isToday,
//     currentTime
//   );

//   if (potentialTimeSlots.length === 0) {
//     return [];
//   }

//   const availableSlots = [];

//   // Process slots synchronously to ensure accurate availability
//   for (const timeSlot of potentialTimeSlots) {
//     const result = await findAvailableProviderForSlot(
//       workingProviders,
//       date,
//       timeSlot,
//       totalDuration,
//       appointmentsByProvider,
//       bookedSlots // Pass booked slots for quick filtering
//     );
    
//     if (result !== null && result.available === true) {
//       availableSlots.push(result);
//     }
//   }

//   return availableSlots;
// };

const generateOptimizedTimeSlots = (
  date,
  duration,
  providers,
  isToday,
  currentTime
) => {
  const dayOfWeek = getBusinessDayOfWeek(date);
  const slots = [];

  // Find the earliest start and latest end across all providers
  let earliestStartMinutes = 24 * 60; // Start with end of day
  let latestEndMinutes = 0; // Start with beginning of day

  providers.forEach((provider) => {
    const providerDay = provider.workingHours.find(
      (wh) => wh.dayOfWeek === dayOfWeek && wh.isWorking
    );
    
    if (providerDay) {
      const [startHour, startMin] = providerDay.startTime.split(":").map(Number);
      const [endHour, endMin] = providerDay.endTime.split(":").map(Number);

      const providerStart = startHour * 60 + startMin;
      const providerEnd = endHour * 60 + endMin;

      earliestStartMinutes = Math.min(earliestStartMinutes, providerStart);
      latestEndMinutes = Math.max(latestEndMinutes, providerEnd);
    }
  });

  // If no working hours found, return empty
  if (earliestStartMinutes >= latestEndMinutes) {
    return [];
  }

  // Adjust start time if today
  if (isToday) {
    const currentHour = getCurrentBusinessHour();
    const currentMinute = getCurrentBusinessMinute();
    const currentTimeMinutes = currentHour * 60 + currentMinute;

    // Add 1 hour buffer for same-day bookings and round to next 30-min slot
    const minStartMinutes = Math.ceil((currentTimeMinutes + 60) / 30) * 30;
    earliestStartMinutes = Math.max(earliestStartMinutes, minStartMinutes);
  }

  // Generate slots in 30-minute intervals
  for (let slotStart = earliestStartMinutes; slotStart < latestEndMinutes; slotStart += 30) {
    const slotEnd = slotStart + duration;
    
    // ✅ KEY FIX: Only add slot if appointment ENDS at or before provider's end time
    if (slotEnd <= latestEndMinutes) {
      const startHour = Math.floor(slotStart / 60);
      const startMin = slotStart % 60;
      const endHour = Math.floor(slotEnd / 60);
      const endMin = slotEnd % 60;

      const timeStr = `${startHour.toString().padStart(2, "0")}:${startMin.toString().padStart(2, "0")}`;
      const endTimeStr = `${endHour.toString().padStart(2, "0")}:${endMin.toString().padStart(2, "0")}`;

      slots.push({
        time: timeStr,
        endTime: endTimeStr,
      });
    }
  }

  return slots;
};

/* Check for time conflicts between two appointments
 * Returns true if there IS a conflict
 */
const hasTimeConflict = (
  requestStart,
  requestDuration,
  existingStart,
  existingDuration
) => {
  const [reqHour, reqMin] = requestStart.split(':').map(Number);
  const reqStartMinutes = reqHour * 60 + reqMin;
  const reqEndMinutes = reqStartMinutes + requestDuration;

  const [existHour, existMin] = existingStart.split(':').map(Number);
  const existStartMinutes = existHour * 60 + existMin;
  const existEndMinutes = existStartMinutes + existingDuration;

  // Check for overlap (without buffer for basic check)
  return !(reqEndMinutes <= existStartMinutes || reqStartMinutes >= existEndMinutes);
};


const findAvailableProviderForSlot = async (
  providers,
  date,
  timeSlot,
  duration,
  appointmentsByProvider,
  bookedSlots = new Set()
) => {
  const dayOfWeek = getBusinessDayOfWeek(date);

  for (const provider of providers) {
    const providerId = provider._id.toString();
    
    // Quick check: is this exact slot already booked for this provider?
    const slotKey = `${providerId}-${timeSlot.time}`;
    if (bookedSlots.has(slotKey)) {
      continue;
    }

    // Check if provider works on this day
    const providerDay = provider.workingHours.find(
      (wh) => wh.dayOfWeek === dayOfWeek && wh.isWorking
    );

    if (!providerDay) continue;

    // Convert all times to minutes for accurate comparison
    const [slotStartHour, slotStartMin] = timeSlot.time.split(':').map(Number);
    const slotStartMinutes = slotStartHour * 60 + slotStartMin;
    const slotEndMinutes = slotStartMinutes + duration;

    const [providerStartHour, providerStartMin] = providerDay.startTime.split(':').map(Number);
    const [providerEndHour, providerEndMin] = providerDay.endTime.split(':').map(Number);
    const providerStartMinutes = providerStartHour * 60 + providerStartMin;
    const providerEndMinutes = providerEndHour * 60 + providerEndMin;

    // ✅ Check if slot fits within provider's working hours
    if (slotStartMinutes < providerStartMinutes || slotEndMinutes > providerEndMinutes) {
      continue;
    }

    // Check for conflicts with existing appointments
    const providerAppointments = appointmentsByProvider[provider._id] || {};
    const existingAppointments = Object.values(providerAppointments);

    let hasConflict = false;
    
    for (const apt of existingAppointments) {
      const aptDuration = apt.totalDuration || apt.duration || 90;
      
      if (hasTimeConflictStrict(timeSlot.time, duration, apt.time, aptDuration)) {
        hasConflict = true;
        break;
      }
    }

    if (!hasConflict) {
      // Format end time for response
      const endHour = Math.floor(slotEndMinutes / 60);
      const endMin = slotEndMinutes % 60;
      const estimatedEndTime = `${endHour.toString().padStart(2, "0")}:${endMin.toString().padStart(2, "0")}`;

      return {
        time: timeSlot.time,
        available: true,
        duration: duration,
        providerId: provider._id,
        providerName: provider.name,
        estimatedEndTime: estimatedEndTime,
        isLongDuration: duration > 480,
        providerInfo: {
          _id: provider._id,
          name: provider.name,
          profileImage: provider.profileImage,
          rating: provider.rating,
        },
      };
    }
  }

  return null;
};

const checkProviderAvailabilityInstant = (
  provider,
  date,
  time,
  duration,
  providerAppointments
) => {
  const dayOfWeek = getBusinessDayOfWeek(date);
  
  const providerDay = provider.workingHours.find(
    (wh) => wh.dayOfWeek === dayOfWeek && wh.isWorking
  );

  if (!providerDay) {
    return false;
  }

  // Convert times to minutes
  const [requestHour, requestMinute] = time.split(':').map(Number);
  const requestStartMinutes = requestHour * 60 + requestMinute;
  const requestEndMinutes = requestStartMinutes + duration;

  const [startHour, startMinute] = providerDay.startTime.split(':').map(Number);
  const [endHour, endMinute] = providerDay.endTime.split(':').map(Number);
  const workStartMinutes = startHour * 60 + startMinute;
  const workEndMinutes = endHour * 60 + endMinute;

  // Check working hours boundary
  if (requestStartMinutes < workStartMinutes || requestEndMinutes > workEndMinutes) {
    return false;
  }

  // Check for conflicts with existing appointments
  const existingAppointments = Object.values(providerAppointments);
  
  for (const apt of existingAppointments) {
    const aptDuration = apt.totalDuration || apt.duration || 90;
    
    if (hasTimeConflict(time, duration, apt.time, aptDuration)) {
      return false;
    }
  }

  return true;
};

const hasTimeConflictStrict = (
  requestStart,
  requestDuration,
  existingStart,
  existingDuration
) => {
  const [reqHour, reqMin] = requestStart.split(':').map(Number);
  const reqStartMinutes = reqHour * 60 + reqMin;
  const reqEndMinutes = reqStartMinutes + requestDuration;

  const [existHour, existMin] = existingStart.split(':').map(Number);
  const existStartMinutes = existHour * 60 + existMin;
  const existEndMinutes = existStartMinutes + existingDuration;

  // Add buffer to existing appointment (provider needs time between clients)
  const bufferedExistStart = existStartMinutes - BUFFER_MINUTES;
  const bufferedExistEnd = existEndMinutes + BUFFER_MINUTES;

  // Check for ANY overlap with buffered times
  const hasOverlap = !(reqEndMinutes <= bufferedExistStart || 
                       reqStartMinutes >= bufferedExistEnd);
  
  return hasOverlap;
};
// Check consecutive days availability for multi-day services
const checkConsecutiveDaysAvailability = async (
  providerId,
  startDate,
  daysNeeded,
  workingHours
) => {
  for (let i = 0; i < daysNeeded; i++) {
    const checkDate = new Date(startDate);
    checkDate.setDate(checkDate.getDate() + i);

    const dayOfWeek = checkDate.getDay();
    const providerDay = workingHours.find(
      (wh) => wh.dayOfWeek === dayOfWeek && wh.isWorking
    );

    if (!providerDay) {
      return false;
    }

    // Check for existing appointments
    // const dateStr = checkDate.toISOString().split('T')[0];
    const dateStr = formatDateForDisplay(checkDate);
    const dateRange = getDateRangeForQuery(dateStr);
    const existingAppointments = await appointmentModel.find({
      providerId,
      date: {
        $gte: dateRange.start,
        $lte: dateRange.end,
      },
      status: { $in: ["pending", "confirmed"] },
    });

    if (existingAppointments.length > 0) {
      return false;
    }
  }
  return true;
};

const handleMultiDayService = async (startDate, totalDuration, providers) => {
  const slots = [];
  const maxDailyHours = 8 * 60;
  const daysNeeded = Math.ceil(totalDuration / maxDailyHours);

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
        time: "08:00",
        available: true,
        duration: totalDuration,
        providerId: provider._id,
        providerName: provider.name,
        isMultiDay: true,
        daysNeeded: daysNeeded,
        endDate: endDate.toISOString().split("T")[0],
        estimatedEndTime: `Day ${daysNeeded} - 4:00 PM`,
        isLongDuration: true,
        providerInfo: {
          _id: provider._id,
          name: provider.name,
          profileImage: provider.profileImage,
          rating: provider.rating,
        },
      });

      break;
    }
  }

  return slots;
};

const bookMultipleAppointment = async (req, res) => {
  try {
    const { services, date, time, totalAmount, clientNotes, consentForm } = req.body;
    let { providerId } = req.body;
    const userId = req.userId;

    // Validation
    if (!services || !Array.isArray(services) || services.length === 0) {
      return res.status(400).json({ message: "At least one service is required" });
    }

    if (!consentForm?.consentToTreatment) {
      return res.status(400).json({ message: "Treatment consent is required" });
    }

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    const { calculatedDuration, calculatedAmount, processedServices } =
      calculateServiceTotals(services);

    // ✅ FIX: Parse date and format as string for storage
    const dateObj = parseDateInBusinessTz(date);
    const dateStr = formatDateForDisplay(dateObj); // Returns "YYYY-MM-DD" string

    if (providerId) {
      const provider = await providerModel.findById(providerId);
      if (!provider || !provider.isActive) {
        return res.status(404).json({ message: "Provider not available" });
      }

      // ✅ FIX: Query using the date STRING, not Date object
      const latestAppointments = await appointmentModel
        .find({
          providerId,
          date: dateStr,  // Use string directly
          status: { $in: ["pending", "confirmed", "paid"] },
        })
        .lean();

      for (const apt of latestAppointments) {
        const aptDuration = apt.totalDuration || apt.duration || 90;
        if (hasTimeConflictStrict(time, calculatedDuration, apt.time, aptDuration)) {
          return res.status(409).json({
            message: "This time slot was just booked. Please select a different time.",
            conflictingTime: apt.time,
          });
        }
      }

      const lockAcquired = await acquireBookingLock(providerId, dateStr, time);
      if (!lockAcquired) {
        return res.status(409).json({
          message: "Another booking is in progress for this slot. Please try again.",
        });
      }
    }

    const providerData = await providerModel.findById(providerId);

    // ✅ FIX: Store date as STRING in metadata
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "cad",
            product_data: {
              name: `${services.length > 1 ? "Multiple Services" : services[0].serviceTitle} (50% Deposit)`,
            },
            unit_amount: Math.round(calculatedAmount * 0.5 * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/appointment/verify?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/appointment/cancelled`,
      metadata: {
        userId: userId.toString(),
        providerId: providerId.toString(),
        providerName: providerData.name,
        userName: userData.name,
        userEmail: userData.email,
        userPhone: userData.phone,
        date: dateStr,  // ✅ Store as "YYYY-MM-DD" string, NOT ISO date
        time: time,
        totalDuration: calculatedDuration.toString(),
        calculatedAmount: calculatedAmount.toString(),
        services: JSON.stringify(processedServices),
        clientNotes: clientNotes || "",
        consentForm: JSON.stringify(consentForm),
      },
      customer_email: userData.email,
    });

    res.status(200).json({
      message: "Please complete payment to confirm your appointment.",
      paymentUrl: session.url,
      sessionId: session.id,
      assignedProvider: {
        name: providerData.name,
        profileImage: providerData.profileImage,
      },
    });
  } catch (error) {
    console.error("❌ Error creating payment session:", error);
    res.status(500).json({
      message: error.message || "Failed to create payment session",
    });
  }
};

const verifyAppointmentPayment = async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: "Session ID is required",
      });
    }

    let session;
    try {
      session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ["payment_intent"],
      });
    } catch (stripeError) {
      console.error("❌ Stripe session retrieval failed:", stripeError.message);
      return res.status(400).json({
        success: false,
        message: "Invalid payment session",
        details: stripeError.message,
      });
    }

    if (session.payment_status === "unpaid") {
      return res.status(200).json({
        success: false,
        status: "processing",
        message: "Payment is being processed",
        payment_status: session.payment_status,
      });
    }

    if (session.payment_status !== "paid") {
      return res.status(200).json({
        success: false,
        message: `Payment ${session.payment_status}. Please try again or contact support.`,
        payment_status: session.payment_status,
      });
    }

    const existingAppointment = await appointmentModel.findOne({
      "payment.transactionId": session.payment_intent.id,
    });

    if (existingAppointment) {
      return res.json({
        success: true,
        message: "Appointment already confirmed",
        appointment: existingAppointment,
      });
    }

    const metadata = session.metadata;
    const services = JSON.parse(metadata.services);
    const consentForm = JSON.parse(metadata.consentForm);

    
    const newAppointment = await appointmentModel.create({
      userId: metadata.userId,
      providerId: metadata.providerId,
      providerName: metadata.providerName,
      services: services,
      serviceId: services[0].serviceId,
      serviceTitle:
        services.length > 1
          ? `${services[0].serviceTitle} + ${services.length - 1} more`
          : services[0].serviceTitle,
      userName: metadata.userName,
      userEmail: metadata.userEmail,
      userPhone: metadata.userPhone,
      date: metadata.date,  
      time: metadata.time,
      clientNotes: metadata.clientNotes,
      consentForm: {
        healthConditions: consentForm.healthConditions || "",
        allergies: consentForm.allergies || "",
        consentToTreatment: consentForm.consentToTreatment || false,
        submittedAt: new Date(),  
      },
      totalDuration: parseInt(metadata.totalDuration),
      isLongDuration: parseInt(metadata.totalDuration) > 480,
      isMultiDay: parseInt(metadata.totalDuration) >= 600,
      status: "confirmed",
      confirmedAt: new Date(),
      payment: {
        status: "paid",
        transactionId: session.payment_intent.id,
        paymentDate: new Date(),
        amount: session.amount_total / 100,
        currency: "CAD",
      },
    });

    console.log("✅ Appointment created successfully after payment");
    console.log("📅 Stored date:", newAppointment.date); // Should show "2024-11-21"


       try {
      await sendBookingEmails(newAppointment.toObject());
      console.log("📧 Confirmation emails sent successfully");
    } catch (emailError) {
      console.error("❌ Failed to send confirmation emails:", emailError);
    
    }

    return res.json({
      success: true,
      message: "Payment verified and appointment confirmed",
      appointment: newAppointment,
    })
   

  } catch (error) {
    console.error("❌ Payment verification error:", error);
    res.status(500).json({
      success: false,
      message: "Payment verification failed",
      details: error.message,
    });
  }
};



//     const { services, date, time, totalAmount, clientNotes, consentForm } =
//       req.body;
//     let { providerId } = req.body;
//     const userId = req.userId;

//     // Validation
//     if (!services || !Array.isArray(services) || services.length === 0) {
//       return res
//         .status(400)
//         .json({ message: "At least one service is required" });
//     }

//     if (!consentForm?.consentToTreatment) {
//       return res.status(400).json({ message: "Treatment consent is required" });
//     }

//     // Get user data
//     const userData = await userModel.findById(userId);
//     if (!userData) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Calculate service totals
//     const { calculatedDuration, calculatedAmount, processedServices } =
//       calculateServiceTotals(services);

//     // Validate provider availability
//     if (providerId) {
//       const provider = await providerModel.findById(providerId);
//       if (!provider || !provider.isActive) {
//         return res.status(404).json({ message: "Provider not available" });
//       }
//    const dateObj = parseDateInBusinessTz(date);
//     const dateStr = formatDateForDisplay(dateObj);

//     // CRITICAL: Double-check availability right before booking
//     // Fetch the LATEST appointments to avoid race conditions
//     const latestAppointments = await appointmentModel
//       .find({
//         providerId,
//         date: dateStr,
//         status: { $in: ["pending", "confirmed"] },
//       })
//       .lean();

//     // Check for conflicts with all existing appointments
//     for (const apt of latestAppointments) {
//       const aptDuration = apt.totalDuration || apt.duration || 90;
//       if (hasTimeConflictStrict(time, calculatedDuration, apt.time, aptDuration)) {
//         return res.status(409).json({
//           message: "This time slot was just booked. Please select a different time.",
//           conflictingTime: apt.time,
//         });
//       }
//     }
 
//     // Try to acquire a lock to prevent simultaneous bookings
//     const lockAcquired = await acquireBookingLock(providerId, dateStr, time);
//     if (!lockAcquired) {
//       return res.status(409).json({
//         message: "Another booking is in progress for this slot. Please try again.",
//       });
//     }
//     }

//     const providerData = await providerModel.findById(providerId);

//     // DON'T CREATE APPOINTMENT YET - Just create Stripe session with all data in metadata
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       line_items: [
//         {
//           price_data: {
//             currency: "cad",
//             product_data: {
//               name: `${services.length > 1 ? "Multiple Services" : services[0].serviceTitle} (50% Deposit)`,
//             },
//             unit_amount: Math.round(calculatedAmount * 0.5 * 100),
//           },
//           quantity: 1,
//         },
//       ],
//       mode: "payment",
//       success_url: `${process.env.FRONTEND_URL}/appointment/verify?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `${process.env.FRONTEND_URL}/appointment/cancelled`,
//       metadata: {
//         userId: userId.toString(),
//         providerId: providerId.toString(),
//         providerName: providerData.name,
//         userName: userData.name,
//         userEmail: userData.email,
//         userPhone: userData.phone,
//         date: appointmentDate.toISOString(),
//         time: time,
//         totalDuration: calculatedDuration.toString(),
//         calculatedAmount: calculatedAmount.toString(),
//         services: JSON.stringify(processedServices),
//         clientNotes: clientNotes || "",
//         consentForm: JSON.stringify(consentForm),
//       },
//       customer_email: userData.email,
//     });

//     res.status(200).json({
//       message: "Please complete payment to confirm your appointment.",
//       paymentUrl: session.url,
//       sessionId: session.id,
//       assignedProvider: {
//         name: providerData.name,
//         profileImage: providerData.profileImage,
//       },
//     });
//   } catch (error) {
//     console.error("❌ Error creating payment session:", error);
//     res.status(500).json({
//       message: error.message || "Failed to create payment session",
//     });
//   }
// };

// const verifyAppointmentPayment = async (req, res) => {
//   try {
//     const { sessionId } = req.body;

//     if (!sessionId) {
//       return res.status(400).json({
//         success: false,
//         message: "Session ID is required",
//       });
//     }

//     // Retrieve the session
//     let session;
//     try {
//       session = await stripe.checkout.sessions.retrieve(sessionId, {
//         expand: ["payment_intent"],
//       });
//     } catch (stripeError) {
//       console.error("❌ Stripe session retrieval failed:", stripeError.message);
//       return res.status(400).json({
//         success: false,
//         message: "Invalid payment session",
//         details: stripeError.message,
//       });
//     }

//     // Check if payment is completed
//     if (session.payment_status === "unpaid") {
//       return res.status(200).json({
//         success: false,
//         status: "processing",
//         message: "Payment is being processed",
//         payment_status: session.payment_status,
//       });
//     }

//     if (session.payment_status !== "paid") {
//       return res.status(200).json({
//         success: false,
//         message: `Payment ${session.payment_status}. Please try again or contact support.`,
//         payment_status: session.payment_status,
//       });
//     }

//     // Check if appointment already exists for this session
//     const existingAppointment = await appointmentModel.findOne({
//       "payment.transactionId": session.payment_intent.id,
//     });

//     if (existingAppointment) {
//       return res.json({
//         success: true,
//         message: "Appointment already confirmed",
//         appointment: existingAppointment,
//       });
//     }

//     // NOW CREATE THE APPOINTMENT - Only after payment is confirmed
//     const metadata = session.metadata;
//     const services = JSON.parse(metadata.services);
//     const consentForm = JSON.parse(metadata.consentForm);

//     const newAppointment = await appointmentModel.create({
//       userId: metadata.userId,
//       providerId: metadata.providerId,
//       providerName: metadata.providerName,
//       services: services,
//       serviceId: services[0].serviceId,
//       serviceTitle:
//         services.length > 1
//           ? `${services[0].serviceTitle} + ${services.length - 1} more`
//           : services[0].serviceTitle,
//       userName: metadata.userName,
//       userEmail: metadata.userEmail,
//       userPhone: metadata.userPhone,
//       date: new Date(metadata.date),
//       time: metadata.time,
//       clientNotes: metadata.clientNotes,
//       consentForm: {
//         healthConditions: consentForm.healthConditions || "",
//         allergies: consentForm.allergies || "",
//         consentToTreatment: consentForm.consentToTreatment || false,
//         submittedAt: consentForm.submittedAt || new Date(),
//       },
//       totalDuration: parseInt(metadata.totalDuration),
//       isLongDuration: parseInt(metadata.totalDuration) > 480,
//       isMultiDay: parseInt(metadata.totalDuration) >= 600,
//       status: "confirmed", // Directly confirmed since payment is done
//       confirmedAt: new Date(),
//       payment: {
//         status: "paid",
//         transactionId: session.payment_intent.id,
//         paymentDate: new Date(),
//         amount: session.amount_total / 100,
//         currency: "CAD",
//       },
//     });

//     console.log("✅ Appointment created successfully after payment");

//     // Send confirmation emails
//     // try {
//     //   await sendBookingEmails(newAppointment.toObject());
//     //   console.log("📧 Confirmation emails sent successfully");
//     // } catch (emailError) {
//     //   console.error("❌ Failed to send confirmation emails:", emailError);
//     // }

//     return res.json({
//       success: true,
//       message: "Payment verified and appointment confirmed",
//       appointment: newAppointment,
//     });
//   } catch (error) {
//     console.error("❌ Payment verification error:", error);
//     console.error("Error stack:", error.stack);

//     let statusCode = 500;
//     let message = "Payment verification failed";
//     let details = error.message;

//     if (error.name === "CastError") {
//       statusCode = 400;
//       message = "Invalid data format";
//     } else if (error.type === "StripeInvalidRequestError") {
//       statusCode = 400;
//       message = "Invalid Stripe session";
//       details = error.raw?.message || error.message;
//     } else if (error.name === "ValidationError") {
//       statusCode = 400;
//       message = "Data validation failed";
//       details = Object.values(error.errors)
//         .map((e) => e.message)
//         .join(", ");
//     }

//     res.status(statusCode).json({
//       success: false,
//       message,
//       details,
//       error_type: error.name || error.type,
//     });
//   }
// };

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
      order: index + 1,
    };
  });

  return {
    calculatedDuration,
    calculatedAmount,
    processedServices,
  };
};

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
      status: { $in: ["pending", "confirmed"] },
    });

    if (existingAppointment) {
      return res.status(409).json({
        message:
          "This slot is no longer available. Please select another time.",
      });
    }

    // Convert single service to services array format
    const serviceData = {
      serviceId,
      serviceTitle,
      duration: parseInt(duration) || 90,
      price: amount,
      order: 1,
    };

    const newAppointment = await appointmentModel.create({
      userId,
      services: [serviceData],
      serviceId,
      serviceTitle,
      duration: duration.toString(),
      totalDuration: parseInt(duration) || 90,

      userName: userData.name,
      userEmail: userData.email,
      userPhone: userData.phone,
      date: new Date(date),
      time,
      status: "pending",
      payment: {
        amount,
        status: "pending",
      },
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "cad",
            product_data: {
              name: `${serviceTitle} (50% Deposit)`,
            },
            unit_amount: Math.round(amount * 0.5 * 100), // 50% deposit in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_email: userData.email,
      success_url: `${process.env.FRONTEND_URL}/appointment/verify/${newAppointment._id}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/appointment/cancelled`,
      metadata: {
        appointmentId: newAppointment._id.toString(),
      },
    });

    res.status(201).json({
      message: "Appointment created. Please complete payment.",
      appointment: newAppointment,
      paymentUrl: session.url,
    });
  } catch (error) {
    console.error("Error booking appointment:", error);
    res
      .status(500)
      .json({ message: error.message || "Failed to book appointment" });
  }
};

const handleStripeRedirect = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { session_id } = req.query;

    if (!session_id) {
      return res.redirect(
        `${process.env.FRONTEND_URL}/appointment/error?message=Invalid session`
      );
    }

    const redirectUrl = `${process.env.FRONTEND_URL}/verify-payment?appointmentId=${appointmentId}&sessionId=${session_id}`;
    res.redirect(redirectUrl);
  } catch (error) {
    console.error("Error handling Stripe redirect:", error);
    res.redirect(
      `${process.env.FRONTEND_URL}/appointment/error?message=Verification failed`
    );
  }
};

// Update appointment notes (for service provider)
const updateAppointmentNotes = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { preAppointment, duringAppointment, postAppointment, privateNotes } =
      req.body;

    const appointment = await appointmentModel.findByIdAndUpdate(
      appointmentId,
      {
        $set: {
          "serviceProviderNotes.preAppointment": preAppointment,
          "serviceProviderNotes.duringAppointment": duringAppointment,
          "serviceProviderNotes.postAppointment": postAppointment,
          "serviceProviderNotes.privateNotes": privateNotes,
        },
      },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({
      message: "Notes updated successfully",
      appointment,
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
        status: "completed",
        completedAt: new Date(),
        "serviceProviderNotes.postAppointment": postAppointmentNotes,
        "followUp.rating": rating,
      },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({
      message: "Appointment marked as completed",
      appointment,
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
    const filePath = path.join(
      __dirname,
      "..",
      "calendar",
      `event-${appointmentId}.ics`
    );

    if (!fs.existsSync(filePath)) {
      return res.status(404).send("Calendar file not found");
    }

    res.setHeader("Content-Type", "text/calendar");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=appointment-${appointmentId}.ics`
    );

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
  if (!appointment)
    return res.status(404).json({ message: "Appointment not found" });

  // Check if slot is available (reuse your slot check function)
  const isAvailable = await checkRealTimeAvailability(
    newDate,
    newTime,
    appointment.totalDuration,
    appointment.providerId
  );
  if (!isAvailable.available) {
    return res
      .status(409)
      .json({
        message: "Time slot not available",
        suggestedSlots: isAvailable.suggestedSlots,
      });
  }

  // Save reschedule history
  appointment.rescheduleHistory.push({
    oldDate: appointment.date,
    oldTime: appointment.time,
    newDate,
    newTime,
    rescheduledBy: "client", // or provider/admin
  });

  // Update appointment
  appointment.date = new Date(newDate);
  appointment.time = newTime;
  appointment.status = "confirmed"; // reset if needed
  await appointment.save();

  res.json({ message: "Appointment rescheduled successfully", appointment });
};

const getSingleAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const userId = req.userId;

    const appointment = await appointmentModel.findOne({
      _id: appointmentId,
      userId: userId,
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found or access denied",
      });
    }

    res.status(200).json({
      success: true,
      appointment,
    });
  } catch (error) {
    console.error("Error fetching appointment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch appointment",
    });
  }
};

// Get user appointments
const getUserAppointments = async (req, res) => {
  try {
    // Verify the requested userId matches the authenticated user
    if (req.params.userId !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access to appointments",
      });
    }

    const appointments = await appointmentModel
      .find({ userId: req.params.userId })
      .sort({ date: 1, time: 1 }) // Sort by upcoming first
      .lean();

    if (!appointments.length) {
      return res.status(200).json({
        success: true,
        message: "No appointments found",
        appointments: [],
      });
    }

    res.status(200).json({
      success: true,
      appointments,
    });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch appointments",
    });
  }
};

// Cancel appointment
const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId, reason, cancelledBy = "admin" } = req.body;

    // Validate input
    if (!appointmentId) {
      return res.status(400).json({
        success: false,
        message: "Appointment ID is required",
      });
    }

    if (!reason || reason.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cancellation reason is required",
      });
    }

    // Check if user is authenticated and is admin

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Validate ObjectId format
    if (!appointmentId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment ID format",
      });
    }

    // Fetch the appointment
    const appointment = await appointmentModel.findById(appointmentId);

    // Check if appointment exists
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // Prevent duplicate cancellations
    if (appointment.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Appointment is already cancelled",
      });
    }

    // Prevent cancelling completed appointments
    if (appointment.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel completed appointments",
      });
    }

    // Calculate refund eligibility
    const appointmentDate = new Date(appointment.date);
    const [hours, minutes] = appointment.time.split(":").map(Number);
    appointmentDate.setHours(hours, minutes, 0, 0);

    const hoursUntilAppointment =
      (appointmentDate - new Date()) / (1000 * 60 * 60);
    const refundEligible = hoursUntilAppointment > 24;

    // Update appointment
    appointment.status = "cancelled";
    appointment.cancellation = {
      cancelledBy,
      reason: reason.trim(),
      refundEligible,
      cancellationFee: refundEligible
        ? 0
        : Math.floor(appointment.payment?.amount * 0.1) || 0,
    };
    appointment.cancelledAt = new Date();

    await appointment.save();

    return res.status(200).json({
      success: true,
      message: refundEligible
        ? "Appointment cancelled successfully. Full refund will be processed."
        : `Appointment cancelled. A cancellation fee of $${appointment.cancellation.cancellationFee} may apply.`,
      appointment: {
        _id: appointment._id,
        status: appointment.status,
        cancelledAt: appointment.cancelledAt,
        cancellation: appointment.cancellation,
      },
    });
  } catch (error) {
    console.error("Error cancelling appointment:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to cancel appointment. Please try again.",
    });
  }
};

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
  getSingleAppointment,
};
