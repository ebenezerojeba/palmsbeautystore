import staffModel from "../models/staffModel.js";
import serviceModel from "../models/serviceModel.js";
import appointmentModel from "../models/appointment.js";
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// Get all staff members
export const getAllStaff = async (req, res) => {
  try {
    const staff = await staffModel.find({ isActive: true })
      .populate('services.serviceId', 'title description')
      .sort({ name: 1 });
    
    res.json({ success: true, staff });
  } catch (error) {
    console.error("Error fetching staff:", error);
    res.status(500).json({ success: false, message: "Failed to fetch staff" });
  }
};

// Get staff by service
export const getStaffByService = async (req, res) => {
  try {
    const { serviceIds } = req.query;
    const ids = serviceIds.split(',');

    // Find staff who have ALL the requested services
    const staff = await staffModel.find({
      'services.serviceId': { $all: ids },
      isActive: true,
      isAvailableForBooking: true
    }).select('name bio image specialties services');

    res.json({ success: true, staff });
  } catch (error) {
    console.error("Error fetching staff by services:", error);
    res.status(500).json({ success: false, message: "Failed to fetch staff" });
  }
};

// Admin functions
export const createStaff = async (req, res) => {
  try {
    const staffData = { ...req.body };
    
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'palmsbeautystore/staff',
      });
      staffData.image = result.secure_url;
      staffData.imagePublicId = result.public_id;
      fs.unlinkSync(req.file.path);
    }
    
    const staff = new staffModel(staffData);
    await staff.save();
    
    res.status(201).json({ success: true, staff });
  } catch (error) {
    console.error("Error creating staff:", error);
    res.status(500).json({ success: false, message: "Failed to create staff" });
  }
};

export const updateStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body, updatedAt: new Date() };
    
    if (req.file) {
      const staff = await staffModel.findById(id);
      if (staff?.imagePublicId) {
        await cloudinary.uploader.destroy(staff.imagePublicId);
      }
      
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'palmsbeautystore/staff',
      });
      updateData.image = result.secure_url;
      updateData.imagePublicId = result.public_id;
      fs.unlinkSync(req.file.path);
    }
    
    const staff = await staffModel.findByIdAndUpdate(id, updateData, { new: true });
    res.json({ success: true, staff });
  } catch (error) {
    console.error("Error updating staff:", error);
    res.status(500).json({ success: false, message: "Failed to update staff" });
  }
};

export const getStaffAvailability = async (req, res) => {
  try {
    const { staffId } = req.params;
    const staff = await staffModel.findById(staffId).select('businessHours');   
    if (!staff) {
      return res.status(404).json({ success: false, message: "Staff not found" });
    }
    res.json({ success: true, businessHours: staff.businessHours });
  } catch (error) {
    console.error("Error fetching staff availability:", error);
    res.status(500).json({ success: false, message: "Failed to fetch availability" });
  }
};

export const deleteStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const staff = await staffModel.findById(id);
    if (!staff) {
      return res.status(404).json({ success: false, message: "Staff not found" });
    }
    if (staff.imagePublicId) {
      await cloudinary.uploader.destroy(staff.imagePublicId);
    }
    await staffModel.findByIdAndDelete(id);
    res.json({ success: true, message: "Staff deleted" });
  } catch (error) {
    console.error("Error deleting staff:", error);
    res.status(500).json({ success: false, message: "Failed to delete staff" });
  }
};

export const toggleStaffStatus = async (req, res) => {
    try {
    const { id } = req.params;
    const staff = await staffModel.findById(id);
    if (!staff) {
      return res.status(404).json({ success: false, message: "Staff not found" });
    }
    staff.isActive = !staff.isActive;
    await staff.save();
    res.json({ success: true, staff });
  } catch (error) {
    console.error("Error toggling staff status:", error);
    res.status(500).json({ success: false, message: "Failed to update status" });
  }
};

export const getStaffAppointments = async (req, res) => {
  try {
    const { staffId } = req.params;
    const { date } = req.query; // Optional date filter (YYYY-MM-DD)
    const query = { staffId };
    if (date) {
        query.date = date;
    }
    const appointments = await appointmentModel.find(query)
      .populate('userId', 'name email phone')
      .populate('services.serviceId', 'title duration price')
      .sort({ date: 1, time: 1 });
    res.json({ success: true, appointments });
  } catch (error) {
    console.error("Error fetching staff appointments:", error);
    res.status(500).json({ success: false, message: "Failed to fetch appointments" });
  }
};