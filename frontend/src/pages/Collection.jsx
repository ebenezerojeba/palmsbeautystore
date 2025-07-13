// import React, { useContext, useEffect, useState } from "react";
// import { assets } from "../assets/assets";
// import { ShopContext } from "../context/ShopContext";
// import ProductItem from "../components/ProductItem";
// import { categories } from "../constants/categories";

// const Collection = () => {
//   const { products, search, showSearch } = useContext(ShopContext);
//   const [showFilter, setShowFilter] = useState(false);
//   const [filterProducts, setFilterProducts] = useState([]);
//   const [category, setCategory] = useState([]);
//   const [subCategory, setSubCategory] = useState([]);
//   const [sortType, setSortType] = useState("relevant");
  
//   // Pagination
//   const [currentPage, setCurrentPage] = useState(1);
//   const [productsPerPage] = useState(8);

//   const toggleCategory = (e) => {
//     const value = e.target.value;
//     setCategory((prev) =>
//       prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value]
//     );
//   };

//   const toggleSubCategory = (e) => {
//     const value = e.target.value;
//     setSubCategory((prev) =>
//       prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value]
//     );
//   };

// const applyFilter = () => {
//   let filtered = products.slice();

//   const hasSearch = showSearch && search.trim().length > 0;
//   const hasCategory = category.length > 0;
//   const hasSubCategory = subCategory.length > 0;

//   // Apply search filter if active
//   if (hasSearch) {
//     filtered = filtered.filter((item) =>
//       item.name.toLowerCase().includes(search.toLowerCase())
//     );
//   }

//   // Apply category filter if active
//   if (hasCategory) {
//     filtered = filtered.filter((item) => category.includes(item.category));
//   }

//   // Apply subcategory filter if active
//   if (hasSubCategory) {
//     filtered = filtered.filter((item) => subCategory.includes(item.subCategory));
//   }

//   // Always set filtered products (even if no filters are active, show all products)
//   setFilterProducts(filtered);
//   setCurrentPage(1); // Reset to first page after filtering
// };


//   const sortProduct = () => {
//     const sorted = [...filterProducts];
//     if (sortType === "low-high") {
//       sorted.sort((a, b) => a.price - b.price);
//     } else if (sortType === "high-low") {
//       sorted.sort((a, b) => b.price - a.price);
//     }
//     setFilterProducts(sorted);
//   };

//   useEffect(() => {
//     applyFilter();
//   }, [category, subCategory, search, showSearch, products]);

//   useEffect(() => {
//     sortProduct();
//   }, [sortType]);

//   // Pagination logic
//   const indexOfLastProduct = currentPage * productsPerPage;
//   const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
//   const currentProducts = filterProducts.slice(indexOfFirstProduct, indexOfLastProduct);
//   const totalPages = Math.ceil(filterProducts.length / productsPerPage);
//   const handlePageChange = (page) => setCurrentPage(page);

//   // Unique subcategories
//   const uniqueSubCategories = Array.from(new Set(Object.values(categories).flat()));

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       {/* Header Section */}
//       <div className="mb-8">
//         <div className="flex items-center justify-between mb-6">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900 mb-2">All Products</h1>
//             <p className="text-gray-600">
//               Showing {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, filterProducts.length)} of {filterProducts.length} products
//             </p>
//           </div>
          
//           {/* Mobile Filter Toggle */}
//           <div className="lg:hidden">
//             <button
//               onClick={() => setShowFilter(!showFilter)}
//               className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
//             >
//               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
//               </svg>
//               Filters
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="flex flex-col lg:flex-row gap-8">
//         {/* Sidebar Filters */}
//         <div className={`lg:w-64 ${showFilter ? 'block' : 'hidden lg:block'}`}>
//           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//             <div className="flex items-center justify-between mb-6">
//               <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
//               <button
//                 onClick={() => {
//                   setCategory([]);
//                   setSubCategory([]);
//                   setSortType("relevant");
//                 }}
//                 className="text-sm text-red-600 hover:text-red-700 font-medium"
//               >
//                 Clear All
//               </button>
//             </div>

