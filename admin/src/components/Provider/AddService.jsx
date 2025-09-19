import { useState } from "react";

const AddServiceModal = ({ provider, services, onClose, onAdd }) => {
    const [selectedService, setSelectedService] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    const availableServices = services.filter(service =>
      !provider.services?.some(ps => ps._id === service._id)
    );

    const handleAdd = async () => {
      if (selectedService && !isAdding) {
        setIsAdding(true);
        try {
          await onAdd(provider._id, selectedService);
          onClose();
        } catch (error) {
          console.error('Error adding service:', error);
        } finally {
          setIsAdding(false);
        }
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Add Service to {provider.name}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              disabled={isAdding}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Service
            </label>
            {availableServices.length > 0 ? (
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                disabled={isAdding}
              >
                <option value="">Choose a service...</option>
                {availableServices.map(service => (
                  <option key={service._id} value={service._id}>
                    {service.title})
                  </option>
                ))}
              </select>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500 italic">
                  All available services have been assigned to this provider
                </p>
              </div>
            )}
          </div>

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              disabled={isAdding}
            >
              Cancel
            </button>
            {availableServices.length > 0 && (
              <button
                onClick={handleAdd}
                disabled={!selectedService || isAdding}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-lg hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {isAdding ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Adding...
                  </>
                ) : (
                  'Add Service'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  export default AddServiceModal