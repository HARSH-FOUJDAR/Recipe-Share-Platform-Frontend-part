import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion"; // Animation Library
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Clock, ArrowRight, ChefHat, UtensilsCrossed } from "lucide-react"; // Modern Icons
import HomeNavar from "../components/HomeNavbar";
import Images from "../assets/images/images.png";
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
    <div className="bg-[#FAFAFA] min-h-screen font-sans selection:bg-red-100">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-white pb-20 border-b border-gray-100">
        <HomeNavar />
        <div className="max-w-7xl mx-auto px-6 pt-12 lg:pt-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left z-10"
          >
            <span className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wider text-red-600 uppercase bg-red-50 rounded-full">
              Discover & Share
            </span>
            <h1 className="text-6xl lg:text-7xl font-extrabold mb-6 tracking-tight text-gray-900">
              Cook Like a{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">
                Pro
              </span>
            </h1>
            <p className="text-gray-500 max-w-lg mb-10 text-lg leading-relaxed mx-auto lg:mx-0">
              Join a global community of foodies. Explore hand-picked recipes
              that bring restaurant-quality flavors to your kitchen.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={() => navigate("/login")}
                className="group flex items-center justify-center gap-2 bg-gray-900 text-white font-bold px-8 py-4 rounded-2xl hover:bg-red-600 transition-all duration-300 shadow-lg shadow-gray-200"
              >
                Start Cooking{" "}
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1 }}
            className="relative hidden lg:flex justify-end"
          >
            <div className="absolute inset-0 bg-red-200 rounded-full filter blur-[120px] opacity-20 animate-pulse"></div>
            <img
              src={Images}
              alt="Food"
              className="w-full rounded-full max-w-md drop-shadow-3xl relative z-10 animate-float"
            />
          </motion.div>
        </div>
      </section>

      {/* RECIPES SECTION */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 tracking-tight">
                Popular Recipes
              </h2>
              <p className="text-gray-500 mt-2 text-lg">
                Specially curated for your taste buds
              </p>
            </div>
            <div className="h-[2px] flex-grow mx-8 bg-gray-100 hidden md:block mb-4"></div>
          </div>

          <AnimatePresence mode="wait">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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
                  className="mx-auto text-gray-300 mb-4"
                />
                <p className="text-xl text-gray-400 font-medium">
                  No recipes found yet.
                </p>
              </motion.div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
              >
                {recipes.map((recipe) => (
                  <motion.div
                    key={recipe._id}
                    variants={cardVariants}
                    whileHover={{ y: -10 }}
                    onClick={() => handleView(recipe._id)}
                    className="group bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-red-100 transition-all duration-500 cursor-pointer"
                  >
                    <div className="relative h-60 overflow-hidden">
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
                      <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-red-600 transition-colors line-clamp-1">
                        {recipe.title}
                      </h3>
                      <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed mb-6">
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
