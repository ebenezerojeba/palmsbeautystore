
import serviceModel from "../models/serviceModel.js";
import providerModel from "../models/providerModel.js";
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 300 });

// Get all active services with providers populated
const getAllServices = async (req, res) => {
  try {
    const services = await serviceModel.find({ isActive: true })
      .populate('providers', 'name email profileImage rating'); // Populate provider info
    
    res.json({ services });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
// Get Specific Service with providers
const getServiceById = async (req, res) => {
  const { id } = req.params;

  try {
    const service = await serviceModel.findById(id)
      .select('title description duration price image createdAt updatedAt providers')
      .populate('providers', 'name email phone profileImage rating bio workingHours'); // Populate full provider info

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    res.json({ service });
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).json({ error: 'Failed to fetch service' });
  }
}


// In your serviceController.js
const publicServices = async (req, res) => {
  try {
    const categories = await serviceModel.find({ isCategory: true, isActive: true });
    const services = await serviceModel.find({ isCategory: false, isActive: true })

   const grouped = categories.map(category => ({
  ...category._doc,
  subServices: services.filter(
    s => s.parentService?.toString() === category._id.toString()
  ) || []
}));

    res.json(grouped);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch services' });
  }
};




// const publicServices = async (req, res) => {
//   try {
//     const cacheKey = 'public-services';
//     let groupedServices = cache.get(cacheKey);
    
//     if (groupedServices) {
//       console.log('✅ Serving services from cache');
//       return res.json(groupedServices);
//     }

//     console.log('🔄 Fetching services from database');
    
//      groupedServices = await serviceModel.aggregate([
//       {
//         $match: {
//           isActive: true,
//           $or: [
//             { isCategory: true },
//             { isCategory: false }
//           ]
//         }
//       },
//       {
//         $lookup: {
//           from: 'services', // your collection name
//           let: { categoryId: '$_id' },
//           pipeline: [
//             {
//               $match: {
//                 $expr: {
//                   $and: [
//                     { $eq: ['$isCategory', false] },
//                     { $eq: ['$isActive', true] },
//                     { $eq: ['$parentService', '$$categoryId'] }
//                   ]
//                 }
//               }
//             },
//             {
//               $project: {
//                 name: 1,
//                 description: 1,
//                 duration: 1,
//                 price: 1,
//                 image: 1,
//                 // include only fields you need
//               }
//             }
//           ],
//           as: 'subServices'
//         }
//       },
//       {
//         $match: {
//           isCategory: true
//         }
//       },
//       {
//         $project: {
//           name: 1,
//           description: 1,
//           image: 1,
//           subServices: 1,
//           // include other category fields you need
//         }
//       },
//       {
//         $sort: { name: 1 }
//       }
//     ]);

//     cache.set(cacheKey, groupedServices);
//     res.json(groupedServices);
//   } catch (error) {
//     console.error('Error fetching services:', error);
//     res.status(500).json({ message: 'Failed to fetch services' });
//   }
// };

export const clearServicesCache = () => {
  cache.del('public-services');
  console.log('🧹 Services cache cleared');
};




const allProviderServices = async (req, res) => {
  try {
   const services = await serviceModel.find({ isActive: true }).select('_id title price duration');
const mappedServices = services.map(service => ({
  _id: service._id,
  title: service.title,  // Map title to name
  price: service.price,
  duration: service.duration
}));
res.json(mappedServices);
  } catch (error) {
    console.error('Failed to fetch services:', error);
    res.status(500).json({ 
      message: 'Failed to fetch services',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get only individual services with providers
const getOnlyServices = async (req, res) => {
  try {
    const services = await serviceModel.find({ isCategory: false, isActive: true })
      .populate('providers', 'name profileImage rating');
    
    res.json({ services });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch services' });
  }
};

// Get services by provider ID
const getServicesByProvider = async (req, res) => {
  try {
    const { providerId } = req.params;
    
    // Validate provider exists
    const provider = await providerModel.findById(providerId);
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    // Find services that this provider offers
    const services = await serviceModel.find({
      providers: providerId,
      isActive: true
    }).populate('providers', 'name profileImage rating');

    res.json({ 
      success: true, 
      services,
      provider: {
        name: provider.name,
        profileImage: provider.profileImage,
        rating: provider.rating
      }
    });
  } catch (error) {
    console.error('Error fetching services by provider:', error);
    res.status(500).json({ message: 'Failed to fetch services' });
  }
};

// Get providers for a specific service
const getServiceProviders = async (req, res) => {
  try {
    const { serviceId } = req.params;
    
    const service = await serviceModel.findById(serviceId)
      .populate('providers', 'name email phone profileImage rating bio workingHours isActive');
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Filter out inactive providers
    const activeProviders = service.providers.filter(provider => provider.isActive);

    res.json({
      success: true,
      service: service.title,
      providers: activeProviders
    });
  } catch (error) {
    console.error('Error fetching service providers:', error);
    res.status(500).json({ message: 'Failed to fetch providers' });
  }
};

// Add these functions to your existing controller file

// Get all main services (categories)
export const getMainServices = async (req, res) => {
  try {
    const services = await serviceModel.find({
  isActive: true,
  isCategory: true
})
.select('title description image variants')
.populate('providers', 'name email isActive rating')
.populate('variants', 'title description price duration isActive') // populate sub-services
.sort({ title: 1 });


    // Add variant counts to each service
    const servicesWithCounts = services.map(service => ({
      ...service.toObject(),
      variantCount: service.variants ? service.variants.filter(v => v.isActive).length : 0
    }));

    res.json({
      success: true,
      services: servicesWithCounts,
      count: servicesWithCounts.length
    });
  } catch (error) {
    console.error("Error fetching main services:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch main services",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get service with all its variants by service ID
export const getServiceWithVariants = async (req, res) => {
  try {
    const { serviceId } = req.params;
    
    if (!serviceId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid service ID format"
      });
    }

    const service = await serviceModel.findOne({
      _id: serviceId,
      isActive: true
    })
    .populate('providers', 'name email isActive rating profileImage workingHours')
    .lean();

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found"
      });
    }

    // Filter only active variants
    const activeVariants = service.variants ? service.variants.filter(variant => variant.isActive) : [];

    res.json({
      success: true,
      service: {
        ...service,
        variants: activeVariants
      },
      variantCount: activeVariants.length,
      providerCount: service.providers ? service.providers.filter(p => p.isActive).length : 0
    });

  } catch (error) {
    console.error("Error fetching service with variants:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch service variants",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Add variant to existing service
export const addServiceVariant = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const { name, description, duration, price, requirements, difficulty } = req.body;

    if (!serviceId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid service ID format"
      });
    }

    const service = await serviceModel.findById(serviceId);
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found"
      });
    }

    // Check if variant with same name already exists
    const existingVariant = service.variants.find(v => 
      v.name.toLowerCase() === name.toLowerCase() && v.isActive
    );

    if (existingVariant) {
      return res.status(400).json({
        success: false,
        message: "A variant with this name already exists"
      });
    }

    // Create new variant
    const newVariant = {
      name,
      description,
      duration,
      price,
      requirements: requirements || [],
      difficulty: difficulty || 'Medium',
      isActive: true
    };

    service.variants.push(newVariant);
    await service.save();

    res.status(201).json({
      success: true,
      message: "Service variant added successfully",
      service: await service.populate('providers', 'name email isActive rating'),
      addedVariant: service.variants[service.variants.length - 1]
    });

  } catch (error) {
    console.error("Error adding service variant:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add service variant",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update service variant
export const updateServiceVariant = async (req, res) => {
  try {
    const { serviceId, variantId } = req.params;
    const updates = req.body;

    if (!serviceId.match(/^[0-9a-fA-F]{24}$/) || !variantId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format"
      });
    }

    const service = await serviceModel.findById(serviceId);
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found"
      });
    }

    const variantIndex = service.variants.findIndex(v => v._id.toString() === variantId);
    
    if (variantIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Variant not found"
      });
    }

    // Update variant fields
    Object.keys(updates).forEach(key => {
      if (key !== '_id' && updates[key] !== undefined) {
        service.variants[variantIndex][key] = updates[key];
      }
    });

    await service.save();

    res.json({
      success: true,
      message: "Service variant updated successfully",
      service: await service.populate('providers', 'name email isActive rating'),
      updatedVariant: service.variants[variantIndex]
    });

  } catch (error) {
    console.error("Error updating service variant:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update service variant",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Delete/deactivate service variant
export const deleteServiceVariant = async (req, res) => {
  try {
    const { serviceId, variantId } = req.params;

    if (!serviceId.match(/^[0-9a-fA-F]{24}$/) || !variantId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format"
      });
    }

    const service = await serviceModel.findById(serviceId);
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found"
      });
    }

    const variantIndex = service.variants.findIndex(v => v._id.toString() === variantId);
    
    if (variantIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Variant not found"
      });
    }

    // Soft delete - set isActive to false
    service.variants[variantIndex].isActive = false;
    await service.save();

    res.json({
      success: true,
      message: "Service variant deleted successfully",
      service: await service.populate('providers', 'name email isActive rating')
    });

  } catch (error) {
    console.error("Error deleting service variant:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete service variant",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get providers for a service (including all variants)
export const getProvidersForService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const { date, variantId } = req.query;

    if (!serviceId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid service ID format"
      });
    }

    const service = await serviceModel.findOne({
      _id: serviceId,
      isActive: true
    }).populate({
      path: 'providers',
      match: { isActive: true },
      select: 'name email phone bio profileImage rating workingHours services'
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found"
      });
    }

    let availableProviders = service.providers || [];

    // If date is provided, check availability
    if (date && availableProviders.length > 0) {
      const availabilityPromises = availableProviders.map(async (provider) => {
        const available = await checkProviderAvailability(provider._id, date);
        return { ...provider.toObject(), available };
      });
      
      availableProviders = await Promise.all(availabilityPromises);
    }

    res.json({
      success: true,
      service: {
        _id: service._id,
        title: service.title,
        description: service.description
      },
      providers: availableProviders,
      count: availableProviders.length,
      ...(variantId && {
        selectedVariant: service.variants.find(v => v._id.toString() === variantId)
      })
    });

  } catch (error) {
    console.error("Error fetching providers for service:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch providers for service",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export {
  getAllServices, 
  getServiceById, 
  publicServices, 
  getOnlyServices,
  getServicesByProvider,
  getServiceProviders,
  allProviderServices
};