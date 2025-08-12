// Updated Appointment Schema (appointmentModel.js)
import mongoose from "mongoose";

// Service within appointment schema
const appointmentServiceSchema = new mongoose.Schema({
  serviceId: { type: String, required: true },
  serviceTitle: { type: String, required: true },
  // duration: { type: mongoose.Schema.Types.Mixed, required: true },

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
  
  // For backward compatibility with single service appointments
  serviceId: { type: String }, // Keep for existing single service appointments
  serviceTitle: { type: String }, // Keep for existing single service appointments
  
  // Appointment Details
  date: { type: Date, required: true },
  time: { type: String, required: true },
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
    cancelledBy: { type: String, enum: ['client', 'provider'] },
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
}
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


// Virtual for appointment end time
appointmentSchema.virtual('endTime').get(function() {
  const [hours, minutes] = this.time.split(':').map(Number);
  const startDate = new Date(this.date);
  startDate.setHours(hours, minutes);
  const totalDuration = this.totalDuration || parseInt(this.duration) || 90;
  const endDate = new Date(startDate.getTime() + totalDuration * 60000);
  return endDate.toTimeString().slice(0, 5);
});

const appointmentModel = mongoose.models.appointment || 
  mongoose.model("appointment", appointmentSchema);

export default appointmentModel;