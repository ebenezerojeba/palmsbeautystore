

const backendUrl = import.meta.env.VITE_BACKEND_URL

// New variant-related functions
export const serviceVariantApi = {
  // Get all main services (categories)
  getMainServices: async () => {
    try {
      const response = await fetch(`${backendUrl}/services/main`);
      console.log(backendUrl);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching main services:', error);
      throw error;
    }
  },

  // Get service with its variants
  getServiceWithVariants: async (serviceId) => {
    try {
      const response = await fetch(`${backendUrl}/services/${serviceId}/variants`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching service variants:', error);
      throw error;
    }
  },

  // Get providers for a service
  getProvidersForService: async (serviceId, params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.date) queryParams.append('date', params.date);
    if (params.variantId) queryParams.append('variantId', params.variantId);

    try {
      const response = await fetch(`${backendUrl}/services/${serviceId}/providers?${queryParams}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching providers for service:', error);
      throw error;
    }
  },

  // Migration endpoint (for development/admin)
  runMigration: async () => {
    try {
      const response = await fetch(`${backendUrl}/migrate/services-to-variants`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error running migration:', error);
      throw error;
    }
  }
};

// Utility function to check if using variants or traditional services
export const isUsingVariants = (service) => {
  return service && service.variants && service.variants.length > 0;
};

// Get service display data (works with both variants and traditional)
export const getServiceDisplayData = (service, variantId = null) => {
  if (isUsingVariants(service)) {
    if (variantId) {
      const variant = service.variants.find(v => v._id === variantId);
      return {
        id: service._id, // Same service ID for all variants
        variantId: variant?._id,
        title: service.title,
        name: variant?.name || service.title,
        description: variant?.description || service.description,
        duration: variant?.duration || service.duration,
        price: variant?.price || service.price,
        requirements: variant?.requirements || service.requirements || [],
        isVariant: true
      };
    }
    return {
      id: service._id,
      title: service.title,
      description: service.description,
      variants: service.variants,
      isVariant: true,
      hasVariants: true
    };
  }

  // Traditional service
  return {
    id: service._id,
    title: service.title,
    name: service.title,
    description: service.description,
    duration: service.duration,
    price: service.price,
    requirements: service.requirements || [],
    isVariant: false
  };
};