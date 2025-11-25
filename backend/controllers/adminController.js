import appointmentModel from "../models/appointment.js";
import providerModel from "../models/providerModel.js";
import serviceModel from "../models/serviceModel.js";
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import path from 'path';
import multer from 'multer';
import csv from 'csv-parser';
// import fs from 'fs';
import { Readable } from 'stream';
import userModel from "../models/userModel.js";
import mongoose from "mongoose";

// Configure multer for file upload
const storage = multer.memoryStorage();
const VagaroUpload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.mimetype === 'text/tab-separated-values' || file.originalname.endsWith('.csv') || file.originalname.endsWith('.tsv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV/TSV files are allowed'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

// Helper functions
const parseDate = (dateStr) => {
  const parts = dateStr.split('/');
  if (parts.length === 3) {
    const [month, day, year] = parts;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  
  if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return dateStr;
  }
  
  const date = new Date(dateStr);
  if (!isNaN(date.getTime())) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  throw new Error(`Unable to parse date: ${dateStr}`);
};

const parseVagaroDateTime = (datetimeStr) => {
  // Parse Vagaro format: "15.12.2025 14:00 UTC" or similar
  if (!datetimeStr) throw new Error('Empty datetime string');
  
  // Remove UTC and extra info
  const cleaned = datetimeStr.replace(/UTC.*$/i, '').trim();
  
  // Try parsing as ISO date
  const date = new Date(cleaned);
  if (!isNaN(date.getTime())) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return {
      date: `${year}-${month}-${day}`,
      time: `${hours}:${minutes}`
    };
  }
  
  // Try DD.MM.YYYY HH:MM format
  const ddmmyyyyMatch = cleaned.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})\s+(\d{1,2}):(\d{2})/);
  if (ddmmyyyyMatch) {
    const [, day, month, year, hours, minutes] = ddmmyyyyMatch;
    return {
      date: `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`,
      time: `${hours.padStart(2, '0')}:${minutes}`
    };
  }
  
  throw new Error(`Unable to parse datetime: ${datetimeStr}`);
};

const parseTime = (timeStr) => {
  timeStr = timeStr.trim();
  
  const ampmMatch = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (ampmMatch) {
    let hours = parseInt(ampmMatch[1]);
    const minutes = ampmMatch[2];
    const period = ampmMatch[3].toUpperCase();
    
    if (period === 'PM' && hours !== 12) {
      hours += 12;
    } else if (period === 'AM' && hours === 12) {
      hours = 0;
    }
    
    return `${hours.toString().padStart(2, '0')}:${minutes}`;
  }
  
  const timeMatch = timeStr.match(/(\d{1,2}):(\d{2})/);
  if (timeMatch) {
    const hours = timeMatch[1].padStart(2, '0');
    const minutes = timeMatch[2];
    return `${hours}:${minutes}`;
  }
  
  throw new Error(`Unable to parse time: ${timeStr}`);
};

const formatPhone = (phone) => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
};

const findOrCreateUser = async (name, email, phone) => {
  if (email) {
    let user = await userModel.findOne({ email: email.toLowerCase().trim() });
    if (user) return user;
  }
  
  if (phone) {
    const formattedPhone = formatPhone(phone);
    let user = await userModel.findOne({ phone: formattedPhone });
    if (user) return user;
  }
  
  try {
    const newUser = await userModel.create({
      name: name || 'Imported Client',
      email: email?.toLowerCase().trim() || `imported_${Date.now()}_${Math.random().toString(36).slice(2)}@temp.com`,
      phone: formatPhone(phone) || '',
      password: Math.random().toString(36).slice(-8),
      isImported: true,
    });
    return newUser;
  } catch (error) {
    console.error(`Error creating user for ${name}:`, error.message);
    return null;
  }
};

const getServiceInfo = async (serviceName) => {
  if (!serviceName) return null;
  const service = await serviceModel.findOne({
    title: new RegExp(`^${serviceName}$`, 'i'),
  });
  return service;
};

const getProviderInfo = async (providerName) => {
  if (!providerName) return null;
  const provider = await providerModel.findOne({
    name: new RegExp(`^${providerName}$`, 'i'),
    isActive: true,
  });
  return provider;
};

