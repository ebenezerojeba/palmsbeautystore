import React from 'react';
import { User, Mail, Phone, Check, XCircle, Edit, Calendar, Clock4 } from 'lucide-react';

const ProviderCard = ({ 
  provider, 
  onViewDetails, 
  onViewAppointments, 
  onViewSchedule, 
  onEdit 
}) => {
  if (!provider) return null;

  const rating = provider.rating || { average: 0, count: 0 };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <div className="p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <img
              src={
                provider.profileImage ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  provider.name || 'Unknown'
                )}&size=64&background=3b89f6&color=ffffff`
              }
              alt={provider.name || 'Unknown Provider'}
              className="w-16 h-16 rounded-full object-cover"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  provider.name || 'Unknown'
                )}&size=64&background=3b82f6&color=ffffff`;
              }}
            />
            <div className="flex items-center justify-center mt-2">
              {provider.isActive ? (
                <span className="flex items-center text-green-600 text-xs">
                  <Check size={12} className="mr-1" />
                  Active
                </span>
              ) : (
                <span className="flex items-center text-red-600 text-xs">
                  <XCircle size={12} className="mr-1" />
                  Inactive
                </span>
              )}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {provider.name || 'Unknown Provider'}
              </h3>
            </div>

            <div className="mt-1 space-y-1">
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="w-4 h-4 mr-2" />
                {provider.email || 'No email'}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="w-4 h-4 mr-2" />
                {provider.phone || "No phone number"}
              </div>
            </div>

            <p className="mt-2 text-sm text-gray-500 line-clamp-2">
              {provider.bio || "No bio available"}
            </p>

            <div className="mt-3">
              <div className="flex flex-wrap gap-1">
                {provider.services && provider.services.length > 0 ? (
                  <>
                    {provider.services.slice(0, 3).map((service) => {
                      const serviceTitle = service.title || service.name || 'Unnamed Service';
                      return (
                        <span
                          key={service._id || service.serviceId}
                          className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-md"
                        >
                          {serviceTitle}
                        </span>
                      );
                    })}
                    {provider.services.length > 3 && (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-md">
                        +{provider.services.length - 3} more
                      </span>
                    )}
                  </>
                ) : (
                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-500 rounded-md">
                    No services assigned
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onViewDetails(provider)}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-100 transition-colors"
            >
              View
            </button>
            <button
              onClick={() => onViewAppointments(provider)}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Appointments
            </button>
            <button
              onClick={() => onViewSchedule(provider)}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Schedule
            </button>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => onEdit(provider)}
              className="p-2 text-gray-600 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Edit className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderCard;