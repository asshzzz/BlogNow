import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { ArrowLeft } from "lucide-react"; // ⬅️ icon add kar liya

export default function EditProfile() {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const fetchUser = async () => {
      try {
        const res = await fetch("https://blognow-ckae.onrender.com/api/v1/users/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch user profile");

        const data = await res.json();
        setName(data.name);
        setEmail(data.email);
      } catch (err) {
        console.error("Error fetching user:", err);
        toast.error("Failed to load profile!");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("https://blognow-ckae.onrender.com/api/v1/users/editProfile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ name, email }),
      });

      if (!res.ok) throw new Error("Failed to update profile");

      const updatedUser = await res.json();
      console.log("Updated Profile:", updatedUser);

      toast.success("Profile updated successfully");
      setTimeout(() => navigate("/profile"), 1500);
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Error updating profile");
    }
  };

  if (loading) {
    return <div className="text-white text-center mt-10">Loading profile...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-6">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-10 w-full max-w-md text-center relative border border-white/20">
        
        {/* 🔙 Back Button */}
        <button
          onClick={() => navigate("/profile")}
          className="absolute top-4 left-4 text-white flex items-center gap-2 hover:text-gray-200 transition"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        <h1 className="text-3xl font-bold text-white mb-6">Edit Profile</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-left">
          <div>
            <label className="text-white font-semibold">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded-lg mt-2 bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="text-white font-semibold">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-lg mt-2 bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Enter your email"
            />
          </div>

          <button
            type="submit"
            className="bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold py-3 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300 mt-4"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
