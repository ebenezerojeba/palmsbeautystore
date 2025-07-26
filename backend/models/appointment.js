// import mongoose from "mongoose";

// const appointmentSchema = new mongoose.Schema({
//     userId: { type: String, required: true },
//     // serviceName: { type: String, required: true },
//     serviceId: { type: String, required: true },
//     serviceTitle: { type: String, required: true },
//     date: { type: Date, required: true },
//     time: { type: String, required: true },
//     isCompleted: { type: Boolean, default: false },
//     isPending: { type: Boolean, default: false },
//     isCancelled: { type: Boolean, default: false },
//   payment: { type: Boolean, default: false },
//     completedAt: { type: Date},
//     cancelleddAt: { type: Date},
//   }, {
//     timestamps: true 
//   });

//   // Add compound index for faster slot availability lookups
// appointmentSchema.index({ serviceId: 1, date: 1, time: 1, isCompleted: 1 });
// appointmentSchema.index({ isCompleted: 1, date: 1 }); 

  
// const appointmentModel = mongoose.models.appointment || mongoose.model("appointment", appointmentSchema);

// export default appointmentModel;




import mongoose from "mongoose";

// Enhanced Appointment Schema
const appointmentSchema = new mongoose.Schema({
  // Basic Info
  userId: { type: String, required: true },
  serviceId: { type: String, required: true },
  serviceTitle: { type: String, required: true },  
  
  // Appointment Details
  date: { type: Date, required: true },
  time: { type: String, required: true },
  duration: { type: String, required: true }, // in minutes
  
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
    paymentMethod: { type: String }, // 'paystack', 'flutterwave', etc.
    transactionId: { type: String },
    paymentDate: { type: Date },
    refundDate: { type: Date },
    refundAmount: { type: Number }
  },

  // Professional Notes
  serviceProviderNotes: {
    preAppointment: { type: String }, // Notes before appointment
    duringAppointment: { type: String }, // Notes during service
    postAppointment: { type: String }, // Follow-up notes
    privateNotes: { type: String } // Internal notes not visible to client
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
  }
}, {
  timestamps: true
});

// Indexes for better performance
appointmentSchema.index({ serviceId: 1, date: 1, time: 1, status: 1 });
appointmentSchema.index({ status: 1, date: 1 });
appointmentSchema.index({ userId: 1, status: 1 });
appointmentSchema.index({ 'payment.status': 1 });
appointmentSchema.index({ date: 1, status: 1 });

// Virtual for appointment end time
appointmentSchema.virtual('endTime').get(function() {
  const [hours, minutes] = this.time.split(':').map(Number);
  const startDate = new Date(this.date);
  startDate.setHours(hours, minutes);
  const endDate = new Date(startDate.getTime() + this.duration * 60000);
  return endDate.toTimeString().slice(0, 5);
});

const appointmentModel = mongoose.models.appointment || 
  mongoose.model("appointment", appointmentSchema);

export default appointmentModel
