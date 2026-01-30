import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion"; // For animations
import { Mail, ArrowLeft, ShieldCheck, Loader2 } from "lucide-react"; // Icons
import { Link } from "react-router-dom";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handelSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post(
        "https://recipe-share-platform-backend.vercel.app/auth/forgotpassword",
        { email },
        { withCredentials: true }
      );
      toast.success(data.message || "Reset link sent to your email");
      setEmail("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 selection:bg-emerald-500/30">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Back to Login */}
        <Link 
          to="/login" 
          className="inline-flex items-center gap-2 text-black font-bold hover:text-emerald-400 mb-8 transition-colors group text-sm  "
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Login
        </Link>

        {/* Card */}
        <div className="bg-white text-black border border-black rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
          {/* Top Decoration */}
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <ShieldCheck size={100} className="text-emerald-500" />
          </div>

          <div className="relative z-10">
            {/* Header */}
            <div className="mb-10">
              <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 border border-emerald-500/20">
                <ShieldCheck className="text-emerald-500" size={28} />
              </div>
              <h2 className="text-3xl font-bold text-blacke tracking-tight mb-2">
                Forgot Password?
              </h2>
              <p className="text-black text-sm leading-relaxed">
                Enter your registered email below and we'll send you instructions to reset your password.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handelSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-black ml-1">
                  Email Address
                </label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-black group-focus-within:text-emerald-500 transition-colors">
                    <Mail size={20} />
                  </span>
                  <input
                    type="email"
                    placeholder="chef@recipenest.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border border-black  text-black pl-12 pr-4 py-4 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all placeholder:text-gray-600"
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-[#0B0F1A] font-bold rounded-2xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Sending Link...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </motion.button>
            </form>

            {/* Footer Note */}
            <div className="mt-8 text-center pt-8 border-t border-white/5">
              <p className="text-xs text-black">
                Didn't receive the email? Check your spam folder or <button className="text-emerald-500 hover:underline font-bold">try again</button>
              </p>
            </div>
          </div>
        </div>

        {/* Brand Copyright */}
        <p className="text-center mt-8 text-black text-xs">
          © 2026 RecipeNest. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
};

export default ForgetPassword;