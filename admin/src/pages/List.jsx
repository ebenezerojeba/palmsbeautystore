// import React, { useEffect, useState } from "react";
// import { backendUrl } from "../App";
// import { toast } from "react-toastify";
// import axios from "axios";


// const List = ({ token }) => {
//   const [list, setList] = useState([]);
  
//   const fetchList = async () => {
//     try {
//       const response = await axios.get(backendUrl + "api/product/list");
//       if (response.data.success) {
//         setList(response.data.products);
//       } else {
//         toast.error(response.data.message);
//       }
//     } catch (error) {
//       console.log(error);
//       toast.error(error.message);
//     }
//   };

//   const removeProduct = async (id) => {
//     try {
//       const response = await axios.post(
//         backendUrl + "api/product/remove",
//         { id },
//         { headers: { token } }
//       );
//       if (response.data.success) {
//         toast.success(response.data.message);
//         await fetchList();
//       } else {
//         toast.error(error.messafe);
//       }
//     } catch (error) {
//       console.log(error);
//       toast.error(response.data.message);
//     }
//   };
//   useEffect(() => {
//     fetchList();
//   }, []);
//   return (
//     <>
//       <p className="mb-2">All Products List</p>
//       <div className="flex flex-col gap-2">
//         {/* List Table Title */}
//         <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100">
//           <b>Image</b>
//           <b>Name</b>
//           <b>Category</b>
//           <b>Price</b>
//           <b className="text-center">Action</b>
//         </div>
//         {/* Product list */}
//         {list.map((item, index) => (
//           <div
//             key={index}
//             className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm"
//           >
//             <img className="w-12" src={item.image[0]} alt="" />
//             <p>{item.name}</p>
//             <p>{item.category}</p>
//             <p className="font-bold">{item.price}</p>
//             <p
//               onClick={() => removeProduct(item._id)}
//               className="text-right md:text-center cursor-pointer text-lg"
//             >
//               X
//             </p>
//           </div>
//         ))}
//       </div>
//     </>
//   );
// };

// export default List;





// import React, { useEffect, useState } from "react";
// import { backendUrl } from "../App";
// import { toast } from "react-toastify";
// import axios from "axios";
// // import { FiTrash2, FiEdit } from "react-icons/fi";
// import { Edit2, Loader, Trash } from "lucide-react";
// // import Loader from "./Loader"; // Assuming you have a Loader component

// const List = ({ token }) => {
//   const [list, setList] = useState([]);
//   const [loading, setLoading] = useState(true);
  
//   const fetchList = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(backendUrl + "api/product/list");
//       if (response.data.success) {
//         setList(response.data.products);
//       } else {
//         toast.error(response.data.message);
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const removeProduct = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this product?")) return;
    
//     try {
//       const response = await axios.post(
//         backendUrl + "api/product/remove",
//         { id },
//         { headers: { token } }
//       );
//       if (response.data.success) {
//         toast.success(response.data.message);
//         await fetchList();
//       } else {
//         toast.error(response.data.message);
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error(error.response?.data?.message || "Failed to delete product");
//     }
//   };

//   useEffect(() => {
//     fetchList();
//   }, []);

//   if (loading) return <Loader />;

//   return (
//     <div className="container mx-auto px-4 py-6">
//       <div className="bg-white rounded-lg shadow-md overflow-hidden">
//         <div className="p-6 border-b">
//           <h2 className="text-2xl font-semibold text-gray-800">Product Inventory</h2>
//           <p className="text-gray-600 mt-1">Manage your product listings</p>
//         </div>
        
//         {/* List Table */}
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Image
//                 </th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Name
//                 </th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Category
//                 </th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Price
//                 </th>
//                 <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {list.length > 0 ? (
//                 list.map((item) => (
//                   <tr key={item._id} className="hover:bg-gray-50 transition-colors">
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex-shrink-0 h-10 w-10">
//                         <img className="h-10 w-10 rounded-md object-cover" src={item.image[0]} alt={item.name} />
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm font-medium text-gray-900">{item.name}</div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm text-gray-500 capitalize">{item.category}</div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm font-semibold text-gray-900">
//                         ${parseFloat(item.price).toFixed(2)}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                       <button
//                         onClick={() => removeProduct(item._id)}
//                         className="text-red-600 hover:text-red-900 mr-4"
//                         title="Delete"
//                       >
//                         <Trash size={18} />
//                       </button>
//                       <button
//                         className="text-blue-600 hover:text-blue-900"
//                         title="Edit"
//                         onClick={() => {/* Add edit functionality */}}
//                       >
//                         <Edit2 size={18} />
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
//                     No products found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
        
//         {/* Pagination would go here */}
//         <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
//           <div className="text-sm text-gray-500">
//             Showing <span className="font-medium">1</span> to <span className="font-medium">{list.length}</span> of{' '}
//             <span className="font-medium">{list.length}</span> results
//           </div>
//           {/* Pagination controls would go here */}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default List;


import React, { useEffect, useState } from "react";
import { Trash2, Package, AlertCircle, Loader2 } from "lucide-react";
import axios from 'axios'
import { useContext } from "react";
import { AdminContexts } from "../context/AdminContexts";
// Mock data for demonstration
// const backendUrl = 'http://localhost:3000/'
const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(null);
  const [error, setError] = useState(null);
  const { backendUrl } = useContext(AdminContexts);

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
        backendUrl + "api/product/remove",
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

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">All Products</h2>
          </div>
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {list.length} items
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {list.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500">Add some products to get started.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table Header */}
            <div className="hidden lg:grid grid-cols-[80px_1fr_120px_100px_80px] gap-4 items-center py-3 px-4 bg-gray-50 rounded-t-lg border-b border-gray-200">
              <span className="text-sm font-semibold text-gray-700">Image</span>
              <span className="text-sm font-semibold text-gray-700">Product Name</span>
              <span className="text-sm font-semibold text-gray-700">Category</span>
              <span className="text-sm font-semibold text-gray-700">Price</span>
              <span className="text-sm font-semibold text-gray-700 text-center">Action</span>
            </div>

            {/* Product List */}
            <div className="divide-y divide-gray-200">
              {list.map((item, index) => (
                <div
                  key={item._id}
                  className="lg:grid lg:grid-cols-[80px_1fr_120px_100px_80px] lg:gap-4 lg:items-center py-4 px-4 hover:bg-gray-50 transition-colors"
                >
                  {/* Mobile Layout */}
                  <div className="lg:hidden space-y-3">
                    <div className="flex items-start gap-3">
                      <img
                        className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                        src={item.image[0]}
                        alt={item.name}
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/64x64?text=No+Image";
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                            {item.category}
                          </span>
                          <span className="text-lg font-bold text-gray-900">{item.price}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeProduct(item._id)}
                        disabled={removing === item._id}
                        className="flex items-center justify-center w-8 h-8 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {removing === item._id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden lg:contents">
                    <img
                      className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                      src={item.image[0]}
                      alt={item.name}
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/64x64?text=No+Image";
                      }}
                    />
                    <div className="min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
                    </div>
                    <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded text-center">
                      {item.category}
                    </span>
                    <span className="font-bold text-gray-900">{item.price}</span>
                    <div className="flex justify-center">
                      <button
                        onClick={() => removeProduct(item._id)}
                        disabled={removing === item._id}
                        className="flex items-center justify-center w-8 h-8 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
          </>
        )}
      </div>
    </div>
  );
};

export default List;