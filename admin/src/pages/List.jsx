import React, { useEffect, useState } from "react";
import { Trash2, Package, AlertCircle, Loader2, X } from "lucide-react";
import axios from 'axios'

// Mock data for demonstration
const backendUrl = 'https://palmsbeautystore-backend.onrender.com';
const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(null);
  const [error, setError] = useState(null);
  const [updatingStock, setUpdatingStock] = useState(null);
  const fetchList = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      setList(list);
      
      // Uncomment and modify this for actual API call:
      const response = await axios.get(backendUrl + "/api/product/list");
      if (response.data.success) {
        setList(response.data.products);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.log(error);
      setError(error.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const removeProduct = async (id) => {
    try {
      setRemoving(id);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setList(prevList => prevList.filter(item => item._id !== id));
      
      // Uncomment and modify this for actual API call:
      const response = await axios.post(
        backendUrl + "/api/product/remove",
        { id },
        { headers: { token } }
      );
      if (response.data.success) {
        await fetchList();
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.log(error);
      setError(error.message || "Failed to remove product");
    } finally {
      setRemoving(null);
    }
  };

    // THIS IS WHERE handleStockChange BELONGS!
  const handleStockChange = async (productId, inStock) => {
    try {
      setUpdatingStock(productId);
      const response = await axios.post(
        `${backendUrl}/api/product/update`,
        { 
          id: productId,
          updates: { inStock } 
        },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success("Stock status updated");
        setList(prev => prev.map(item => 
          item._id === productId ? { ...item, inStock } : item
        ));
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update stock");
    } finally {
      setUpdatingStock(null);
    }
  };


  useEffect(() => {
    fetchList();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-600" />
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center bg-red-50 border border-red-200 rounded-lg p-6">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-2" />
          <h3 className="text-lg font-semibold text-red-800 mb-1">Error</h3>
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchList}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // return (
  //   <div className="bg-white rounded-lg shadow-sm border border-gray-200">
  //     {/* Header */}
  //     <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
  //       <div className="flex items-center justify-between">
  //         <div className="flex items-center gap-2">
  //           <Package className="w-5 h-5 text-gray-600" />
  //           <h2 className="text-xl font-semibold text-gray-900">All Products</h2>
  //         </div>
  //         <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
  //           {list.length} items
  //         </span>
  //       </div>
  //     </div>

  //     {/* Content */}
  //     <div className="p-6">
  //       {list.length === 0 ? (
  //         <div className="text-center py-12">
  //           <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
  //           <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
  //           <p className="text-gray-500">Add some products to get started.</p>
  //         </div>
  //       ) : (
  //         <>
  //           {/* Desktop Table Header */}
  //           <div className="hidden lg:grid grid-cols-[80px_1fr_120px_100px_80px] gap-4 items-center py-3 px-4 bg-gray-50 rounded-t-lg border-b border-gray-200">
  //             <span className="text-sm font-semibold text-gray-700">Image</span>
  //             <span className="text-sm font-semibold text-gray-700">Product Name</span>
  //             <span className="text-sm font-semibold text-gray-700">Category</span>
  //             <span className="text-sm font-semibold text-gray-700">Price</span>
  //             <span className="text-sm font-semibold text-gray-700 text-center">Action</span>
  //           </div>

  //           {/* Product List */}
  //           <div className="divide-y divide-gray-200">
  //             {list.map((item, index) => (
  //               <div
  //                 key={item._id}
  //                 className="lg:grid lg:grid-cols-[80px_1fr_120px_100px_80px] lg:gap-4 lg:items-center py-4 px-4 hover:bg-gray-50 transition-colors"
  //               >
  //                 {/* Mobile Layout */}
  //                 <div className="lg:hidden space-y-3">
  //                   <div className="flex items-start gap-3">
  //                     <img
  //                       className="w-16 h-16 rounded-lg object-cover border border-gray-200"
  //                       src={item.image[0]}
  //                       alt={item.name}
  //                       onError={(e) => {
  //                         e.target.src = "https://via.placeholder.com/64x64?text=No+Image";
  //                       }}
  //                     />
  //                     <div className="flex-1 min-w-0">
  //                       <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
  //                       <div className="flex items-center gap-4 mt-1">
  //                         <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
  //                           {item.category}
  //                         </span>
  //                         <span className="text-lg font-bold text-gray-900">{item.price}</span>
  //                       </div>
  //                     </div>
  //                     <button
  //                       onClick={() => removeProduct(item._id)}
  //                       disabled={removing === item._id}
  //                       className="flex items-center justify-center w-8 h-8 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
  //                     >
  //                       {removing === item._id ? (
  //                         <Loader2 className="w-4 h-4 animate-spin" />
  //                       ) : (
  //                         <Trash2 className="w-4 h-4" />
  //                       )}
  //                     </button>
  //                   </div>
  //                 </div>

  //                 {/* Desktop Layout */}
  //                 <div className="hidden lg:contents">
  //                   <img
  //                     className="w-16 h-16 rounded-lg object-cover border border-gray-200"
  //                     src={item.image[0]}
  //                     alt={item.name}
  //                     onError={(e) => {
  //                       e.target.src = "https://via.placeholder.com/64x64?text=No+Image";
  //                     }}
  //                   />
  //                   <div className="min-w-0">
  //                     <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
  //                   </div>
  //                   <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded text-center">
  //                     {item.category}
  //                   </span>
  //                   <span className="font-bold text-gray-900">{item.price}</span>
  //                   <div className="flex justify-center">
  //                     <button
  //                       onClick={() => removeProduct(item._id)}
  //                       disabled={removing === item._id}
  //                       className="flex items-center justify-center w-8 h-8 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
  //                       title="Remove product"
  //                     >
  //                       {removing === item._id ? (
  //                         <Loader2 className="w-4 h-4 animate-spin" />
  //                       ) : (
  //                         <Trash2 className="w-4 h-4" />
  //                       )}
  //                     </button>
  //                   </div>
  //                 </div>
  //               </div>
  //             ))}
  //           </div>
  //         </>
  //       )}
  //     </div>
  //   </div>
  // );

  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header remains the same... */}

      {/* Updated Table Header with Stock Status */}
      <div className="hidden lg:grid grid-cols-[80px_1fr_120px_100px_100px_80px] gap-4 items-center py-3 px-4 bg-gray-50 rounded-t-lg border-b border-gray-200">
        <span className="text-sm font-semibold text-gray-700">Image</span>
        <span className="text-sm font-semibold text-gray-700">Product Name</span>
        <span className="text-sm font-semibold text-gray-700">Category</span>
        <span className="text-sm font-semibold text-gray-700">Price</span>
        <span className="text-sm font-semibold text-gray-700 text-center">Stock</span>
        <span className="text-sm font-semibold text-gray-700 text-center">Action</span>
      </div>

      {/* Product List */}
      <div className="divide-y divide-gray-200">
        {list.map((item) => (
          <div
            key={item._id}
            className="lg:grid lg:grid-cols-[80px_1fr_120px_100px_100px_80px] lg:gap-4 lg:items-center py-4 px-4 hover:bg-gray-50 transition-colors"
          >
            {/* Mobile Layout (updated with stock toggle) */}
            <div className="lg:hidden space-y-3">
              <div className="flex items-start gap-3">
                <img
                  className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                  src={item.image?.[0] || "https://via.placeholder.com/64x64?text=No+Image"}
                  alt={item.name}
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                      {item.category}
                    </span>
                    <span className="text-lg font-bold text-gray-900">${item.price}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      onClick={() => handleStockChange(item._id, !item.inStock)}
                      disabled={updatingStock === item._id}
                      className={`px-2 py-1 text-xs rounded-md flex items-center gap-1 ${
                        item.inStock 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {updatingStock === item._id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : item.inStock ? (
                        <>
                          <Check className="w-3 h-3" /> In Stock
                        </>
                      ) : (
                        <>
                          <X className="w-3 h-3" /> Out of Stock
                        </>
                      )}
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => removeProduct(item._id)}
                  disabled={removing === item._id}
                  className="flex items-center justify-center w-8 h-8 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50"
                >
                  {removing === item._id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Desktop Layout (updated with stock toggle) */}
            <div className="hidden lg:contents">
              <img
                className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                src={item.image?.[0] || "https://via.placeholder.com/64x64?text=No+Image"}
                alt={item.name}
              />
              <div className="min-w-0">
                <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
                <p className="text-sm text-gray-500 truncate">{item.description}</p>
              </div>
              <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded text-center">
                {item.category}
              </span>
              <span className="font-bold text-gray-900">${item.price}</span>
              <div className="flex justify-center">
                <button
                  onClick={() => handleStockChange(item._id, !item.inStock)}
                  disabled={updatingStock === item._id}
                  className={`px-3 py-1 text-sm rounded-md flex items-center gap-1 ${
                    item.inStock 
                      ? "bg-green-100 text-green-800" 
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {updatingStock === item._id ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : item.inStock ? (
                    <>
                      <Check className="w-3 h-3" /> In Stock
                    </>
                  ) : (
                    <>
                      <X className="w-3 h-3" /> Out
                    </>
                  )}
                </button>
              </div>
              <div className="flex justify-center">
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
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


export default List;