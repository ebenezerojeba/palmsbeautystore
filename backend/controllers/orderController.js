 import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import dotenv from "dotenv";
import Stripe from 'stripe';
import { sendOrderEmails } from "../services/emailService.js";
dotenv.config()

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const placeOrder = async (req, res) => {
   // Check if userId is available (user is authenticated)
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication required. Please sign in to place an order."
      });
    }
  try {
    const { 
      items, 
      amount,  
      address, 
      paymentMethod,
      subtotal,
      taxes,
      deliveryFee
    } = req.body;

    const origin = req.get('origin') || 'http://localhost:3000';

    // Validate required fields
    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "No items in cart" });
    }

    if (!address || !address.firstName || !address.email) {
      return res.status(400).json({ success: false, message: "Address information is required" });
    }
    

       // Validate amount
    if (!amount || amount <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid order amount" 
      });
    }

    // Prepare line items for Stripe Checkout
   const lineItems = items.map(item => {
  const unitPrice = parseFloat(item.price);
  if (isNaN(unitPrice)) {
    throw new Error(`Invalid price for item: ${item.name || item._id}`);
  }

  return {
    price_data: {
      currency: 'cad',
      product_data: {
        name: item.name || 'Unnamed Product',
        description: [
          item.size,
          item.length,
          item.color,
          item.description
        ].filter(Boolean).join(" | "),
      },
      unit_amount: Math.round(unitPrice * 100),
    },
    quantity: item.quantity,
  };
});

    // Add delivery fee as a line item if it exists
    const deliveryAmount = parseFloat(deliveryFee) || parseFloat(address.deliveryFee) || 0;
    if (deliveryAmount > 0) {
      lineItems.push({
        price_data: {
          currency: 'cad',
          product_data: {
            name: 'Delivery Fee',
            description: `Shipping to ${address.city}, ${address.state}`,
          },
          unit_amount: Math.round(deliveryAmount * 100), // Convert to cents
        },
        quantity: 1,
      });
    }

    // Add taxes as a line item if they exist
    const taxAmount = parseFloat(taxes) || 0;
    if (taxAmount > 0) {
      lineItems.push({
        price_data: {
          currency: 'cad',
          product_data: {
            name: 'Taxes',
            description: `Tax for ${address.state}`,
          },
          unit_amount: Math.round(taxAmount * 100), // Convert to cents
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${origin}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart`,
      customer_email: address.email,
      metadata: {
        firstName: address.firstName,
        lastName: address.lastName,
        address: `${address.address}, ${address.city}, ${address.state} ${address.postalCode}`,
        phone: address.phone,
    
      }
    });

    // Save order to database for guest users
    const orderItems = items.map(item => ({
      product: item.productId || item._id, // handle both naming cases
      name: item.name,
      length: item.length,
      color: item.color,
      size: item.size,
      texture: item.texture,
      weight: item.weight,
      sku: item.sku,
      price: item.price,
      quantity: item.quantity,
      image: item.image
    }));

    const orderData = {
      userId: req.userId , // Use req.userId if available
      items: orderItems,
      amount: parseFloat(amount),
      address: {
        firstName: address.firstName,
        lastName: address.lastName,
        email: address.email,
        phone: address.phone,
        address: address.address, // Match schema field name
        city: address.city,
        state: address.state,
        lga: address.lga,
        postalCode: address.postalCode,
        country: address.country
      },
      paymentMethod,
      isPaid: false,
      status: 'Order Placed',
      payment: false,
      date: Date.now(),
      stripeSessionId: session.id,
      // isGuestOrder: true // Flag for guest orders
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

      // Send order confirmation emails (non-blocking)
    sendOrderEmails(newOrder.toObject()).catch(err => {
      console.error('Failed to send order emails:', err);
      // Don't fail the request if email sending fails
    });

    console.log("✅ Order created successfully and confirmation emails sent");


    res.json({
      success: true,
      message: "Proceed to payment",
      url: session.url,
      orderId: newOrder._id,
    });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message || "An error occurred while processing your order"
    });
  }
};


// Webhook to handle successful payments and send additional emails
const handleSuccessfulPayment = async (orderData) => {
  try {
    // Update order status to paid
    await orderModel.findByIdAndUpdate(orderData._id, {
      isPaid: true,
      payment: true,
      status: 'Paid - Processing'
    });

    console.log(`Order ${orderData._id} marked as paid`);
    return true;
  } catch (error) {
    console.error('Error updating order payment status:', error);
    return false;
  }
};


// All Orders data for Admin Panel
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ succcess: false, message: error.message });
  }
};
// User Order Data for frontend
const userOrders = async (req, res) => {
  try {
        
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication required"
      });
    }

    // Find all orders for the authenticated user
    const orders = await orderModel
      .find({ userId: req.userId })
      .populate('items.product', 'name image') // Populate product details if needed
      .sort({ date: -1 }); // Sort by newest first

    res.json({
      success: true,
      orders: orders
    });

  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching orders"
    });
  }
};
// Update order status from Admin Panel
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.log(error);
    res.json({ succcess: false, message: error.message });
  }
};

export {
  placeOrder,
  allOrders,
  userOrders,
  updateStatus,
};
