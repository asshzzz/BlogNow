import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { UserPlus, Sparkles, Mail, Lock, User, ArrowRight, Eye, EyeOff } from "lucide-react";

export default function Signup() {
  const { signup } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    try {
      const res = await signup(name, email, password);

      if (res?.error) {
        setError(res.error);
      } else {
        navigate("/login");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-violet-900 via-purple-900 to-fuchsia-900">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-r from-pink-400 to-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-r from-yellow-400 to-orange-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full mb-4 shadow-2xl transform hover:scale-110 transition-transform duration-300">
              <UserPlus className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 mb-2">
              Join Us
            </h1>
            <p className="text-xl text-purple-200 flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5" />
              Create your account
              <Sparkles className="w-5 h-5" />
            </p>
          </div>

          {/* Form Card */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl hover:bg-white/15 transition-all duration-500">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="bg-red-500/20 border border-red-400/30 rounded-2xl p-4 backdrop-blur-sm animate-fadeIn">
                  <p className="text-red-200 text-center font-medium flex items-center justify-center gap-2">
                    <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                    {error}
                  </p>
                </div>
              )}

              {/* Name Input */}
              <div className="relative group">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                  <User className="w-5 h-5 text-purple-400 group-focus-within:text-pink-400 transition-colors duration-300" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder=" "
                  className="w-full h-14 pl-12 pr-6 pt-4 pb-2 text-white bg-white/5 border-2 border-purple-300/30 rounded-2xl focus:outline-none focus:border-pink-400 focus:bg-white/10 transition-all duration-300 peer placeholder-transparent"
                />
                <label className="absolute left-12 top-2 text-sm text-purple-300 transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-purple-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-pink-400">
                  Full Name
                </label>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </div>

              {/* Email Input */}
              <div className="relative group">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                  <Mail className="w-5 h-5 text-purple-400 group-focus-within:text-pink-400 transition-colors duration-300" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder=" "
                  className="w-full h-14 pl-12 pr-6 pt-4 pb-2 text-white bg-white/5 border-2 border-purple-300/30 rounded-2xl focus:outline-none focus:border-pink-400 focus:bg-white/10 transition-all duration-300 peer placeholder-transparent"
                />
                <label className="absolute left-12 top-2 text-sm text-purple-300 transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-purple-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-pink-400">
                  Email Address
                </label>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </div>

              {/* Password Input */}
              <div className="relative group">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                  <Lock className="w-5 h-5 text-purple-400 group-focus-within:text-pink-400 transition-colors duration-300" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder=" "
                  className="w-full h-14 pl-12 pr-12 pt-4 pb-2 text-white bg-white/5 border-2 border-purple-300/30 rounded-2xl focus:outline-none focus:border-pink-400 focus:bg-white/10 transition-all duration-300 peer placeholder-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 text-purple-400 hover:text-pink-400 transition-colors duration-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
                <label className="absolute left-12 top-2 text-sm text-purple-300 transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-purple-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-pink-400">
                  Password
                </label>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !name.trim() || !email.trim() || !password.trim()}
                className="w-full h-14 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 hover:from-pink-600 hover:via-purple-600 hover:to-cyan-600 text-white font-bold rounded-2xl shadow-2xl transform hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                <span className="relative z-10 flex items-center gap-2">
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </>
                  )}
                </span>
              </button>
            </form>

            {/* Login Link */}
            <div className="text-center mt-8 pt-6 border-t border-white/10">
              <p className="text-purple-200 flex items-center justify-center gap-2">
                Already have an account?
                <Link 
                  to="/login" 
                  className="text-pink-400 font-semibold hover:text-pink-300 transition-colors duration-300 flex items-center gap-1 group"
                >
                  Sign In
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </p>
            </div>

            {/* Footer */}
            <div className="text-center mt-6">
              <p className="text-purple-300 text-sm flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 animate-pulse" />
                Join thousands of creators today
                <Sparkles className="w-4 h-4 animate-pulse" />
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}