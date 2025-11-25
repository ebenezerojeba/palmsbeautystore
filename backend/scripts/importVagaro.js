// ================================================
// VAGARO APPOINTMENT IMPORT SCRIPT
// File: scripts/importVagaroAppointments.js
// ================================================

import fs from 'fs';
import csv from 'csv-parser';
import appointmentModel from '../models/appointment.js';
import providerModel from '../models/providerModel.js';
import serviceModel from '../models/serviceModel.js';
import userModel from '../models/userModel.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { formatDateForDisplay, parseDateInBusinessTz } from '../utils/dateUtils.js';

dotenv.config();

// ================================================
// CONFIGURATION - ADJUST THESE TO MATCH YOUR DATA
// ================================================

// Map Vagaro service names to your service IDs
const SERVICE_MAPPING = {
  'Deep Tissue Massage': 'your_service_id_here',
  'Swedish Massage': 'your_service_id_here',
  'Hot Stone Massage': 'your_service_id_here',
  'Facial Treatment': 'your_service_id_here',
  // Add all your services here
};

// Map Vagaro provider names to your provider IDs
const PROVIDER_MAPPING = {
  'Jane Smith': 'your_provider_id_here',
  'John Doe': 'your_provider_id_here',
  // Add all your providers here
};

// Map Vagaro status to your system status
const STATUS_MAPPING = {
  'Confirmed': 'confirmed',
  'Pending': 'pending',
  'Booked': 'confirmed',
  'Completed': 'completed',
  'Cancelled': 'cancelled',
  'No Show': 'no-show',
};

// ================================================
// HELPER FUNCTIONS
// ================================================

/**
 * Parse date from various formats
 */
const parseDate = (dateStr) => {
  // Try MM/DD/YYYY format (common in Vagaro)
  const parts = dateStr.split('/');
  if (parts.length === 3) {
    const [month, day, year] = parts;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  
  // Try YYYY-MM-DD format
  if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return dateStr;
  }
  
  // Try parsing as Date object
  const date = new Date(dateStr);
  if (!isNaN(date.getTime())) {
    return formatDateForDisplay(date);
  }
  
  throw new Error(`Unable to parse date: ${dateStr}`);
};

/**
 * Parse time from various formats to 24-hour HH:MM
 */
const parseTime = (timeStr) => {
  // Remove spaces
  timeStr = timeStr.trim();
  
  // Handle 12-hour format with AM/PM
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
  
  // Already in 24-hour format
  const timeMatch = timeStr.match(/(\d{1,2}):(\d{2})/);
  if (timeMatch) {
    const hours = timeMatch[1].padStart(2, '0');
    const minutes = timeMatch[2];
    return `${hours}:${minutes}`;
  }
  
  throw new Error(`Unable to parse time: ${timeStr}`);
};

/**
 * Format phone number
 */
const formatPhone = (phone) => {
  if (!phone) return '';
  
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '');
  
  // Format as (XXX) XXX-XXXX if 10 digits
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  return phone; // Return as-is if not standard format
};

/**
 * Find or create user
 */
const findOrCreateUser = async (name, email, phone) => {
  // Try to find existing user by email
  if (email) {
    let user = await userModel.findOne({ email: email.toLowerCase().trim() });
    if (user) {
      console.log(`✓ Found existing user: ${email}`);
      return user;
    }
  }
  
  // Try to find by phone
  if (phone) {
    const formattedPhone = formatPhone(phone);
    let user = await userModel.findOne({ phone: formattedPhone });
    if (user) {
      console.log(`✓ Found existing user by phone: ${formattedPhone}`);
      return user;
    }
  }
  
  // Create new user
  try {
    const newUser = await userModel.create({
      name: name || 'Imported Client',
      email: email?.toLowerCase().trim() || `imported_${Date.now()}@temp.com`,
      phone: formatPhone(phone) || '',
      password: Math.random().toString(36).slice(-8), // Random temp password
      isImported: true, // Flag to identify imported users
    });
    
    console.log(`✓ Created new user: ${newUser.email}`);
    return newUser;
  } catch (error) {
    console.error(`✗ Error creating user for ${name}:`, error.message);
    return null;
  }
};

/**
 * Get service info by name
 */
