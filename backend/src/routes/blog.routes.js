// src/routes/blog.routes.js
import express from "express";
import upload from "../middlewares/upload.middleware.js";

import {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  getMyBlogs,
} from "../controllers/blog.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

// ➡️ Public Routes (no authentication required)
router.get("/", getAllBlogs);        // Get all blogs

// ➡️ Protected Routes (authentication required)
router.get("/myblogs", authMiddleware, getMyBlogs);  // Get user's blogs
router.get("/:id", getBlogById);     // Get single blog by ID

// ✅ FIXED: Create blog WITH image upload (multer middleware)
router.post("/", authMiddleware, upload.single("image"), createBlog);

// Update and Delete
router.put("/:id", authMiddleware, updateBlog);     // Update blog
router.delete("/:id", authMiddleware, deleteBlog);  // Delete blog

export default router;