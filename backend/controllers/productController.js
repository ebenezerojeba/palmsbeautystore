import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";
import mongoose from "mongoose";

const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      basePrice,
      category,
      subCategory,
      brand,
      bestSeller,
      isNew,
      isFeatured,
      variations,
      availableOptions,
      specifications,
      careInstructions,
      features,
      metaTitle,
      metaDescription,
      tags,
    } = req.body;

    // Validation
    if (!name || !description || !basePrice || !category || !subCategory) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: name, description, basePrice, category, subCategory",
      });
    }

    // MOVE THESE LINES UP - Organize uploaded files first
    const organizeUploadedFiles = (files) => {
      if (!files || !Array.isArray(files)) return {};
      const organized = {};
      files.forEach((file) => {
        if (!organized[file.fieldname]) {
          organized[file.fieldname] = [];
        }
        organized[file.fieldname].push(file);
      });
      return organized;
    };

    const organizedFiles = organizeUploadedFiles(req.files || []);

    // NOW handle main product images
    const imageFiles = [
      organizedFiles.image1?.[0],
      organizedFiles.image2?.[0],
      organizedFiles.image3?.[0],
      organizedFiles.image4?.[0],
    ].filter(Boolean);

    if (imageFiles.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one product image is required",
      });
    }

    // Upload main images to cloudinary
    const imagesUrl = await Promise.all(
      imageFiles.map(async (item) => {
        try {
          const result = await cloudinary.uploader.upload(item.path, {
            resource_type: "image",
            folder: "hair-products/main",
            transformation: [
              { width: 800, height: 800, crop: "fill", quality: "auto" },
              { format: "webp" },
            ],
          });
          return result.secure_url;
        } catch (uploadError) {
          console.error("Image upload error:", uploadError);
          throw new Error("Failed to upload image");
        }
      })
    );

    // Parse and validate variations
    let parsedVariations = [];
    try {
      parsedVariations = variations ? JSON.parse(variations) : [];
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: "Invalid variations format",
      });
    }

    if (!parsedVariations || parsedVariations.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one product variation is required",
      });
    }

    // Process variations
    const processedVariations = parsedVariations.map((variation, index) => {
      // Validate required variation fields
      if (!variation.color || !variation.price) {
        throw new Error(`Variation ${index + 1}: color and price are required`);
      }

      // Generate SKU if not provided
      if (!variation.sku) {
        const baseSlug = name.toLowerCase().replace(/[^a-z0-9]/g, "-");
        const variantId = [
          variation.color,
          variation.length,
          variation.size,
          variation.texture,
        ]
          .filter(Boolean)
          .join("-")
          .toLowerCase()
          .replace(/[^a-z0-9-]/g, "-");
        variation.sku = `${baseSlug}-${variantId}-${Date.now()}${index}`;
      }

      return {
        ...variation,
        price: parseFloat(variation.price),
        salePrice: variation.salePrice ? parseFloat(variation.salePrice) : null,
        stock: parseInt(variation.stock) || 0,
        isActive: variation.isActive !== false,
        images: [], // Initialize empty images array
      };
    });

    // Handle variation images AFTER processedVariations is created
    for (let i = 0; i < processedVariations.length; i++) {
      const variationImageFiles = Object.keys(organizedFiles)
        .filter((key) => key.startsWith(`variation_${i}_image_`))
        .map((key) => organizedFiles[key][0])
        .filter(Boolean);

      if (variationImageFiles.length > 0) {
        try {
          const variationImages = await Promise.all(
            variationImageFiles.map(async (item) => {
              const result = await cloudinary.uploader.upload(item.path, {
                resource_type: "image",
                folder: "hair-products/variations",
                transformation: [
                  { width: 600, height: 600, crop: "fill", quality: "auto" },
                  { format: "webp" },
                ],
              });
              return result.secure_url;
            })
          );

          processedVariations[i].images = variationImages;
        } catch (uploadError) {
          console.error("Variation image upload error:", uploadError);
          // Don't throw error, just log it and continue with empty images
          processedVariations[i].images = [];
        }
      }
    }

    // Rest of your existing code remains the same...
    // Check for duplicate SKUs
    const skus = processedVariations.map((v) => v.sku);
    const duplicateSKUs = skus.filter(
      (sku, index) => skus.indexOf(sku) !== index
    );
    if (duplicateSKUs.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Duplicate SKUs found: ${duplicateSKUs.join(", ")}`,
      });
    }

    // ... rest of your existing code

    // Parse other JSON fields safely
    const parseJsonField = (field, defaultValue = {}) => {
      try {
        return field ? JSON.parse(field) : defaultValue;
      } catch {
        return defaultValue;
      }
    };

    const parsedAvailableOptions = parseJsonField(availableOptions, {});
    const parsedSpecifications = parseJsonField(specifications, {});
    const parsedCareInstructions = parseJsonField(careInstructions, []);
    const parsedFeatures = parseJsonField(features, []);
    const parsedTags = parseJsonField(tags, []);

    // Generate unique slug
    let slug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim("-");

    let uniqueSlug = slug;
    let counter = 1;
    while (await productModel.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }

    const productData = {
      name: name.trim(),
      description: description.trim(),
      basePrice: parseFloat(basePrice),
      category,
      subCategory,
      brand: brand?.trim() || "",
      bestSeller: bestSeller === "true" || bestSeller === true,
      isNew: isNew === "true" || isNew === true,
      isFeatured: isFeatured === "true" || isFeatured === true,
      variations: processedVariations,
      availableOptions: parsedAvailableOptions,
      specifications: parsedSpecifications,
      careInstructions: parsedCareInstructions,
      features: parsedFeatures,
      images: imagesUrl,
      slug: uniqueSlug,
      metaTitle: metaTitle?.trim() || name.trim(),
      metaDescription:
        metaDescription?.trim() || description.trim().substring(0, 160),
      tags: parsedTags,
      status: "active",
      date: Date.now(),
    };

    const product = new productModel(productData);
    await product.save();

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      data: {
        productId: product._id,
        slug: product.slug,
        name: product.name,
      },
    });
  } catch (error) {
    console.error("Add Product Error:", error);

    // Handle specific MongoDB errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue || {})[0];
      return res.status(409).json({
        success: false,
        message: `${field} already exists. Please use a different value.`,
      });
    }

    // Handle validation errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors,
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || "Internal server error while adding product",
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id, ...updates } = req.body;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Valid product ID is required",
      });
    }

    // Get existing product
    const existingProduct = await productModel.findById(id);
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Handle file uploads if present
    if (req.files && Object.keys(req.files).length > 0) {
      const organizeUploadedFiles = (files) => {
        if (!files || !Array.isArray(files)) return {};
        const organized = {};
        files.forEach((file) => {
          if (!organized[file.fieldname]) {
            organized[file.fieldname] = [];
          }
          organized[file.fieldname].push(file);
        });
        return organized;
      };

      const organizedFiles = organizeUploadedFiles(req.files);
      const imageFiles = [
        organizedFiles.image1?.[0],
        organizedFiles.image2?.[0],
        organizedFiles.image3?.[0],
        organizedFiles.image4?.[0],
      ].filter(Boolean);

      if (imageFiles.length > 0) {
        const newImages = await Promise.all(
          imageFiles.map(async (item) => {
            const result = await cloudinary.uploader.upload(item.path, {
              resource_type: "image",
              folder: "hair-products/main",
              transformation: [
                { width: 800, height: 800, crop: "fill", quality: "auto" },
                { format: "webp" },
              ],
            });
            return result.secure_url;
          })
        );
        updates.images = newImages;
      }
    }

    // Parse JSON fields if they exist in form-data
    if (updates.variations && typeof updates.variations === "string") {
      try {
        updates.variations = JSON.parse(updates.variations);
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Invalid variations format",
        });
      }
    }

    // Validate and process variations if provided
    if (updates.variations && Array.isArray(updates.variations)) {
      // Validate each variation
      const invalidVariations = updates.variations.filter(
        (v) =>
          !v.color ||
          typeof v.price !== "number" ||
          v.price < 0 ||
          typeof v.stock !== "number" ||
          v.stock < 0
      );

      if (invalidVariations.length > 0) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid variation data: each variation must have color, valid price, and stock",
        });
      }

      // Ensure numeric fields are properly converted
      updates.variations = updates.variations.map((v) => ({
        ...v,
        price: parseFloat(v.price) || 0,
        salePrice: v.salePrice ? parseFloat(v.salePrice) : undefined,
        stock: parseInt(v.stock) || 0,
        isActive: v.isActive !== false,
      }));
    }

    // Handle basePrice updates (only if variations weren't directly provided)
    if (updates.basePrice !== undefined && (!updates.variations || !Array.isArray(updates.variations))) {
      updates.basePrice = parseFloat(updates.basePrice);
      
      // Update all variations with the new basePrice
      if (existingProduct.variations && existingProduct.variations.length > 0) {
        updates.variations = existingProduct.variations.map((variation) => ({
          ...variation,
          price: parseFloat(updates.basePrice),
          salePrice: variation.salePrice && variation.salePrice < updates.basePrice
            ? variation.salePrice
            : undefined,
        }));
      }
    }

    // Handle totalStock updates (only if variations weren't directly provided)
    if (updates.totalStock !== undefined && (!updates.variations || !Array.isArray(updates.variations))) {
      const totalStock = parseInt(updates.totalStock);
      if (existingProduct.variations && existingProduct.variations.length > 0) {
        const activeVariations = existingProduct.variations.filter(
          (v) => v.isActive !== false
        );
        
        if (activeVariations.length > 0) {
          const stockPerVariation = Math.floor(totalStock / activeVariations.length);
          const remainder = totalStock % activeVariations.length;

          let activeIndex = 0;
          updates.variations = existingProduct.variations.map((variation) => {
            if (variation.isActive !== false) {
              const newStock = stockPerVariation + (activeIndex < remainder ? 1 : 0);
              activeIndex++;
              return { ...variation, stock: newStock };
            }
            return variation;
          });
        }
      }
    }

    console.log("Final updates:", JSON.stringify(updates, null, 2));

    // Update the product
    const product = await productModel.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found after update",
      });
    }

    // Calculate enhanced product data
    const enhancedProduct = {
      ...product.toObject(),
      priceRange:
        product.variations && product.variations.length > 0
          ? {
              min: Math.min(...product.variations.map((v) => v.salePrice || v.price)),
              max: Math.max(...product.variations.map((v) => v.salePrice || v.price)),
            }
          : null,
      totalStock: product.variations
        ? product.variations.reduce((sum, v) => sum + (v.stock || 0), 0)
        : 0,
      activeVariations: product.variations
        ? product.variations.filter((v) => v.isActive && v.stock > 0).length
        : 0,
    };

    res.json({
      success: true,
      message: "Product updated successfully",
      data: enhancedProduct,
    });
  } catch (error) {
    console.error("Update Product Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update product",
    });
  }
};

// const updateProduct = async (req, res) => {
//   try {
//     const { id, totalStock, basePrice, variations, ...otherUpdates } = req.body;

//     if (!id || !mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({
//         success: false,
//         message: "Valid product ID is required",
//       });
//     }
//     const organizeUploadedFiles = (files) => {
//       if (!files || !Array.isArray(files)) return {};
//       const organized = {};
//       files.forEach((file) => {
//         if (!organized[file.fieldname]) {
//           organized[file.fieldname] = [];
//         }
//         organized[file.fieldname].push(file);
//       });
//       return organized;
//     };

//     const organizedFiles = organizeUploadedFiles(req.files || []);

//     // NOW handle main product images
//     const imageFiles = [
//       organizedFiles.image1?.[0],
//       organizedFiles.image2?.[0],
//       organizedFiles.image3?.[0],
//       organizedFiles.image4?.[0],
//     ].filter(Boolean);

//     let updates = { ...otherUpdates };

//     // Get the existing product to work with variations
//     const existingProduct = await productModel.findById(id);
//     if (!existingProduct) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found",
//       });
//     }

//     let updatedVariations = [...existingProduct.variations];

//     // PRIORITY 1: Handle direct variations update (from frontend editing)
//     if (variations && Array.isArray(variations)) {
//       // Use the variations sent from frontend directly
//       updatedVariations = variations.map((v) => ({
//         ...v,
//         // Ensure numeric fields are properly converted
//         price: parseFloat(v.price) || 0,
//         salePrice: v.salePrice ? parseFloat(v.salePrice) : undefined,
//         stock: parseInt(v.stock) || 0,
//         isActive: v.isActive !== false, // Default to true unless explicitly false
//       }));

//       updates.variations = updatedVariations;
//     }
//     // PRIORITY 2: Handle totalStock update - distribute across variations (legacy support)
//     else if (totalStock !== undefined) {
//       if (updatedVariations && updatedVariations.length > 0) {
//         const activeVariations = updatedVariations.filter(
//           (v) => v.isActive !== false
//         );
//         if (activeVariations.length > 0) {
//           const stockPerVariation = Math.floor(
//             totalStock / activeVariations.length
//           );
//           const remainder = totalStock % activeVariations.length;

//           let activeIndex = 0;
//           updatedVariations = updatedVariations.map((variation) => {
//             if (variation.isActive !== false) {
//               const newStock =
//                 stockPerVariation + (activeIndex < remainder ? 1 : 0);
//               activeIndex++;
//               return { ...variation, stock: newStock };
//             }
//             return variation;
//           });

//           updates.variations = updatedVariations;
//         }
//       }
//     }

//     // Handle basePrice update - sync with variations if no direct variations update
//     if (basePrice !== undefined) {
//       updates.basePrice = parseFloat(basePrice);

//       // Only update variation prices if variations weren't directly provided
//       if (!variations && updatedVariations && updatedVariations.length > 0) {
//         updatedVariations = updatedVariations.map((variation) => ({
//           ...variation,
//           price: parseFloat(basePrice),
//           // Keep salePrice if it exists and is lower than basePrice
//           salePrice:
//             variation.salePrice && variation.salePrice < basePrice
//               ? variation.salePrice
//               : undefined,
//         }));
//         updates.variations = updatedVariations;
//       }
//     }

//     // Handle image uploads if present
//     if (req.files && Object.keys(req.files).length > 0) {
//       // Handle main product images
//       const imageFiles = [
//         organizedFiles.image1?.[0],
//         organizedFiles.image2?.[0],
//         organizedFiles.image3?.[0],
//         organizedFiles.image4?.[0],
//       ].filter(Boolean);

//       if (imageFiles.length > 0) {
//         const newImages = await Promise.all(
//           imageFiles.map(async (item) => {
//             const result = await cloudinary.uploader.upload(item.path, {
//               resource_type: "image",
//               folder: "hair-products/main",
//               transformation: [
//                 { width: 800, height: 800, crop: "fill", quality: "auto" },
//                 { format: "webp" },
//               ],
//             });
//             return result.secure_url;
//           })
//         );
//         updates.images = newImages;
//       }
//     }

//     // Parse JSON fields if they exist (for form-data requests)
//     if (updates.variations && typeof updates.variations === "string") {
//       try {
//         updates.variations = JSON.parse(updates.variations);
//       } catch {
//         return res.status(400).json({
//           success: false,
//           message: "Invalid variations format",
//         });
//       }
//     }

//     // Validate variations before saving
//     if (updates.variations) {
//       const invalidVariations = updates.variations.filter(
//         (v) =>
//           !v.color ||
//           typeof v.price !== "number" ||
//           v.price < 0 ||
//           typeof v.stock !== "number" ||
//           v.stock < 0
//       );

//       if (invalidVariations.length > 0) {
//         return res.status(400).json({
//           success: false,
//           message:
//             "Invalid variation data: each variation must have color, valid price, and stock",
//         });
//       }
//     }

//     console.log("Updating product with:", JSON.stringify(updates, null, 2)); // Debug log

//     const product = await productModel.findByIdAndUpdate(
//       id,
//       { ...updates, updatedAt: new Date() },
//       { new: true, runValidators: true }
//     );

//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found",
//       });
//     }

//     // Calculate the enhanced product data to return
//     const enhancedProduct = {
//       ...product.toObject(),
//       priceRange:
//         product.variations && product.variations.length > 0
//           ? {
//               min: Math.min(
//                 ...product.variations.map((v) => v.salePrice || v.price)
//               ),
//               max: Math.max(
//                 ...product.variations.map((v) => v.salePrice || v.price)
//               ),
//             }
//           : null,
//       totalStock: product.variations
//         ? product.variations.reduce((sum, v) => sum + (v.stock || 0), 0)
//         : 0,
//       activeVariations: product.variations
//         ? product.variations.filter((v) => v.isActive && v.stock > 0).length
//         : 0,
//     };

//     console.log(
//       "Returning enhanced product:",
//       JSON.stringify(enhancedProduct, null, 2)
//     ); // Debug log

//     res.json({
//       success: true,
//       message: "Product updated successfully",
//       data: enhancedProduct,
//     });
//   } catch (error) {
//     console.error("Update Product Error:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message || "Failed to update product",
//     });
//   }
// };

// Enhanced listProducts with filtering and pagination
const listProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      subCategory,
      minPrice,
      maxPrice,
      inStock,
      status = "active",
      sortBy = "createdAt",
      sortOrder = "desc",
      search,
    } = req.query;

    // Build filter object
    const filter = { status };

    if (category) filter.category = category;
    if (subCategory) filter.subCategory = subCategory;
    if (inStock === "true") {
      filter["variations.stock"] = { $gt: 0 };
    }

    // Price range filter
    if (minPrice || maxPrice) {
      filter.basePrice = {};
      if (minPrice) filter.basePrice.$gte = parseFloat(minPrice);
      if (maxPrice) filter.basePrice.$lte = parseFloat(maxPrice);
    }

    // Search functionality
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    // Sort object
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [products, totalCount] = await Promise.all([
      productModel.find(filter).sort(sort).skip(skip).limit(limitNum).lean(),
      productModel.countDocuments(filter),
    ]);

    // Calculate additional info for each product
    const enhancedProducts = products.map((product) => ({
      ...product,
      priceRange: {
        min: Math.min(...product.variations.map((v) => v.salePrice || v.price)),
        max: Math.max(...product.variations.map((v) => v.salePrice || v.price)),
      },
      totalStock: product.variations.reduce(
        (sum, v) => sum + (v.stock || 0),
        0
      ),
      activeVariations: product.variations.filter(
        (v) => v.isActive && v.stock > 0
      ).length,
    }));

    res.json({
      success: true,
      data: {
        products: enhancedProducts,
        pagination: {
          currentPage: pageNum,
          totalPages: Math.ceil(totalCount / limitNum),
          totalProducts: totalCount,
          hasNextPage: pageNum < Math.ceil(totalCount / limitNum),
          hasPrevPage: pageNum > 1,
        },
      },
    });
  } catch (error) {
    console.error("List Products Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
};

// Enhanced single product with variation details
const singleProduct = async (req, res) => {
  try {
    const { productId, slug } = req.query;

    if (!productId && !slug) {
      return res.status(400).json({
        success: false,
        message: "Product ID or slug is required",
      });
    }

    let query = {};
    if (productId) {
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid product ID format",
        });
      }
      query._id = productId;
    } else {
      query.slug = slug;
    }

    const product = await productModel.findOne(query);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Increment view count
    await productModel.findByIdAndUpdate(product._id, {
      $inc: { views: 1 },
    });

    // Get active variations only
    const activeVariations = product.variations.filter((v) => v.isActive);

    const productData = {
      ...product.toObject(),
      variations: activeVariations,
      priceRange: {
        min: Math.min(...activeVariations.map((v) => v.salePrice || v.price)),
        max: Math.max(...activeVariations.map((v) => v.salePrice || v.price)),
      },
      totalStock: activeVariations.reduce((sum, v) => sum + (v.stock || 0), 0),
    };

    res.json({
      success: true,
      data: productData,
    });
  } catch (error) {
    console.error("Single Product Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
    });
  }
};

// Soft delete product
const removeProduct = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Valid product ID is required",
      });
    }

    // Soft delete by updating status
    const product = await productModel.findByIdAndUpdate(
      id,
      { status: "inactive", updatedAt: new Date() },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      message: "Product removed successfully",
    });
  } catch (error) {
    console.error("Remove Product Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to remove product",
    });
  }
};

export {
  addProduct,
  updateProduct,
  listProducts,
  singleProduct,
  removeProduct,
};
