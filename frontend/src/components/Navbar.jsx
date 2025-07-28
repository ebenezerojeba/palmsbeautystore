
// import React, { useState, useEffect, useContext } from "react";
// import { assets } from "../assets/assets";
// import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
// import { Menu, X, ShoppingCart, ChevronDown } from "lucide-react";
// import { ShopContext } from "../context/ShopContext";
// import { AppContext } from "../context/AppContext";
// import { useRef } from "react";

// const Navbar = () => {
//   const [showMenu, setShowMenu] = useState(false);
//   const { getCartCount } = useContext(ShopContext);
//   const { token, setToken, userData } = useContext(AppContext);
//   const location = useLocation();
//   const navigate = useNavigate();

//   useEffect(() => {
//     setShowMenu(false);
//   }, [location]);

//   useEffect(() => {
//     document.body.style.overflow = showMenu ? "hidden" : "unset";
//     return () => {
//       document.body.style.overflow = "unset";
//     };
//   }, [showMenu]);

//   const toggleMenu = () => {
//     setShowMenu(!showMenu);
//   };

//   const dropdownRef = useRef(null);

// useEffect(() => {
//   function handleClickOutside(event) {
//     if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//       document.getElementById("profile-dropdown")?.classList.add("hidden");
//     }
//   }

//   // Attach listener on mount
//   document.addEventListener("mousedown", handleClickOutside);

//   // Clean up on unmount
//   return () => {
//     document.removeEventListener("mousedown", handleClickOutside);
//   };
// }, []);


//   const logout = () => {
//     setToken(false);
//     localStorage.removeItem("token");
//     navigate("/login");
//   };

//   return (
//     <nav className="bg-gray-900 shadow-sm sticky top-0 z-50">
//       <div className="max-w-7xl mx-auto px-8 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-16">
//           {/* Logo and mobile toggle */}
//           <div className="flex items-center">
//             <button
//               className="md:hidden p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-800 focus:outline-none"
//               onClick={toggleMenu}
//               aria-label="Toggle mobile menu"
//             >
//               {showMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
//             </button>
//             <NavLink
//               to="/"
//               className="flex justify-center md:justify-start flex-shrink-0"
//             >
//               <img
//                 src={assets.plog}
//                 alt="PalmsBeauty Logo"
//                 className="w-32 md:w-48 object-contain cursor-pointer"
//               />
//             </NavLink>
//           </div>

//           {/* Desktop Nav */}
//           <div className="hidden md:flex items-center space-x-8">
//             <ul className="flex items-center space-x-8">
//               <NavLink
//                 to="/"
//                 className={({ isActive }) =>
//                   `text-sm font-medium transition duration-200 ${
//                     isActive
//                       ? "text-white font-semibold"
//                       : "text-gray-300 hover:text-white"
//                   }`
//                 }
//               >
//                 HOME
//               </NavLink>

//               {["ABOUT", "SERVICES", "COLLECTIONS"].map((item, index) => (
//                 <NavLink
//                   key={index}
//                   to={`/${item.toLowerCase()}`}
//                   className={({ isActive }) =>
//                     `text-sm font-medium transition duration-200 ${
//                       isActive
//                         ? "text-white font-semibold"
//                         : "text-gray-300 hover:text-white"
//                     }`
//                   }
//                 >
//                   {item}
//                 </NavLink>
//               ))}
//             </ul>
//           </div>

//           {/* Right side */}
//           <div className="flex items-center space-x-4">
//             {/* Cart Icon */}
//             <Link
//               to="/cart"
//               className="p-2 rounded-full hover:bg-gray-800 transition duration-200 relative"
//               aria-label={`Cart with ${getCartCount()} items`}
//             >
//               <ShoppingCart className="w-5 h-5 text-white" />
//               {getCartCount() > 0 && (
//                 <span className="absolute -top-1 -right-1 bg-white text-gray-900 text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
//                   {getCartCount()}
//                 </span>
//               )}
//             </Link>

//            {/* Profile Dropdown */}
//   {token && userData ? (
//     <div ref={dropdownRef} id="profile-down" className="relative top-full right-0  shadow-lg rounded w-48 z-50">
//       <button 
//         className="flex items-center gap-2 cursor-pointer focus:outline-none"
//         onClick={() => {
//           // Toggle dropdown visibility
//           const dropdown = document.getElementById('profile-dropdown');
//           dropdown.classList.toggle('hidden');
//         }}
//       >
//         <img
//           src={userData.image}
//           alt="Profile"
//           className="w-12 h-12 rounded-full border-2 border-primary object-cover hover:scale-105 transition-transform"
//         />
//         <ChevronDown className="w-4 h-4 text-white" />
//       </button>
      
