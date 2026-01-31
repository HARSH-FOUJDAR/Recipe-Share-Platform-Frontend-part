import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
  Star,
  Menu,
  X,
} from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
      } catch (err) {
        localStorage.removeItem("token");
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
    { icon: <Star size={22} />, label: "Fav", path: "/favrouits" },
    { icon: <User size={22} />, label: "Profile", path: "/profile" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-20 w-full lg:h-screen">
        <Loader2 className="animate-spin text-emerald-500" size={30} />
      </div>
    );
  }

  return (
    <>
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-orange-400 text-white p-4 flex justify-between items-center z-[60] border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center text-white">
            <ChefHat size={18} />
          </div>
          <span className="text-xl font-bold">
            Recipe<span className="text-red-500">Nest</span>
          </span>
        </div>
        <button onClick={handleLogout} className="text-gray-800">
          <LogOut size={25} />
        </button>
      </div>

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-orange-400 border-t border-white/10 flex justify-around items-center py-2 px-1 z-[60] backdrop-blur-lg bg-opacity-95">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.label}
              to={item.path}
              className="flex flex-col items-center gap-1"
            >
              <div
                className={`p-2 rounded-xl transition-all ${
                  isActive
                    ? item.isSpecial
                      ? "bg-emerald-500 text-black"
                      : "text-emerald-500"
                    : "text-gray-600"
                } ${item.isSpecial && !isActive ? "bg-slate-800 text-emerald-500" : ""}`}
              >
                {item.icon}
              </div>
              <span
                className={`text-[10px] ${isActive ? "text-emerald-500 font-bold" : "text-gray-900"}`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? "88px" : "280px" }}
        className="hidden lg:flex fixed left-0 top-0 h-screen bg-slate-900 text-white flex-col z-50 border-r border-white/5"
      >
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-10 bg-emerald-500 rounded-full p-1.5 text-black hover:scale-110 transition-transform"
        >
          <ChevronLeft size={16} className={isCollapsed ? "rotate-180" : ""} />
        </button>

        {/* Logo */}
        <div className="p-8 flex items-center gap-3">
          <div className="min-w-[40px] h-10 bg-red-500 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/20">
            <ChefHat size={22} />
          </div>
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-2xl font-black tracking-tight"
            >
              Recipe<span className="text-red-500">Nest</span>
            </motion.span>
          )}
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            if (item.isSpecial && !isCollapsed) {
              return (
                <Link key={item.label} to={item.path} className="block pt-4">
                  <div className="bg-emerald-500 text-black px-4 py-3 rounded-xl flex items-center gap-4 font-bold hover:bg-emerald-400 transition-colors">
                    <Plus size={20} />
                    <span>Create Recipe</span>
                  </div>
                </Link>
              );
            }
            return (
              <Link key={item.label} to={item.path}>
                <div
                  className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? "bg-emerald-500/10 text-emerald-500"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {item.icon}
                  {!isCollapsed && (
                    <span className="font-medium">
                      {item.label === "Fav" ? "Favorites" : item.label}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {user && (
          <div className="p-4 border-t border-white/5">
            <div
              className={`flex items-center gap-3 bg-white/5 p-3 rounded-2xl ${isCollapsed ? "justify-center" : ""}`}
            >
              <div className="min-w-[36px] h-9 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center font-bold">
                {user.username?.charAt(0).toUpperCase()}
              </div>
              {!isCollapsed && (
                <>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-bold truncate">
                      {user.username}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user.email}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-gray-500 hover:text-red-500 p-1"
                  >
                    <LogOut size={18} />
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </motion.aside>

      <div
        className={`hidden lg:block transition-all duration-300 ${isCollapsed ? "ml-[88px]" : "ml-[280px]"}`}
      />
      <div className="lg:hidden h-16" />
    </>
  );
};

export default Navbar;
