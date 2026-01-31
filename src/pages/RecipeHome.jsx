import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Heart, Clock, Search, Utensils, Star } from "lucide-react"; // Star icon add kiya
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import Footer from "../components/Footer";

const RecipeHome = () => {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const token = localStorage.getItem("token");

  // --- 1. Handel Favorite Function (Fixed Logic) ---
  const handelFavrouit = async (e, recipeId) => {
    e.stopPropagation(); // Card click event ko rokne ke liye
    if (!token) {
      toast.info("Please Login to add Favorites list");
      navigate("/login");
      return;
    }
    try {
      const res = await axios.post(
        "https://recipe-share-platform-backend-2.onrender.com/Fav/favrouits",
        { recipeId },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (res.data.favorited) {
        toast.success("Added to Favorites Successfully");
      } else {
        toast.info("Removed From Favorites");
      }

      // State update logic fix: map ko return karna zaroori hai
      setRecipes((prev) =>
        prev.map((r) =>
          r._id === recipeId ? { ...r, isFavrouite: res.data.favorited } : r,
        ),
      );
    } catch (err) {
      toast.error("Failed to update favorite");
    }
  };

  // --- 2. Handle Like Function ---
  const handleLike = async (e, recipeId) => {
    e.stopPropagation();
    if (!token) {
      toast.info("Please login to like");
      navigate("/login");
      return;
    }

    try {
      const res = await axios.post(
        `https://recipe-share-platform-backend-2.onrender.com/recipes/${recipeId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
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
        { headers: { Authorization: `Bearer ${token}` } },
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
      <div className="bg-gray-50 min-h-screen pb-10 font-sans">
        <Navbar />
        {/* Hero Section */}
        <div className="bg-slate-900 py-16 px-6 text-center text-white">
          <h1 className="text-4xl font-bold mb-6">
            Find Your Favorite Recipes
          </h1>
          <div className="max-w-md mx-auto relative text-gray-800">
            <input
              type="text"
              placeholder="What do you want to cook?"
              className="w-full p-4 pl-12 rounded-2xl bg-white outline-none focus:ring-4 focus:ring-orange-500/20 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-4 top-4 text-gray-400" size={24} />
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-10 px-6">
          {/* Categories */}
          <div className="flex gap-3 mb-10 overflow-x-auto pb-4 no-scrollbar">
            {[
              "All",
              "Breakfast",
              "Lunch",
              "Dinner",
              "Desserts",
              "Quick Snack",
            ].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-full font-bold transition-all ${
                  activeCategory === cat
                    ? "bg-orange-500 text-white shadow-lg shadow-orange-200"
                    : "bg-white text-gray-600 border border-gray-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="h-64 flex flex-col justify-center items-center">
              <ClipLoader color="#f97316" size={50} />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredData.map((recipe) => (
                <div
                  key={recipe._id}
                  onClick={() => navigate(`/recipe/${recipe._id}`)}
                  className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="relative h-56">
                    <img
                      src={
                        recipe.photos?.[0] ||
                        "https://via.placeholder.com/400x250"
                      }
                      alt={recipe.title}
                      className="w-full h-full object-cover"
                    />

                    {/* Like Button */}
                    <div
                      onClick={(e) => handleLike(e, recipe._id)}
                      className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 shadow-sm cursor-pointer"
                    >
                      <Heart
                        size={20}
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
                    <span className="text-orange-500 text-xs font-bold uppercase">
                      {recipe.category}
                    </span>
                    <h3 className="text-xl font-bold text-gray-800 mb-4 line-clamp-1">
                      {recipe.title}
                    </h3>

                    <div className="flex justify-between items-center pb-4 border-b border-gray-50 mb-4">
                      <div className="flex items-center gap-2 text-gray-500">
                        <Clock size={16} />{" "}
                        <span className="text-sm">
                          {recipe.cookTime || 20} min
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-gray-400">
                        By {recipe.createdBy?.username || "Chef"}
                      </p>
                    </div>

                    {/* --- Add to Favorites Button --- */}
                    <button
                      onClick={(e) => handelFavrouit(e, recipe._id)}
                      className={`w-full py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        recipe.isFavrouite
                          ? "bg-red-500 text-white shadow-lg shadow-red-200"
                          : "bg-yellow-400 text-gray-900 hover:bg-yellow-500"
                      }`}
                    >
                      <Star
                        size={18}
                        fill={recipe.isFavrouite ? "white" : "none"}
                      />
                      {recipe.isFavrouite ? "Delete Favrouits" : "Add to Favorites"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default RecipeHome;
