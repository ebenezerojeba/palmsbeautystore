import { createContext, useEffect, useState } from "react";

import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {

const backendUrl = "https://palmsbeautystore-backend.onrender.com"
  // const backendUrl = "http://localhost:3000";

  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState("");

 // Load products and cart on first mount
  useEffect(() => {
    getProductsData();

    const savedCart = localStorage.getItem("guest_cart");
    if (savedCart && !token) {
      setCartItems(JSON.parse(savedCart));
    }

    // if (token) {
    //   getUserCart(token);
    // }
  }, [token]);  

 const formatNaira = (amount) => {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
     currencyDisplay: 'narrowSymbol',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};


  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error("Select Product Size");
      return;
    } else {
      toast.success("Added to cart");
    }
      const updatedCart = structuredClone(cartItems);
    updatedCart[itemId] = updatedCart[itemId] || {};
    updatedCart[itemId][size] = (updatedCart[itemId][size] || 0) + 1;

    setCartItems(updatedCart);
    persistCart(updatedCart);

    // if (cartData[itemId]) {
    //   if (cartData[itemId][size]) {
    //     cartData[itemId][size] += 1;
    //   } else {
    //     cartData[itemId][size] = 1;
    //   }
    // } else {
    //   cartData[itemId] = {};
    //   cartData[itemId][size] = 1;
    // }
    // setCartItems(cartData);

    if (token) {
      try {
        await axios.post(
          backendUrl + "api/cart/add",
          { itemId, size },
          { headers: { token } }
        );
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalCount += cartItems[items][item];
          }
        } catch (error) {
          console.log(error);
          toast.error(error.message);
        }
      }
    }
    return totalCount;
  };

  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);

    cartData[itemId][size] = quantity;

    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(
          backendUrl + "api/cart/update",
          { itemId, size, quantity },
          { headers: { token } }
        );
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items);
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalAmount += itemInfo.price * cartItems[items][item];
          }
        } catch (error) {}
      }
    }
    return totalAmount;
  };

  const getProductsData = async (params) => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list");
      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // const getUserCart = async ({ token }) => {
  //   try {
  //     const response = await axios.post(
  //       backendUrl + "api/cart/get",
  //       {},
  //       { headers: { token } }
  //     );
  //     if (response.data.success) {
  //       setCartItems(response.data.cartData);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     toast.error(error.message);
  //   }
  // };


   const persistCart = (cartData) => {
    if (token) {
      // Optional: Sync to backend later if needed
    } else {
      localStorage.setItem("guest_cart", JSON.stringify(cartData));
    }
  };
 

  const sendMail = async (email) => {
    
    try {
      const response = await axios.post(
        `${backendUrl}/api/subscribe/send-welcome`,
        { email }
      );

      toast.success(response.data.message || "Subscribed successfully!");
      setEmail(""); // Clear email input after success
    } catch (error) {
      console.error("API Error:", error); // Log the error for debugging
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  }
  useEffect(() => {
    getProductsData();
  }, []);

  useEffect(() => {
    if (!token && localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
      // getUserCart(localStorage.getItem("token"));
    }
  }, []);

  const value = {
    products,
    search,
    showSearch,
    setSearch,
    setShowSearch, 
    cartItems,
    setCartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    backendUrl,
    token,
    formatNaira,
    setToken,
    getProductsData,
    sendMail
  };
  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
