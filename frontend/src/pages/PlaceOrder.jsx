import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { 
  Loader2, 
  CreditCard, 
  Truck, 
  Shield, 
  CheckCircle, 
  MapPin, 
  User, 
  Mail, 
  Phone,
  ShoppingCart,
  ArrowLeft,
  Trash2
} from "lucide-react";
import { ShopContext } from "../context/ShopContext.jsx";
import { assets } from "../assets/assets.js";

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

const PlaceOrder = () => {
  const {
    navigate,
    cartItems,
    setCartItems,
    getCartAmount,
    products,
    updateQuantity,
  } = useContext(ShopContext);

  const backendUrl = "http://localhost:3000/";
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
  const [formErrors, setFormErrors] = useState({});

  // Calculate taxes based on Canadian province
  const calculateTaxes = (amount, province) => {
    const taxRates = {
      'ON': 0.13, // HST
      'QC': 0.14975, // GST + QST
      'BC': 0.12, // GST + PST
      'AB': 0.05, // GST only
      'MB': 0.12, // GST + PST
      'SK': 0.11, // GST + PST
      'NS': 0.15, // HST
      'NB': 0.15, // HST
      'NL': 0.15, // HST
      'PE': 0.15, // HST
      'NT': 0.05, // GST only
      'NU': 0.05, // GST only
      'YT': 0.05, // GST only
    };

    const rate = taxRates[province] || 0;
    return amount * rate;
  };

  // Get tax name based on province
  const getTaxName = (province) => {
    const taxNames = {
      'ON': 'HST',
      'QC': 'GST + QST',
      'BC': 'GST + PST',
      'AB': 'GST',
      'MB': 'GST + PST',
      'SK': 'GST + PST',
      'NS': 'HST',
      'NB': 'HST',
      'NL': 'HST',
      'PE': 'HST',
      'NT': 'GST',
      'NU': 'GST',
      'YT': 'GST',
    };
    return taxNames[province] || 'Tax';
  };

  useEffect(() => {
    const calculateDeliveryFee = () => {
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

      const fee = provinceFees[formData.province] || 15;
      setFormData(prev => ({ ...prev, deliveryFee: fee }));
    };

    if (formData.province) {
      calculateDeliveryFee();
    }
  }, [formData.province]);

  // Get cart items for display
  const getCartItems = () => {
    const items = [];
    for (const itemId in cartItems) {
      for (const size in cartItems[itemId]) {
        if (cartItems[itemId][size] > 0) {
          const itemInfo = products.find((product) => product._id === itemId);
          if (itemInfo) {
            items.push({
              ...itemInfo,
              size,
              quantity: cartItems[itemId][size]
            });
          }
        }
      }
    }
    return items;
  };

  const cartItemsDisplay = getCartItems();

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setFormData((data) => ({ ...data, [name]: value }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validate postal code format
  const validatePostalCode = (postalCode) => {
    const canadianPostalRegex = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
    return canadianPostalRegex.test(postalCode);
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    if (!formData.phone.trim()) errors.phone = 'Phone number is required';
    if (!formData.address.trim()) errors.address = 'Address is required';
    if (!formData.city.trim()) errors.city = 'City is required';
    if (!formData.province) errors.province = 'Province is required';
    if (!formData.postalCode.trim()) {
      errors.postalCode = 'Postal code is required';
    } else if (!validatePostalCode(formData.postalCode)) {
      errors.postalCode = 'Invalid postal code format';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const processStripePayment = async (orderData) => {
    try {
      const response = await axios.post(
        `${backendUrl}api/order/place`,
        orderData
      );

      if (response.data.url) {
        window.location.href = response.data.url;
      } else {
        toast.error(response.data.message || "Payment processing failed");
      }
    } catch (error) {
      console.error("Stripe payment error:", error);
      toast.error(error.response?.data?.message || "An error occurred while processing your payment.");
    }
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    setIsLoading(true);

    try {
      if (cartItemsDisplay.length === 0) {
        toast.error("Your cart is empty");
        setIsLoading(false);
        return;
      }

      const subtotal = getCartAmount();
      const taxes = calculateTaxes(subtotal, formData.province);
      const deliveryFee = formData.deliveryFee || 0;
      const total = subtotal + deliveryFee + taxes;

      const orderData = {
        address: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          lga: formData.city,
          state: formData.province,
          postalCode: formData.postalCode.toUpperCase(),
          phone: formData.phone,
          country: "Canada",
          deliveryFee: deliveryFee
        },
        items: cartItemsDisplay,
        amount: total,
        subtotal: subtotal,
        taxes: taxes,
        deliveryFee: deliveryFee,
        paymentMethod: "stripe",
      };

      await processStripePayment(orderData);

    } catch (error) {
      console.error("Order submission error:", error);
      toast.error(error.message || "An error occurred while processing your order.");
    } finally {
      setIsLoading(false);
    }
  };

  const subtotal = getCartAmount();
  const taxes = calculateTaxes(subtotal, formData.province);
  const deliveryFee = formData.deliveryFee || 0;
  const total = subtotal + deliveryFee + taxes;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/cart')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Cart
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-2">Complete your order information below</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-semibold">Contact Information</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    className={`border rounded-lg py-3 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.firstName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={onChangeHandler}
                    placeholder="First name"
                    required
                  />
                  {formErrors.firstName && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.firstName}</p>
                  )}
                </div>
                <div>
                  <input
                    className={`border rounded-lg py-3 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.lastName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={onChangeHandler}
                    placeholder="Last name"
                    required
                  />
                  {formErrors.lastName && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.lastName}</p>
                  )}
                </div>
                <div>
                  <input
                    className={`border rounded-lg py-3 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={onChangeHandler}
                    placeholder="Email address"
                    required
                  />
                  {formErrors.email && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                  )}
                </div>
                <div>
                  <input
                    className={`border rounded-lg py-3 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={onChangeHandler}
                    placeholder="Phone number"
                    required
                  />
                  {formErrors.phone && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-semibold">Shipping Address</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <input
                    className={`border rounded-lg py-3 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={onChangeHandler}
                    placeholder="Street address"
                    required
                  />
                  {formErrors.address && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.address}</p>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <input
                      className={`border rounded-lg py-3 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        formErrors.city ? 'border-red-500' : 'border-gray-300'
                      }`}
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={onChangeHandler}
                      placeholder="City"
                      required
                    />
                    {formErrors.city && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.city}</p>
                    )}
                  </div>
                  <div>
                    <select
                      className={`border rounded-lg py-3 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        formErrors.province ? 'border-red-500' : 'border-gray-300'
                      }`}
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
                    {formErrors.province && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.province}</p>
                    )}
                  </div>
                </div>
                <div>
                  <input
                    className={`border rounded-lg py-3 px-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.postalCode ? 'border-red-500' : 'border-gray-300'
                    }`}
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={onChangeHandler}
                    placeholder="Postal Code (e.g., K1A 0A6)"
                    required
                  />
                  {formErrors.postalCode && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.postalCode}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-semibold">Payment Method</h2>
              </div>
              <div className="border rounded-lg p-4 bg-blue-50 border-blue-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Shield className="w-6 h-6 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">Secure Payment with Stripe</p>
                      <p className="text-sm text-gray-600">Your payment information is encrypted and secure</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <img src={assets.visa} alt="Visa" className="h-8" />
                    <img src={assets.mastercard} alt="Mastercard" className="h-8" />
                    <img src={assets.americanexpress} alt="American Express" className="h-8" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <div className="flex items-center gap-2 mb-4">
                <ShoppingCart className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-semibold">Order Summary</h2>
              </div>

              {/* Cart Items */}
              <div className="space-y-4 mb-6 max-h-60 overflow-y-auto">
                {cartItemsDisplay.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <img
                      src={item.image?.[0] || '/placeholder.png'}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.name}</p>
                      <p className="text-xs text-gray-600">Size: {item.size}</p>
                      <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium text-sm">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Pricing Breakdown */}
              <div className="space-y-3 border-t pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {subtotal === 0 ? 'Free' : `$${deliveryFee.toFixed(2)}`}
                  </span>
                </div>
                {formData.province && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">{getTaxName(formData.province)}</span>
                    <span className="font-medium">${taxes.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold border-t pt-3">
                  <span>Total</span>
                  <span>${total.toFixed(2)} CAD</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={onSubmitHandler}
                className="w-full bg-gray-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors mt-6 flex items-center justify-center"
                disabled={isLoading || cartItemsDisplay.length === 0}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5 mr-2" />
                    Complete Secure Payment
                  </>
                )}
              </button>

              {/* Security Features */}
              <div className="mt-6 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>SSL Encrypted Checkout</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Money-back Guarantee</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Secure Payment Processing</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Need help? Contact our customer support at support@palmsbeauty.com</p>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;