import { useState, useEffect } from 'react';
import { User, Star, Loader2 } from 'lucide-react';

const BookingForm = ({ selectedServices, backendUrl }) => {
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [availableProviders, setAvailableProviders] = useState([]);
  const [loadingProviders, setLoadingProviders] = useState(false);
  const [providerError, setProviderError] = useState(null);

  // Auto-fetch providers when service is selected
  useEffect(() => {
    const fetchProvidersForService = async () => {
      // Only fetch if we have a selected service
      if (!selectedServices || selectedServices.length === 0) {
        setAvailableProviders([]);
        setSelectedProvider(null);
        return;
      }

      // Get the first service (or modify logic for multiple services)
      const serviceId = selectedServices[0]._id;
      
      try {
        setLoadingProviders(true);
        setProviderError(null);
        
        console.log(`Auto-fetching providers for service: ${serviceId}`);
        
        const queryParams = new URLSearchParams({
          serviceId: serviceId,
          date: new Date().toISOString().split('T')[0] // today's date
        });

        const res = await fetch(`${backendUrl}/api/provider?${queryParams.toString()}`);
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        
        if (data.success && data.providers) {
          setAvailableProviders(data.providers);
          console.log(`Found ${data.providers.length} providers for this service`);
          
          // Auto-select first provider if only one available
          if (data.providers.length === 1) {
            setSelectedProvider(data.providers[0]);
          } else {
            // Clear previous selection when multiple providers available
            setSelectedProvider(null);
          }
        } else {
          setAvailableProviders([]);
          setProviderError("No stylists available for this service");
        }
      } catch (err) {
        console.error("Error fetching providers:", err);
        setProviderError("Failed to load stylists");
        setAvailableProviders([]);
      } finally {
        setLoadingProviders(false);
      }
    };

    fetchProvidersForService();
  }, [selectedServices, backendUrl]);

  const handleProviderSelect = (provider) => {
    setSelectedProvider(provider);
    console.log('Provider selected:', provider.name);
  };

  return (
    <div className="booking-form">
      {/* Your existing service selection section */}
      
      {/* Provider Selection Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Select Your Stylist</h3>
        
        {!selectedServices || selectedServices.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <User className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Please select a service first</p>
          </div>
        ) : loadingProviders ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="animate-spin h-6 w-6 text-gray-400 mr-2" />
            <span className="text-gray-600">Loading stylists...</span>
          </div>
        ) : providerError ? (
          <div className="text-center py-8 text-red-500">
            <User className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>{providerError}</p>
          </div>
        ) : availableProviders.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <User className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No stylists available for the selected service</p>
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-600 mb-4">
              {availableProviders.length} stylist{availableProviders.length !== 1 ? 's' : ''} available for this service
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableProviders.map(provider => (
                <div
                  key={provider._id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                    selectedProvider?._id === provider._id
                      ? 'border-pink-500 bg-pink-50 ring-2 ring-pink-200'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                  onClick={() => handleProviderSelect(provider)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                      {provider.profileImage ? (
                        <img
                          src={provider.profileImage}
                          alt={provider.name}
                          className="w-16 h-16 rounded-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div 
                        className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center"
                        style={{ display: provider.profileImage ? 'none' : 'flex' }}
                      >
                        <User className="h-8 w-8 text-gray-400" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900">{provider.name}</h4>
                      <div className="flex items-center mt-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(provider.rating?.average || 0)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="text-sm text-gray-600 ml-1">
                          ({provider.rating?.count || 0})
                        </span>
                      </div>
                      {provider.bio && (
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {provider.bio}
                        </p>
                      )}
                    </div>
                  </div>
                  {selectedProvider?._id === provider._id && (
                    <div className="mt-3 text-center">
                      <span className="text-sm text-pink-600 font-medium">
                        ✓ Selected
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Rest of your booking form */}
      {selectedProvider && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-700">
            <span className="font-medium">Stylist selected:</span> {selectedProvider.name}
          </p>
        </div>
      )}

      {/* Your existing date/time selection and other form fields */}
    </div>
  );
};

export default BookingForm;