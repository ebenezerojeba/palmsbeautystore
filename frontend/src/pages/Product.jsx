import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const Product = () => {
  const { products, addToCart, formatNaira } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState("");
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({
    size: '',
    length: '',
    color: '',
    texture: '',
    weight: ''
  });
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [currentPrice, setCurrentPrice] = useState(null);
  const [availableOptions, setAvailableOptions] = useState({});
  const [filteredVariations, setFilteredVariations] = useState([]);

  const { productId } = useParams();

  const fetchProductData = async () => {
    products.map((item) => {
      if (item._id === productId) {
        setProductData(item);
        setImage(item.images[0]);
        
        // Initialize available options
        if (item.availableOptions) {
          setAvailableOptions(item.availableOptions);
        }
        
        // Set initial filtered variations (all active variations)
        const activeVariations = item.variations?.filter(v => v.isActive && v.stock > 0) || [];
        setFilteredVariations(activeVariations);
        
        // Set initial price from base price or first variation
        if (activeVariations.length > 0) {
          setCurrentPrice(activeVariations[0].salePrice || activeVariations[0].price);
        } else {
          setCurrentPrice(item.basePrice);
        }
        
        return null;
      }
    });
  };

  useEffect(() => {
    fetchProductData();
  }, [productId, products]);

  // Filter variations based on selected options
  useEffect(() => {
    if (!productData || !productData.variations) return;
    
    let filtered = productData.variations.filter(v => v.isActive && v.stock > 0);
    
    // Apply filters for each selected option
    Object.entries(selectedOptions).forEach(([key, value]) => {
      if (value) {
        filtered = filtered.filter(v => v[key] === value);
      }
    });
    
    setFilteredVariations(filtered);
    
    // Update price based on filtered variations
    if (filtered.length > 0) {
      setCurrentPrice(filtered[0].salePrice || filtered[0].price);
      if (filtered.length === 1) {
        setSelectedVariation(filtered[0]);
      }
    }
  }, [selectedOptions, productData]);

  // You need to update the image display when variation changes
useEffect(() => {
  if (selectedVariation && selectedVariation.images && selectedVariation.images.length > 0) {
    setImage(selectedVariation.images[0]); // Use variation's first image
  } else if (productData) {
    setImage(productData.images[0]); // Fallback to main product image
  }
}, [selectedVariation, productData]);

// And update the thumbnail display to show variation images when available
const displayImages = selectedVariation?.images?.length > 0 
  ? selectedVariation.images 
  : productData.images;

  // Handle option selection
  const handleOptionSelect = (optionType, value) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionType]: prev[optionType] === value ? '' : value
    }));
  };

  // Get available values for each option type based on current filters
  const getAvailableValues = (optionType) => {
    if (!productData || !productData.variations) return [];
    
    // Start with all active variations
    let availableVariations = productData.variations.filter(v => v.isActive && v.stock > 0);
    
    // Apply filters except for the current option type
    Object.entries(selectedOptions).forEach(([key, value]) => {
      if (key !== optionType && value) {
        availableVariations = availableVariations.filter(v => v[key] === value);
      }
    });
    
    // Extract unique values for the option type
    const values = [...new Set(availableVariations.map(v => v[optionType]).filter(Boolean))];
    return values;
  };

  const handleAddToCart = () => {
    if (!productData) return;
    
    // Check if a specific variation is required
    const requiresVariation = productData.variations && productData.variations.length > 1;
    
    if (requiresVariation && !selectedVariation) {
      // Check which options are missing
      const missingOptions = [];
      const availableOptionTypes = Object.keys(selectedOptions).filter(key => 
        getAvailableValues(key).length > 0
      );
      
      availableOptionTypes.forEach(optionType => {
        if (!selectedOptions[optionType]) {
          missingOptions.push(optionType);
        }
      });
      
      if (missingOptions.length > 0) {
        toast.warn(`Please select: ${missingOptions.join(", ")}`);
        return;
      }
    }

    // Add to cart with selected variation details
    addToCart(productData._id, {
      variation: selectedVariation,
      selectedOptions,
      price: currentPrice,
      quantity
    });
    
    toast.success('Product added to cart!');
  };

  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  // Get color hex code for display