//             {/* Category Filter */}
//             <div className="mb-6">
//               <h3 className="text-sm font-medium text-gray-900 mb-3">Categories</h3>
//               <div className="space-y-2">
//                 {Object.keys(categories).map((cat) => (
//                   <label key={cat} className="flex items-center hover:bg-gray-50 p-2 rounded cursor-pointer">
//                     <input
//                       type="checkbox"
//                       value={cat}
//                       onChange={toggleCategory}
//                       checked={category.includes(cat)}
//                       className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                     />
//                     <span className="ml-3 text-sm text-gray-700 capitalize">{cat}</span>
//                   </label>
//                 ))}
//               </div>
//             </div>

//             {/* Subcategory Filter */}
//             <div className="mb-6">
//               <h3 className="text-sm font-medium text-gray-900 mb-3">Product Type</h3>
//               <div className="space-y-2">
//                 {uniqueSubCategories.map((sub) => (
//                   <label key={sub} className="flex items-center hover:bg-gray-50 p-2 rounded cursor-pointer">
//                     <input
//                       type="checkbox"
//                       value={sub}
//                       onChange={toggleSubCategory}
//                       checked={subCategory.includes(sub)}
//                       className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                     />
//                     <span className="ml-3 text-sm text-gray-700 capitalize">{sub}</span>
//                   </label>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className="flex-1">
//           {/* Sort and View Options */}
//           <div className="flex items-center justify-between mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
//             <div className="flex items-center gap-4">
//               <span className="text-sm font-medium text-gray-700">Sort by:</span>
//               <select
//                 onChange={(e) => setSortType(e.target.value)}
//                 value={sortType}
//                 className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               >
//                 <option value="relevant">Most Relevant</option>
//                 <option value="low-high">Price: Low to High</option>
//                 <option value="high-low">Price: High to Low</option>
//               </select>
//             </div>
//           </div>

//           {/* Product Grid */}
//           <div className="mb-8">
//             {currentProducts.length === 0 ? (
//               <div className="text-center py-16">
//                 <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
//                   <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                   </svg>
//                 </div>
//                 <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
//                 <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
//                 <button
//                   onClick={() => {
//                     setCategory([]);
//                     setSubCategory([]);
//                     setSortType("relevant");
//                   }}
//                   className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                 >
//                   Clear Filters
//                 </button>
//               </div>
//             ) : (
//               <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
//                 {currentProducts.map((item, index) => (
//                   <ProductItem
//                     key={index}
//                     name={item.name}
//                     id={item._id}
//                     price={item.price}
//                     image={item.image}
//                   />
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Pagination */}
//           {totalPages > 1 && (
//             <div className="flex items-center justify-center space-x-2">
//               <button
//                 onClick={() => handlePageChange(currentPage - 1)}
//                 disabled={currentPage === 1}
//                 className={`px-3 py-2 rounded-md text-sm font-medium ${
//                   currentPage === 1
//                     ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                     : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
//                 }`}
//               >
//                 Previous
//               </button>
              
//               {[...Array(totalPages)].map((_, i) => {
//                 const pageNum = i + 1;
//                 return (
//                   <button
//                     key={i}
//                     onClick={() => handlePageChange(pageNum)}
//                     className={`px-3 py-2 rounded-md text-sm font-medium ${
//                       currentPage === pageNum
//                         ? 'bg-blue-600 text-white'
//                         : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
//                     }`}
//                   >
//                     {pageNum}
//                   </button>
//                 );
//               })}
              
//               <button
//                 onClick={() => handlePageChange(currentPage + 1)}
//                 disabled={currentPage === totalPages}
//                 className={`px-3 py-2 rounded-md text-sm font-medium ${
//                   currentPage === totalPages
//                     ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                     : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
//                 }`}
//               >
//                 Next
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Collection;










































