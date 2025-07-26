import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {type:String, required:true},
    description : {type:String, required:true},
    price: {type: Number, required:true},
    image: {type:Array, required:true},
    category: {type:String, required:true},
    subCategory: {type:String, required:true},
    // sizes: {type:Array, required:true},
   sizes: { type: [String], required: true },
     inStock: {
    type: Boolean,
    default: true // assume it's in stock by default
  },

    bestSeller: {type: Boolean, default: false},
    date: {type: Date, required: true, default: Date.now}
},{
    timestamps: true
})

const productModel = mongoose.models.product || mongoose.model("product", productSchema)
export default productModel