import { v2 as cloudinary } from 'cloudinary'
import productModel from '../models/productModel.js'
// Fucntion for add product
const addProduct = async (req, res) => {
    try {
        const {name,description,price,category,subCategory,sizes,bestSeller, lengths, colors, pricing} = req.body

        const image1 = req.files.image1 && req.files.image1[0]
        const image2 = req.files.image2 && req.files.image2[0]
        const image3 = req.files.image3 && req.files.image3[0]
        const image4 = req.files.image4 && req.files.image4[0]

        const images = [image1,image2,image3,image4].filter((item)=> item != undefined)

        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path,{resource_type:'image'});
                return result.secure_url
            })
        )

        // Parse all arrays
    let parsedSizes = [], parsedLengths = [], parsedColors = [], parsedPricing = [];
    
    try {
      parsedSizes = JSON.parse(sizes || '[]');
      parsedLengths = JSON.parse(lengths || '[]');
      parsedColors = JSON.parse(colors || '[]');
      parsedPricing = JSON.parse(pricing || '[]');
    } catch (err) {
      return res.json({ success: false, message: "Invalid data format" });
    }

        const productData ={
            name,
            description,
            category,
            basePrice: Number(price),
            subCategory,
            bestSeller: bestSeller  === "true",
            sizes: parsedSizes,
            lengths: parsedLengths,
            colors: parsedColors,
            pricing: parsedPricing,
            image: imagesUrl,
            date: Date.now()
        }

        // console.log(productData);
        
        const product = new productModel (productData)
        await product.save()

        res.json({success:true, message: "Product Added"})

    } catch (error) {
        console.log(error);
        
        res.json({success:false,message:error.message})
    }
}

