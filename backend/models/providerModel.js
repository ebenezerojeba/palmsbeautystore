// models/providerModel.js
import mongoose from 'mongoose';

const breakTimeSchema = new mongoose.Schema({
  startTime: { type: String, required: true }, // Format: "HH:MM"
  endTime: { type: String, required: true },
  reason: String
});

const workingHoursSchema = new mongoose.Schema({
  dayOfWeek: { 
    type: Number, 
    required: true, 
    min: 0, 
    max: 6 // 0 = Sunday, 1 = Monday, etc.
  },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  isWorking: { type: Boolean, default: true }
});

const providerSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  email: { 
    type: String, 
    required: true,
    unique: true,
    lowercase: true
  },
  phone: { 
    type: String,
    trim: true
  },
  bio: { 
    type: String,
    maxlength: 500
  },
  profileImage: { 
    type: String 
  },
  services: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service'
  }],
  workingHours: [workingHoursSchema],
  breaks: [{
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    reason: String
  }],
  vacationDays: [{
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    reason: String
  }],
  bookingBuffer: { // Time between appointments
    type: Number,
    default: 15, // minutes
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  rating: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

// Index for efficient querying
providerSchema.index({ isActive: 1, services: 1 });
providerSchema.index({ 'workingHours.dayOfWeek': 1 });


const providerModel = mongoose.models.Provider || 
  mongoose.model("Provider", providerSchema);
export default providerModel;
// export default mongoose.model('Provider', providerSchema);