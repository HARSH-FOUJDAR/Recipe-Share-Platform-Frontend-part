import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import {
  LayoutDashboard,
  Utensils,
  User,
  LogOut,
  Plus,
  ChefHat,
  ChevronLeft,
  ClipboardList,
  Loader2,
} from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const { data } = await axios.get(
          "https://recipe-share-platform-backend-2.onrender.com/auth/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUser(data.user);
      } catch (err) {
        console.error("User fetch failed", err);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate, token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const navItems = [
    { icon: <LayoutDashboard size={20} />, label: "Dashboard", path: "/recipe-home" },
    { icon: <Utensils size={20} />, label: "My Recipes", path: "/recipe-my" },
    { icon: <User size={20} />, label: "Profile", path: "/profile" },
    { icon: <ClipboardList size={20} />, label: "Meal Plan", path: "/meal-planner" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <Loader2 className="animate-spin" size={50} />
      </div>
    );
  }

  return (
    <motion.aside
      animate={{ width: isCollapsed ? "88px" : "280px" }}
      className="fixed left-0 top-0 h-screen bg-slate-900 backdrop-blur-md text-white flex flex-col z-50"
    >
      {/* Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-12 bg-emerald-500 rounded-full p-1.5"
      >
        <ChevronLeft size={14} className={isCollapsed ? "rotate-180" : ""} />
      </button>

      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
          <ChefHat size={22} />
        </div>
        {!isCollapsed && <span className="font-black">RECIPENEST</span>}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.label} to={item.path}>
              <div
                className={`flex items-center gap-4 px-4 py-3 rounded-xl ${
                  isActive ? "bg-emerald-500/20" : "text-gray-400 hover:bg-white/5"
                }`}
              >
                {item.icon}
                {!isCollapsed && <span>{item.label}</span>}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Create Recipe Button */}
      <div className="px-4 mb-4">
        <button
          onClick={() => navigate("/recipes")}
          className="w-full bg-emerald-500 text-black py-3 rounded-xl flex items-center justify-center gap-2 font-bold"
        >
          <Plus size={20} />
          {!isCollapsed && "Create Recipe"}
        </button>
      </div>

      {/* User Info */}
      {user && (
        <div className="px-4 pb-6">
          <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl">
            <div className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center">
              {user.username?.charAt(0).toUpperCase()}
            </div>
            {!isCollapsed && (
              <>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{user.username}</p>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </div>
                <button onClick={handleLogout} className="text-red-400 cursor-pointer">
                  <LogOut size={25} />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </motion.aside>
  );
};

export default Navbar;
