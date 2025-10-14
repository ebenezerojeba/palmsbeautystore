import mongoose from "mongoose";
import appointmentModel from "../models/appointment.js";
import providerModel from "../models/providerModel.js";
import serviceModel from "../models/serviceModel.js";
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier'

// Get all providers
export const getProviders = async (req, res) => {
  try {
    const { serviceId, date } = req.query;
    let query = { isActive: true };
    
    // if (serviceId) {
    //   query.services = serviceId;
    // }
    if (serviceId) {
  query.services = { $in: [new mongoose.Types.ObjectId(serviceId)] };
}
    
    const providers = await providerModel.find(query)
      .select('name email phone bio profileImage services rating workingHours isActive')
      .populate('services', 'title duration price description')
      .sort({ name: 1 });
    
    // If the date is provided, check availability for each provider
    if (date) {
      const availabilityPromises = providers.map(async (provider) => {
        const available = await checkProviderAvailability(provider._id, date);
        return { ...provider.toObject(), available };
      });
      
      const providersWithAvailability = await Promise.all(availabilityPromises);
      return res.status(200).json({ success: true, providers: providersWithAvailability });
    }
    
    res.status(200).json({ success: true, providers });
  } catch (error) {
    console.error("Error fetching providers:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch providers",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get provider by ID
export const getProvider = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Requested provider ID:", id); 
    
    // Debug: Check if any provider exists
    const providerCount = await providerModel.countDocuments();
    console.log("Total providers in database:", providerCount);
    
    // Debug: Try to find provider without populate first
    const basicProvider = await providerModel.findById(id);
    console.log("Basic provider lookup:", basicProvider);
    
    const provider = await providerModel.findById(id)
      .populate('services', 'title duration price description');
    
    console.log("Found provider:", provider);
    
    if (!provider) {
      // Check if services reference this provider ID
      const servicesWithThisProvider = await serviceModel.find({ providerId: id });
      console.log("Services referencing this provider:", servicesWithThisProvider.length);
      
      return res.status(404).json({ success: false, message: "Provider not found" });
    }
    
    // Rest of your code...
  } catch (error) {
    console.error("Error fetching provider:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch provider",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Check provider availability for a specific date
export const checkProviderAvailability = async (providerId, date) => {
  try {
    const provider = await providerModel.findById(providerId);
    if (!provider || !provider.isActive) return false;

    const checkDate = new Date(date);
    const dayOfWeek = checkDate.getDay();

    // Vacation
    const isOnVacation = provider.vacationDays.some(vacation =>
      checkDate >= vacation.startDate && checkDate <= vacation.endDate
    );
    if (isOnVacation) return false;

    // Working day check
    const workingDay = provider.workingHours.find(
      wh => wh.dayOfWeek === dayOfWeek && wh.isWorking
    );
    if (!workingDay) return false;

    // Full-day break check
    const hasFullDayBreak = provider.breaks.some(breakTime => {
      return new Date(breakTime.date).toDateString() === checkDate.toDateString() &&
             breakTime.startTime === "00:00" &&
             breakTime.endTime === "23:59";
    });

    return !hasFullDayBreak;
  } catch (error) {
    console.error("Error checking provider availability:", error);
    return false;
  }
};


// Get provider schedule
export const getProviderSchedule = async (req, res) => {
  try {
    const { providerId } = req.params;
    const { startDate, endDate } = req.query;
    
    if (!providerId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, message: "Invalid provider ID format" });
    }
    
    const provider = await providerModel.findById(providerId);
    if (!provider) {
      return res.status(404).json({ success: false, message: "Provider not found" });
    }
    
    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ success: false, message: "Invalid date format" });
    }
    
    // Get appointments for the date range
    const appointments = await appointmentModel.find({
      providerId,
      date: { 
        $gte: start, 
        $lte: end 
      }
    })
    .populate('serviceId', 'name duration')
    .populate('userId', 'name email')
    .sort({ date: 1, time: 1 });
    
    res.status(200).json({
      success: true,
      schedule: {
        workingHours: provider.workingHours || [],
        breaks: provider.breaks.filter(breakTime => {
          const breakDate = new Date(breakTime.date);
          return breakDate >= start && breakDate <= end;
        }),
        vacationDays: provider.vacationDays.filter(vacation => {
          return vacation.endDate >= start && vacation.startDate <= end;
        }),
        appointments: appointments || []
      }
    });
  } catch (error) {
    console.error("Error fetching provider schedule:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch provider schedule",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update provider working hours
export const updateProviderWorkingHours = async (req, res) => {
  try {
    const { providerId } = req.params;
    const { workingHours } = req.body;
    
    if (!providerId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, message: "Invalid provider ID format" });
    }
    
    // Validate working hours format
    if (!Array.isArray(workingHours)) {
      return res.status(400).json({ success: false, message: "Working hours must be an array" });
    }
    
    // Validate each working hour entry
    for (const wh of workingHours) {
      if (typeof wh.dayOfWeek !== 'number' || wh.dayOfWeek < 0 || wh.dayOfWeek > 6) {
        return res.status(400).json({ success: false, message: "Invalid dayOfWeek value" });
      }
      
      if (wh.isWorking && (!wh.startTime || !wh.endTime)) {
        return res.status(400).json({ success: false, message: "Start time and end time required for working days" });
      }
      
      // Validate time format (HH:MM)
      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (wh.isWorking && (!timeRegex.test(wh.startTime) || !timeRegex.test(wh.endTime))) {
        return res.status(400).json({ success: false, message: "Invalid time format. Use HH:MM format" });
      }
    }
    
    const provider = await providerModel.findByIdAndUpdate(
      providerId,
      { workingHours },
      { new: true, runValidators: true }
    ).populate('services', 'title duration price');
    
    if (!provider) {
      return res.status(404).json({ success: false, message: "Provider not found" });
    }
    
    res.status(200).json({ success: true, provider });
  } catch (error) {
    console.error("Error updating provider working hours:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to update working hours",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get services with their providers
export const ServicesWithProvider = async (req, res) => {
  try {
    const services = await serviceModel.find({})
      .populate('providers', 'name email isActive')
      .sort({ name: 1 });
    
    res.json({ success: true, services });
  } catch (error) {
    console.error("Error fetching services with providers:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch services with providers",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


export const addProviderToService = async (req, res) => {
  try {
    const { serviceId, providerId } = req.params;
    
    console.log('Received request to add provider to service:', { serviceId, providerId }); // Debug log

    // Validate ObjectId format
    if (!serviceId.match(/^[0-9a-fA-F]{24}$/) || !providerId.match(/^[0-9a-fA-F]{24}$/)) {
      console.error('Invalid ID format:', { serviceId, providerId });
      return res.status(400).json({ 
        success: false, 
        message: "Invalid ID format" 
      });
    }

    const [service, provider] = await Promise.all([
      serviceModel.findById(serviceId),
      providerModel.findById(providerId)
    ]);

    if (!service) {
      console.error('Service not found:', serviceId);
      return res.status(404).json({ 
        success: false, 
        message: "Service not found" 
      });
    }

    if (!provider) {
      console.error('Provider not found:', providerId);
      return res.status(404).json({ 
        success: false, 
        message: "Provider not found" 
      });
    }

    // Check if already associated
    const isServiceAlreadyAdded = provider.services.some(s => s.toString() === serviceId);
    const isProviderAlreadyAdded = service.providers && service.providers.some(p => p.toString() === providerId);

    if (isServiceAlreadyAdded && isProviderAlreadyAdded) {
      return res.status(400).json({ 
        success: false, 
        message: "Provider is already assigned to this service" 
      });
    }

    // Use transactions for data consistency
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Add provider to service if not already added
      if (!isProviderAlreadyAdded) {
        if (!service.providers) {
          service.providers = [];
        }
        service.providers.push(providerId);
        await service.save({ session });
        console.log('Added provider to service');
      }

      // Add service to provider if not already added
      if (!isServiceAlreadyAdded) {
        provider.services.push(serviceId);
        await provider.save({ session });
        console.log('Added service to provider');
      }

      await session.commitTransaction();
      console.log('Transaction committed successfully');
      
      res.json({ 
        success: true, 
        message: 'Provider added to service successfully',
        data: {
          service: {
            _id: service._id,
            name: service.name
          },
          provider: {
            _id: provider._id,
            name: provider.name
          }
        }
      });
    } catch (error) {
      await session.abortTransaction();
      console.error('Transaction aborted:', error);
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error("Error adding provider to service:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to add provider to service",
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// New backend endpoint for batch adding services
export const addMultipleProvidersToService = async (req, res) => {
  try {
    const { providerId } = req.params;
    const { serviceIds } = req.body;
    
    if (!Array.isArray(serviceIds) || serviceIds.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: "Service IDs array is required" 
      });
    }

    const provider = await providerModel.findById(providerId);
    if (!provider) {
      return res.status(404).json({ 
        success: false, 
        message: "Provider not found" 
      });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      for (const serviceId of serviceIds) {
        if (!serviceId.match(/^[0-9a-fA-F]{24}$/)) continue;

        const service = await serviceModel.findById(serviceId);
        if (!service) continue;

        // Check if already associated
        const isServiceAlreadyAdded = provider.services.some(s => s.toString() === serviceId);
        const isProviderAlreadyAdded = service.providers && service.providers.some(p => p.toString() === providerId);

        if (!isServiceAlreadyAdded) {
          provider.services.push(serviceId);
        }

        if (!isProviderAlreadyAdded) {
          if (!service.providers) service.providers = [];
          service.providers.push(providerId);
          await service.save({ session });
        }
      }

      await provider.save({ session });
      await session.commitTransaction();
      
      res.json({ 
        success: true, 
        message: `Successfully added ${serviceIds.length} services to provider`,
        data: { addedCount: serviceIds.length }
      });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error("Error adding multiple services to provider:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to add services to provider",
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};


// Remove provider from a service
export const removeProviderFromService = async (req, res) => {
  try {
    const { serviceId, providerId } = req.params;

    // Validate ObjectId format
    if (!serviceId.match(/^[0-9a-fA-F]{24}$/) || !providerId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, message: "Invalid ID format" });
    }

    const [service, provider] = await Promise.all([
      serviceModel.findById(serviceId),
      providerModel.findById(providerId)
    ]);

    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }
    
    if (!provider) {
      return res.status(404).json({ success: false, message: "Provider not found" });
    }

    // Use transactions for data consistency
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      // Remove provider from service
      if (service.providers) {
        service.providers = service.providers.filter(id => id.toString() !== providerId);
        await service.save({ session });
      }

      // Remove service from provider
      provider.services = provider.services.filter(id => id.toString() !== serviceId);
      await provider.save({ session });
      
      await session.commitTransaction();
      
      res.json({ success: true, message: 'Provider removed from service successfully' });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error("Error removing provider from service:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to remove provider from service",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


// Helper function to upload buffer to Cloudinary
const uploadToCloudinary = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "image",
        folder: "providers", // Organize in providers folder
        transformation: [
          { width: 400, height: 400, crop: "fill", gravity: "face" },
          { quality: "auto:best" },
          { fetch_format: "auto" }
        ],
        ...options
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
    
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

// Helper function to delete image from Cloudinary
const deleteFromCloudinary = async (imageUrl) => {
  try {
    if (imageUrl) {
      // Extract public_id from the URL
      const urlParts = imageUrl.split('/');
      const fileWithExtension = urlParts[urlParts.length - 1];
      const publicId = `providers/${fileWithExtension.split('.')[0]}`;
      
      await cloudinary.uploader.destroy(publicId);
      console.log(`Deleted old image: ${publicId}`);
    }
  } catch (error) {
    console.warn('Could not delete old image from Cloudinary:', error.message);
  }
};





// export const createProvider = async (req, res) => {
//   try {
//     const {
//       name,
//       email,
//       phone,
//       bio,
//       bookingBuffer
//     } = req.body;

//     // Validate required fields
//     if (!name || !email) {
//       return res.status(400).json({ 
//         success: false, 
//         message: "Name and email are required" 
//       });
//     }

//     // Handle services array from FormData
//     let services = [];
//     if (req.body.services) {
//       try {
//         services = typeof req.body.services === 'string' 
//           ? JSON.parse(req.body.services)
//           : Array.isArray(req.body.services) 
//             ? req.body.services 
//             : [req.body.services];
//       } catch (error) {
//         console.warn('Services parsing error:', error.message);
//         services = [];
//       }
//     } else if (req.body['services[]']) {
//       services = Array.isArray(req.body['services[]']) 
//         ? req.body['services[]'] 
//         : [req.body['services[]']];
//     }
    
//     // Handle working hours
//     let workingHours = [];
//     if (req.body.workingHours) {
//       try {
//         workingHours = typeof req.body.workingHours === 'string'
//           ? JSON.parse(req.body.workingHours)
//           : req.body.workingHours;
//       } catch (error) {
//         console.warn('Working hours parsing error:', error.message);
//         workingHours = [];
//       }
//     }

//     // Check if provider already exists
//     const existingProvider = await providerModel.findOne({ 
//       email: email.toLowerCase() 
//     });
    
//     if (existingProvider) {
//       return res.status(400).json({ 
//         success: false, 
//         message: "Provider with this email already exists" 
//       });
//     }

//     // Handle image upload to Cloudinary
//   let profileImageUrl = null;
//     if (req.file) {
//       try {
//         console.log('Uploading image to Cloudinary...');
//         const uploadResult = await uploadToCloudinary(req.file.buffer, {
//           folder: 'providers',
//           public_id: `provider_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
//           resource_type: 'image'
//         });
//         profileImageUrl = uploadResult.secure_url;
//         console.log('Image uploaded successfully:', profileImageUrl);
//       } catch (uploadError) {
//         console.error('Cloudinary upload error:', uploadError);
//         return res.status(400).json({
//           success: false,
//           message: "Failed to upload image. Please try again.",
//           error: uploadError.message
//         });
//       }
//     } else {
//       console.log('No image provided, continuing without profile image');
//     }


//     // Set default working hours if not provided
//     const defaultWorkingHours = workingHours.length > 0 ? workingHours : [
//       { dayOfWeek: 0, isWorking: false, startTime: "09:00", endTime: "17:00" },
//       { dayOfWeek: 1, isWorking: true, startTime: "09:00", endTime: "17:00" },
//       { dayOfWeek: 2, isWorking: true, startTime: "09:00", endTime: "17:00" },
//       { dayOfWeek: 3, isWorking: true, startTime: "09:00", endTime: "17:00" },
//       { dayOfWeek: 4, isWorking: true, startTime: "09:00", endTime: "17:00" },
//       { dayOfWeek: 5, isWorking: true, startTime: "09:00", endTime: "17:00" },
//       { dayOfWeek: 6, isWorking: false, startTime: "09:00", endTime: "17:00" }
//     ];

//     // Create new provider
//     const newProvider = new providerModel({
//       name: name.trim(),
//       email: email.toLowerCase().trim(),
//       phone: phone?.trim(),
//       bio: bio?.trim(),
//       profileImage: profileImageUrl,
//       services: services.filter(service => service), // Remove empty services
//       workingHours: defaultWorkingHours,
//       bookingBuffer: parseInt(bookingBuffer) || 15,
//       isActive: true,
//       createdAt: new Date()
//     });

//     const savedProvider = await newProvider.save();
    
//     // Populate services with details
//     await savedProvider.populate("services", "title duration price");

//     res.status(201).json({ 
//       success: true, 
//       message: "Provider created successfully", 
//       provider: savedProvider 
//     });

//   } catch (error) {
//     console.error("Error creating provider:", error);
    
//     // Handle specific MongoDB errors
//     if (error.code === 11000) {
//       return res.status(400).json({
//         success: false,
//         message: "Provider with this email already exists"
//       });
//     }
    
//     if (error.name === 'ValidationError') {
//       const validationErrors = Object.values(error.errors).map(err => err.message);
//       return res.status(400).json({
//         success: false,
//         message: "Validation failed",
//         errors: validationErrors
//       });
//     }

//     res.status(500).json({ 
//       success: false, 
//       message: "Failed to create provider", 
//       ...(process.env.NODE_ENV === 'development' && { error: error.message })
//     });
//   }
// };

// export const updateProvider = async (req, res) => {
//   try {
//     const providerId = req.params.providerId;
    
//     if (!providerId) {
//       return res.status(400).json({ 
//         success: false, 
//         message: "Provider ID is required" 
//       });
//     }

//     // Find existing provider
//     const existingProvider = await providerModel.findById(providerId);
//     if (!existingProvider) {
//       return res.status(404).json({ 
//         success: false, 
//         message: "Provider not found" 
//       });
//     }

//     let updates = { ...req.body };

//     // Parse JSON fields from FormData
//     const jsonFields = ['services', 'workingHours', 'breaks', 'vacationDays'];
//     jsonFields.forEach(field => {
//       if (updates[field]) {
//         try {
//           updates[field] = typeof updates[field] === 'string' 
//             ? JSON.parse(updates[field]) 
//             : updates[field];
//         } catch (error) {
//           console.warn(`${field} parsing error:`, error.message);
//           delete updates[field]; // Remove invalid field
//         }
//       }
//     });

//     // Handle image upload to Cloudinary
//     if (req.file && req.file.buffer) {
//       try {
//         // Delete old image from Cloudinary if it exists
//         if (existingProvider.profileImage) {
//           await deleteFromCloudinary(existingProvider.profileImage);
//         }

//         // Upload new image
//         const uploadResult = await uploadToCloudinary(req.file.buffer, {
//           public_id: `provider_${providerId}_${Date.now()}`
//         });
//         updates.profileImage = uploadResult.secure_url;
//       } catch (uploadError) {
//         console.error('Cloudinary upload error:', uploadError);
//         return res.status(400).json({
//           success: false,
//           message: "Failed to upload image. Please try again."
//         });
//       }
//     }

//     // Clean up updates object
//     Object.keys(updates).forEach(key => {
//       if (updates[key] === undefined || updates[key] === null || updates[key] === '') {
//         delete updates[key];
//       }
//     });

//     // Check if there are any updates to make
//     if (Object.keys(updates).length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "No valid fields provided for update"
//       });
//     }

//     // Add update timestamp
//     updates.updatedAt = new Date();

//     // Update provider
//     const updatedProvider = await providerModel.findByIdAndUpdate(
//       providerId,
//       { $set: updates },
//       { 
//         new: true, 
//         runValidators: true 
//       }
//     ).populate("services", "title duration price");

//     if (!updatedProvider) {
//       return res.status(404).json({ 
//         success: false, 
//         message: "Provider not found" 
//       });
//     }

//     res.json({ 
//       success: true, 
//       message: "Provider updated successfully",
//       provider: updatedProvider,
//       updatedFields: Object.keys(updates).filter(key => key !== 'updatedAt')
//     });

//   } catch (error) {
//     console.error("Error updating provider:", error);
    
//     // Handle specific errors
//     if (error.code === 11000) {
//       return res.status(400).json({
//         success: false,
//         message: "Duplicate data found. Email might already exist."
//       });
//     }
    
//     if (error.name === 'ValidationError') {
//       const validationErrors = Object.values(error.errors).map(err => err.message);
//       return res.status(400).json({
//         success: false,
//         message: "Validation failed",
//         errors: validationErrors
//       });
//     }

//     res.status(500).json({ 
//       success: false, 
//       message: "Failed to update provider", 
//       ...(process.env.NODE_ENV === 'development' && { error: error.message })
//     });
//   }
// };






export const createProvider = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      bio,
      bookingBuffer
    } = req.body;

  
    let services = [];
    if (req.body.services) {
      // If services are sent as array of ObjectIds
      services = Array.isArray(req.body.services) 
        ? req.body.services 
        : [req.body.services];
    } else if (req.body['services[]']) {
      // Handle FormData array format
      services = Array.isArray(req.body['services[]']) 
        ? req.body['services[]'] 
        : [req.body['services[]']];
    }
    
    let workingHours = [];

    // if (req.body.services) {
    //   try {
    //     services = JSON.parse(req.body.services);
    //   } catch {
    //     services = [];
    //   }
    // }

    if (req.body.workingHours) {
      try {
        workingHours = JSON.parse(req.body.workingHours);
      } catch {
        workingHours = [];
      }
    }

    const profileImage = req.file ? req.file.path : null; // Cloudinary URL or file path

    const existingProvider = await providerModel.findOne({ email: email.toLowerCase() });
    if (existingProvider) {
      return res.status(400).json({ success: false, message: "Provider with this email already exists" });
    }

    const defaultWorkingHours = workingHours.length > 0 ? workingHours : [
      { dayOfWeek: 0, isWorking: false, startTime: "09:00", endTime: "17:00" },
      { dayOfWeek: 1, isWorking: true, startTime: "09:00", endTime: "17:00" },
      { dayOfWeek: 2, isWorking: true, startTime: "09:00", endTime: "17:00" },
      { dayOfWeek: 3, isWorking: true, startTime: "09:00", endTime: "17:00" },
      { dayOfWeek: 4, isWorking: true, startTime: "09:00", endTime: "17:00" },
      { dayOfWeek: 5, isWorking: true, startTime: "09:00", endTime: "17:00" },
      { dayOfWeek: 6, isWorking: false, startTime: "09:00", endTime: "17:00" }
    ];

    const newProvider = new providerModel({
      name,
      email: email.toLowerCase(),
      phone,
      bio,
      profileImage,
      services,
      workingHours: defaultWorkingHours,
      bookingBuffer: bookingBuffer || 15,
      isActive: true
    });

    const savedProvider = await newProvider.save();
    await savedProvider.populate("services", "title duration price");

    res.status(201).json({ success: true, message: "Provider Added", provider: savedProvider });
  } catch (error) {
    console.error("Error creating provider:", error);
    res.status(500).json({ success: false, message: "Failed to create provider", error: error.message });
  }
};


export const updateProvider = async (req, res) => {
  try {
    const providerId = req.params.providerId;
    let updates = { ...req.body };

    // Parse arrays/objects from FormData
    if (updates.services) {
      try { updates.services = JSON.parse(updates.services); } catch {}
    }
    if (updates.workingHours) {
      try { updates.workingHours = JSON.parse(updates.workingHours); } catch {}
    }
    if (updates.breaks) {
      try { updates.breaks = JSON.parse(updates.breaks); } catch {}
    }
    if (updates.vacationDays) {
      try { updates.vacationDays = JSON.parse(updates.vacationDays); } catch {}
    }

    // Handle file upload
    if (req.file) {
      updates.profileImage = req.file.path; // Cloudinary URL
    }

    const updatedProvider = await providerModel.findByIdAndUpdate(
      providerId,
      updates,
      { new: true }
    ).populate("services", "title duration price");

    if (!updatedProvider) {
      return res.status(404).json({ success: false, message: "Provider not found" });
    }

    res.json({ success: true, provider: updatedProvider });
  } catch (error) {
    console.error("Error updating provider:", error);
    res.status(500).json({ success: false, message: "Failed to update provider", error: error.message });
  }
};




// Get providers by service ID (for provider selection modal)
export const getProvidersByService = async (req, res) => {
  try {
    const { serviceId, date } = req.query;
    
    if (!serviceId) {
      return res.status(400).json({ 
        success: false, 
        message: "Service ID is required" 
      });
    }

    console.log("Searching providers for service ID:", serviceId);

    // Method 1: Find providers that have this service in their services array
    const providers = await providerModel.find({
      services: serviceId,  // This will find providers where serviceId exists in the services array
      isActive: true
    })
    .populate('services', 'title duration price description')
    .sort({ 'rating.average': -1 }); // Sort by rating

    console.log(`Found ${providers.length} providers for service ${serviceId}`);

    // If no providers found using Method 1, try Method 2 (reverse lookup)
    let alternativeProviders = [];
    if (providers.length === 0) {
      console.log("No providers found with direct service reference, trying reverse lookup...");
      
      // Check if the service exists and has providers array
      const service = await serviceModel.findById(serviceId).populate('providers');
      if (service && service.providers && service.providers.length > 0) {
        alternativeProviders = service.providers.filter(provider => provider.isActive);
        console.log(`Found ${alternativeProviders.length} providers via reverse lookup`);
      }
    }

    const finalProviders = providers.length > 0 ? providers : alternativeProviders;

    // If date is provided, you can add availability filtering here
    if (date && finalProviders.length > 0) {
      // Add your availability filtering logic here if needed
      console.log("Date filtering requested for:", date);
    }

    return res.status(200).json({
      success: true,
      providers: finalProviders,
      count: finalProviders.length,
      searchedServiceId: serviceId
    });

  } catch (error) {
    console.error("Error fetching providers by service:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch providers for service",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Alternative: Get all active providers (fallback)
export const getAllProviders = async (req, res) => {
  try {
    const providers = await providerModel.find({ isActive: true })
      .populate('services', 'title duration price description')
      .sort({ 'rating.average': -1 });

    return res.status(200).json({
      success: true,
      providers,
      count: providers.length
    });

  } catch (error) {
    console.error("Error fetching all providers:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch providers",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


// Get appointments for a specific provider
export const getProviderAppointments = async (req, res) => {
  try {
    const { providerId } = req.params;
    const { status, startDate, endDate, page = 1, limit = 20 } = req.query;

    // Validate providerId
    if (!providerId || !providerId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Valid provider ID is required"
      });
    }

    // Build query object
    const query = { providerId };
    
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
        .select("-__v")
        .populate('userId', 'name email phone') // Populate user details
        .lean(),
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
    console.error("Error fetching provider appointments:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch provider appointments"
    });
  }
};

// Get today's appointments for a provider
// providerController.js
export const getTodaysAppointments = async (req, res) => {
  try {
    const { providerId } = req.params;
    // console.log("Requested provider ID:", providerId);

    const provider = await providerModel.findById(providerId);
    if (!provider) return res.status(404).json({ success: false, message: "Provider not found" });

    // Example query
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const appointments = await appointmentModel.find({
      providerId,
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    res.json({ success: true, appointments });
  } catch (error) {
    console.error("Error fetching today's appointments:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// Get upcoming appointments for a provider (next 7 days)
export const getProviderUpcomingAppointments = async (req, res) => {
  try {
    const { providerId } = req.params;
    const { days = 7 } = req.query;

    // Validate providerId
    if (!providerId || !providerId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Valid provider ID is required"
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const futureDate = new Date(today);
    futureDate.setDate(futureDate.getDate() + parseInt(days));

    const appointments = await appointmentModel
      .find({
        providerId,
        date: {
          $gte: today,
          $lt: futureDate
        },
        status: { $in: ['pending', 'confirmed'] }
      })
      .sort({ date: 1, time: 1 })
      .populate('userId', 'name email phone')
      .select("-__v")
      .lean();

    res.status(200).json({
      success: true,
      appointments,
      dateRange: {
        start: today.toISOString().split('T')[0],
        end: futureDate.toISOString().split('T')[0]
      }
    });
  } catch (error) {
    console.error("Error fetching upcoming appointments:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch upcoming appointments"
    });
  }
};

// Get appointment statistics for a provider
export const getProviderAppointmentStats = async (req, res) => {
  try {
    const { providerId } = req.params;

    // Validate providerId
    if (!providerId || !providerId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Valid provider ID is required"
      });
    }

    const stats = await appointmentModel.aggregate([
      {  $match: {
          providerId: new mongoose.Types.ObjectId(providerId), // ✅ use 'new'
        }, },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalRevenue: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ['$payment.status', 'paid'] }, { $ifNull: ['$payment.amount', false] }] },
                '$payment.amount',
                0
              ]
            }
          }
        }
      }
    ]);

    // Convert to more readable format
    const formattedStats = {
      total: 0,
      byStatus: {},
      totalRevenue: 0
    };

    stats.forEach(stat => {
      formattedStats.total += stat.count;
      formattedStats.byStatus[stat._id] = stat.count;
      formattedStats.totalRevenue += stat.totalRevenue;
    });

    // Get appointment count for todya
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todaysCount = await appointmentModel.countDocuments({
      providerId,
      date: {
        $gte: today,
        $lt: tomorrow
      }
    });

    formattedStats.todaysAppointments = todaysCount;

    res.status(200).json({
      success: true,
      stats: formattedStats
    });
  } catch (error) {
    console.error("Error fetching provider stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch provider statistics"
    });
  }
};