// Main import function
const importVagaroAppointments = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    console.log('📥 Starting Vagaro import from uploaded file...');

    const results = [];
    const errors = [];
    let rowIndex = 0;

    // Create readable stream from buffer
    const bufferStream = new Readable();
    bufferStream.push(req.file.buffer);
    bufferStream.push(null);

    // Parse CSV/TSV with error handling
    try {
      await new Promise((resolve, reject) => {
        // Detect delimiter by reading first line
        const firstChunk = req.file.buffer.toString('utf8', 0, 500);
        const delimiter = firstChunk.includes('\t') ? '\t' : ',';
        
        console.log(`📄 Detected delimiter: ${delimiter === '\t' ? 'TAB (TSV)' : 'COMMA (CSV)'}`);
        
        const parser = bufferStream.pipe(csv({ separator: delimiter }));
        
        parser.on('data', (row) => {
          results.push({ row, index: rowIndex++ });
        });
        
        parser.on('end', () => {
          console.log(`✅ CSV parsed successfully: ${results.length} rows`);
          resolve();
        });
        
        parser.on('error', (err) => {
          console.error('❌ CSV parsing error:', err);
          reject(new Error('Failed to parse CSV file: ' + err.message));
        });
      });
    } catch (parseError) {
      console.error('Parse error:', parseError);
      return res.status(400).json({
        success: false,
        message: 'Invalid CSV file format',
        error: parseError.message,
      });
    }

    if (results.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'CSV file is empty or invalid',
      });
    }

    console.log(`📋 Processing ${results.length} appointments...`);

    let imported = 0;
    let skipped = 0;
    let failed = 0;

    // Process each row with better error handling
    for (const { row, index } of results) {
      try {
        // Log the first row to see actual column names
        if (index === 0) {
          console.log('📋 CSV Columns found:', Object.keys(row));
        }

        // Extract data - case insensitive and trimmed column matching
        const getColumn = (row, ...possibleNames) => {
          for (const name of possibleNames) {
            const key = Object.keys(row).find(k => 
              k.toLowerCase().trim() === name.toLowerCase().trim()
            );
            if (key && row[key]) return row[key].trim();
          }
          return null;
        };

        // Vagaro export column mappings
        const titleField = getColumn(row, 'Title', 'Service', 'Service Name', 'Treatment');
        const additionalTitle = getColumn(row, 'Additional Title', 'Client Name', 'Customer Name', 'Name');
        const startTime = getColumn(row, 'Given planned earliest start', 'Start', 'Start Time', 'Date/Time');
        const endTime = getColumn(row, 'Given planned earliest end', 'End', 'End Time');
        const notes = getColumn(row, 'Notes', 'Client Notes', 'Comments', 'Special Instructions') || '';
        const assignedResources = getColumn(row, 'Assigned Resources', 'Provider', 'Staff', 'Therapist');
        
        // Try to extract client name from title or additional title
        const clientName = additionalTitle || titleField?.split('-')[0]?.trim() || 'Imported Client';
        const serviceName = titleField || 'Imported Service';
        const providerName = assignedResources;

        // We don't have email/phone from this export format
        const clientEmail = null;
        const clientPhone = null;

        // Validation
        if (!startTime) {
          console.log(`⚠️ Row ${index + 1}: Missing start time`);
          skipped++;
          errors.push({
            row: index + 1,
            error: 'Missing start time',
            client: clientName || 'Unknown',
          });
          continue;
        }

// Parse date and time from Vagaro format
let appointmentDate, appointmentTime;
let duration = 90; // default
let price = 0; // No price info in this export format

try {
  const startParsed = parseVagaroDateTime(startTime);
  appointmentDate = startParsed.date;  // ✅ This should already be "YYYY-MM-DD" format
  appointmentTime = startParsed.time;
  
  console.log(`📅 Row ${index + 1}: Parsed date as ${appointmentDate} at ${appointmentTime}`);
  
  // Calculate duration if we have end time
  if (endTime) {
    try {
      const endParsed = parseVagaroDateTime(endTime);
      const start = new Date(startParsed.date + ' ' + startParsed.time);
      const end = new Date(endParsed.date + ' ' + endParsed.time);
      duration = Math.round((end - start) / 60000); // milliseconds to minutes
      if (duration <= 0) duration = 90; // fallback to default
    } catch (endParseError) {
      console.log(`⚠️ Row ${index + 1}: Could not parse end time, using default duration`);
    }
  }
} catch (dateError) {
  console.log(`⚠️ Row ${index + 1}: Date/Time parsing error: ${dateError.message}`);
  failed++;
  errors.push({
    row: index + 1,
    error: `Invalid date/time format: ${dateError.message}`,
    client: clientName,
  });
  continue;
}

// ✅ CRITICAL: Check for duplicates AFTER we have the correct date format
const existingAppointment = await appointmentModel.findOne({
  date: appointmentDate,  // Now this is guaranteed to be "YYYY-MM-DD" format
  time: appointmentTime,
  userName: clientName,
});

if (existingAppointment) {
  console.log(`⏭️ Row ${index + 1}: Duplicate found - ${clientName} on ${appointmentDate} at ${appointmentTime}`);
  skipped++;
  continue;
}

        // Create appointment
        await appointmentModel.create({
          userId: user._id,
          providerId: provider._id,
          providerName: provider.name,

          services: [{
            serviceId: service?._id || new mongoose.Types.ObjectId(),
            serviceTitle: serviceName,
            duration: duration,
            price: price,
            order: 1,
          }],
          serviceId: service?._id || new mongoose.Types.ObjectId(),
          serviceTitle: serviceName,

          userName: clientName,
          userEmail: clientEmail || user.email,
          userPhone: formatPhone(clientPhone) || user.phone || '',

          date: appointmentDate,
          time: appointmentTime,
          totalDuration: duration,

          clientNotes: notes,

          status: 'confirmed',
          isLongDuration: duration > 480,
          isMultiDay: duration >= 600,

          payment: {
            status: 'paid',
            amount: price,
            currency: 'CAD',
            paymentMethod: 'vagaro_import',
            paymentDate: new Date(),
          },

          bookedAt: new Date(),
          confirmedAt: new Date(),
          createdBy: 'vagaro_import',
          importedFrom: 'vagaro',
          importedAt: new Date(),
        });

        imported++;
        console.log(`✅ Row ${index + 1}: Appointment created for ${clientName}`);

      } catch (error) {
        console.error(`❌ Error processing row ${index + 1}:`, error.message);
        failed++;
        errors.push({
          row: index + 1,
          error: error.message,
          client: row['Title'] || row['Additional Title'] || 'Unknown',
        });
      }
    }

    console.log(`📊 Import complete: ${imported} imported, ${skipped} skipped, ${failed} failed`);

    // IMPORTANT: Set proper headers before sending response
    res.setHeader('Content-Type', 'application/json');

    // Return complete response
    return res.status(200).json({
      success: true,
      message: 'Import completed successfully',
      imported,
      skipped,
      failed,
      total: results.length,
      errors: errors.slice(0, 10), // Return first 10 errors
    });

  } catch (error) {
    console.error('❌ Critical import error:', error);
    
    // Ensure we always return valid JSON
    res.setHeader('Content-Type', 'application/json');
    
    return res.status(500).json({
      success: false,
      message: 'Import failed',
      error: error.message,
      imported: 0,
      skipped: 0,
      failed: 0,
      total: 0,
    });
  }
};



