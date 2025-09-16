// import { Loader2, Star, User, X } from "lucide-react";
// import { useEffect, useState } from "react";
// import { format } from "date-fns"; // Make sure you have date-fns installed

// const ProviderSelectionModal = ({
//   showProviderSelection,
//   setShowProviderSelection,
//   selectedProvider,
//   setSelectedProvider,
//   serviceId,
//   selectedDate,
//   backendUrl
// }) => {
//   const [providersList, setProvidersList] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const handleProviderSelection = (provider) => {
//     setSelectedProvider(provider);
//     setShowProviderSelection(false);
//   };

//   // Main fetch function for providers based on service
//   useEffect(() => {
//     const fetchProvidersForModal = async () => {
//       if (!showProviderSelection || !serviceId) {
//         return;
//       }

//       try {
//         setIsLoading(true);
//         setError(null);

//         const queryParams = new URLSearchParams({
//           serviceId: serviceId,
//           date: selectedDate || format(new Date(), 'yyyy-MM-dd')
//         });

//         console.log(`Fetching providers for service: ${serviceId}`);
//         const res = await fetch(`${backendUrl}/api/provider?${queryParams.toString()}`);

//         if (!res.ok) {
//           throw new Error(`HTTP error! status: ${res.status}`);
//         }

//         const data = await res.json();
//         console.log('Provider fetch response:', data);

//         if (data.success) {
//           setProvidersList(data.providers || []);

//           // Optional: Auto-select first provider if only one available
//           if (data.providers && data.providers.length === 1) {
//             console.log('Auto-selecting single provider:', data.providers[0].name);
//             // Uncomment below if you want auto-selection
//             setSelectedProvider(data.providers[0]);
//             setShowProviderSelection(false);
//           }
//         } else {
//           console.error("Failed to load providers:", data.message);
//           setError(data.message || "Failed to load providers for this service");
//           setProvidersList([]);
//         }
//       } catch (err) {
//         console.error("Error fetching providers:", err);
//         setError("Network error while loading providers");
//         setProvidersList([]);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchProvidersForModal();
//   }, [showProviderSelection, serviceId, selectedDate, backendUrl]);

//   // Fallback function to load all providers
//   const fetchAllProviders = async () => {
//     try {
//       setIsLoading(true);
//       setError(null);

//       console.log("Fetching all available providers as fallback");
//       const res = await fetch(`${backendUrl}/api/provider`);

//       if (!res.ok) {
//         throw new Error(`HTTP error! status: ${res.status}`);
//       }

//       const data = await res.json();

//       if (data.success) {
//         setProvidersList(data.providers || []);
//         console.log(`Loaded ${data.providers?.length || 0} providers as fallback`);
//       } else {
//         setError("Failed to load any providers");
//         setProvidersList([]);
//       }
//     } catch (err) {
//       console.error("Error fetching all providers:", err);
//       setError("Failed to load providers");
//       setProvidersList([]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
//         <div className="p-6 border-b border-gray-200">
//           <div className="flex items-center justify-between">
//             <h3 className="text-lg font-semibold text-gray-900">
//               Select Your Stylist
//             </h3>
//             <button
//               onClick={() => setShowProviderSelection(false)}
//               className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
//             >
//               <X className="h-5 w-5" />
//             </button>
//           </div>
//           {serviceId && (
//             <p className="text-sm text-gray-500 mt-1">
//               Service ID: {serviceId}
//             </p>
//           )}
//         </div>

