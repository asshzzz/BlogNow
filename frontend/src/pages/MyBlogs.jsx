import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Edit3, Plus, Sparkles, Calendar, User, Home, Trash2 } from "lucide-react";
import { api } from "../api";
import { toast } from "react-toastify";

export default function MyBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchBlogs = async () => {
      setIsLoading(true);
      const res = await api.getMyBlogs(token);
      if (res.error) {
        toast.error(res.error);
        setIsLoading(false);
        return;
      }
      console.log("📚 Fetched blogs:", res);
      setBlogs(res);
      setIsLoading(false);
    };

    fetchBlogs();
  }, [token]);

  // ✅ FIXED: Better image URL handler
  const getImageUrl = (imageField) => {
    if (!imageField) {
      console.log("⚠️ No image field");
      return null;
    }

    console.log("🖼️ Processing image:", imageField);

    // ✅ If it's a Base64 AI image
    if (imageField.startsWith("data:image")) {
      console.log("✅ Base64 AI image found");
      return imageField; // Return as-is
    }

    // If it's already a full URL
    if (imageField.startsWith("http://") || imageField.startsWith("https://")) {
      console.log("✅ Full URL:", imageField);
      return imageField;
    }

    // If it starts with /uploads
    if (imageField.startsWith("/uploads")) {
      const url = `https://blognow-ckae.onrender.com${imageField}`;
      console.log("✅ Relative URL converted:", url);
      return url;
    }

    // If it's just a filename
    const url = `https://blognow-ckae.onrender.com/uploads/${imageField}`;
    console.log("✅ Filename converted:", url);
    return url;
  };

  // ✅ Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return "Recently";
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // ✅ Delete blog handler
  const handleDelete = async (blogId) => {
    if (!window.confirm("⚠️ Are you sure you want to delete this blog? This action cannot be undone.")) {
      return;
    }

    setDeletingId(blogId);
    
    try {
      const res = await api.deleteBlog(blogId, token);
      
      if (res.error) {
        toast.error(res.error);
        return;
      }

      // Remove from state
      setBlogs(blogs.filter(blog => blog._id !== blogId));
      toast.success("🗑️ Blog deleted successfully!");
      
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete blog");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-pink-400 to-rose-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-40 w-96 h-96 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        <div className="absolute bottom-40 right-40 w-96 h-96 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-6000"></div>
      </div>

      <div className="relative z-10 p-4 md:p-8">
        {/* Back to Home Button */}
        <div className="absolute top-6 left-6 z-20">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 text-white font-semibold py-2.5 px-5 rounded-2xl shadow-xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Link>
        </div>

        {/* Header Section */}
        <div className="text-center mb-12 pt-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl mb-6 shadow-2xl">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent mb-4">
            My Blogs
          </h1>
          <p className="text-white/80 text-xl md:text-2xl font-light">
            Your creative journey awaits ✨
          </p>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-white/20 border-t-pink-400 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-purple-400 rounded-full animate-spin animation-delay-1000"></div>
            </div>
          </div>
          ) : blogs.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20">
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-12 max-w-md text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-gray-400 to-gray-500 rounded-2xl mb-6 shadow-lg">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">No Blogs Yet</h3>
              <p className="text-white/70 text-lg mb-8">
                Start your writing journey and create your first masterpiece!
              </p>
              <Link
                to="/create"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white font-bold py-3 px-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <Plus className="w-5 h-5" />
                <span>Create Your First Blog</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Blogs Grid */
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog, index) => {
                const imageUrl = getImageUrl(blog.image);
                
                // Debug log for each blog
                console.log(`Blog ${index + 1}:`, {
                  title: blog.title,
                  imageField: blog.image,
                  imageUrl: imageUrl
                });

                return (
                  <div
                    key={blog._id}
                    className="group backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl overflow-hidden hover:bg-white/15 transition-all duration-500 transform hover:scale-[1.02] hover:shadow-3xl"
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animation: "fadeInUp 0.6s ease-out forwards",
                    }}
                  >
                    {/* ✅ FIXED: Image Section with better error handling */}
                    <div className="relative w-full h-56 overflow-hidden bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={blog.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onLoad={() => {
                            console.log("✅ Image loaded successfully:", imageUrl);
                          }}
                          onError={(e) => {
                            console.error("❌ Failed to load image:", imageUrl);
                            console.error("❌ Original image field:", blog.image);
                            
                            // Replace with placeholder
                            e.target.style.display = "none";
                            const parent = e.target.parentElement;
                            if (parent) {
                              parent.innerHTML = `
                                <div class="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-purple-600 to-pink-600 p-4">
                                  <svg class="w-16 h-16 mb-3 opacity-50 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
                                  </svg>
                                  <p class="text-sm font-semibold text-white mb-1">Image Not Available</p>
                                  <p class="text-xs text-white/70">Check console for details</p>
                                </div>
                              `;
                            }
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-purple-600 to-pink-600">
                          <svg className="w-16 h-16 mx-auto mb-3 opacity-50 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                          </svg>
                          <p className="text-lg font-semibold text-white">No Image</p>
                        </div>
                      )}

                      {/* Title Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                        <h2 className="text-xl font-bold text-white line-clamp-2">
                          {blog.title}
                        </h2>
                      </div>
                    </div>

                    {/* Blog Content */}
                    <div className="p-6 relative">
                      {/* Metadata */}
                      <div className="flex items-center justify-between mb-4 text-white/60 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(blog.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>By You</span>
                        </div>
                      </div>

                      {/* Content Preview */}
                      <p className="text-white/70 text-base leading-relaxed line-clamp-3 mb-6">
                        {blog.content}
                      </p>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-3">
                        <Link
                          to={`/edit/${blog._id}`}
                          className="flex-1 group/btn relative bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold py-3 px-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                        >
                          <Edit3 className="w-4 h-4 group-hover/btn:rotate-12 transition-transform duration-300" />
                          <span>Edit</span>
                        </Link>

                        <button
                          onClick={() => handleDelete(blog._id)}
                          disabled={deletingId === blog._id}
                          className="group/btn relative bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white font-bold py-3 px-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                          {deletingId === blog._id ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          ) : (
                            <>
                              <Trash2 className="w-4 h-4 group-hover/btn:rotate-12 transition-transform duration-300" />
                              <span>Delete</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Decorative Elements */}
                      <div className="absolute top-4 right-4 w-2 h-2 bg-pink-400 rounded-full opacity-60"></div>
                      <div className="absolute bottom-4 left-4 w-1 h-1 bg-purple-400 rounded-full opacity-40"></div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Create New Blog Button */}
            <div className="text-center mt-16">
              <Link
                to="/create"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 text-white font-bold py-4 px-8 rounded-3xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 text-lg"
              >
                <Plus className="w-6 h-6" />
                <span>Create New Blog</span>
                <Sparkles className="w-6 h-6" />
              </Link>
            </div>
          </div>
        )}

        {/* Footer Stats */}
        {blogs.length > 0 && (
          <div className="text-center mt-16 p-6 backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 max-w-md mx-auto">
            <p className="text-white/70 text-lg">
              📚 <span className="font-bold text-white">{blogs.length}</span>{" "}
              {blogs.length === 1 ? "Blog" : "Blogs"} Created
            </p>
            <p className="text-white/50 text-sm mt-2">
              Keep writing and sharing your amazing stories!
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-1000 {
          animation-delay: 1s;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animation-delay-6000 {
          animation-delay: 6s;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}