const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign(
        { email }, // store email in payload
        process.env.JWT_SECRET,
        { expiresIn: "1d" } // optional expiry
      );

      return res.json({ success: true, token });
    } else {
      return res.json({ success: false, message: "Invalid Credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get dashboard data for admin panel
const adminDashboard = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({}).sort({ createdAt: -1 });

    const dashData = {
      totalAppointments: appointments.length,
      completedAppointments: appointments.filter(
        (appointment) => appointment.status === 'completed'
      ).length,
      pendingAppointments: appointments.filter(
        (appointment) => appointment.status === 'pending'
      ).length,
      confirmedAppointments: appointments.filter(
        (appointment) => appointment.status === 'confirmed'
      ).length,
      cancelledAppointments: appointments.filter(
        (appointment) => appointment.status === 'cancelled'
      ).length,
      noShowAppointments: appointments.filter(
        (appointment) => appointment.status === 'no-show'
      ).length,
      paidAppointments: appointments.filter(
        (appointment) => appointment.payment?.status === 'paid'
      ).length,
      totalRevenue: appointments.filter(
        (appointment) => appointment.payment?.status === 'paid'
        ).reduce((acc, curr) => acc + curr.payment.amount, 0),  

      refundedAppointments: appointments.filter(
        (appointment) => appointment.payment?.status === 'refunded'
      ).length,
      latestAppointments: appointments.slice(0, 10), // show only latest 10
    };

    return res.status(200).json({ success: true, dashData });
  } catch (error) {
    console.error("Error in adminDashboard:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all appointments
const getAllAppointments = async (req, res) => {
  try {
    const { limit = 100 } = req.query; // Default limit to prevent overwhelming response

    const appointments = await appointmentModel
      .find({})
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .select("-__v");

    res.status(200).json({
      success: true,
      appointments
    });
  } catch (error) {
    console.error("Error fetching all appointments:", error);
    res.status(500).json({ success: false, message: "Failed to fetch appointments" });
  }
};

// Legacy function for backward compatibility
const getAllAppointment = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({});
    res.json({ success: true, appointments });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
// Complete appointment
const completeAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const appointment = await appointmentModel.findByIdAndUpdate(
      appointmentId,
      {
        status: 'completed',
        completedAt: new Date(),
      },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    res.status(200).json({
      success: true,
      message: "Appointment marked as completed",
      appointment,
    });
  } catch (error) {
    console.error("Error completing appointment:", error);
    res.status(500).json({ success: false, message: "Failed to complete appointment" });
  }
};
// Confirm appointment
const confirmAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const appointment = await appointmentModel.findByIdAndUpdate(
      appointmentId,
      {
        status: 'confirmed',
        confirmedAt: new Date(),
      },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    res.status(200).json({
      success: true,
      message: "Appointment confirmed",
      appointment,
    });
  } catch (error) {
    console.error("Error confirming appointment:", error);
    res.status(500).json({ success: false, message: "Failed to confirm appointment" });
  }
};

// Example route setup for admin
// Admin route (for adm// Updated Admin Cancel Appointment Backend Function
const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId, cancelledBy, reason } = req.body;
    
    // Validate required fields
    if (!appointmentId || !cancelledBy || !reason) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    // Fetch the appointment
    const appointment = await appointmentModel.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found"
      });
    }

    // Prevent duplicate cancellations
    if (appointment.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: "Appointment is already cancelled"
      });
    }

    // Prevent cancelling completed appointments
    if (appointment.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel completed appointments"
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
      reason: reason.trim(),
      refundEligible,
      cancellationFee: refundEligible ? 0 : Math.floor(appointment.payment?.amount * 0.1) || 0
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
        cancellation: appointment.cancellation
      }
    });

  } catch (error) {
    console.error("Error cancelling appointment:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to cancel appointment. Please try again."
    });
  }
};