import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "../components/ProductItem";
import { categories } from "../constants/categories";

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState("relevant");
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(8);

  const toggleCategory = (e) => {
    const value = e.target.value;
    setCategory((prev) =>
      prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value]
    );
  };

  const toggleSubCategory = (e) => {
    const value = e.target.value;
    setSubCategory((prev) =>
      prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value]
    );
  };

  const applyFilter = () => {
    // Check if products exist and is not empty
    if (!products || products.length === 0) {
      setFilterProducts([]);
      return;
    }

    let filtered = products.slice();

    const hasSearch = showSearch && search.trim().length > 0;
    const hasCategory = category.length > 0;
    const hasSubCategory = subCategory.length > 0;

    // Apply search filter if active
    if (hasSearch) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply category filter if active
    if (hasCategory) {
      filtered = filtered.filter((item) => category.includes(item.category));
    }

    // Apply subcategory filter if active
    if (hasSubCategory) {
      filtered = filtered.filter((item) => subCategory.includes(item.subCategory));
    }

    // Always set filtered products (even if no filters are active, show all products)
    setFilterProducts(filtered);
    setCurrentPage(1); // Reset to first page after filtering
  };

  const sortProduct = () => {
    const sorted = [...filterProducts];
    if (sortType === "low-high") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortType === "high-low") {
      sorted.sort((a, b) => b.price - a.price);
    }
    setFilterProducts(sorted);
  };

  // Initialize filterProducts with all products when products are loaded
  useEffect(() => {
    if (products && products.length > 0) {
      setFilterProducts(products);
    }
  }, [products]);

  useEffect(() => {
    applyFilter();
  }, [category, subCategory, search, showSearch, products]);

  useEffect(() => {
    sortProduct();
  }, [sortType]);

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filterProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filterProducts.length / productsPerPage);
  const handlePageChange = (page) => setCurrentPage(page);

  // Unique subcategories
  const uniqueSubCategories = Array.from(new Set(Object.values(categories).flat()));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">All Products</h1>
            <p className="text-gray-600">
              Showing {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, filterProducts.length)} of {filterProducts.length} products
            </p>
          </div>
          
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden">
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filters
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className={`lg:w-64 ${showFilter ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
              <button
                onClick={() => {
                  setCategory([]);
                  setSubCategory([]);
                  setSortType("relevant");
                }}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Clear All
              </button>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Categories</h3>
              <div className="space-y-2">
                {Object.keys(categories).map((cat) => (
                  <label key={cat} className="flex items-center hover:bg-gray-50 p-2 rounded cursor-pointer">
                    <input
                      type="checkbox"
                      value={cat}
                      onChange={toggleCategory}
                      checked={category.includes(cat)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-3 text-sm text-gray-700 capitalize">{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Subcategory Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Product Type</h3>
              <div className="space-y-2">
                {uniqueSubCategories.map((sub) => (
                  <label key={sub} className="flex items-center hover:bg-gray-50 p-2 rounded cursor-pointer">
                    <input
                      type="checkbox"
                      value={sub}
                      onChange={toggleSubCategory}
                      checked={subCategory.includes(sub)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-3 text-sm text-gray-700 capitalize">{sub}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Sort and View Options */}
          <div className="flex items-center justify-between mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">Sort by:</span>
              <select
                onChange={(e) => setSortType(e.target.value)}
                value={sortType}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="relevant">Most Relevant</option>
                <option value="low-high">Price: Low to High</option>
                <option value="high-low">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          <div className="mb-8">
            {currentProducts.length === 0 ? (
              <div className="text-center py-16">
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
                <button
                  onClick={() => {
                    setCategory([]);
                    setSubCategory([]);
                    setSortType("relevant");
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {currentProducts.map((item, index) => (
                  <ProductItem
                    key={index}
                    name={item.name}
                    id={item._id}
                    price={item.price}
                    image={item.image}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                Previous
              </button>
              
              {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={i}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Collection;