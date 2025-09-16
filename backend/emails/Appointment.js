import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Section,
  Button,
  Hr,
} from '@react-email/components';

export const AppointmentClientEmail = ({
  clientName,
  appointmentId,
  providerName,
  services,
  date,
  time,
  totalAmount,
  clientNotes,
}) => (
  <Html>

 
    <Head />
    <Preview>Your appointment has been booked successfully</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Appointment Confirmation</Heading>
        
        <Text style={text}>Hi {clientName},</Text>
        
        <Text style={text}>
          Your appointment has been successfully booked! Here are the details:
        </Text>
        
        <Section style={appointmentDetails}>
          <Text style={detailItem}><strong>Appointment ID:</strong> {appointmentId}</Text>
          <Text style={detailItem}><strong>Provider:</strong> {providerName}</Text>
          <Text style={detailItem}><strong>Services:</strong> {services.map(s => s.serviceTitle).join(', ')}</Text>
          <Text style={detailItem}><strong>Date:</strong> {new Date(date).toLocaleDateString()}</Text>
          <Text style={detailItem}><strong>Time:</strong> {time}</Text>
          <Text style={detailItem}><strong>Total Amount:</strong> ${totalAmount} CAD</Text>
          {clientNotes && (
            <Text style={detailItem}><strong>Notes:</strong> {clientNotes}</Text>
          )}
        </Section>
        
        <Hr style={hr} />
        
        <Text style={text}>
          We'll send you a reminder before your appointment. If you need to make any changes, 
          please contact us as soon as possible.
        </Text>
        
        <Text style={text}>
          Thank you for choosing our services!
        </Text>
      </Container>
    </Body>
  </Html>
);

// emails/appointment-provider.jsx
export const AppointmentProviderEmail = ({
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
}) => (
  <Html>
    <Head />
    <Preview>New appointment booking</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>New Appointment Booking</Heading>
        
        <Text style={text}>Hi {providerName},</Text>
        
        <Text style={text}>
          You have a new appointment booking:
        </Text>
        
        <Section style={appointmentDetails}>
          <Text style={detailItem}><strong>Appointment ID:</strong> {appointmentId}</Text>
          <Text style={detailItem}><strong>Client:</strong> {clientName}</Text>
          <Text style={detailItem}><strong>Email:</strong> {clientEmail}</Text>
          <Text style={detailItem}><strong>Phone:</strong> {clientPhone}</Text>
          <Text style={detailItem}><strong>Services:</strong> {services.map(s => s.serviceTitle).join(', ')}</Text>
          <Text style={detailItem}><strong>Date:</strong> {new Date(date).toLocaleDateString()}</Text>
          <Text style={detailItem}><strong>Time:</strong> {time}</Text>
          <Text style={detailItem}><strong>Amount:</strong> ${totalAmount} CAD</Text>
          {clientNotes && (
            <Text style={detailItem}><strong>Client Notes:</strong> {clientNotes}</Text>
          )}
        </Section>
        
        <Hr style={hr} />
        
        <Text style={text}>
          Please prepare for this appointment and contact the client if needed.
        </Text>
      </Container>
    </Body>
  </Html>
);

// emails/appointment-admin.jsx
export const AppointmentAdminEmail = ({
  appointmentId,
  clientName,
  providerName,
  services,
  date,
  time,
  totalAmount,
}) => (
  <Html>
    <Head />
    <Preview>New appointment booking - Admin notification</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>New Appointment - Admin Notification</Heading>
        
        <Text style={text}>
          A new appointment has been booked in the system:
        </Text>
        
        <Section style={appointmentDetails}>
          <Text style={detailItem}><strong>Appointment ID:</strong> {appointmentId}</Text>
          <Text style={detailItem}><strong>Client:</strong> {clientName}</Text>
          <Text style={detailItem}><strong>Provider:</strong> {providerName}</Text>
          <Text style={detailItem}><strong>Services:</strong> {services.map(s => s.serviceTitle).join(', ')}</Text>
          <Text style={detailItem}><strong>Date:</strong> {new Date(date).toLocaleDateString()}</Text>
          <Text style={detailItem}><strong>Time:</strong> {time}</Text>
          <Text style={detailItem}><strong>Amount:</strong> ${totalAmount} CAD</Text>
        </Section>
        
        <Hr style={hr} />
        
        <Text style={text}>
          This is an automated notification for administrative purposes.
        </Text>
      </Container>
    </Body>
  </Html>
);

// Styles (common for all templates)
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0',
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
};

const appointmentDetails = {
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
  padding: '20px',
  margin: '20px 0',
};

const detailItem = {
  color: '#333',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '8px 0',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};
