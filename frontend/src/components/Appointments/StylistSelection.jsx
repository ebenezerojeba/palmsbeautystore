import { Calendar, Star, User } from "lucide-react";

const StylistSelection = ({ 
  selectedProvider, 
  setSelectedProvider, 
  providers, 
  setShowProviderSelection,
  fetchProviderSchedule 
}) => {
    
  return (
       <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Select Your Stylist</h3>
                  </div>
    
                  <div className="flex items-center space-x-4">
                    {selectedProvider ? (
                      <div className="flex items-center space-x-3 p-3 bg-pink-50 border border-pink-200 rounded-lg flex-1">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                          {selectedProvider.profileImage ? (
                            <img src={selectedProvider.profileImage} alt={selectedProvider.name} className="w-12 h-12 rounded-full object-cover" />
                          ) : (
                            <User className="h-6 w-6 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{selectedProvider.name}</h4>
                          <div className="flex items-center mt-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${i < Math.floor(selectedProvider.rating?.average || 0)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                                  }`}
                              />
                            ))}
                            <span className="text-xs text-gray-600 ml-1">
                              ({selectedProvider.rating?.count || 0})
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => setShowProviderSelection(true)}
                          className="text-pink-600 hover:text-pink-800 text-sm font-medium"
                        >
                          Change
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowProviderSelection(true)}
                        className="flex items-center text-pink-600 hover:text-pink-800 p-3 border border-dashed border-gray-300 rounded-lg flex-1"
                      >
                        <User className="h-5 w-5 mr-2" />
                        Select a stylist
                      </button>
                    )}
    
                    {selectedProvider && (
                      <button
                        onClick={() => fetchProviderSchedule(selectedProvider._id)}
                        className="p-3 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg"
                        title="View schedule"
                      >
                        <Calendar className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
  );
};

export default StylistSelection;