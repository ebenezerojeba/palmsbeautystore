import appointmentModel from "../models/appointment.js";
import serviceModel from "../models/serviceModel.js";
import { v2 as cloudinary } from 'cloudinary';
  import fs from 'fs';

const completeAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const appointment = await appointmentModel.findByIdAndUpdate(
      appointmentId,
      {
        isCompleted: true,
        completedAt: new Date(), // Optional: track when it was completed
      },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({
      success: true,
      message: "Appointment marked as completed",
      appointment,
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
      isCompleted: true,
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

    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error fetching completed appointments:", error);
    res.status(500).json({ message: "Failed to fetch completed appointments" });
  }
};

const getAllAppointment = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({});
    res.json({ success: true, appointments });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// API to get dsahboard data for admin panel
const adminDashboard = async (req, res) => {
  const appointments = await appointmentModel.find({});

  const dashData = {
    totalAppointments: appointments.length,
    completedAppointments: appointments.filter(
      (appointment) => appointment.isCompleted
    ).length,
    pendingAppointments: appointments.filter(
      (appointment) => !appointment.isCompleted
    ).length,
    latestAppointments: appointments.reverse(),
    cancelledAppointments: appointments.filter(
      (appointment) => appointment.isCancelled
    ).length,
  };
  return res.json({ success: true, dashData });
};

// Get all services for admin panel
const allServices = async (req, res) => {
  try {
    const services = await serviceModel.find({}).sort({ createdAt: -1 });

    res.json({ services });
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).json({ error: "Failed to fetch services" });
  }
};

// Add Categroy
const addCategory = async (req, res) => {
  try {
    const { title, isActive } = req.body;

    if (!title) {
      return res
        .status(400)
        .json({ error: "Title and description are required" });
    }

    const category = new serviceModel({
      title,
      isActive: isActive === "true",
      isCategory: true,
      parentService: null,
    });

    await category.save();

    res
      .status(201)
      .json({ message: "Category created successfully", category });
  } catch (err) {
    res.status(400).json({ error: err.message });
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

    // if (req.file) {
    //   updateData.image = req.file.path;
    // }

  if (req.file) {
  const result = await cloudinary.uploader.upload(req.file.path, {
    folder: 'palmsbeautystore/services', // Optional folder structure
  });

  serviceData.image = result.secure_url;         // Full image URL to display
  serviceData.imagePublicId = result.public_id;  // To allow deletion later

  // Optional: delete local file if using disk storage

  fs.unlinkSync(req.file.path);
}



    const updated = await serviceModel.findOneAndUpdate(
      { _id: categoryId, isCategory: true },
      updateData,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({ message: "Category updated successfully", category: updated });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(400).json({ message: error.message });
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
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({ message: "Category and its sub-services deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(400).json({ message: error.message });
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

   if (req.file) {
  const result = await cloudinary.uploader.upload(req.file.path, {
    folder: 'palmsbeautystore/services', // Optional folder structure
  });

  serviceData.image = result.secure_url;         // Full image URL to display
  serviceData.imagePublicId = result.public_id;  // To allow deletion later

  // Optional: delete local file if using disk storage

  fs.unlinkSync(req.file.path);
}




    // if (req.file) {
    //   serviceData.image = req.file.path; // Adjust based on your file storage
    // }

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
    const service = await serviceModel.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // If there's a new image file, remove the old one and set new path
    if (req.file) {
      // Remove old image file if it exists
      if (service.image) {
        const imagePath = path.join('uploads', path.basename(service.image));
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }

      // Add the new image path to the update data
      req.body.image = `/uploads/${req.file.filename}`;
    }

    // Update service with new data
    const updatedService = await serviceModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({ success: true, service: updatedService });
  } catch (err) {
    res.status(500).json({
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
      return res.status(404).json({ error: "Service not found" });
    }

    res.json({ service });
  } catch (error) {
    console.error("Error toggling service status:", error);
    res.status(500).json({ error: "Failed to toggle service status" });
  }
};

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
      return res.status(404).json({ error: "Service not found" });
    }

    res.json({ service });
  } catch (error) {
    console.error("Error toggling service status:", error);
    res.status(500).json({ error: "Failed to toggle service status" });
  }
};

// Delete Service Image only
const deleteServiceImage = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await serviceModel.findById(id);
    if (!service) {
      return res.status(404).json({ error: "Service not found" });
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

    res.json({ message: "Image deleted successfully", service });
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({ error: "Failed to delete image" });
  }
};

// Update Service

export {
  completeAppointment,
  getCompletedAppointments,
  adminDashboard,
  getAllAppointment,
  allServices,
  addService,
  updateService,
  toggleServiceStatus,
  deleteService,
  deleteServiceImage,
  addCategory,
  updateCategory,
  deleteCategory,
};
