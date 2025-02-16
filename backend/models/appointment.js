import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
    serviceId: { type: String, required: true },
    serviceTitle: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    isCompleted: { type: Boolean, default: false },
    isPending: { type: Boolean, default: false },
    isCancelled: { type: Boolean, default: false },
    completedAt: { type: Date},
    cancelleddAt: { type: Date},
    userDetails: {
      name: { type: String,  },
      email: { type: String,  },
      phone: { type: String,  },
    },
  }, {
    timestamps: true 
  });

  // Add compound index for faster slot availability lookups
appointmentSchema.index({ serviceId: 1, date: 1, time: 1, isCompleted: 1 });
appointmentSchema.index({ isCompleted: 1, date: 1 }); 

  
const appointmentModel = mongoose.models.appointment || mongoose.model("appointment", appointmentSchema);

export default appointmentModel;
