import React, { useEffect, useState } from "react";
import { Package, User, Phone, MapPin, Calendar, CreditCard, Truck, Filter, Search, Eye, ChevronDown } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";

const backendUrl = "https://palmsbeautystore-backend.onrender.com";

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const statusOptions = [
    "Order Placed",
    "Packing", 
    "Shipped",
    "Out for Delivery",
    "Delivered"
  ];

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
      return null;
    }
    try {
      const response = await axios.post(
        backendUrl + "/api/order/list",
        {},
        { headers: { token } }
      );
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
      console.log(error);
      toast.error("Failed to update order status");
    }
  };

  const filterOrders = () => {
    let filtered = orders;

    // Filter by status
    if (statusFilter !== "All") {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.address && 
          `${order.address.firstName} ${order.address.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredOrders(filtered);
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  useEffect(() => {
    filterOrders();
  }, [statusFilter, searchTerm, orders]);

  const getStatusCounts = () => {
    const counts = {};
    statusOptions.forEach(status => {
      counts[status] = orders.filter(order => order.status === status).length;
    });
    counts["All"] = orders.length;
    return counts;
  };

  const statusCounts = getStatusCounts();

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
          <p className="text-gray-600">Manage and track all customer orders</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <div className="text-2xl font-bold text-gray-900">{statusCounts["All"]}</div>
            <div className="text-sm text-gray-600">Total Orders</div>
          </div>
          {statusOptions.map(status => (
            <div key={status} className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-gray-900">{statusCounts[status]}</div>
              <div className="text-sm text-gray-600">{status}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg border border-gray-400 shadow-lg mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search orders by ID, customer name, or product..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Status</option>
                {statusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="bg-white p-12 rounded-lg shadow-sm border text-center">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            filteredOrders.map((order, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-400  hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Order Items */}
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <Package className="h-7 w-7 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                            <span className="text-sm font-medium text-gray-900">Order #{order._id.slice(-8)}</span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                              {order.status}
                            </span>
                          </div>
                          <div className="space-y-1">
                            {order.items.map((item, itemIndex) => (
                              <div key={itemIndex} className="text-sm text-gray-600">
                                <span className="font-medium">{item.name}</span> x {item.quantity}
                                <span className="text-gray-500 ml-2">Size: {item.size}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Customer Info */}
                    <div className="lg:w-80">
                      {order.address ? (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <span className="text-sm font-medium text-gray-900">
                              {order.address.firstName} {order.address.lastName}
                            </span>
                          </div>
                          <div className="flex items-start gap-2">
                            <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                            <div className="text-sm text-gray-600">
                              <div>{order.address.addressLine}</div>
                              <div>{order.address.lga}, {order.address.state}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{order.address.phone}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-red-500">Address details unavailable</div>
                      )}
                    </div>

                    {/* Order Details */}
                    <div className="lg:w-64">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {new Date(order.date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {order.paymentMethod} - {order.paymentMethod === "Online" ? "Paid" : "Pending"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Truck className="h-4 w-4 text-gray-400" />
                          {/* <span className="text-sm text-gray-600">
                            Delivery: ₦{order.deliveryFee}
                          </span> */}
                        </div>
                        <div className="text-lg font-bold text-gray-900">
                          Total: ${order.amount}
                        </div>
                      </div>
                    </div>

                    {/* Status Update */}
                    <div className="lg:w-48">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Update Status
                      </label>
                      <select
                        onChange={(event) => statusHandler(event, order._id)}
                        value={order.status}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {statusOptions.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;