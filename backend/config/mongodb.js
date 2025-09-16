import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => console.log("Database Connected"));
    await mongoose.connect(process.env.MONGO_URI);
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};

export default connectDB;






















// const connectDB = async () => {
//   try {
//     mongoose.connection.on("connected", () => console.log("Database Connected"));
    
//     const mongoURI = process.env.MONGO_URI;
    
//     if (!mongoURI || typeof mongoURI !== 'string') {
//       throw new Error("MongoDB URI is not defined or invalid");
//     }
    
//     // Replace the SRV connection string with standard format
//     const standardURI = mongoURI.replace('mongodb+srv://', 'mongodb://');
    
//     await mongoose.connect(standardURI, {
//       dbName: "Palmsbeauty",
//       useNewUrlParser: true,
//       useUnifiedTopology: true
//     });
    
//   } catch (error) {
//     console.error("Database connection failed:", error);
//     process.exit(1);
//   }
// };

// export default connectDB;