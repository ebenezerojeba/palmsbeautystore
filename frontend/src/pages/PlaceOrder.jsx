// import React, { useMemo, useContext, useState, useEffect } from "react";
// import axios from "axios";

// import { toast } from "react-toastify";

// import {
//   Loader2,
//   CreditCard,
//   Truck,
//   ArrowDown,
//   ArrowRight,
// } from "lucide-react";

// import { ShopContext } from "../context/ShopContext.jsx";


// const PlaceOrder = () => {
//   const {
//     navigate,
//     cartItems,
//     token,
//     setCartItems,
//     getCartAmount,
//     products,
//     formatNaira,
//     backendUrl,
//   } = useContext(ShopContext);
//   const [showSummary, setShowSummary] = useState(false);

//   const [paymentMethod, setPaymentMethod] = useState();
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     address: "",
//     phone: "",
//     deliveryFee: "",
//   });
//   const [isLoading, setIsLoading] = useState(false);
//   const [selectedState, setSelectedState] = useState("");
//   const [selectedLGA, setSelectedLGA] = useState("");
//   const [lgas, setLGAs] = useState([]);

//   useEffect(() => {
//     if (selectedState && selectedState !== "0") {
//       setLGAs(lgasByState[selectedState] || []);
//     } else {
//       setLGAs([]);
//     }
//     setSelectedLGA("");
//   }, [selectedState]);

//   // const handleStateChange = (e) => {
//   //   setSelectedState(e.target.value);
//   // };
//   // const handleLGAChange = (e) => {
//   //   setSelectedLGA(e.target.value);
//   // };
 
//   const toggleSummary = () => {
//     setShowSummary((prev) => !prev);
//   };
  
//   const onChangeHandler = (event) => {
//     event.preventDefault();
//     const { name, value } = event.target;
//     setFormData((data) => ({ ...data, [name]: value }));
//   };

//   const onSubmitHandler = async (event) => {
//     event.preventDefault();
//     setIsLoading(true);
//     try {
//       let orderItems = [];
//       for (const items in cartItems) {
//         for (const item in cartItems[items]) {
//           if (cartItems[items][item] > 0) {
//             const itemInfo = structuredClone(
//               products.find((product) => product._id === items)
//             );
//             if (itemInfo) {
//               itemInfo.size = item;
//               itemInfo.quantity = cartItems[items][item];
//               orderItems.push(itemInfo);
//             }
//           }
//         }
//       }

//       let orderData = {
//         address: {
//           ...formData,
//           state: selectedState,
//           lga: selectedLGA,
//         },
//         items: orderItems,
//         subtotal: getCartAmount(),
//         deliveryFee: formData.deliveryFee,
//         amount: getCartAmount() + formData.deliveryFee,
//         shippingMethod: formData.shippingMethod,
//       };

//       const initPaystack = async (orderData) => {
//         if (typeof PaystackPop === "undefined") {
//           console.error("Paystack library not loaded.");
//           toast.error("Payment service unavailable. Please try again later.");
//           return;
//         }

//         const paystackPublicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY; // Replace with your actual Paystack public key
//         const totalAmount = getCartAmount() + formData.deliveryFee;

//         const handler = new PaystackPop({
//           key: paystackPublicKey,
//           email: formData.email, // Customer's email
//           amount: totalAmount * 100, // Amount is in kobo
//           onSuccess: async (response) => {
//             // Handle successful payment
//             if (response.status === "success") {
//               // Check if the payment is successful
//               try {
//                 const verificationResponse = await axios.get(
//                   backendUrl + "api/order/verify",
//                   { orderId: orderData.orderId, reference: response.reference }
//                 );
//                 // navigate(`/verify?success=true&orderId=${orderData.orderId}`);

//                 // If verification is successful
//                 if (verificationResponse.data.success) {
//                   // Clear the cart
//                   setCartItems({});

//                   // Navigate to the orders page
//                   navigate("/orders");
//                 } else {
//                   toast.error("Payment verification failed. Please try again.");
//                 }
//               } catch (verificationError) {
//                 console.error("Verification error:", verificationError);
//                 toast.error(
//                   "An error occurred during payment verification. Please try again."
//                 );
//               }
//             } else {
//               toast.error("Payment was not successful");
//               navigate("/");
//             }
//           },
//           onClose: () => {
//             console.log("Payment popup closed.");
//             toast.info("Payment process canceled.");
//           },
//         });

