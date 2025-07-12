import mongoose from "mongoose";
import dotenv from "dotenv";
import { faker } from "@faker-js/faker";
import productModel from "../models/productModel.js";
import serviceModel from "../models/serviceModel.js";
import appointmentModel from "../models/appointment.js";
import orderModel from "../models/orderModel.js";
import connectDB from "../config/mongodb.js";


dotenv.config();
await connectDB();

const generateProducts = (count = 30) => {
  const categories = {
    Skincare: ["Cleansers", "Moisturizers", "Serums", "Sunscreens", "Treatments"],
    Makeup: ["Foundation", "Lipstick", "Eyeshadow", "Mascara", "Blush"],
    Fragrance: ["Perfume", "Cologne", "Body Spray", "Essential Oils"],
    HairCare: ["Shampoo", "Conditioner", "Styling", "Treatments"],
    Bodycare: ["Lotions", "Scrubs", "Oils", "Cleansers"],
  };

  const categorySizeMap = {
    Skincare: ["30ml", "50ml", "100ml"],
    Makeup: ["Small", "Medium", "Palette", "Full Size"],
    Fragrance: ["10ml", "30ml", "50ml", "100ml"],
    HairCare: ["250ml", "500ml", "1L"],
    Bodycare: ["100ml", "200ml", "500ml"],
  };

  const categoryKeys = Object.keys(categories);

  return Array.from({ count }).map(() => {
    const category = faker.helpers.arrayElement(categoryKeys);
    const subCategory = faker.helpers.arrayElement(categories[category]);
    const sizeOptions = categorySizeMap[category] || ["Standard"];
    const size = faker.helpers.arrayElement(sizeOptions);

    return {
      name: `${faker.commerce.productAdjective()} ${subCategory}`,
      description: faker.lorem.sentences(2),
      price: faker.number.int({ min: 3000, max: 25000 }),
      image: [
        faker.image.urlPicsumPhotos(),
        faker.image.urlPicsumPhotos(),
        faker.image.urlPicsumPhotos(),
      ],
      category,
      subCategory,
      size,
      bestSeller: faker.datatype.boolean(),
    };
  });
};



const generateServices = (count = 10) => {
  const serviceTitles = [
    "Hair Styling",
    "Makeup Session",
    "Beard Trim",
    "Hair Coloring",
    "Waxing",
    "Eyelash Extension",
  ];

  return Array.from({ length: count }).map(() => {
    const title = faker.helpers.arrayElement(serviceTitles);
    const duration = `${faker.number.int({ min: 30, max: 120 })} mins`;
    const price = faker.commerce.price(5000, 20000, 0).toString();

    return {
      title,
      description: faker.lorem.sentences(2),
      duration,
      price,
      image: faker.image.urlPicsumPhotos({ width: 640, height: 480 }),
      imagePublicId: faker.string.uuid(),
      isActive: true,
      isCategory: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });
};


const generateAppointments = (services, count = 15) =>
  Array.from({ length: count }).map(() => {
    const service = faker.helpers.arrayElement(services);
    return {
      serviceId: service._id.toString(),
      serviceTitle: service.title,
      date: faker.date.future(),
      time: `${faker.number.int({ min: 9, max: 17 })}:${faker.helpers.arrayElement(["00", "30"])}`,
      isCompleted: false,
      isPending: true,
      isCancelled: false,
      userDetails: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
      },
    };
  });

const generateOrders = (products, count = 15) =>
  Array.from({ length: count }).map(() => {
    const items = faker.helpers.arrayElements(products, faker.number.int({ min: 1, max: 3 }))
      .map(p => {
        const quantity = faker.number.int({ min: 1, max: 3 });
        return {
          product: p.name,
          quantity,
          size: faker.helpers.arrayElement(p.sizes),
          price: p.price,
          name: p.name,
        };
      });

    const amount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return {
      userId: null,
      items,
      amount,
      address: {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        addressLine: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        lga: faker.location.city(), // Fixed from citySuffix
        postalCode: faker.location.zipCode(),
        country: "Canada",
      },
      isPaid: true,
      status: "Order Placed",
      paymentMethod: faker.helpers.arrayElement(["Stripe", "Paystack", "Cash"]),
      payment: true,
      date: Math.floor(Date.now() / 1000),
      stripeSessionId: faker.string.uuid(),
      isGuestOrder: true,
      paymentStatus: "pending",
    };
  });

const seedData = async () => {
  try {
    await productModel.deleteMany();
    await serviceModel.deleteMany();
    await appointmentModel.deleteMany();
    await orderModel.deleteMany();

    const products = await productModel.insertMany(generateProducts(30));
    const services = await serviceModel.insertMany(generateServices(10));

    if (!services.length) throw new Error("No services inserted!");
    await appointmentModel.insertMany(generateAppointments(services, 15));

    await orderModel.insertMany(generateOrders(products, 15));

    console.log("✅ Dummy data seeded successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
};

await seedData();
