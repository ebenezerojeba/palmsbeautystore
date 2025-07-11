 import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import dotenv from "dotenv";
import Stripe from 'stripe';
// import { orderConfirmation } from "../emails/orderConfirmation.js";
// import { transporter } from "../emails/transporter.js";

dotenv.config();

// Placing order from frontend
// import orderModel from "../models/orderModel.js";
// import dotenv from "dotenv";

// dotenv.config();
const stripe = new Stripe('sk_test_51RjXEb2L6kwlI8er0J1qObayleLNRtK9RTUlV8CibAcVowuYTKAipRDg71i5tMjSt09CtXBnhuxpKJHcIlhDqFIW00uRz9bzVA');

const placeOrder = async (req, res) => {
  try {
    const { 
      items, 
      amount,  
      address, 
      paymentMethod 
    } = req.body;

    const userName = `${address.firstName} ${address.lastName}`;
    const userEmail = address.email;
    const userPhone = address.phone;
    const fullAddress = `${address.address}, ${address.lga}, ${address.state}`;

    const orderData = {
      userId: null, // Guest order
      items,
      amount,
      address,
      paymentMethod,
      payment: paymentMethod === 'stripe',
      date: Date.now(),
    };

    let paymentIntent;

    // Create Stripe PaymentIntent for card payments
    if (paymentMethod === 'stripe') {
    paymentIntent = await stripe.paymentIntents.create({
  amount: Math.round((amount) * 100), // amount in cents
  currency: 'cad',
  metadata: {
    name: userName,
    email: userEmail,
  },
  receipt_email: userEmail,
});


      orderData.paymentIntentId = paymentIntent.id;
    }

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    res.json({
      success: true,
      message: "Order placed",
      orderId: newOrder._id,
      ...(paymentIntent && { clientSecret: paymentIntent.client_secret }),
    });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

  

   // Send Email to user
    // const sendOrder = async () => {
    //   console.log("Sending confirmation email to user");
    //   try {
    //     const info = await transporter.sendMail({
    //       from: '"Paragon Hub" <no-reply@paragonhub.com>',
    //       to: userEmail,
    //       subject: "Order Confirmation - Paragon Hub",
    //       html: emailHtml,
    //     });
    //     console.log("Confirmation email sent:", info.messageId);
    //   } catch (error) {
    //     console.error("Error sending confirmation email:", error);
    //     // Don't return here, continue with the function
    //   }
    // };

    // console.log("Calling sendOrder function");
    // await sendOrder();

    // Send Email to Admin
//     const sendAdmin = async () => {
//       console.log("Sending notification email to admin");
//       try {
//         const info = await transporter.sendMail({
//           from: '"Paragon Hub" <no-reply@paragonhub.com>',
//           to: "ojebaebenezer@gmail.com",
//           subject: `New Order Placed - Order ID: ${newOrder._id}`,
//           html: `
//   <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; background-color: #f9f9f9; border-radius: 8px; max-width: 600px; margin: auto;">
//     <h1 style="color: #4CAF50; font-size: 24px;">New Order Received</h1>
//     <p style="font-size: 16px;">A new order has been placed with the following details:</p>
    
//     <p><strong>Order ID:</strong> <span style="color: #333;">${
//       newOrder._id
//     }</span></p>
//     <p><strong>Name:</strong> <span style="color: #555;">${userName}</span></p>
//     <p><strong>Email:</strong> <span style="color: #555;">${userEmail}</span></p>
//     <p><strong>Address:</strong> <span style="color: #555;">${userAddress}</span></p>
    
//     <p><strong>Total Amount:</strong> <span style="color: #4CAF50;">₦${amount.toLocaleString()}</span></p>
//     <p><strong>Delivery Fee:</strong> <span style="color: #FF5722;">₦${deliveryFee.toLocaleString()}</span></p>
//     <p><strong>Payment Method:</strong> <span style="color: #555;">${
//       orderData.paymentMethod
//     }</span></p>
    
//     <p style="margin-top: 20px; font-size: 16px;"><strong>Items:</strong></p>
//     <ul style="list-style-type: none; padding: 0; margin: 0;">
//       ${items
//         .map(
//           (item) => `
//             <li style="border-bottom: 1px solid #eee; padding: 8px 0;">
//               <strong>${item.size}</strong> — ${item.name} 
//               (x${
//                 item.quantity
//               }) — <span style="color: #4CAF50;">₦${item.price.toLocaleString()}</span>
//             </li>`
//         )
//         .join("")}
//     </ul>
    
//     <p style="margin-top: 20px; font-size: 16px; color: #555;">Thank you for your attention to this order.</p>
//   </div>
// `,
//         });
//         console.log("Admin notification email sent:", info.messageId);
//       } catch (error) {
//         console.error("Error sending admin notification email:", error);
//         // Don't return here, continue with the function
//       }
//     };

//     console.log("Calling sendAdmin function");
//     await sendAdmin();

//     console.log("Order process completed successfully");
//     res.json({ success: true, message: "Order Placed" });
    
//   }
//   catch (error) {
//     console.error("Error in placeOrder function:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }




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
    const { userId } = req.body;
    const orders = await orderModel.find({ userId });
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ succcess: false, message: error.message });
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
