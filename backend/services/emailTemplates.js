export const emailTemplates = {
  clientBookingConfirmation: (appointmentData) => ({
    subject: `Appointment Confirmation - ${appointmentData.serviceTitle}`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Appointment Confirmation</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333333; background-color: #f8fafc;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: -0.5px;">
              ✓ Appointment Confirmed!
            </h1>
            <p style="color: #e2e8f0; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">
              We're excited to see you soon
            </p>
          </div>

          <!-- Content -->
          <div style="padding: 40px 30px;">
            <p style="font-size: 18px; color: #374151; margin: 0 0 24px 0;">
              Dear <strong>${appointmentData.userName}</strong>,
            </p>
            
            <p style="font-size: 16px; color: #6b7280; margin: 0 0 32px 0; line-height: 1.7;">
              Your appointment has been confirmed. Here are your appointment details:
            </p>
            
            <!-- Appointment Card -->
            <div style="background: black border-radius: 12px; padding: 32px; margin: 32px 0; border-left: 4px solid #667eea;">
              <h2 style="color: #1f2937; margin: 0 0 24px 0; font-size: 20px; font-weight: 600;">
                📅 Appointment Details
              </h2>
              
              <div style="display: grid; gap: 16px;">
                <div style="display: flex; align-items: center; padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                  <span style="color: #6b7280; font-weight: 500; min-width: 120px; font-size: 14px;">SERVICE</span>
                  <span style="color: #374151; font-weight: 600; font-size: 16px;">${appointmentData.serviceTitle}</span>
                </div>
                
                <div style="display: flex; align-items: center; padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                  <span style="color: #6b7280; font-weight: 500; min-width: 120px; font-size: 14px;">DATE</span>
                  <span style="color: #374151; font-weight: 600; font-size: 16px;">${new Date(appointmentData.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                
                <div style="display: flex; align-items: center; padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                  <span style="color: #6b7280; font-weight: 500; min-width: 120px; font-size: 14px;">TIME</span>
                  <span style="color: #374151; font-weight: 600; font-size: 16px;">${appointmentData.time}</span>
                </div>
                
                <div style="display: flex; align-items: center; padding: 12px 0;">
                  <span style="color: #6b7280; font-weight: 500; min-width: 120px; font-size: 14px;">TOTAL</span>
                  <span style="color: #059669; font-weight: 700; font-size: 18px;">$${appointmentData.payment.amount}</span>
                </div>
              </div>
            </div>
            
            <!-- Important Notes -->
            <div style="background-color: #fef3c7; border-radius: 8px; padding: 20px; margin: 32px 0; border-left: 4px solid #f59e0b;">
              <h3 style="color: #92400e; margin: 0 0 12px 0; font-size: 16px; font-weight: 600;">
                📝 Important Information
              </h3>
              <ul style="color: #92400e; margin: 0; padding-left: 16px; font-size: 14px; line-height: 1.6;">
                <li>Please arrive 10 minutes before your scheduled appointment time</li>
                <li>To reschedule or cancel, please contact us at least 24 hours in advance</li>
              </ul>
            </div>
            
            <!-- Contact Section -->
           <div style="text-align: center; padding: 24px 0; border-top: 2px solid #e5e7eb; margin-top: 40px;">
       <!-- Map Section -->
<div style="text-align: center; margin: 32px 0;">
  <a href="https://www.google.com/maps/place/33+Kenmount+Rd,+St.+John's,+NL+A1B+1W1,+Canada" 
     target="_blank" 
     style="display: block; text-decoration: none;">
    <div style="background-color: #f3f4f6; border-radius: 8px; padding: 20px; text-align: center;">
      <div style="font-size: 48px; margin-bottom: 16px;">🗺️</div>
      <p style="color: #374151; margin: 0; font-weight: 600;">View on Google Maps</p>
      <p style="color: #6b7280; margin: 8px 0 0 0; font-size: 14px;">
        33 Kenmount Rd, St. John's, NL A1B 1W1
      </p>
    </div>
  </a>
</div>
           <p style="color: #6b7280; font-size: 14px; margin: 0 0 8px 0;">
    Questions? We're here to help!
  </p>
  <p style="color: #374151; font-weight: 600; margin: 0; font-size: 16px;">
    The ${process.env.COMPANY_NAME || 'Appointment'} Team
  </p>

  <div style="margin-top: 16px;">
    <a href="https://facebook.com" style="margin: 0 8px; text-decoration: none;">
      <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook" width="24" height="24" style="display:inline-block;">
    </a>
    <a href="https://twitter.com" style="margin: 0 8px; text-decoration: none;">
      <img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Twitter" width="24" height="24" style="display:inline-block;">
    </a>
    <a href="https://instagram.com" style="margin: 0 8px; text-decoration: none;">
      <img src="https://cdn-icons-png.flaticon.com/512/733/733558.png" alt="Instagram" width="24" height="24" style="display:inline-block;">
    </a>
    <a href="https://linkedin.com" style="margin: 0 8px; text-decoration: none;">
      <img src="https://cdn-icons-png.flaticon.com/512/733/733561.png" alt="LinkedIn" width="24" height="24" style="display:inline-block;">
    </a>
  </div>
</div>
    </div>
          
        </div>
      </body>
      </html>
    `,
  }),

  providerNewBooking: (appointmentData) => ({
    subject: `New Appointment Booking - ${appointmentData.serviceTitle}`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Appointment Booking</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333333; background-color: #f8fafc;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        
        

          <!-- Header -->
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: -0.5px;">
              🔔 New Appointment Booking
            </h1>
            <p style="color: #d1fae5; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">
              A new client has booked with you
            </p>
          </div>

          <!-- Content -->
          <div style="padding: 40px 30px;">
            <p style="font-size: 18px; color: #374151; margin: 0 0 24px 0;">
              Hello <strong>${appointmentData.providerName}</strong>,
            </p>
            
            <p style="font-size: 16px; color: #6b7280; margin: 0 0 32px 0; line-height: 1.7;">
              You have received a new appointment booking. Please review the details below and prepare accordingly.
            </p>
            
            <!-- Appointment Card -->
            <div style="border-radius: 12px; padding: 32px; margin: 32px 0; border-left: 4px solid #10b981;">
              <h2 style="color: #1f2937; margin: 0 0 24px 0; font-size: 20px; font-weight: 600;">
                📅 Appointment Details
              </h2>
              
              <div style="display: grid; gap: 16px;">
                <div style="display: flex; align-items: center; padding: 12px 0; border-bottom: 1px solid #d1fae5;">
                  <span style="color: #059669; font-weight: 500; min-width: 120px; font-size: 14px;">SERVICE</span>
                  <span style="color: #00000; font-weight: 600; font-size: 16px;">${appointmentData.serviceTitle}</span>
                </div>
                
                <div style="display: flex; align-items: center; padding: 12px 0; border-bottom: 1px solid #d1fae5;">
                  <span style="color: #059669; font-weight: 500; min-width: 120px; font-size: 14px;">DATE & TIME</span>
                  <span style="color:#000000; font-weight: 600; font-size: 16px;">${new Date(appointmentData.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at ${appointmentData.time}</span>
                </div>
                
                <div style="display: flex; align-items: center; padding: 12px 0; border-bottom: 1px solid #d1fae5;">
                  <span style="color: #059669; font-weight: 500; min-width: 120px; font-size: 14px;">DURATION</span>
                  <span style="color: #000000; font-weight: 600; font-size: 16px;">${appointmentData.totalDuration} minutes</span>
                </div>
              </div>
            </div>
            
            <!-- Client Information -->
            <div style="border-radius: 12px; padding: 32px; margin: 32px 0; border-left: 4px solid #f59e0b;">
              <h2 style="margin: 0 0 24px 0; font-size: 20px; font-weight: 600;">
                 Client Information
              </h2>
              
              <div style="display: grid; gap: 16px;">
                <div style="display: flex; align-items: center; padding: 12px 0; border-bottom: 1px solid #fde68a;">
                  <span style="color: #059669; font-weight: 500; min-width: 120px; font-size: 14px;">NAME</span>
                  <span style="color: #000000; font-weight: 600; font-size: 16px;">${appointmentData.userName}</span>
                </div>
                
                <div style="display: flex; align-items: center; padding: 12px 0; border-bottom: 1px solid #fde68a;">
                  <span style="color: #059669; font-weight: 500; min-width: 120px; font-size: 14px;">EMAIL</span>
                  <span style="color: #000000; font-weight: 600; font-size: 16px;">${appointmentData.userEmail}</span>
                </div>
                
                <div style="display: flex; align-items: center; padding: 12px 0; ${appointmentData.clientNotes ? 'border-bottom: 1px solid #fde68a;' : ''}">
                  <span style="color: #059669; font-weight: 500; min-width: 120px; font-size: 14px;">PHONE</span>
                  <span style="color: #000000; font-weight: 600; font-size: 16px;">${appointmentData.userPhone}</span>
                </div>
                
                ${appointmentData.clientNotes ? `
                <div style="display: flex; align-items: flex-start; padding: 12px 0;">
                  <span style="color: #059669; font-weight: 500; min-width: 120px; font-size: 14px;">NOTES</span>
                  <span style="color: #000000; font-weight: 600; font-size: 16px; line-height: 1.5;">${appointmentData.clientNotes}</span>
                </div>
                ` : ''}
              </div>
            </div>
            
            
            <!-- Contact Section -->
            <div style="text-align: center; padding: 24px 0; border-top: 2px solid #e5e7eb; margin-top: 40px;">
              <p style="color: #6b7280; font-size: 14px; margin: 0 0 8px 0;">
                Need support? Contact the admin team
              </p>
              <p style="color: #374151; font-weight: 600; margin: 0; font-size: 16px;">
                The ${process.env.COMPANY_NAME || 'Appointment'} Team
              </p>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #f8fafc; padding: 24px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0; line-height: 1.5;">
              This notification was sent for a new appointment booking.<br/>
              Please do not reply to this email as this mailbox is not monitored.
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  adminNewBooking: (appointmentData) => ({
    subject: `New Appointment Booking Notification - ${appointmentData.serviceTitle}`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Admin Booking Notification</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333333; background-color: #f8fafc;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

          <!-- Header -->
          <div style="background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600; letter-spacing: -0.5px;">
              📊 Admin Notification
            </h1>
            <p style="color: #fffff; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">
              New appointment booking in the system
            </p>
          </div>

          <!-- Content -->
          <div style="padding: 40px 30px;">
            <p style="font-size: 18px; color: #374151; margin: 0 0 24px 0;">
              Hello <strong>Admin</strong>,
            </p>
            
            <p style="font-size: 16px; color: #6b7280; margin: 0 0 32px 0; line-height: 1.7;">
              A new appointment has been successfully booked in the system. Below are the complete details for your review and records.
            </p>
            
            <!-- Appointment Summary -->
            <div style="background:#00000 border-radius: 12px; padding: 32px; margin: 32px 0; border-left: 4px solid #7c3aed;">
              <h2 style="color: #1f2937; margin: 0 0 24px 0; font-size: 20px; font-weight: 600;">
                📅 Appointment Summary
              </h2>
              
              <div style="display: grid; gap: 16px;">
                <div style="display: flex; align-items: center; padding: 12px 0; border-bottom: 1px solid #e9d5ff;">
                  <span style="color: #7c3aed; font-weight: 500; min-width: 140px; font-size: 14px;">SERVICE</span>
                  <span style="color: #000000; font-weight: 600; font-size: 16px;">${appointmentData.serviceTitle}</span>
                </div>
                
                <div style="display: flex; align-items: center; padding: 12px 0; border-bottom: 1px solid #e9d5ff;">
                  <span style="color: #7c3aed; font-weight: 500; min-width: 140px; font-size: 14px;">DATE & TIME</span>
                  <span style="color: #000000; font-weight: 600; font-size: 16px;">${new Date(appointmentData.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at ${appointmentData.time}</span>
                </div>
                
                <div style="display: flex; align-items: center; padding: 12px 0; border-bottom: 1px solid #e9d5ff;">
                  <span style="color: #7c3aed; font-weight: 500; min-width: 140px; font-size: 14px;">DURATION</span>
                  <span style="color: #000000; font-weight: 600; font-size: 16px;">${appointmentData.totalDuration} minutes</span>
                </div>
                
                <div style="display: flex; align-items: center; padding: 12px 0; border-bottom: 1px solid #e9d5ff;">
                  <span style="color: #7c3aed; font-weight: 500; min-width: 140px; font-size: 14px;">PROVIDER</span>
                  <span style="color: #000000; font-weight: 600; font-size: 16px;">${appointmentData.providerName}</span>
                </div>
                
                <div style="display: flex; align-items: center; padding: 12px 0;">
                  <span style="color: #7c3aed; font-weight: 500; min-width: 140px; font-size: 14px;">TOTAL AMOUNT</span>
                  <span style="color: #059669; font-weight: 700; font-size: 18px;">$${appointmentData.payment.amount}</span>
                </div>
              </div>
            </div>
            
            <!-- Client Details -->
            <div style="border-radius: 12px; padding: 32px; margin: 32px 0; border-left: 4px solid;">
              <h2 style="margin: 0 0 24px 0; font-size: 20px; font-weight: 600;">
                👤 Client Details
              </h2>
              
              <div style="display: grid; gap: 16px;">
                <div style="display: flex; align-items: center; padding: 12px 0; border-bottom: 1px solid #bae6fd;">
                  <span style="color: #0369a1; font-weight: 500; min-width: 140px; font-size: 14px;">NAME</span>
                  <span style="color: #000000; font-weight: 600; font-size: 16px;">${appointmentData.userName}</span>
                </div>
                
                <div style="display: flex; align-items: center; padding: 12px 0; border-bottom: 1px solid #bae6fd;">
                  <span style="color: #0369a1; font-weight: 500; min-width: 140px; font-size: 14px;">EMAIL</span>
                  <span style="color: #000000; font-weight: 600; font-size: 16px;">${appointmentData.userEmail}</span>
                </div>
                
                <div style="display: flex; align-items: center; padding: 12px 0; ${appointmentData.clientNotes ? 'border-bottom: 1px solid #bae6fd;' : ''}">
                  <span style="color: #0369a1; font-weight: 500; min-width: 140px; font-size: 14px;">PHONE</span>
                  <span style="color: #000000; font-weight: 600; font-size: 16px;">${appointmentData.userPhone}</span>
                </div>
                
                ${appointmentData.clientNotes ? `
                <div style="display: flex; align-items: flex-start; padding: 12px 0;">
                  <span style="color: #0369a1; font-weight: 500; min-width: 140px; font-size: 14px;">NOTES</span>
                  <span style="color: #000000; font-weight: 600; font-size: 16px; line-height: 1.5;">${appointmentData.clientNotes}</span>
                </div>
                ` : ''}
              </div>
            </div>
            
           
            <!-- Contact Section -->
            <div style="text-align: center; padding: 24px 0; border-top: 2px solid #e5e7eb; margin-top: 40px;">
              <p style="color: #6b7280; font-size: 14px; margin: 0 0 8px 0;">
                System notification for administrative purposes
              </p>
              <p style="color: #000000; font-weight: 600; margin: 0; font-size: 16px;">
                The ${process.env.COMPANY_NAME || 'Appointment'} System
              </p>
            </div>
          </div>
 
          <!-- Footer -->
          <div style="background-color: #f8fafc; padding: 24px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0; line-height: 1.5;">
              This is an automated system notification for appointment bookings.<br/>
              Please do not reply to this email as this mailbox is not monitored.
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),


  
  // NEW: Order Confirmation Template
  orderConfirmation: (orderData) => ({
    subject: `Order Confirmation #${orderData._id.toString().slice(-6).toUpperCase()} - Palms Beauty Store`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333333; background-color: #f8fafc;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: -0.5px;">
              🛍️ Order Confirmed!
            </h1>
            <p style="color: #fef3c7; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">
              Thank you for shopping with us
            </p>
          </div>

          <!-- Content -->
          <div style="padding: 40px 30px;">
            <p style="font-size: 18px; color: #374151; margin: 0 0 24px 0;">
              Dear <strong>${orderData.address.firstName} ${orderData.address.lastName}</strong>,
            </p>
            
            <p style="font-size: 16px; color: #6b7280; margin: 0 0 32px 0; line-height: 1.7;">
              Thank you for your order! We've received your order and are processing it now. Here are your order details:
            </p>
            
            <!-- Order Summary Card -->
            <div style="background-color: #fef3c7; border-radius: 12px; padding: 32px; margin: 32px 0; border-left: 4px solid #f59e0b;">
              <h2 style="color: #1f2937; margin: 0 0 24px 0; font-size: 20px; font-weight: 600;">
                📦 Order Summary
              </h2>
              
              <div style="display: grid; gap: 16px;">
                <div style="display: flex; align-items: center; padding: 12px 0; border-bottom: 1px solid #fde68a;">
                  <span style="color: #92400e; font-weight: 500; min-width: 120px; font-size: 14px;">ORDER #</span>
                  <span style="color: #374151; font-weight: 600; font-size: 16px;">#${orderData._id.toString().slice(-6).toUpperCase()}</span>
                </div>
                
                <div style="display: flex; align-items: center; padding: 12px 0; border-bottom: 1px solid #fde68a;">
                  <span style="color: #92400e; font-weight: 500; min-width: 120px; font-size: 14px;">ORDER DATE</span>
                  <span style="color: #374151; font-weight: 600; font-size: 16px;">${new Date(orderData.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                
                <div style="display: flex; align-items: center; padding: 12px 0; border-bottom: 1px solid #fde68a;">
                  <span style="color: #92400e; font-weight: 500; min-width: 120px; font-size: 14px;">STATUS</span>
                  <span style="color: #374151; font-weight: 600; font-size: 16px;">${orderData.status || 'Order Placed'}</span>
                </div>
                
                <div style="display: flex; align-items: center; padding: 12px 0;">
                  <span style="color: #92400e; font-weight: 500; min-width: 120px; font-size: 14px;">TOTAL</span>
                  <span style="color: #059669; font-weight: 700; font-size: 18px;">$${orderData.amount.toFixed(2)} CAD</span>
                </div>
              </div>
            </div>
            
            <!-- Items List -->
            <div style="border-radius: 12px; padding: 32px; margin: 32px 0; border-left: 4px solid #10b981; background-color: #ecfdf5;">
              <h2 style="color: #1f2937; margin: 0 0 24px 0; font-size: 20px; font-weight: 600;">
                🛒 Items Ordered
              </h2>
              
              ${orderData.items.map(item => `
                <div style="display: flex; align-items: center; padding: 16px 0; border-bottom: 1px solid #d1fae5;">
                  <div style="flex: 1;">
                    <h3 style="color: #374151; margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">${item.name}</h3>
                    ${item.size ? `<p style="color: #6b7280; margin: 0; font-size: 14px;">Size: ${item.size}</p>` : ''}
                    ${item.color ? `<p style="color: #6b7280; margin: 0; font-size: 14px;">Color: ${item.color}</p>` : ''}
                    ${item.length ? `<p style="color: #6b7280; margin: 0; font-size: 14px;">Length: ${item.length}</p>` : ''}
                  </div>
                  <div style="text-align: right;">
                    <p style="color: #374151; margin: 0; font-size: 14px;">Qty: ${item.quantity}</p>
                    <p style="color: #059669; margin: 0; font-size: 16px; font-weight: 600;">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              `).join('')}
            </div>
            
            <!-- Shipping Information -->
            <div style="border-radius: 12px; padding: 32px; margin: 32px 0; border-left: 4px solid #3b82f6; background-color: #eff6ff;">
              <h2 style="color: #1f2937; margin: 0 0 24px 0; font-size: 20px; font-weight: 600;">
                🚚 Shipping Information
              </h2>
              
              <div style="color: #374151; font-size: 16px; line-height: 1.6;">
                <p style="margin: 0 0 8px 0;">${orderData.address.firstName} ${orderData.address.lastName}</p>
                <p style="margin: 0 0 8px 0;">${orderData.address.address}</p>
                <p style="margin: 0 0 8px 0;">${orderData.address.city}, ${orderData.address.state} ${orderData.address.postalCode}</p>
                <p style="margin: 0 0 8px 0;">${orderData.address.country}</p>
                ${orderData.address.phone ? `<p style="margin: 0;">Phone: ${orderData.address.phone}</p>` : ''}
              </div>
            </div>
            
            <!-- Contact Section -->
            <div style="text-align: center; padding: 24px 0; border-top: 2px solid #e5e7eb; margin-top: 40px;">
              <p style="color: #6b7280; font-size: 14px; margin: 0 0 8px 0;">
                Questions about your order? We're here to help!
              </p>
              <p style="color: #374151; font-weight: 600; margin: 0; font-size: 16px;">
                Palms Beauty Store Team
              </p>
              <p style="color: #6b7280; font-size: 14px; margin: 8px 0 0 0;">
                Email: ${process.env.EMAIL_USER} | Phone: (709) 697-7837
              </p>

              <div style="margin-top: 16px;">
                <a href="https://facebook.com" style="margin: 0 8px; text-decoration: none;">
                  <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook" width="24" height="24" style="display:inline-block;">
                </a>
                <a href="https://twitter.com" style="margin: 0 8px; text-decoration: none;">
                  <img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Twitter" width="24" height="24" style="display:inline-block;">
                </a>
                <a href="https://instagram.com" style="margin: 0 8px; text-decoration: none;">
                  <img src="https://cdn-icons-png.flaticon.com/512/733/733558.png" alt="Instagram" width="24" height="24" style="display:inline-block;">
                </a>
              </div>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #f8fafc; padding: 24px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0; line-height: 1.5;">
              This is an order confirmation email for your recent purchase.<br/>
              Please keep this email for your records. Order ID: #${orderData._id.toString().slice(-6).toUpperCase()}
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  // NEW: Admin Order Notification Template
  adminOrderNotification: (orderData) => ({
    subject: `New Order Received #${orderData._id.toString().slice(-6).toUpperCase()} - ${orderData.amount.toFixed(2)}`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Order Notification</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333333; background-color: #f8fafc;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

          <!-- Header -->
          <div style="background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600; letter-spacing: -0.5px;">
              📊 New Order Alert
            </h1>
            <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">
              A new order has been placed in your store
            </p>
          </div>

          <!-- Content -->
          <div style="padding: 40px 30px;">
            <p style="font-size: 18px; color: #374151; margin: 0 0 24px 0;">
              Hello <strong>Admin</strong>,
            </p>
            
            <p style="font-size: 16px; color: #6b7280; margin: 0 0 32px 0; line-height: 1.7;">
              A new order has been successfully placed. Below are the complete details for processing and fulfillment.
            </p>
            
            <!-- Order Summary -->
            <div style="background-color: #f3f4f6; border-radius: 12px; padding: 32px; margin: 32px 0; border-left: 4px solid #7c3aed;">
              <h2 style="color: #1f2937; margin: 0 0 24px 0; font-size: 20px; font-weight: 600;">
                📦 Order Details
              </h2>
              
              <div style="display: grid; gap: 16px;">
                <div style="display: flex; align-items: center; padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                  <span style="color: #7c3aed; font-weight: 500; min-width: 140px; font-size: 14px;">ORDER ID</span>
                  <span style="color: #374151; font-weight: 600; font-size: 16px;">#${orderData._id.toString().slice(-6).toUpperCase()}</span>
                </div>
                
                <div style="display: flex; align-items: center; padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                  <span style="color: #7c3aed; font-weight: 500; min-width: 140px; font-size: 14px;">DATE & TIME</span>
                  <span style="color: #374151; font-weight: 600; font-size: 16px;">${new Date(orderData.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                
                <div style="display: flex; align-items: center; padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                  <span style="color: #7c3aed; font-weight: 500; min-width: 140px; font-size: 14px;">STATUS</span>
                  <span style="color: #374151; font-weight: 600; font-size: 16px;">${orderData.status || 'Order Placed'}</span>
                </div>
                
                <div style="display: flex; align-items: center; padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                  <span style="color: #7c3aed; font-weight: 500; min-width: 140px; font-size: 14px;">PAYMENT METHOD</span>
                  <span style="color: #374151; font-weight: 600; font-size: 16px;">${orderData.paymentMethod || 'Credit Card'}</span>
                </div>
                
                <div style="display: flex; align-items: center; padding: 12px 0;">
                  <span style="color: #7c3aed; font-weight: 500; min-width: 140px; font-size: 14px;">TOTAL AMOUNT</span>
                  <span style="color: #059669; font-weight: 700; font-size: 18px;">${orderData.amount.toFixed(2)} CAD</span>
                </div>
              </div>
            </div>
            
            <!-- Customer Information -->
            <div style="border-radius: 12px; padding: 32px; margin: 32px 0; border-left: 4px solid #0ea5e9; background-color: #f0f9ff;">
              <h2 style="margin: 0 0 24px 0; font-size: 20px; font-weight: 600;">
                👤 Customer Information
              </h2>
              
              <div style="display: grid; gap: 16px;">
                <div style="display: flex; align-items: center; padding: 12px 0; border-bottom: 1px solid #bae6fd;">
                  <span style="color: #0369a1; font-weight: 500; min-width: 140px; font-size: 14px;">NAME</span>
                  <span style="color: #374151; font-weight: 600; font-size: 16px;">${orderData.address.firstName} ${orderData.address.lastName}</span>
                </div>
                
                <div style="display: flex; align-items: center; padding: 12px 0; border-bottom: 1px solid #bae6fd;">
                  <span style="color: #0369a1; font-weight: 500; min-width: 140px; font-size: 14px;">EMAIL</span>
                  <span style="color: #374151; font-weight: 600; font-size: 16px;">${orderData.address.email}</span>
                </div>
                
                <div style="display: flex; align-items: center; padding: 12px 0; border-bottom: 1px solid #bae6fd;">
                  <span style="color: #0369a1; font-weight: 500; min-width: 140px; font-size: 14px;">PHONE</span>
                  <span style="color: #374151; font-weight: 600; font-size: 16px;">${orderData.address.phone || 'Not provided'}</span>
                </div>
                
                <div style="display: flex; align-items: flex-start; padding: 12px 0;">
                  <span style="color: #0369a1; font-weight: 500; min-width: 140px; font-size: 14px;">SHIPPING ADDRESS</span>
                  <div style="color: #374151; font-weight: 600; font-size: 16px;">
                    <p style="margin: 0;">${orderData.address.address}</p>
                    <p style="margin: 0;">${orderData.address.city}, ${orderData.address.state} ${orderData.address.postalCode}</p>
                    <p style="margin: 0;">${orderData.address.country}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Items Ordered -->
            <div style="border-radius: 12px; padding: 32px; margin: 32px 0; border-left: 4px solid #10b981; background-color: #ecfdf5;">
              <h2 style="color: #1f2937; margin: 0 0 24px 0; font-size: 20px; font-weight: 600;">
                🛒 Items to Fulfill
              </h2>
              
              ${orderData.items.map(item => `
                <div style="display: flex; align-items: center; padding: 16px 0; border-bottom: 1px solid #d1fae5;">
                  <div style="flex: 1;">
                    <h3 style="color: #374151; margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">${item.name}</h3>
                    ${item.sku ? `<p style="color: #6b7280; margin: 0; font-size: 14px;">SKU: ${item.sku}</p>` : ''}
                    ${item.size ? `<p style="color: #6b7280; margin: 0; font-size: 14px;">Size: ${item.size}</p>` : ''}
                    ${item.color ? `<p style="color: #6b7280; margin: 0; font-size: 14px;">Color: ${item.color}</p>` : ''}
                    ${item.length ? `<p style="color: #6b7280; margin: 0; font-size: 14px;">Length: ${item.length}</p>` : ''}
                  </div>
                  <div style="text-align: right;">
                    <p style="color: #374151; margin: 0; font-size: 14px; font-weight: 600;">Qty: ${item.quantity}</p>
                    <p style="color: #059669; margin: 0; font-size: 16px; font-weight: 600;">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              `).join('')}
              
              <div style="text-align: right; padding: 16px 0; border-top: 2px solid #10b981; margin-top: 16px;">
                <p style="color: #059669; margin: 0; font-size: 18px; font-weight: 700;">
                  Total: ${orderData.amount.toFixed(2)} CAD
                </p>
              </div>
            </div>
            
            <!-- Action Required -->
            <div style="background-color: #fef3c7; border-radius: 8px; padding: 20px; margin: 32px 0; border-left: 4px solid #f59e0b;">
              <h3 style="color: #92400e; margin: 0 0 12px 0; font-size: 16px; font-weight: 600;">
                ⚡ Action Required
              </h3>
              <ul style="color: #92400e; margin: 0; padding-left: 16px; font-size: 14px; line-height: 1.6;">
                <li>Review and process this order in your admin dashboard</li>
                <li>Prepare items for shipment</li>
                <li>Update the order status once shipped</li>
                <li>Send tracking information to the customer</li>
              </ul>
            </div>
            
            <!-- Contact Section -->
            <div style="text-align: center; padding: 24px 0; border-top: 2px solid #e5e7eb; margin-top: 40px;">
              <p style="color: #6b7280; font-size: 14px; margin: 0 0 8px 0;">
                System notification for order processing
              </p>
              <p style="color: #374151; font-weight: 600; margin: 0; font-size: 16px;">
                Palms Beauty Store System
              </p>
            </div>
          </div>
 
          <!-- Footer -->
          <div style="background-color: #f8fafc; padding: 24px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0; line-height: 1.5;">
              This is an automated system notification for new orders.<br/>
              Please do not reply to this email as this mailbox is not monitored.
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

};

