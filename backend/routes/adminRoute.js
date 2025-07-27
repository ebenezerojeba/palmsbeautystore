import express from 'express'
import { cancelAppointment } from '../controllers/appointmentController.js'
import { addCategory, addService, adminDashboard, allServices, completeAppointment, deleteCategory, deleteService, deleteServiceImage, getAllAppointment, getCompletedAppointments, toggleServiceStatus, updateCategory, updateService } from '../controllers/adminController.js'
import upload from '../middlewares/multer.js'
// import { bookAppointment } from '../controllers/appointmentController.js'

const adminRouter = express.Router()
// Appointment
adminRouter.get('/admin' )
adminRouter.post('/cancel-appointment', cancelAppointment)
adminRouter.post('/complete-appointment', completeAppointment)
adminRouter.post('/completed', getCompletedAppointments)
adminRouter.get('/all-appointments', getAllAppointment)
adminRouter.get('/dashboard', adminDashboard)

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








export default adminRouter