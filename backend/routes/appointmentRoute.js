import express from 'express'
import { bookAppointment, cancelAppointment, completeAppointment, downloadCalendar, getAvailableSlots, getSingleAppointment, getUserAppointments, updateAppointmentNotes, verifyAppointmentPayment,  } from '../controllers/appointmentController.js'
import authUser from '../middlewares/auth.js';

const appointmentRouter = express.Router()

appointmentRouter.get('/available-slots', getAvailableSlots);
appointmentRouter.get('/:id', authUser, getSingleAppointment);
appointmentRouter.post('/book-appointment', authUser, bookAppointment);
appointmentRouter.post('/verify', authUser, verifyAppointmentPayment);
// Add GET route to handle Stripe redirect
appointmentRouter.get('/verify/:appointmentId', authUser, handleStripeRedirect);

appointmentRouter.get('/download-calendar/:appointmentId', authUser, downloadCalendar);

// Protected appointmentRouter (add auth middleware as needed)
appointmentRouter.get('/user/:userId',authUser, getUserAppointments);
appointmentRouter.put('/cancel', authUser, cancelAppointment);
appointmentRouter.put('/notes/:appointmentId', authUser, updateAppointmentNotes);
appointmentRouter.put('/complete/:appointmentId',authUser, completeAppointment);

export default appointmentRouter