//         // Open the Paystack payment modal
//         handler.open();
//       };

//       switch (paymentMethod) {
//         case "paystack":
//           const response = await axios.post(
//             backendUrl + "api/order/paystack",
//             orderData,
//             { headers: { token } }
//           );
//           if (response.data.success) {
//             initPaystack(response.data.order);
//           } else {
//             toast.error(response.data.message);
//           }
//           break;
//         case "cash-on-delivery":
//           const codResponse = await axios.post(
//             backendUrl + "api/order/place",
//             orderData,
//             { headers: { token } }
//           );
//           if (codResponse.data.success) {
//             setCartItems({});
//             navigate("/orders");
//           } else {
//             toast.error(codResponse.data.message);
//           }
//           break;
//         default:
//           toast.error("Please select a valid payment method");
//           break;
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error(
//         error.message || "An error occurred while processing your order."
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };


//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="text-xl sm:text-2xl my-3">
//        <p>Delivery Information</p> {/* <Title text1={"DELIVERY"} text2={"INFORMATION"} /> */}
//       </div>
//       <form
//         onSubmit={onSubmitHandler}
//         className="flex flex-col gap-6 pt-5 min-h-[80vh] border-t bg-neutral-50"
//       >
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <input
//             className="border border-gray-300 rounded-md py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//             type="text"
//             name="firstName"
//             value={formData.firstName}
//             onChange={onChangeHandler}
//             placeholder="First name"
//             required
//           />
//           <input
//             className="border border-gray-300 rounded-md py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//             type="text"
//             name="lastName"
//             value={formData.lastName}
//             onChange={onChangeHandler}
//             placeholder="Last name"
//             required
//           />

//           <input
//             className="border border-gray-300 rounded-md py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={onChangeHandler}
//             placeholder="Email"
//             required
//           />
//           <input
//             className="border border-gray-300 rounded-md py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//             type="tel"
//             name="phone"
//             value={formData.phone}
//             onChange={onChangeHandler}
//             placeholder="Phone number"
//             required
//           />
//           {/* <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}> */}
//             <input
//               className="border border-gray-300 rounded-md py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//               type="text"
//               name="address"
//               value={formData.address}
//               onChange={onChangeHandler}
//               placeholder="Address"
//               required
//             />
        

//         {/* Payment Method */}

//         <div className="mt-8">
//           <div className="text-xl sm:text-2xl my-3">
//             {/* <Title text1={"PAYMENT"} text2={"METHOD"} /> */}
//             <p>Payment Method</p>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <label className="flex items-center gap-2 p-4 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
//               <input
//                 type="radio"
//                 name="paymentMethod"
//                 value="paystack"
//                 checked={paymentMethod === "paystack"}
//                 onChange={() => setPaymentMethod("paystack")}
//                 className="w-5 h-5"
//               />
//               <CreditCard className="w-6 h-6" />
//               <span>Pay Online</span>
//             </label>
            
//           </div>
//         </div>

//         {/* Order Summary */}
//         <div></div>
//         <div className="mt-8">
//           {/* <Title text1={"ORDER"} text2={"TOTAL"} /> */}
//           <p>Order Total</p>
//           <span
//             type="button"
//             onClick={toggleSummary}
//             className="text-lg ml-3 absolute font-semibold "
//           >
//             {showSummary ? <ArrowRight /> : <ArrowDown />}
//           </span>

