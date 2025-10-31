import React, { useEffect, useState } from "react";
import { Package, User, Phone, MapPin, Calendar, CreditCard, Filter, Search, Eye, ChevronDown, Tag, Star, Palette } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [expandedOrders, setExpandedOrders] = useState(new Set());

  const statusOptions = ["Order Placed", "Packing", "Shipped", "Out for Delivery", "Delivered"];

  const statusColors = {
    "Order Placed": "bg-blue-100 text-blue-800",
    "Packing": "bg-yellow-100 text-yellow-800",
    "Shipped": "bg-purple-100 text-purple-800",
    "Out for Delivery": "bg-orange-100 text-orange-800",
    "Delivered": "bg-green-100 text-green-800"
  };

  const fetchAllOrders = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const response = await axios.get(backendUrl + "/api/order/list", {
        headers: { token }
      });
      if (response.data.success) {
        setOrders(response.data.orders.reverse());
        setFilteredOrders(response.data.orders.reverse());
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/order/status",
        { orderId, status: event.target.value },
        { headers: { token } }
      );
      if (response.data.success) {
        await fetchAllOrders();
        toast.success("Order status updated successfully");
      }
    } catch (error) {
      toast.error("Failed to update order status");
    }
  };

  const toggleOrderExpansion = (orderId) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  const filterOrders = () => {
    let filtered = orders;
    if (statusFilter !== "All") {
      filtered = filtered.filter(order => order.status === statusFilter);
    }
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.address &&
          `${order.address.firstName} ${order.address.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        order.items.some(item => 
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.sku && item.sku.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (item.color && item.color.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (item.texture && item.texture.toLowerCase().includes(searchTerm.toLowerCase()))
        )
      );
    }
    setFilteredOrders(filtered);
  };

  const renderVariationDetails = (item) => {
    const details = [];
    if (item.size) details.push({ label: "Size", value: item.size, icon: "📏" });
    if (item.length) details.push({ label: "Length", value: item.length, icon: "📐" });
    if (item.color) details.push({ label: "Color", value: item.color, icon: "🎨" });
    if (item.texture) details.push({ label: "Texture", value: item.texture, icon: "✨" });
    if (item.weight) details.push({ label: "Weight", value: item.weight, icon: "⚖️" });
    if (item.sku) details.push({ label: "SKU", value: item.sku, icon: "🏷️" });
    
    return details;
  };

  const calculateOrderMetrics = (order) => {
    const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
    const uniqueProducts = order.items.length;
    const avgItemPrice = order.amount / totalItems;
    
    return { totalItems, uniqueProducts, avgItemPrice };
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  useEffect(() => {
    filterOrders();
  }, [statusFilter, searchTerm, orders]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Management</h1>
          {/* <p className="text-gray-600">Manage and track all customer orders with detailed product variations</p> */}
        </div>

        {/* Filters */}
        {/* <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search by order ID, customer name, SKU, color, or product..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                >
                  <option value="All">All Statuses</option>
                  {statusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
              </div>
            </div>
          </div>
        </div> */}

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="bg-white p-12 rounded-lg shadow-sm border text-center">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            filteredOrders.map(order => {
              const { totalItems, uniqueProducts, avgItemPrice } = calculateOrderMetrics(order);
              const isExpanded = expandedOrders.has(order._id);

              return (
                <div key={order._id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                  <div className="p-6">
                    {/* Order Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <Package className="h-6 w-6 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Order #{order._id.slice(-8)}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                              {order.status}
                            </span>
                            <span className="text-xs text-gray-500">
                              {uniqueProducts} product{uniqueProducts !== 1 ? 's' : ''} • {totalItems} item{totalItems !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleOrderExpansion(order._id)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <ChevronDown className={`h-5 w-5 text-gray-500 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      {/* Order Items - Compact View */}
                      <div className="lg:col-span-6">
                        <h4 className="font-medium text-gray-900 mb-3">Items Ordered</h4>
                        <div className="space-y-3">
                          {order.items.slice(0, isExpanded ? order.items.length : 2).map((item, idx) => (
                            <div key={idx} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                              {item.image && (
                                <img 
                                  src={item.image} 
                                  alt={item.name} 
                                  className="h-20 w-20 rounded-lg object-cover border-2 border-white shadow-sm flex-shrink-0" 
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex-1">
                                    <h5 className="font-semibold text-gray-900 text-lg mb-1">{item.name}</h5>
                                    <div className="flex items-center gap-2 mb-2">
                                      <span className="text-sm font-medium text-gray-700">Quantity:</span>
                                      <span className="bg-blue-100 text-gray-800 px-2 py-1 rounded-full text-sm font-medium">
                                        {item.quantity}
                                      </span>
                                      <span className="text-sm text-gray-600">× ${item.price}</span>
                                    </div>
                                    
                                    {/* Enhanced Variation Details - Always show if they exist */}
                                    <div className="space-y-2">
                                      <h6 className="text-sm font-medium text-gray-700 mb-2">Product Specifications:</h6>
                                      <div className="grid grid-cols-2 gap-2">
                                        {item.length && (
                                          <div className="flex items-center gap-2 p-2 bg-white rounded-md border">
                                            <span className="text-lg">📐</span>
                                            <div>
                                              <span className="text-xs text-gray-500">Length</span>
                                              <p className="text-sm font-semibold text-gray-900">{item.length}</p>
                                            </div>
                                          </div>
                                        )}
                                        {item.color && (
                                          <div className="flex items-center gap-2 p-2 bg-white rounded-md border">
                                            <span className="text-lg">🎨</span>
                                            <div>
                                              <span className="text-xs text-gray-500">Color</span>
                                              <p className="text-sm font-semibold text-gray-900">{item.color}</p>
                                            </div>
                                          </div>
                                        )}
                                        {item.size && (
                                          <div className="flex items-center gap-2 p-2 bg-white rounded-md border">
                                            <span className="text-lg">📏</span>
                                            <div>
                                              <span className="text-xs text-gray-500">Size</span>
                                              <p className="text-sm font-semibold text-gray-900">{item.size}</p>
                                            </div>
                                          </div>
                                        )}
                                        {item.texture && (
                                          <div className="flex items-center gap-2 p-2 bg-white rounded-md border">
                                            <span className="text-lg">✨</span>
                                            <div>
                                              <span className="text-xs text-gray-500">Texture</span>
                                              <p className="text-sm font-semibold text-gray-900">{item.texture}</p>
                                            </div>
                                          </div>
                                        )}
                                        {item.weight && (
                                          <div className="flex items-center gap-2 p-2 bg-white rounded-md border">
                                            <span className="text-lg">⚖️</span>
                                            <div>
                                              <span className="text-xs text-gray-500">Weight</span>
                                              <p className="text-sm font-semibold text-gray-900">{item.weight}</p>
                                            </div>
                                          </div>
                                        )}
                                        {item.sku && (
                                          <div className="flex items-center gap-2 p-2 bg-white rounded-md border col-span-2">
                                            <span className="text-lg">🏷️</span>
                                            <div>
                                              <span className="text-xs text-gray-500">SKU</span>
                                              <p className="text-sm font-semibold text-gray-900 font-mono">{item.sku}</p>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                      
                                      {/* Fallback if no variations are set */}
                                      {!item.length && !item.color && !item.size && !item.texture && !item.weight && !item.sku && (
                                        <div className="text-sm text-amber-600 bg-amber-50 p-2 rounded-md border border-amber-200">
                                          ⚠️ No product variations specified for this item
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="text-right ml-4">
                                    <p className="text-sm text-gray-500 mb-1">Subtotal</p>
                                    <p className="text-xl font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                          {!isExpanded && order.items.length > 2 && (
                            <button
                              onClick={() => toggleOrderExpansion(order._id)}
                              className="text-gray-600 hover:text-blue-800 text-sm font-medium"
                            >
                              +{order.items.length - 2} more items
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Customer Info */}
                      <div className="lg:col-span-3">
                        <h4 className="font-medium text-gray-900 mb-3">Customer Details</h4>
                        {order.address && (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-gray-400" />
                              <span className="text-sm font-medium text-gray-900">
                                {order.address.firstName} {order.address.lastName}
                              </span>
                            </div>
                            <div className="flex items-start gap-2">
                              <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                              <div className="text-sm text-gray-600">
                                <div>{order.address.address}</div>
                                <div>{order.address.city}, {order.address.state}</div>
                                <div>{order.address.lga}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-600">{order.address.phone}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Order Details & Status */}
                      <div className="lg:col-span-3">
                        <h4 className="font-medium text-gray-900 mb-3">Order Details</h4>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {new Date(order.date).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{order.paymentMethod}</span>
                          </div>
                          <div className="border-t pt-3">
                            <div className="text-lg font-bold text-gray-900 mb-3">
                              Total: ${order.amount.toLocaleString()}
                            </div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Update Status</label>
                            <select
                              onChange={(event) => statusHandler(event, order._id)}
                              value={order.status}
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            >
                              {statusOptions.map(status => (
                                <option key={status} value={status}>{status}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;