// Mark appointment as no-show
const markNoShow = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const appointment = await appointmentModel.findByIdAndUpdate(
      appointmentId,
      {
        status: 'no-show',
      },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    res.status(200).json({
      success: true,
      message: "Appointment marked as no-show",
      appointment,
    });
  } catch (error) {
    console.error("Error marking no-show:", error);
    res.status(500).json({ success: false, message: "Failed to mark as no-show" });
  }
};

// Get appointments by status
const getAppointmentsByStatus = async (req, res) => {
  try {
    const { status, startDate, endDate, page = 1, limit = 20 } = req.query;

    // Build query object
    const query = {};
    
    if (status && status !== 'all') {
      query.status = status;
    }

    // Add date range if provided
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;

    const [appointments, total] = await Promise.all([
      appointmentModel
        .find(query)
        .sort({ date: -1, time: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .select("-__v"),
      appointmentModel.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      appointments,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        total,
        hasMore: skip + appointments.length < total
      }
    });
  } catch (error) {
    console.error("Error fetching appointments by status:", error);
    res.status(500).json({ success: false, message: "Failed to fetch appointments" });
  }
};

// Get completed appointments (legacy - for backward compatibility)
const getCompletedAppointments = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Build query object
    const query = {
      status: 'completed', // Updated to use status field
    };

    // Add date range if provided
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const appointments = await appointmentModel
      .find(query)
      .sort({ date: -1, time: -1 }) // Sort by date and time, most recent first
      .select("-__v"); // Exclude version key

    res.status(200).json({ success: true, appointments });
  } catch (error) {
    console.error("Error fetching completed appointments:", error);
    res.status(500).json({ success: false, message: "Failed to fetch completed appointments" });
  }
};

