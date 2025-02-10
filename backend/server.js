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
// Middleware
app.use(cors());
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
