 const ProviderCard = ({ provider }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
    <div className="p-6">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <img
            src={
              provider.profileImage ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                provider.name
              )}&size=64&background=3b82f6&color=ffffff`
            }
            alt={provider.name}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div className="flex items-center justify-center mt-2">
            {provider.isActive ? (
              <span className="flex items-center text-green-600 text-xs">
                <CheckCircle size={12} className="mr-1" />
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
              {provider.name}
            </h3>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              {provider.rating ? (
                <span className="text-sm font-medium text-gray-700">
                  {provider.rating.average.toFixed(1)} stars (
                  {provider.rating.count} reviews)
                </span>
              ) : (
                <span className="text-sm text-gray-400">No ratings yet</span>
              )}
            </div>
          </div>

          <div className="mt-1 space-y-1">
            <div className="flex items-center text-sm text-gray-600">
              <Mail className="w-4 h-4 mr-2" />
              {provider.email}
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
                  {provider.services.slice(0, 3).map((service) => (
                    <span
                      key={service._id}
                      className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-md"
                    >
                      {service.name}
                    </span>
                  ))}
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

      <div className="mt-6 flex items-center justify-between">
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setSelectedProvider(provider);
              setView("detail");
            }}
            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Eye className="w-4 h-4 mr-1" />
            View
          </button>
          <button
            onClick={() => {
              setSelectedProvider(provider);
              loadProviderSchedule(provider._id);
              setView("schedule");
            }}
            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <Calendar className="w-4 h-4 mr-1" />
            Schedule
          </button>
        </div>

        <div className="flex space-x-1">
          <button
            onClick={() => {
              setEditingProvider(provider);
              setView("edit-provider");
            }}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
);