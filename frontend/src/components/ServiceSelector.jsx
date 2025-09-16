import React from 'react';
import { ChevronDown, User, Star } from 'lucide-react';

export const ServiceSelector = ({ 
  services, 
  onSelectService, 
  loading, 
  selectedService 
}) => {
  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-gray-200 h-24 rounded-lg"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Select a Service</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => (
          <div
            key={service._id}
            className={`bg-white rounded-lg shadow-md p-4 cursor-pointer transition-all duration-200 border-2 ${
              selectedService?._id === service._id 
                ? 'border-purple-500 bg-purple-50' 
                : 'border-transparent hover:border-purple-200'
            }`}
            onClick={() => onSelectService(service)}
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-medium text-gray-800">{service.title}</h3>
              {service.variantCount > 0 && (
                <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                  {service.variantCount} variants
                </span>
              )}
            </div>
            
            {service.description && (
              <p className="text-gray-600 text-sm mb-3">{service.description}</p>
            )}
            
            <div className="flex justify-between items-center text-sm text-gray-500">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-1" />
                {service.providers?.length || 0} providers
              </div>
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// components/VariantSelector.jsx
export const VariantSelector = ({ 
  service, 
  onSelectVariant, 
  selectedVariant,
  onBack 
}) => {
  if (!service || !service.variants || service.variants.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">
            Select a variant for {service.title}
          </h2>
          <p className="text-sm text-gray-500">Service ID: {service._id}</p>
        </div>
        <button
          onClick={onBack}
          className="text-purple-600 hover:text-purple-800 text-sm font-medium"
        >
          Change Service
        </button>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {service.variants.filter(v => v.isActive).map((variant) => (
          <div
            key={variant._id}
            className={`bg-white rounded-lg shadow-md p-4 cursor-pointer transition-all duration-200 border-2 ${
              selectedVariant?._id === variant._id 
                ? 'border-purple-500 bg-purple-50' 
                : 'border-transparent hover:border-purple-200'
            }`}
            onClick={() => onSelectVariant(variant)}
          >
            <h3 className="font-medium text-gray-800 mb-2">{variant.name}</h3>
            
            {variant.description && (
              <p className="text-gray-600 text-sm mb-3">{variant.description}</p>
            )}
            
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">{variant.duration}</span>
              <span className="text-green-600 font-medium">{variant.price}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};