//       <div 
//         id="profile-dropdown"
//         className="absolute top-full right-0 mt-2 min-w-[160px] bg-white text-gray-700 rounded-lg shadow-md p-3 z-50 hidden"
//       >
//         <p
//           onClick={() => {
//             navigate("/my-profile");
//             document.getElementById('profile-dropdown').classList.add('hidden');
//           }}
//           className="cursor-pointer hover:text-primary py-2 px-2 rounded hover:bg-gray-50 transition-colors"
//         >
//           My Profile
//         </p>
//         <p
//           onClick={() => {
//             navigate("/my-appointments");
//             document.getElementById('profile-dropdown').classList.add('hidden');
//           }}
//           className="cursor-pointer hover:text-primary py-2 px-2 rounded hover:bg-gray-50 transition-colors"
//         >
//           My Appointments
//         </p>
//         <p
//           onClick={() => {
//             navigate("/my-orders");
//             document.getElementById('profile-dropdown').classList.add('hidden');
//           }}
//           className="cursor-pointer hover:text-primary py-2 px-2 rounded hover:bg-gray-50 transition-colors"
//         >
//           My Orders
//         </p>
//         <hr className="my-2" />
//         <p
//           onClick={() => {
//             logout();
//             document.getElementById('profile-dropdown').classList.add('hidden');
//           }}
//           className="cursor-pointer hover:text-red-600 py-2 px-2 rounded hover:bg-red-50 transition-colors"
//         >
//           Logout
//         </p>
//       </div>
//     </div>
//   ) : (
//     <button
//       onClick={() => navigate("/login")}
//       className="bg-primary text-white px-3 md:px-5 py-2 rounded-full font-light hover:bg-primary-dark transition duration-300 text-sm md:text-base"
//     >
//       <span className="hidden sm:inline">Create Account</span>
//       <span className="sm:hidden">Login</span>
//     </button>
//   )}
// </div>
// </div>
// </div>

//       {/* Mobile Menu */}
//       <div className={`md:hidden ${showMenu ? "block" : "hidden"}`}>
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 z-40"
//           onClick={toggleMenu}
//         />

//         <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-gray-900 shadow-lg z-50">
//           <div className="flex items-center justify-between h-16 px-4 sm:px-6 border-b border-gray-800">
//             <img
//               src={assets.plog}
//               alt="PalmsBeauty Logo"
//               className="w-32 md:w-48"
//             />
//             <button
//               className="p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-800"
//               onClick={toggleMenu}
//             >
//               <X className="h-6 w-6" />
//             </button>
//           </div>

//           <div className="px-4 py-6">
//             <nav className="grid gap-6">
//               <NavLink
//                 to="/"
//                 className={({ isActive }) =>
//                   `flex items-center px-3 py-2 rounded-md text-base font-medium transition duration-200 ${
//                     isActive
//                       ? "bg-gray-800 text-white"
//                       : "text-gray-300 hover:text-white hover:bg-gray-800"
//                   }`
//                 }
//                 onClick={toggleMenu}
//               >
//                 HOME
//               </NavLink>

//               {["ABOUT", "SERVICES", "COLLECTIONS"].map((item, index) => (
//                 <NavLink
//                   key={index}
//                   to={`/${item.toLowerCase()}`}
//                   className={({ isActive }) =>
//                     `flex items-center px-3 py-2 rounded-md text-base font-medium transition duration-200 ${
//                       isActive
//                         ? "bg-gray-800 text-white"
//                         : "text-gray-300 hover:text-white hover:bg-gray-800"
//                     }`
//                   }
//                   onClick={toggleMenu}
//                 >
//                   {item}
//                 </NavLink>
//               ))}

//               <div className="pt-4 mt-4 border-t border-gray-800">
//                 <NavLink
//                   to="/services"
//                   className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-gray-900 bg-white hover:bg-gray-100"
//                   onClick={toggleMenu}
//                 >
//                   Book now
//                 </NavLink>
//               </div>
//             </nav>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;




























import React, { useState, useEffect, useContext } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ShoppingCart, ChevronDown } from "lucide-react";
import { ShopContext } from "../context/ShopContext";
import { AppContext } from "../context/AppContext";
import { useRef } from "react";

