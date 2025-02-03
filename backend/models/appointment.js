import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
    serviceId: { type: String, required: true },
    serviceTitle: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    isCompleted: { type: Boolean, default: false },
    userDetails: {
      name: { type: String,  },
      email: { type: String,  },
      phone: { type: String,  },
    },
  });

  
const appointmentModel = mongoose.models.appointment || mongoose.model("appointment", appointmentSchema);

export default appointmentModel;
