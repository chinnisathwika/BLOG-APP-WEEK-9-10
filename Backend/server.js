import exp from "express";
import { connect } from "mongoose";
import { config } from "dotenv";
import { userRoute } from "./APIs/UserAPI.js";
import cookieParser from "cookie-parser";
import { adminRoute } from "./APIs/AdminAPI.js";
import { authorRoute } from "./APIs/AuthorAPI.js";
import { commonRouter } from "./APIs/CommonAPI.js";
import cors from "cors";

// Load environment variables
config(); 

const app = exp();
const PORT = process.env.PORT || 4000;

// Configure allowed CORS origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://blog-app-week-9-10.vercel.app",
  ...(process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(",").map((origin) => origin.trim()) : []),
];

const isAllowedOrigin = (origin) => {
  if (!origin) return true; // Allows tools like Postman or server-to-server requests
  if (allowedOrigins.includes(origin)) return true;

  try {
    const url = new URL(origin);
    // Allow Vercel preview deployments dynamically
    return url.protocol === "https:" && url.hostname.startsWith("blog-app-week-9-10-") && url.hostname.endsWith(".vercel.app");
  } catch {
    return false;
  }
};

// Use CORS middleware with explicit header support
app.use(
  cors({
    origin(origin, callback) {
      if (isAllowedOrigin(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  }),
);

// Body parser and cookie parser middlewares
app.use(exp.json());
app.use(cookieParser());

// Base landing route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Blog API is running",
    frontend: "https://blog-app-week-9-10.vercel.app",
    endpoints: ["/user-api", "/author-api", "/admin-api", "/common-api"],
  });
});

// Connect application sub-routers
app.use("/user-api", userRoute);
app.use("/author-api", authorRoute);
app.use("/admin-api", adminRoute);
app.use("/common-api", commonRouter);

// Handle invalid application paths
app.use((req, res, next) => {
  console.log(`404 - Invalid Path: ${req.url}`);
  res.status(404).json({ message: `${req.url} is an invalid path` });
});

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error("Error encountered:", {
    name: err.name,
    code: err.code,
    message: err.message
  });

  // Mongoose validation error
  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "error occurred",
      error: err.message,
    });
  }

  // Mongoose cast error (e.g., invalid ObjectIds)
  if (err.name === "CastError") {
    return res.status(400).json({
      message: "error occurred",
      error: err.message,
    });
  }

  // Handle Mongoose duplicate key codes (Error Code: 11000)
  const errCode = err.code ?? err.cause?.code ?? err.errorResponse?.code;
  const keyValue = err.keyValue ?? err.cause?.keyValue ?? err.errorResponse?.keyValue;

  if (errCode === 11000 && keyValue) {
    const field = Object.keys(keyValue)[0];
    const value = keyValue[field];
    return res.status(409).json({
      message: "error occurred",
      error: `${field} "${value}" already exists`,
    });
  }

  // Handle explicitly thrown custom status errors
  if (err.status) {
    return res.status(err.status).json({
      message: "error occurred",
      error: err.message,
    });
  }

  // Fallback default server error
  res.status(500).json({
    message: "error occurred",
    error: "Server side error",
  });
});

// Asynchronous MongoDB connection setup
const connectDB = async () => {
  try {
    if (!process.env.DB_URL) {
      throw new Error("DB_URL is missing inside your environment configuration (.env) file.");
    }
    await connect(process.env.DB_URL);
    console.log("DB connection success");
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
  }
};

// Start MongoDB and the Express Server independently
connectDB();

app.listen(PORT, () => {
  console.log(`🚀 Server actively listening on port ${PORT}`);
});