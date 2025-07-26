import express from 'express'
import { getAllServices, getServiceById, publicServices } from '../controllers/serviceController.js';

const serviceRouter = express.Router();

serviceRouter.get('/all-services', getAllServices)
serviceRouter.get('/publicservices', publicServices) // Assuming you want to get public services, but the controller should handle it
serviceRouter.get('/services/:id', getServiceById) // Assuming you want to get a service by ID, but the controller should handle it


export  default serviceRouter