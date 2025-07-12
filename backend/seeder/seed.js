import mongoose from "mongoose";
import dotenv from "dotenv";
import { faker } from "@faker-js/faker";
import productModel from "../models/productModel.js";
import appointmentModel from "../models/appointment.js";
import orderModel from "../models/orderModel.js";
import serviceModel from "../models/serviceModel.js";
import connectDB from "../config/mongodb.js";


dotenv.config();
await connectDB(); // If connectDB returns a promise

const generateProducts = (count = 20) => {
  const categories = {
    Clothing: ["T-Shirts", "Jackets", "Jeans", "Shoes"],
    Accessories: ["Bags", "Watches", "Sunglasses"],
    Beauty: ["Skincare", "Makeup", "Perfume"],
  };
  const sizes = ["S", "M", "L", "XL", "XXL"];

  return Array.from({ length: count }).map(() => {
    const category = faker.helpers.objectKey(categories);
    const subCategory = faker.helpers.arrayElement(categories[category]);
    return {
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: faker.number.int({ min: 3000, max: 25000 }),
      image: [
        faker.image.urlPicsumPhotos(),
        faker.image.urlPicsumPhotos(),
        faker.image.urlPicsumPhotos(),
      ],
      category,
      subCategory,
      sizes: faker.helpers.arrayElements(sizes, faker.number.int({ min: 1, max: 3 })),
      bestSeller: faker.datatype.boolean(),
    };
  });
};

const generateServices = (count = 5) =>
  Array.from({ length: count }).map(() => ({
    title: faker.person.jobTitle(),
    description: faker.lorem.sentences(2),
    duration: `${faker.number.int({ min: 30, max: 120 })} mins`,
    price: faker.commerce.price(5000, 20000, 0),
    image: faker.image.urlPicsumPhotos(),
    imagePublicId: faker.string.uuid(),
    isActive: true,
    isCategory: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));


const generateAppointments = (services, count = 10) =>
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

const generateOrders = (products, count = 8) =>
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
  lga: faker.location.city(), // ✅ Fixed
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
    const services = await serviceModel.insertMany(generateServices(15));
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
