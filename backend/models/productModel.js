// import mongoose from "mongoose";

// const productSchema = new mongoose.Schema({
//     name: {type:String, required:true},
//     description : {type:String, required:true},
//     price: {type: Number, required:true},
//     image: {type:Array, required:true},
//     category: {type:String, required:true},
//     subCategory: {type:String, required:true},
//     // sizes: {type:Array, required:true},
//    sizes: { type: [String], required: true },
//      inStock: {
//     type: Boolean,
//     default: true // assume it's in stock by default
//   },

//     bestSeller: {type: Boolean, default: false},
//     date: {type: Date, required: true, default: Date.now}
// },{
//     timestamps: true
// })

// const productModel = mongoose.models.product || mongoose.model("product", productSchema)
// export default productModel






















// In your productModel.js, expand the pricing structure
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  // Enhanced pricing structure for multiple variations
  pricing: [{
    size: { type: String },
    length: { type: String }, // in inches
    color: { type: String },
    price: { type: Number, required: true },
    sku: { type: String } // optional: for inventory tracking
  }],
  basePrice: { type: Number, required: true },
  category: { type: String, required: true },
  subCategory: { type: String, required: true },
  sizes: [{ type: String }],
  lengths: [{ type: String }], // Available lengths
  colors: [{ type: String }], // Available colors
  bestSeller: { type: Boolean, default: false },
  image: [{ type: String, required: true }],
  date: { type: Number, required: true }
},
{timestamps: true}
);

const productModel = mongoose.models.product || mongoose.model("product", productSchema)
export default productModel

































// import mongoose from "mongoose";

// const productSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     description: { type: String, required: true },
//     price: { type: Number, required: true },
//     image: { type: Array, required: true },
//     category: { type: String, required: true },
//     subCategory: { type: String, required: true },
    
//     // Hair-specific fields
//     lengths: { 
//         type: [String], 
//         required: function() {
//             return this.category === "Hair Extensions" || this.category === "Wigs";
//         }
//     },
//     colors: { 
//         type: [String], 
//         required: function() {
//             return this.category === "Hair Extensions" || this.category === "Wigs";
//         }
//     },
//     laceColors: { 
//         type: [String], 
//         default: [],
//         required: function() {
//             return this.category === "Wigs" || this.subCategory === "Toppers";
//         }
//     },
//     origins: { 
//         type: [String], 
//         default: [],
//         required: function() {
//             return (this.category === "Hair Extensions") || 
//                    (this.category === "Wigs" && this.subCategory === "Human Hair Wigs");
//         }
//     },
    
//     // Stock and inventory
//     inStock: {
//         type: Boolean,
//         default: true
//     },
    
//     // Physical properties
//     weight: {
//         type: Number,
//         min: 0
//     },
    
//     // Wig-specific fields
//     density: {
//         type: String,
//         enum: ["100%", "120%", "130%", "150%", "180%"],
//         required: function() {
//             return this.category === "Wigs";
//         }
//     },
//     capSize: {
//         type: String,
//         enum: ["Small", "Medium", "Large", "Average"],
//         required: function() {
//             return this.category === "Wigs";
//         }
//     },
//     frontals: {
//         type: [String],
//         default: []
//     },
//     closures: {
//         type: [String],
//         default: []
//     },
    
//     // Legacy fields (kept for backward compatibility)
//     bestSeller: { 
//         type: Boolean, 
//         default: false 
//     },
//     date: { 
//         type: Date, 
//         required: true, 
//         default: Date.now 
//     }
// }, {
//     timestamps: true
// });

// // Add indexes for better performance
// productSchema.index({ category: 1, subCategory: 1 });
// productSchema.index({ bestSeller: 1 });
// productSchema.index({ inStock: 1 });
// productSchema.index({ price: 1 });
// productSchema.index({ createdAt: -1 });

// // Virtual for formatted price
// productSchema.virtual('formattedPrice').get(function() {
//     return `${this.price.toFixed(2)}`;
// });

// // Method to check if product is available in specific length and color
// productSchema.methods.isAvailable = function(length, color) {
//     return this.inStock && 
//            this.lengths.includes(length) && 
//            this.colors.includes(color);
// };

// const productModel = mongoose.models.product || mongoose.model("product", productSchema);
// export default productModel;