
import { Resend } from 'resend';
import { render } from '@react-email/render';
// import { AppointmentAdminEmail, AppointmentClientEmail, AppointmentProviderEmail } from '../../frontend/email/Appointment';
import { AppointmentAdminEmail, AppointmentClientEmail, AppointmentProviderEmail } from '../emails/Appointment.js';
const resend = new Resend(process.env.RESEND_API_KEY);

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

    // Email to Client
    const clientEmailHtml = render(
      AppointmentClientEmail({
        clientName,
        appointmentId,
        providerName,
        services,
        date,
        time,
        totalAmount,
        clientNotes,
      })
    );

    // Email to Provider
    const providerEmailHtml = render(
      AppointmentProviderEmail({
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
      })
    );

    // Email to Admin
    const adminEmailHtml = render(
      AppointmentAdminEmail({
        appointmentId,
        clientName,
        providerName,
        services,
        date,
        time,
        totalAmount,
      })
    );

    // Send all emails
    const emailPromises = [
      // Client email
      resend.emails.send({
        from: process.env.FROM_EMAIL, // e.g., 'noreply@yourdomain.com'
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
        to: process.env.ADMIN_EMAIL, // Add this to your .env
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
