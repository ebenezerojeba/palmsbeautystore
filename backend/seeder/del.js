import mongoose from "mongoose";
import dotenv from "dotenv";
import productModel from "../models/productModel.js";
import serviceModel from "../models/serviceModel.js";
import appointmentModel from "../models/appointment.js";
import orderModel from "../models/orderModel.js";
import connectDB from "../config/mongodb.js";

dotenv.config();
await connectDB();

const clearData = async () => {
  try {
    await productModel.deleteMany();
    await serviceModel.deleteMany();
    await appointmentModel.deleteMany();
    await orderModel.deleteMany();

    console.log("🗑️ Dummy data removed successfully.");
    process.exit();
  } catch (err) {
    console.error("❌ Failed to remove dummy data:", err.message);
    process.exit(1);
  }
};

await clearData();