// Color map for number codes
const COLOR_MAP = {
  "1": "#000000",      // Black
  "1b": "#1c1c1c",     // Off black
  "2": "#211915",      // Dark brown
  "4": "#3b2f2f",      // Medium brown
  "27": "#a0522d",     // Light brown
  "30": "#6b4226",     // Auburn
  "33": "#754c24",     // Dark auburn
  "350": "#b5651d",    // Copper brown
  "320": "#964b00",    // Chestnut
  "613": "#f4e4bc",    // Blonde
  "t/30": "#6b4226",   // Auburn blend (base 30 with tones)
  "t/30/613": "#d8b98f" // Auburn and blonde blend
};

// Frontend function
const getColorHex = (colorCode) => {
  const lower = colorCode.toLowerCase();
  return COLOR_MAP[lower] || '#ddd';
};

  const renderOptionSelector = (optionType, label) => {
    const availableValues = getAvailableValues(optionType);
    if (availableValues.length === 0) return null;

    return (
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-900">
          {label} {selectedOptions[optionType] && <span className="text-pink-600">({selectedOptions[optionType]})</span>}
        </label>
        <div className="flex flex-wrap gap-2">
          {availableValues.map((value) => {
            const isSelected = selectedOptions[optionType] === value;
            
            if (optionType === 'color') {
              return (
                <button
                  key={value}
                  onClick={() => handleOptionSelect(optionType, value)}
                  className={`flex items-center space-x-2 px-3 py-2 border rounded-md text-sm font-medium transition-all duration-200 ${
                    isSelected
                      ? 'border-pink-500 bg-pink-50 text-pink-700'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                  title={value}
                >
                  <div 
                    className="w-4 h-4 rounded-full border border-gray-300"
                    style={{ backgroundColor: getColorHex(value) }}
                  />
                  <span>{value}</span>
                </button>
              );
            }
            
            return (
              <button
                key={value}
                onClick={() => handleOptionSelect(optionType, value)}
                className={`px-4 py-2 border rounded-md text-sm font-medium transition-all duration-200 ${
                  isSelected
                    ? 'border-pink-500 bg-pink-50 text-pink-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                {value}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return productData ? (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8 mb-4 overflow-hidden">

      {/* Breadcrumb */}
    <nav className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-8">


        <a href="/" className="hover:text-gray-700">Home</a>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <a href="/collections" className="hover:text-gray-700">Products</a>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-gray-900">{productData.category}</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-gray-900">{productData.name}</span>
      </nav>

      {/* Product Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
            {isImageLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-gray-300 border-t-pink-600 rounded-full animate-spin"></div>
              </div>
            )}
            <img
              className="w-full h-full object-cover"
              src={image}
              alt={productData.name}
              onLoad={handleImageLoad}
            />
          </div>

          {/* Thumbnail Images */}
<div className="flex gap-2 overflow-x-auto pb-2 w-full no-scrollbar">

            {productData.images.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  setImage(item);
                  setIsImageLoading(true);
                }}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                  item === image
                    ? 'border-pink-500 ring-2 ring-pink-200'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <img
                  className="w-full h-full object-cover"
                  src={item}
                  alt={`${productData.name} view ${index + 1}`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">


<div className="space-y-4">
  {renderOptionSelector('size', 'Size')}
  {renderOptionSelector('length', 'Length')}

  {renderOptionSelector('texture', 'Texture')}
  {renderOptionSelector('weight', 'Weight')}
  
  {/* ... rest of the code remains the same ... */}
</div>
          {/* Product Title & Rating */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{productData.name}</h1>
              {productData.bestSeller && (
                <span className="bg-red-500 text-white text-sm px-2 py-1 rounded-full">
                  Best Seller
                </span>
              )}
              {productData.isFeatured && (
                <span className="bg-purple-500 text-white text-sm px-2 py-1 rounded-full">
                  Featured
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(productData.averageRating || 4) ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="text-sm text-gray-600 ml-2">
                  {productData.averageRating || 4.0} ({productData.totalReviews || 122} reviews)
                </span>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="border-b pb-6">
            <span className="text-4xl font-bold text-gray-900">{formatNaira(currentPrice)}</span>
            {selectedVariation?.salePrice && (
              <span className="text-lg text-gray-500 line-through ml-2">
                {formatNaira(selectedVariation.price)}
              </span>
            )}
            <div className="mt-1">
              {filteredVariations.length > 0 ? (
                <p className="text-sm text-green-600">✓ In Stock ({filteredVariations.reduce((sum, v) => sum + v.stock, 0)} available)</p>
              ) : (
                <p className="text-sm text-red-600">✗ Out of Stock</p>
              )}
            </div>
          </div>

          {/* Description */}
       

          {/* Product Specifications */}

          {/* Variation Options */}
          <div className="space-y-4">
            {renderOptionSelector('size', 'Size')}
            {renderOptionSelector('length', 'Length')}

            {renderOptionSelector('color', 'Color')}


            {renderOptionSelector('texture', 'Texture')}
            {renderOptionSelector('weight', 'Weight')}

            {/* Quantity Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-3">Quantity</label>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <span className="px-4 py-2 border border-gray-300 rounded-md min-w-[3rem] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Add to Cart Button */}
          <div className="space-y-4">
            <button
              onClick={handleAddToCart}
              disabled={filteredVariations.length === 0}
              className="w-full bg-black text-white py-3 px-6 rounded-md font-medium hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center space-x-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <span>{filteredVariations.length === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
            </button>

            <button className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-md font-medium hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>Add to Wishlist</span>
            </button>
          </div>

          {/* Product Features */}
          {productData.features && (
            <div className="border-t pt-6">
              <div className="space-y-3">
                {productData.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Description & Reviews Section */}
      <div className="mt-8 md:mt-16">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('description')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'description'
                  ? 'border-pink-500 text-pink-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('specifications')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'specifications'
                  ? 'border-pink-500 text-pink-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Specifications
            </button>
            <button
              onClick={() => setActiveTab('care')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'care'
                  ? 'border-pink-500 text-pink-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Care Instructions
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'reviews'
                  ? 'border-pink-500 text-pink-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Reviews ({productData.totalReviews || 122})
            </button>
            <button
              onClick={() => setActiveTab('shipping')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'shipping'
                  ? 'border-pink-500 text-pink-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Shipping 
            </button>
          </nav>
        </div>

        <div className="py-4 md:py-8">
          {activeTab === 'description' && (
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                {productData.description}
              </p>

            </div>
          )}

          {activeTab === 'specifications' && (
            <div className="space-y-6">
              {productData.specifications && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-4">Product Specifications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(productData.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                        <span className="font-medium text-gray-900">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
            
            </div>
          )}

          {activeTab === 'care' && (
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900 mb-4">Care Instructions</h3>
              {productData.careInstructions && productData.careInstructions.length > 0 ? (
                <div className="space-y-3">
                  {productData.careInstructions.map((instruction, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <p className="text-gray-700">{instruction}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-600">
                  <p>• Gently wash with cold water and sulfate-free shampoo</p>
                  <p>• Use a wide-tooth comb to detangle when wet</p>
                  <p>• Air dry or use low heat settings</p>
                  {/* <p>• Store on a wig stand or mannequin head</p> */}
                  <p>• Avoid excessive heat styling</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                      <span className="text-pink-600 font-semibold">JD</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Jane Doe</h4>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">2 days ago</span>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700">
                  "Absolutely love this product! The quality is outstanding and it matches my natural hair perfectly. The {selectedOptions.color || 'color'} is exactly what I was looking for. Highly recommend!"
                </p>
                {selectedOptions.size && (
                  <p className="text-sm text-gray-500 mt-2">
                    Purchased: Size {selectedOptions.size}
                  </p>
                )}
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-semibold">MS</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Maria Santos</h4>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className={`w-4 h-4 ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">1 week ago</span>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700">
                  "Great quality and fast shipping. The texture feels very natural and the length is perfect. Will definitely order again!"
                </p>
              </div>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Shipping Information</h3>
                <ul className="space-y-2 text-gray-700">
                  <l>• Standard shipping: 5-7 business days</l>
                  <li>• Express shipping: 2-3 business days</li>
                  <li></li>
                </ul>
              </div>
      
            </div>
          )}
        </div>
      </div>
    </div>
  ) : (
   <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8 mb-4">

      <div className="animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="space-y-4">
            <div className="aspect-square bg-gray-200 rounded-lg"></div>
            <div className="flex space-x-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-20 h-20 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            <div className="h-12 bg-gray-200 rounded w-1/3"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
            <div className="space-y-4">
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
