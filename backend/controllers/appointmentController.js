import appointmentModel from "../models/appointment.js";
import createCalendarEvent from "../utils/calendarGenerator.js";
import path from "path"; // Add this import
import fs from "fs";
import { fileURLToPath } from "url";
// import sendAppointmentNotification from "../utils/emailSender.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const bookAppointment = async (req, res) => {
  try {
    const { serviceId, serviceTitle, date, time, userDetails } = req.body;


    // Check if slot is already booked
    const existingAppointment = await appointmentModel.findOne({
      date: new Date(date),
      time,
      isCompleted: false
    });

    if (existingAppointment) {
      return res.status(409).json({ 
        message: "This slot is already booked. Please select another time." 
      });
    }

    // Save the appointment to the database
    const newAppointment = new appointmentModel({
      serviceId,
      serviceTitle,
      date,
      time,
      userDetails,
    });
    await newAppointment.save();

    const icsFilePath = await createCalendarEvent(newAppointment);

    // Send email notification
    // sendAppointmentNotification(newAppointment);

    res.status(201).json({
      message: "Booking successful!",
      appointment: newAppointment,
      calendarLink: `/download-calendar/${newAppointment._id}`,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ message: "Failed to create booking" });
  }
};


// New function to get booked slots
const getBookedSlots = async (req, res) => {
  try {
    const appointments = await appointmentModel.find(
      { isCompleted: false }, // Only get active appointments
      'date time' // Only select needed fields
    );
    
    // Format the appointments for the frontend
    const bookedSlots = appointments.map(appointment => ({
      date: appointment.date.toISOString().split('T')[0],
      time: appointment.time,
      serviceId: appointment.serviceId
    }));

    res.status(200).json(bookedSlots);
  } catch (error) {
    console.error("Error fetching booked slots:", error);
    res.status(500).json({ message: "Failed to fetch booked slots" });
  }
};





const downloadCalendar = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const filePath = path.join(
      __dirname,
      "..",
      "calendar",
      `event-${appointmentId}.ics`
    );

    if (!fs.existsSync(filePath)) {
      return res.status(404).send("File not found");
    }

    res.setHeader("Content-Type", "text/calendar");

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=event-${appointmentId}.ics`
    );

    fs.createReadStream(filePath).pipe(res);
  } catch (error) {
    console.error("Error downloading calendar:", error);

    res.status(500).send("Internal server error");
  }
};


// New function to cancel appointment
const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    console.log("Cancelling appointment with ID", appointmentId)

    const appointment = await appointmentModel.findByIdAndUpdate(appointmentId, {isCancelled: true, cancelledAt: new Date()}, {new: true}
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({ 
      success: true,
      message: "Appointment cancelled successfully",
      appointment 
    });
  } catch (error) {
    console.error("Error cancelling appointment:", error);
    res.status(500).json({ message: "Failed to cancel appointment" });
  }
};


export { bookAppointment, downloadCalendar, getBookedSlots, cancelAppointment };
