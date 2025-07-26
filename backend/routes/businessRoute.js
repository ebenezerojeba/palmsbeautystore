import express from 'express'
import { defaultHours, getHours, updateHours } from '../controllers/businessController.js'

const businessRouter = express.Router()

businessRouter.get('/hours', getHours)
businessRouter.put('/updatehours', updateHours)
businessRouter.post('/defaulthours',defaultHours )


export default businessRouter