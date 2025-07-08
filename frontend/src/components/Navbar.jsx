import React, { useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const location = useLocation();

  // Close menu on route change
  useEffect(() => {
    setShowMenu(false);
  }, [location]);

  // Prevent scroll when menu is open
  useEffect(() => {
    if (showMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showMenu]);

  // Handle menu toggle
  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <nav className="flex items-center justify-between text-sm py-4 px-6 md:px-10 border-b border-gray-300">
      {/* Logo */}
     <NavLink to='/'>
     <img onClick={'/'} className="w-50 cursor-pointer h-auto " src={assets.palm_logo2} alt="Logo" />
     </NavLink>

      {/* Desktop Navigation */}
      <ul className="hidden md:flex items-center gap-6 font-medium">
        <NavLink to='/' className='relative group'>
          <li className="py-1">HOME</li>
          <span className="absolute left-0 bottom-0 w-3/5 h-0.5 bg-gray-900 hidden group-hover:block"></span>
        </NavLink>
        
        {["SERVICES","COLLECTIONS",].map((item, index) => (
          <NavLink key={index} to={`/${item.toLowerCase()}`} className="relative group">
            <li className="py-1">{item}</li>
            <span className="absolute left-0 bottom-0 w-3/5 h-0.5 bg-gray-900 hidden group-hover:block"></span>
          </NavLink>
        ))}
      </ul>

      {/* CTA Button */}
      <div className="hidden md:block">
        <button className="bg-gray-700 text-white px-6 py-2 rounded-full font-light hover:bg-gray-900 transition">
          <a className="cursor-pointer" href="/services">Book now</a>
        </button>
      </div>

      {/* Mobile Menu Button */}
      <button 
        className="md:hidden cursor-pointer text-2xl p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
        onClick={toggleMenu}
        aria-label="Toggle mobile menu"
      >
        {showMenu ? (
          <X className="w-6 h-6" aria-label="Close menu" />
        ) : (
          <Menu className="w-6 h-6" aria-label="Open menu" />
        )}
      </button>

      {/* Mobile Menu Overlay - closes menu when clicking outside */}
      {showMenu && (
        <div 
          className="fixed inset-0 bg-black/20 z-40"
          onClick={toggleMenu}
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 left-0 w-3/4 sm:w-1/2 h-full bg-white shadow-lg transform 
                   ${showMenu ? "translate-x-0" : "-translate-x-full"}
                   transition-transform duration-300 ease-in-out z-50 md:hidden`}
      >
        <ul className="bg-gray-50 flex flex-col items-start gap-6 mt-20 px-4 text-lg relative">
          <NavLink 
            to='/' 
            className='relative group w-full' 
            onClick={toggleMenu}
          >
            <li className="py-2 hover:bg-gray-100 w-full rounded px-2 transition-colors duration-200">
              HOME
            </li>
            <span className="absolute left-0 bottom-0 w-3/5 h-0.5 bg-gray-900 hidden group-hover:block"></span>
          </NavLink>
          
          {["SERVICES", "PRODUCT","ABOUT", "CONTACT", "COLLECTIONS"].map((item, index) => (
            <NavLink 
              key={index} 
              to={`/${item.toLowerCase()}`} 
              className='relative group w-full'
              onClick={toggleMenu}
            >
              <li className="py-2 hover:bg-gray-100 w-full rounded px-2 transition-colors duration-200">
                {item}
              </li>
              <span className="absolute left-0 bottom-0 w-3/5 h-0.5 bg-gray-900 hidden group-hover:block"></span>
            </NavLink>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;