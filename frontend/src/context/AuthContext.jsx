import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../api";            // ✅ api.js import
import { toast } from "react-toastify";  // ✅ toastify import

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount → check localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  // ✅ Signup function (calls backend)
  const signup = async (name, email, password) => {
    try {
      const res = await api.signup(name, email, password);
      if (res.error) {
        toast.error(res.error);
        return null;
      }
      toast.success("Signup successful! Please login.");
      return res;
    } catch (err) {
      toast.error("Signup failed! Try again.");
      return null;
    }
  };

  // ✅ Login function (calls backend)
  const login = async (email, password) => {
    try {
      const res = await api.login(email, password);
      if (res.error) {
        toast.error(res.error);
        return null;
      }

      localStorage.setItem("user", JSON.stringify(res.user));
      localStorage.setItem("token", res.token);
      setUser(res.user);
      setToken(res.token);
      toast.success("Login successful!");
      return res.user;
    } catch (err) {
      toast.error("Login failed! Try again.");
      return null;
    }
  };

  // ✅ Logout function
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
    toast.info("Logged out successfully.");
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    signup,
    isAuthenticated: !!user, // helper
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
