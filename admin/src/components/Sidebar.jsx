import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {useNavigate} from "react-router-dom"
import { Calendar, Users, BarChart2, Clock, Menu, X } from 'lucide-react';
import { assets } from '../assets/assets';

const Sidebar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const location = useLocation();
  const navigate = useNavigate()

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Prevent hydration issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const menuItems = [
    {
      path: '/dashboard',
      icon: <BarChart2 className="w-5 h-5" />,
      label: 'Dashboard',
      ariaLabel: 'Navigate to Dashboard'
    },
    {
      path: '/appointments',
      icon: <Calendar className="w-5 h-5" />,
      label: 'Appointments',
      ariaLabel: 'Navigate to Appointments'
    },
    // {
    //   path: '/clients',
    //   icon: <Users className="w-5 h-5" />,
    //   label: 'Clients',
    //   ariaLabel: 'Navigate to Clients'
    // },
    // {
    //   path: '/services',
    //   icon: <Clock className="w-5 h-5" />,
    //   label: 'Services',
    //   ariaLabel: 'Navigate to Services'
    // },
  ];

  if (!isMounted) {
    return null;
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        type="button"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden top-20 left-2 z-50 p-2 rounded-lg bg-white shadow-lg border"
        aria-expanded={isMobileMenuOpen}
        aria-controls="sidebar-menu"
        aria-label="Toggle navigation menu"
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6 text-gray-600" />
        ) : (
          <Menu className="w-6 h-6 text-gray-600" />
        )}
      </button>

      {/* Backdrop for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-white bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div
        id="sidebar-menu"
        role="navigation"
        aria-label="Main navigation"
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-white border-r transform transition-transform duration-200 ease-in-out z-50
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* Logo/Header */}
        <div
        onClick={()=> navigate('/')} className="p-4 bg-gray-800 border-b">
          <h1 className="sfont-normal text-gray-50">Palmsbeauty Admin Panel</h1>
        </div>

        {/* Navigation */}
        <nav className="mt-5 px-2">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                    ${isActive 
                      ? 'bg-[#f2F3FF] text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`
                  }
                  aria-label={item.ariaLabel}
                  aria-current={({ isActive }) => isActive ? 'page' : undefined}
                >
                  {item.icon}
                  <span className="text-sm font-medium">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Optional: User Profile Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white">
          <div className="flex items-center gap-3">
            {/* <img className="w-8 h-8 rounded-full bg-gray-900" /> */}
            <img src={assets.ceo} alt="Profile Picture" className='w-8 h-8 rounded-full '/>
            <div>
              <p className="text-sm font-medium text-gray-900">CEO  - Esther Success</p>
              <p className="text-xs text-gray-500">admin@palmsbeauty.com</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;