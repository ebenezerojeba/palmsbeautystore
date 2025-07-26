import express from 'express'
// import authUser from '../middleware/auth.js'

// import adminAuth from '../middleware/adminAuth.js'
import { placeOrder,allOrders,userOrders,updateStatus,   } from "../controllers/orderController.js";
import adminAuth from '../middlewares/adminAuth.js';
import authUser from '../middlewares/auth.js';
// import adminAuth from '../middlewares/adminAuth.js';

const orderRouter = express.Router()

// Admin Features
orderRouter.post('/list',adminAuth,allOrders)
orderRouter.post('/status',adminAuth,updateStatus)

// Paymetn Features
orderRouter.post('/place', placeOrder)
// orderRouter.post('/stripe',authUser,placeOrder)

// User Feature
orderRouter.get('/userorders',authUser,userOrders)



export default orderRouter