const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const { getCartCount } = useContext(ShopContext);
  const { token, setToken, userData } = useContext(AppContext);
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    setShowMenu(false);
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = showMenu ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showMenu]);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        document.getElementById("profile-dropdown")?.classList.add("hidden");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const logout = () => {
    setToken(false);
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-gray-900 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo and mobile toggle */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              className="md:hidden p-1.5 sm:p-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-600 transition-all duration-200"
              onClick={toggleMenu}
              aria-label="Toggle mobile menu"
            >
              {showMenu ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
            </button>
            
            <NavLink
              to="/"
              className="flex items-center flex-shrink-0 group"
            >
              <img
                src={assets.plog}
                alt="PalmsBeauty Logo"
                className="w-24 sm:w-32 md:w-40 lg:w-48 h-auto object-contain transition-transform group-hover:scale-105 duration-200"
              />
            </NavLink>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center">
            <div className="flex items-center space-x-1 lg:space-x-2">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `px-3 lg:px-4 py-2 rounded-md text-xs lg:text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "text-white font-semibold bg-gray-800 shadow-sm"
                      : "text-gray-300 hover:text-white hover:bg-gray-700"
                  }`
                }
              >
                HOME
              </NavLink>

              {["ABOUT", "SERVICES", "COLLECTIONS"].map((item, index) => (
                <NavLink
                  key={index}
                  to={`/${item.toLowerCase()}`}
                  className={({ isActive }) =>
                    `px-3 lg:px-4 py-2 rounded-md text-xs lg:text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "text-white font-semibold bg-gray-800 shadow-sm"
                        : "text-gray-300 hover:text-white hover:bg-gray-700"
                    }`
                  }
                >
                  {item}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Shopping Cart */}
            <Link
              to="/cart"
              className="relative p-1.5 sm:p-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-600"
              aria-label={`Cart with ${getCartCount()} items`}
            >
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-gray-900 text-xs w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center rounded-full font-bold shadow-sm">
                  {getCartCount()}
                </span>
              )}
            </Link>

            {/* Profile Section */}
            {token && userData ? (
              <div ref={dropdownRef} className="relative">
                <button 
                  className="flex items-center space-x-1 sm:space-x-2 p-1 rounded-lg hover:bg-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-600"
                  onClick={() => {
                    const dropdown = document.getElementById('profile-dropdown');
                    dropdown?.classList.toggle('hidden');
                  }}
                >
                  <img
                    src={userData.image}
                    alt="Profile"
                    className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full border-2 border-gray-600 object-cover hover:border-gray-400 hover:scale-105 transition-all duration-200"
                  />
                  <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </button>
                
                <div 
                  id="profile-dropdown"
                  className="absolute top-full right-0 mt-2 w-44 sm:w-48 bg-white text-gray-700 rounded-lg shadow-lg border border-gray-200 py-2 z-50 hidden"
                >
                  <div className="px-3 sm:px-4 py-2 border-b border-gray-100">
                    <p className="text-xs sm:text-sm font-medium text-gray-900">My Account</p>
                  </div>
                  
                  <button
                    onClick={() => {
                      navigate("/my-profile");
                      document.getElementById('profile-dropdown')?.classList.add('hidden');
                    }}
                    className="w-full text-left px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                  >
                    My Profile
                  </button>
                  
                  <button
                    onClick={() => {
                      navigate("/my-appointments");
                      document.getElementById('profile-dropdown')?.classList.add('hidden');
                    }}
                    className="w-full text-left px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                  >
                    My Appointments
                  </button>
                  
                  <button
                    onClick={() => {
                      navigate("/my-orders");
                      document.getElementById('profile-dropdown')?.classList.add('hidden');
                    }}
                    className="w-full text-left px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                  >
                    My Orders
                  </button>
                  
                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <button
                      onClick={() => {
                        logout();
                        document.getElementById('profile-dropdown')?.classList.add('hidden');
                      }}
                      className="w-full text-left px-3 sm:px-4 py-2 text-xs sm:text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="bg-primary text-white px-2 sm:px-3 md:px-4 lg:px-5 py-1.5 sm:py-2 rounded-full font-light hover:bg-primary-dark transition-all duration-300 text-xs sm:text-sm md:text-base shadow-sm"
              >
                <span className="hidden sm:inline">Create Account</span>
                <span className="sm:hidden">Login</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {showMenu && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={toggleMenu}
          />

          <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-gray-900 shadow-xl z-50 md:hidden">
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between h-14 sm:h-16 px-3 sm:px-4 border-b border-gray-800">
              <img
                src={assets.plog}
                alt="PalmsBeauty Logo"
                className="w-24 sm:w-32 h-auto object-contain"
              />
              <button
                className="p-1.5 sm:p-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                onClick={toggleMenu}
              >
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </div>

            {/* Mobile Menu Content */}
            <div className="px-3 sm:px-4 py-4 sm:py-6">
              <nav className="space-y-1 sm:space-y-2">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2.5 sm:py-3 rounded-md text-sm sm:text-base font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-gray-800 text-white shadow-sm"
                        : "text-gray-300 hover:text-white hover:bg-gray-800"
                    }`
                  }
                  onClick={toggleMenu}
                >
                  HOME
                </NavLink>

                {["ABOUT", "SERVICES", "COLLECTIONS"].map((item, index) => (
                  <NavLink
                    key={index}
                    to={`/${item.toLowerCase()}`}
                    className={({ isActive }) =>
                      `flex items-center px-3 py-2.5 sm:py-3 rounded-md text-sm sm:text-base font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-gray-800 text-white shadow-sm"
                          : "text-gray-300 hover:text-white hover:bg-gray-800"
                      }`
                    }
                    onClick={toggleMenu}
                  >
                    {item}
                  </NavLink>
                ))}

                {/* Mobile CTA */}
                <div className="pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-gray-800">
                  <NavLink
                    to="/services"
                    className="w-full flex items-center justify-center px-4 py-2.5 sm:py-3 border border-transparent rounded-md shadow-sm text-sm sm:text-base font-medium text-gray-900 bg-white hover:bg-gray-100 transition-colors"
                    onClick={toggleMenu}
                  >
                    Book now
                  </NavLink>
                </div>
              </nav>
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;