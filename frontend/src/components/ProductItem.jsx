import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { useContext } from "react";
import { useEffect } from "react";

const ProductItem = ({ id, image, name, variations, basePrice, priceRange, bestSeller, isFeatured, totalStock }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { formatNaira } = useContext(ShopContext);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
  };
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };
 
  useEffect(() => {
    scrollToTop();
  }, [])

  // Get display price (use priceRange if available, otherwise basePrice)
  const displayPrice = priceRange ? priceRange.min : basePrice;
  const hasMultiplePrices = priceRange && priceRange.min !== priceRange.max;
  
  // Get available colors for preview
  const availableColors = variations?.slice(0, 3) || [];
  
  // Check if product is in stock
  const isInStock = totalStock > 0;

  return (
    <Link
      className="text-gray-700 cursor-pointer"
      to={`/product/${id}`}
      aria-label={`View details for ${name}`}
    >
      <div className="group bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-1 relative">
        
        {/* Badges */}
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
          {bestSeller && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              Best Seller
            </span>
          )}
          {isFeatured && (
            <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              Featured
            </span>
          )}
          {!isInStock && (
            <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              Out of Stock
            </span>
          )}
        </div>

        <div
          className="block cursor-pointer"
          role="button"
          tabIndex={0}
          aria-label={`View details for ${name}`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              // Handle keyboard navigation
              e.preventDefault();
            }
          }}
        >
          {/* Image Container */}
          <div className="relative aspect-square overflow-hidden bg-gray-100">
            {!imageLoaded && !imageError && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
              </div>
            )}
            
            {imageError ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="text-center">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-xs text-gray-400">No image</p>
                </div>
              </div>
            ) : (
              <img
                className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                } ${!isInStock ? 'grayscale' : ''}`}
                src={image && image.length > 0 ? image[0] : "/path/to/default-image.jpg"}
                alt={`Image of ${name}`}
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            )}
            
            {/* Quick Action Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="bg-white rounded-full p-2 shadow-lg transform scale-0 group-hover:scale-100 transition-transform duration-200">
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="p-3 sm:p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
              {name}
            </h3>

            {/* Color Variations Preview */}
            {availableColors.length > 0 && (
              <div className="flex items-center gap-1 mb-2">
                {availableColors.map((variation, index) => (
                  <div
                    key={index}
                    className="w-3 h-3 rounded-full border border-gray-300"
                    style={{ 
                      backgroundColor: variation.color?.toLowerCase().includes('blonde') ? '#f4e4bc' :
                                      variation.color?.toLowerCase().includes('brown') ? '#8b4513' :
                                      variation.color?.toLowerCase().includes('black') ? '#000000' :
                                      variation.color?.toLowerCase().includes('red') ? '#dc143c' :
                                      '#ddd'
                    }}
                    title={variation.color}
                  />
                ))}
                {variations?.length > 3 && (
                  <span className="text-xs text-gray-500 ml-1">+{variations.length - 3}</span>
                )}
              </div>
            )}

            <div className="flex items-center justify-between text-gray-700 mt-1">
              {/* Price */}
              <div className="flex flex-col">
                <span className="text-base font-semibold text-gray-900 sm:text-lg">
                  {hasMultiplePrices ? 'From ' : ''}{formatNaira(displayPrice)}
                </span>
                {hasMultiplePrices && (
                  <span className="text-xs text-gray-500">
                    - {formatNaira(priceRange.max)}
                  </span>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-1">
                {/* Show only (4.0) on mobile */}
                <span className="text-xs text-gray-500 sm:hidden">(4.0)</span>

                {/* Show stars only on larger screens */}
                <div className="hidden sm:flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>

            {/* Stock Status */}
            <div className="mt-2">
              {isInStock ? (
                <span className="text-xs text-green-600">✓ In Stock ({totalStock} available)</span>
              ) : (
                <span className="text-xs text-red-600">✗ Out of Stock</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductItem;