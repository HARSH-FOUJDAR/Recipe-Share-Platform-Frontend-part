import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { User, Mail, Phone, AlignLeft, Edit3, Loader2 } from "lucide-react";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const checkAuth = async () => {
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        const { data } = await axios.get(
          "https://recipe-share-platform-backend-2.onrender.com/auth/profile",
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setUser(data.user);
      } catch (error) {
        console.error(error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [token, navigate]);

  if (loading)
    return (
      <div className="min-h-screen  flex items-center justify-center gap-5">
        <Loader2 className="text-emerald-500 animate-spin" size={100} />
        <p className="text-2xl mt-4">Plese Wait....</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-800  backdrop-blur-md text-white flex">
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 ml-[85px] lg:ml-[280px] p-6 lg:p-12 flex justify-center">
        <div className="w-full max-w-2xl">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-10">
            <h1 className="text-3xl font-bold">Account Settings</h1>
          </div>

          {/* User Info Card */}
          <div className="bg-[#0B0F1A] border border-white/5 rounded-[2rem] p-8 space-y-8">
            {/* Avatar & Name */}
            <div className="flex items-center gap-5 border-b border-white/5 pb-8">
              <div className="">
                <form
                  class="flex flex-col gap-4"
                  action="/profile"
                  method="post"
                  enctype="multipart/form-data"
                >
                  <label class="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20 cursor-pointer">
                    <User size={40} />
                    <input
                      type="file"
                      class="hidden"
                      accept="image/*"
                      name="avatar"
                    />
                  </label>

                  <img
                    id="preview"
                    class="hidden w-32 h-32 object-cover rounded-full mx-auto"
                    alt="Preview"
                  />
                </form>
              </div>
              <div>
                <h2 className="text-xl font-bold uppercase tracking-tight">
                  {user.username}
                </h2>
                <p className="text-emerald-500 text-sm font-semibold">
                  Verified Chef
                </p>
              </div>
            </div>

            {/* Details List */}
            <div className="grid gap-6">
              <div className="flex items-start gap-4">
                <Mail className="text-gray-500 mt-1" size={20} />
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                    Email
                  </p>
                  <p className="text-gray-200 font-medium">{user.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="text-gray-500 mt-1" size={20} />
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                    Mobile
                  </p>
                  <p className="text-gray-200 font-medium">
                    {user.MobileNum || "Not provided"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <AlignLeft className="text-gray-500 mt-1" size={20} />
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                    Bio
                  </p>
                  <p className="text-gray-400 text-sm leading-relaxed italic">
                    {user.bio ||
                      "Write something about your cooking journey..."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Simple Footer Note */}
          <p className="text-center mt-8 text-gray-600 text-xs tracking-widest uppercase">
            Joined RecipeNest in 2026
          </p>
        </div>
      </main>
    </div>
  );
};

export default Profile;
