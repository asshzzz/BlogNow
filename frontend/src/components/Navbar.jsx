import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { FaUserCircle } from "react-icons/fa"; // user icon

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-gray-800 text-white p-3 flex justify-between items-center">
      {/* Left Links */}
      <div className="flex gap-4">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>

        {/* Authenticated user only */}
        {isAuthenticated && <Link to="/create">Create Blog</Link>}
        {isAuthenticated && <Link to="/myblogs">My Blogs</Link>}

        {/* Admin only */}
        {user?.role === "admin" && <Link to="/admin">Admin</Link>}
      </div>

      {/* Right Side */}
      <div className="flex gap-4 items-center relative">
        {isAuthenticated ? (
          <div className="relative">
            {/* User Icon */}
            <button onClick={() => setOpen(!open)}>
              <FaUserCircle size={28} className="text-purple-300" />
            </button>

            {/* Dropdown */}
            {open && (
              <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded-lg shadow-lg z-50">
                <Link
                  to="/profile"
                  className="block px-4 py-2 hover:bg-gray-200"
                  onClick={() => setOpen(false)}
                >
                  {user?.name || "Profile"}
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link to="/login" className="hover:underline">
              Login
            </Link>
            <Link to="/signup" className="hover:underline">
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
