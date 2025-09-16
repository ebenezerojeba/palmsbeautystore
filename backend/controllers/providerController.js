import mongoose from "mongoose";
import appointmentModel from "../models/appointment.js";
import providerModel from "../models/providerModel.js";
import serviceModel from "../models/serviceModel.js";

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
    
    // If date is provided, check availability for each provider
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

export const createProvider = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      bio,
      bookingBuffer
    } = req.body;

    // Parse JSON fields if they come as strings from FormData
    // Fix: Handle services array properly
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

    res.status(201).json({ success: true, provider: savedProvider });
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