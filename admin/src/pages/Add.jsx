import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

// Predefined sets for admin to pick from
const SIZE_OPTIONS = ["Small", "Medium", "Large"];
const LENGTH_OPTIONS = ["10 inch", "12 inch", "14 inch", "16 inch", "18 inch"];
const COLOR_MAP = [
  "2", "4", "1b", "30", "1", "350", "27", "33", "30", "350", "320", "613", "613", "613", "t/30", "t/30/613"
];
// Admin options (auto from keys, no repeats)
const COLOR_OPTIONS = [...new Set(COLOR_MAP)];
const TEXTURE_OPTIONS = ["Straight", "Wavy", "Curly", "Kinky"];
const WEIGHT_OPTIONS = ["100g", "150g", "200g"];
const CATEGORY_OPTIONS = ["Wigs", "Hair Extensions", "Braiding Extensions", "Crotchet"];
const SUB_CATEGORY_OPTIONS = {
  "Hair Extensions": [
    "Tape-in", "Wefts", "Halo Weft", "Toppers", "Claw Ponytail", "Ponytails", "I-tip", "K-tip"
  ],
  "Braiding Extensions": [
    "Pre-stretched Braiding Hair", "Passion Twist", "French Curls", "Kinky",
    "Marley Twist", "3 Colored Ombré Braiding Hair", "Boho Human Hair Curls", "Boho Fiber Curls"
  ],
  "Crotchet": [
    "Butterfly Locs", "Hand Made Butterfly Locs", "Crotchet Twist", "Crotchet Braids",
    "Faux Locs (Curly End)", "Faux Locs (Straight End)"
  ],
  "Wigs": ["Human Hair Wigs", "Fiber Hair Wigs"]
};
const HAIR_GRADE_OPTIONS = ["7A", "8A", "9A", "10A", "11A"];
const DENSITY_OPTIONS = ["130%", "150%", "180%", "200%"];
const ORIGIN_OPTIONS = ["Brazilian", "Peruvian", "Malaysian", "Indian", "Chinese"];
const MATERIAL_OPTIONS = ["Human Hair", "Synthetic", "Blend"];

const Add = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    subCategory: "",
    brand: "",
    basePrice: "",
    images: [],
    availableOptions: {
      sizes: [],
      lengths: [],
      colors: [],
      textures: [],
      weights: [],
    },
    specifications: {
      material: "",
      origin: "",
      capConstruction: "",
      density: "",
      hairGrade: ""
    },
    careInstructions: [""],
    features: [""],
    bestSeller: false,
    isNew: false,
    isFeatured: false,
    status: "active",
    variations: [],
    metaTitle: "",
    metaDescription: "",
    tags: "",
    date: Date.now()
  });

  const [subCategories, setSubCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errors, setErrors] = useState({});
  
const backendUrl = import.meta.env.VITE_BACKEND_URL;
  // Update subcategories when category changes
  useEffect(() => {
    if (formData.category && SUB_CATEGORY_OPTIONS[formData.category]) {
      setSubCategories(SUB_CATEGORY_OPTIONS[formData.category]);
      // Reset subcategory when category changes
      setFormData(prev => ({ ...prev, subCategory: "" }));
    } else {
      setSubCategories([]);
    }
  }, [formData.category]);

  // Handle text input
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle nested object changes
  const handleNestedChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  // Handle multi-selects
  const handleMultiSelect = (field, e) => {
    const values = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prev => ({
      ...prev,
      availableOptions: {
        ...prev.availableOptions,
        [field]: values
      }
    }));
  };

  // Handle main image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages(prev => [...prev, ...files]);

    // Create preview URLs
    const fileURLs = files.map((file) => URL.createObjectURL(file));
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...fileURLs]
    }));
  };

  // Remove main image
  const removeMainImage = (index) => {
    // Remove from images array (actual files)
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);

    // Remove from preview URLs
    const newImageUrls = [...formData.images];
    URL.revokeObjectURL(newImageUrls[index]); // Clean up object URL
    newImageUrls.splice(index, 1);
    setFormData(prev => ({ ...prev, images: newImageUrls }));
  };

  // Handle array field changes (careInstructions, features)
  const handleArrayFieldChange = (field, index, value) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData(prev => ({ ...prev, [field]: newArray }));
  };

  // Add new item to array field
  const addArrayFieldItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], ""]
    }));
  };

  // Remove item from array field
  const removeArrayFieldItem = (field, index) => {
    if (formData[field].length <= 1) return;
    const newArray = [...formData[field]];
    newArray.splice(index, 1);
    setFormData(prev => ({ ...prev, [field]: newArray }));
  };

  // Add new variation
  const addVariation = () => {
    setFormData(prev => ({
      ...prev,
      variations: [
        ...prev.variations,
        {
          size: "",
          length: "",
          color: "",
          texture: "",
          weight: "",
          price: "",
          salePrice: "",
          stock: 0,
          sku: "",
          isActive: true,
          images: [],
        },
      ],
    }));
  };

  // Remove variation
  const removeVariation = (index) => {
    const newVariations = [...formData.variations];
    // Clean up any object URLs for variation images
    newVariations[index].images.forEach(img => {
      if (img.startsWith('blob:')) {
        URL.revokeObjectURL(img);
      }
    });
    newVariations.splice(index, 1);
    setFormData(prev => ({ ...prev, variations: newVariations }));
  };

  // Handle variation change
  const handleVariationChange = (index, field, value) => {
    const newVariations = [...formData.variations];
    newVariations[index][field] = value;
    setFormData(prev => ({ ...prev, variations: newVariations }));
  };

