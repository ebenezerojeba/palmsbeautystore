import express from "express"
import { listProduct,addProduct,removeProduct,singleProduct } from "../controllers/productController.js"

// import adminAuth from "../middleware/adminAuth.js";
import upload from "../middlewares/multer.js";
import adminAuth from "../middlewares/adminAuth.js";

const productRouter = express.Router();

productRouter.post('/add',upload.fields([{name:'image1', maxCount: 1},{name:'image2', maxCount:1},{name:'image3', maxCount:1},{name:'image4', maxCount:1}]), addProduct)
productRouter.post('/remove',adminAuth, removeProduct)
productRouter.post('/single', singleProduct)
productRouter.get('/list', listProduct)

export default productRouter