import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LuNotebookPen } from "react-icons/lu";
import axios from "axios";
import {
  LayoutDashboard,
  Utensils,
  User,
  LogOut,
  Plus,
  ChefHat,
  ChevronLeft,
  Loader2,
  Star,
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
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setUser(data.user);
        // Important: Update localStorage with latest user info
        localStorage.setItem(
          "user",
          JSON.stringify({ id: data.user._id, ...data.user }),
        );
      } catch (err) {
        localStorage.removeItem("token");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [navigate, token]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const navItems = [
    {
      icon: <LayoutDashboard size={22} />,
      label: "Home",
      path: "/recipe-home",
    },
    { icon: <Utensils size={22} />, label: "My Recipes", path: "/recipe-my" },
    {
      icon: <Plus size={22} />,
      label: "Create",
      path: "/recipes",
      isSpecial: true,
    },
    { icon: <Star size={22} />, label: "Favorites", path: "/favrouits" },
    {
      icon: <LuNotebookPen size={22} />,
      label: "Meal Plan",
      path: "/meal-planner",
    },
    { icon: <User size={22} />, label: "Profile", path: "/profile" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-full bg-orange-50">
        <Loader2 className="animate-spin text-orange-500" size={40} />
      </div>
    );
  }

  return (
    <>
      {/* MOBILE TOP BAR */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-orange-100 p-4 flex justify-between items-center z-[60]">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-200">
            <ChefHat size={20} />
          </div>
          <span className="text-xl font-black text-gray-800 tracking-tight">
            Recipe<span className="text-orange-500">Nest</span>
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
        >
          <LogOut size={22} />
        </button>
      </div>
      {/* MOBILE BOTTOM NAVIGATION */}
      <nav className="lg:hidden fixed bottom-6 left-4 right-4 bg-gray-900/95 backdrop-blur-xl rounded-3xl flex justify-around items-center py-3 px-2 z-[60] shadow-2xl border border-white/10">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.label}
              to={item.path}
              className="relative p-2 transition-all"
            >
              <div
                className={`relative z-10 ${isActive ? "text-orange-400" : "text-gray-400"}`}
              >
                {item.icon}
              </div>
              {isActive && (
                <motion.div
                  layoutId="mobileActive"
                  className="absolute inset-0 bg-orange-500/10 rounded-xl"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </nav>
      {/* DESKTOP SIDEBAR */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? "100px" : "300px" }}
        className="hidden lg:flex fixed left-0 top-0 h-screen bg-white text-gray-800 flex-col z-50 border-r border-gray-100 shadow-xl"
      >
        {/* Collapse Toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-4 top-12 bg-gray-900 rounded-full p-2 text-white hover:scale-110 transition-transform shadow-lg z-50"
        >
          <ChevronLeft size={16} className={isCollapsed ? "rotate-180" : ""} />
        </button>

        {/* Logo Section */}
        <div className="p-8 mb-4 flex items-center gap-4">
          <div className="min-w-[48px] h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center shadow-xl shadow-orange-200 text-white">
            <ChefHat size={26} />
          </div>
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl font-black text-gray-800 tracking-tight"
            >
              Recipe<span className="text-orange-500">Nest</span>
            </motion.span>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-6 space-y-3">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.label} to={item.path}>
                <motion.div
                  whileHover={{ x: 5 }}
                  className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all relative group ${
                    isActive
                      ? "bg-orange-50 text-orange-600 shadow-sm"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                  }`}
                >
                  <span
                    className={`${isActive ? "text-orange-500" : "group-hover:text-orange-500"} transition-colors`}
                  >
                    {item.icon}
                  </span>
                  {!isCollapsed && (
                    <span
                      className={`font-bold tracking-wide ${isActive ? "text-orange-600" : ""}`}
                    >
                      {item.label}
                    </span>
                  )}
                  {isActive && (
                    <motion.div
                      layoutId="activePill"
                      className="absolute left-0 w-1.5 h-6 bg-orange-500 rounded-r-full"
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* User Profile Section */}
        {user && (
          <div className="p-6 mt-auto">
            <div
              className={`flex items-center gap-4 p-4 rounded-[2rem] border border-gray-100 shadow-inner bg-gray-50/50 ${isCollapsed ? "justify-center" : ""}`}
            >
              <div className="min-w-[42px] h-10 w-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-black shadow-md">
                {user.username?.charAt(0).toUpperCase()}
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-gray-800 truncate">
                    {user.username}
                  </p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate">
                    {user.email}
                  </p>
                </div>
              )}
              {!isCollapsed && (
                <button
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-500 transition-colors cursor-pointer"
                  title="Logout"
                >
                  <LogOut size={25} />
                </button>
              )}
            </div>
          </div>
        )}
      </motion.aside>
      {/* Spacing adjustments for Layout */}
      <div
        className={`hidden lg:block transition-all duration-300 ${isCollapsed ? "ml-[100px]" : "ml-[300px]"}`}
      />
      <div className="lg:hidden h-20" /> {/* Top safe area for mobile */}
      <div className="lg:hidden h-24" /> {/* Bottom safe area for mobile nav */}
    </>
  );
};

export default Navbar;
