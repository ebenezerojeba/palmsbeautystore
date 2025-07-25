
import React, { useState, useCallback } from "react";
import { Upload, X, Save, AlertCircle, Check, ImageIcon } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../App";


const Add = ({ token }) => {
  const [images, setImages] = useState([null, null, null, null]);
  const [draggedOver, setDraggedOver] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errors, setErrors] = useState({});
  

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    subCategory: "",
    category: "Skincare",
    bestSeller: false,
    sizes: [],
  });

  const categories = {
    Skincare: ["Cleansers", "Moisturizers", "Serums", "Sunscreens", "Treatments"],
    Makeup: ["Foundation", "Lipstick", "Eyeshadow", "Mascara", "Blush"],
    Fragrance: ["Perfume", "Cologne", "Body Spray", "Essential Oils"],
    Haircare: ["Shampoo", "Conditioner", "Styling", "Treatments"],
    Bodycare: ["Lotions", "Scrubs", "Oils", "Cleansers"]
  };

  const sizeOptions = ["50ml", "100ml", "150ml", "200ml", "250ml", "Full Size", "Travel Size"];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = "Valid price is required";
    if (!formData.subCategory) newErrors.subCategory = "Subcategory is required";
    if (!images.some(img => img)) newErrors.images = "At least one image is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };



  const handleImageUpload = useCallback((file, index) => {
    if (file && file.type.startsWith('image/')) {
      const newImages = [...images];
      newImages[index] = file;
      setImages(newImages);
      if (errors.images) {
        setErrors(prev => ({ ...prev, images: null }));
      }
    }
  }, [images, errors.images]);

  const handleDrop = useCallback((e, index) => {
    e.preventDefault();
    setDraggedOver(null);
    const file = e.dataTransfer.files[0];
    handleImageUpload(file, index);
  }, [handleImageUpload]);

  const handleDragOver = useCallback((e, index) => {
    e.preventDefault();
    setDraggedOver(index);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setDraggedOver(null);
  }, []);

  const removeImage = (index) => {
    const newImages = [...images];
    newImages[index] = null;
    setImages(newImages);
  };

  const toggleSize = (size) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      subCategory: "",
      category: "Skincare",
      bestSeller: false,
      sizes: [],
    });
    setImages([null, null, null, null]);
    setErrors({});
  };


  const onSubmitHandler = async (e) => {
  e.preventDefault();

  if (!validateForm()) {
    return;
  }

  setIsUploading(true);
  setUploadProgress(0);

  try {
    const formDataObj = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'sizes') {
        formDataObj.append(key, JSON.stringify(value));
      } else {
        formDataObj.append(key, value);
      }
    });

    images.forEach((image, index) => {
      if (image) {
        formDataObj.append(`image${index + 1}`, image);
      }
    });

  
    const response = await axios.post(`${backendUrl}/api/product/add`, formDataObj, {
      headers: {
        token, // Make sure `token` is defined in your component scope
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setUploadProgress(percentCompleted);
      },
    });

    if (response.data.success) {
      toast.success(response.data.message || "Product added successfully!");
      resetForm();
    } else {
      toast.error(response.data.message || "Failed to add product.");
    }
  } catch (error) {
    console.error("Upload error:", error);
    toast.error("An error occurred while uploading.");
  } finally {
    setIsUploading(false);
    setUploadProgress(0);
  }
};

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Add New Beauty Product</h2>
        <p className="text-gray-600">Fill in the details to add a new product to PalmsBeautyStore</p>
      </div>

      <form onSubmit={onSubmitHandler} className="space-y-6">
        {/* Image Upload Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-700">Product Images</h3>
            <span className="text-sm text-gray-500">
              {images.filter(img => img).length}/4 images uploaded
            </span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div
                key={index}
                className={`relative aspect-square border-2 border-dashed rounded-lg overflow-hidden transition-all duration-200 ${
                  draggedOver === index
                    ? 'border-pink-500 bg-pink-50'
                    : image
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDrop={(e) => handleDrop(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragLeave={handleDragLeave}
              >
                {image ? (
                  <>
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Product ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X size={16} />
                    </button>
                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                      {index === 0 ? 'Main' : `${index + 1}`}
                    </div>
                  </>
                ) : (
                  <label
                    htmlFor={`image${index + 1}`}
                    className="flex flex-col items-center justify-center w-full h-full cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <ImageIcon size={32} className="text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 text-center">
                        {index === 0 ? 'Main Image' : `Image ${index + 1}`}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">Click or drag</p>
                    </div>
                    <input
                      type="file"
                      id={`image${index + 1}`}
                      accept="image/*"
                      hidden
                      onChange={(e) => handleImageUpload(e.target.files[0], index)}
                    />
                  </label>
                )}
              </div>
            ))}
          </div>
          
          {errors.images && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle size={16} />
              {errors.images}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter product name"
              />
              {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">$</span>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  className={`w-full pl-8 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                    errors.price ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
              {errors.price && <p className="text-red-600 text-sm mt-1">{errors.price}</p>}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => {
                  handleInputChange('category', e.target.value);
                  handleInputChange('subCategory', '');
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                {Object.keys(categories).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subcategory *
              </label>
              <select
                value={formData.subCategory}
                onChange={(e) => handleInputChange('subCategory', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                  errors.subCategory ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select subcategory</option>
                {categories[formData.category]?.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
              {errors.subCategory && <p className="text-red-600 text-sm mt-1">{errors.subCategory}</p>}
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Description *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={4}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Describe your product in detail..."
          />
          {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
        </div>

        {/* Sizes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Available Sizes
          </label>
          <div className="flex flex-wrap gap-2">
            {sizeOptions.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => toggleSize(size)}
                className={`px-3 py-1 rounded-md border transition-colors ${
                  formData.sizes.includes(size)
                    ? 'bg-pink-500 text-white border-pink-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Bestseller */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="bestSeller"
            checked={formData.bestSeller}
            onChange={(e) => handleInputChange('bestSeller', e.target.checked)}
            className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
          />
          <label htmlFor="bestSeller" className="text-sm font-medium text-gray-700">
            Mark as bestseller
          </label>
        </div>



        {/* Upload Progress */}
        {isUploading && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Uploading product...</span>
              <span className="text-sm text-gray-600">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-pink-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={resetForm}
            disabled={isUploading}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={isUploading}
            className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors disabled:opacity-50 flex items-center space-x-2"
          >
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>Add Product</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Add;