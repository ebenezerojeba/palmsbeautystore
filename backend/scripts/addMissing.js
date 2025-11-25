import mongoose from 'mongoose';
import dotenv from 'dotenv';
import appointmentModel from '../models/appointment.js';
import userModel from '../models/userModel.js';
import providerModel from '../models/providerModel.js';
import connectDB from '../config/mongodb.js';

dotenv.config();

const deleteAndFixAppointments = async () => {
  try {
connectDB();

    // STEP 1: Delete ALL appointments on these specific dates/times
    console.log('\n🗑️  STEP 1: Deleting appointments...');
    
    const datesToDelete = [
      { date: '2025-12-02', time: '12:30' },
      { date: '2025-12-06', time: '21:15' },
      { date: '2025-12-06', time: '12:30' },
      { date: '2025-12-07', time: '09:15' },
    ];

    let deleted = 0;
    for (const apt of datesToDelete) {
      const result = await appointmentModel.deleteMany({
        date: apt.date,
        time: apt.time,
      });
      if (result.deletedCount > 0) {
        console.log(`✅ Deleted ${result.deletedCount} appointment(s) on ${apt.date} at ${apt.time}`);
        deleted += result.deletedCount;
      }
    }
    console.log(`\n🗑️  Total deleted: ${deleted}\n`);

    // STEP 2: Add correct appointments
    console.log('➕ STEP 2: Adding correct appointments...');
    
    // Get provider
    const provider = await providerModel.findOne({ isActive: true });
    if (!provider) {
      console.error('❌ No active provider found');
      await mongoose.connection.close();
      process.exit(1);
    }
    console.log(`👤 Using provider: ${provider.name}\n`);

    const correctAppointments = [
      {
        date: '2025-12-02',
        time: '12:30',
        userName: 'Imported User',
        serviceTitle: 'Golf French curl',
        duration: 540,
      },
      {
        date: '2025-12-06',
        time: '21:15',
        userName: 'Iman Iba',
        serviceTitle: 'Sew-in Leave outs',
        duration: 195,
      },
      {
        date: '2025-12-06',
        time: '12:30',
        userName: 'Adelaide Chirova',
        serviceTitle: 'Small size shoulder length boho braids',
        duration: 520,
      },
    ];

    let created = 0;

    for (const apt of correctAppointments) {
      try {
        // Find or create user
        let user = await userModel.findOne({
          name: new RegExp(`^${apt.userName.trim()}$`, 'i'),
        });

        if (!user) {
          user = await userModel.create({
            name: apt.userName,
            email: `${apt.userName.replace(/\s+/g, '_').toLowerCase()}_${Date.now()}@temp.com`,
            password: Math.random().toString(36).slice(-8),
            phone: '',
            isImported: true,
          });
          console.log(`✨ Created user: ${user.name}`);
        } else {
          console.log(`👤 Found user: ${user.name}`);
        }

        // Create appointment
        const newAppointment = await appointmentModel.create({
          userId: user._id,
          providerId: provider._id,
          providerName: provider.name,
          services: [{
            serviceId: new mongoose.Types.ObjectId(),
            serviceTitle: apt.serviceTitle,
            duration: apt.duration,
            price: 0,
            order: 1,
          }],
          serviceId: new mongoose.Types.ObjectId(),
          serviceTitle: apt.serviceTitle,
          userName: apt.userName,
          userEmail: user.email,
          userPhone: user.phone || '',
          date: apt.date,
          time: apt.time,
          totalDuration: apt.duration,
          clientNotes: 'Manually imported appointment',
          status: 'confirmed',
          isLongDuration: apt.duration > 480,
          isMultiDay: apt.duration >= 600,
          payment: {
            status: 'paid',
            amount: 0,
            currency: 'CAD',
            paymentMethod: 'manual_import',
            paymentDate: new Date(),
          },
          bookedAt: new Date(),
          confirmedAt: new Date(),
          createdBy: 'manual_import',
          importedFrom: 'manual',
          importedAt: new Date(),
        });

        created++;
        console.log(`✅ Created: ${apt.userName} | ${apt.serviceTitle} | ${apt.date} at ${apt.time} (${apt.duration} mins)`);
      } catch (error) {
        console.error(`❌ Failed to create appointment for ${apt.userName}:`, error.message);
      }
    }

    console.log('\n📊 Summary:');
    console.log(`🗑️  Deleted: ${deleted}`);
    console.log(`✅ Created: ${created}`);

    // Verify
    console.log('\n🔍 Verifying appointments in database...');
    for (const apt of correctAppointments) {
      const verify = await appointmentModel.findOne({
        date: apt.date,
        time: apt.time,
      });
      if (verify) {
        console.log(`✅ ${apt.date} ${apt.time} - ${verify.userName} - ${verify.serviceTitle}`);
      } else {
        console.log(`❌ Missing: ${apt.date} ${apt.time}`);
      }
    }

    await mongoose.connection.close();
    console.log('\n✅ Done!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Critical error:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

// deleteAndFixAppointments();