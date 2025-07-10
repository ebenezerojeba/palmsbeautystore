import appointmentModel from "../models/appointment.js";
import serviceModel from "../models/serviceModel.js";

const completeAppointment = async (req, res) => {
    try {
      const { appointmentId } = req.body;
      
      const appointment = await appointmentModel.findByIdAndUpdate(
        appointmentId,
        { 
          isCompleted: true,
          completedAt: new Date() // Optional: track when it was completed
        },
        { new: true }
      );
  
      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }
  
      res.status(200).json({ 
        success:true,
        message: "Appointment marked as completed",
        appointment 
      });
    } catch (error) {
      console.error("Error completing appointment:", error);
      res.status(500).json({ message: "Failed to complete appointment" });
    }
  };


  // New function to get all completed appointments
const getCompletedAppointments = async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      
      // Build query object
      const query = { 
        isCompleted: true 
      };
  
      // Add date range if provided
      if (startDate || endDate) {
        query.date = {};
        if (startDate) query.date.$gte = new Date(startDate);
        if (endDate) query.date.$lte = new Date(endDate);
      }
  
      const appointments = await appointmentModel.find(query)
        .sort({ date: -1, time: -1 }) // Sort by date and time, most recent first
        .select('-__v'); // Exclude version key
  
      res.status(200).json(appointments);
    } catch (error) {
      console.error("Error fetching completed appointments:", error);
      res.status(500).json({ message: "Failed to fetch completed appointments" });
    }
}

const getAllAppointment = async (req,res) => {
 try {
  const appointments = await appointmentModel.find({})
  res.json({success:true, appointments})
 } catch (error) {
  res.json({success:false, message:error.message})
 }
}

// API to get dsahboard data for admin panel
const adminDashboard = async (req,res) => {
  const appointments = await appointmentModel.find({})

  const dashData  = {
    totalAppointments: appointments.length,
    completedAppointments: appointments.filter(appointment => appointment.isCompleted).length,
    pendingAppointments: appointments.filter(appointment => !appointment.isCompleted).length,
    latestAppointments: appointments.reverse(),
    cancelledAppointments: appointments.filter(appointment => appointment.isCancelled).length
  }
  return res.json({success:true,dashData})
}

// Get all services for admin panel
const allServices = async (req, res) => {
  try {
    const services = await serviceModel.find({})
      .sort({ createdAt: -1 });
    
    res.json({ services });
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
};


// Create new service
 const addService = async (req, res) => {
   try {
    const { title, description, duration, price, isActive, isCategory, parentService } = req.body;
    
    const serviceData = {
      title,
      description,
      duration,
      price,
      isActive: isActive === 'true',
      isCategory: isCategory === 'true',
      parentService: parentService || null
    };

    if (req.file) {
      serviceData.image = req.file.path; // Adjust based on your file storage
    }

    const service = new serviceModel(serviceData);
    await service.save();
    
    res.status(201).json(service);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update service
const updateService = async (req, res) => {

  try {
   const { id } = req.params;
   const { title, description, duration, price, isActive } = req.body;
   
   // Validation
   if (!title || !description || !duration || !price) {
     return res.status(400).json({ error: 'All fields are required' });
   }
   
   const service = await serviceModel.findById(id);
   if (!service) {
     return res.status(404).json({ error: 'Service not found' });
   }
   
   // Update basic fields
   service.title = title;
   service.description = description;
   service.duration = duration;
   service.price = price;
   service.isActive = isActive === 'true' || isActive === true;
   service.updatedAt = new Date();
   
   // Handle image update
   if (req.file) {
     // Delete old image from Cloudinary if exists
     if (service.imagePublicId) {
       try {
         await cloudinary.uploader.destroy(service.imagePublicId);
       } catch (deleteError) {
         console.error('Error deleting old image:', deleteError);
       }
     }
     
     // Set new image
     service.image = req.file.path;
     service.imagePublicId = req.file.filename;
   }
   
   await service.save();
   
   res.json({ service });
 } catch (error) {
   console.error('Error updating service:', error);
   res.status(500).json({ error: 'Failed to update service' });
 }
}


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
      return res.status(404).json({ error: 'Service not found' });
    }
    
    res.json({ service });
  } catch (error) {
    console.error('Error toggling service status:', error);
    res.status(500).json({ error: 'Failed to toggle service status' });
  }
}

// Delete Service
const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    
    const service = await serviceModel.findByIdAndUpdate(
      id,
      { isActive, updatedAt: new Date() },
      { new: true }
    );
    
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    
    res.json({ service });
  } catch (error) {
    console.error('Error toggling service status:', error);
    res.status(500).json({ error: 'Failed to toggle service status' });
  }
};

// Delete Service Image only
const deleteServiceImage = async (req, res) => {
   try {
    const { id } = req.params;
    
    const service = await serviceModel.findById(id);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    
    // Delete image from Cloudinary if exists
    if (service.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(service.imagePublicId);
      } catch (deleteError) {
        console.error('Error deleting image:', deleteError);
      }
    }
    
    // Remove image fields from service
    service.image = undefined;
    service.imagePublicId = undefined;
    service.updatedAt = new Date();
    await service.save();
    
    res.json({ message: 'Image deleted successfully', service });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ error: 'Failed to delete image' });
  }

}


  export {completeAppointment, getCompletedAppointments, adminDashboard, getAllAppointment, allServices, addService, updateService, toggleServiceStatus, deleteService, deleteServiceImage};