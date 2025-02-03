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

export { bookAppointment, downloadCalendar };
