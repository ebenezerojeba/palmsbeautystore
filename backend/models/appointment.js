import mongoose from "mongoose";
import { BUSINESS_TIMEZONE } from "../utils/dateUtils.js";
import { fromZonedTime, toZonedTime } from "date-fns-tz";

// Service within appointment schema
const appointmentServiceSchema = new mongoose.Schema({
  serviceId: { type: String, required: true },
  serviceTitle: { type: String, required: true },

  duration: { type: Number }, // in minutes
  price: { type: Number, required: true },
  order: { type: Number, required: true } // Order of service in the appointment
});

// Enhanced Appointment Schema
const appointmentSchema = new mongoose.Schema({
  // Basic Info
  userId: { type: String, required: true },

  // Services - Updated to support multiple services
  services: [appointmentServiceSchema], // Array of services

  serviceId: { type: String },
  serviceTitle: { type: String }, 

 date: {
    type: String,  // Changed from Date to String - stores "YYYY-MM-DD"
    required: true,
    index: true
  },
  
  //  HH:MM format
  time: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
      },
      message: 'Time must be in HH:MM format'
    }
  },
  totalDuration: { type: Number }, // Total duration in minutes
  duration: { type: String }, // Keep for backward compatibility
  
  // Status Management
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'completed', 'cancelled', 'no-show'],
    default: 'pending'
  },
  
  // Payment Information
  payment: {
    amount: { type: Number, required: true },
    currency: { type: String, default: "CAD" },
    status: { 
      type: String, 
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending'
    },
    paymentMethod: { type: String },
    transactionId: { type: String },
    paymentDate: { type: Date },
    refundDate: { type: Date },
    refundAmount: { type: Number }
  },

  // User Information (denormalized for easy access)
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  userPhone: { type: String },

  // Client's note
  clientNotes: { type: String, default: '' },

  // Consent form

consentForm: {
  healthConditions: { type: String, default: "" },
  allergies: { type: String, default: "" },
  consentToTreatment: { type: Boolean, default: false }, // Changed from required: false
  submittedAt: { type: Date, default: Date.now }
},

  // Professional Notes
  serviceProviderNotes: {
    preAppointment: { type: String },
    duringAppointment: { type: String },
    postAppointment: { type: String },
    privateNotes: { type: String }
  },

  // Timestamps
  bookedAt: { type: Date, default: Date.now },
  confirmedAt: { type: Date },
  completedAt: { type: Date },
  cancelledAt: { type: Date },
  
  
  // Cancellation Details
  cancellation: {
    cancelledBy: { type: String, enum: ['client', 'provider', 'admin'] },
    reason: { type: String },
    refundEligible: { type: Boolean, default: false },
    cancellationFee: { type: Number, default: 0 }
  },

  // Reminders
  reminders: {
    email24h: { type: Boolean, default: false },
    email2h: { type: Boolean, default: false },
    sms24h: { type: Boolean, default: false },
    sms2h: { type: Boolean, default: false }
  },

  // Follow-up
  followUp: {
    emailSent: { type: Boolean, default: false },
    feedbackRequested: { type: Boolean, default: false },
    rating: { type: Number, min: 1, max: 5 }
  },
  // Additional fields for multi-day support
estimatedEndDate: {
  type: Date,
  required: false
},
estimatedEndTime: {
  type: String,
  required: false
},
spansDays: {
  type: Number,
  default: 1
},
isMultiDay: {
  type: Boolean,
  default: false
},

totalBusinessHoursNeeded: {
  type: Number,
  required: false
},
providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Provider',
    required: true
  },
  providerName: {
    type: String,
    required: true
  },
  
  rescheduleHistory: [
  {
    oldDate: Date,
    oldTime: String,
    newDate: Date,
    newTime: String,
    rescheduledAt: { type: Date, default: Date.now },
    rescheduledBy: { type: String, enum: ['User', 'Provider', 'Admin'] }
  }
]

}, {
  timestamps: true
});

// Indexes for better performance
appointmentSchema.index({ 'services.serviceId': 1, date: 1, time: 1, status: 1 });
appointmentSchema.index({ serviceId: 1, date: 1, time: 1, status: 1 }); // Keep for backward compatibility
appointmentSchema.index({ status: 1, date: 1 });
appointmentSchema.index({ userId: 1, status: 1 });
appointmentSchema.index({ 'payment.status': 1 });
appointmentSchema.index({ date: 1, status: 1 });
// In your appointment model
appointmentSchema.index({ providerId: 1, date: 1, status: 1 });
appointmentSchema.index({ date: 1, time: 1, status: 1 });

// Virtual to get full datetime (useful for sorting/display)
appointmentSchema.virtual('dateTime').get(function() {
  if (this.date && this.time) {
    return `${this.date}T${this.time}:00`;
  }
  return null;
});

// Helper method to check if appointment is in the past
appointmentSchema.methods.isPast = function() {
  const now = new Date();
  const [year, month, day] = this.date.split('-').map(Number);
  const [hour, minute] = this.time.split(':').map(Number);
  const appointmentDate = new Date(year, month - 1, day, hour, minute);
  return appointmentDate < now;
};

// Helper method to get appointment end time
appointmentSchema.methods.getEndTime = function() {
  const [hour, minute] = this.time.split(':').map(Number);
  const totalMinutes = hour * 60 + minute + (this.totalDuration || 90);
  const endHour = Math.floor(totalMinutes / 60);
  const endMinute = totalMinutes % 60;
  return `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
};

const appointmentModel = mongoose.models.appointment || 
  mongoose.model("appointment", appointmentSchema);

export default appointmentModel;