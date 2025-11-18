import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/mongodb.js";
import appointmentRouter from "./routes/appointmentRoute.js";
import adminRouter from "./routes/adminRoute.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import subscribeRouter from "./routes/subscribeRoute.js";
import connectCloudinary from "./config/cloudinary.js";
import serviceRouter from "./routes/serviceRoute.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import businessRouter from "./routes/businessRoute.js";
import staffRouter from "./routes/staffRoute.js";
import providerRouter from "./routes/providerRoute.js";
import job from "./config/cronjob.js";
import compression from "compression";

dotenv.config();

// Get __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
// App Config
const app = express();

const port = process.env.PORT || 8000;
job.start();
connectDB();
connectCloudinary();
app.use(express.static(path.join(__dirname, "frontend", "build")));
app.use(express.json());
app.use(compression())
app.use(
  cors({
    origin: [
      "https://admin.palmsbeautystore.com",
      "https://palmsfrontend.fly.dev",
      "https://palmsadmin.fly.dev",
      "https://palmsbeautystore.com",
      "https://www.palmsbeautystore.com",
      'http://localhost:5174' ,
      'http://localhost:5173'
    ],
    credentials: true,
  })
);


// Serve uploads folder publicly
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/appointment", appointmentRouter);
app.use("/api/admin", adminRouter);

// API Endpoints
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/subscribe", subscribeRouter);
app.use("/api/services", serviceRouter);
app.use("/api/business", businessRouter);
app.use("/api/staff", staffRouter);
app.use("/api/provider", providerRouter);

// Serve .ics files for download

app.get("/", (req, res) => {
  res.send("API Working Perfctly");
});

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
});

app.listen(port, () => {
  console.log(`Server started on port: ${port}`);
});
