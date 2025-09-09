// Create a provider model
import mongoose from "mongoose";
const providerSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  services: [{
    type: Schema.Types.ObjectId,
    ref: 'Service'
  }],
  workingHours: [{
    dayOfWeek: Number,
    startTime: String,
    endTime: String,
    isWorking: Boolean
  }],
  breaks: [{
    date: Date,
    startTime: String,
    endTime: String,
    reason: String
  }],
  isActive: {
    type: Boolean,
    default: true
  }
});

const providerModel = mongoose.models.Provider || mongoose.model("Provider", providerSchema);
export default providerModel;