const updateProduct = async (req, res) => {
  try {
    const { id, updates } = req.body;

    const product = await productModel.findByIdAndUpdate(id, updates, { new: true });

    res.json({ success: true, message: "Product updated", product });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


// Function for list product
const listProduct = async (req, res) => {
    try {
        const products = await productModel.find({});
        res.json({success:true, products})
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message})
    }
}
// Function for removign product
const removeProduct = async (req,res) => {
    try {
        await productModel.findByIdAndDelete(req.body.id);
        res.json({success:true, message: "Product Removed"})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}
// Function for single product info
 const singleProduct = async (req,res) => {
    try {
        const {productId} = req.body
        const product = await productModel.findById(productId)
        res.json({success: true, product})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
 }


 export {addProduct, listProduct, removeProduct, singleProduct, updateProduct}















// import productModel from "../models/productModel.js";
// import { v2 as cloudinary } from "cloudinary";

// // Helper function to safely parse JSON arrays
// const parseJsonArray = (value, fieldName) => {
//     if (!value) return [];
    
//     try {
//         const parsed = JSON.parse(value);
//         if (!Array.isArray(parsed)) {
//             throw new Error(`${fieldName} must be an array`);
//         }
//         return parsed;
//     } catch (error) {
//         throw new Error(`Invalid ${fieldName} format: ${error.message}`);
//     }
// };

// // Helper function to validate required fields based on category
// const validateProductData = (productData) => {
//     const errors = [];
    
//     // Basic validations
//     if (!productData.name?.trim()) errors.push("Product name is required");
//     if (!productData.description?.trim()) errors.push("Description is required");
//     if (!productData.price || productData.price <= 0) errors.push("Valid price is required");
//     if (!productData.category?.trim()) errors.push("Category is required");
//     if (!productData.subCategory?.trim()) errors.push("Subcategory is required");
    
//     // Category-specific validations
//     if (productData.category === "Hair Extensions" || productData.category === "Wigs") {
//         if (!productData.lengths || productData.lengths.length === 0) {
//             errors.push("At least one length is required for hair extensions and wigs");
//         }
//         if (!productData.colors || productData.colors.length === 0) {
//             errors.push("At least one color is required for hair extensions and wigs");
//         }
//     }
    
//     // Human hair origin validation
//     if (productData.category === "Hair Extensions" || 
//         (productData.category === "Wigs" && productData.subCategory === "Human Hair Wigs")) {
//         if (!productData.origins || productData.origins.length === 0) {
//             errors.push("Hair origin is required for human hair products");
//         }
//     }
    
//     // Wig-specific validations
//     if (productData.category === "Wigs") {
//         if (!productData.density) errors.push("Hair density is required for wigs");
//         if (!productData.capSize) errors.push("Cap size is required for wigs");
        
//         // Validate lace colors for human hair wigs
//         if (productData.subCategory === "Human Hair Wigs" && 
//             (!productData.laceColors || productData.laceColors.length === 0)) {
//             errors.push("Lace color is required for human hair wigs");
//         }
//     }
    
//     return errors;
// };

// const addProduct = async (req, res) => {
//     try {
//         // Extract and validate basic fields
//         const {
//             name,
//             description,
//             price,
//             category,
//             subCategory,
//             bestSeller,
//             inStock,
//             weight,
//             density,
//             capSize
//         } = req.body;

//         // Parse array fields safely
//         let lengths, colors, laceColors, origins, frontals, closures;
        
//         try {
//             lengths = parseJsonArray(req.body.lengths, "lengths");
//             colors = parseJsonArray(req.body.colors, "colors");
//             laceColors = parseJsonArray(req.body.laceColors, "laceColors");
//             origins = parseJsonArray(req.body.origins, "origins");
//             frontals = parseJsonArray(req.body.frontals, "frontals");
//             closures = parseJsonArray(req.body.closures, "closures");
//         } catch (parseError) {
//             return res.json({ success: false, message: parseError.message });
//         }

//         // Handle image uploads
//         const image1 = req.files.image1 && req.files.image1[0];
//         const image2 = req.files.image2 && req.files.image2[0];
//         const image3 = req.files.image3 && req.files.image3[0];
//         const image4 = req.files.image4 && req.files.image4[0];

//         const images = [image1, image2, image3, image4].filter(item => item !== undefined);
        
//         if (images.length === 0) {
//             return res.json({ success: false, message: "At least one product image is required" });
//         }

//         // Upload images to cloudinary with error handling
//         let imagesUrl = [];
//         try {
//             imagesUrl = await Promise.all(
//                 images.map(async (item) => {
//                     const result = await cloudinary.uploader.upload(item.path, {
//                         resource_type: 'image',
//                         folder: 'hair-products', // Organize uploads in folders
//                         transformation: [
//                             { width: 800, height: 800, crop: 'fill', quality: 'auto' }
//                         ]
//                     });
//                     return result.secure_url;
//                 })
//             );
//         } catch (uploadError) {
//             console.error("Image upload error:", uploadError);
//             return res.json({ 
//                 success: false, 
//                 message: "Failed to upload images. Please try again." 
//             });
//         }

//         // Prepare product data
//         const productData = {
//             name: name?.trim(),
//             description: description?.trim(),
//             category: category?.trim(),
//             price: Number(price),
//             subCategory: subCategory?.trim(),
//             bestSeller: bestSeller === "true" || bestSeller === true,
//             inStock: inStock !== "false" && inStock !== false, // Default to true
//             weight: weight ? Number(weight) : undefined,
//             lengths,
//             colors,
//             laceColors,
//             origins,
//             frontals,
//             closures,
//             image: imagesUrl,
//             date: Date.now()
//         };

//         // Add wig-specific fields if category is Wigs
//         if (category === "Wigs") {
//             productData.density = density;
//             productData.capSize = capSize;
//         }

//         // Validate product data
//         const validationErrors = validateProductData(productData);
//         if (validationErrors.length > 0) {
//             // If validation fails after uploading images, we should clean them up
//             try {
//                 await Promise.all(
//                     imagesUrl.map(url => {
//                         const publicId = url.split('/').pop().split('.')[0];
//                         return cloudinary.uploader.destroy(`hair-products/${publicId}`);
//                     })
//                 );
//             } catch (cleanupError) {
//                 console.error("Failed to cleanup uploaded images:", cleanupError);
//             }
            
//             return res.json({ 
//                 success: false, 
//                 message: "Validation failed", 
//                 errors: validationErrors 
//             });
//         }

//         // Create and save product
//         const product = new productModel(productData);
//         await product.save();

//         // console.log("Product added successfully:", {
//         //     id: product._id,
//         //     name: product.name,
//         //     category: product.category,
//         //     subCategory: product.subCategory
//         // });
        
//         res.json({ 
//             success: true, 
//             message: "Product added successfully",
//             productId: product._id
//         });

//     } catch (error) {
//         console.error("Add product error:", error);
        
//         // Handle specific mongoose validation errors
//         if (error.name === 'ValidationError') {
//             const validationErrors = Object.values(error.errors).map(err => err.message);
//             return res.json({
//                 success: false,
//                 message: "Validation failed",
//                 errors: validationErrors
//             });
//         }
        
//         // Handle duplicate key errors
//         if (error.code === 11000) {
//             return res.json({
//                 success: false,
//                 message: "A product with similar details already exists"
//             });
//         }
        
//         res.json({ 
//             success: false, 
//             message: "An unexpected error occurred. Please try again." 
//         });
//     }
// };

// // Additional controller methods for better functionality

// const updateProduct = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const updates = req.body;
        
//         // Parse array fields if they exist
//         if (updates.lengths) updates.lengths = parseJsonArray(updates.lengths, "lengths");
//         if (updates.colors) updates.colors = parseJsonArray(updates.colors, "colors");
//         if (updates.laceColors) updates.laceColors = parseJsonArray(updates.laceColors, "laceColors");
//         if (updates.origins) updates.origins = parseJsonArray(updates.origins, "origins");
//         if (updates.frontals) updates.frontals = parseJsonArray(updates.frontals, "frontals");
//         if (updates.closures) updates.closures = parseJsonArray(updates.closures, "closures");
        
//         const product = await productModel.findByIdAndUpdate(
//             id, 
//             updates, 
//             { new: true, runValidators: true }
//         );
        
//         if (!product) {
//             return res.json({ success: false, message: "Product not found" });
//         }
        
//         res.json({ success: true, message: "Product updated successfully", product });
//     } catch (error) {
//         console.error("Update product error:", error);
//         res.json({ success: false, message: error.message });
//     }
// };

// const listProduct = async (req, res) => {
//     try {
//         const { 
//             category, 
//             subCategory, 
//             minPrice, 
//             maxPrice, 
//             inStock, 
//             bestSeller,
//             lengths,
//             colors,
//             origins,
//             page = 1,
//             limit = 20,
//             sortBy = 'createdAt',
//             sortOrder = -1
//         } = req.query;
        
//         // Build filter object
//         const filter = {};
//         if (category) filter.category = category;
//         if (subCategory) filter.subCategory = subCategory;
//         if (minPrice || maxPrice) {
//             filter.price = {};
//             if (minPrice) filter.price.$gte = Number(minPrice);
//             if (maxPrice) filter.price.$lte = Number(maxPrice);
//         }
//         if (inStock !== undefined) filter.inStock = inStock === 'true';
//         if (bestSeller !== undefined) filter.bestSeller = bestSeller === 'true';
        
//         // Array field filters
//         if (lengths) filter.lengths = { $in: lengths.split(',') };
//         if (colors) filter.colors = { $in: colors.split(',') };
//         if (origins) filter.origins = { $in: origins.split(',') };
        
//         // Calculate pagination
//         const skip = (Number(page) - 1) * Number(limit);
        
//         // Get products with pagination
//         const products = await productModel
//             .find(filter)
//             .sort({ [sortBy]: Number(sortOrder) })
//             .skip(skip)
//             .limit(Number(limit));
        
//         const totalProducts = await productModel.countDocuments(filter);
//         const totalPages = Math.ceil(totalProducts / Number(limit));
        
//         res.json({ 
//             success: true, 
//             products,
//             pagination: {
//                 currentPage: Number(page),
//                 totalPages,
//                 totalProducts,
//                 hasNextPage: Number(page) < totalPages,
//                 hasPrevPage: Number(page) > 1
//             }
//         });
//     } catch (error) {
//         console.error("Get products error:", error);
//         res.json({ success: false, message: error.message });
//     }
// };

// const singleProduct = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const product = await productModel.findById(id);
        
//         if (!product) {
//             return res.json({ success: false, message: "Product not found" });
//         }
        
//         res.json({ success: true, product });
//     } catch (error) {
//         console.error("Get product by ID error:", error);
//         res.json({ success: false, message: error.message });
//     }
// };

// const removeProduct = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const product = await productModel.findByIdAndDelete(id);
        
//         if (!product) {
//             return res.json({ success: false, message: "Product not found" });
//         }
        
//         // Delete associated images from cloudinary
//         try {
//             await Promise.all(
//                 product.image.map(url => {
//                     const publicId = url.split('/').pop().split('.')[0];
//                     return cloudinary.uploader.destroy(`hair-products/${publicId}`);
//                 })
//             );
//         } catch (cleanupError) {
//             console.error("Failed to cleanup product images:", cleanupError);
//         }
        
//         res.json({ success: true, message: "Product deleted successfully" });
//     } catch (error) {
//         console.error("Delete product error:", error);
//         res.json({ success: false, message: error.message });
//     }
// };

// export { 
//     addProduct, 
//     updateProduct, 
//     listProduct, 
//     singleProduct, 
//     removeProduct 
// };

// //  export {addProduct, listProduct, removeProduct, singleProduct, updateProduct}