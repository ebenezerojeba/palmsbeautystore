import appointmentModel from "../models/appointment.js";
import serviceModel from "../models/serviceModel.js";
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import path from 'path';

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
    const { appointmentId, reason, cancelledBy = "provider" } = req.body;

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

    // For admin cancellation, we don't need to check if the admin owns the appointment
    // But we should verify the admin is authenticated (handled by middleware)

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
};