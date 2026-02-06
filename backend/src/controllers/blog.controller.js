// src/controllers/blog.controller.js
import Blog from "../models/blog.model.js";

// ➡️ Create Blog
export const createBlog = async (req, res) => {
  try {
    const { title, content, aiImageUrl } = req.body; // ✅ AI image URL bhi accept karo

    if (!title || !content) {
      return res.status(400).json({ msg: "Title and content are required" });
    }

    let imagePath = null;

    // ✅ Check if multer file uploaded hai
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
      console.log("📁 Multer file uploaded:", imagePath);
    }
    // ✅ Check if AI-generated image URL hai
    else if (aiImageUrl) {
      // AI URL directly save kar do
      imagePath = aiImageUrl;
      console.log("🤖 AI image URL saved:", imagePath);
    }

    const blog = new Blog({
      title,
      content,
      author: req.user.id,
      image: imagePath,
    });

    await blog.save();
    console.log("✅ Blog created with image:", imagePath);
    res.status(201).json(blog);
  } catch (err) {
    console.error("❌ Create blog error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ➡️ Get All Blogs
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate("author", "name email");
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ➡️ Get Blog by ID
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("author", "name email");
    if (!blog) return res.status(404).json({ msg: "Blog not found" });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ➡️ Get all my blogs
export const getMyBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.user.id }).populate("author", "name email");
    
    if (!blogs || blogs.length === 0) {
      return res.status(404).json({ msg: "No blogs found for this user" });
    }

    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ➡️ Update Blog
export const updateBlog = async (req, res) => {
  try {
    const { title, content } = req.body;

    let blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ msg: "Blog not found" });

    // sirf author update kar sakta hai
    if (blog.author.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    blog.title = title || blog.title;
    blog.content = content || blog.content;

    await blog.save();
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ➡️ Delete Blog
export const deleteBlog = async (req, res) => {
  try {
    let blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ msg: "Blog not found" });

    // sirf author delete kar sakta hai
    if (blog.author.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    await blog.deleteOne();
    res.json({ msg: "Blog deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};