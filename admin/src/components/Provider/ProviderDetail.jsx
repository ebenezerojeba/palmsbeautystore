import React, { useState, useEffect } from 'react';
import { 
  Plus, X, CheckCircle, XCircle, Star, Mail, Phone, 
  ChevronUp, ChevronDown, Clock4, Calendar, User 
} from 'lucide-react';


const ProviderDetail = ({ 
  provider, 
  services, 
  onBack, 
  onAddService, 
  onRemoveService, 
  onViewSchedule,
  appointmentStats,
  todaysAppointments,
  upcomingAppointments,
  appointmentsLoading,
  onLoadAppointments
}) => {
  const [expanded, setExpanded] = useState(false);
  const [showAllServices, setShowAllServices] = useState(false);
  const [showAllAvailable, setShowAllAvailable] = useState(false);
  const [showHours, setShowHours] = useState(false);
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  
  const maxVisibleAvailable = 3;
  const maxVisibleServices = 3;
  const maxLength = 120;

  useEffect(() => {
    if (provider) {
      console.log('Provider services structure:', provider.services);
      provider.services?.forEach((service, index) => {
        console.log(`Service ${index}:`, service);
      });
    }
  }, [provider]);

  if (!provider) return null;

  const toggleExpanded = () => setExpanded(!expanded);

  const displayText =
    provider.bio && provider.bio.length > maxLength && !expanded
      ? provider.bio.slice(0, maxLength) + "..."
      : provider.bio;

  const rating = provider.rating || { average: 0, count: 0 };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="text-gray-600 hover:text-gray-700 font-medium"
          >
            ← Back
          </button>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowAddServiceModal(true)}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Service
            </button>
          </div>
        </div>
      </div>

      <div className="sm:p-6 p-4">
        <div className="flex flex-col sm:flex-row items-start sm:space-x-6 space-y-4 sm:space-y-0">
          <div className="flex-shrink-0">
            <img
              src={
                provider.profileImage ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  provider.name || 'Unknown'
                )}&size=128&background=3b82f6&color=ffffff`
              }
              alt={provider.name || 'Unknown Provider'}
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  provider.name || 'Unknown'
                )}&size=128&background=3b82f6&color=ffffff`;
              }}
            />
          </div>

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 mb-4">
              <h1 className="text-base sm:text-xl md:text-2xl font-bold text-gray-900">
                {provider.name || "Unknown Provider"}
              </h1>

              <div className="flex items-center mt-1 sm:mt-0">
                <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current" />
                <span className="ml-1 text-sm sm:text-base font-medium text-gray-700">
                  {rating.average > 0
                    ? `${rating.average.toFixed(1)} (${rating.count} reviews)`
                    : "0.0 (0 reviews)"}
                </span>
              </div>

              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1 sm:mt-0 ${provider.isActive
                    ? "bg-green-00 text-green-800"
                    : "bg-red-00 text-red-800"
                  }`}
              >
                {provider.isActive ? (
                  <>
                    <CheckCircle size={12} className="mr-1" />
                    Active
                  </>
                ) : (
                  <>
                    <XCircle size={12} className="mr-1" />
                    Inactive
                  </>
                )}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <Mail className="w-5 h-5 mr-3" />
                  <span>{provider.email || 'No email'}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="w-5 h-5 mr-3" />
                  <span>{provider.phone || 'No phone number'}</span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">About</h3>
              <p className="text-gray-600">
                {displayText || "No bio available"}
                {provider.bio && provider.bio.length > maxLength && (
                  <button
                    onClick={toggleExpanded}
                    className="ml-2 text-green-700 text-sm font-medium hover:underline"
                  >
                    {expanded ? "See less" : "See more"}
                  </button>
                )}
              </p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Assigned Services</h3>
              <button
                onClick={() => setShowAddServiceModal(true)}
                className="text-gray-600 hover:text-gray-700 text-sm font-medium"
              >
                + Add Service
              </button>
            </div>
            <div className="space-y-1">
              {provider.services && provider.services.length > 0 ? (
                <>
                  {(showAllServices
                    ? provider.services
                    : provider.services.slice(0, maxVisibleServices)
                  ).map((service) => {
                    const serviceId = service._id || service.serviceId;
                    const serviceTitle = service.title || service.name || 'Unnamed Service';

                    return (
                      <div
                        key={serviceId}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <h4 className="font-medium text-gray-900">{serviceTitle}</h4>
                          <h6 className="text-sm text-gray-600">ID: {serviceId}</h6>
                        </div>
                        <button
                          onClick={() => onRemoveService(provider._id, serviceId)}
                          className="text-red-600 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors"
                          title="Remove service"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}

                  {provider.services && provider.services.length > maxVisibleServices && (
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={() => setShowAllServices(!showAllServices)}
                        className="text-green-600 text-sm font-medium hover:underline"
                      >
                        {showAllServices ? "See less" : "See all services"}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-2">
                    <Clock4 className="w-12 h-12 mx-auto" />
                  </div>
                  <p className="text-gray-500 italic">
                    No services assigned to this provider
                  </p>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Available Services</h3>
            </div>
            <div className="space-y-3">
              {services?.filter(service => {
                const serviceId = service._id;
                return !provider.services?.some(ps => {
                  const assignedServiceId = ps._id || ps.serviceId;
                  return assignedServiceId === serviceId;
                });
              }).length > 0 ? (
                <>
                  {services
                    .filter(service => {
                      const serviceId = service._id;
                      return !provider.services?.some(ps => {
                        const assignedServiceId = ps._id || ps.serviceId;
                        return assignedServiceId === serviceId;
                      });
                    })
                    .slice(0, showAllAvailable ? undefined : maxVisibleAvailable)
                    .map((service) => (
                      <div
                        key={service._id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <h4 className="font-medium text-gray-900">{service.title || service.name}</h4>
                        </div>
                        <button
                          onClick={() => onAddService(provider._id, service._id)}
                          className="text-green-600 hover:text-green-700 p-1 rounded hover:bg-green-50 transition-colors"
                          title="Add service"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    ))}

                  {services.filter(service => {
                    const serviceId = service._id;
                    return !provider.services?.some(ps => {
                      const assignedServiceId = ps._id || ps.serviceId;
                      return assignedServiceId === serviceId;
                    });
                  }).length > maxVisibleAvailable && (
                      <div className='flex justify-end mt-2'>
                        <button
                          onClick={() => setShowAllAvailable(!showAllAvailable)}
                          className=" text-green-600 text-sm font-medium hover:underline mt-2"
                        >
                          {showAllAvailable ? "See less" : `See all available services`}
                        </button>
                      </div>
                    )}
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500 italic">
                    All services are already assigned to this provider
                  </p>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setShowHours(!showHours)}
                className="flex items-center text-lg font-semibold text-gray-900 focus:outline-none"
              >
                Working Hours
                {showHours ? (
                  <ChevronUp className="w-5 h-5 ml-2 text-gray-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 ml-2 text-gray-600" />
                )}
              </button>

              <button
                onClick={() => onViewSchedule(provider)}
                className="text-gray-600 hover:text-gray-700 text-sm font-medium"
              >
                Edit Schedule
              </button>
            </div>

            {showHours && (
              <div className="space-y-2">
                {[
                  "Sunday",
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                ].map((day, index) => {
                  const workingDay =
                    provider.workingHours &&
                    provider.workingHours.find((wh) => wh.dayOfWeek === index);
                  return (
                    <div
                      key={day}
                      className="flex justify-between items-center p-2 bg-gray-50 rounded"
                    >
                      <span className="font-medium text-gray-700">{day}</span>
                      <span className="text-gray-600">
                        {workingDay && workingDay.isWorking
                          ? `${workingDay.startTime} - ${workingDay.endTime}`
                          : "Closed"}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Appointment Overview</h3>
            <button
              onClick={() => onLoadAppointments(provider._id)}
              disabled={appointmentsLoading}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              {appointmentsLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                  Loading...
                </>
              ) : (
                'Refresh Data'
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[
              {
                title: 'Total Appointments',
                value: appointmentStats?.total || 0,
                icon: Calendar,
                color: 'text-gray-600',
                bgColor: 'bg-gray-50'
              },
              {
                title: 'Today\'s Appointments',
                value: appointmentStats?.today || 0,
                icon: Clock4,
                color: 'text-green-600',
                bgColor: 'bg-green-50'
              },
              {
                title: 'Upcoming',
                value: appointmentStats?.upcoming || 0,
                icon: Clock4,
                color: 'text-yellow-600',
                bgColor: 'bg-yellow-50'
              },
              {
                title: 'Completed',
                value: appointmentStats?.completed || 0,
                icon: CheckCircle,
                color: 'text-purple-600',
                bgColor: 'bg-purple-50'
              }
            ].map((stat, index) => (
              <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Today's Appointments</h3>
                <span className="text-sm text-gray-500">({todaysAppointments?.length})</span>
              </div>

              {todaysAppointments?.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No appointments scheduled for today</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {todaysAppointments?.map((appointment) => (
                    <div key={appointment._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <User className="w-8 h-8 text-gray-400" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {appointment.client?.name || appointment.clientName || 'Unknown Client'}
                            </p>
                            <p className="text-sm text-gray-600">
                              {appointment.service?.title || appointment.serviceName || 'Unknown Service'}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {new Date(appointment.date).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          {appointment.startTime} - {appointment.endTime}
                        </p>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                          }`}>
                          {appointment.status || 'pending'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h3>
                <span className="text-sm text-gray-500">({upcomingAppointments?.length})</span>
              </div>

              {upcomingAppointments?.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No upcoming appointments</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {upcomingAppointments?.map((appointment) => (
                    <div key={appointment._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <User className="w-8 h-8 text-gray-400" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {appointment.client?.name || appointment.clientName || 'Unknown Client'}
                            </p>
                            <p className="text-sm text-gray-600">
                              {appointment.service?.title || appointment.serviceName || 'Unknown Service'}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {new Date(appointment.date).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          {appointment.startTime} - {appointment.endTime}
                        </p>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                          }`}>
                          {appointment.status || 'pending'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {showAddServiceModal && (
          <AddServiceModa
            provider={provider}
            services={services}
            onClose={() => setShowAddServiceModal(false)}
            onAdd={onAddService}
          />
        )}
      </div>
    </div>
  );
};

export default ProviderDetail;