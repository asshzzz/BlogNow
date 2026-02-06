// src/api.js

const API_URL = "http://localhost:8000/api/v1";
const API_URL2 = "http://localhost:8000/api";

export const api = {
  // ========== AUTH ==========
  login: async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error("Login failed");
      return res.json();
    } catch (err) {
      return { error: err.message };
    }
  },

  signup: async (name, email, password) => {
    try {
      const res = await fetch(`${API_URL}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      if (!res.ok) throw new Error("Signup failed");
      return res.json();
    } catch (err) {
      return { error: err.message };
    }
  },

  getProfile: async (token) => {
    try {
      const res = await fetch(`${API_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch profile");
      return res.json();
    } catch (err) {
      return { error: err.message };
    }
  },

  // ========== BLOGS ==========
  getBlogs: async (token) => {
    try {
      const res = await fetch(`${API_URL2}/blogs`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error("Failed to fetch blogs");
      return res.json();
    } catch (err) {
      return { error: err.message };
    }
  },

  getBlog: async (id, token) => {
    try {
      const res = await fetch(`${API_URL2}/blogs/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error("Failed to fetch blog");
      return res.json();
    } catch (err) {
      return { error: err.message };
    }
  },

  createBlog: async (data, token) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("content", data.content);
      if (data.image) {
        formData.append("image", data.image);
      }

      const res = await fetch(`${API_URL2}/blogs`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create blog");
      }
      return res.json();
    } catch (err) {
      return { error: err.message };
    }
  },

  updateBlog: async (id, data, token) => {
    try {
      console.log("Update URL:", `${API_URL2}/blogs/${id}`);
      console.log("Update Data:", data);
      const res = await fetch(`${API_URL2}/blogs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update blog");
      return res.json();
    } catch (err) {
      return { error: err.message };
    }
  },

  deleteBlog: async (id, token) => {
    try {
      const res = await fetch(`${API_URL2}/blogs/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete blog");
      return res.json();
    } catch (err) {
      return { error: err.message };
    }
  },

  // ========== MY BLOGS ==========
  getMyBlogs: async (token) => {
    try {
      const res = await fetch(`${API_URL2}/blogs/myblogs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch my blogs");
      return res.json();
    } catch (err) {
      return { error: err.message };
    }
  },

  // ============== AI ===============
  generateImage: async (prompt) => {
    try {
      console.log("🎨 Requesting image generation for:", prompt);
      
      const res = await fetch(`${API_URL2}/ai/generate-image`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Image generation failed");
      }

      const data = await res.json();
      console.log("✅ Image generated:", data);
      
      return data;
    } catch (err) {
      console.error("❌ Image generation error:", err);
      return { error: err.message };
    }
  },
};