//           {showSummary && (
//             <div className="bg-gray-50 p-6 rounded-lg">
//               {/* <h3 className="text-2xl font-semibold mb-4">Order Summary</h3> */}
//               <div className="flex justify-between mb-2">
//                 <span>Subtotal:</span>
//                 <span className="font-medium">
//                   {formatNaira(getCartAmount())}
//                 </span>
//               </div>
//               <div className="flex justify-between mb-2">
//                 <span>Shipping Fee:</span>
//                 <span className="font-medium">
//                   <p>
//                     {getCartAmount() === 0
//                       ? 0
//                       : formatNaira(formData.deliveryFee)}
//                   </p>
//                 </span>
//               </div>
//               <div className="flex justify-between font-bold text-lg mt-4 pt-4 border-t">
//                 <span>Total:</span>
//                 <span>
//                   {getCartAmount() === 0
//                     ? 0
//                     : formatNaira(getCartAmount() + formData.deliveryFee)}
//                 </span>
//               </div>
//             </div>
//           )}
//         </div>

//         <button
//           type="submit"
//           className="bg-green-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-green-700 transition-colors mt-8 flex items-center justify-center"
//           disabled={isLoading}
//         >
//           {isLoading ? (
//             <>
//               <Loader2 className="w-5 h-5 mr-2 animate-spin" />
//               Processing...
//             </>
//           ) : (
//             "Place Order"
//           )}
//         </button>
//       </form>

//       <p className="mt-4">
//         {" "}
//         Don't have an account yet? Kindly{" "}
//         <a className="cursor-pointer text-blue-400" href={"/login"}>
//           Sign Up
//         </a>
//       </p>
//     </div>
//   );
// };

// export default PlaceOrder;



import React, { useMemo, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
// import { loadStripe } from "@stripe/stripe-js";

import {
  Loader2,
  CreditCard,
  Truck,
  ArrowDown,
  ArrowRight,
} from "lucide-react";

import { ShopContext } from "../context/ShopContext.jsx";
import { assets } from "../assets/assets.js";

// Initialize Stripe
// const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Canadian provinces and territories
const canadianProvinces = [
  { code: "AB", name: "Alberta" },
  { code: "BC", name: "British Columbia" },
  { code: "MB", name: "Manitoba" },
  { code: "NB", name: "New Brunswick" },
  { code: "NL", name: "Newfoundland and Labrador" },
  { code: "NT", name: "Northwest Territories" },
  { code: "NS", name: "Nova Scotia" },
  { code: "NU", name: "Nunavut" },
  { code: "ON", name: "Ontario" },
  { code: "PE", name: "Prince Edward Island" },
  { code: "QC", name: "Quebec" },
  { code: "SK", name: "Saskatchewan" },
  { code: "YT", name: "Yukon" },
];

const PlaceOrder = async () => {
  const {
    navigate,
    cartItems,
    token,
    setCartItems,
    getCartAmount,
    products,
    formatCAD, // Assuming you have a Canadian dollar formatter
    backendUrl,
  } = useContext(ShopContext);
  
  const [showSummary, setShowSummary] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    province: "",
    postalCode: "",
    phone: "",
    deliveryFee: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Calculate delivery fee based on province (example logic)
    const calculateDeliveryFee = () => {
      const baseFee = 10; // Base delivery fee in CAD
      const provinceFees = {
        'ON': 10,
        'QC': 12,
        'BC': 15,
        'AB': 13,
        'MB': 18,
        'SK': 18,
        'NS': 20,
        'NB': 20,
        'NL': 25,
        'PE': 22,
        'NT': 30,
        'NU': 35,
        'YT': 30,
      };
      
      const fee = provinceFees[formData.province] || baseFee;
      setFormData(prev => ({ ...prev, deliveryFee: fee }));
    };

    if (formData.province) {
      calculateDeliveryFee();
    }
  }, [formData.province]);

  const toggleSummary = () => {
    setShowSummary((prev) => !prev);
  };
  
  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  // const validateCanadianPostalCode = (postalCode) => {
  //   const regex = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
  //   return regex.test(postalCode);
  // };


  const stripe = await loadStripe('your-publishable-key');
