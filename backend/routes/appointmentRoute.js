import express from 'express'
import { bookAppointment, downloadCalendar, getBookedSlots } from '../controllers/appointmentController.js'

const appointmentRouter = express.Router()

appointmentRouter.post('/book-appointment', bookAppointment)
appointmentRouter.get('/booked-slots', getBookedSlots)
appointmentRouter.get('/download-calendar/:appointmentId', downloadCalendar)


export default appointmentRouter