// Payment status update
const updatePaymentStatus = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { status, transactionId, paymentMethod, amount } = req.body;

    const updateData = {
      'payment.status': status,
      'payment.paymentDate': status === 'paid' ? new Date() : undefined,
    };

    if (transactionId) updateData['payment.transactionId'] = transactionId;
    if (paymentMethod) updateData['payment.paymentMethod'] = paymentMethod;
    if (amount) updateData['payment.amount'] = amount;

    const appointment = await appointmentModel.findByIdAndUpdate(
      appointmentId,
      updateData,
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    res.status(200).json({
      success: true,
      message: "Payment status updated",
      appointment,
    });
  } catch (error) {
    console.error("Error updating payment status:", error);
    res.status(500).json({ success: false, message: "Failed to update payment status" });
  }
};

// SERVICE MANAGEMENT FUNCTIONS

// Get all services for admin panel
const allServices = async (req, res) => {
  try {
    const services = await serviceModel.find({}).sort({ createdAt: -1 });
    res.json({ success: true, services });
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).json({ success: false, error: "Failed to fetch services" });
  }
};

// Add Category
const addCategory = async (req, res) => {
  try {
    const { title, description, isActive } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, error: "Title is required" });
    }

    const categoryData = {
      title,
      description,
      isActive: isActive === "true",
      isCategory: true,
      parentService: null,
    };

    // Handle image upload if present
    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'palmsbeautystore/services',
        });

        categoryData.image = result.secure_url;
        categoryData.imagePublicId = result.public_id;

        // Delete local file
        fs.unlinkSync(req.file.path);
      } catch (uploadError) {
        console.error("Error uploading image:", uploadError);
        return res.status(500).json({ success: false, error: "Failed to upload image" });
      }
    }

    const category = new serviceModel(categoryData);
    await category.save();

    res.status(201).json({ 
      success: true, 
      message: "Category created successfully", 
      category 
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Update Category
const updateCategory = async (req, res) => {
  try {
    const { title, description, isActive } = req.body;
    const categoryId = req.params.id;

    const updateData = {
      title,
      description,
      isActive: isActive === "true",
    };

    // Handle image upload if present
    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'palmsbeautystore/services',
        });

        updateData.image = result.secure_url;
        updateData.imagePublicId = result.public_id;

        // Delete local file
        fs.unlinkSync(req.file.path);
      } catch (uploadError) {
        console.error("Error uploading image:", uploadError);
        return res.status(500).json({ success: false, error: "Failed to upload image" });
      }
    }

    const updated = await serviceModel.findOneAndUpdate(
      { _id: categoryId, isCategory: true },
      updateData,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    res.json({ 
      success: true, 
      message: "Category updated successfully", 
      category: updated 
    });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete Category
const deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;

    // Delete sub-services first
    await serviceModel.deleteMany({ parentService: categoryId });

    const deleted = await serviceModel.findOneAndDelete({
      _id: categoryId,
      isCategory: true,
    });

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    // Delete image from Cloudinary if exists
    if (deleted.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(deleted.imagePublicId);
      } catch (deleteError) {
        console.error("Error deleting image:", deleteError);
      }
    }

    res.json({ 
      success: true, 
      message: "Category and its sub-services deleted successfully" 
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// Create new service
const addService = async (req, res) => {
  try {
    const {
      title,
      description,
      duration,
      price,
      isActive,
      isCategory,
      parentService,
    } = req.body;

    const serviceData = {
      title,
      description,
      duration,
      price,
      isActive: isActive === "true",
      isCategory: isCategory === "true",
      parentService: parentService || null,
    };

    // Handle image upload if present
    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'palmsbeautystore/services',
        });

        serviceData.image = result.secure_url;
        serviceData.imagePublicId = result.public_id;

        // Delete local file
        fs.unlinkSync(req.file.path);
      } catch (uploadError) {
        console.error("Error uploading image:", uploadError);
        return res.status(500).json({ success: false, error: "Failed to upload image" });
      }
    }

    const service = new serviceModel(serviceData);
    await service.save();
    
    res.status(201).json({ success: true, service });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Update service
