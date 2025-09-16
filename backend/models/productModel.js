// In your productModel.js, expand the pricing structure
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  
  // Enhanced pricing structure for multiple variations
  variations: [{
    size: { type: String }, // For beauty products: "Small", "Medium", "Large"
    length: { type: String }, // For hair: "12 inches", "14 inches", etc.
    color: { type: String, required: true }, // Always required
    texture: { type: String }, // For hair: "Straight", "Curly", "Kinky", etc.
    weight: { type: String }, // For hair bundles: "100g", "150g", etc.
    price: { type: Number, required: true },
    salePrice: { type: Number }, // Optional sale price
    stock: { type: Number, default: 0 }, // Inventory per variation
    sku: { type: String, unique: true }, // SKU for each variation
    isActive: { type: Boolean, default: true }, // Can disable specific variations
    images: [{ type: String }] // Specific images for this variation
  }],
  
  basePrice: { type: Number, required: true }, // Starting/minimum price
  category: { type: String, required: true }, // "Wigs", "Hair Extensions", etc.
  subCategory: { type: String, required: true }, // "Lace Front", "Closure", etc.
  brand: { type: String }, // Brand name
  
  // Available options (used for filtering)
  // In your productModel.js, change from embedded documents to simple arrays:
availableOptions: {
    colors: [String],
    sizes: [String], 
    lengths: [String],
    textures: [String],
    weights: [String]
},
  // Product specifications
  specifications: {
    material: { type: String }, // "Human Hair", "Synthetic", etc.
    origin: { type: String }, // "Brazilian", "Peruvian", etc.
    capConstruction: { type: String }, // For wigs: "Lace Front", "Full Lace"
    density: { type: String }, // "130%", "150%", "180%"
    hairGrade: { type: String } // "9A", "10A", "11A"
  },
  
  // Care instructions and additional info
  careInstructions: [{ type: String }],
  features: [{ type: String }], // ["Heat Resistant", "Tangle Free", etc.]
  
  bestSeller: { type: Boolean, default: false },
  // isNew: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  
  // Main product images
  images: [{ type: String, required: true }],
  
  // SEO and metadata
  // slug: { type: String, unique: true },
  metaTitle: { type: String },
  metaDescription: { type: String },
  tags: [{ type: String }],
  
  // Reviews and ratings
  averageRating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  
  // Status
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'draft', 'out_of_stock'], 
    default: 'active' 
  },
  
  // Analytics
  views: { type: Number, default: 0 },
  purchases: { type: Number, default: 0 },
  
  date: { type: Number, required: true }
}, {
  timestamps: true
});

// Indexes for better performance
productSchema.index({ category: 1, subCategory: 1 });
productSchema.index({ 'availableOptions.colors.colorFamily': 1 });
productSchema.index({ basePrice: 1 });
productSchema.index({ slug: 1 });
productSchema.index({ status: 1 });

// Add these indexes for better performance
productSchema.index({ status: 1, category: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ views: -1 });

// Add text search index
productSchema.index({ 
    name: 'text', 
    description: 'text', 
    tags: 'text' 
});

// Add validation middleware
productSchema.pre('save', function(next) {
    // Ensure at least one active variation
    const activeVariations = this.variations.filter(v => v.isActive);
    if (activeVariations.length === 0) {
        return next(new Error('At least one active variation is required'));
    }
    next();
});

// Virtual for price range
productSchema.virtual('priceRange').get(function() {
  if (!this.variations || this.variations.length === 0) {
    return { min: this.basePrice, max: this.basePrice };
  }
  
  const prices = this.variations.map(v => v.salePrice || v.price);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices)
  };
});

// Method to get active variations
productSchema.methods.getActiveVariations = function() {
  return this.variations.filter(variation => 
    variation.isActive && variation.stock > 0
  );
};

// Method to find variation by attributes
productSchema.methods.findVariation = function(attributes) {
  return this.variations.find(variation => {
    return Object.keys(attributes).every(key => 
      variation[key] === attributes[key]
    );
  });
};

const productModel = mongoose.models.product || mongoose.model("product", productSchema);
export default productModel;
