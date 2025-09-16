

  // Provider Detail View
export const ProviderDetail = ({ provider }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200">
    <div className="p-6 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setView('grid')}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          ← Back to Providers
        </button>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowAddServiceModal(true)}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Service
          </button>
          <button
            onClick={() => {
              setEditingProvider(provider);
              setView('edit-provider');
            }}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit className="w-4 h-4 mr-1" />
            Edit Provider
          </button>
        </div>
      </div>
    </div>

    <div className="p-6">
      <div className="flex items-start space-x-6">
        <div className="flex-shrink-0">
          <img
            src={
              provider.profileImage ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                provider.name
              )}&size=128&background=3b82f6&color=ffffff`
            }
            alt={provider.name}
            className="w-32 h-32 rounded-full object-cover"
          />
        </div>

        <div className="flex-1">
          <div className="flex items-center space-x-4 mb-4">
            <h1 className="text-2xl font-bold text-gray-900">
              {provider.name}
            </h1>
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              {provider.rating ? (
                <span className="text-lg font-medium text-gray-700">
                  {provider.rating.average.toFixed(1)} ({provider.rating.count} reviews)
                </span>
              ) : (
                <span className="text-lg font-medium text-gray-700">
                  0.0 (0 reviews)
                </span>
              )}
            </div>
            {provider.isActive ? (
              <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                <CheckCircle size={12} className="mr-1" />
                Active
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                <XCircle size={12} className="mr-1" />
                Inactive
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-3">
              <div className="flex items-center text-gray-600">
                <Mail className="w-5 h-5 mr-3" />
                <span>{provider.email}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Phone className="w-5 h-5 mr-3" />
                <span>{provider.phone || 'No phone number'}</span>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">About</h3>
            <p className="text-gray-600">{provider.bio || 'No bio available'}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Services</h3>
            <button
              onClick={() => setShowAddServiceModal(true)}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              + Add Service
            </button>
          </div>
          <div className="space-y-3">
            {provider.services && provider.services.length > 0 ? (
              provider.services.map((service) => (
                <div
                  key={service._id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <h4 className="font-medium text-gray-900">{service.name}</h4>
                    <p className="text-sm text-gray-600">
                      {service.duration} minutes • ${service.price}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      removeServiceFromProvider(provider._id, service._id)
                    }
                    className="text-red-600 hover:text-red-700 p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic">
                No services assigned to this provider
              </p>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Working Hours</h3>
            <button
              onClick={() => {
                loadProviderSchedule(provider._id);
                setView('schedule');
              }}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Edit Schedule
            </button>
          </div>
          <div className="space-y-2">
            {[
              'Sunday',
              'Monday',
              'Tuesday',
              'Wednesday',
              'Thursday',
              'Friday',
              'Saturday',
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
                      : 'Closed'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>

    {/* Add Service Modal */}
    {showAddServiceModal && (
      <AddServiceModal
        provider={provider}
        services={services}
        onClose={() => setShowAddServiceModal(false)}
        onAdd={addServiceToProvider}
      />
    )}
  </div>
);
