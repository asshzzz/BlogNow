import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path, { dirname, join } from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// ✅ Load environment variables FIRST
dotenv.config();

const app = express();

// ✅ Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ✅ CORS Configuration - IMPORTANT
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"], // Both Vite ports
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

app.use(express.json({ limit: "50mb" })); // ✅ Increased for Base64 images
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

// ✅ Serve static files (public folder)
app.use(express.static("public"));

// ✅ CRITICAL: Serve uploads folder with proper headers
app.use("/uploads", (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  res.setHeader("Cache-Control", "public, max-age=31536000"); // Cache for 1 year
  next();
}, express.static(join(__dirname, "uploads")));

// ✅ Debug route - Test uploads folder
app.get("/test-upload", (req, res) => {
  const uploadsPath = join(__dirname, "uploads");
  res.json({ 
    message: "Uploads path",
    path: uploadsPath,
    exists: require('fs').existsSync(uploadsPath)
  });
});

// ✅ Health check route for Stability AI
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    stabilityApiConfigured: !!process.env.STABILITY_API_KEY,
    timestamp: new Date().toISOString()
  });
});

// ✅ Routes for user
import userRoutes from "./routes/user.routes.js";
app.use("/api/v1/users", userRoutes);

// ✅ Routes for blog
import blogRoutes from "./routes/blog.routes.js";
app.use("/api/blogs", blogRoutes);

// ✅ Routes for AI API (existing)
import aiRoutes from "./routes/stability.routes.js";
app.use("/api/ai", aiRoutes);

// ✅ NEW: Routes for Stability AI Image Generation
import stabilityRoutes from "./routes/stability.routes.js";
app.use("/api/stability", stabilityRoutes);

// ✅ Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

// ✅ 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

export { app };