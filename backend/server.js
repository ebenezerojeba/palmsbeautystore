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
// job.start();
// connectDB();
// connectCloudinary();

// // CORS Configuration
// // CORS Configuration
// const corsOptions = {
//   origin: [
//     'https://palmsbeautystore-n6eq.vercel.app',
//     'http://localhost:3000', // For local development
//     // Add other domains as needed
//   ],
//   credentials: true,
//   optionsSuccessStatus: 200
// };

// // Middleware
// app.use(cors(corsOptions))

// app.use(cors({
//   origin: true,
//   credentials: true
// }));


// // Handle preflight requests
// app.options('*', cors(corsOptions));
// // Middleware
// app.use(cors());
// app.use(express.static(path.join(__dirname, 'frontend', 'build')));
// app.use(express.json());

// // API Endpoint
// // Make sure this is BEFORE routes
// // app.use('/uploads', express.static('uploads'));

// // Serve uploads folder publicly
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// app.use("/api/appointment", appointmentRouter);
// app.use("/api/admin", adminRouter);

// // API Endpoints
// app.use('/api/user', userRouter)
// app.use('/api/product', productRouter)
// app.use('/api/cart', cartRouter)
// app.use('/api/order', orderRouter)
// app.use('/api/subscribe', subscribeRouter)
// app.use('/api/services', serviceRouter)
// app.use('/api/business', businessRouter)
// app.use('/api/staff', staffRouter)
// app.use('/api/provider', providerRouter)


// // Serve .ics files for download

// // app.get("/", (req, res) => {
// //   res.send("API Working Perfctly");
// // });

// app.get('*', (req, res) => {
//   res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
// });

// app.listen(port, () => {
//   console.log(`Server started on port: ${port}`);
// });

















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

// Start services
job.start();
connectDB();
connectCloudinary();

// CORS Configuration - SINGLE, COMPREHENSIVE SETUP
const allowedOrigins = [
  'https://palmsbeautystore-n6eq.vercel.app',
  'https://palmsbeautyadmin.onrender.com',
  'https://palmsbeautystore-backend.onrender.com', // Add your backend domain too
  'http://localhost:3000',
  'http://localhost:3001', // In case you use different ports
  'http://127.0.0.1:3000',
  // Add your actual production domains here
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'X-Access-Token',
    'token', // Add the token header that your frontend is using
    'Token', // Also add capitalized version just in case
    'x-auth-token',
    'Access-Control-Allow-Headers',
    'Access-Control-Allow-Origin'
  ],
  exposedHeaders: ['token', 'Token'], // Also expose these headers in responses
  optionsSuccessStatus: 200
};

// Apply CORS middleware ONCE
app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options('*', cors(corsOptions));

// Other middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve uploads folder publicly
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Add error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes - Add logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

app.use("/api/appointment", appointmentRouter);
app.use("/api/admin", adminRouter);
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);
app.use('/api/subscribe', subscribeRouter);
app.use('/api/services', serviceRouter);
app.use('/api/business', businessRouter);
app.use('/api/staff', staffRouter);
app.use('/api/provider', providerRouter);

// Serve static files for production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'frontend', 'build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.json({ 
      success: true, 
      message: "API Working Perfectly",
      environment: process.env.NODE_ENV || 'development'
    });
  });
}

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: `API endpoint not found: ${req.path}` 
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error' 
  });
});

app.listen(port, () => {
  console.log(`Server started on port: ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Allowed origins:`, allowedOrigins);
});