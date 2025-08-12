import React from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';

const Navbar = ({ setToken }) => {
  const navigate = useNavigate();

  return (
    <nav className="flex items-center justify-between px-4 sm:px-10 py-3 bg-gray-100 relative">
      {/* Empty space for left side balance */}
      <div className="w-[80px] sm:w-[100px]"></div>

      {/* Centered Admin Panel */}
      <p className="border px-3 py-1 rounded-full border-gray-500 text-gray-900 text-sm font-medium">
        Admin Panel
      </p>

      {/* Logout button */}
      <button
        onClick={() => setToken("")}
        className="cursor-pointer bg-gray-800 text-white text-xs sm:text-sm px-3 py-1 sm:px-4 sm:py-2 rounded-full"
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
