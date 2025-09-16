import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from "lucide-react";
import CartTotal from "../components/CartTotal";
import { toast } from "react-toastify";
const Cart = () => {
  const { 
    products, 
    cartItems, 
    updateQuantity, 
    removeFromCart,
    getDetailedCartItems,
    getCartCount,
    getCartAmount,
    formatNaira,
    token
  } = useContext(ShopContext);
  
  const [cartData, setCartData] = useState([]);
  const [isUpdating, setIsUpdating] = useState({});
  

  const safeCartItems = Array.isArray(cartItems) ? cartItems : [];

  // Get detailed cart items whenever cartItems or products change
  useEffect(() => {
    const detailedItems = getDetailedCartItems();
    setCartData(detailedItems);
  }, [cartItems, products, getDetailedCartItems]);

  const handleQuantityUpdate = async (cartItemId, newQuantity) => {
    setIsUpdating(prev => ({ ...prev, [cartItemId]: true }));
    
    try {
      updateQuantity(cartItemId, newQuantity);
    } finally {
      setTimeout(() => {
        setIsUpdating(prev => ({ ...prev, [cartItemId]: false }));
      }, 300);
    }
  };

  const incrementQuantity = (cartItemId, currentQuantity) => {
    handleQuantityUpdate(cartItemId, currentQuantity + 1);
  };

  const decrementQuantity = (cartItemId, currentQuantity) => {
    if (currentQuantity > 1) {
      handleQuantityUpdate(cartItemId, currentQuantity - 1);
    }
  };

  const handleRemoveItem = (cartItemId) => {
    setIsUpdating(prev => ({ ...prev, [cartItemId]: true }));
    removeFromCart(cartItemId);
  };

  // Navigate function (you might need to import this from React Router)
  const navigate = (path) => {
    // Replace this with your navigation method
    window.location.href = path;
  };

  // Helper function to get product image
  const getProductImage = (product, variation) => {
    // If variation has specific images, use those
    if (variation && variation.images && variation.images.length > 0) {
      return variation.images[0];
    }
    
    // Otherwise use product images
    if (product.images && product.images.length > 0) {
      return product.images[0];
    }
    
    // Fallback to old image structure
    if (product.image && Array.isArray(product.image) && product.image.length > 0) {
      return product.image[0];
    }
    
    return "/path/to/default-image.jpg";
  };

  // Helper function to get color hex code
  const getColorHex = (colorName) => {
    if (!colorName) return '#ddd';
    
    const colorMap = {
      'black': '#000000',
      'brown': '#8b4513',
      'blonde': '#f4e4bc',
      'red': '#dc143c',
      'auburn': '#a52a2a',
      'gray': '#808080',
      'grey': '#808080',
      'silver': '#c0c0c0',
      'natural': '#8b7355',
      'dark brown': '#654321',
      'light brown': '#996633'
    };
    
    const lowerColor = colorName.toLowerCase();
    return colorMap[lowerColor] || '#ddd';
  };

  if (cartData.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-md">
          <ShoppingBag className="mx-auto mb-6 text-gray-400" size={80} />
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Your Cart is Empty
          </h2>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added anything to your cart yet. Start shopping to fill it up!
          </p>
          <button
            onClick={() => navigate("/collections")}
            className="bg-black text-white px-8 py-3 rounded-md hover:bg-gray-800 transition-colors duration-200 flex items-center gap-2 mx-auto"
          >
            <ArrowLeft size={20} />
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="border-t pt-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-gray-800">
            Shopping Cart ({getCartCount()} item{getCartCount() !== 1 ? 's' : ''})
          </h1>
          <button
            onClick={() => navigate("/collections")}
            className="text-blue-600 hover:text-blue-800 flex items-center gap-2 text-sm font-medium"
          >
            <ArrowLeft size={16} />
            Continue Shopping
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border">
              {cartData.map((item, index) => {
                const isItemUpdating = isUpdating[item.cartItemId];
                
                return (
                  <div
                    key={item.cartItemId}
                    className={`p-6 ${index !== cartData.length - 1 ? 'border-b' : ''} 
                      ${isItemUpdating ? 'opacity-70' : ''} transition-opacity duration-200`}
                  >
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <img
                          className="w-24 h-24 object-cover rounded-lg border"
                          src={getProductImage(item.product, item.variation)}
                          alt={item.product.name}
                          onError={(e) => {
                            e.target.src = "/path/to/default-image.jpg";
                          }}
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-grow">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-medium text-gray-800 line-clamp-2">
                            {item.product.name}
                          </h3>
                          <button
                            onClick={() => handleRemoveItem(item.cartItemId)}
                            className="text-red-500 hover:text-red-700 p-1 rounded transition-colors duration-200"
                            title="Remove item"
                            disabled={isItemUpdating}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>

                        {/* Product Options */}
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                          <span className="text-lg font-semibold text-gray-900">
                            {formatNaira(item.price)}
                          </span>
                          
                          {/* Display selected options */}
                          {item.selectedOptions && Object.entries(item.selectedOptions).map(([key, value]) => {
                            if (!value) return null;
                            
                            if (key === 'color') {
                              return (
                                <span key={key} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full flex items-center gap-2">
                                  <div 
                                    className="w-3 h-3 rounded-full border border-gray-300"
                                    style={{ backgroundColor: getColorHex(value) }}
                                  />
                                  {value}
                                </span>
                              );
                            }
                            
                            return (
                              <span key={key} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                                {key.charAt(0).toUpperCase() + key.slice(1)}: {value}
                              </span>
                            );
                          })}
                          
                          {/* Show variation info if no selected options */}
                          {(!item.selectedOptions || Object.keys(item.selectedOptions).length === 0) && item.variation && (
                            <>
                              {item.variation.size && (
                                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                                  Size: {item.variation.size}
                                </span>
                              )}
                              {item.variation.color && (
                                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full flex items-center gap-2">
                                  <div 
                                    className="w-3 h-3 rounded-full border border-gray-300"
                                    style={{ backgroundColor: getColorHex(item.variation.color) }}
                                  />
                                  {item.variation.color}
                                </span>
                              )}
                            </>
                          )}
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center border rounded-lg">
                            <button
                              onClick={() => decrementQuantity(item.cartItemId, item.quantity)}
                              disabled={item.quantity <= 1 || isItemUpdating}
                              className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="px-4 py-2 min-w-[60px] text-center font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => incrementQuantity(item.cartItemId, item.quantity)}
                              disabled={isItemUpdating}
                              className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-sm text-gray-500">Subtotal</p>
                            <p className="text-lg font-semibold text-gray-900">
                              {formatNaira(item.total)}
                            </p>
                          </div>
                        </div>

                        {/* Stock status for variation */}
                        {item.variation && (
                          <div className="mt-2">
                            {item.variation.stock > 0 ? (
                              <span className="text-xs text-green-600">
                                ✓ In Stock ({item.variation.stock} available)
                              </span>
                            ) : (
                              <span className="text-xs text-red-600">
                                ⚠ Low Stock
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">
                Order Summary
              </h2>
              
              {/* Cart Summary Details */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal ({getCartCount()} items)</span>
                  <span className="font-medium">{formatNaira(getCartAmount())}</span>
                </div>
              </div> 
              
              <div className="space-y-3">
                <button
                  onClick={() =>navigate("/place-order")}
                  className="w-full bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors duration-200 font-medium"
                >
                  Proceed to Checkout
                </button>
  
                
                <button
                  onClick={() => navigate("/collections")}
                  className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;