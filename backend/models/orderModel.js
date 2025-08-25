
import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: false, // Allow null for guest orders
        default: null 
    },
    items: [{
        product: { type: String, required: true, ref: 'product' },
        quantity: { type: Number, required: true },
        size: { type: String, required: false },
        price: { type: Number, required: true },
        name: { type: String, required: true } // Store product name for reference
    }],
    amount: { type: Number, required: true },
    address: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        addressLine: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        lga: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true, default: 'Canada' }
    },
    isPaid: { type: Boolean, required: true, default: false },
    status: { type: String, required: true, default: 'Order Placed' },
    paymentMethod: { type: String, required: true },
    payment: { type: Boolean, required: true, default: false },
    date: { type: Number, required: true },
    stripeSessionId: { type: String, required: false }, // For tracking Stripe payments
    isGuestOrder: { type: Boolean, default: false }, // Flag for guest orders
    paymentStatus: { type: String, default: 'pending' } // Track payment status
}, { timestamps: true });

const orderModel = mongoose.models.order || mongoose.model('order', orderSchema);

export default orderModel;