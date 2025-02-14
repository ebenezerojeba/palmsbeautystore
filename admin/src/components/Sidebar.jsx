



import React from 'react';
import { NavLink } from 'react-router-dom';
import { Calendar, Users, BarChart2, Clock } from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    {
      path: '/dashboard',
      icon: <BarChart2 className="w-5 h-5" />,
      label: 'Dashboard'
    },
    {
      path: '/appointments',
      icon: <Calendar className="w-5 h-5" />,
      label: 'Appointments'
    },
    // {
    //   path: '/clients',
    //   icon: <Users className="w-5 h-5" />,
    //   label: 'Clients'
    // },
    // {
    //   path: '/services',
    //   icon: <Clock className="w-5 h-5" />,
    //   label: 'Services'
    // },
  ];

  return (
    <div className="min-h-screen bg-white border-r">
      {/* <div className="p-4 border-b">
        <h1 className="text-xl font-bold text-gray-800 md:block hidden">Palms Beauty</h1>
      </div>
       */}
      <nav className="mt-5">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center justify-center md:justify-start md:gap-3 px-4 py-3 transition-colors duration-200
                  ${isActive 
                    ? 'bg-[#f2F3FF] border-r-4 border-gray-700 text-gray-900' 
                    : 'text-gray-600 hover:bg-gray-50'
                  }`
                }
              >
                {item.icon}
                <span className="text-sm font-medium hidden md:inline">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;