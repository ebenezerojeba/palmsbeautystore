// // utils/emailService.js
// import transporter from '../config/nodemailer.js';

// // Create transporter (configure based on your email provider)


// // ----------------- ADMIN EMAILS -----------------

// // Send admin notification email
// export const sendAdminNotificationEmail = async ({
//   type,
//   appointment,
//   userData,
//   services
// }) => {
//   try {
//     const appointmentDate = new Date(appointment.date).toLocaleDateString('en-US', {
//       weekday: 'long',
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric'
//     });

//     const servicesList = services.map(service =>
//       `• ${service.serviceTitle} (${service.duration} minutes - ${service.price})`
//     ).join('\n');

//     const totalAmount = services.reduce((sum, service) => sum + service.price, 0);

//     let subject, emailContent;

//     if (type === 'new_booking') {
//       subject = "🔔 New Appointment Booking - Payment Pending";
//       emailContent = generateAdminNewBookingEmail(userData, appointmentDate, appointment.time, servicesList, totalAmount, appointment);
//     } else if (type === 'payment_confirmed') {
//       subject = "✅ Appointment Payment Confirmed";
//       emailContent = generateAdminPaymentConfirmedEmail(userData, appointmentDate, appointment.time, servicesList, totalAmount, appointment);
//     }

//   const mailOptions = {
//   from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_USER}>`,
//   replyTo: process.env.EMAIL_REPLY_TO,
//   to:  process.env.ADMIN_EMAIL,
//   subject: subject,
//   html: emailContent,
//   // Add these headers to avoid spam
//   headers: {
//     'X-Priority': '3',
//     'X-MSMail-Priority': 'Normal',
//     'Importance': 'Normal'
//   }
// };

//     await transporter.sendMail(mailOptions);
//     console.log("Admin notification sent successfully");

//   } catch (error) {
//     console.error("Admin email sending failed:", error);
//     throw error;
//   }
// };

// // Generate admin new booking notification
// const generateAdminNewBookingEmail = (userData, appointmentDate, time, servicesList, totalAmount, appointment) => {
//   return `
//     <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//       <h2 style="color: #007bff;">🔔 New Appointment Booking</h2>

//       <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ffc107;">
//         <p><strong>Status:</strong> Payment Pending</p>
//       </div>

//       <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
//         <h3>Customer Information:</h3>
//         <p><strong>Name:</strong> ${userData.name}</p>
//         <p><strong>Email:</strong> ${userData.email}</p>
//         <p><strong>Phone:</strong> ${userData.phone || 'Not provided'}</p>
//       </div>

//       <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
//         <h3>Appointment Details:</h3>
//         <p><strong>Date:</strong> ${appointmentDate}</p>
//         <p><strong>Time:</strong> ${time}</p>
//         <p><strong>Duration:</strong> ${appointment.totalDuration} minutes</p>
//         <p><strong>Services:</strong></p>
//         <pre>${servicesList}</pre>
//         <p><strong>Total Amount:</strong> ${totalAmount} CAD</p>
//         ${appointment.clientNotes ? `<p><strong>Client Notes:</strong> ${appointment.clientNotes}</p>` : ''}
//       </div>

//       <p><em>This appointment will be confirmed once payment is completed.</em></p>
//     </div>
//   `;
// };

// // Generate admin payment confirmed notification
// const generateAdminPaymentConfirmedEmail = (userData, appointmentDate, time, servicesList, totalAmount, appointment) => {
//   return `
//     <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//       <h2 style="color: #28a745;">✅ Appointment Payment Confirmed</h2>

//       <div style="background-color: #d4edda; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #28a745;">
//         <p><strong>Status:</strong> Confirmed & Paid</p>
//       </div>

//       <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
//         <h3>Customer Information:</h3>
//         <p><strong>Name:</strong> ${userData.name}</p>
//         <p><strong>Email:</strong> ${userData.email}</p>
//         <p><strong>Phone:</strong> ${userData.phone || 'Not provided'}</p>
//       </div>

//       <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
//         <h3>Appointment Details:</h3>
//         <p><strong>Date:</strong> ${appointmentDate}</p>
//         <p><strong>Time:</strong> ${time}</p>
//         <p><strong>Duration:</strong> ${appointment.totalDuration} minutes</p>
//         <p><strong>Services:</strong></p>
//         <pre>${servicesList}</pre>
//         <p><strong>Amount Paid:</strong> ${totalAmount} CAD</p>
//         <p><strong>Transaction ID:</strong> ${appointment.payment?.transactionId || 'N/A'}</p>
//         ${appointment.clientNotes ? `<p><strong>Client Notes:</strong> ${appointment.clientNotes}</p>` : ''}
//       </div>