//         <div className="p-6 overflow-y-auto max-h-[60vh]">
//           {isLoading ? (
//             <div className="flex justify-center items-center py-8">
//               <Loader2 className="animate-spin h-8 w-8 text-gray-400 mr-2" />
//               <span className="text-gray-600">Loading stylists...</span>
//             </div>
//           ) : error ? (
//             <div className="text-center py-8 text-red-500">
//               <User className="h-12 w-12 mx-auto mb-3 opacity-50" />
//               <p className="font-medium">{error}</p>
//               <button
//                 className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
//                 onClick={fetchAllProviders}
//               >
//                 Try Loading All Stylists
//               </button>
//             </div>
//           ) : providersList.length === 0 ? (
//             <div className="text-center py-8 text-gray-500">
//               <User className="h-12 w-12 mx-auto mb-3 opacity-50" />
//               <p className="font-medium">No stylists available for this service</p>
//               <p className="text-sm mt-1">This service may not have assigned stylists yet</p>
//               <button
//                 className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors font-medium"
//                 onClick={fetchAllProviders}
//               >
//                 Show All Available Stylists
//               </button>
//             </div>
//           ) : (
//             <div>
//               <div className="mb-4">
//                 <p className="text-sm text-gray-600">
//                   Found {providersList.length} stylist{providersList.length !== 1 ? 's' : ''} for this service
//                 </p>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {providersList.map(provider => (
//                   <div
//                     key={provider._id}
//                     className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${selectedProvider?._id === provider._id
//                         ? 'border-pink-500 bg-pink-50 ring-2 ring-pink-200'
//                         : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
//                       }`}
//                     onClick={() => handleProviderSelection(provider)}
//                   >
//                     <div className="flex items-center space-x-4">
//                       <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
//                         {provider.profileImage ? (
//                           <img
//                             src={provider.profileImage}
//                             alt={provider.name}
//                             className="w-16 h-16 rounded-full object-cover"
//                             onError={(e) => {
//                               e.target.style.display = 'none';
//                               e.target.nextSibling.style.display = 'flex';
//                             }}
//                           />
//                         ) : null}
//                         <div
//                           className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center"
//                           style={{ display: provider.profileImage ? 'none' : 'flex' }}
//                         >
//                           <User className="h-8 w-8 text-gray-400" />
//                         </div>
//                       </div>
//                       <div className="flex-1 min-w-0">
//                         <h4 className="font-medium text-gray-900 truncate">{provider.name}</h4>
//                         <div className="flex items-center mt-1">
//                           {Array.from({ length: 5 }).map((_, i) => (
//                             <Star
//                               key={i}
//                               className={`h-4 w-4 ${i < Math.floor(provider.rating?.average || 0)
//                                   ? 'text-yellow-400 fill-current'
//                                   : 'text-gray-300'
//                                 }`}
//                             />
//                           ))}
//                           <span className="text-sm text-gray-600 ml-1">
//                             ({provider.rating?.count || 0})
//                           </span>
//                         </div>
//                         {provider.bio && (
//                           <p className="text-sm text-gray-500 mt-1 truncate">
//                             {provider.bio}
//                           </p>
//                         )}
//                         {provider.services && provider.services.length > 0 && (
//                           <p className="text-xs text-gray-400 mt-1">
//                             {provider.services.length} service{provider.services.length !== 1 ? 's' : ''}
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                     {selectedProvider?._id === provider._id && (
//                       <div className="mt-3 text-center">
//                         <span className="text-sm text-pink-600 font-medium">
//                           ✓ Selected
//                         </span>
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Footer with action buttons */}
//         <div className="p-4 border-t border-gray-200 bg-gray-50">
//           <div className="flex justify-between items-center">
//             <button
//               onClick={() => setShowProviderSelection(false)}
//               className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
//             >
//               Cancel
//             </button>
//             {selectedProvider && (
//               <div className="text-sm text-gray-600">
//                 Selected: <span className="font-medium">{selectedProvider.name}</span>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProviderSelectionModal;











import { Loader2, Star, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { format } from "date-fns"; // Make sure you have date-fns installed

const ProviderSelectionModal = ({
  showProviderSelection,
  setShowProviderSelection,
  selectedProvider,
  setSelectedProvider,
  serviceId,
  selectedDate,
  backendUrl
}) => {
  const [providersList, setProvidersList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleProviderSelection = (provider) => {
    setSelectedProvider(provider);
    setShowProviderSelection(false);
  };

  // Main fetch function for providers based on service
  useEffect(() => {
    const fetchProvidersForModal = async () => {
      if (!showProviderSelection || !serviceId) {
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        const queryParams = new URLSearchParams({
          serviceId: serviceId,
          date: selectedDate || format(new Date(), 'yyyy-MM-dd')
        });

        console.log(`Fetching providers for service: ${serviceId}`);
        const res = await fetch(`${backendUrl}/api/provider?${queryParams.toString()}`);
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        console.log('Provider fetch response:', data);

        if (data.success) {
          setProvidersList(data.providers || []);
          
          // Optional: Auto-select first provider if only one available
          if (data.providers && data.providers.length === 1) {
            console.log('Auto-selecting single provider:', data.providers[0].name);
            // Uncomment below if you want auto-selection
            // setSelectedProvider(data.providers[0]);
            // setShowProviderSelection(false);
          }
        } else {
          console.error("Failed to load providers:", data.message);
          setError(data.message || "Failed to load providers for this service");
          setProvidersList([]);
        }
      } catch (err) {
        console.error("Error fetching providers:", err);
        setError("Network error while loading providers");
        setProvidersList([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProvidersForModal();
  }, [showProviderSelection, serviceId, selectedDate, backendUrl]);

  // Fallback function to load all providers
  const fetchAllProviders = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log("Fetching all available providers as fallback");
      const res = await fetch(`${backendUrl}/api/provider/all`);
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();

      if (data.success) {
        setProvidersList(data.providers || []);
        console.log(`Loaded ${data.providers?.length || 0} providers as fallback`);
      } else {
        setError("Failed to load any providers");
        setProvidersList([]);
      }
    } catch (err) {
      console.error("Error fetching all providers:", err);
      setError("Failed to load providers");
      setProvidersList([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Select Your Stylist
            </h3>
            <button 
              onClick={() => setShowProviderSelection(false)} 
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          {serviceId && (
            <p className="text-sm text-gray-500 mt-1">
              Service ID: {serviceId}
            </p>
          )}
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="animate-spin h-8 w-8 text-gray-400 mr-2" />
              <span className="text-gray-600">Loading stylists...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">
              <User className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="font-medium">{error}</p>
              <button 
                className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors" 
                onClick={fetchAllProviders}
              >
                Try Loading All Stylists
              </button>
            </div>
          ) : providersList.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <User className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="font-medium">No stylists available for this service</p>
              <p className="text-sm mt-1">This service may not have assigned stylists yet</p>
              <button 
                className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors font-medium" 
                onClick={fetchAllProviders}
              >
                Show All Available Stylists
              </button>
            </div>
          ) : (
            <div>
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  Found {providersList.length} stylist{providersList.length !== 1 ? 's' : ''} for this service
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {providersList.map(provider => (
                  <div
                    key={provider._id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                      selectedProvider?._id === provider._id
                        ? 'border-pink-500 bg-pink-50 ring-2 ring-pink-200'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                    }`}
                    onClick={() => handleProviderSelection(provider)}
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
                        <h4 className="font-medium text-gray-900 truncate">{provider.name}</h4>
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
                          <p className="text-sm text-gray-500 mt-1 truncate">
                            {provider.bio}
                          </p>
                        )}
                        {provider.services && provider.services.length > 0 && (
                          <p className="text-xs text-gray-400 mt-1">
                            {provider.services.length} service{provider.services.length !== 1 ? 's' : ''}
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

        {/* Footer with action buttons */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <button
              onClick={() => setShowProviderSelection(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            {selectedProvider && (
              <div className="text-sm text-gray-600">
                Selected: <span className="font-medium">{selectedProvider.name}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderSelectionModal;