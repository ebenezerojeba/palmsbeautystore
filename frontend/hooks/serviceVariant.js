import { useState, useEffect } from 'react';
// import { serviceVariantApi } from '../api/serviceApi';
import { serviceVariantApi, isUsingVariants } from '../api/serviceApi';

export const useServiceVariants = () => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load main services
  const loadServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await serviceVariantApi.getMainServices();
      if (data.success) {
        setServices(data.services);
      } else {
        setError(data.message || 'Failed to load services');
      }
    } catch (err) {
      setError('Failed to load services');
      console.error(err);
    }
    setLoading(false);
  };

  // Load service details (variants and providers)
  const loadServiceDetails = async (serviceId) => {
    setLoading(true);
    setError(null);
    try {
      const [serviceData, providerData] = await Promise.all([
        serviceVariantApi.getServiceWithVariants(serviceId),
        serviceVariantApi.getProvidersForService(serviceId)
      ]);

      if (serviceData.success) {
        setSelectedService(serviceData.service);
      }
      if (providerData.success) {
        setProviders(providerData.providers);
      }
    } catch (err) {
      setError('Failed to load service details');
      console.error(err);
    }
    setLoading(false);
  };

  // Select a service
  const selectService = async (service) => {
    setSelectedService(service);
    setSelectedVariant(null);
    
    if (isUsingVariants(service)) {
      await loadServiceDetails(service._id);
    } else {
      // For traditional services, just load providers
      try {
        const providerData = await serviceVariantApi.getProvidersForService(service._id);
        if (providerData.success) {
          setProviders(providerData.providers);
        }
      } catch (err) {
        console.error('Failed to load providers:', err);
      }
    }
  };

  // Select a variant
  const selectVariant = (variant) => {
    setSelectedVariant(variant);
  };

  // Reset selection
  const resetSelection = () => {
    setSelectedService(null);
    setSelectedVariant(null);
    setProviders([]);
  };

  // Get current selection info
  const getCurrentSelection = () => {
    if (!selectedService) return null;

    const serviceInfo = {
      serviceId: selectedService._id,
      serviceName: selectedService.title,
      variantId: selectedVariant?._id || null,
      variantName: selectedVariant?.name || null,
      duration: selectedVariant?.duration || selectedService.duration,
      price: selectedVariant?.price || selectedService.price,
      description: selectedVariant?.description || selectedService.description,
      requirements: selectedVariant?.requirements || selectedService.requirements || []
    };

    return serviceInfo;
  };

  return {
    // State
    services,
    selectedService,
    selectedVariant,
    providers,
    loading,
    error,
    
    // Actions
    loadServices,
    selectService,
    selectVariant,
    resetSelection,
    getCurrentSelection,
    
    // Utilities
    isUsingVariants: selectedService ? isUsingVariants(selectedService) : false
  };
};