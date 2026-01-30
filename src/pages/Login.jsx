import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Mail, Lock, ArrowRight, Loader2, UtensilsCrossed } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingToken, setCheckingToken] = useState(true);

  // Check if token exists & valid
  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setCheckingToken(false); // No token, show login form
        return;
      }

      try {
        const { data } = await axios.get(
          "https://recipe-share-platform-backend-2.onrender.com/auth/profile",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (data.user) {
          // Token valid, redirect to recipe-home
          navigate("/recipe-home");
        }
      } catch (err) {
        // Token invalid or expired → remove it
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } finally {
        setCheckingToken(false);
      }
    };

    checkToken();
  }, [navigate]);

  // Handle login form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post(
        "https://recipe-share-platform-backend-2.onrender.com/auth/login",
        { email, password }
      );

      // Save token & user to localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast.success("Welcome back, Chef!");
      navigate("/recipe-home");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // Show loader while checking token
  if (checkingToken) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" size={50} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] px-4 font-sans">
      <div className="w-full max-w-md">
        {/* BRAND */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-600 rounded-2xl shadow-xl shadow-emerald-100 mb-4 transition-transform hover:scale-110">
            <UtensilsCrossed className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Recipe<span className="text-emerald-600">Nest</span>
          </h1>
          <p className="text-slate-500 mt-2 font-medium italic">
            "Where every chef finds home."
          </p>
        </div>

        {/* LOGIN FORM */}
        <div className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 border border-slate-100 p-8 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* EMAIL */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@example.com"
                  className="block w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 focus:bg-white transition-all outline-none text-sm"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-sm font-bold text-slate-700">
                  Password
                </label>
                <Link
                  to="/forget-password"
                  className="text-sm font-bold text-emerald-600 hover:text-emerald-700"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="block w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 focus:bg-white transition-all outline-none text-sm"
                />
              </div>
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center border-2 justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-2xl transition-all active:scale-[0.98] disabled:opacity-70 shadow-lg shadow-slate-200 mt-2 cursor-pointer"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            {/* DIVIDER */}
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-slate-100"></div>
              <span className="flex-shrink mx-4 text-xs font-bold text-slate-300">
                OR
              </span>
              <div className="flex-grow border-t border-slate-100"></div>
            </div>

            {/* REGISTER LINK */}
            <div className="text-center">
              <Link to="/register">
                <button
                  type="button"
                  className="w-full border-2 cursor-pointer border-slate-600 text-slate-600 hover:bg-slate-50 py-3.5 rounded-2xl font-bold transition-all flex items-center justify-center gap-2"
                >
                  Create Account
                </button>
              </Link>
            </div>
          </form>
        </div>

        {/* FOOTER */}
        <p className="text-center mt-10 text-xs text-slate-400 font-medium">
          Secure Login Powered by RecipeNest v2.0
        </p>
      </div>
    </div>
  );
};

export default Login;
