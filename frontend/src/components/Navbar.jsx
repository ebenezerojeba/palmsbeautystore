import React, { useState } from "react";
import { assets } from "../assets/assets";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <nav className="flex items-center justify-between text-sm py-4 px-6 md:px-10 border-b border-gray-300">
      {/* Logo */}
      <img className="w-50 cursor-pointer" src={assets.palm_logo2} alt="Logo" />

      {/* Desktop Navigation */}
      <ul className="hidden md:flex items-center gap-6 font-medium">
        <NavLink to='/' className='relative group'>
          <li className="py-1">HOME</li>
          <span className="absolute left-0 bottom-0 w-3/5 h-0.5 bg-gray-900 hidden group-hover:block"></span>
          </NavLink>
        
        {["SERVICES", "ABOUT", "CONTACT"].map((item, index) => (
          <NavLink key={index} to={`/${item.toLowerCase()}`} className="relative group">
            <li className="py-1">{item}</li>
            <span className="absolute left-0 bottom-0 w-3/5 h-0.5 bg-gray-900 hidden group-hover:block"></span>
          </NavLink>
        ))}
      </ul>

      {/* CTA Button */}
      <div className="hidden md:block">
        <button className="bg-gray-700 text-white px-6 py-2 rounded-full font-light hover:bg-gray-900 transition">
          Book Now
        </button>
      </div>

      {/* Mobile Menu Button */}
      <button className="md:hidden cursor-pointer text-2xl" onClick={() => setShowMenu(!showMenu)}>
        {showMenu ? <X /> : <Menu />}
      </button>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 left-0 w-3/4 sm:w-1/2 h-full bg-transparent shadow-lg transform ${
          showMenu ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-50 md:hidden`}
      >
    
        <ul className="bg-gray-50 flex flex-col items-start gap-6 mt-20 px-4 text-lg relative">
        <NavLink to='/' className='relative group' onClick={()=>setShowMenu(false)}>
          <li className="py-1">HOME</li>
          <span className="absolute left-0 bottom-0 w-3/5 h-0.5 bg-gray-900 hidden group-hover:block"></span>
          </NavLink>
          {["SERVICES", "ABOUT", "CONTACT"].map((item, index) => (
            <NavLink key={index} to={`/${item.toLowerCase()}`} onClick={() => setShowMenu(false)}>
              <li className="py-2">{item}</li>
              <span className="absolute left-0 bottom-0 w-3/5 h-0.5 bg-gray-900 hidden group-hover:block"></span>
            </NavLink>
          ))}
        </ul>
        {/* <div className="mt-8 px-6">
          <button
            className="w-full bg-gray-700 text-white py-3 rounded-full font-light hover:bg-gray-900 transition"
            onClick={() => setShowMenu(false)}
          >
            Book Now
          </button>
        </div> */}
      </div>
    </nav>
  );
};

export default Navbar;
