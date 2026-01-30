import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock, Loader2, ArrowRight, ChefHat } from "lucide-react";
import { FaPhone } from "react-icons/fa6";
import { BsPencilSquare } from "react-icons/bs";

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [Mobile, setMobile] = useState("");
  const [Bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        username,
        email,
        password,
        MobileNum: Mobile,
        bio: Bio,
      };

      await axios.post(
        "https://recipe-share-platform-backend-2.onrender.com/auth/register",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      toast.success("Welcome to the community!");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] px-4 font-sans">
      <div className="w-full max-w-md">
        {/* BRAND LOGO/NAME */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-600 rounded-2xl shadow-lg shadow-emerald-200 mb-4">
            <ChefHat className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Join RecipeMarket
          </h1>
          <p className="text-slate-500 mt-2 font-medium">
            Start your culinary journey today.
          </p>
        </div>

        {/* CARD */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            {/* NAME FIELD */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-1">
                Full Name
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="John Doe"
                  className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 focus:bg-white transition-all outline-none"
                />
              </div>
            </div>

            {/* EMAIL FIELD */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-1">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@company.com"
                  className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 focus:bg-white transition-all outline-none"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-1">
                Mobile Number
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <FaPhone className="h-5 w-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                </div>
                <input
                  type="text"
                  value={Mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  required
                  placeholder="91 + XXXYYYXYY "
                  className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 focus:bg-white transition-all outline-none"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-1">
                Add The Bio
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <BsPencilSquare className="h-5 w-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                </div>
                <textarea
                  value={Bio}
                  onChange={(e) => setBio(e.target.value)}
                  required
                  placeholder="Enter Bio"
                  className="block
                  w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200
                  text-slate-900 text-sm rounded-xl focus:ring-4
                  focus:ring-emerald-50 focus:border-emerald-500 focus:bg-white
                  transition-all outline-none"
                ></textarea>
              </div>
            </div>
            {/* PASSWORD FIELD */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-1">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 focus:bg-white transition-all outline-none"
                />
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-slate-200"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* DIVIDER */}
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-slate-100"></div>
              <span className="flex-shrink mx-4 text-xs font-medium text-slate-400">
                OR
              </span>
              <div className="flex-grow border-t border-slate-100"></div>
            </div>

            {/* LOGIN REDIRECT */}
            <p className="text-center text-sm text-slate-500 font-medium">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-emerald-600 hover:text-emerald-700 font-bold hover:underline transition-all"
              >
                Log in
              </Link>
            </p>
          </form>
        </div>

        {/* FOOTER TIPS */}
        <p className="text-center mt-8 text-xs text-slate-400 leading-relaxed">
          By signing up, you agree to our{" "}
          <span className="underline cursor-pointer">Terms of Service</span>{" "}
          <br />
          and <span className="underline cursor-pointer">Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
};

export default Register;
