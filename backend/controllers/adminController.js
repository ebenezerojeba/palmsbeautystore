import appointmentModel from "../models/appointment.js";

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
    latestAppointments: appointments.reverse().slice(0,4)
  }
  return res.json({success:true,dashData})
}

  export {completeAppointment, getCompletedAppointments, adminDashboard, getAllAppointment}