import nodemailer from "nodemailer";
import dotenv from "dotenv";
import providerModel from "../models/providerModel.js";
import { emailTemplates } from "./emailTemplates.js";
dotenv.config();

// Create transporter

const transporter = nodemailer.createTransport({
  service: "gmail", // or your email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

await transporter.verify();
console.log("✅ Nodemailer transporter is ready to send messages");
console.log(`📧 Using service: ${process.env.EMAIL_SERVICE || "gmail"}`);
console.log(`📧 From address: ${process.env.EMAIL_FROM_NAME}`);
console.log(`📧 Admin MAIL: ${process.env.ADMIN_NOTIFICATION_EMAIL}`);

// Send email function
const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: `"Palms Beauty Store" <${process.env.EMAIL_USER}`,
      to,
      subject,
      html,
      attachemnt: []
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(mailOptions);
    console.log("Email sent successfully:", result.messageId);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

// Send booking confirmation emails
export const sendBookingEmails = async (appointmentData) => {
  try {
    // Send to client
    const clientTemplate =
      emailTemplates.clientBookingConfirmation(appointmentData);
    await sendEmail(
      appointmentData.userEmail,
      clientTemplate.subject,
      clientTemplate.html
    );

    // Send to provider
    const provider = await providerModel.findById(appointmentData.providerId);
    if (provider && provider.email) {
      const providerTemplate =
        emailTemplates.providerNewBooking(appointmentData);
      await sendEmail(
        provider.email,
        providerTemplate.subject,
        providerTemplate.html
      );
    }

    // Send to admin
    if (process.env.ADMIN_NOTIFICATION_EMAIL) {
      const adminTemplate = emailTemplates.adminNewBooking(appointmentData);
      await sendEmail(
        process.env.ADMIN_NOTIFICATION_EMAIL,
        adminTemplate.subject,
        adminTemplate.html
      );
    }

    console.log("All booking emails sent successfully");
    return true;
  } catch (error) {
    console.error("Error sending booking emails:", error);
    return false;
  }
};


// NEW: Send order confirmation emails
export const sendOrderEmails = async (orderData) => {
  try {
    // Send confirmation to customer
    const customerTemplate = emailTemplates.orderConfirmation(orderData);
    await sendEmail(
      orderData.address.email,
      customerTemplate.subject,
      customerTemplate.html
    );

    // Send notification to admin
    if (process.env.ADMIN_NOTIFICATION_EMAIL) {
      const adminTemplate = emailTemplates.adminOrderNotification(orderData);
      await sendEmail(
        process.env.ADMIN_NOTIFICATION_EMAIL,
        adminTemplate.subject,
        adminTemplate.html
      );
    }

    console.log("All order emails sent successfully");
    return true;
  } catch (error) {
    console.error("Error sending order emails:", error);
    return false;
  }
};


export default transporter;
