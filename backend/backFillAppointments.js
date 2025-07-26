// backfillAppointments.js
import mongoose from 'mongoose';
import appointmentModel from './models/appointmentModel.js';
import userModel from './models/userModel.js';

const backfillAppointments = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // Find all appointments missing contact info
    const appointments = await appointmentModel.find({
      $or: [
        { userName: { $exists: false } },
        { userEmail: { $exists: false } },
        { userPhone: { $exists: false } }
      ]
    });

    console.log(`Found ${appointments.length} appointments to update`);

    let updatedCount = 0;

    for (const appointment of appointments) {
      const user = await userModel.findById(appointment.userId);
      if (!user) continue;

      await appointmentModel.updateOne(
        { _id: appointment._id },
        {
          $set: {
            userName: user.name,
            userEmail: user.email,
            userPhone: user.phone
          }
        }
      );

      updatedCount++;
      if (updatedCount % 100 === 0) {
        console.log(`Updated ${updatedCount} appointments...`);
      }
    }

    console.log(`✅ Successfully updated ${updatedCount} appointments`);
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

backfillAppointments();