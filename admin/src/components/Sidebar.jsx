// import React, { useState, useEffect } from 'react';
// import { NavLink, useLocation } from 'react-router-dom';
// import {useNavigate} from "react-router-dom"
// import { Calendar, Users, BarChart2, Clock, Menu, X, Plus, PlusCircle, List, Box } from 'lucide-react';
// import { assets } from '../assets/assets';

// const Sidebar = () => {
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [isMounted, setIsMounted] = useState(false);
//   const location = useLocation();
//   const navigate = useNavigate()

//   // Close mobile menu when route changes
//   useEffect(() => {
//     setIsMobileMenuOpen(false);
//   }, [location]);

//   // Prevent hydration issues
//   useEffect(() => {
//     setIsMounted(true);
//   }, []);

//   const menuItems = [
//     {
//       path: '/dashboard',
//       icon: <BarChart2 className="w-5 h-5" />,
//       label: 'Dashboard',
//       ariaLabel: 'Navigate to Dashboard'
//     },
//     {
//       path: '/appointments',
//       icon: <Calendar className="w-5 h-5" />,
//       label: 'Appointments',
//       ariaLabel: 'Navigate to Appointments'
//     },
//     {
//            path: '/add',
//       icon: <PlusCircle className="w-5 h-5" />,
//       label: 'Add Product',
//       ariaLabel: 'Navigate to Add Product'
//     },
//     {
//            path: '/list',
//       icon: <List className="w-5 h-5" />,
//       label: 'List Products',
//       ariaLabel: 'Navigate to List Products'
//     },
//     {
//            path: '/orders',
//       icon: <Box className="w-5 h-5" />,
//       label: 'Orders',
//       ariaLabel: 'Navigate to Orders'
//     },
//     {
      
//            path: '/services',
//       // icon: <Box className="w-5 h-5" />,
//       icon: <Users className="w-5 h-5" />,
//       label: 'Services',
//       ariaLabel: 'Navvigate to Services'
//     }
//   ];

//   if (!isMounted) {
//     return null;
//   }

//   return (
//     <>
//       {/* Mobile Menu Button */}
//       <button
//         type="button"
//         onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//         className="md:hidden top-20 left-2 z-50 p-2 rounded-lg bg-white shadow-lg border"
//         aria-expanded={isMobileMenuOpen}
//         aria-controls="sidebar-menu"
//         aria-label="Toggle navigation menu"
//       >
//         {isMobileMenuOpen ? (
//           <X className="w-6 h-6 text-gray-600" />
//         ) : (
//           <Menu className="w-6 h-6 text-gray-600" />
//         )}
//       </button>

//       {/* Backdrop for mobile */}
//       {isMobileMenuOpen && (
//         <div 
//           className="fixed inset-0 bg-white bg-opacity-50 z-40 md:hidden"
//           onClick={() => setIsMobileMenuOpen(false)}
//           aria-hidden="true"
//         />
//       )}

//       {/* Sidebar */}
//     <div
//   id="sidebar-menu"
//   role="navigation"
//   aria-label="Main navigation"
//   className={`fixed top-0 left-0 h-screen w-64 bg-white border-r transition-transform duration-200 ease-in-out z-50
//     ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:sticky`}

//       >
//         {/* Logo/Header */}
//         <div
//         onClick={()=> navigate('/')} className="p-4 bg-gray-800 border-b">
//           <h1 className="sfont-normal text-gray-50">Palmsbeauty Admin Panel</h1>
//         </div>

//         {/* Navigation */}
//         <nav className="mt-5 px-2">
//           <ul className="space-y-1">
//             {menuItems.map((item) => (
//               <li key={item.path}>
//                 <NavLink
//                   to={item.path}
//                   className={({ isActive }) =>
//                     `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
//                     ${isActive 
//                       ? 'bg-[#f2F3FF] text-gray-900 shadow-sm' 
//                       : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
//                     }`
//                   }
//                   aria-label={item.ariaLabel}
//                   aria-current={({ isActive }) => isActive ? 'page' : undefined}
//                 >
//                   {item.icon}
//                   <span className="text-sm font-medium">{item.label}</span>
//                 </NavLink>
//               </li>
//             ))}
//           </ul>
//         </nav>

//         {/* Optional: User Profile Section */}
//         <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white">
//           <div className="flex items-center gap-3">
//             {/* <img className="w-8 h-8 rounded-full bg-gray-900" /> */}
//             {/* <img src={assets.ceo} alt="Profile Picture" className='w-8 h-8 rounded-full '/> */}
//             <div>
//               {/* <p className="text-sm font-medium text-gray-900">CEO  - Esther Success</p> */}
//               {/* <p className="text-xs text-gray-500">admin@palmsbeauty.com</p> */}
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Sidebar;





