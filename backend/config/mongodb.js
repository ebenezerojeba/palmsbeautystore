import { configDotenv } from "dotenv";
import mongoose from "mongoose";


const connectDB = async (params) => {
    mongoose.connection.on("connected", () => console.log("DataBase Connected"))
    await mongoose.connect(`${process.env.MONGO_URI}/Palmsbeauty`)
}

export default connectDB;