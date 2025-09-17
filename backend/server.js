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
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import businessRouter from "./routes/businessRoute.js";
import staffRouter from "./routes/staffRoute.js";
import providerRouter from "./routes/providerRoute.js";
import job from "./config/cronjob.js";

dotenv.config();

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


app.use(express.static(path.join(__dirname, 'frontend', 'build')));
app.use(express.json());

// CORS Configuration for testing (allow all origins)
app.use(
  cors({
    origin: "*", // allow all origins
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Handle preflight requests
app.options("*", cors());

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
app.use('/api/staff', staffRouter)
app.use('/api/provider', providerRouter)


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
















// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import connectDB from "./config/mongodb.js";
// import appointmentRouter from "./routes/appointmentRoute.js";
// import adminRouter from "./routes/adminRoute.js";
// import userRouter from "./routes/userRoute.js";
// import productRouter from "./routes/productRoute.js";
// import cartRouter from "./routes/cartRoute.js";
// import orderRouter from "./routes/orderRoute.js";
// import subscribeRouter from "./routes/subscribeRoute.js";
// import connectCloudinary from "./config/cloudinary.js";
// import serviceRouter from "./routes/serviceRoute.js";
// import path from 'path';
// import { fileURLToPath } from 'url';
// import fs from 'fs';
// import businessRouter from "./routes/businessRoute.js";
// import staffRouter from "./routes/staffRoute.js";
// import providerRouter from "./routes/providerRoute.js";
// import job from "./config/cronjob.js";

// dotenv.config();

// // Get __dirname equivalent
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Ensure uploads folder exists
// const uploadsDir = path.join(__dirname, 'uploads');
// if (!fs.existsSync(uploadsDir)) {
//   fs.mkdirSync(uploadsDir);
// }

// // App Config
// const app = express();
// const port = process.env.PORT || 3000;

// // Start services
// job.start();
// connectDB();
// connectCloudinary();

// // CORS Configuration - COMPREHENSIVE DOMAIN LIST
// const allowedOrigins = [
//   // Frontend domains (main store)
//   'https://palmsbeautystore.vercel.app',          // Frontend production
//   'https://palmsbeautystore-n6eq.vercel.app',     // Frontend production (alternative)
  
//   // Admin panel domains
//   'https://palmsbeautyadmin.onrender.com',        // Admin panel (current)
//   'https://palmsbeautyadmin.vercel.app',          // Admin panel (if moved to vercel)
  
//   // Backend domains (ALL your backend URLs)
//   'https://palmsbeauty-backend.vercel.app',       // Backend on Vercel
//   'https://palmsbeautystore-backend.onrender.com', // Backend on Render (main)
//   'https://palmsbeautystore-backend.vercel.app',  // Backend on Vercel (if exists)
  
//   // Development domains
//   'http://localhost:3000',
//   'http://localhost:3001', 
//   'http://localhost:4000',
//   'http://localhost:5000',
//   'http://localhost:5173',  // Vite default
//   'http://localhost:5174',  // Vite alternative
//   'http://127.0.0.1:3000',
//   'http://127.0.0.1:5173',
//   'http://127.0.0.1:4000',
//   'http://127.0.0.1:5000',
// ];

// const corsOptions = {
//   origin: function (origin, callback) {
//     // Allow requests with no origin (mobile apps, curl, postman, etc.)
//     if (!origin) return callback(null, true);
    
//     if (allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       console.log('CORS blocked origin:', origin);
//       callback(new Error('Not allowed by CORS policy'));
//     }
//   },
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
//   allowedHeaders: [
//     'Origin',
//     'X-Requested-With',
//     'Content-Type',
//     'Accept',
//     'Authorization',
//     'Cache-Control',
//     'X-Access-Token',
//     'token',
//     'Token',
//     'x-auth-token',
//     'Access-Control-Allow-Headers',
//     'Access-Control-Allow-Origin',
//     'X-Forwarded-For',
//     'X-Real-IP'
//   ],
//   exposedHeaders: ['token', 'Token'],
//   optionsSuccessStatus: 200,
//   maxAge: 86400 // Cache preflight for 24 hours
// };

// // Apply CORS middleware FIRST
// app.use(cors(corsOptions));

// // Handle preflight requests explicitly
// app.options('*', cors(corsOptions));

// // Add request logging BEFORE other middleware
// app.use((req, res, next) => {
//   console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - Origin: ${req.get('origin')}`);
//   next();
// });

// // Other middleware
// app.use(express.json({ limit: '50mb' }));
// app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// // Serve uploads folder publicly
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // Health check endpoint (should be early)
// app.get('/health', (req, res) => {
//   res.status(200).json({ 
//     success: true, 
//     message: 'Server is running',
//     timestamp: new Date().toISOString(),
//     cors: 'enabled'
//   });
// });

// // API Routes
// app.use("/api/appointment", appointmentRouter);
// app.use("/api/admin", adminRouter);
// app.use('/api/user', userRouter);
// app.use('/api/product', productRouter);
// app.use('/api/cart', cartRouter);
// app.use('/api/order', orderRouter);
// app.use('/api/subscribe', subscribeRouter);
// app.use('/api/services', serviceRouter);
// app.use('/api/business', businessRouter);
// app.use('/api/staff', staffRouter);
// app.use('/api/provider', providerRouter);

// // Serve static files for production
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, 'frontend', 'build')));
  
//   app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
//   });
// } else {
//   app.get('/', (req, res) => {
//     res.json({ 
//       success: true, 
//       message: "API Working Perfectly",
//       environment: process.env.NODE_ENV || 'development',
//       allowedOrigins: allowedOrigins
//     });
//   });
// }

// // 404 handler for API routes
// app.use('/api/*', (req, res) => {
//   res.status(404).json({ 
//     success: false, 
//     message: `API endpoint not found: ${req.path}` 
//   });
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error('Error details:', {
//     message: err.message,
//     stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
//     url: req.url,
//     method: req.method,
//     origin: req.get('origin')
//   });
  
//   // Handle CORS errors specifically
//   if (err.message.includes('CORS')) {
//     return res.status(403).json({ 
//       success: false, 
//       message: 'CORS policy violation',
//       origin: req.get('origin')
//     });
//   }
  
//   res.status(500).json({ 
//     success: false, 
//     message: 'Internal server error',
//     error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
//   });
// });

// // Global error handler
// app.use((error, req, res, next) => {
//   console.error('Unhandled error:', error);
//   res.status(500).json({ 
//     success: false, 
//     message: 'Internal server error' 
//   });
// });

// app.listen(port, () => {
//   console.log(`Server started on port: ${port}`);
//   console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
//   console.log(`Allowed origins:`, allowedOrigins);
// });