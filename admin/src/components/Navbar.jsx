import React from 'react';
import {useNavigate} from 'react-router-dom'
import { assets } from '../assets/assets';

const Navbar = () => {
  const navigate = useNavigate()
  return (
    <nav className="flex flex-wrap justify-between items-center px-4 sm:px-10 py-3 border-b bg-gray-100">
      <div className="flex items-center gap-2 text-xs">
        <img 
          className="w-32 sm:w-40 cursor-pointer h-12" 
          src={assets.admin1} 
          onClick={()=>navigate('/')}
          alt="Admin-Logo" 
        />
        <p className="border px-2 py-1 rounded-full border-gray-500 text-gray-600 text-[10px] sm:text-xs">
          Admin Panel
        </p>
      </div>
      <button className="cursor-pointer bg-gray-800 text-white text-xs sm:text-sm px-3 py-1 sm:px-4 sm:py-2 rounded-full">
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
