import express from 'express'
import { getAllServices, getServiceById } from '../controllers/serviceController.js';

const serviceRouter = express.Router();

serviceRouter.get('/services', getAllServices)
serviceRouter.get('/services/:id', getServiceById) // Assuming you want to get a service by ID, but the controller should handle it


export  default serviceRouter