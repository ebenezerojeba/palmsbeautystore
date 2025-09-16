// import nodemailer from "nodemailer";
// import dotenv from "dotenv";
// dotenv.config();

// const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST,
//   port: process.env.SMTP_PORT,
//   secure: process.env.SMTP_PORT == 465, // true if 465, false if 587
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASSWORD,
//   },
//   tls: {
//     rejectUnauthorized: false,
//   },
// });

// // Verify connection
// transporter.verify((error, success) => {
//   if (error) {
//     console.log("❌ Email transporter error:", error);
//   } else {
//     console.log("✅ Email server is ready to take messages");
//   }
// });

// // Test email
// const testEmail = async () => {
//   try {
//     const info = await transporter.sendMail({
//       from: `"Palms Beauty Store" <${process.env.EMAIL_USER}>`,
//       to: process.env.ADMIN_EMAIL,
//       subject: "Test Email",
//       text: "This is a test email from Palms Beauty Store using domain email.",
//     });
//     console.log("✅ Test email sent:", info.messageId);
//   } catch (error) {
//     console.error("❌ Test email failed:", error);
//     console.error("Error details:", error.response || error.message);
//   }
// };

// testEmail();

// export default transporter;




































// import nodemailer from "nodemailer";
// import dotenv from "dotenv";
// dotenv.config();

// // Validate required environment variables
// const requiredEnvVars = ['SMTP_HOST', 'SMTP_PORT', 'EMAIL_USER', 'EMAIL_PASSWORD'];
// const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

// if (missingVars.length > 0) {
//   console.error('❌ Missing required environment variables:', missingVars.join(', '));
//   process.exit(1);
// }

// const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST,
//   port: parseInt(process.env.SMTP_PORT),
//   secure: process.env.SMTP_PORT == 465, // true if 465, false if 587
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASSWORD,
//   },
//   tls: {
//     rejectUnauthorized: false,
//   },
//   // Add these for better debugging
//   debug: true,
//   logger: true,
// });

// // Verify connection with better error handling
// transporter.verify((error, success) => {
//   if (error) {
//     console.log("❌ Email transporter error:", error.message);
//     console.log("Full error details:", error);
    
//     // Common error hints
//     if (error.code === 'EAUTH') {
//       console.log("💡 Authentication failed. Check EMAIL_USER and EMAIL_PASSWORD");
//     } else if (error.code === 'ECONNECTION') {
//       console.log("💡 Connection failed. Check SMTP_HOST and SMTP_PORT");
//     } else if (error.code === 'ETIMEDOUT') {
//       console.log("💡 Connection timeout. Your hosting provider might block SMTP");
//     }
//   } else {
//     console.log("✅ Email server is ready to take messages");
//   }
// });

// // Test email with better error reporting
// const testEmail = async () => {
//   try {
//     console.log("📧 Sending test email...");
//     console.log("From:", process.env.EMAIL_USER);
//     console.log("To:", process.env.ADMIN_EMAIL);
    
//     const info = await transporter.sendMail({
//       from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_USER}>`,
//       to: process.env.ADMIN_EMAIL,
//       subject: "Test Email - Domain Setup",
//       text: "This is a test email from your Palmsbeautystore email setup.",
//       html: `
//         <h2>Test Email Success!</h2>
//         <p>(<strong>${process.env.EMAIL_USER}</strong>) is now working correctly.</p>
//         <p>SMTP Host: ${process.env.SMTP_HOST}</p>
//         <p>SMTP Port: ${process.env.SMTP_PORT}</p>
//       `,
//     });
    
//     console.log("✅ Test email sent successfully!");
//     console.log("Message ID:", info.messageId);
//     console.log("Response:", info.response);
//   } catch (error) {
//     console.error("❌ Test email failed:", error.message);
    
//     // Detailed error information
//     if (error.responseCode) {
//       console.error("Response Code:", error.responseCode);
//     }
//     if (error.response) {
//       console.error("Server Response:", error.response);
//     }
    
//     // Common solutions
//     console.log("\n🔧 Troubleshooting tips:");
//     console.log("1. Verify SMTP settings with your hosting provider");
//     console.log("2. Check if your hosting blocks outgoing SMTP connections");
//     console.log("3. Ensure EMAIL_PASSWORD is correct (not your cPanel password)");
//     console.log("4. Try port 465 with secure: true if 587 doesn't work");
//   }
// };

// // Run test
// testEmail();

// export default transporter;








































import nodemailer from "nodemailer";

