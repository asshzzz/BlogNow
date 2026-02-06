import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { api } from "../api";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

export default function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const navigate = useNavigate();
  const { user, token } = useAuth(); // get current logged in user

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

    toast.success("Blog deleted successfully!");
    navigate("/myblogs"); // redirect to user's blogs page
  };

  if (!blog) return <p className="p-4">Loading...</p>;

  const isAuthor = user && blog.author && user._id === blog.author._id;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">{blog.title}</h1>
      <p className="text-gray-600 mb-4">By {blog.author?.name}</p>
      <div className="mt-4 mb-6">{blog.content}</div>

      {isAuthor && (
        <div className="flex gap-4">
          <Link
            to={`/edit/${id}`}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
