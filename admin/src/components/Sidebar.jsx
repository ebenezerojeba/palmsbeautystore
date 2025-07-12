









import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  Settings,
  LogOut,
  Bell,
  HelpCircle
} from 'lucide-react';

const Sidebar = ({ 
  onLogout,
  notifications = 0,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Handle responsive behavior with debouncing
  const handleResize = useCallback(() => {
    if (window.innerWidth >= 1024) {
      setIsExpanded(true);
      setIsMobileMenuOpen(false);
    } else {
      setIsExpanded(false);
    }
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  // Prevent hydration issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Handle escape key for mobile menu
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [isMobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const menuItems = useMemo(() => [
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
  ], []);

  const bottomMenuItems = useMemo(() => [
    {
      path: '/settings',
      icon: <Settings className="w-5 h-5" />,
      label: 'Settings',
      ariaLabel: 'Navigate to Settings'
    },
    {
      path: '/help',
      icon: <HelpCircle className="w-5 h-5" />,
      label: 'Help & Support',
      ariaLabel: 'Navigate to Help & Support'
    }
  ], []);

  const handleLogout = useCallback(() => {
  setToken("")
  })

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  const handleLogoClick = useCallback(() => {
    navigate('/');
    setIsMobileMenuOpen(false);
  }, [navigate]);

  if (!isMounted) {
    return (
      <div className="w-16 lg:w-64 h-screen bg-white border-r border-gray-200 animate-pulse shadow-sm">
        <div className="h-16 bg-gray-100 border-b border-gray-200"></div>
        <div className="p-4 space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-100 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  const sidebarWidth = isExpanded ? 'w-64' : 'w-16';
  const logoText = isExpanded ? 'Palmsbeauty Admin' : 'PB';

  const NavItem = ({ item }) => (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 focus:ring-offset-2 focus:ring-offset-white hover:shadow-sm
        ${isActive 
          ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm ring-1 ring-blue-100' 
          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
        }`
      }
      aria-label={item.ariaLabel}
      title={!isExpanded ? item.label : ''}
      onClick={() => setIsMobileMenuOpen(false)}
    >
      <div className="flex-shrink-0 transition-transform duration-200 group-hover:scale-105">
        {item.icon}
      </div>
      {isExpanded && (
        <span className="text-sm font-medium truncate tracking-wide">{item.label}</span>
      )}
      
      {/* Tooltip for collapsed state */}
      {!isExpanded && (
        <div className="absolute left-full ml-3 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg">
          {item.label}
          <div className="absolute top-1/2 -left-1 w-2 h-2 bg-gray-900 rotate-45 transform -translate-y-1/2"></div>
        </div>
      )}
    </NavLink>
  );

  const SidebarContent = () => (
    <>
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div
          onClick={handleLogoClick}
          className="flex items-center gap-3 cursor-pointer group focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 rounded-lg p-1 relative z-10 transition-all duration-200 hover:scale-105"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleLogoClick();
            }
          }}
          aria-label="Go to home page"
        >
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg ring-2 ring-white/20">
            <span className="text-white font-bold text-sm">
              {logoText === 'PB' ? 'PB' : 'P'}
            </span>
          </div>
          {isExpanded && (
            <div className="flex flex-col">
              <h1 className="text-white font-bold text-lg truncate group-hover:text-blue-200 transition-colors leading-tight">
                Palmsbeauty
              </h1>
              <span className="text-gray-300 text-xs font-medium">Admin Panel</span>
            </div>
          )}
        </div>
        
        {/* Toggle button - only show on desktop */}
        <button
          onClick={toggleSidebar}
          className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 backdrop-blur-sm hover:scale-105 relative z-10"
          aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {isExpanded ? (
            <ChevronLeft className="w-4 h-4 text-gray-200" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-200" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 overflow-y-auto" role="navigation" aria-label="Main navigation">
        <ul className="space-y-2" role="list">
          {menuItems.map((item) => (
            <li key={item.path} role="listitem">
              <NavItem item={item} />
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-gray-200 p-3 bg-gray-50/50">
        {/* Notifications */}
        {notifications > 0 && (
          <div className="flex items-center gap-3 px-3 py-2.5 mb-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl shadow-sm">
            <div className="relative">
              <Bell className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium shadow-sm">
                {notifications > 9 ? '9+' : notifications}
              </span>
            </div>
            {isExpanded && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-amber-800">
                  {notifications} new notification{notifications > 1 ? 's' : ''}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Bottom Menu Items */}
        <ul className="space-y-1 mb-3" role="list">
          {bottomMenuItems.map((item) => (
            <li key={item.path} role="listitem">
              <NavItem item={item} />
            </li>
          ))}
        </ul>

        {/* User Profile Section */}
        <div className="pt-3 border-t border-gray-200">
        
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-gray-900 text-white rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200 hover:scale-105 hover:shadow-xl backdrop-blur-sm"
        aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
      >
        {isMobileMenuOpen ? (
          <X className="w-5 h-5" />
        ) : (
          <Menu className="w-5 h-5" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 z-40 transition-all duration-300 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 ease-in-out z-50 shadow-xl flex flex-col
          ${sidebarWidth}
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${className}
        `}
        role="navigation"
        aria-label="Main navigation"
      >
        <SidebarContent />
      </div>

      {/* Main content spacer - only on desktop */}
      <div className={`hidden lg:block ${sidebarWidth} flex-shrink-0 transition-all duration-300 ease-in-out`} />
    </>
  );
};

export default Sidebar;