//       <p><strong>Action Required:</strong> Please prepare for this confirmed appointment.</p>
//     </div>
//   `;
// };

// // ----------------- USER EMAILS -----------------

// // Send appointment confirmation email
// export const sendAppointmentConfirmationEmail = async ({
//   userEmail,
//   userName,
//   appointment,
//   services,
//   paymentUrl,
//   isPaymentConfirmed = false
// }) => {
//   try {

//     const appointmentDate = new Date(appointment.date).toLocaleDateString('en-US', {
//       weekday: 'long',
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric'
//     });

//     const servicesList = services.map(service =>
//       `• ${service.serviceTitle} (${service.duration} minutes - $${service.price})`
//     ).join('\n');

//     const totalAmount = services.reduce((sum, service) => sum + service.price, 0);

//     const subject = isPaymentConfirmed
//       ? "Appointment Confirmed - Payment Received"
//       : "Appointment Booking - Please Complete Payment";

//     const emailContent = isPaymentConfirmed
//       ? generatePaymentConfirmedEmail(userName, appointmentDate, appointment.time, servicesList, totalAmount)
//       : generateBookingConfirmationEmail(userName, appointmentDate, appointment.time, servicesList, totalAmount, paymentUrl);

//     const mailOptions = {
//   from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_USER}>`,
//   replyTo: process.env.EMAIL_REPLY_TO,
//   to: userEmail, // or process.env.ADMIN_EMAIL for admin
//   subject: subject,
//   html: emailContent,
//   // Add these headers to avoid spam
//   headers: {
//     'X-Priority': '3',
//     'X-MSMail-Priority': 'Normal',
//     'Importance': 'Normal'
//   }
// };

//     await transporter.sendMail(mailOptions);
//     console.log(`Email sent successfully to ${userEmail}`);

//   } catch (error) {
//     console.error("Email sending failed:", error);
//     throw error;
//   }
// };

// // Generate booking confirmation email template
// const generateBookingConfirmationEmail = (userName, appointmentDate, time, servicesList, totalAmount, paymentUrl) => {
//   return `
//     <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//       <h2>Appointment Booking Confirmation</h2>

//       <p>Dear ${userName},</p>
//       <p>Thank you for booking an appointment with us. Your appointment has been reserved and is pending payment confirmation.</p>

//       <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
//         <h3>Appointment Details:</h3>
//         <p><strong>Date:</strong> ${appointmentDate}</p>
//         <p><strong>Time:</strong> ${time}</p>
//         <p><strong>Services:</strong></p>
//         <pre>${servicesList}</pre>
//         <p><strong>Total Amount:</strong> $${totalAmount} CAD</p>
//       </div>

//       <div style="text-align: center; margin: 30px 0;">
//         <a href="${paymentUrl}" style="background-color: #007bff; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px;">
//           Complete Payment
//         </a>
//       </div>

//       <p><strong>Important:</strong> Please complete your payment within 24 hours to confirm your appointment.</p>
//       <p>If you have any questions, please contact us.</p>
//       <p>Best regards,<br>Your Service Team</p>
//     </div>
//   `;
// };

// // Generate payment confirmed email template
// const generatePaymentConfirmedEmail = (userName, appointmentDate, time, servicesList, totalAmount) => {
//   return `
//     <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//       <h2 style="color: #28a745;">Appointment Confirmed!</h2>

//       <p>Dear ${userName},</p>
//       <p>Your payment has been received and your appointment is now confirmed.</p>

//       <div style="background-color: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
//         <h3>Confirmed Appointment Details:</h3>
//         <p><strong>Date:</strong> ${appointmentDate}</p>
//         <p><strong>Time:</strong> ${time}</p>
//         <p><strong>Services:</strong></p>
//         <pre>${servicesList}</pre>
//         <p><strong>Total Paid:</strong> $${totalAmount} CAD</p>
//       </div>

//       <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;">
//         <p><strong>Reminder:</strong> Please arrive 10 minutes early for your appointment.</p>
//       </div>

//       <p>We look forward to seeing you. If you need to reschedule or have any questions, please contact us.</p>
//       <p>Best regards,<br>Your Service Team</p>
//     </div>
//   `;
// };
