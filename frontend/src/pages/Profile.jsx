import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { User, Mail, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";


export default function Profile() {
  const { user, logout } = useAuth(); // logout bhi context se
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Backend se profile fetch
useEffect(() => {
  if (!user) return;

  const fetchProfile = async () => {
    try {
      const res = await fetch("https://blognow-ckae.onrender.com/api/v1/users/profile", {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`, // 👈 token bhejna zaruri
        },
      });
      const data = await res.json();
      setProfile(data);
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchProfile();
}, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-600 via-pink-500 to-red-500">
        <div className="bg-white/10 backdrop-blur-md p-10 rounded-3xl shadow-xl text-center">
          <h2 className="text-3xl font-bold text-white mb-4">⚠️ Please Login First</h2>
          <p className="text-white/80">You need to log in to view your profile.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-indigo-900">
        <p className="text-white text-xl">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 p-6">
      {/* Back to Home Button */}
<div className="absolute top-6 left-6 z-20">
  <Link
    to="/"
    className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 
    hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 
    text-white font-semibold py-2.5 px-5 rounded-2xl shadow-xl 
    hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
  >
    <Home className="w-5 h-5" />
    Back to Home
  </Link>
</div>

      <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-10 w-full max-w-lg text-center border border-white/20">
      
        
        {/* Profile Avatar */}
        <div className="w-28 h-28 mx-auto rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white text-4xl font-bold shadow-lg mb-6">
          {profile?.name ? profile.name.charAt(0).toUpperCase() : "U"}
        </div>

        {/* Name */}
        <h1 className="text-3xl font-extrabold text-white mb-2">{profile?.name}</h1>
        <p className="text-white/70 mb-6">🌟 Inspiring Member</p>

        {/* Details */}
        <div className="space-y-4 text-left">
          <div className="flex items-center gap-3 bg-white/10 p-4 rounded-xl shadow hover:bg-white/20 transition">
            <User className="text-pink-400 w-6 h-6" />
            <span className="text-white text-lg">{profile?.name}</span>
          </div>

          <div className="flex items-center gap-3 bg-white/10 p-4 rounded-xl shadow hover:bg-white/20 transition">
            <Mail className="text-cyan-400 w-6 h-6" />
            <span className="text-white text-lg">{profile?.email}</span>
          </div>

          <div className="flex items-center gap-3 bg-white/10 p-4 rounded-xl shadow hover:bg-white/20 transition">
            <Calendar className="text-yellow-400 w-6 h-6" />
            <span className="text-white text-lg">
              Joined: {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "N/A"}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center mt-8">
          <Link to="/edit-profile">
            <button className="bg-gradient-to-r from-pink-500 to-purple-500 px-6 py-3 rounded-full text-white font-semibold hover:scale-105 transition shadow-lg">
              Edit Profile
            </button>
          </Link>
          <button 
            onClick={logout}
            className="bg-gradient-to-r from-red-500 to-orange-500 px-6 py-3 rounded-full text-white font-semibold hover:scale-105 transition shadow-lg"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