const getServiceInfo = async (serviceName) => {
  // Check mapping first
  if (SERVICE_MAPPING[serviceName]) {
    const service = await serviceModel.findById(SERVICE_MAPPING[serviceName]);
    if (service) return service;
  }
  
  // Try to find by name (case-insensitive)
  const service = await serviceModel.findOne({
    title: new RegExp(`^${serviceName}$`, 'i'),
  });
  
  if (service) {
    console.log(`✓ Found service: ${serviceName} -> ${service.title}`);
    return service;
  }
  
  console.warn(`⚠ Service not found: ${serviceName} - Using default`);
  return null;
};

/**
 * Get provider info by name
 */
const getProviderInfo = async (providerName) => {
  // Check mapping first
  if (PROVIDER_MAPPING[providerName]) {
    const provider = await providerModel.findById(PROVIDER_MAPPING[providerName]);
    if (provider) return provider;
  }
  
  // Try to find by name (case-insensitive)
  const provider = await providerModel.findOne({
    name: new RegExp(`^${providerName}$`, 'i'),
    isActive: true,
  });
  
  if (provider) {
    console.log(`✓ Found provider: ${providerName} -> ${provider.name}`);
    return provider;
  }
  
  console.warn(`⚠ Provider not found: ${providerName}`);
  return null;
};

// ================================================
// MAIN IMPORT FUNCTION
// ================================================

/**
 * Import appointments from CSV
 */
