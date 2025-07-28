import serviceModel from "../models/serviceModel.js";

// Get all active services
const getAllServices = async (req, res) => {
     try {
    const services = await serviceModel.find({ isActive: true });
    res.json({ services });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Get Specific Service
const getServiceById = async (req, res) => {
    const { id } = req.params;

    try {
        const service = await serviceModel.findById(id).select('title description duration price image createdAt updatedAt');

        if (!service) {
            return res.status(404).json({ error: 'Service not found' });
        }

        res.json({ service });
    } catch (error) {
        console.error('Error fetching service:', error);
        res.status(500).json({ error: 'Failed to fetch service' });
    }
}


// Public Services
// In your serviceController.js
const publicServices = async (req, res) => {
  try {
    const categories = await serviceModel.find({ isCategory: true, isActive: true });
    const services = await serviceModel.find({ isCategory: false, isActive: true });

    const grouped = categories.map(category => ({
      ...category._doc,
      subServices: services.filter(s => s.parentService?.toString() === category._id.toString())
    }));

    res.json(grouped);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch services' });
  }
};


// Get only individual services (not categories)
const getOnlyServices = async (req, res) => {
  try {
    const services = await serviceModel.find({ isCategory: false, isActive: true });
    res.json({ services });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch services' });
  }
};




export {getAllServices, getServiceById, publicServices, getOnlyServices};