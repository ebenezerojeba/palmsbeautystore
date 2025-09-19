// routes/providerRoutes.js
import express from "express";
import { getAllProviders, getProvider, getProviderAppointments, getProviderAppointmentStats, getProviders, getProvidersByService, getProviderSchedule, getProviderUpcomingAppointments, getTodaysAppointments, updateProviderWorkingHours } from "../controllers/providerController.js";
import providerModel from "../models/providerModel.js";
import mongoose from "mongoose";


const providerRouter = express.Router();

// Public routes
providerRouter.get('/:id', getProvider);
providerRouter.get('/', getProviders);
providerRouter.get('/all-providers', getAllProviders);
providerRouter.get('/', getProvidersByService); // New route to get providers by service

// Get all appointments for a specific provider
providerRouter.get('/:providerId/appointments', getProviderAppointments);

// Get today's appointments for a specific provider
providerRouter.get('/:providerId/todays-appointments', getTodaysAppointments);

// Get upcoming appointments for a specific provider
providerRouter.get('/:providerId/upcoming-appointments', getProviderUpcomingAppointments);

// Get appointment stats for a specific provider
providerRouter.get('/:providerId/appointment-stats', getProviderAppointmentStats);
// / New route to get providers by service


// Add this to your providerRouter
providerRouter.get('/debug/all', async (req, res) => {
  try {
    console.log("=== DEBUG: Checking all providers ===");
    
    // Check collection name
    console.log("Collection name:", providerModel.collection.name);
    
    // Get all providers with minimal fields
    const providers = await providerModel.find({}, '_id name email isActive')
      .lean(); // .lean() for better performance
    
    console.log("Total providers found:", providers.length);
    console.log("Providers:", providers);
    
    res.json({ 
      success: true, 
      collectionName: providerModel.collection.name,
      count: providers.length,
      providers: providers
    });
  } catch (error) {
    console.error("Debug error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Also add a debug endpoint to check if a specific ID exists
providerRouter.get('/debug/check/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log("=== DEBUG: Checking specific ID ===");
    console.log("Looking for ID:", id);
    
    // Check if ID format is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.json({ 
        success: false, 
        message: "Invalid ObjectId format",
        id: id
      });
    }
    
    // Try to find by ID
    const provider = await providerModel.findById(id).lean();
    console.log("Found provider:", provider);
    
    // Also try a raw MongoDB query
    const rawResult = await providerModel.collection.findOne({
      _id: new mongoose.Types.ObjectId(id)
    });
    console.log("Raw MongoDB result:", rawResult);
    
    res.json({
      success: true,
      mongooseResult: provider,
      rawResult: rawResult,
      id: id
    });
  } catch (error) {
    console.error("Debug check error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});






// Protected routes (for providers to manage their schedule)
providerRouter.get('/:providerId/schedule',  getProviderSchedule);
providerRouter.put('/:providerId/working-hours', updateProviderWorkingHours);

export default providerRouter;