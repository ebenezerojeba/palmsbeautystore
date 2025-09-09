import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD, // Ensure this matches your .env variable
  },
  tls: {
    rejectUnauthorized: false,
   }
  
})

// Verify connection configuration
transporter.verify(function (error, success) {
  if (error) {
    console.log("❌ Email transporter error:", error);
  } else {
    console.log("✅ Email server is ready to take our messages");
  }
});

// Add this to test your email configuration  
const testEmail = async () => {
  try {
    const testInfo = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send to yourself
      subject: 'Test Email',
      text: 'Testing if this transporter works WITH ENV VARIABLES!',
    });
    console.log('✅ Test email sent:', testInfo.messageId);
  } catch (error) {
    console.error('❌ Test email failed:', error);
    console.error('Error details:', error.response || error.message);
  }
};

// // // Call this function to test
// testEmail();


export default transporter;

