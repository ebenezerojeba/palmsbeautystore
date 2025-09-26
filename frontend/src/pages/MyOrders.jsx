import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { Package, Calendar, CreditCard, RefreshCw, Eye, ChevronDown } from "lucide-react";

const Orders = () => {
  const { token, formatNaira, backendUrl } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedItems, setExpandedItems] = useState(new Set());

  const statusColors = {
    "Order Placed": "bg-blue-100 text-blue-800 border-blue-200",
    "Packing": "bg-yellow-100 text-yellow-800 border-yellow-200",
    "Shipped": "bg-purple-100 text-purple-800 border-purple-200",
    "Out for Delivery": "bg-orange-100 text-orange-800 border-orange-200",
    "Delivered": "bg-green-100 text-green-800 border-green-200"
  };

  const statusDots = {
    "Order Placed": "bg-blue-500",
    "Packing": "bg-yellow-500",
    "Shipped": "bg-purple-500",
    "Out for Delivery": "bg-orange-500",
    "Delivered": "bg-green-500"
  };

  const loadOrderData = async () => {
  try {
    setLoading(true);
    
    if (!token) {
      console.log("No token found");
      return null;
    }
    
    // ❌ ISSUE: Using { headers: { token } } instead of Authorization Bearer
    // ✅ FIXED: Use proper Authorization header format
    const response = await axios.get(
      backendUrl + "/api/order/userorders", 
      { 
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        } 
      }
    );
    
    console.log("Orders response:", response.data);
    
    if (response.data.success) {
      let allOrdersItem = [];
      
     response.data.orders.forEach((order) => {
  order.items.forEach((item) => {
    const orderItem = {
      _id: item.product?._id || item._id,
      name: item.product?.name || item.name,
      image: item.product?.image || null, // depends if your product has image in DB
      price: item.price,
      quantity: item.quantity,
      size: item.size,
      length: item.length,
      color: item.color,
      status: order.status,
      payment: order.payment,
      paymentMethod: order.paymentMethod,
      date: order.date,
      orderId: order._id,
      orderAmount: order.amount,
      isPaid: order.isPaid,
      address: order.address
    };
    allOrdersItem.push(orderItem);
  });
});

      
      setOrderData(allOrdersItem.reverse());
    } else {
      console.error("Failed to load orders:", response.data.message);
    }
  } catch (error) {
    console.error("Error loading orders:", error);
    
    // Handle authentication errors
    if (error.response?.status === 401) {
      console.log("Authentication failed, redirecting to login");
      // Clear token and redirect to login
      localStorage.removeItem('token'); // Adjust based on how you store token
      // navigate('/login'); // Uncomment if you have navigation
    }
  } finally {
    setLoading(false);
  }
};
  const toggleItemExpansion = (index) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
    
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  const renderVariationDetails = (item) => {
    const details = [];
    if (item.length) details.push({ label: "Length", value: item.length, icon: "📐" });
    if (item.color) details.push({ label: "Color", value: item.color, icon: "🎨" });
    if (item.size) details.push({ label: "Size", value: item.size, icon: "📏" });
    if (item.texture) details.push({ label: "Texture", value: item.texture, icon: "✨" });
    if (item.weight) details.push({ label: "Weight", value: item.weight, icon: "⚖️" });
    if (item.sku) details.push({ label: "SKU", value: item.sku, icon: "🏷️" });
    
    return details;
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="border-t pt-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
        <p className="text-gray-600">Track and manage your order history</p>
      </div>

      {/* Orders Summary */}
      {/* {orderData.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{orderData.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <CreditCard className="h-8 w-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNaira(orderData.reduce((sum, item) => sum + (item.price * item.quantity), 0))}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Items Purchased</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orderData.reduce((sum, item) => sum + item.quantity, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )} */}

      {/* Orders List */}
      <div className="space-y-6">
        {orderData.length === 0 ? (
          <div className="bg-white p-12 rounded-lg shadow-sm border text-center">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-600 mb-6">Start shopping to see your orders here</p>
            <button
              onClick={() => window.location.href = '/collections'}
              className="bg-pink-900 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition-colors"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          orderData.map((item, index) => {
            const isExpanded = expandedItems.has(index);
            const variations = renderVariationDetails(item);

            return (
              <div key={index} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="p-6">
                  {/* Order Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-50 rounded-lg">
                        <Package className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Order #{item.orderId?.slice(-8)}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(item.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-sm border ${statusColors[item.status]}`}>
                        <span className={`w-2 h-2 rounded-full mr-2 ${statusDots[item.status]}`}></span>
                        {item.status}
                      </span>
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="flex flex-col sm:flex-row gap-6">
                    {/* Product Image */}
                    {/* <div className="flex-shrink-0">
                      <img
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover border"
                        src={item.image?.[0] || item.image}
                        alt={item.name}
                      />
                    </div> */}

                    {/* Product Info */}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.name}</h3>
                      
                      {/* Basic Details */}
                      <div className="flex flex-wrap items-center gap-4 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">Price:</span>
                          <span className="text-lg font-bold text-gray-900">{formatNaira(item.price)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">Quantity:</span>
                          <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-medium">
                            {item.quantity}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">Subtotal:</span>
                          <span className="font-semibold text-gray-900">
                            {formatNaira(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>

                      {/* Variations */}
                      {variations.length > 0 && (
                        <div className="mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="text-sm font-medium text-gray-700">Product Details:</h4>
                            <button
                              onClick={() => toggleItemExpansion(index)}
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              <ChevronDown className={`h-4 w-4 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                            </button>
                          </div>
                          
                          <div className={`grid transition-all duration-300 ${isExpanded ? 'grid-cols-2 sm:grid-cols-3 gap-2' : 'grid-cols-2 gap-2'}`}>
                            {variations.slice(0, isExpanded ? variations.length : 4).map((detail, idx) => (
                              <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded-md border">
                                <span className="text-sm">{detail.icon}</span>
                                <div className="min-w-0">
                                  <span className="text-xs text-gray-500 block">{detail.label}</span>
                                  <span className="text-sm font-medium text-gray-900 truncate block">
                                    {detail.value}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          {!isExpanded && variations.length > 4 && (
                            <button
                              onClick={() => toggleItemExpansion(index)}
                              className="text-blue-600 hover:text-blue-800 text-sm mt-2"
                            >
                              +{variations.length - 4} more details
                            </button>
                          )}
                        </div>
                      )}

                      {/* No Variations Warning */}
                      {variations.length === 0 && (
                        <div className="text-sm text-amber-600 bg-amber-50 p-2 rounded-md border border-amber-200 mb-4">
                          ⚠️ No specific product variations available for this order
                        </div>
                      )}

                      {/* Payment Info */}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <CreditCard className="h-4 w-4" />
                          <span>Payment: {item.paymentMethod}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>Ordered: {new Date(item.date).toDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                    <button
                      onClick={loadOrderData}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Refresh Status
                    </button>
                    <button
                      onClick={() => toggleItemExpansion(index)}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                      {isExpanded ? 'Hide Details' : 'View Details'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Refresh Button for All Orders */}
      {orderData.length > 0 && (
        <div className="mt-8 text-center">
          <button
            onClick={loadOrderData}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 mx-auto"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Refreshing...' : 'Refresh All Orders'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Orders;