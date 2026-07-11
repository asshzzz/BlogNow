import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { api } from "../api";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { ArrowLeft, Edit3, Trash2, User } from "lucide-react";

export default function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const navigate = useNavigate();
  const { user, token } = useAuth();

  useEffect(() => {
    const fetchBlog = async () => {
      const res = await api.getBlog(id, token);
      if (res.error) {
        toast.error(res.error);
        return;
      }
      setBlog(res);
    };
    fetchBlog();
  }, [id, token]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    const res = await api.deleteBlog(id, token);
    if (res.error) {
      toast.error(res.error);
      return;
    }

    toast.success("Blog deleted successfully");
    navigate("/myblogs");
  };

  if (!blog) {
    return (
      <div className="min-h-screen bg-[#FAFAF9] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#1F2937] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm font-medium text-[#6B7280] tracking-wide">Loading blog…</p>
        </div>
      </div>
    );
  }

  const isAuthor = user && blog.author && user._id === blog.author._id;

  return (
    <div className="min-h-screen bg-[#FAFAF9] px-6 py-12">
      <div className="max-w-2xl mx-auto">
        {/* Back */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#6B7280] hover:text-[#111827] transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back
        </Link>

        {/* Article */}
        <article>
          <h1 className="text-3xl font-semibold tracking-tight text-[#111827] mb-3 leading-tight">
            {blog.title}
          </h1>

          <div className="flex items-center gap-2 text-sm text-[#6B7280] mb-8 pb-8 border-b border-[#E5E7EB]">
            <User className="w-4 h-4" />
            <span>By {blog.author?.name}</span>
          </div>

          <div className="text-[#374151] text-base leading-relaxed whitespace-pre-wrap">
            {blog.content}
          </div>
        </article>

        {/* Actions */}
        {isAuthor && (
          <div className="flex items-center gap-3 mt-10 pt-8 border-t border-[#E5E7EB]">
            <Link
              to={`/edit/${id}`}
              className="flex items-center gap-1.5 text-sm font-medium text-[#374151] border border-[#E5E7EB] px-4 py-2 rounded-lg hover:bg-[#F9FAFB] hover:border-[#D1D5DB] transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="flex items-center gap-1.5 text-sm font-medium text-[#DC2626] border border-[#FCA5A5]/60 px-4 py-2 rounded-lg hover:bg-[#FEF2F2] transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}