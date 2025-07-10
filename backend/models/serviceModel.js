import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxLength: 255,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  duration: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String,
    default: null,
  },
  imagePublicId: {
    type: String,
    default: null,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  parentService: { type: mongoose.Schema.Types.ObjectId, ref: "Service" }, // For sub-services
  isCategory: { type: Boolean, default: false }, // To distinguish between categories and actual services
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
serviceSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

// Create indexes for better performance
serviceSchema.index({ isActive: 1 });
serviceSchema.index({ createdAt: -1 });

const serviceModel =
  mongoose.models.service || mongoose.model("Service", serviceSchema);
export default serviceModel;
