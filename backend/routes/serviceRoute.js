import express from 'express'
import { addServiceVariant, allProviderServices, deleteServiceVariant, getAllServices, getMainServices, getOnlyServices, getProvidersForService, getServiceById, getServiceProviders, getServicesByProvider, getServiceWithVariants, publicServices, updateServiceVariant } from '../controllers/serviceController.js';

const serviceRouter = express.Router();

serviceRouter.get('/all-services', getAllServices)
serviceRouter.get('/provider-services', allProviderServices)
serviceRouter.get('/only-services', getOnlyServices)
serviceRouter.get('/publicservices', publicServices) // Assuming you want to get public services, but the controller should handle it
serviceRouter.get('/services/:id', getServiceById) // Assuming you want to get a service by ID, but the controller should handle it


// Service variants routes
serviceRouter.get('/main', getMainServices); // Main services without variants
serviceRouter.get('/:serviceId/variants', getServiceWithVariants); // Get service with including variants
serviceRouter.post('/:serviceId/variants', addServiceVariant); // Post route to add service with variants
serviceRouter.put('/:serviceId/variants/:variantId', updateServiceVariant); // Put route to update service variant
serviceRouter.delete('/:serviceId/variants/:variantId', deleteServiceVariant); // Put route to update service variant
serviceRouter.get('/:serviceId/providers', getProvidersForService)
// New provider-related routes
serviceRouter.get('/provider/:providerId/services', getServicesByProvider);
serviceRouter.get('/services/:serviceId/providers', getServiceProviders);

export  default serviceRouter