import React, { useState, useEffect, useContext } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, ShoppingCart } from "lucide-react";
import { ShopContext } from "../context/ShopContext";

const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const { getCartCount } = useContext(ShopContext);
  const location = useLocation();

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

  return (
    <nav className="bg-gray-900 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and mobile toggle */}
          <div className="flex items-center">
            <button
              className="md:hidden p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-800 focus:outline-none"
              onClick={toggleMenu}
              aria-label="Toggle mobile menu"
            >
              {showMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
<NavLink
  to="/"
  className="flex justify-center md:justify-start flex-shrink-0"
>
  <img
    src={assets.plog}
    alt="PalmsBeauty Logo"
    className="w-32 md:w-48 object-contain cursor-pointer"
  />
</NavLink>


          
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <ul className="flex items-center space-x-8">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `text-sm font-medium transition duration-200 ${
                    isActive ? "text-white font-semibold" : "text-gray-300 hover:text-white"
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
                    `text-sm font-medium transition duration-200 ${
                      isActive ? "text-white font-semibold" : "text-gray-300 hover:text-white"
                    }`
                  }
                >
                  {item}
                </NavLink>
              ))}
            </ul>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            <Link
              to="/cart"
              className="p-2 rounded-full hover:bg-gray-800 transition duration-200 relative"
              aria-label={`Cart with ${getCartCount()} items`}
            >
              <ShoppingCart className="w-5 h-5 text-white" />
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-gray-900 text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                  {getCartCount()}
                </span>
              )}
            </Link>

            <div className="hidden md:block ml-4">
              <NavLink
                to="/services"
                className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md shadow-sm text-gray-900 bg-white hover:bg-gray-100 focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition"
              >
                Book now
              </NavLink>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${showMenu ? "block" : "hidden"}`}>
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleMenu}
        />

        <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-gray-900 shadow-lg z-50">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 border-b border-gray-800">
            <img
              src={assets.plog}
              alt="PalmsBeauty Logo"
              className="w-32 md:w-48"
            />
            <button
              className="p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-800"
              onClick={toggleMenu}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="px-4 py-6">
            <nav className="grid gap-6">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-md text-base font-medium transition duration-200 ${
                    isActive
                      ? "bg-gray-800 text-white"
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
                    `flex items-center px-3 py-2 rounded-md text-base font-medium transition duration-200 ${
                      isActive
                        ? "bg-gray-800 text-white"
                        : "text-gray-300 hover:text-white hover:bg-gray-800"
                    }`
                  }
                  onClick={toggleMenu}
                >
                  {item}
                </NavLink>
              ))}

              <div className="pt-4 mt-4 border-t border-gray-800">
                <NavLink
                  to="/services"
                  className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-gray-900 bg-white hover:bg-gray-100"
                  onClick={toggleMenu}
                >
                  Book now
                </NavLink>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;