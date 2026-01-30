import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  KeyRound,
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { toast } from "react-toastify";

const Resetpassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [showpassword, setShowpassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error("Security requirement: Minimum 6 characters");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `https://recipe-share-platform-backend.vercel.app/auth/reset-password/${token}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ newPassword: password }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Reset link expired or invalid");
        return;
      }

      toast.success("Credentials updated successfully");
      navigate("/login");
    } catch (error) {
      toast.error("System error, please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center  px-6 relative overflow-hidden">
      {/* Background Security Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-slate-300/5 blur-[50px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md z-10"
      >
        <div className="bg-white border border-white/5 rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative">
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center border border-emerald-500/20 relative">
              <KeyRound
                className="text-emerald-500 w-10 h-10"
                strokeWidth={1.5}
              />
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 rounded-full p-1.5 border-4 border-[#0B0F1A]">
                <ShieldCheck
                  className="text-[#0B0F1A]"
                  size={14}
                  strokeWidth={3}
                />
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-black  tracking-tight mb-3">
              Secure Reset
            </h2>
            <p className="text-gray-500 text-sm font-medium">
              Updating your chef credentials for{" "}
              <span className="text-emerald-500">RecipeNest</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] ml-1">
                New Secure Password
              </label>

              <div className="relative group">
                <input
                  type={showpassword ? "text" : "password"}
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-black border border-black  pl-5 pr-14 py-4 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all"
                  required
                />

                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-emerald-500 transition-colors p-2"
                  onClick={() => setShowpassword(!showpassword)}
                >
                  {showpassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <div className="flex items-center gap-2 ml-1 opacity-60">
                <CheckCircle2
                  size={12}
                  className={
                    password.length >= 6 ? "text-emerald-500" : "text-gray-600"
                  }
                />
                <span
                  className={`text-[11px] font-bold ${password.length >= 6 ? "text-emerald-500" : "text-gray-600"}`}
                >
                  Minimum 6 characters required
                </span>
              </div>
            </div>

            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-[#0B0F1A] font-black rounded-2xl shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  UPDATING...
                </>
              ) : (
                "UPDATE PASSWORD"
              )}
            </motion.button>
          </form>

          {/* Footer Decoration */}
          <div className="mt-10 pt-8 border-t border-white/5 text-center">
            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">
              End-to-End Encrypted Session
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Resetpassword;