const importAppointments = async (csvFilePath) => {
  console.log('\n📥 Starting Vagaro Import...\n');
  
  // Connect to MongoDB
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB\n');
  } catch (error) {
    console.error('✗ MongoDB connection error:', error);
    process.exit(1);
  }
  
  const results = [];
  const errors = [];
  let rowIndex = 0;
  
  return new Promise((resolve, reject) => {
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (row) => {
        results.push({ row, index: rowIndex++ });
      })
      .on('end', async () => {
        console.log(`📋 Found ${results.length} appointments to import\n`);
        
        let imported = 0;
        let skipped = 0;
        let failed = 0;
        
        for (const { row, index } of results) {
          try {
            console.log(`\n--- Processing Row ${index + 1}/${results.length} ---`);
            
            // Extract data from CSV (adjust column names to match your CSV)
            const clientName = row['Client Name'] || row['Customer Name'] || row['Name'];
            const clientEmail = row['Email'] || row['Client Email'];
            const clientPhone = row['Phone'] || row['Client Phone'];
            const serviceName = row['Service'] || row['Service Name'];
            const providerName = row['Provider'] || row['Staff'] || row['Therapist'];
            const dateStr = row['Date'] || row['Appointment Date'];
            const timeStr = row['Time'] || row['Appointment Time'];
            const durationStr = row['Duration'] || '90';
            const priceStr = row['Price'] || row['Amount'] || '0';
            const status = row['Status'] || 'Confirmed';
            const notes = row['Notes'] || row['Client Notes'] || '';
            
            // Validation
            if (!clientName || !dateStr || !timeStr) {
              console.log(`⚠ Skipping row ${index + 1}: Missing required data`);
              skipped++;
              continue;
            }
            
            // Parse date and time
            const appointmentDate = parseDate(dateStr);
            const appointmentTime = parseTime(timeStr);
            const duration = parseInt(durationStr) || 90;
            const price = parseFloat(priceStr) || 0;
            
            console.log(`📅 Date: ${appointmentDate} ${appointmentTime}`);
            console.log(`👤 Client: ${clientName} (${clientEmail})`);
            console.log(`💆 Service: ${serviceName}`);
            console.log(`👨‍⚕️ Provider: ${providerName}`);
            
            // Find or create user
            const user = await findOrCreateUser(clientName, clientEmail, clientPhone);
            if (!user) {
              console.log(`✗ Failed to create user for ${clientName}`);
              failed++;
              errors.push({ row: index + 1, error: 'User creation failed', data: row });
              continue;
            }
            
            // Get service info
            const service = await getServiceInfo(serviceName);
            
            // Get provider info
            const provider = await getProviderInfo(providerName);
            if (!provider) {
              // Get first available provider as fallback
              const fallbackProvider = await providerModel.findOne({ isActive: true });
              if (!fallbackProvider) {
                console.log(`✗ No provider available`);
                failed++;
                errors.push({ row: index + 1, error: 'No provider found', data: row });
                continue;
              }
              console.log(`⚠ Using fallback provider: ${fallbackProvider.name}`);
            }
            
            const selectedProvider = provider || await providerModel.findOne({ isActive: true });
            
            // Check if appointment already exists (prevent duplicates)
            const existingAppointment = await appointmentModel.findOne({
              userEmail: clientEmail,
              date: appointmentDate,
              time: appointmentTime,
            });
            
            if (existingAppointment) {
              console.log(`⚠ Appointment already exists - skipping`);
              skipped++;
              continue;
            }
            
            // Create appointment
            const appointmentData = {
              userId: user._id,
              providerId: selectedProvider._id,
              providerName: selectedProvider.name,
              
              // Service info
              services: [{
                serviceId: service?._id || new mongoose.Types.ObjectId(),
                serviceTitle: serviceName,
                duration: duration,
                price: price,
                order: 1,
              }],
              serviceId: service?._id || new mongoose.Types.ObjectId(),
              serviceTitle: serviceName,
              
              // Client info
              userName: clientName,
              userEmail: clientEmail || user.email,
              userPhone: formatPhone(clientPhone) || user.phone || '',
              
              // Date & time
              date: appointmentDate,
              time: appointmentTime,
              totalDuration: duration,
              
              // Notes
              clientNotes: notes,
              
              // Status
              status: STATUS_MAPPING[status] || 'confirmed',
              isLongDuration: duration > 480,
              isMultiDay: duration >= 600,
              
              // Payment (mark as paid if from Vagaro)
              payment: {
                status: 'paid',
                amount: price,
                currency: 'CAD',
                paymentMethod: 'vagaro_import',
                paymentDate: new Date(),
              },
              
              // Metadata
              bookedAt: new Date(),
              confirmedAt: new Date(),
              createdBy: 'vagaro_import',
              importedFrom: 'vagaro',
              importedAt: new Date(),
            };
            
            const newAppointment = await appointmentModel.create(appointmentData);
            
            console.log(`✅ Successfully imported appointment ${newAppointment._id}`);
            imported++;
            
          } catch (error) {
            console.error(`✗ Error processing row ${index + 1}:`, error.message);
            failed++;
            errors.push({ row: index + 1, error: error.message, data: row });
          }
        }
        
        // Summary
        console.log('\n' + '='.repeat(50));
        console.log('📊 IMPORT SUMMARY');
        console.log('='.repeat(50));
        console.log(`✅ Successfully imported: ${imported}`);
        console.log(`⚠  Skipped: ${skipped}`);
        console.log(`✗  Failed: ${failed}`);
        console.log(`📋 Total processed: ${results.length}`);
        console.log('='.repeat(50) + '\n');
        
        if (errors.length > 0) {
          console.log('❌ Errors encountered:');
          errors.forEach((err, i) => {
            console.log(`\n${i + 1}. Row ${err.row}: ${err.error}`);
            console.log(`   Data:`, JSON.stringify(err.data, null, 2));
          });
        }
        
        // Disconnect
        await mongoose.disconnect();
        console.log('\n✓ Disconnected from MongoDB');
        
        resolve({ imported, skipped, failed, total: results.length });
      })
      .on('error', (error) => {
        console.error('✗ Error reading CSV:', error);
        reject(error);
      });
  });
};

// ================================================
// RUN IMPORT
// ================================================

// Get CSV file path from command line argument
const csvFilePath = process.argv[2];

if (!csvFilePath) {
  console.error('❌ Please provide CSV file path as argument');
  console.log('Usage: node importVagaroAppointments.js path/to/vagaro-export.csv');
  process.exit(1);
}

if (!fs.existsSync(csvFilePath)) {
  console.error(`❌ File not found: ${csvFilePath}`);
  process.exit(1);
}

// Run the import
importAppointments(csvFilePath)
  .then((result) => {
    console.log('\n✅ Import completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Import failed:', error);
    process.exit(1);
  });

// ================================================
// EXPORT FOR USE AS MODULE
// ================================================

export { importAppointments, parseDate, parseTime, formatPhone };