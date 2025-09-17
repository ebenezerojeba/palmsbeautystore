
// ShopContext.js - Updated to handle variations

import React, { createContext, useEffect, useState } from "react";

export const ShopContext = createContext();

const backendUrl = "https://palmsbeautystore-backend.onrender.com"


const ShopContextProvider = (props) => {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));
 
  // Format currency for Nigerian Naira
  const formatNaira = (amount) => {
    return new Intl.NumberFormat("USD", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Fetch products from backend
  const getProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${backendUrl}/api/product/list`);
      const data = await response.json();
      
      if (data.success) {
        setProducts(data.data.products);
      } else {
        console.error('Failed to fetch products:', data.message);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Enhanced addToCart function to handle variations
  const addToCart = (itemId, options = {}) => {
    // Create a unique cart item ID that includes variation details
    const cartItemId = createCartItemId(itemId, options);
    
    setCartItems((prev) => {
      const newCartItems = { ...prev };
      
      if (newCartItems[cartItemId]) {
        newCartItems[cartItemId].quantity += options.quantity || 1;
      } else {
        newCartItems[cartItemId] = {
          productId: itemId,
          quantity: options.quantity || 1,
          variation: options.variation || null,
          selectedOptions: options.selectedOptions || {},
          price: options.price,
          addedAt: new Date().toISOString()
        };
      }
      
      // Save to localStorage
      localStorage.setItem('cartItems', JSON.stringify(newCartItems));
      return newCartItems;
    });
  };

  // Create unique cart item ID based on product and variations
  const createCartItemId = (productId, options) => {
    if (!options.selectedOptions) return productId;
    
    // Create a string from selected options
    const optionsString = Object.entries(options.selectedOptions)
      .filter(([_, value]) => value)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}:${value}`)
      .join('|');
    
    return optionsString ? `${productId}_${optionsString}` : productId;
  };

  // Get cart count
  const getCartCount = () => {
    return Object.values(cartItems).reduce((total, item) => total + item.quantity, 0);
  };

  // Get cart total amount
  const getCartAmount = () => {
    return Object.values(cartItems).reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };

  // Update cart item quantity
  const updateQuantity = (cartItemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }

    setCartItems((prev) => {
      const newCartItems = { ...prev };
      if (newCartItems[cartItemId]) {
        newCartItems[cartItemId].quantity = quantity;
        localStorage.setItem('cartItems', JSON.stringify(newCartItems));
      }
      return newCartItems;
    });
  };

  // Remove item from cart
  const removeFromCart = (cartItemId) => {
    setCartItems((prev) => {
      const newCartItems = { ...prev };
      delete newCartItems[cartItemId];
      localStorage.setItem('cartItems', JSON.stringify(newCartItems));
      return newCartItems;
    });
  };

  // Clear entire cart
  const clearCart = () => {
    setCartItems({});
    localStorage.removeItem('cartItems');
  };
  // Get detailed cart items with product information
  const getDetailedCartItems = () => {
    return Object.entries(cartItems).map(([cartItemId, cartItem]) => {
      const product = products.find(p => p._id === cartItem.productId);
      if (!product) return null;

      return {
        cartItemId,
        product,
        quantity: cartItem.quantity,
        variation: cartItem.variation,
        selectedOptions: cartItem.selectedOptions,
        price: cartItem.price,
        total: cartItem.price * cartItem.quantity,
        addedAt: cartItem.addedAt
      };
    }).filter(Boolean);
  };

  // Check if item is in cart (for ProductItem component)
  const isInCart = (productId, options = {}) => {
    const cartItemId = createCartItemId(productId, options);
    return !!cartItems[cartItemId];
  };

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Fetch products on mount
  useEffect(() => {
    getProducts();
  }, []);

  const value = {
    products,
    backendUrl,
    cartItems,
    loading,
    token,
    formatNaira,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartCount,
    getCartAmount,
    getDetailedCartItems,
    isInCart,
    getProducts,
    setToken
  };

  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;