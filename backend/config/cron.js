
import cron from "node-cron";
import appointmentModel from "../models/appointment.js";
// import { sendEmail, sendSMS } from '../utils/notificationService.js';


cron.schedule('*/15 * * * *', async () => {
  const now = new Date();

  // 24h reminders
  const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const appointments24h = await appointmentModel.find({
    date: { $eq: in24h.toISOString().split('T')[0] },
    status: 'confirmed',
    'reminders.email24h': false
  });

  for (const appt of appointments24h) {
    await sendEmail(appt.userEmail, 'Your appointment is tomorrow at ' + appt.time);
    appt.reminders.email24h = true;
    await appt.save();
  }

  // Repeat similar logic for 2h SMS reminders
});

