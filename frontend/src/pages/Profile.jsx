import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { User, Mail, Calendar, Home, LogOut, Pencil, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

export default function Profile() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch profile from backend
  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      try {
        const res = await fetch("https://blognow-ckae.onrender.com/api/v1/users/profile", {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
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
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF9] px-6">
        <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-sm p-10 text-center max-w-sm">
          <div className="w-12 h-12 rounded-full bg-[#FEF2F2] flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-5 h-5 text-[#DC2626]" />
          </div>
          <h2 className="text-lg font-semibold text-[#111827] mb-2">Please log in first</h2>
          <p className="text-sm text-[#6B7280]">You need to log in to view your profile.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF9]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#1F2937] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm font-medium text-[#6B7280] tracking-wide">Loading profile…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF9] px-6 py-12">
      {/* Back to Home */}
      <div className="max-w-lg mx-auto mb-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#6B7280] hover:text-[#111827] transition-colors"
        >
          <Home className="w-4 h-4" />
          Back to Home
        </Link>
      </div>

      <div className="max-w-lg mx-auto bg-white border border-[#E5E7EB] rounded-2xl shadow-sm p-10 text-center">
        {/* Avatar */}
        <div className="w-20 h-20 mx-auto rounded-full bg-[#111827] flex items-center justify-center text-white text-2xl font-semibold mb-5">
          {profile?.name ? profile.name.charAt(0).toUpperCase() : "U"}
        </div>

        {/* Name */}
        <h1 className="text-xl font-semibold text-[#111827] mb-1">{profile?.name}</h1>
        <p className="text-sm text-[#6B7280] mb-8">Member</p>

        {/* Details */}
        <div className="space-y-2.5 text-left mb-8">
          <div className="flex items-center gap-3 border border-[#E5E7EB] px-4 py-3 rounded-lg">
            <User className="w-4 h-4 text-[#9CA3AF] shrink-0" />
            <span className="text-sm text-[#374151]">{profile?.name}</span>
          </div>

          <div className="flex items-center gap-3 border border-[#E5E7EB] px-4 py-3 rounded-lg">
            <Mail className="w-4 h-4 text-[#9CA3AF] shrink-0" />
            <span className="text-sm text-[#374151]">{profile?.email}</span>
          </div>

          <div className="flex items-center gap-3 border border-[#E5E7EB] px-4 py-3 rounded-lg">
            <Calendar className="w-4 h-4 text-[#9CA3AF] shrink-0" />
            <span className="text-sm text-[#374151]">
              Joined {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "N/A"}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-center">
          <Link to="/edit-profile" className="flex-1">
            <button className="w-full flex items-center justify-center gap-2 bg-[#111827] text-white text-sm font-medium py-2.5 rounded-lg hover:bg-[#1F2937] transition-colors">
              <Pencil className="w-4 h-4" />
              Edit profile
            </button>
          </Link>
          <button
            onClick={logout}
            className="flex-1 flex items-center justify-center gap-2 text-[#DC2626] text-sm font-medium py-2.5 rounded-lg border border-[#FCA5A5]/60 hover:bg-[#FEF2F2] transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}