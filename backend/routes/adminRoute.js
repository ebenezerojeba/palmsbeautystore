import express from 'express'
import { cancelAppointment } from '../controllers/appointmentController.js'
import { adminDashboard, completeAppointment, getAllAppointment, getCompletedAppointments } from '../controllers/adminController.js'
// import { bookAppointment } from '../controllers/appointmentController.js'

const adminRouter = express.Router()

adminRouter.get('/admin' )
adminRouter.post('/cancel-appointment', cancelAppointment)
adminRouter.post('/complete-appointment', completeAppointment)
adminRouter.post('/completed', getCompletedAppointments)
adminRouter.get('/all-appointments', getAllAppointment)
adminRouter.get('/dashboard', adminDashboard)


export default adminRouter