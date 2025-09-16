import { Resend } from 'resend';

// Since we can't directly import JSX files in Node, we'll use a different approach
const resend = new Resend(process.env.RESEND_API_KEY);

// Simple HTML email templates as functions that return HTML strings
const createClientEmail = (data) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Appointment Confirmation</title>
  <style>
    body { font-family: Arial, sans-serif; background-color: #f6f9fc; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; }
    .header { text-align: center; padding: 20px 0; }
    .details { background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .detail-item { margin: 8px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Appointment Confirmation</h1>
    </div>
    <p>Hi ${data.clientName},</p>
    <p>Your appointment has been successfully booked! Here are the details:</p>
    
    <div class="details">
      <p class="detail-item"><strong>Appointment ID:</strong> ${data.appointmentId}</p>
      <p class="detail-item"><strong>Provider:</strong> ${data.providerName}</p>
      <p class="detail-item"><strong>Services:</strong> ${data.services.map(s => s.serviceTitle).join(', ')}</p>
      <p class="detail-item"><strong>Date:</strong> ${new Date(data.date).toLocaleDateString()}</p>
      <p class="detail-item"><strong>Time:</strong> ${data.time}</p>
      <p class="detail-item"><strong>Total Amount:</strong> $${data.totalAmount} CAD</p>
      ${data.clientNotes ? `<p class="detail-item"><strong>Notes:</strong> ${data.clientNotes}</p>` : ''}
    </div>
    
    <hr>
    
    <p>We'll send you a reminder before your appointment. If you need to make any changes, 
    please contact us as soon as possible.</p>
    
    <p>Thank you for choosing our services!</p>
  </div>
</body>
</html>
`;

const createProviderEmail = (data) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Appointment Booking</title>
  <style>
    body { font-family: Arial, sans-serif; background-color: #f6f9fc; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; }
    .header { text-align: center; padding: 20px 0; }
    .details { background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .detail-item { margin: 8px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Appointment Booking</h1>
    </div>
    <p>Hi ${data.providerName},</p>
    <p>You have a new appointment booking:</p>
    
    <div class="details">
      <p class="detail-item"><strong>Appointment ID:</strong> ${data.appointmentId}</p>
      <p class="detail-item"><strong>Client:</strong> ${data.clientName}</p>
      <p class="detail-item"><strong>Email:</strong> ${data.clientEmail}</p>
      <p class="detail-item"><strong>Phone:</strong> ${data.clientPhone}</p>
      <p class="detail-item"><strong>Services:</strong> ${data.services.map(s => s.serviceTitle).join(', ')}</p>
      <p class="detail-item"><strong>Date:</strong> ${new Date(data.date).toLocaleDateString()}</p>
      <p class="detail-item"><strong>Time:</strong> ${data.time}</p>
      <p class="detail-item"><strong>Amount:</strong> $${data.totalAmount} CAD</p>
      ${data.clientNotes ? `<p class="detail-item"><strong>Client Notes:</strong> ${data.clientNotes}</p>` : ''}
    </div>
    
    <hr>
    
    <p>Please prepare for this appointment and contact the client if needed.</p>
  </div>
</body>
</html>
`;

const createAdminEmail = (data) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Appointment Booking - Admin Notification</title>
  <style>
    body { font-family: Arial, sans-serif; background-color: #f6f9fc; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; }
    .header { text-align: center; padding: 20px 0; }
    .details { background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .detail-item { margin: 8px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Appointment - Admin Notification</h1>
    </div>
    <p>A new appointment has been booked in the system:</p>
    
    <div class="details">
      <p class="detail-item"><strong>Appointment ID:</strong> ${data.appointmentId}</p>
      <p class="detail-item"><strong>Client:</strong> ${data.clientName}</p>
      <p class="detail-item"><strong>Provider:</strong> ${data.providerName}</p>
      <p class="detail-item"><strong>Services:</strong> ${data.services.map(s => s.serviceTitle).join(', ')}</p>
      <p class="detail-item"><strong>Date:</strong> ${new Date(data.date).toLocaleDateString()}</p>
      <p class="detail-item"><strong>Time:</strong> ${data.time}</p>
      <p class="detail-item"><strong>Amount:</strong> $${data.totalAmount} CAD</p>
    </div>
    
    <hr>
    
    <p>This is an automated notification for administrative purposes.</p>
  </div>
</body>
</html>
`;

export const sendAppointmentEmails = async (appointmentData) => {
  try {
    const {
      appointmentId,
      clientName,
      clientEmail,
      providerName,
      providerEmail,
      services,
      date,
      time,
      totalAmount,
      clientNotes,
      clientPhone,
    } = appointmentData;

    // Create email HTML content
    const clientEmailHtml = createClientEmail({
      clientName,
      appointmentId,
      providerName,
      services,
      date,
      time,
      totalAmount,
      clientNotes,
    });

    const providerEmailHtml = createProviderEmail({
      providerName,
      appointmentId,
      clientName,
      clientEmail,
      clientPhone,
      services,
      date,
      time,
      totalAmount,
      clientNotes,
    });

    const adminEmailHtml = createAdminEmail({
      appointmentId,
      clientName,
      providerName,
      services,
      date,
      time,
      totalAmount,
    });

    // Send all emails
    const emailPromises = [
      // Client email
      resend.emails.send({
        from: process.env.FROM_EMAIL,
        to: clientEmail,
        subject: 'Appointment Confirmation',
        html: clientEmailHtml,
      }),
      
      // Provider email
      resend.emails.send({
        from: process.env.FROM_EMAIL,
        to: providerEmail,
        subject: 'New Appointment Booking',
        html: providerEmailHtml,
      }),
      
      // Admin email
      resend.emails.send({
        from: process.env.FROM_EMAIL,
        to: process.env.ADMIN_EMAIL,
        subject: `New Appointment - ${appointmentId}`,
        html: adminEmailHtml,
      }),
    ];

    const results = await Promise.allSettled(emailPromises);
    
    // Log results
    results.forEach((result, index) => {
      const emailType = ['Client', 'Provider', 'Admin'][index];
      if (result.status === 'fulfilled') {
        console.log(`✅ ${emailType} email sent successfully:`, result.value.id);
      } else {
        console.error(`❌ ${emailType} email failed:`, result.reason);
      }
    });

    return {
      success: true,
      results: results.map(r => r.status === 'fulfilled' ? r.value : null),
    };

  } catch (error) {
    console.error('❌ Error sending appointment emails:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};