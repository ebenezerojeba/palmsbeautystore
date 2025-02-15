import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import appointmentRouter from "./routes/appointmentRoute.js";
import adminRouter from "./routes/adminRoute.js";

// App Config
const app = express();

const port = process.env.PORT || 3000;
connectDB();

// CORS Configuration
const corsOptions = {
  origin: [
    'http://localhost:5173',  // Your local frontend URL
    'http://localhost:5174',  // Your local frontend URL
    'https://palmsbeautystore.vercel.app',
    'https://palmsbeautystore.onrender.com',
    'https://palmsbeautyadmin.onrender.com'
    //  // Your deployed frontend URL
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  // credentials: true // If you're using cookies or authentication headers
};


// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// API Endpoint
app.use("/api/appointment", appointmentRouter);
app.use("/api/admin", adminRouter);

// Serve .ics files for download

app.get("/", (req, res) => {
  res.send("API Working");
});

app.listen(port, () => {
  console.log(`Server started on port: ${port}`);
});
