

import React, { useEffect, useState } from "react";
import { Trash2, Package, AlertCircle, Loader2, X, Check, Search, Filter, Eye, Edit, Save, ChevronDown, ChevronUp } from "lucide-react";
import axios from 'axios';
import {toast} from 'react-toastify'

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(null);
  const [error, setError] = useState(null);
  const [updatingStock, setUpdatingStock] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);

  // Filter and pagination states
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    subCategory: '',
    minPrice: '',
    maxPrice: '',
    inStock: '',
    status: 'active',
    sortBy: 'date',
    sortOrder: 'desc'
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [showFilters, setShowFilters] = useState(false);

  const categories = {
    "Hair Extensions": [
      "Tape-in", "Wefts", "Halo Weft", "Toppers", "Claw Ponytail", "Ponytails", "I-tip", "K-tip"
    ],
    "Braiding Extensions": [
      "Pre-stretched Braiding Hair", "Passion Twist", "French Curls", "Kinky",
      "Marley Twist", "3 Colored Ombré Braiding Hair", "Boho Human Hair Curls", "Boho Fiber Curls"
    ],
    "Crotchet": [
      "Butterfly Locs", "Hand Made Butterfly Locs", "Crotchet Twist", "Crotchet Braids",
      "Faux Locs (Curly End)", "Faux Locs (Straight End)"
    ],
    "Wigs": ["Human Hair Wigs", "Fiber Hair Wigs"]
  };

  const fetchList = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      // Build query parameters
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== '')
        )
      });

      const response = await axios.get(`${backendUrl}/api/product/list?${queryParams}`, {
        timeout: 10000 // Add timeout for production
      });

      if (response.data.success) {
        setList(response.data.data.products);
        setPagination(response.data.data.pagination);
      } else {
        setError(response.data.message || "Failed to fetch products");
      }
    } catch (error) {
      console.error('Fetch error:', error);
      if (error.code === 'ECONNABORTED') {
        setError("Request timeout. Please try again.");
      } else {
        setError(error.response?.data?.message || error.message || "Failed to fetch products");
      }
    } finally {
      setLoading(false);
    }
  };

  const removeProduct = async (id) => {
    if (!window.confirm('Are you sure you want to remove this product?')) {
      return;
    }

    try {
      setRemoving(id);

      const response = await axios.post(
        `${backendUrl}/api/product/remove`,
        { id },
        { 
          headers: { token },
          timeout: 10000
        }
      );

      if (response.data.success) {
        await fetchList(pagination.currentPage);
      } else {
        setError(response.data.message || "Failed to remove product");
      }
    } catch (error) {
      console.error('Remove error:', error);
      setError(error.response?.data?.message || error.message || "Failed to remove product");
    } finally {
      setRemoving(null);
    }
  };

  const updateProductStatus = async (productId, status) => {
    try {
      setUpdatingStock(productId);
      const response = await axios.put(
        `${backendUrl}/api/product/update`,
        {
          id: productId,
          status: status
        },
        {
          timeout: 10000
        }
      );

      if (response.data.success) {
        // Update with the enhanced data from backend if available
        setList(prev => prev.map(item =>
          item._id === productId 
            ? { ...item, ...response.data.data } 
            : item
        ));
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update product status");
    } finally {
      setUpdatingStock(null);
    }
  };

const handleEditClick = (product) => {
  setEditingProduct(product._id);
  setEditForm({
    name: product.name || '',
    description: product.description || '',
    variations: product.variations ? product.variations.map(v => ({
      ...v,
      price: typeof v.price === 'number' ? v.price : parseFloat(v.price) || 0,
      stock: typeof v.stock === 'number' ? v.stock : parseInt(v.stock) || 0,
      salePrice: v.salePrice ? (typeof v.salePrice === 'number' ? v.salePrice : parseFloat(v.salePrice)) : undefined,
    })) : [],
    basePrice: typeof product.basePrice === 'number' ? product.basePrice : parseFloat(product.basePrice) || 0,
    category: product.category || '',
    subCategory: product.subCategory || '',
    status: product.status || 'active'
  });
};
  const handleEditFormChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleVariationChange = (variationIndex, field, value) => {
  setEditForm(prev => ({
    ...prev,
    variations: prev.variations.map((variation, index) => 
      index === variationIndex 
        ? { 
            ...variation, 
            [field]: field === 'stock' 
              ? (parseInt(value) || 0)
              : field === 'price' || field === 'salePrice'
              ? (parseFloat(value) || (field === 'salePrice' ? undefined : 0))
              : field === 'isActive'
              ? value
              : value
          }
        : variation
    )
  }));
};

  const calculateTotalStock = (variations) => {
    if (!variations || !Array.isArray(variations)) return 0;
    return variations.reduce((sum, v) => sum + (parseInt(v.stock) || 0), 0);
  };

  const calculatePriceRange = (variations) => {
    if (!variations || !Array.isArray(variations) || variations.length === 0) return null;
    const prices = variations.map(v => v.salePrice || v.price).filter(p => p && p > 0);
    if (prices.length === 0) return null;
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
  };

const saveProductChanges = async (productId) => {
  try {
    setSaving(true);
    
    // Validate required fields
    if (!editForm.name?.trim()) {
      showError("Product name is required");
      return;
    }
    if (!editForm.category) {
      showError("Category is required");
      return;
    }
    if (!editForm.basePrice || editForm.basePrice <= 0) {
      showError("Valid base price is required");
      return;
    }

    // Prepare the update data
    const updateData = {
      id: productId,
      name: editForm.name.trim(),
      description: editForm.description?.trim() || '',
      category: editForm.category,
      subCategory: editForm.subCategory || '',
      basePrice: parseFloat(editForm.basePrice),
      status: editForm.status,
    };

    // Always send variations if they exist
    if (editForm.variations && Array.isArray(editForm.variations)) {
      updateData.variations = editForm.variations.map(v => ({
        color: v.color,
        length: v.length,
        price: parseFloat(v.price) || 0,
        stock: parseInt(v.stock) || 0,
        salePrice: v.salePrice ? parseFloat(v.salePrice) : undefined,
        isActive: v.isActive !== false,
      }));
    }

    console.log("Sending update data:", updateData);

    const response = await axios.put(
      `${backendUrl}/api/product/update`,
      updateData,
      { 
        timeout: 15000,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    if (response.data.success) {
      const updatedProduct = response.data.data;
      
      // Force update the list with the new data
      setList(prev => prev.map(item =>
        item._id === productId ? { 
          ...item, 
          ...updatedProduct,
          // Ensure these calculated fields are included
          totalStock: updatedProduct.totalStock || calculateTotalStock(updatedProduct.variations),
          priceRange: updatedProduct.priceRange || calculatePriceRange(updatedProduct.variations)
        } : item
      ));
      
      setEditingProduct(null);
      setEditForm({});
      setError(null);
    toast.success(response.data.message || "Product updated successfully");

      
      await fetchList(pagination.currentPage);
      
    } else {
      throw new Error(response.data.message);
      toast.error(response.data.message || "Failed to update product");
    }
  } catch (error) {
    console.error('Save error:', error);
    showError(error.response?.data?.message || "Failed to update product");
  } finally {
    setSaving(false);
  }
};

  const cancelEdit = () => {
    setEditingProduct(null);
    setEditForm({});
    setError(null); // Clear errors on cancel
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      // Reset subcategory when category changes
      ...(key === 'category' ? { subCategory: '' } : {})
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      subCategory: '',
      minPrice: '',
      maxPrice: '',
      inStock: '',
      status: 'active',
      sortBy: 'date',
      sortOrder: 'desc'
    });
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      fetchList(page);
    }
  };

  // Error display helper
  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(null), 5000); // Auto-clear errors after 5 seconds
  };

  useEffect(() => {
    fetchList();
  }, []);

  // Auto-search when filters change (with debounce effect)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (filters.search !== '' || Object.values(filters).some(v => v !== '' && v !== 'active' && v !== 'date' && v !== 'desc')) {
        fetchList(1);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [filters]);

  if (loading && list.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-gray-600" />
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className=" md:ml-20 bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Error Display */}
      {error && (
        <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
              <span className="text-sm text-red-600">{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-500 hover:text-red-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">All Products</h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {pagination.totalProducts} items
            </span>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  placeholder="Search products..."
                  className="pl-10 pr-3 py-2 w-full text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                <option value="">All Categories</option>
                {Object.keys(categories).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Subcategory */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory</label>
              <select
                value={filters.subCategory}
                onChange={(e) => handleFilterChange('subCategory', e.target.value)}
                className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
                disabled={!filters.category}
              >
                <option value="">All Subcategories</option>
                {filters.category && categories[filters.category]?.map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  placeholder="Min"
                  min="0"
                  step="0.01"
                  className="w-full text-sm border border-gray-300 rounded-md px-2 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  placeholder="Max"
                  min="0"
                  step="0.01"
                  className="w-full text-sm border border-gray-300 rounded-md px-2 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
              </div>
            </div>

            {/* Stock Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock Status</label>
              <select
                value={filters.inStock}
                onChange={(e) => handleFilterChange('inStock', e.target.value)}
                className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                <option value="">All Products</option>
                <option value="true">In Stock</option>
                <option value="false">Out of Stock</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
              <div className="flex gap-2">
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="flex-1 text-sm border border-gray-300 rounded-md px-2 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  <option value="date">Date</option>
                  <option value="name">Name</option>
                  <option value="basePrice">Price</option>
                  <option value="views">Views</option>
                </select>
                <select
                  value={filters.sortOrder}
                  onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                  className="w-20 text-sm border border-gray-300 rounded-md px-2 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  <option value="desc">↓</option>
                  <option value="asc">↑</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {loading && list.length > 0 && (
          <div className="flex justify-center mb-4">
            <Loader2 className="w-6 h-6 animate-spin text-gray-600" />
          </div>
        )}

        {list.length === 0 && !loading ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500">
              {Object.values(filters).some(v => v !== '' && v !== 'active' && v !== 'date' && v !== 'desc')
                ? "Try adjusting your filters or search terms."
                : "Add some products to get started."
              }
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table Header */}
            <div className="hidden lg:grid grid-cols-[80px_1fr_120px_100px_100px_100px_120px] gap-4 items-center py-3 px-4 bg-gray-50 rounded-t-lg border-b border-gray-200">
              <span className="text-sm font-semibold text-gray-700">Image</span>
              <span className="text-sm font-semibold text-gray-700">Product Name</span>
              <span className="text-sm font-semibold text-gray-700">Category</span>
              <span className="text-sm font-semibold text-gray-700">Price</span>
              <span className="text-sm font-semibold text-gray-700 text-center">Stock</span>
              <span className="text-sm font-semibold text-gray-700 text-center">Status</span>
              <span className="text-sm font-semibold text-gray-700 text-center">Actions</span>
            </div>

            {/* Product List */}
            <div className="divide-y divide-gray-200">
              {list.map((item) => (
                <React.Fragment key={item._id}>
                  <div className="lg:grid lg:grid-cols-[80px_1fr_120px_100px_100px_100px_120px] lg:gap-4 lg:items-center py-4 px-4 hover:bg-gray-50 transition-colors">
                    {/* Mobile Layout */}
                    <div className="lg:hidden space-y-3">
                      <div className="flex items-start gap-3">
                        <img
                          className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                          src={item.images?.[0] || "https://via.placeholder.com/64x64?text=No+Image"}
                          alt={item.name}
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/64x64?text=No+Image";
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          {editingProduct === item._id ? (
                            <div className="space-y-3">
                              <input
                                type="text"
                                value={editForm.name}
                                onChange={(e) => handleEditFormChange('name', e.target.value)}
                                className="w-full text-sm border border-gray-300 rounded-md px-2 py-1"
                                placeholder="Product name"
                              />
                              <textarea
                                value={editForm.description}
                                onChange={(e) => handleEditFormChange('description', e.target.value)}
                                className="w-full text-sm border border-gray-300 rounded-md px-2 py-1"
                                rows="2"
                                placeholder="Description"
                              />
                              <select
                                value={editForm.category}
                                onChange={(e) => handleEditFormChange('category', e.target.value)}
                                className="text-sm border border-gray-300 rounded-md px-2 py-1"
                              >
                                <option value="">Select Category</option>
                                {Object.keys(categories).map(cat => (
                                  <option key={cat} value={cat}>{cat}</option>
                                ))}
                              </select>
                              
                              {/* Base Price */}
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Base Price</label>
                                <input
                                  type="number"
                                  value={editForm.basePrice}
                                  onChange={(e) => handleEditFormChange('basePrice', e.target.value)}
                                  className="w-full text-sm border border-gray-300 rounded-md px-2 py-1"
                                  min="0"
                                  step="0.01"
                                />
                              </div>

        
                              {/* Update the variations editing */}
{editForm.variations && editForm.variations.length > 0 && (
  <div>
    <label className="block text-xs font-medium text-gray-700 mb-2">Variations</label>
    <div className="space-y-2 max-h-40 overflow-y-auto">
      {editForm.variations.map((variation, index) => (
        <div key={index} className="p-2 border border-gray-200 rounded-md">
          <div className="grid grid-cols-2 gap-2 text-xs mb-2">
            <div>
              <label className="block text-gray-600">Color</label>
              <input
                type="text"
                value={variation.color || ''}
                onChange={(e) => handleVariationChange(index, 'color', e.target.value)}
                className="w-full text-xs border border-gray-300 rounded px-1 py-1"
                placeholder="Color"
              />
            </div>
            <div>
              <label className="block text-gray-600">Length</label>
              <input
                type="text"
                value={variation.length || ''}
                onChange={(e) => handleVariationChange(index, 'length', e.target.value)}
                className="w-full text-xs border border-gray-300 rounded px-1 py-1"
                placeholder="Length"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div>
              <label className="block text-gray-600">Price</label>
              <input
                type="number"
                value={variation.price || ''}
                onChange={(e) => handleVariationChange(index, 'price', e.target.value)}
                className="w-full text-xs border border-gray-300 rounded px-1 py-1"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-gray-600">Stock</label>
              <input
                type="number"
                value={variation.stock || ''}
                onChange={(e) => handleVariationChange(index, 'stock', e.target.value)}
                className="w-full text-xs border border-gray-300 rounded px-1 py-1"
                min="0"
              />
            </div>
            <div>
              <label className="block text-gray-600">Sale Price</label>
              <input
                type="number"
                value={variation.salePrice || ''}
                onChange={(e) => handleVariationChange(index, 'salePrice', e.target.value)}
                className="w-full text-xs border border-gray-300 rounded px-1 py-1"
                min="0"
                step="0.01"
                placeholder="Optional"
              />
            </div>
          </div>
          <div className="flex items-center mt-1">
            <input
              type="checkbox"
              checked={variation.isActive !== false}
              onChange={(e) => handleVariationChange(index, 'isActive', e.target.checked)}
              className="mr-1"
              id={`variation-active-${index}`}
            />
            <label htmlFor={`variation-active-${index}`} className="text-xs text-gray-600">
              Active
            </label>
          </div>
        </div>
      ))}
    </div>
    {/* <div className="mt-2 text-xs text-gray-600">
      Total Stock: {calculateTotalStock(editForm.variations)} | 
      Price Range: ${calculatePriceRange(editForm.variations)?.min?.toFixed(2) || '0.00'} - ${calculatePriceRange(editForm.variations)?.max?.toFixed(2) || '0.00'}
    </div> */}
  </div>
)}

                              <select
                                value={editForm.status}
                                onChange={(e) => handleEditFormChange('status', e.target.value)}
                                className="text-sm border border-gray-300 rounded-md px-2 py-1"
                              >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                              </select>
                            </div>
                          ) : (
                            <div>
                              <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
                              <p className="text-sm text-gray-500 truncate">{item.description}</p>
                              <div className="flex items-center gap-4 mt-1">
                                <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                                  {item.category}
                                </span>
                                <span className="text-sm font-semibold text-gray-900">
                                  {item.priceRange 
                                    ? `$${item.priceRange.min}${item.priceRange.min !== item.priceRange.max ? ` - $${item.priceRange.max}` : ''}`
                                    : `$${item.basePrice}`
                                  }
                                </span>
                              </div>
                              <div className="mt-2 flex items-center gap-2">
                                <span className={`px-2 py-1 text-xs rounded-md ${item.totalStock > 0
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                  }`}>
                                  {item.totalStock > 0 ? `${item.totalStock} in stock` : 'Out of stock'}
                                </span>
                                <span className={`px-2 py-1 text-xs rounded-md ${item.status === 'active'
                                    ? "bg-gray-100 text-gray-800"
                                    : "bg-gray-100 text-gray-800"
                                  }`}>
                                  {item.status}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col gap-2">
                          {editingProduct === item._id ? (
                            <>
                              <button
                                onClick={() => saveProductChanges(item._id)}
                                disabled={saving}
                                className="flex items-center justify-center w-8 h-8 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-full transition-colors disabled:opacity-50"
                                title="Save changes"
                              >
                                {saving ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Save className="w-4 h-4" />
                                )}
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="flex items-center justify-center w-8 h-8 text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-full transition-colors"
                                title="Cancel edit"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleEditClick(item)}
                                className="flex items-center justify-center w-8 h-8 text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-full transition-colors"
                                title="Edit product"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => removeProduct(item._id)}
                                disabled={removing === item._id}
                                className="flex items-center justify-center w-8 h-8 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50"
                                title="Remove product"
                              >
                                {removing === item._id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Trash2 className="w-4 h-4" />
                                )}
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden lg:contents">
                      <div className="flex items-center">
                        <img
                          className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                          src={item.images?.[0] || "https://via.placeholder.com/48x48?text=No+Image"}
                          alt={item.name}
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/48x48?text=No+Image";
                          }}
                        />
                      </div>

                      <div className="min-w-0">
                        {editingProduct === item._id ? (
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={editForm.name}
                              onChange={(e) => handleEditFormChange('name', e.target.value)}
                              className="w-full text-sm border border-gray-300 rounded-md px-2 py-1"
                              placeholder="Product name"
                            />
                            <textarea
                              value={editForm.description}
                              onChange={(e) => handleEditFormChange('description', e.target.value)}
                              className="w-full text-sm border border-gray-300 rounded-md px-2 py-1"
                              rows="2"
                              placeholder="Description"
                            />
                          </div>
                        ) : (
                          <div>
                            <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
                            <p className="text-sm text-gray-500 truncate">{item.description}</p>
                          </div>
                        )}
                      </div>
                      
                      <div>
                        {editingProduct === item._id ? (
                          <select
                            value={editForm.category}
                            onChange={(e) => handleEditFormChange('category', e.target.value)}
                            className="w-full text-sm border border-gray-300 rounded-md px-2 py-1"
                          >
                            <option value="">Select Category</option>
                            {Object.keys(categories).map(cat => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                        ) : (
                          <div className="text-sm text-gray-600">{item.category}</div>
                        )}
                      </div>
                      
                      <div>
                        {editingProduct === item._id ? (
                          <input
                            type="number"
                            value={editForm.basePrice}
                            onChange={(e) => handleEditFormChange('basePrice', e.target.value)}
                            className="w-full text-sm border border-gray-300 rounded-md px-2 py-1"
                            min="0"
                            step="0.01"
                          />
                        ) : (
                          <div className="text-sm font-semibold text-gray-900">
                            {item.priceRange 
                              ? `${item.priceRange.min}${item.priceRange.min !== item.priceRange.max ? ` - ${item.priceRange.max}` : ''}`
                              : `${item.basePrice}`
                            }
                          </div>
                        )}
                      </div>
                      
                       <div className="flex justify-center">
    {editingProduct === item._id ? (
      <div className="w-full space-y-2">
        {/* Base Stock Field (for simple products) */}
        {(!editForm.variations || editForm.variations.length === 0) ? (
          <input
            type="number"
            value={editForm.totalStock || 0}
            onChange={(e) => handleEditFormChange('totalStock', e.target.value)}
            className="w-full text-sm border border-gray-300 rounded-md px-2 py-1"
            min="0"
          />
        ) : (
          <div className="text-xs text-center text-gray-500">
            Auto: {calculateTotalStock(editForm.variations)}
            <br />
            <button
              type="button"
              onClick={() => {
                // Show variations modal or expand section
                const variationsSection = document.getElementById(`variations-${item._id}`);
                if (variationsSection) {
                  variationsSection.classList.toggle('hidden');
                }
              }}
              className="text-gray-500 hover:text-gray-700 mt-1"
            >
              Edit Variations
            </button>
          </div>
        )}
      </div>
    ) : (
      <span className={`px-2 py-1 text-xs rounded-md ${item.totalStock > 0
          ? "bg-green-100 text-green-800"
          : "bg-red-100 text-red-800"
        }`}>
        {item.totalStock > 0 ? `${item.totalStock} in stock` : 'Out of stock'}
      </span>
    )}
  </div>
                      <div className="flex justify-center">
                        {editingProduct === item._id ? (
                          <select
                            value={editForm.status}
                            onChange={(e) => handleEditFormChange('status', e.target.value)}
                            className="text-sm border border-gray-300 rounded-md px-2 py-1"
                          >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                          </select>
                        ) : (
                          <span className={`px-2 py-1 text-xs rounded-md ${item.status === 'active'
                              ? "bg-gray-100 text-gray-800"
                              : "bg-gray-100 text-gray-800"
                            }`}>
                            {item.status}
                          </span>
                        )}
                      </div>



{editingProduct === item._id && editForm.variations && editForm.variations.length > 0 && (
  <div className="hidden lg:block col-span-7 mt-4 p-4 bg-gray-50 rounded-lg border">
    <h4 className="text-sm font-medium text-gray-700 mb-3">Edit Variations</h4>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-60 overflow-y-auto">
      {editForm.variations.map((variation, index) => (
        <div key={index} className="p-3 border border-gray-200 rounded-md bg-white">
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Color</label>
              <input
                type="text"
                value={variation.color || ''}
                onChange={(e) => handleVariationChange(index, 'color', e.target.value)}
                className="w-full text-sm border border-gray-300 rounded px-2 py-1"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Length</label>
              <input
                type="text"
                value={variation.length || ''}
                onChange={(e) => handleVariationChange(index, 'length', e.target.value)}
                className="w-full text-sm border border-gray-300 rounded px-2 py-1"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Price</label>
              <input
                type="number"
                value={variation.price || ''}
                onChange={(e) => handleVariationChange(index, 'price', e.target.value)}
                className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Stock</label>
              <input
                type="number"
                value={variation.stock || ''}
                onChange={(e) => handleVariationChange(index, 'stock', e.target.value)}
                className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                min="0"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Sale Price</label>
              <input
                type="number"
                value={variation.salePrice || ''}
                onChange={(e) => handleVariationChange(index, 'salePrice', e.target.value)}
                className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                min="0"
                step="0.01"
                placeholder="Optional"
              />
            </div>
          </div>
          <div className="flex items-center mt-2">
            <input
              type="checkbox"
              checked={variation.isActive !== false}
              onChange={(e) => handleVariationChange(index, 'isActive', e.target.checked)}
              className="mr-2"
              id={`desktop-variation-active-${index}`}
            />
            <label htmlFor={`desktop-variation-active-${index}`} className="text-xs text-gray-600">
              Active Variation
            </label>
          </div>
        </div>
      ))}
    </div>
    <div className="mt-3 text-sm text-gray-600">
      Total Stock: <strong>{calculateTotalStock(editForm.variations)}</strong> | 
      Price Range: <strong>${calculatePriceRange(editForm.variations)?.min?.toFixed(2) || '0.00'} - ${calculatePriceRange(editForm.variations)?.max?.toFixed(2) || '0.00'}</strong>
    </div>
  </div>
)}

                      
                      <div className="flex justify-center gap-2">
                        {editingProduct === item._id ? (
                          <>
                            <button
                              onClick={() => saveProductChanges(item._id)}
                              disabled={saving}
                              className="flex items-center justify-center w-8 h-8 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-full transition-colors disabled:opacity-50"
                              title="Save changes"
                            >
                              {saving ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Save className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="flex items-center justify-center w-8 h-8 text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-full transition-colors"
                              title="Cancel edit"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEditClick(item)}
                              className="flex items-center justify-center w-8 h-8 text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-full transition-colors"
                              title="Edit product"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => removeProduct(item._id)}
                              disabled={removing === item._id}
                              className="flex items-center justify-center w-8 h-8 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50"
                              title="Remove product"
                            >
                              {removing === item._id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 px-4">
                <div className="text-sm text-gray-500">
                  Showing page {pagination.currentPage} of {pagination.totalPages}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={!pagination.hasPrevPage || loading}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  
                  {/* Page numbers for better UX */}
                  {pagination.totalPages <= 7 ? (
                    // Show all pages if 7 or fewer
                    Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        disabled={loading}
                        className={`px-3 py-1 text-sm border border-gray-300 rounded-md transition-colors ${
                          pagination.currentPage === page
                            ? 'bg-gray-500 text-white border-gray-500'
                            : 'hover:bg-gray-50'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {page}
                      </button>
                    ))
                  ) : (
                    // Show ellipsis for many pages
                    <>
                      {pagination.currentPage > 3 && (
                        <>
                          <button
                            onClick={() => handlePageChange(1)}
                            disabled={loading}
                            className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            1
                          </button>
                          {pagination.currentPage > 4 && <span className="px-2 text-gray-500">...</span>}
                        </>
                      )}
                      
                      {Array.from(
                        { length: Math.min(5, pagination.totalPages) }, 
                        (_, i) => Math.max(1, Math.min(pagination.currentPage - 2 + i, pagination.totalPages))
                      ).map(page => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          disabled={loading}
                          className={`px-3 py-1 text-sm border border-gray-300 rounded-md transition-colors ${
                            pagination.currentPage === page
                              ? 'bg-gray-500 text-white border-gray-500'
                              : 'hover:bg-gray-50'
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {page}
                        </button>
                      ))}
                      
                      {pagination.currentPage < pagination.totalPages - 2 && (
                        <>
                          {pagination.currentPage < pagination.totalPages - 3 && <span className="px-2 text-gray-500">...</span>}
                          <button
                            onClick={() => handlePageChange(pagination.totalPages)}
                            disabled={loading}
                            className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {pagination.totalPages}
                          </button>
                        </>
                      )}
                    </>
                  )}
                  
                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={!pagination.hasNextPage || loading}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default List;