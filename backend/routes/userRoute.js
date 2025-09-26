import express from 'express'

import { loginUser,registerUser,adminLogin, listAppointment, updateProfile, getUserData, getProfile } from '../controllers/userController.js'
import authUser from '../middlewares/auth.js';
import upload from '../middlewares/multer.js';

const userRouter = express.Router();

userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)
// userRouter.post('/book-appointment',authUser,bookAppointment)
userRouter.get('/appointments',authUser,listAppointment)
// userRouter.post('/update-profile',upload.single('image'),authUser,updateProfile)
userRouter.put('/update-profile',authUser, upload.single('image'), updateProfile);

userRouter.get('/get-data',authUser,getUserData)
userRouter.get('/get-profile',authUser,getProfile)
userRouter.post('/admin',adminLogin)

export  default userRouter