import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Users, 
  BarChart2, 
  Menu, 
  X, 
  PlusCircle, 
  List, 
  Box, 
  ChevronLeft,
  ChevronRight,
  Home,
  Settings,
  LogOut
} from 'lucide-react';

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsExpanded(true);
      } else {
        setIsExpanded(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    {
      path: '/add',
      icon: <PlusCircle className="w-5 h-5" />,
      label: 'Add Product',
      ariaLabel: 'Navigate to Add Product'
    },
    {
      path: '/list',
      icon: <List className="w-5 h-5" />,
      label: 'List Products',
      ariaLabel: 'Navigate to List Products'
    },
    {
      path: '/orders',
      icon: <Box className="w-5 h-5" />,
      label: 'Orders',
      ariaLabel: 'Navigate to Orders'
    },
    {
      path: '/services',
      icon: <Users className="w-5 h-5" />,
      label: 'Services',
      ariaLabel: 'Navigate to Services'
    }
  ];

  const bottomMenuItems = [
    {
      path: '/settings',
      icon: <Settings className="w-5 h-5" />,
      label: 'Settings',
      ariaLabel: 'Navigate to Settings'
    }
  ];

  if (!isMounted) {
    return null;
  }

  const sidebarWidth = isExpanded ? 'w-64' : 'w-16';
  const logoText = isExpanded ? 'Palmsbeauty Admin' : 'PB';

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen ${sidebarWidth} bg-white border-r border-gray-200 transition-all duration-300 ease-in-out z-50 shadow-lg flex flex-col`}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-gray-900 border-b border-gray-700">
          <div
            onClick={() => navigate('/')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {logoText === 'PB' ? 'PB' : 'P'}
              </span>
            </div>
            {isExpanded && (
              <h1 className="text-white font-semibold text-lg truncate group-hover:text-blue-200 transition-colors">
                {logoText}
              </h1>
            )}
          </div>
          
          {/* Toggle button - only show on desktop */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
            aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {isExpanded ? (
              <ChevronLeft className="w-4 h-4 text-gray-300" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-300" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 overflow-y-auto">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group relative
                    ${isActive 
                      ? 'bg-blue-50 text-blue-700 shadow-sm border-l-4 border-blue-500' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`
                  }
                  aria-label={item.ariaLabel}
                  title={!isExpanded ? item.label : ''}
                >
                  <div className="flex-shrink-0">
                    {item.icon}
                  </div>
                  {isExpanded && (
                    <span className="text-sm font-medium truncate">{item.label}</span>
                  )}
                  
                  {/* Tooltip for collapsed state */}
                  {!isExpanded && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                      {item.label}
                    </div>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 p-2">
          {/* Bottom Menu Items */}
          <ul className="space-y-1 mb-3">
            {bottomMenuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group relative
                    ${isActive 
                      ? 'bg-blue-50 text-blue-700 shadow-sm border-l-4 border-blue-500' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`
                  }
                  aria-label={item.ariaLabel}
                  title={!isExpanded ? item.label : ''}
                >
                  <div className="flex-shrink-0">
                    {item.icon}
                  </div>
                  {isExpanded && (
                    <span className="text-sm font-medium truncate">{item.label}</span>
                  )}
                  
                  {/* Tooltip for collapsed state */}
                  {!isExpanded && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                      {item.label}
                    </div>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* User Profile Section */}
          <div className="pt-3 border-t border-gray-200">
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-medium text-sm">ES</span>
              </div>
              {isExpanded && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">Esther Success</p>
                  <p className="text-xs text-gray-500 truncate">CEO</p>
                </div>
              )}
            </div>
            
            {/* Logout Button */}
            <button
              onClick={() => {
                // Add logout logic here
                console.log('Logging out...');
              }}
              className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 group relative mt-2"
              aria-label="Logout"
              title={!isExpanded ? 'Logout' : ''}
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {isExpanded && (
                <span className="text-sm font-medium">Logout</span>
              )}
              
              {/* Tooltip for collapsed state */}
              {!isExpanded && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  Logout
                </div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main content spacer */}
      <div className={`${sidebarWidth} flex-shrink-0 transition-all duration-300 ease-in-out`} />
    </>
  );
};

export default Sidebar;