import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Heart, Clock, Search, Star } from "lucide-react";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import Footer from "../components/Footer";
import { Utensils } from "lucide-react";
const RecipeHome = () => {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const token = localStorage.getItem("token");

  const handelFavrouit = async (e, recipeId) => {
    e.stopPropagation();
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

      setRecipes((prev) =>
        prev.map((r) =>
          r._id === recipeId ? { ...r, isFavrouite: res.data.favorited } : r,
        ),
      );
    } catch (err) {
      toast.error("Failed to update favorite");
    }
  };

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

        <div className="bg-orange-500 py-12 md:py-20 px-4 text-center text-white">
          <h1 className="text-3xl md:text-5xl font-bold mb-6">
            Find Your Favorite Recipes
          </h1>
          <div className="max-w-xl mx-auto relative text-gray-800">
            <input
              type="text"
              placeholder="Search recipes..."
              className="w-full p-3 md:p-4 pl-12 rounded-xl md:rounded-2xl bg-white outline-none focus:ring-4 focus:ring-orange-500/20 transition-all text-sm md:text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search
              className="absolute right-5  top-3 md:top-4 text-gray-600"
              size={25}
            />
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-6 md:mt-10 px-4 md:px-6">
          <div className="flex gap-2 md:gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
            {[
              "All",
              "Breakfast",
              "Lunch",
              "Dinner",
              "Dessert",
              "Quick Snack",
            ].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-5 py-2 rounded-full text-sm md:text-base font-bold transition-all ${
                  activeCategory === cat
                    ? "bg-orange-500 text-white shadow-md shadow-orange-200"
                    : "bg-white text-gray-600 border border-gray-100 hover:bg-gray-50"
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 md:gap-8">
              {filteredData.length > 0 ? (
                filteredData.map((recipe) => (
                  <div
                    key={recipe._id}
                    onClick={() => navigate(`/recipe/${recipe._id}`)}
                    className="bg-white rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
                  >
                    <div className="relative h-48 md:h-56">
                      <img
                        src={
                          recipe.photos?.[0] ||
                          "https://via.placeholder.com/400x250"
                        }
                        alt={recipe.title}
                        className="w-full h-full object-cover"
                      />

                      <div
                        onClick={(e) => handleLike(e, recipe._id)}
                        className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm cursor-pointer"
                      >
                        <Heart
                          size={30}
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

                    <div className="p-5 md:p-6 flex flex-col flex-grow">
                      <span className="text-orange-500 text-[10px] md:text-xs font-bold uppercase tracking-wider">
                        {recipe.category}
                      </span>
                      <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3 line-clamp-1">
                        {recipe.title}
                      </h3>

                      <div className="flex justify-between items-center pb-4 border-b border-gray-50 mb-4 mt-auto">
                        <div className="flex items-center gap-1.5 text-gray-500">
                          <Clock size={14} />
                          <span className="text-xs md:text-sm">
                            {recipe.cookTime || 20} min
                          </span>
                        </div>
                        <p className="text-xs md:text-sm font-semibold text-gray-400">
                          By{" "}
                          <span className="text-gray-600">
                            {recipe.createdBy?.username || "Chef"}
                          </span>
                        </p>
                      </div>

                      <button
                        onClick={(e) => handelFavrouit(e, recipe._id)}
                        className={`w-full py-2.5 md:py-3 rounded-xl md:rounded-2xl text-sm md:text-base font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                          recipe.isFavrouite
                            ? "bg-red-500 text-white shadow-lg shadow-red-200"
                            : "bg-yellow-400 text-gray-900 hover:bg-yellow-500"
                        }`}
                      >
                        <Star
                          size={16}
                          fill={recipe.isFavrouite ? "white" : "none"}
                        />
                        {recipe.isFavrouite
                          ? "Remove Favorite"
                          : "Add to Favorites"}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-20 text-gray-400">
                  <Utensils className="mx-auto mb-4 opacity-20" size={64} />
                  <p className="text-xl">No recipes found for this search.</p>
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
