import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Edit3, Plus, Calendar, User, Home, Trash2, ImageOff } from "lucide-react";
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

  // ✅ Image URL handler
  const getImageUrl = (imageField) => {
    if (!imageField) return null;

    if (imageField.startsWith("data:image")) {
      return imageField;
    }

    if (imageField.startsWith("http://") || imageField.startsWith("https://")) {
      return imageField;
    }

    if (imageField.startsWith("/uploads")) {
      return `https://blognow-ckae.onrender.com${imageField}`;
    }

    return `https://blognow-ckae.onrender.com/uploads/${imageField}`;
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
    if (!window.confirm("Are you sure you want to delete this blog? This action cannot be undone.")) {
      return;
    }

    setDeletingId(blogId);

    try {
      const res = await api.deleteBlog(blogId, token);

      if (res.error) {
        toast.error(res.error);
        return;
      }

      setBlogs(blogs.filter(blog => blog._id !== blogId));
      toast.success("Blog deleted successfully");

    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete blog");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Back to Home */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#6B7280] hover:text-[#111827] transition-colors mb-8 group"
        >
          <Home className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight text-[#111827] mb-1">
            My Blogs
          </h1>
          <p className="text-[#6B7280] text-sm">
            Manage the stories you've published.
          </p>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-2 border-[#1F2937] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : blogs.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-14 h-14 rounded-full bg-[#F3F4F6] flex items-center justify-center mb-5">
              <BookOpen className="w-6 h-6 text-[#9CA3AF]" />
            </div>
            <h3 className="text-lg font-semibold text-[#111827] mb-2">No blogs yet</h3>
            <p className="text-sm text-[#6B7280] mb-6 max-w-sm">
              You haven't published anything yet. Start writing your first story.
            </p>
            <Link
              to="/create"
              className="inline-flex items-center gap-2 bg-[#111827] text-white text-sm font-medium py-2.5 px-5 rounded-full hover:bg-[#1F2937] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create your first blog
            </Link>
          </div>
        ) : (
          <>
            {/* Blogs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog) => {
                const imageUrl = getImageUrl(blog.image);

                return (
                  <div
                    key={blog._id}
                    className="group bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden hover:border-[#D1D5DB] hover:shadow-md transition-all duration-200 flex flex-col"
                  >
                    {/* Image */}
                    <div className="relative w-full h-44 bg-[#F3F4F6] overflow-hidden">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={blog.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.target.style.display = "none";
                            const parent = e.target.parentElement;
                            if (parent) {
                              parent.innerHTML = `
                                <div class="w-full h-full flex flex-col items-center justify-center bg-[#F3F4F6] text-[#9CA3AF]">
                                  <p class="text-xs font-medium">Image not available</p>
                                </div>
                              `;
                            }
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-[#9CA3AF]">
                          <ImageOff className="w-6 h-6 mb-2" />
                          <p className="text-xs font-medium">No image</p>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col flex-1">
                      <h2 className="text-base font-semibold text-[#111827] mb-2 leading-snug line-clamp-2">
                        {blog.title}
                      </h2>

                      <p className="text-sm text-[#6B7280] leading-relaxed line-clamp-3 mb-4">
                        {blog.content}
                      </p>

                      <div className="flex items-center justify-between text-xs text-[#9CA3AF] mb-5 mt-auto">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(blog.createdAt)}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5" />
                          By you
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 pt-4 border-t border-[#F3F4F6]">
                        <Link
                          to={`/edit/${blog._id}`}
                          className="flex-1 flex items-center justify-center gap-1.5 text-sm font-medium text-[#374151] border border-[#E5E7EB] py-2 rounded-lg hover:bg-[#F9FAFB] hover:border-[#D1D5DB] transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          Edit
                        </Link>

                        <button
                          onClick={() => handleDelete(blog._id)}
                          disabled={deletingId === blog._id}
                          className="flex-1 flex items-center justify-center gap-1.5 text-sm font-medium text-[#DC2626] border border-[#FCA5A5]/60 py-2 rounded-lg hover:bg-[#FEF2F2] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {deletingId === blog._id ? (
                            <div className="w-3.5 h-3.5 border-2 border-[#DC2626]/30 border-t-[#DC2626] rounded-full animate-spin"></div>
                          ) : (
                            <>
                              <Trash2 className="w-3.5 h-3.5" />
                              Delete
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Create New Blog */}
            <div className="text-center mt-12">
              <Link
                to="/create"
                className="inline-flex items-center gap-2 bg-[#111827] text-white text-sm font-medium py-2.5 px-6 rounded-full hover:bg-[#1F2937] transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create new blog
              </Link>
            </div>

            {/* Stats */}
            <div className="text-center mt-10 pt-8 border-t border-[#E5E7EB]">
              <p className="text-sm text-[#6B7280]">
                <span className="font-semibold text-[#111827]">{blogs.length}</span>{" "}
                {blogs.length === 1 ? "blog" : "blogs"} published
              </p>
            </div>
          </>
        )}
      </div>

      <style jsx>{`
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