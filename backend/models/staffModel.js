import mongoose from 'mongoose';
import appointmentModel from './appointment.js';

const staffSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  specialties: [{ type: String }], // e.g., ["Hair Styling", "Coloring"]
  bio: { type: String },
  image: { type: String },
  imagePublicId: { type: String },
  
  // Services this staff member can perform
  services: [{
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
    duration: { type: Number }, // Override service duration if needed
    price: { type: Number }     // Override service price if needed
  }],
  
  // Staff-specific business hours (overrides general business hours)
  businessHours: [{
    dayOfWeek: { type: Number, min: 0, max: 6 }, // 0 = Sunday
    isOpen: { type: Boolean, default: true },
    openTime: { type: String }, // "09:00"
    closeTime: { type: String }, // "17:00"
    breakStart: { type: String },
    breakEnd: { type: String }
  }],
  
  isActive: { type: Boolean, default: true },
  isAvailableForBooking: { type: Boolean, default: true },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});





const staffModel = mongoose.models.Staff || 
  mongoose.model("Staff", staffSchema);


  // Migration script - run once
// const migrateExistingAppointments = async () => {
//   try {
//     // Create a default staff member if none exists
//     let defaultStaff = await staffModel.findOne();
    
//     if (!defaultStaff) {
//       defaultStaff = await staffModel.create({
//         name: "Default Staff",
//         email: "staff@yoursite.com",
//         isActive: true,
//         services: [], // Will need to be populated
//         businessHours: [] // Use general business hours
//       });
//     }

//     // Update appointments without staffId
//     await appointmentModel.updateMany(
//       { staffId: { $exists: false } },
//       { 
//         staffId: defaultStaff._id,
//         staffName: defaultStaff.name,
//         staffEmail: defaultStaff.email
//       }
//     );

//     console.log("Migration completed");
//   } catch (error) {
//     console.error("Migration failed:", error);
//   }
// };

// migrateExistingAppointments(); // Uncomment to run migration

export default staffModel;
