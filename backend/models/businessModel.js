import mongoose from "mongoose";
// Business Hours/Availability Schema
const businessHoursSchema = new mongoose.Schema({
  dayOfWeek: { 
    type: Number, 
    required: true, 
    min: 0, 
    max: 6 // 0 = Sunday, 6 = Saturday
  },
  isOpen: { type: Boolean, default: true },
  openTime: { type: String, required: true }, // "09:00"
  closeTime: { type: String, required: true }, // "17:00"
  breakStart: { type: String }, // Optional lunch break
  breakEnd: { type: String },
  slotDuration: { type: Number, default: 90 }, // minutes
}, { _id: false });

const businessHoursModel = mongoose.models.businessHours || 
  mongoose.model("businessHours", businessHoursSchema);
  
  export default businessHoursModel