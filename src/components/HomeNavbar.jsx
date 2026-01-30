import React from "react";
import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

const HomeNavbar = () => {
  return (
    <nav className="w-full bg-white border-b shadow-sm px-6 py-4 flex items-center justify-between">
      {/*  LOGO */}
      <h1 className="text-2xl font-extrabold text-black">
        Recipe<span className="text-emerald-600">Nest</span>
      </h1>

      {/*  AUTH BUTTONS */}
      <div className="flex items-center gap-4">
        <Link
          to="/login"
          className="text-xl font-semibold text-gray-700 hover:text-red-500 hover:underline"
        >
          Login
        </Link>

        <Link
          to="/register"
          className="bg-emerald-600 hover:bg-emerald-800 text-white px-6 py-2 rounded-full text-sm font-semibold"
        >
          Sign up
        </Link>
      </div>
    </nav>
  );
};

export default HomeNavbar;