// Replace the existing handleVariationImageUpload function with this:
const handleVariationImageUpload = (index, e) => {
  const files = Array.from(e.target.files);
  const newVariations = [...formData.variations];
  
  // Store both the actual files and preview URLs
  if (!newVariations[index].imageFiles) {
    newVariations[index].imageFiles = [];
  }
  
  newVariations[index].imageFiles = [...newVariations[index].imageFiles, ...files];
  
  const fileURLs = files.map((file) => URL.createObjectURL(file));
  newVariations[index].images = [...newVariations[index].images, ...fileURLs];
  
  setFormData(prev => ({ ...prev, variations: newVariations }));
};
  // Remove variation image
  const removeVariationImage = (variationIndex, imageIndex) => {
    const newVariations = [...formData.variations];
    const imageUrl = newVariations[variationIndex].images[imageIndex];
    if (imageUrl.startsWith('blob:')) {
      URL.revokeObjectURL(imageUrl);
    }
    newVariations[variationIndex].images.splice(imageIndex, 1);
    setFormData(prev => ({ ...prev, variations: newVariations }));
  };

  // Generate SKU based on product attributes
  const generateSKU = (variation, index) => {
    const { size, length, color, texture, weight } = variation;
    const baseSKU = formData.name.substring(0, 3).toUpperCase() || 'PRD';
    const attributes = [size, length, color, texture, weight].filter(Boolean);
    const attributeStr = attributes.length > 0 ? attributes.join('-') : 'VAR';
    return `${baseSKU}-${attributeStr}-${index + 1}`.replace(/\s+/g, '');
  };

  // Reset form
  const resetForm = () => {
    // Clean up object URLs
    formData.images.forEach(url => {
      if (url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    });
    formData.variations.forEach(variation => {
      variation.images.forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    });

    setFormData({
      name: "",
      description: "",
      category: "",
      subCategory: "",
      brand: "",
      basePrice: "",
      images: [],
      availableOptions: {
        sizes: [],
        lengths: [],
        colors: [],
        textures: [],
        weights: [],
      },
      specifications: {
        material: "",
        origin: "",
        capConstruction: "",
        density: "",
        hairGrade: ""
      },
      careInstructions: [""],
      features: [""],
      bestSeller: false,
      isNew: false,
      isFeatured: false,
      status: "active",
      variations: [],
      metaTitle: "",
      metaDescription: "",
      tags: "",
      date: Date.now()
    });
    setImages([]);
    setErrors({});
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.subCategory) newErrors.subCategory = "Sub category is required";
    if (!formData.basePrice || parseFloat(formData.basePrice) <= 0) {
      newErrors.basePrice = "Valid base price is required";
    }
    if (images.length === 0) newErrors.images = "At least one image is required";

    // Validate variations
    if (formData.variations.length === 0) {
      newErrors.variations = "At least one variation is required";
    } else {
      formData.variations.forEach((variation, index) => {
        if (!variation.color) {
          newErrors[`variation_${index}_color`] = "Color is required for each variation";
        }
        if (!variation.price || parseFloat(variation.price) <= 0) {
          newErrors[`variation_${index}_price`] = "Valid price is required for each variation";
        }
        if (variation.stock === "" || variation.stock < 0) {
          newErrors[`variation_${index}_stock`] = "Valid stock quantity is required";
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);

    try {
      const formDataObj = new FormData();

      // Basic fields
      formDataObj.append('name', formData.name.trim());
      formDataObj.append('description', formData.description.trim());
      formDataObj.append('basePrice', formData.basePrice.toString());
      formDataObj.append('category', formData.category);
      formDataObj.append('subCategory', formData.subCategory);
      formDataObj.append('brand', formData.brand || '');
      formDataObj.append('bestSeller', formData.bestSeller.toString());
      formDataObj.append('isNew', formData.isNew.toString());
      formDataObj.append('isFeatured', formData.isFeatured.toString());
      formDataObj.append('status', formData.status);

      // Complex objects as JSON
 // Append variation files and prepare variation data
formData.variations.forEach((variation, varIndex) => {
  if (variation.imageFiles) {
    variation.imageFiles.forEach((file, imgIndex) => {
      formDataObj.append(`variation_${varIndex}_image_${imgIndex}`, file);
    });
  }
});

// Clean variations data for JSON (remove imageFiles and blob URLs)
const cleanVariations = formData.variations.map(v => {
  const { imageFiles, images, ...cleanVariation } = v;
  return cleanVariation;
});

formDataObj.append('variations', JSON.stringify(cleanVariations));
      formDataObj.append("availableOptions", JSON.stringify({
        colors: COLOR_OPTIONS,
        sizes: ["Small", "Medium"],
        lengths: ["10 inch", "12 inch"]
      }));
      formDataObj.append('specifications', JSON.stringify(formData.specifications));
      formDataObj.append('careInstructions', JSON.stringify(formData.careInstructions.filter(c => c.trim())));
      formDataObj.append('features', JSON.stringify(formData.features.filter(f => f.trim())));
      formDataObj.append('metaTitle', formData.metaTitle || formData.name);
      formDataObj.append('metaDescription', formData.metaDescription || formData.description.substring(0, 160));

      // Format tags as array
      const formattedTags = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag);
      formDataObj.append('tags', JSON.stringify(formattedTags));

      setUploadProgress(30);

      // Main product images
      images.forEach((image, index) => {
        formDataObj.append(`image${index + 1}`, image, `image${index + 1}.jpg`);
      });

      setUploadProgress(60);

      // Add variation images
formData.variations.forEach((variation, varIndex) => {
  variation.images.forEach((imageBlob, imgIndex) => {
    // Convert blob URL back to file if needed
    // For now, we'll need to store actual File objects, not blob URLs
    if (imageBlob instanceof File) {
      formDataObj.append(`variation_${varIndex}_image_${imgIndex}`, imageBlob);
    }
  });
});



      const response = await fetch(`${backendUrl}/api/product/add`, {
        method: "POST",
        body: formDataObj
      });

      setUploadProgress(90);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Network error occurred" }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
    setUploadProgress(100);

    if (result.success) {
      toast.success(result.message || "Product added successfully!");
      resetForm();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      throw new Error(result.message || "Failed to add product");
    }

  } catch (error) {
    console.error("Upload error:", error);
    toast.error(error.message || "An error occurred while uploading. Please try again.");
  } finally {
    setIsUploading(false);
    setTimeout(() => setUploadProgress(0), 1000);
  }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-6">Add New Product</h2>

      {/* Success Message */}
      {errors.success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {errors.success}
        </div>
      )}

      {/* Error Messages */}
      {errors.submit && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {errors.submit}
        </div>
      )}

      {/* Upload Progress */}
      {isUploading && (
        <div className="mb-4">
          <div className="bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-1">Uploading... {uploadProgress}%</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-medium mb-1">Name *</label>
            <input
              type="text"
              name="name"
              className={`w-full border rounded p-2 ${errors.name ? 'border-red-500' : ''}`}
              value={formData.name}
              onChange={handleChange}
              required
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block font-medium mb-1">Brand</label>
            <input
              type="text"
              name="brand"
              className="w-full border rounded p-2"
              value={formData.brand}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Category *</label>
            <select
              name="category"
              className={`w-full border rounded p-2 ${errors.category ? 'border-red-500' : ''}`}
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              {CATEGORY_OPTIONS.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
          </div>

          <div>
            <label className="block font-medium mb-1">Sub Category *</label>
            <select
              name="subCategory"
              className={`w-full border rounded p-2 ${errors.subCategory ? 'border-red-500' : ''}`}
              value={formData.subCategory}
              onChange={handleChange}
              required
              disabled={!formData.category}
            >
              <option value="">Select Sub Category</option>
              {subCategories.map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
            {errors.subCategory && <p className="text-red-500 text-sm mt-1">{errors.subCategory}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="block font-medium mb-1">Base Price *</label>
            <input
              type="number"
              name="basePrice"
              className={`w-full border rounded p-2 ${errors.basePrice ? 'border-red-500' : ''}`}
              value={formData.basePrice}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              placeholder="0.00"
            />
            {errors.basePrice && <p className="text-red-500 text-sm mt-1">{errors.basePrice}</p>}
          </div>
        </div>

        <div>
          <label className="block font-medium mb-1">Description *</label>
          <textarea
            name="description"
            className={`w-full border rounded p-2 ${errors.description ? 'border-red-500' : ''}`}
            rows="4"
            value={formData.description}
            onChange={handleChange}
            required
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>

        {/* Images */}
        <div>
          <label className="block font-medium mb-1">Upload Main Images *</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className={`mb-2 ${errors.images ? 'text-red-500' : ''}`}
          />
          {errors.images && <p className="text-red-500 text-sm mb-2">{errors.images}</p>}
          <div className="flex gap-2 mt-2 flex-wrap">
            {formData.images.map((img, idx) => (
              <div key={idx} className="relative">
                <img
                  src={img}
                  alt="preview"
                  className="w-20 h-20 object-cover rounded"
                />
                <button
                  type="button"
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 text-xs"
                  onClick={() => removeMainImage(idx)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Specifications */}
        <div className="border p-4 rounded">
          <h3 className="text-lg font-semibold mb-3">Specifications</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Material</label>
              <select
                value={formData.specifications.material}
                onChange={(e) => handleNestedChange("specifications", "material", e.target.value)}
                className="w-full border rounded p-2"
              >
                <option value="">Select Material</option>
                {MATERIAL_OPTIONS.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1">Origin</label>
              <select
                value={formData.specifications.origin}
                onChange={(e) => handleNestedChange("specifications", "origin", e.target.value)}
                className="w-full border rounded p-2"
              >
                <option value="">Select Origin</option>
                {ORIGIN_OPTIONS.map(o => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1">Cap Construction</label>
              <input
                type="text"
                className="w-full border rounded p-2"
                value={formData.specifications.capConstruction}
                onChange={(e) => handleNestedChange("specifications", "capConstruction", e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-1">Density</label>
              <select
                value={formData.specifications.density}
                onChange={(e) => handleNestedChange("specifications", "density", e.target.value)}
                className="w-full border rounded p-2"
              >
                <option value="">Select Density</option>
                {DENSITY_OPTIONS.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1">Hair Grade</label>
              <select
                value={formData.specifications.hairGrade}
                onChange={(e) => handleNestedChange("specifications", "hairGrade", e.target.value)}
                className="w-full border rounded p-2"
              >
                <option value="">Select Hair Grade</option>
                {HAIR_GRADE_OPTIONS.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Care Instructions */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Care Instructions</h3>
          {formData.careInstructions.map((instruction, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                className="flex-1 border rounded p-2"
                value={instruction}
                onChange={(e) => handleArrayFieldChange("careInstructions", index, e.target.value)}
                placeholder="Care instruction"
              />
              <button
                type="button"
                className="bg-red-500 text-white px-3 rounded disabled:bg-gray-400"
                onClick={() => removeArrayFieldItem("careInstructions", index)}
                disabled={formData.careInstructions.length === 1}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="bg-gray-200 px-4 py-2 rounded mt-2"
            onClick={() => addArrayFieldItem("careInstructions")}
          >
            Add Instruction
          </button>
        </div>

        {/* Features */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Features</h3>
          {formData.features.map((feature, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                className="flex-1 border rounded p-2"
                value={feature}
                onChange={(e) => handleArrayFieldChange("features", index, e.target.value)}
                placeholder="Product feature"
              />
              <button
                type="button"
                className="bg-red-500 text-white px-3 rounded disabled:bg-gray-400"
                onClick={() => removeArrayFieldItem("features", index)}
                disabled={formData.features.length === 1}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="bg-gray-200 px-4 py-2 rounded mt-2"
            onClick={() => addArrayFieldItem("features")}
          >
            Add Feature
          </button>
        </div>

        {/* Available Options */}
        <div className="border p-4 rounded">
          <h3 className="text-lg font-semibold mb-3">Available Options</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block">Sizes</label>
              <select
                multiple
                value={formData.availableOptions.sizes}
                onChange={(e) => handleMultiSelect("sizes", e)}
                className="w-full border rounded p-2 h-32"
              >
                {SIZE_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <p className="text-sm text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
            </div>

            <div>
              <label className="block">Lengths</label>
              <select
                multiple
                value={formData.availableOptions.lengths}
                onChange={(e) => handleMultiSelect("lengths", e)}
                className="w-full border rounded p-2 h-32"
              >
                {LENGTH_OPTIONS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block">Colors</label>
              <select
                multiple
                value={formData.availableOptions.colors}
                onChange={(e) => handleMultiSelect("colors", e)}
                className="w-full border rounded p-2 h-32"
              >
                {COLOR_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block">Textures</label>
              <select
                multiple
                value={formData.availableOptions.textures}
                onChange={(e) => handleMultiSelect("textures", e)}
                className="w-full border rounded p-2 h-32"
              >
                {TEXTURE_OPTIONS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block">Weights</label>
              <select
                multiple
                value={formData.availableOptions.weights}
                onChange={(e) => handleMultiSelect("weights", e)}
                className="w-full border rounded p-2 h-32"
              >
                {WEIGHT_OPTIONS.map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Variations */}
        <div className="border p-4 rounded">
          <h3 className="text-lg font-semibold mb-3">Variations</h3>
          {errors.variations && <p className="text-red-500 text-sm mb-2">{errors.variations}</p>}

          {formData.variations.map((variation, idx) => (
            <div key={idx} className="border p-4 mb-4 rounded space-y-4 relative">
              <button
                type="button"
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6"
                onClick={() => removeVariation(idx)}
              >
                ×
              </button>

              <h4 className="font-medium">Variation #{idx + 1}</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select
                  value={variation.color}
                  onChange={(e) => handleVariationChange(idx, "color", e.target.value)}
                  className={`border rounded p-2 ${errors[`variation_${idx}_color`] ? 'border-red-500' : ''}`}
                  required
                >
                  <option value="">Select Color</option>
                  {formData.availableOptions.colors.map((colorName) => (
                    <option key={colorName} value={colorName}>
                      {colorName}
                    </option>
                  ))}
                </select>
                {errors[`variation_${idx}_color`] && (
                  <p className="text-red-500 text-xs mt-1">{errors[`variation_${idx}_color`]}</p>
                )}

                <select
                  value={variation.texture}
                  onChange={(e) => handleVariationChange(idx, "texture", e.target.value)}
                  className="border rounded p-2"
                >
                  <option value="">Select Texture</option>
                  {formData.availableOptions.textures.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>

                <select
                  value={variation.weight}
                  onChange={(e) => handleVariationChange(idx, "weight", e.target.value)}
                  className="border rounded p-2"
                >
                  <option value="">Select Weight</option>
                  {formData.availableOptions.weights.map((w) => (
                    <option key={w} value={w}>
                      {w}
                    </option>
                  ))}
                </select>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={variation.isActive}
                    onChange={(e) => handleVariationChange(idx, "isActive", e.target.checked)}
                    className="mr-2"
                  />
                  <label>Active</label>
                </div>

                <input
                  type="number"
                  placeholder="Price *"
                  value={variation.price}
                  onChange={(e) => handleVariationChange(idx, "price", e.target.value)}
                  className={`border rounded p-2 ${errors[`variation_${idx}_price`] ? 'border-red-500' : ''}`}
                  required
                  min="0"
                  step="0.01"
                />
                {errors[`variation_${idx}_price`] && (
                  <p className="text-red-500 text-xs mt-1">{errors[`variation_${idx}_price`]}</p>
                )}

                <input
                  type="number"
                  placeholder="Sale Price"
                  value={variation.salePrice}
                  onChange={(e) => handleVariationChange(idx, "salePrice", e.target.value)}
                  className="border rounded p-2"
                  min="0"
                  step="0.01"
                />

                <input
                  type="number"
                  placeholder="Stock *"
                  value={variation.stock}
                  onChange={(e) => handleVariationChange(idx, "stock", e.target.value)}
                  className={`border rounded p-2 ${errors[`variation_${idx}_stock`] ? 'border-red-500' : ''}`}
                  required
                  min="0"
                />
                {errors[`variation_${idx}_stock`] && (
                  <p className="text-red-500 text-xs mt-1">{errors[`variation_${idx}_stock`]}</p>
                )}

                <div>
                  <input
                    type="text"
                    placeholder="SKU"
                    value={variation.sku}
                    onChange={(e) => handleVariationChange(idx, "sku", e.target.value)}
                    className="border rounded p-2 w-full"
                  />
                  <button
                    type="button"
                    className="text-xs text-blue-500 mt-1 hover:underline"
                    onClick={() => {
                      const sku = generateSKU(variation, idx);
                      handleVariationChange(idx, "sku", sku);
                    }}
                  >
                    Generate SKU
                  </button>
                </div>
              </div>

         <div className="mt-4">
  <label className="block font-medium mb-2">Variation Images</label>
  <input
    type="file"
    multiple
    accept="image/*"
    onChange={(e) => handleVariationImageUpload(idx, e)}
    className="mb-3"
  />
  <div className="grid grid-cols-4 gap-3 mt-2">
    {variation.images.map((img, imgIdx) => (
      <div key={imgIdx} className="relative group">
        <img
          src={img}
          alt={`Variation ${idx + 1} - Image ${imgIdx + 1}`}
          className="w-20 h-20 object-cover rounded-lg border-2 border-gray-200 group-hover:border-blue-400 transition-colors"
        />
        <button
          type="button"
          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-6 h-6 text-xs font-bold hover:bg-red-600 transition-colors"
          onClick={() => removeVariationImage(idx, imgIdx)}
          title="Remove image"
        >
          ×
        </button>
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b-lg">
          Image {imgIdx + 1}
        </div>
      </div>
    ))}
  </div>
</div>
            </div>
          ))}
          <button
            type="button"
            onClick={addVariation}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Variation
          </button>
        </div>

        {/* SEO & Metadata */}
        <div className="border p-4 rounded">
          <h3 className="text-lg font-semibold mb-3">SEO & Metadata</h3>
          <div className="space-y-4">
            <div>
              <label className="block font-medium mb-1">Meta Title</label>
              <input
                type="text"
                name="metaTitle"
                className="w-full border rounded p-2"
                value={formData.metaTitle}
                onChange={handleChange}
                placeholder="Leave empty to use product name"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Meta Description</label>
              <textarea
                name="metaDescription"
                className="w-full border rounded p-2"
                rows="3"
                value={formData.metaDescription}
                onChange={handleChange}
                placeholder="Leave empty to use first 160 characters of description"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Tags</label>
              <input
                type="text"
                name="tags"
                className="w-full border rounded p-2"
                value={formData.tags}
                onChange={handleChange}
                placeholder="Comma-separated tags (e.g., hair, wig, beauty)"
              />
            </div>
          </div>
        </div>

        {/* Status & Flags */}
        <div className="border p-4 rounded">
          <h3 className="text-lg font-semibold mb-3">Status & Flags</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="bestSeller"
                checked={formData.bestSeller}
                onChange={handleChange}
                className="mr-2"
              />
              <label>Best Seller</label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="isNew"
                checked={formData.isNew}
                onChange={handleChange}
                className="mr-2"
              />
              <label>New Product</label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                className="mr-2"
              />
              <label>Featured</label>
            </div>

            <div className="md:col-span-3">
              <label className="block font-medium mb-1">Status</label>
              <select
                name="status"
                className="w-full border rounded p-2"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="draft">Draft</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 disabled:bg-gray-400"
            onClick={() => {
              setFormData(prev => ({ ...prev, status: "draft" }));
              handleSubmit(new Event('submit'));
            }}
            disabled={isUploading}
          >
            Save as Draft
          </button>
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
            disabled={isUploading}
          >
            {isUploading ? 'Publishing...' : 'Publish Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Add





