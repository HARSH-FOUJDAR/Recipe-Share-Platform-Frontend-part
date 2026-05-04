import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion"; // Animation Library
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Clock, ArrowRight, ChefHat, UtensilsCrossed } from "lucide-react"; // Modern Icons
import { FaSearch } from "react-icons/fa";
import HomeNavar from "../components/HomeNavbar";
import Images from "../assets/images/png-images-removebg-preview.png"; // Hero Image
import Footer from "../components/Footer";
const Home = () => {
  const [recipes, setRecipe] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await axios.get(
          "https://recipe-share-platform-backend-2.onrender.com/recipes",
        );
        setRecipe(res.data || []);
      } catch (error) {
        toast.error("Could not load recipes.");
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, []);

  const handleView = (recipeId) => {
    const token = localStorage.getItem("token");
    token
      ? navigate(`/recipe/${recipeId}`)
      : (toast.info("Please login first"), navigate("/login"));
  };

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <>
      <div className="min-h-screen font-sans selection:bg-orange-500">
        {/* HERO SECTION */}
        <section className="relative   pb-20 border-b border-gray-100 shadow-sm overflow-hidden">
          <video
            src="https://www.inspiredtaste.net/wp-content/uploads/2026/04/Thai-Chicken-Salad-Pro.webm"
            autoPlay
            loop
            muted
            className="absolute top-0 left-0 w-100vh h-100vh object-cover"
          />
          <HomeNavar />
          <div className="max-w-7xl mx-auto px-6 pt-12 lg:pt-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center z-10 relative">
            <div className="max-w-lg mx-auto lg:mx-0 text-center lg:text-left">
              <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest text-orange-600 uppercase bg-orange-100 rounded-full">
                Discover & Share
              </span>
              <h1 className="text-5xl lg:text-7xl font-extrabold mb-6 tracking-tight text-gray-900 leading-tight">
                Cook Like a <span className="text-orange-600">Pro</span>
              </h1>
              <p className="text-gray-600 mb-10 text-lg leading-relaxed">
                Join our global community of food enthusiasts. Explore
                hand-picked recipes that bring restaurant-quality flavors
                directly to your home kitchen.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  className="px-8 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition duration-200"
                  onClick={() => navigate("/login")}
                >
                  Explore Recipes
                </button>
                <button className="px-8 py-3 bg-gray-100 text-gray-900 font-semibold rounded-lg hover:bg-gray-200 transition duration-200">
                  Join Community
                </button>
              </div>
            </div>
          </div>
        </section>
        <section className="py-20 flex flex-col items-center justify-center bg-orange-100/50">
          {/* Search Bar Container */}
          <div className="flex items-center w-full max-w-2xl px-4 mb-16">
            <div className="relative flex items-center w-full">
              <FaSearch className="absolute left-6 text-gray-400 text-xl" />
              <input
                type="text"
                placeholder="Search for delicious recipes..."
                className="w-full border-2 border-orange-300 rounded-2xl pl-14 pr-6 py-4 focus:outline-none focus:ring-4 focus:ring-orange-500/20 shadow-sm"
              />
              <button className="absolute right-2 bg-orange-600 hover:bg-orange-700 text-white font-bold px-8 py-2.5 rounded-xl transition duration-200">
                Search
              </button>
            </div>
          </div>

          {/* Content Wrapper */}
          <div className="flex flex-col lg:flex-row items-center gap-12 px-6 max-w-6xl">
            {/* Main Image */}
            <div className="w-full lg:w-1/2">
              <img
                src="https://recipekeeperonline.com/Images/en/laptopphone.png"
                alt="App display on laptop and phone"
                className="rounded-3xl shadow-2xl w-full"
              />
            </div>

            {/* App Store Buttons */}
            <div className="flex flex-col gap-4 w-full lg:w-auto">
              <h3 className="text-2xl font-extrabold text-gray-900 mb-2">
                Get the App
              </h3>
              <p className="text-gray-600 mb-2">
                Sync your recipes everywhere.
              </p>

              <a href="#" className="transition hover:opacity-90">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                  alt="Get it on Google Play"
                  className="h-14"
                />
              </a>
              <a href="#" className="transition hover:opacity-90">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                  alt="Download on the App Store"
                  className="h-14"
                />
              </a>
            </div>
          </div>
        </section>
        <hr className="border-orange-500 " />
        {/* RECIPES SECTION */}
        <section className=" bg-orange-200 min-h-screen py-20">
          <div className=" mx-auto px-70 ">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div className="flex flex-col text-center items-center mx-auto justify-center md:justify-start">
                <h2 className="text-4xl font-bold text-gray-900">
                  Popular Recipes
                </h2>
                <p className="text-gray-500 mt-2 text-lg">
                  Cook with confidence. Sharing trusted recipes since 2009,
                  loved by millions of happy home cooks. health-conscious
                  recipes inspired by the yogic lifestyle. Whether you’re
                  looking to energize your morning, rejuvenate after a long day,
                  or celebrate with friends and family. From hearty
                  lacto-vegetarian dishes to refreshing beverages and sweet
                  treats, every recipe is designed to uplift your spirit and
                  nourish your body. Dive into a world of wholesome ingredients,
                  vibrant flavors, and culinary inspiration that aligns with
                  your journey toward a balanced and fulfilling life.
                </p>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 ">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-80 bg-gray-100 rounded-3xl animate-pulse"
                    />
                  ))}
                </div>
              ) : recipes.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20 border-2 border-dashed border-gray-200 rounded-[2rem]"
                >
                  <UtensilsCrossed
                    size={48}
                    className="mx-auto text-gray-500 mb-4"
                  />
                  <p className="text-xl text-gray-500 font-medium">
                    No recipes found yet.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                  {recipes.map((recipe) => (
                    <motion.div
                      key={recipe._id}
                      variants={cardVariants}
                      whileHover={{ y: -10 }}
                      onClick={() => handleView(recipe._id)}
                      className="group bg-orange-300 rounded-4xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-red-100 transition-all duration-500 cursor-pointer"
                    >
                      <div className="relative h-60 overflow-hidden ">
                        <img
                          src={
                            recipe.photos?.[0] ||
                            "https://via.placeholder.com/400x300"
                          }
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                          alt={recipe.title}
                        />
                        <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-2xl flex items-center gap-1.5 text-xs font-bold shadow-sm">
                          <Clock size={14} className="text-red-500" />
                          {recipe.cookTime || "20"} min
                        </div>
                      </div>

                      <div className="p-6">
                        <h3 className="font-bold text-xl text-gray-800 mb-2 group-hover:text-red-600 transition-colors line-clamp-1">
                          {recipe.title}
                        </h3>
                        <p className="text-gray-900 text-sm line-clamp-2 leading-relaxed mb-6">
                          {recipe.instructions ||
                            "Tap to see the secret ingredients and steps."}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-widest text-gray-600">
                            View Detail
                          </span>
                          <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-colors">
                            <ArrowRight size={18} />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 5s ease-in-out infinite;
        }
      `}</style>
      </div>

      <Footer></Footer>
    </>
  );
};

export default Home;
