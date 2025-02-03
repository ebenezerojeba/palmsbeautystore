import express from 'express'
import { bookAppointment, downloadCalendar } from '../controllers/appointmentController.js'

const appointmentRouter = express.Router()

appointmentRouter.post('/book-appointment', bookAppointment)
appointmentRouter.get('/download-calendar/:appointmentId', downloadCalendar)


export default appointmentRouter