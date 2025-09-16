import { Plus, X } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

const ServiceSelection = ({ serviceInfo, selectedServices, setSelectedServices, allServices }) => {
  // Move service-related state and functions here
  const [showAddService, setShowAddService] = useState(false);
  

    const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };


  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0 && mins > 0) {
      return `${hours}h ${mins}m`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return `${mins}m`;
    }
  };
    const addService = (service) => {
      const isAlreadySelected = selectedServices.some(s => s._id === service._id);
      if (!isAlreadySelected) {
        const serviceToAdd = {
          ...service,
          _id: service._id,
          title: service.title,
          duration: parseInt(service.duration) || 90, // Consistent parsing
          price: parseFloat(service.price) || 0
        };
  
        setSelectedServices(prev => [...prev, serviceToAdd]);
        setShowAddService(false);
  
        // Reset date/time when services change
        setSelectedDate("");
        setSelectedTime("");
  
        toast.success(`${service.title} added to your appointment`);
      } else {
        toast.info("This service is already selected");
      }
    };
  
  
// Remove service from selection
  const removeService = (serviceId) => {
    if (selectedServices.length === 1) {
      toast.warn("You must have at least one service selected");
      return;
    }

    setSelectedServices(selectedServices.filter(s => s._id !== serviceId));
    setSelectedDate("");
    setSelectedTime("");
    toast.success("Service removed from appointment");
  };

const formatCad = (amount) => {
  if (!amount) return "$0.00";
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    currencyDisplay: "narrowSymbol", // shows "$" instead of "CA$"
    minimumFractionDigits: 2,
  }).format(amount);
};


  
  return (
            
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Selected Services ({selectedServices.length})
                  </h3>
                  <button
                    onClick={() => setShowAddService(true)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Plus className="h-4 w-4" />
                    {/* Add Service */}
                  </button>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {selectedServices.map((service) => (
                  <div key={service._id} className="p-6">
                    <div className="flex items-start justify-between">
                          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* {serviceInfo.image && (
                <div className="h-48 sm:h-64">
                  <img
                    src={serviceInfo.image}
                    alt={serviceInfo.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                
              )} */}
             



            </div>
                      <div className="flex-1">
                        <h4 className="text-base font-medium text-gray-900">
                          {service.title}
                        </h4>
                        <p className="text-sm text-gray-500 mt-1">
                          {service.description}
                        </p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-sm text-gray-500">
                            {formatDuration(service.duration || 90)}
                          </span>
                          <span className="text-base font-medium text-gray-900">
                            {formatCad(service.price)}
                          </span>
                        </div>
                      </div>
                      {selectedServices.length > 1 && (
                        <button
                          onClick={() => removeService(service._id)}
                          className="ml-4 p-1 text-gray-400 hover:text-red-500"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
               {/* Add Service Modal */}
                    {showAddService && (
                      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
                          <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                              <h3 className="text-lg font-semibold text-gray-900">
                                Add Another Service
                              </h3>
                              <button
                                onClick={() => setShowAddService(false)}
                                className="p-2 text-gray-400 hover:text-gray-600"
                              >
                                <X className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
              
                          <div className="p-6 overflow-y-auto max-h-[60vh]">
                            <div className="space-y-4">
                              {allServices
                                .filter(service => !selectedServices.some(s => s._id === service._id))
                                .map((service) => (
                                  <div key={service._id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                                    <div className="flex items-start justify-between">
                                      <div className="flex-1">
                                        <h4 className="font-medium text-gray-900">{service.title}</h4>
                                        <p className="text-sm text-gray-500 mt-1">{service.description}</p>
                                        <div className="flex items-center space-x-4 mt-2">
                                          <span className="text-sm text-gray-500">
                                            {formatDuration(service.duration)}
                                          </span>
                                          <span className="text-sm font-medium text-gray-900">
                                            {formatCad(service.price)}
                                          </span>
                                        </div>
              
                                        {/* Add provider availability info */}
                                        <div className="mt-2 text-xs text-gray-500">
                                          Available with {service.providers?.length || 0} stylists
                                        </div>
                                      </div>
                                      <button
                                        onClick={() => addService(service)}
                                        className="ml-4 px-4 py-2 bg-pink-800 text-white rounded-lg hover:bg-pink-700 transition-colors text-sm font-medium"
                                      >
                                        Add
                                      </button>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
              
            </div>
  );
};

export default ServiceSelection;