const updateService = async (req, res) => {
  try {
    const service = await serviceModel.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }

    const updateData = { ...req.body };

    // Handle image upload if present
    if (req.file) {
      try {
        // Delete old image from Cloudinary if exists
        if (service.imagePublicId) {
          await cloudinary.uploader.destroy(service.imagePublicId);
        }

        // Upload new image
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'palmsbeautystore/services',
        });

        updateData.image = result.secure_url;
        updateData.imagePublicId = result.public_id;

        // Delete local file
        fs.unlinkSync(req.file.path);
      } catch (uploadError) {
        console.error("Error uploading image:", uploadError);
        return res.status(500).json({ success: false, error: "Failed to upload image" });
      }
    }

    // Update service with new data
    const updatedService = await serviceModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json({ success: true, service: updatedService });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error updating service",
      error: err.message,
    });
  }
};

// Service Status Toggle
const toggleServiceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const service = await serviceModel.findByIdAndUpdate(
      id,
      { isActive, updatedAt: new Date() },
      { new: true }
    );

    if (!service) {
      return res.status(404).json({ success: false, error: "Service not found" });
    }

    res.json({ success: true, service });
  } catch (error) {
    console.error("Error toggling service status:", error);
    res.status(500).json({ success: false, error: "Failed to toggle service status" });
  }
};

// Delete Service
const deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await serviceModel.findById(id);
    if (!service) {
      return res.status(404).json({ success: false, error: "Service not found" });
    }

    // Delete image from Cloudinary if exists
    if (service.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(service.imagePublicId);
      } catch (deleteError) {
        console.error("Error deleting image:", deleteError);
      }
    }

    await serviceModel.findByIdAndDelete(id);

    res.json({ success: true, message: "Service deleted successfully" });
  } catch (error) {
    console.error("Error deleting service:", error);
    res.status(500).json({ success: false, error: "Failed to delete service" });
  }
};

