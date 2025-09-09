import express from 'express'
import { cancelAppointment } from '../controllers/appointmentController.js'
import { addCategory, addService, adminDashboard, allServices, completeAppointment, confirmAppointment, deleteCategory, deleteService, deleteServiceImage, getAllAppointment, getAllAppointments, getAppointmentsByStatus, getCompletedAppointments, markNoShow, toggleServiceStatus, updateCategory, updatePaymentStatus, updateService } from '../controllers/adminController.js'
import upload from '../middlewares/multer.js'
import { createStaff, deleteStaff, toggleStaffStatus, updateStaff } from '../controllers/staffController.js'
// import { bookAppointment } from '../controllers/appointmentController.js'

const adminRouter = express.Router()

// Appointment
adminRouter.get('/admin' )
adminRouter.post('/cancel-appointment', cancelAppointment)
adminRouter.post('/complete-appointment', completeAppointment)
adminRouter.post('/completed', getCompletedAppointments)
adminRouter.get('/all-appointments', getAllAppointments)
adminRouter.get('/appointments', getAllAppointment)
adminRouter.get('/appointments/status', getAppointmentsByStatus)
adminRouter.get('/dashboard', adminDashboard)
adminRouter.post('/confirm-appointment', confirmAppointment);
adminRouter.post('/mark-no-show', markNoShow);
adminRouter.put('/payment/:appointmentId', updatePaymentStatus);

// Category
adminRouter.post('/addcategory',upload.none(), addCategory)
adminRouter.put('/updatecategory/:id',updateCategory)
adminRouter.delete('/deletecategory/:id', deleteCategory)

// Services
adminRouter.get('/services', allServices)
adminRouter.post('/addservices', upload.single('image'), addService)
adminRouter.put('/updateservice/:id', upload.single('image'), updateService)
adminRouter.patch('/:id/toggle', toggleServiceStatus)
adminRouter.delete('/:id', deleteService)
adminRouter.delete('/:id/image', deleteServiceImage)

// Staff
// Admin routes (protected)
adminRouter.post('/staff',  upload.single('image'), createStaff);
adminRouter.put('/staff/:id', upload.single('image'), updateStaff);
adminRouter.delete('/staff/:id', deleteStaff);
adminRouter.patch('/staff/:id/toggle', toggleStaffStatus);






export default adminRouter