// import businessHoursModel from "../models/businessModel.js";


// // Get Business Hour
// const getHours = async (req,res) => {
//     try {
//     const hours = await businessHoursModel.find().sort({ dayOfWeek: 1 });
//     res.json({ businessHours: hours });
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to fetch business hours' });
//   }
// }

// // Update Businnes Hour
// const updateHours = async (req, res) => {
//      try {
//     const { businessHours } = req.body;
    
//     // Clear existing hours
//     await businessHoursModel.deleteMany({});
    
//     // Insert new hours
//     await businessHoursModel.insertMany(businessHours);
    
//     res.json({ message: 'Business hours updated successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to update business hours' });
//   }
// }

// const defaultHours = async (req, res) => {
//      try {
//        const defaultHours = [
//       { dayOfWeek: 0, isOpen: false, openTime: '09:00', closeTime: '17:00', slotDuration: 90 }, // Sunday (closed)
//       { dayOfWeek: 1, isOpen: true, openTime: '09:00', closeTime: '17:00', slotDuration: 90 }, // Monday
//       { dayOfWeek: 2, isOpen: true, openTime: '09:00', closeTime: '17:00', slotDuration: 90 }, // Tuesday
//       { dayOfWeek: 3, isOpen: true, openTime: '09:00', closeTime: '17:00', slotDuration: 90 }, // Wednesday
//       { dayOfWeek: 4, isOpen: true, openTime: '09:00', closeTime: '17:00', slotDuration: 90 }, // Thursday
//       { dayOfWeek: 5, isOpen: true, openTime: '09:00', closeTime: '17:00', slotDuration: 90 }, // Friday
//       { dayOfWeek: 6, isOpen: true, openTime: '12:00', closeTime: '16:00', slotDuration: 90 }, // Saturday
//     ];

//     await businessHoursModel.deleteMany({});
//     await businessHoursModel.insertMany(defaultHours);
    
//     res.json({ message: 'Default business hours created' });
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to create default hours' });
//   }
// }


// // Cache for business hours (in-memory cache for better performance)
// let businessHoursCache = null;
// let cacheExpiry = null;
// const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

// const getBusinessHours = async () => {
//   const now = Date.now();
  
//   // Return cached data if still valid
//   if (businessHoursCache && cacheExpiry && now < cacheExpiry) {
//     return businessHoursCache;
//   }
  
//   // Fetch fresh data
//   const businessHours = await businessHoursModel.find().sort({ dayOfWeek: 1 });
  
//   // Update cache
//   businessHoursCache = businessHours;
//   cacheExpiry = now + CACHE_DURATION;
  
//   return businessHours;
// };

// export {getHours, updateHours, defaultHours, getBusinessHours}


import businessHoursModel from "../models/businessModel.js";


// Get Business Hour
const getHours = async (req,res) => {
    try {
    const hours = await businessHoursModel.find().sort({ dayOfWeek: 1 });
    res.json({ businessHours: hours });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch business hours' });
  }
}

// Update Businnes Hour
const updateHours = async (req, res) => {
     try {
    const { businessHours } = req.body;
    
    // Clear existing hours
    await businessHoursModel.deleteMany({});
    
    // Insert new hours
    await businessHoursModel.insertMany(businessHours);
    
    res.json({ message: 'Business hours updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update business hours' });
  }
}

const defaultHours = async (req, res) => {
     try {
       const defaultHours = [
      { dayOfWeek: 0, isOpen: false, openTime: '09:00', closeTime: '17:00', slotDuration: 90 }, // Sunday (closed)
      { dayOfWeek: 1, isOpen: true, openTime: '09:00', closeTime: '17:00', slotDuration: 90 }, // Monday
      { dayOfWeek: 2, isOpen: true, openTime: '09:00', closeTime: '17:00', slotDuration: 90 }, // Tuesday
      { dayOfWeek: 3, isOpen: true, openTime: '09:00', closeTime: '17:00', slotDuration: 90 }, // Wednesday
      { dayOfWeek: 4, isOpen: true, openTime: '09:00', closeTime: '17:00', slotDuration: 90 }, // Thursday
      { dayOfWeek: 5, isOpen: true, openTime: '09:00', closeTime: '17:00', slotDuration: 90 }, // Friday
      { dayOfWeek: 6, isOpen: true, openTime: '12:00', closeTime: '16:00', slotDuration: 90 }, // Saturday
    ];

    await businessHoursModel.deleteMany({});
    await businessHoursModel.insertMany(defaultHours);
    
    res.json({ message: 'Default business hours created' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create default hours' });
  }
}


// Cache for business hours (in-memory cache for better performance)
let businessHoursCache = null;
let cacheExpiry = null;
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

const getBusinessHours = async () => {
  const now = Date.now();
  
  // Return cached data if still valid
  if (businessHoursCache && cacheExpiry && now < cacheExpiry) {
    return businessHoursCache;
  }
  
  // Fetch fresh data
  const businessHours = await businessHoursModel.find().sort({ dayOfWeek: 1 });
  
  // Update cache
  businessHoursCache = businessHours;
  cacheExpiry = now + CACHE_DURATION;
  
  return businessHours;
};

export {getHours, updateHours, defaultHours, getBusinessHours}