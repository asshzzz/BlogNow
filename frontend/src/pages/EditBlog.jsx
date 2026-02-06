import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Edit3, Trash2, Save, ArrowLeft, Sparkles } from "lucide-react";
import { api } from "../api";
import { toast } from "react-toastify";

export default function EditBlog() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Fetch blog details on mount
  useEffect(() => {
    const fetchBlog = async () => {
      const res = await api.getBlog(id, token);
      if (res.error) {
        toast.error(res.error);
        return;
      }
      setTitle(res.title);
      setContent(res.content);
    };
    fetchBlog();
  }, [id, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const res = await api.updateBlog(id, { title, content }, token);
    if (res.error) {
      toast.error(res.error);
      setIsLoading(false);
      return;
    }

    toast.success("Blog updated successfully!");
    setIsLoading(false);
    navigate("/myblogs");
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    
    setIsDeleteLoading(true);
    const res = await api.deleteBlog(id, token);
    if (res.error) {
      toast.error(res.error);
      setIsDeleteLoading(false);
      return;
    }

    toast.success("Blog deleted successfully!");
    setIsDeleteLoading(false);
    navigate("/myblogs");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          {/* Back button */}
          <button
            onClick={() => navigate("/myblogs")}
            className="mb-6 flex items-center gap-2 text-white/80 hover:text-white transition-colors duration-300 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="font-medium">Back to My Blogs</span>
          </button>

          {/* Main card */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8 md:p-12">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-500 to-violet-500 rounded-2xl mb-4 shadow-lg">
                <Edit3 className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent mb-2">
                Edit Your Blog
              </h1>
              <p className="text-white/70 text-lg">
                Craft your story with style ✨
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title input */}
              <div className="group">
                <label className="flex items-center gap-2 text-white/90 font-semibold mb-3">
                  <Sparkles className="w-4 h-4" />
                  Blog Title
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter your amazing title..."
                  className="w-full bg-white/10 border border-white/20 rounded-2xl px-6 py-4 text-white placeholder-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-300 group-hover:bg-white/15"
                  required
                />
              </div>

              {/* Content textarea */}
              <div className="group">
                <label className="flex items-center gap-2 text-white/90 font-semibold mb-3">
                  <Edit3 className="w-4 h-4" />
                  Blog Content
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Tell your story here... Make it extraordinary!"
                  rows={8}
                  className="w-full bg-white/10 border border-white/20 rounded-2xl px-6 py-4 text-white placeholder-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-300 resize-none group-hover:bg-white/15"
                  required
                />
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                {/* Update button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 relative group bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <div className="flex items-center justify-center gap-2">
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Updating...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        <span>Update Blog</span>
                      </>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                </button>

                {/* Delete button */}
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleteLoading}
                  className="flex-1 relative group bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <div className="flex items-center justify-center gap-2">
                    {isDeleteLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Deleting...</span>
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-5 h-5" />
                        <span>Delete Blog</span>
                      </>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-rose-400 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                </button>
              </div>
            </form>

            {/* Footer message */}
            <div className="text-center mt-8 p-4 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-white/70 text-sm">
                💡 <span className="font-semibold text-white/90">Pro tip:</span> Take your time to craft something amazing. Your readers will love it!
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}