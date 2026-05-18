import React from "react";
import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

const HomeNavbar = () => {
  return (
    <nav className="w-full px-6 py-4 relative z-10 flex items-center justify-between">
      {/* LOGO */}
      <h1 className="text-2xl font-extrabold text-black">
        Recipe<span className="text-red-600">Nest</span>
      </h1>

      {/* AUTH BUTTONS */}
      <div className="flex items-center gap-4">
        <Link
          to="/login"
          className="text-lg font-semibold text-black border border-black px-5 py-1  rounded-2xl hover:bg-black hover:text-white transition-all"
        >
          Login
        </Link>

        <Link
          to="/register"
          className="bg-orange-500 hover:bg-orange-600 align-text justify-content flex text-white px-6 py-3 rounded-full text-sm font-semibold"
        >
          Sign up
        </Link>
      </div>
    </nav>
  );
};

export default HomeNavbar;
