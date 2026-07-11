import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import logo from "../assets/logo.svg";

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navLink = (path, label) => (
    <Link
      to={path}
      className={`text-sm font-medium transition-colors ${
        isActive(path) ? "text-[#111827]" : "text-[#6B7280] hover:text-[#111827]"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <nav className="sticky top-0 z-50 bg-[#FAFAF9]/95 backdrop-blur-sm border-b border-[#E5E7EB]">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <img src={logo} alt="BlogNow" className="h-8 w-8" />
          <span className="text-lg font-semibold tracking-tight text-[#111827]">
            BlogNow
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex gap-8 items-center">
          {navLink("/", "Home")}
          {navLink("/about", "About")}
          {navLink("/contact", "Contact")}
          {isAuthenticated && navLink("/create", "Create Blog")}
          {isAuthenticated && navLink("/myblogs", "My Blogs")}
          {user?.role === "admin" && navLink("/admin", "Admin")}

          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 border border-[#E5E7EB] px-3 py-1.5 rounded-full hover:border-[#D1D5DB] hover:bg-white transition-colors"
              >
                <span className="w-6 h-6 rounded-full bg-[#111827] text-white flex items-center justify-center text-xs font-semibold">
                  {(user?.name || "U").charAt(0).toUpperCase()}
                </span>
                <span className="text-sm text-[#374151]">{user?.name || "Profile"}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-[#9CA3AF] transition-transform ${open ? "rotate-180" : ""}`} />
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg border border-[#E5E7EB] py-1 overflow-hidden">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-[#374151] hover:bg-[#F9FAFB] transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-[#DC2626] hover:bg-[#FEF2F2] transition-colors"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-sm font-medium text-[#374151] hover:text-[#111827] transition-colors">
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-[#111827] text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-[#1F2937] transition-colors"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-[#374151]"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#E5E7EB] px-6 py-4 flex flex-col gap-3">
          <Link to="/" className="text-sm font-medium text-[#374151]" onClick={() => setMobileOpen(false)}>Home</Link>
          <Link to="/about" className="text-sm font-medium text-[#374151]" onClick={() => setMobileOpen(false)}>About</Link>
          <Link to="/contact" className="text-sm font-medium text-[#374151]" onClick={() => setMobileOpen(false)}>Contact</Link>
          {isAuthenticated && (
            <Link to="/create" className="text-sm font-medium text-[#374151]" onClick={() => setMobileOpen(false)}>Create Blog</Link>
          )}
          {isAuthenticated && (
            <Link to="/myblogs" className="text-sm font-medium text-[#374151]" onClick={() => setMobileOpen(false)}>My Blogs</Link>
          )}
          {user?.role === "admin" && (
            <Link to="/admin" className="text-sm font-medium text-[#374151]" onClick={() => setMobileOpen(false)}>Admin</Link>
          )}

          {isAuthenticated ? (
            <>
              <Link to="/profile" className="text-sm font-medium text-[#374151]" onClick={() => setMobileOpen(false)}>
                {user?.name || "Profile"}
              </Link>
              <button
                onClick={() => {
                  logout();
                  setMobileOpen(false);
                }}
                className="text-left text-sm font-medium text-[#DC2626]"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-[#374151]" onClick={() => setMobileOpen(false)}>Login</Link>
              <Link to="/signup" className="text-sm font-medium text-[#374151]" onClick={() => setMobileOpen(false)}>Sign up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}