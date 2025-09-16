import express from "express"
import {addProduct,listProducts,removeProduct,singleProduct, updateProduct } from "../controllers/productController.js"

// import adminAuth from "../middleware/adminAuth.js";
import upload from "../middlewares/multer.js";
import adminAuth from "../middlewares/adminAuth.js";

const productRouter = express.Router();

// Update your routes to use proper HTTP methods
// productRouter.post('/add', upload.fields([
//     {name:'image1', maxCount: 1},
//     {name:'image2', maxCount: 1},
//     {name:'image3', maxCount: 1},
//     {name:'image4', maxCount: 1}
// ]), addProduct)
productRouter.post('/add', upload.any(), addProduct)

// Fix HTTP methods - use PUT for updates
productRouter.put('/update', upload.fields([
    {name:'image1', maxCount: 1},
    {name:'image2', maxCount: 1},
    {name:'image3', maxCount: 1},
    {name:'image4', maxCount: 1}
]), updateProduct)

// Use proper REST endpoints
productRouter.get('/list', listProducts)  // with query params for filtering
productRouter.get('/:id', singleProduct)  // or use /slug/:slug
productRouter.delete('/:id', adminAuth, removeProduct)

export default productRouter