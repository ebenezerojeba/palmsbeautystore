import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart2, Calendar, Users, Clock, ExternalLink } from 'lucide-react';

const AdminHome = () => {
  const quickLinks = [
    {
      title: "Dashboard",
      description: "View analytics and performance metrics",
      icon: <BarChart2 className="w-6 h-6" />,
      path: "/dashboard",
      color: "bg-blue-50 text-blue-600",
      borderColor: "border-blue-200"
    },
    {
      title: "Appointments",
      description: "Manage and track customer appointments",
      icon: <Calendar className="w-6 h-6" />,
      path: "/appointments",
      color: "bg-purple-50 text-purple-600",
      borderColor: "border-purple-200"
    },
    {
      title: "Clients",
      description: "Access client information and histories",
      icon: <Users className="w-6 h-6" />,
      path: "/clients",
      color: "bg-pink-50 text-pink-600",
      borderColor: "border-pink-200"
    },
    {
      title: "Services",
      description: "Configure and manage service offerings",
      icon: <Clock className="w-6 h-6" />,
      path: "/services",
      color: "bg-green-50 text-green-600",
      borderColor: "border-green-200"
    }
  ];

  return (
    <div className="flex-1 p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Welcome to Palms Beauty Admin
          </h1>
          <p className="text-gray-600">
            Manage your beauty salon operations efficiently from one central dashboard.
          </p>
        </div>

        {/* Quick Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`block p-6 bg-white rounded-lg border ${link.borderColor} shadow-sm hover:shadow-md transition-shadow`}
            >
              <div className={`inline-flex p-3 rounded-lg ${link.color} mb-4`}>
                {link.icon}
              </div>
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                {link.title}
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                {link.description}
              </p>
              <div className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-800">
                Access {link.title}
                <ExternalLink className="w-4 h-4 ml-1" />
              </div>
            </Link>
          ))}
        </div>

        {/* Tips Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Quick Tips
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-2">
                Getting Started
              </h3>
              <p className="text-sm text-gray-600">
                Visit the Dashboard first to get an overview of your salon's performance and upcoming appointments.
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-2">
                Managing Appointments
              </h3>
              <p className="text-sm text-gray-600">
                Use the Appointments section to view, manage, and track all customer bookings in real-time.
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-2">
                Need Help?
              </h3>
              <p className="text-sm text-gray-600">
                Contact your system administrator for support or access to additional features.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;