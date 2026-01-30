import React from "react";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Mail,
  MapPin,
  Phone,
  Utensils,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* 1. BRAND SECTION */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="bg-red-500 p-2 rounded-xl">
                <Utensils className="text-white" size={24} />
              </div>
              <span className="text-2xl font-black tracking-tight text-gray-800">
                Recipe<span className="text-red-500">Nest</span>
              </span>
            </div>
            <p className="text-gray-500 leading-relaxed">
              Duniya bhar ke lazeez pakwanon ka sangrah. Apni recipes share
              karein aur naye swad explore karein.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="p-2 bg-gray-50 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="p-2 bg-gray-50 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="p-2 bg-gray-50 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="p-2 bg-gray-50 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
              >
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* 2. QUICK LINKS */}
          <div>
            <h4 className="text-lg font-bold text-gray-800 mb-6">Explore</h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="/"
                  className="text-gray-500 hover:text-red-500 transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/recipes"
                  className="text-gray-500 hover:text-red-500 transition-colors"
                >
                  All Recipes
                </a>
              </li>
              <li>
                <a
                  href="/trending"
                  className="text-gray-500 hover:text-red-500 transition-colors"
                >
                  Trending Now
                </a>
              </li>
              <li>
                <a
                  href="/categories"
                  className="text-gray-500 hover:text-red-500 transition-colors"
                >
                  Categories
                </a>
              </li>
            </ul>
          </div>

          {/* 3. SUPPORT */}
          <div>
            <h4 className="text-lg font-bold text-gray-800 mb-6">Support</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-gray-500">
                <Mail size={18} className="text-red-500" />
                support@recipeshare.com
              </li>
              <li className="flex items-center gap-3 text-gray-500">
                <Phone size={18} className="text-red-500" />
                +91 xxxxyyyy
              </li>
              <li className="flex items-center gap-3 text-gray-500">
                <MapPin size={18} className="text-red-500" />
                Mumbai, India
              </li>
            </ul>
          </div>

          {/* 4. NEWSLETTER */}
          <div>
            <h4 className="text-lg font-bold text-gray-800 mb-6">Newsletter</h4>
            <p className="text-gray-500 mb-4 text-sm">
              Nayi recipes ki update pane ke liye subscribe karein.
            </p>
        
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
          <p>© 2026 RecipeShare. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-red-500">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-red-500">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