await stripe.confirmCardPayment(response.data.clientSecret, {
  payment_method: {
    card: cardElement,
    billing_details: {
      name: `${firstName} ${lastName}`,
      email: email,
    },
  },
});


  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    // Validate Canadian postal code   +

    try {
      let orderItems = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(
              products.find((product) => product._id === items)
            );
            if (itemInfo) {
              itemInfo.size = item;
              itemInfo.quantity = cartItems[items][item];
              orderItems.push(itemInfo);
            }
          }
        }
      }

      let orderData = {
        address: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          province: formData.province,
          postalCode: formData.postalCode.toUpperCase(),
          phone: formData.phone,
          country: "Canada",
        },
        items: orderItems,
        subtotal: getCartAmount(),
        deliveryFee: formData.deliveryFee,
        amount: getCartAmount() + formData.deliveryFee,
        currency: "CAD",
        taxes: calculateTaxes(getCartAmount(), formData.province),
      };

      await processStripePayment(orderData);
      
    } catch (error) {
      console.error(error);
      toast.error(
        error.message || "An error occurred while processing your order."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // const calculateTaxes = (subtotal, province) => {
  //   // Canadian tax rates (simplified - you should use a proper tax calculation service)
  //   const taxRates = {
  //     'ON': { hst: 0.13 }, // HST
  //     'QC': { gst: 0.05, pst: 0.09975 }, // GST + PST
  //     'BC': { gst: 0.05, pst: 0.07 }, // GST + PST
  //     'AB': { gst: 0.05 }, // GST only
  //     'MB': { gst: 0.05, pst: 0.07 }, // GST + PST
  //     'SK': { gst: 0.05, pst: 0.06 }, // GST + PST
  //     'NS': { hst: 0.15 }, // HST
  //     'NB': { hst: 0.15 }, // HST
  //     'NL': { hst: 0.15 }, // HST
  //     'PE': { hst: 0.15 }, // HST
  //     'NT': { gst: 0.05 }, // GST only
  //     'NU': { gst: 0.05 }, // GST only
  //     'YT': { gst: 0.05 }, // GST only
  //   };

  //   const rates = taxRates[province] || { gst: 0.05 };
  //   let totalTax = 0;

  //   if (rates.hst) {
  //     totalTax = subtotal * rates.hst;
  //   } else {
  //     totalTax = subtotal * (rates.gst || 0) + subtotal * (rates.pst || 0);
  //   }

  //   return {
  //     amount: totalTax,
  //     rate: rates,
  //   };
  // };

  // const processStripePayment = async (orderData) => {
  //   try {
  //     // Create payment intent on your backend
  //     const response = await axios.post(
  //       backendUrl + "api/order/create-payment-intent",
  //       {
  //         ...orderData,
  //         paymentMethod: "stripe",
  //       },
  //       { headers: { token } }
  //     );

  //     if (!response.data.success) {
  //       toast.error(response.data.message);
  //       return;
  //     }

  //     const { clientSecret, orderId } = response.data;
  //     // const stripe = await stripePromise;

  //     // Redirect to Stripe Checkout or use Elements
  //     const result = await stripe.confirmCardPayment(clientSecret, {
  //       payment_method: {
  //         card: {
  //           // This would typically be collected via Stripe Elements
  //           // For now, we'll redirect to Stripe Checkout
  //         },
  //         billing_details: {
  //           name: `${formData.firstName} ${formData.lastName}`,
  //           email: formData.email,
  //           phone: formData.phone,
  //           address: {
  //             line1: formData.address,
  //             city: formData.city,
  //             state: formData.province,
  //             postal_code: formData.postalCode,
  //             country: "CA",
  //           },
  //         },
  //       },
  //     });

  //     if (result.error) {
  //       toast.error(result.error.message);
  //     } else {
  //       // Payment succeeded
  //       if (result.paymentIntent.status === "succeeded") {
  //         // Verify payment on backend
  //         const verifyResponse = await axios.post(
  //           backendUrl + "api/order/verify-stripe-payment",
  //           {
  //             paymentIntentId: result.paymentIntent.id,
  //             orderId: orderId,
  //           },
  //           { headers: { token } }
  //         );

  //         if (verifyResponse.data.success) {
  //           setCartItems({});
  //           toast.success("Order placed successfully!");
  //           navigate("/orders");
  //         } else {
  //           toast.error("Payment verification failed. Please contact support.");
  //         }
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Stripe payment error:", error);
  //     toast.error("Payment processing failed. Please try again.");
  //   }
  // };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-xl sm:text-2xl my-3">
        <p>Shipping Information</p>
      </div>
      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col gap-6 pt-5 min-h-[80vh] border-t bg-neutral-50"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            className="border border-gray-300 rounded-md py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={onChangeHandler}
            placeholder="First name"
            required
          />
          <input
            className="border border-gray-300 rounded-md py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={onChangeHandler}
            placeholder="Last name"
            required
          />

          <input
            className="border border-gray-300 rounded-md py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="email"
            name="email"
            value={formData.email}
            onChange={onChangeHandler}
            placeholder="Email"
            required
          />
          <input
            className="border border-gray-300 rounded-md py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={onChangeHandler}
            placeholder="Phone number"
            required
          />

          <input
            className="border border-gray-300 rounded-md py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 md:col-span-2"
            type="text"
            name="address"
            value={formData.address}
            onChange={onChangeHandler}
            placeholder="Street address"
            required
          />

          <input
            className="border border-gray-300 rounded-md py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            name="city"
            value={formData.city}
            onChange={onChangeHandler}
            placeholder="City"
            required
          />

          <select
            className="border border-gray-300 rounded-md py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            name="province"
            value={formData.province}
            onChange={onChangeHandler}
            required
          >
            <option value="">Select Province/Territory</option>
            {canadianProvinces.map((province) => (
              <option key={province.code} value={province.code}>
                {province.name}
              </option>
            ))}
          </select>

          <input
            className="border border-gray-300 rounded-md py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            name="postalCode"
            value={formData.postalCode}
            onChange={onChangeHandler}
            placeholder="Postal Code (e.g., K1A 0A6)"
            required
          />
        </div>

        {/* Payment Method */}
        <div className="mt-8">
          <div className="text-xl sm:text-2xl my-3">
            <p>Payment Method</p>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center gap-2 p-4 border rounded-md bg-blue-50 border-blue-200">
              <CreditCard className="w-6 h-6 text-blue-600" />
              <span className="font-medium">Secure Payment with Stripe</span>
              <div className="ml-auto flex gap-2">
                <img src={assets.mastercard} alt="Mastercard" className="h-6" />
                <img src={assets.visa} alt="Visa" className="h-6 " />
                {/* <img src={assets.americanexpress} alt="American Express" className="h-6" /> */}
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="mt-8">
          <div className="flex items-center gap-2">
            <p className="text-xl sm:text-2xl">Order Summary</p>
            <button
              type="button"
              onClick={toggleSummary}
              className="text-lg font-semibold"
            >
              {showSummary ? <ArrowDown /> : <ArrowRight />}
            </button>
          </div>

          {showSummary && (
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex justify-between mb-2">
                <span>Subtotal:</span>
                <span className="font-medium">
                  ${(getCartAmount()).toLocaleString("en-CA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} CAD

                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Shipping:</span>
                <span className="font-medium">
                  {getCartAmount() === 0
                    ? "$0.00 CAD"
                    : 10.00   /* Assuming a default delivery fee of $10 CAD */}
                    {/* // : `$${formData.deliveryFee.toFixed(2)} CAD`} */}
                </span>
              </div>
              {/* <div className="flex justify-between mb-2">
                <span>Taxes:</span>
                <span className="font-medium">
                  {getCartAmount() === 0
                    ? "$0.00 CAD"
                    : `$${calculateTaxes(getCartAmount(), formData.province).amount.toFixed(2)} CAD`}
                </span>
              </div> */}
              <div className="flex justify-between font-bold text-lg mt-4 pt-4 border-t">
                <span>Total:</span>
                <span>
               {
  getCartAmount() === 0
    ? "$0.00 CAD"
    : `$${(getCartAmount() + 10)
          .toLocaleString("en-CA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      } CAD`
}

                </span>
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors mt-8 flex items-center justify-center"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Processing Payment...
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5 mr-2" />
              Pay with Stripe
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-600">
        <p>🔒 Your payment information is secure and encrypted</p>
        <p className="mt-2">
          Don't have an account yet?{" "}
          <a className="cursor-pointer text-blue-600 hover:text-blue-800" href="/register">
            Create Account
          </a>
        </p>
      </div>
    </div>
  );
};

export default PlaceOrder;