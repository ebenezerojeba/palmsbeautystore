import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true // Changed to true to require userId
  },

  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true }, // Proper ref
    name: { type: String, required: true }, // Store product name for quick reference

    // Variation details
    size: { type: String },
    length: { type: String },
    color: { type: String },
    texture: { type: String },
    weight: { type: String },
    sku: { type: String }, 
    image: { type: String }, // Store one image for quick display

    price: { type: Number, required: true }, // Final price at purchase time
    quantity: { type: Number, required: true }
  }],

  amount: { type: Number, required: true }, // Order total

  address: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true }, // Fix naming mismatch
    city: { type: String, required: true },
    state: { type: String, required: true },
    lga: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true, default: 'Canada' }
  },

  isPaid: { type: Boolean, default: false },
  status: { type: String, default: 'Order Placed' },
  paymentMethod: { type: String, required: true }, // e.g. "Stripe", "Paystack"
  payment: { type: Boolean, default: false },
  paymentStatus: { type: String, default: 'pending' }, // pending, completed, failed

  date: { type: Number, required: true },
  stripeSessionId: { type: String }
}, { timestamps: true });

const orderModel = mongoose.models.order || mongoose.model('order', orderSchema);

export default orderModel;
