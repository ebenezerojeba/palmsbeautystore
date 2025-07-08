import nodemailer from 'nodemailer'
export const transporter = nodemailer.createTransport({
  service: 'gmail', // Use your email service (e.g., Gmail, Outlook)
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email password or app-specific password
  },
  tls:{
    rejectUnauthorized: false
  },
});

const sendAppointmentNotification = (appointment) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL, // Admin's email address
    subject: 'New appointment Received',
    text: `
      New Appointment Details:
      Service: ${appointment.serviceTitle}
      Date: ${appointment.date}
      Time: ${appointment.time}
      Customer Name: ${appointment.userDetails.name}
      Customer Email: ${appointment.userDetails.email}
      Customer Phone: ${appointment.userDetails.phone}
    `,
  };

  const mailOptionsUser = {
    from: process.env.EMAIL_USER,
    to: appointment.userDetails.email, // Send to the user's email
    subject: "Your Appointment Confirmation",
    text: `
      Hi ${appointment.userDetails.name},

      Your appointment for ${appointment.serviceTitle} has been confirmed.

      Date: ${appointment.date}
      Time: ${appointment.time}

      Thank you for choosing Palms Beauty Services!

      Best regards,
      Palms Beauty Team
    `,
  }
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }

    transporter.sendMail(mailOptionsUser, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
          } else {
            console.log('Email sent:', info.response);
          }
    })
  });
};

export default sendAppointmentNotification;