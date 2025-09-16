// // scripts/seedProviders.js
// import mongoose from 'mongoose';
// import connectDB from '../config/mongodb.js';
// import serviceModel from '../models/serviceModel.js';
// import providerModel from '../models/providerModel.js';

import serviceModel from "../models/serviceModel.js";

// // const seedProviders = async () => {
// //   try {
// //     // Connect to your database
// // connectDB();

// //     // Get all existing services
// //     const services = await serviceModel.find({});
    
// //     // Create providers
// //     const providers = [
// //       {
// //         name: 'Esther Palms',
// //         email: 'esther@palmsbeauty.com',
// //         phone: '+1234567890',
// //         bio: 'Specialized in braiding and hair extensions with 5 years of experience.',
// //         profileImage: '/images/providers/esther.jpg',
// //         services: [services[0]._id, services[1]._id], // Assign to first two services
// //         workingHours: [
// //           { dayOfWeek: 1, startTime: '09:00', endTime: '18:00', isWorking: true },
// //           { dayOfWeek: 2, startTime: '09:00', endTime: '18:00', isWorking: true },
// //           { dayOfWeek: 3, startTime: '09:00', endTime: '18:00', isWorking: true },
// //           { dayOfWeek: 4, startTime: '09:00', endTime: '18:00', isWorking: true },
// //           { dayOfWeek: 5, startTime: '09:00', endTime: '18:00', isWorking: true },
// //           { dayOfWeek: 6, startTime: '10:00', endTime: '16:00', isWorking: true },
// //           { dayOfWeek: 0, startTime: '00:00', endTime: '00:00', isWorking: false },
// //         ],
// //         rating: { average: 4.8, count: 47 }
// //       },
// //       {
// //         name: 'Sarah Johnson',
// //         email: 'sarah@palmsbeauty.com',
// //         phone: '+1234567891',
// //         bio: 'Expert in natural hair care and protective styling.',
// //         profileImage: '/images/providers/sarah.jpg',
// //         services: [services[1]._id, services[2]._id], // Assign to different services
// //         workingHours: [
// //           { dayOfWeek: 1, startTime: '10:00', endTime: '19:00', isWorking: true },
// //           { dayOfWeek: 2, startTime: '10:00', endTime: '19:00', isWorking: true },
// //           { dayOfWeek: 3, startTime: '10:00', endTime: '19:00', isWorking: true },
// //           { dayOfWeek: 4, startTime: '10:00', endTime: '19:00', isWorking: true },
// //           { dayOfWeek: 5, startTime: '10:00', endTime: '19:00', isWorking: true },
// //           { dayOfWeek: 6, startTime: '00:00', endTime: '00:00', isWorking: false },
// //           { dayOfWeek: 0, startTime: '11:00', endTime: '17:00', isWorking: true },
// //         ],
// //         rating: { average: 4.9, count: 32 }
// //       },
// //       {
// //         name: 'Michelle Chen',
// //         email: 'michelle@palmsbeauty.com',
// //         phone: '+1234567892',
// //         bio: 'Specialist in color treatments and creative styling.',
// //         profileImage: '/images/providers/michelle.jpg',
// //         services: [services[0]._id, services[2]._id, services[3]?._id], // Assign to multiple services
// //         workingHours: [
// //           { dayOfWeek: 1, startTime: '08:00', endTime: '17:00', isWorking: true },
// //           { dayOfWeek: 2, startTime: '08:00', endTime: '17:00', isWorking: true },
// //           { dayOfWeek: 3, startTime: '08:00', endTime: '17:00', isWorking: true },
// //           { dayOfWeek: 4, startTime: '08:00', endTime: '17:00', isWorking: true },
// //           { dayOfWeek: 5, startTime: '08:00', endTime: '17:00', isWorking: true },
// //           { dayOfWeek: 6, startTime: '09:00', endTime: '15:00', isWorking: true },
// //           { dayOfWeek: 0, startTime: '00:00', endTime: '00:00', isWorking: false },
// //         ],
// //         rating: { average: 4.7, count: 28 }
// //       }
// //     ];

// //     // Clear existing providers
// //     await providerModel.deleteMany({});
    
// //     // Insert new providers
// //     await providerModel.insertMany(providers);
    
// //     console.log('Providers seeded successfully!');
// //     process.exit(0);
// //   } catch (error) {
// //     console.error('Error seeding providers:', error);
// //     process.exit(1);
// //   }
// // };

// const assignProviders = async () => {
//   try {
//     connectDB();
//     const services = await serviceModel.find({});
//     const providers = await providerModel.find({});
    
//     // Assign each provider to some services
//     for (const provider of providers) {
//       // Assign this provider to 2-3 random services
//       const randomServices = services
//         .sort(() => 0.5 - Math.random())
//         .slice(0, Math.floor(Math.random() * 2) + 2);
      
//       for (const service of randomServices) {
//         if (!service.providers.includes(provider._id)) {
//           service.providers.push(provider._id);
//           await service.save();
//         }
        
//         if (!provider.services.includes(service._id)) {
//           provider.services.push(service._id);
//           await provider.save();
//         }
//       }
//     }
    
//     console.log('Providers assigned to services successfully!');
//     process.exit(0);
//   } catch (error) {
//     console.error('Error assigning providers:', error);
//     process.exit(1);
//   }
// };

// assignProviders();

// // seedProviders();

// Migration script to convert existing hierarchical services to variant
 const migrateServicesToVariants = async () => {
  try {
    // Find all parent services (categories)
    const parentServices = await serviceModel.find({
      isCategory: true,
      parentService: { $exists: false }
    });

    for (const parent of parentServices) {
      // Find all child services
      const childServices = await serviceModel.find({
        parentService: parent._id,
        isCategory: false
      });

      // Convert child services to variants
      const variants = childServices.map(child => ({
        name: child.title,
        description: child.description,
        duration: child.duration,
        price: child.price,
        requirements: child.requirements || [],
        isActive: child.isActive
      }));

      // Update parent service with variants
      parent.variants = variants;
      parent.isCategory = true;
      await parent.save();

      // Optionally remove child services
      // await serviceModel.deleteMany({ parentService: parent._id });
    }

    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  }
};

migrateServicesToVariants();

