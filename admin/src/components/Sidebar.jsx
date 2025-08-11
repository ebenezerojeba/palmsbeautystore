import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Calendar, Users, BarChart2, Menu, X, PlusCircle, List, Box,
  ChevronLeft, ChevronRight, Settings, LogOut, Bell, HelpCircle,
  Clock
} from 'lucide-react';

// Replace this with your actual token setter
const setToken = (val) => localStorage.setItem("token", val);

const Sidebar = ({ onLogout, notifications = 0, className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

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

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape' && isMobileMenuOpen) setIsMobileMenuOpen(false);
    };
    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [isMobileMenuOpen]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const handleLogout = useCallback(() => {
    setToken('');
    onLogout?.();
    navigate('/');
  }, [navigate, onLogout]);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const handleLogoClick = useCallback(() => {
    navigate('/');
    setIsMobileMenuOpen(false);
  }, [navigate]);

  const menuItems = useMemo(() => [
    { path: '/dashboard', icon: <BarChart2 className="w-5 h-5" />, label: 'Dashboard' },
    { path: '/appointments', icon: <Calendar className="w-5 h-5" />, label: 'Appointments' },
    { path: '/add', icon: <PlusCircle className="w-5 h-5" />, label: 'Add Product' },
    { path: '/list', icon: <List className="w-5 h-5" />, label: 'List Products' },
    { path: '/orders', icon: <Box className="w-5 h-5" />, label: 'Orders' },
    { path: '/services', icon: <Users className="w-5 h-5" />, label: 'Services' },
    { path: '/hours', icon: <Clock className="w-5 h-5" />, label: 'Hours' },
  ], []);

  const bottomMenuItems = useMemo(() => [
    { path: '/settings', icon: <Settings className="w-5 h-5" />, label: 'Settings' },
    { path: '/help', icon: <HelpCircle className="w-5 h-5" />, label: 'Help & Support' },
  ], []);

  const NavItem = ({ item }) => (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-xl group relative transition-all
        ${isActive
          ? 'bg-blue-50 text-pink-500 ring-1 ring-blue-100'
          : 'text-gray-700 hover:bg-gray-100'}`
      }
      title={!isExpanded ? item.label : ''}
      onClick={() => setIsMobileMenuOpen(false)}
      aria-label={item.label}
    >
      {item.icon}
      {isExpanded && <span className="text-sm font-medium truncate">{item.label}</span>}
      {!isExpanded && (
        <div className="absolute left-full ml-3 px-3 py-1 bg-pink-\ text-white text-xs rounded opacity-0 group-hover:opacity-100 shadow-lg z-50">
          {item.label}
        </div>
      )}
    </NavLink>
  );

  const SidebarContent = () => (
    <>
      <div className="flex items-center justify-between p-4 bg-pink-800 text-white">
        <div
          onClick={handleLogoClick}
          className="flex items-center gap-3 cursor-pointer focus:outline-none"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleLogoClick()}
        >
          {/* <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <span className="font-bold text-sm">{isExpanded ? 'P' : 'PB'}</span>
          </div> */}
          {isExpanded && (
            <div>
              <div className="font-bold text-lg">Palmsbeauty</div>
              <span className="text-xs">Admin Panel</span>
            </div>
          )}
        </div>
        <button
          onClick={toggleSidebar}
          className="hidden lg:flex items-center justify-center w-8 h-8 bg-gray-800 rounded"
          aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {isExpanded ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      </div>

      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavItem item={item} />
            </li>
          ))}
        </ul>
      </nav>

      <div className="px-3 py-4 border-t border-gray-200 bg-gray-50">
        {notifications > 0 && (
          <div className="flex items-center gap-3 mb-4 px-3 py-2 bg-amber-100 rounded-lg">
            <div className="relative">
              <Bell className="w-5 h-5 text-amber-600" />
              <span className="absolute -top-1 -right-1 w-4 h-4 text-white bg-red-500 text-xs rounded-full flex items-center justify-center">
                {notifications > 9 ? '9+' : notifications}
              </span>
            </div>
            {isExpanded && (
              <span className="text-sm text-amber-800">
                {notifications} new notification{notifications > 1 ? 's' : ''}
              </span>
            )}
          </div>
        )}

        <ul className="space-y-2 mb-3">
          {bottomMenuItems.map((item) => (
            <li key={item.path}>
              <NavItem item={item} />
            </li>
          ))}
        </ul>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg"
          aria-label="Logout"
        >
          <LogOut className="w-5 h-5" />
          {isExpanded && <span>Logout</span>}
        </button>
      </div>
    </>
  );

  const sidebarWidth = isExpanded ? 'w-64' : 'w-16';

  if (!isMounted) {
    return <div className={`h-screen ${sidebarWidth} bg-white border-r`} />;
  }

  return (
    <>
      {/* Mobile Menu Toggle */}
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-900 text-white rounded"
        aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
      >
        {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-white border-r shadow-lg z-50 transition-transform duration-300 flex flex-col ${sidebarWidth} ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${className}`}
      >
        <SidebarContent />
      </aside>

      {/* Spacer for desktop layout */}
      <div className={`hidden lg:block ${sidebarWidth}`} />
    </>
  );
};

export default Sidebar;
