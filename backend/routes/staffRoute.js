import express from "express"
import { getAllStaff, getStaffAvailability, getStaffByService,  } from "../controllers/staffController.js";

const staffRouter = express.Router()

staffRouter.get('/allstaff', getAllStaff)
staffRouter.get('/service', getStaffByService)
staffRouter.get('/:staffId/availability', getStaffAvailability )


export default staffRouter;