// Delete Service Image only
const deleteServiceImage = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await serviceModel.findById(id);
    if (!service) {
      return res.status(404).json({ success: false, error: "Service not found" });
    }

    // Delete image from Cloudinary if exists
    if (service.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(service.imagePublicId);
      } catch (deleteError) {
        console.error("Error deleting image:", deleteError);
      }
    }

    // Remove image fields from service
    service.image = undefined;
    service.imagePublicId = undefined;
    service.updatedAt = new Date();
    await service.save();

    res.json({ 
      success: true, 
      message: "Image deleted successfully", 
      service 
    });
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({ success: false, error: "Failed to delete image" });
  }
};
// Admin create appointment (no payment required)
const createAppointmentByAdmin = async (req, res) => {
  try {
    const {
      services,
      date,
      time,
      providerId,
      userName,
      userEmail,
      userPhone,
      clientNotes,
      paymentStatus = "pending",
      paymentAmount,
      consentForm = {}
    } = req.body;

    // Validation
    if (!services || !Array.isArray(services) || services.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: "At least one service is required" 
      });
    }

    if (!date || !time) {
      return res.status(400).json({ 
        success: false, 
        message: "Date and time are required" 
      });
    }

    if (!providerId) {
      return res.status(400).json({ 
        success: false, 
        message: "Provider is required" 
      });
    }

    if (!userName || !userEmail) {
      return res.status(400).json({ 
        success: false, 
        message: "Customer name and email are required" 
      });
    }

    // Validate provider
    const provider = await providerModel.findById(providerId);
    if (!provider || !provider.isActive) {
      return res.status(404).json({ 
        success: false, 
        message: "Provider not available" 
      });
    }

    // Use your existing date utility functions for consistency
    const dateObj = parseDateInBusinessTz(date);
    const dateStr = formatDateForDisplay(dateObj);

    // Calculate totals using your existing function
    const { calculatedDuration, calculatedAmount, processedServices } = 
      calculateServiceTotals(services);

    // ✅ Use your robust conflict detection (same as regular booking)
    const existingAppointments = await appointmentModel
      .find({
        providerId,
        date: dateStr,
        status: { $in: ["pending", "confirmed"] },
      })
      .lean();

    // Check for conflicts using your existing function
    for (const apt of existingAppointments) {
      const aptDuration = apt.totalDuration || apt.duration || 90;
      
      if (hasTimeConflictStrict(time, calculatedDuration, apt.time, aptDuration)) {
        return res.status(409).json({
          success: false,
          message: "This time slot conflicts with an existing appointment.",
          conflictingTime: apt.time,
          existingAppointment: {
            time: apt.time,
            duration: aptDuration,
            client: apt.userName
          }
        });
      }
    }

    // ✅ Check provider availability using your existing function
    const availability = await checkRealTimeAvailability(
      dateStr,
      time,
      calculatedDuration,
      providerId
    );

    if (!availability.available) {
      return res.status(409).json({
        success: false,
        message: "Time slot not available",
        suggestedSlots: availability.suggestedSlots || []
      });
    }

    // Create appointment
    const newAppointment = await appointmentModel.create({
      // Required fields from your schema
      userId: "admin-created", // or generate a temp user ID
      providerId: providerId,
      providerName: provider.name,
      
      // Services
      services: processedServices,
      serviceId: processedServices[0].serviceId,
      serviceTitle: processedServices.length > 1 
        ? `${processedServices[0].serviceTitle} + ${processedServices.length - 1} more`
        : processedServices[0].serviceTitle,
      
      // Client information
      userName: userName,
      userEmail: userEmail,
      userPhone: userPhone || "",
      
      // Appointment timing
      date: dateStr, // Store as "YYYY-MM-DD" string (consistent with your schema)
      time: time,
      totalDuration: calculatedDuration,
      
      // Client notes and consent
      clientNotes: clientNotes || "",
      consentForm: {
        healthConditions: consentForm.healthConditions || "",
        allergies: consentForm.allergies || "",
        consentToTreatment: true, // Admin bookings assume consent
        submittedAt: new Date(),
      },
      
      // Status and flags
      status: "confirmed",
      isLongDuration: calculatedDuration > 480,
      isMultiDay: calculatedDuration >= 600,
      
      // Timestamps
      bookedAt: new Date(),
      confirmedAt: new Date(),
      
      // Payment information
      payment: {
        status: paymentStatus,
        amount: paymentAmount || calculatedAmount,
        currency: "CAD",
        paymentDate: paymentStatus === "paid" ? new Date() : null,
        paymentMethod: paymentStatus === "paid" ? "admin_cash" : null,
      },
      
      // Admin tracking
      createdBy: "admin",
    });

    console.log("✅ Admin appointment created successfully:", {
      id: newAppointment._id,
      date: newAppointment.date,
      time: newAppointment.time,
      provider: newAppointment.providerName,
      client: newAppointment.userName
    });

    return res.status(201).json({
      success: true,
      message: "Appointment created successfully",
      appointment: {
        _id: newAppointment._id,
        date: newAppointment.date,
        time: newAppointment.time,
        status: newAppointment.status,
        providerName: newAppointment.providerName,
        userName: newAppointment.userName,
        services: newAppointment.services,
        totalDuration: newAppointment.totalDuration,
        payment: newAppointment.payment
      },
    });

  } catch (error) {
    console.error("❌ Error creating appointment by admin:", error);
    
    // Handle specific error types
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: Object.values(error.errors).map(e => e.message)
      });
    }
    
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Duplicate appointment detected"
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create appointment",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export {
  adminLogin,
  adminDashboard,
  getAllAppointments,
  getAllAppointment, // Legacy support
  completeAppointment,
  confirmAppointment,
  cancelAppointment,
  markNoShow,
  getAppointmentsByStatus,
  getCompletedAppointments,
  updatePaymentStatus,
  allServices,
  addService,
  updateService,
  toggleServiceStatus,
  deleteService,
  deleteServiceImage,
  addCategory,
  updateCategory,
  deleteCategory,
  createAppointmentByAdmin,
  importVagaroAppointments,
  VagaroUpload
};