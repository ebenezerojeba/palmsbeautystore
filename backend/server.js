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

// App Config
const app = express();

const port = process.env.PORT || 3000;
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
app.use("/api/appointment", appointmentRouter);
app.use("/api/admin", adminRouter);

// API Endpoints
app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)
app.use('/api/subscribe', subscribeRouter)
app.use('/api/services', serviceRouter)


// Serve .ics files for download

app.get("/", (req, res) => {
  res.send("API Working");
});

app.listen(port, () => {
  console.log(`Server started on port: ${port}`);
});
