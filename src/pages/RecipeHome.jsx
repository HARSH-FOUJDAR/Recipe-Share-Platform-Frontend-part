import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Heart, Clock, Search, Utensils } from "lucide-react";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import Footer from "../components/Footer";

const RecipeHome = () => {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = [
    "All",
    "Breakfast",
    "Lunch",
    "Dinner",
    "Desserts",
    "Quick Snack",
  ];
  const token = localStorage.getItem("token");

  const handleLike = async (e, recipeId) => {
    e.stopPropagation(); 

    const token = localStorage.getItem("token");
    if (!token) {
      toast.info("Please login to like");
      navigate("/login");
      return;
    }

    try {
      const res = await axios.post(
        `https://recipe-share-platform-backend-2.onrender.com/recipes/${recipeId}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setRecipes((prev) =>
        prev.map((r) =>
          r._id === recipeId
            ? {
                ...r,
                like: res.data.liked
                  ? [...r.like, userId]
                  : r.like.filter((id) => id !== userId),
              }
            : r,
        ),
      );
    } catch (err) {
      toast.error("Failed to like recipe");
    }
  };

  const userId = useMemo(() => {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.id;
    } catch (e) {
      return null;
    }
  }, [token]);

  const fetchAllRecipes = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://recipe-share-platform-backend-2.onrender.com/recipes",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setRecipes(response.data.recipes || response.data);
    } catch (error) {
      toast.info("Connecting to server...");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      fetchAllRecipes();
    }
  }, []);

  const filteredData = recipes.filter((recipe) => {
    const matchesSearch = recipe.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      activeCategory === "All" || recipe.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <div className="bg-gray-50 min-h-screen pb-10">
        <Navbar />
        <div className="bg-slate-900 py-16 px-6 text-center text-white">
          <h1 className="text-4xl font-bold mb-6">
            Find Your Favorite Recipes
          </h1>
          <div className="max-w-md mx-auto relative">
            <input
              type="text"
              placeholder="What do you want to cook?"
              className="w-full p-4 pl-12 rounded-2xl bg-white/10 border-2 border-white/20 focus:border-orange-500 outline-none transition-all text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-4 top-4 text-gray-400" size={24} />
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-10 px-6">
          <div className="flex gap-3 mb-10 overflow-x-auto pb-4 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-full font-bold whitespace-nowrap transition-all shadow-sm ${
                  activeCategory === cat
                    ? "bg-orange-500 text-white scale-105 shadow-orange-200"
                    : "bg-white text-gray-600 hover:bg-orange-50 border border-gray-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
            <Utensils className="text-orange-500" />
            {activeCategory === "All"
              ? "Latest Recipes"
              : `${activeCategory} Specials`}
          </h2>

          {loading ? (
            <div className="h-64 flex flex-col justify-center items-center">
              <ClipLoader color="#f97316" size={50} />
              <p className="mt-4 text-gray-500 italic">
                Mixing the ingredients...
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredData.length > 0 ? (
                filteredData.map((recipe) => (
                  <div
                    key={recipe._id}
                    onClick={() => navigate(`/recipe/${recipe._id}`)}
                    className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="relative">
                      <img
                        src={
                          recipe.photos?.[0] ||
                          "https://via.placeholder.com/400x250"
                        }
                        alt={recipe.title}
                        className="w-full h-56 object-cover"
                      />
                      <div
                        onClick={(e) => handleLike(e, recipe._id)}
                        className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 shadow-sm"
                      >
                        <Heart
                          size={25}
                          className={
                            recipe.like?.includes(userId)
                              ? "text-red-500 fill-red-500"
                              : "text-gray-400"
                          }
                        />
                        <span className="text-xs font-bold text-gray-700">
                          {recipe.like?.length || 0}
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <span className="text-orange-500 text-xs font-bold uppercase tracking-widest">
                        {recipe.category}
                      </span>
                      <h3 className="text-xl font-bold text-gray-800 mt-1 mb-3 line-clamp-1">
                        {recipe.title}
                      </h3>

                      <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                        <div className="flex items-center gap-2 text-gray-500">
                          <Clock size={16} />
                          <span className="text-sm font-medium">
                            {recipe.cookTime || 20} min
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-gray-400">
                          By {recipe.createdBy?.username || "Chef"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-20">
                  <p className="text-gray-400 text-xl italic">
                    No recipes found. Try a different search or category!
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default RecipeHome;
