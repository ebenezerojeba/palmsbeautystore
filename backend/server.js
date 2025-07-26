import express from "express";
import cors from "cors";
import "dotenv/config";
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
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import job from "./config/cron.js";
import businessRouter from "./routes/businessRoute.js";

// Get __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// App Config
const app = express();

const port = process.env.PORT || 3000;
job.start();
connectDB();
connectCloudinary();

// CORS Configuration
// const corsOptions = {
//   origin: [
//     // 'http://localhost:5173',  // Your local frontend URL
//     // 'http://localhost:5174',  // Your local frontend URL
//     // 'https://palmsbeautystore.vercel.app',
//     // 'https://palmsbeautystore.onrender.com',
//     // 'https://palmsbeautyadmin.onrender.com'
//     //  // Your deployed frontend URL
//     "*"
//   ],
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   // credentials: true // If you're using cookies or authentication headers
// };


// Middleware
app.use(cors());
app.use(express.json());

// API Endpoint
// Make sure this is BEFORE routes
// app.use('/uploads', express.static('uploads'));

// Serve uploads folder publicly
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/api/appointment", appointmentRouter);
app.use("/api/admin", adminRouter);

// API Endpoints
app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)
app.use('/api/subscribe', subscribeRouter)
app.use('/api/services', serviceRouter)
app.use('/api/business', businessRouter)


// Serve .ics files for download

// app.get("/", (req, res) => {
//   res.send("API Working Perfctly");
// });

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
});


app.listen(port, () => {
  console.log(`Server started on port: ${port}`);
});