// Direct configuration without env variables
const emailConfig = {
  // Try port 465 with secure connection instead
  host: "mail.palmsbeautystore.com", 
  port: 465, // Changed from 587 to 465
  secure: true, // Changed to true for port 465
  
  // Email credentials
  user: "Stylebyesther@palmsbeautystore.com",
  password: "Lastarross23*", // Get this from cPanel > Email Accounts
  
  // Email details
  fromName: "Palmsbeautystore",
  adminEmail: "ayindegeorge20@gmail.com",
  replyTo: "noreply@palmsbeautystore.com"
};

const transporter = nodemailer.createTransport({
  host: emailConfig.host,
  port: emailConfig.port,
  secure: emailConfig.secure,
  auth: {
    user: emailConfig.user,
    pass: emailConfig.password,
  },
  tls: {
    rejectUnauthorized: false,
  },
  // Enable debugging
  debug: true,
  logger: true,
});

// Verify connection
transporter.verify((error, success) => {
  if (error) {
    console.log("❌ Email transporter error:", error.message);
    
    // Common error solutions
    if (error.code === 'EAUTH') {
      console.log("💡 Authentication failed - check email and password");
      console.log("💡 Make sure you're using the email password, not cPanel password");
    } else if (error.code === 'ECONNECTION') {
      console.log("💡 Connection failed - check SMTP host and port");
      console.log(`💡 Current settings: ${emailConfig.host}:${emailConfig.port}`);
    } else if (error.code === 'ETIMEDOUT') {
      console.log("💡 Connection timeout - your host might block SMTP ports");
    }
    
    console.log("\n🔧 Try these common SMTP settings for domain emails:");
    console.log("Host: mail.yourdomain.com, Port: 587");
    console.log("Host: mail.yourdomain.com, Port: 465 (secure: true)");
    console.log("Host: mail.yourdomain.com, Port: 25");
    
  } else {
    console.log("✅ Email server is ready to take messages");
  }
});

// Test email function
const testEmail = async () => {
  try {
    console.log("📧 Sending test email...");
    console.log("From:", emailConfig.user);
    console.log("To:", emailConfig.adminEmail);
    console.log("SMTP:", `${emailConfig.host}:${emailConfig.port}`);
    
    const info = await transporter.sendMail({
      from: `"${emailConfig.fromName}" <${emailConfig.user}>`,
      to: emailConfig.adminEmail,
      subject: "Test Email - Domain Setup Working!",
      text: "This is a test email from your domain email setup.",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #28a745;">✅ Domain Email Working!</h2>
          <p>Your domain email (<strong>${emailConfig.user}</strong>) is now configured correctly.</p>
          <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3>Configuration Details:</h3>
            <p><strong>SMTP Host:</strong> ${emailConfig.host}</p>
            <p><strong>SMTP Port:</strong> ${emailConfig.port}</p>
            <p><strong>Secure:</strong> ${emailConfig.secure}</p>
            <p><strong>From:</strong> ${emailConfig.user}</p>
          </div>
          <p>You can now use this transporter to send emails from your application!</p>
        </div>
      `,
    });
    
    console.log("✅ Test email sent successfully!");
    console.log("Message ID:", info.messageId);
    
  } catch (error) {
    console.error("❌ Test email failed:", error.message);
    
    if (error.responseCode) {
      console.error("Response Code:", error.responseCode);
    }
    
    console.log("\n🔧 Quick fixes to try:");
    console.log("1. Change the host to: mail.palmsbeautystore.com");
    console.log("2. Try port 465 with secure: true");
    console.log("3. Try port 25 or 2525");
    console.log("4. Check if your email password is correct");
    console.log("5. Contact your hosting provider for exact SMTP settings");
  }
};

// Run the test
// testEmail();

// Export the transporter for use in other files
export default transporter;

// Alternative configurations to try if the above doesn't work
export const alternativeConfigs = [
  {
    name: "Port 465 (Secure)",
    host: "mail.palmsbeautystore.com",
    port: 465,
    secure: true
  },
  {
    name: "Port 25",
    host: "mail.palmsbeautystore.com", 
    port: 25,
    secure: false
  },
  {
    name: "Alternative Port",
    host: "mail.palmsbeautystore.com",
    port: 2525,
    secure: false
  }
];

// Function to test alternative configurations
export const testAlternativeConfig = async (config) => {
  const altTransporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: emailConfig.user,
      pass: emailConfig.password,
    },
    tls: {
      rejectUnauthorized: false,
    }
  });

  try {
    await altTransporter.verify();
    console.log(`✅ ${config.name} configuration works!`);
    return altTransporter;
  } catch (error) {
    console.log(`❌ ${config.name} failed:`, error.message);
    return null;
  }
};