import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    maxLength: 255,
  },
  description: {
    type: String,
    trim: true,
  },
  duration: {
    type: String,
    trim: true,
  },
  price: {
    type: String,
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
    // Add this field to track which providers offer this service
  providers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Provider'
  }],
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

  requirements: [{
    type: String,
    maxlength: 200
  }],
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  rating: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 }
  },
  bookingSettings: {
    advanceBookingDays: { 
      type: Number, 
      default: 30, // How far in advance can be booked
      min: 1
    },
    cancellationPolicy: {
      hours: { type: Number, default: 24 }, // Hours before appointment
      refundPercentage: { type: Number, default: 100, min: 0, max: 100 }
    },
    maxBookingsPerDay: {
      type: Number,
      default: null // null = unlimited
    }
  }
});

// Update the updatedAt field before saving
serviceSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

// Create indexes for better performance
serviceSchema.index({ createdAt: -1 });
// Add these indexes to your schema
serviceSchema.index({ isCategory: 1, isActive: 1 });
serviceSchema.index({ parentService: 1, isCategory: 1, isActive: 1 });

const serviceModel =
  mongoose.models.service || mongoose.model("Service", serviceSchema);
export default serviceModel;












// import mongoose from "mongoose";

// const serviceVariantSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   description: {
//     type: String,
//     trim: true
//   },
//   duration: {
//     type: String,
//     trim: true
//   },
//   price: {
//     type: String,
//     trim: true
//   },
//   isActive: {
//     type: Boolean,
//     default: true
//   },
//   requirements: [{
//     type: String,
//     maxlength: 200
//   }],
//   // Additional variant-specific fields
//   difficulty: {
//     type: String,
//     enum: ['Easy', 'Medium', 'Hard'],
//     default: 'Medium'
//   }
// });

// const serviceSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true,
//     trim: true,
//     maxLength: 255,
//   },
//   description: {
//     type: String,
//     trim: true,
//   },
//   // Default duration and price (can be overridden by variants)
//   duration: {
//     type: String,
//     trim: true,
//   },
//   price: {
//     type: String,
//     trim: true,
//   },
//   image: {
//     type: String,
//     default: null,
//   },
//   imagePublicId: {
//     type: String,
//     default: null,
//   },
//   // Providers who offer this service (and all its variants)
//   providers: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Provider'
//   }],
//   isActive: {
//     type: Boolean,
//     default: true,
//   },
//   // Service variants - all sub-services under this main service
//   variants: [serviceVariantSchema],
  
//   // Category information
//   isCategory: { 
//     type: Boolean, 
//     default: false 
//   },
  
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
//   updatedAt: {
//     type: Date,
//     default: Date.now,
//   },
//   requirements: [{
//     type: String,
//     maxlength: 200
//   }],
//   tags: [{
//     type: String,
//     trim: true,
//     lowercase: true
//   }],
//   rating: {
//     average: { type: Number, default: 0, min: 0, max: 5 },
//     count: { type: Number, default: 0 }
//   },
//   bookingSettings: {
//     advanceBookingDays: { 
//       type: Number, 
//       default: 30,
//       min: 1
//     },
//     cancellationPolicy: {
//       hours: { type: Number, default: 24 },
//       refundPercentage: { type: Number, default: 100, min: 0, max: 100 }
//     },
//     maxBookingsPerDay: {
//       type: Number,
//       default: null
//     }
//   }
// });

// // Update the updatedAt field before saving
// serviceSchema.pre("save", function (next) {
//   this.updatedAt = new Date();
//   next();
// });

// // Create indexes for better performance
// serviceSchema.index({ isActive: 1 });
// serviceSchema.index({ createdAt: -1 });
// serviceSchema.index({ 'variants.isActive': 1 });

// const serviceModel = mongoose.models.Service || mongoose.model("Service", serviceSchema);
// export default serviceModel;