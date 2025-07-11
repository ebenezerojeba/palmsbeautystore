// import React, { useContext, useEffect, useState } from "react";
// import { ShopContext } from "../context/ShopContext";
// import { Trash2 } from "lucide-react";
// import CartTotal from "../components/CartTotal";



// const Cart = () => {
//   const { products, cartItems, updateQuantity, navigate, formatNaira } =
//     useContext(ShopContext);
//   const [cartData, setCartData] = useState([]);
//   useEffect(() => {
//     if (products.length > 0) {
//       const tempData = [];
//       for (const items in cartItems) {
//         for (const item in cartItems[items]) {
//           if (cartItems[items][item] > 0) {
//             tempData.push({
//               _id: items,
//               size: item,
//               quantity: cartItems[items][item],
//             });
//           }
//         }
//       }
//       setCartData(tempData);
//     }
//   }, [cartItems, products]);
//   return (
//     <div className="border-t pt-14">
//       <div className="text-2xl mb-3">
//         {/* <Title text1={"YOUR"} text2={"CART"} /> */}
//       </div>
//       <div>
//         {cartData.map((item, index) => {
//           const productData = products.find(
//             (product) => product._id === item._id
//           );
//           return (
//             <div
//               key={index}
//               className="py-4 border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4"
//             >
//               <div className="flex items-start gap-6">
//                 <img
//                   className="w-16 sm:w-20"
//                   src={productData.image[0]}
//                   alt="productData Image"
//                 />
//                 <div>
//                   <p className="text-xs sm:text-lg font-medium">
//                     {productData.name}
//                   </p>
//                   <div className="flex items-center gap-5 mt-2">
//                     <p>{formatNaira(productData.price)}</p>
//                     <p className="px-2 sm:px-3 sm:py-1 border bg-slate-50">
//                       {item.size}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//               <input
//                 onChange={(e) =>
//                   e.target.value === "" || e.target.value === "0"
//                     ? null
//                     : updateQuantity(
//                         item._id,
//                         item.size,
//                         Number(e.target.value)
//                       )
//                 }
//                 className="border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1"
//                 type="number"
//                 min={1}
//                 defaultValue={item.quantity}
//               />
//              <Trash2
//   size={20} // adjust size as needed
//   className="text-red-500 mr-4 sm:w-5 cursor-pointer"
//   onClick={() => updateQuantity(item._id, size, 0)}
// />

//             </div>
//           );
//         })}
//       </div>

//       <div className="flex justify-end my-20 mr-20">
//         <div className="w-full sm:w-[350px]">
//           <CartTotal />
//           <div className="w-full text-end">
//             <button
//               onClick={() => navigate("/place-order")}
//               className="bg-black text-white text-sm my-8 px-8 py-3"
//             >
//               PROCEED TO CHECKOUT
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Cart;



import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from "lucide-react";
import CartTotal from "../components/CartTotal";

const Cart = () => {
  const { products, cartItems, updateQuantity, navigate, formatNaira } =
    useContext(ShopContext);
  const [cartData, setCartData] = useState([]);
  const [isUpdating, setIsUpdating] = useState({});

  useEffect(() => {
    if (products.length > 0) {
      const tempData = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            tempData.push({
              _id: items,
              size: item,
              quantity: cartItems[items][item],
            });
          }
        }
      }
      setCartData(tempData);
    }
  }, [cartItems, products]);

  const handleQuantityUpdate = async (id, size, newQuantity) => {
    const key = `${id}-${size}`;
    setIsUpdating(prev => ({ ...prev, [key]: true }));
    
    try {
      await updateQuantity(id, size, newQuantity);
    } finally {
      setTimeout(() => {
        setIsUpdating(prev => ({ ...prev, [key]: false }));
      }, 300);
    }
  };

  const incrementQuantity = (id, size, currentQuantity) => {
    handleQuantityUpdate(id, size, currentQuantity + 1);
  };

  const decrementQuantity = (id, size, currentQuantity) => {
    if (currentQuantity > 1) {
      handleQuantityUpdate(id, size, currentQuantity - 1);
    }
  };

  const removeItem = (id, size) => {
    handleQuantityUpdate(id, size, 0);
  };

  const getTotalItems = () => {
    return cartData.reduce((total, item) => total + item.quantity, 0);
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
            Shopping Cart ({getTotalItems()} item{getTotalItems() !== 1 ? 's' : ''})
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
                const productData = products.find(
                  (product) => product._id === item._id
                );
                const updateKey = `${item._id}-${item.size}`;
                const isItemUpdating = isUpdating[updateKey];

                return (
                  <div
                    key={index}
                    className={`p-6 ${index !== cartData.length - 1 ? 'border-b' : ''} 
                      ${isItemUpdating ? 'opacity-70' : ''} transition-opacity duration-200`}
                  >
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <img
                          className="w-24 h-24 object-cover rounded-lg border"
                          src={productData?.image?.[0]}
                          alt={productData?.name}
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-grow">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-medium text-gray-800 line-clamp-2">
                            {productData?.name}
                          </h3>
                          <button
                            onClick={() => removeItem(item._id, item.size)}
                            className="text-red-500 hover:text-red-700 p-1 rounded transition-colors duration-200"
                            title="Remove item"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>

                        <div className="flex items-center gap-4 mb-4">
                          <span className="text-lg font-semibold text-gray-900">
                            {productData?.price}
                          </span>
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                            Size: {item.size}
                          </span>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center border rounded-lg">
                            <button
                              onClick={() => decrementQuantity(item._id, item.size, item.quantity)}
                              disabled={item.quantity <= 1 || isItemUpdating}
                              className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="px-4 py-2 min-w-[60px] text-center font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => incrementQuantity(item._id, item.size, item.quantity)}
                              disabled={isItemUpdating}
                              className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-sm text-gray-500">Subtotal</p>
                            <p className="text-lg font-semibold text-gray-900">
                              {formatNaira(productData?.price * item.quantity)}
                            </p>
                          </div>
                        </div>
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
              
              <CartTotal />
              
              <div className="mt-6 space-y-3">
                <button
                  onClick={() => navigate("/place-order")}
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

              {/* Trust Indicators */}
              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <span>🔒</span>
                  <span>Secure checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;