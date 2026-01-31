import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";
import { Loader2, Heart, Clock, Utensils, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

const Favrouits = () => {
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const API_BASE = "https://recipe-share-platform-backend-2.onrender.com";
  const token = localStorage.getItem("token");

  const fetchFavorites = async () => {
    if (!token) {
      toast.warn("Please login to see your favorites");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/Fav`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFavoriteRecipes(res.data.favorites || res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load favorite recipes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const removeFavorite = async (e, recipeId) => {
    e.stopPropagation();
    try {
      await axios.post(
        `${API_BASE}/Fav/favrouits`,
        { recipeId },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setFavoriteRecipes((prev) =>
        prev.filter((item) => item.recipe._id !== recipeId),
      );
      toast.info("Removed from favorites");
    } catch (err) {
      toast.error("Could not remove favorite");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="text-orange-500 animate-spin" size={60} />
        <p className="mt-4 text-gray-500 font-medium italic">
          Fetching your favorites...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 py-12 w-full">
        <div className="flex items-center gap-3 mb-10">
          <div className="bg-orange-500 p-3 rounded-2xl shadow-lg shadow-orange-200">
            <Heart className="text-white fill-white" size={28} />
          </div>
          <h1 className="text-4xl font-black text-gray-800 tracking-tight">
            My <span className="text-orange-500">Favorites</span>
          </h1>
        </div>

        {favoriteRecipes.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-gray-200">
            <Utensils className="mx-auto text-gray-300 mb-4" size={60} />
            <p className="text-gray-500 text-xl font-medium">
              No favorites added yet!
            </p>
            <button
              onClick={() => navigate("/recipe-home")}
              className="mt-6 bg-orange-500 text-white px-8 py-3 rounded-2xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-100"
            >
              Explore Recipes
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {favoriteRecipes.map((item) => {
              const recipe = item.recipe || item;

              return (
                <div
                  key={recipe._id}
                  onClick={() => navigate(`/recipe/${recipe._id}`)}
                  className="group bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-500"
                >
                  <div className="relative h-60">
                    <img
                      src={
                        recipe.photos?.[0] ||
                        "https://via.placeholder.com/400x300"
                      }
                      alt={recipe.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <button
                      onClick={(e) => removeFavorite(e, recipe._id)}
                      className="absolute top-4 right-4 bg-white/90 backdrop-blur-md p-3 rounded-full text-red-500 shadow-lg hover:bg-red-500 hover:text-white transition-all"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>

                  <div className="p-7">
                    <span className="bg-orange-50 text-orange-600 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                      {recipe.category || "General"}
                    </span>
                    <h3 className="text-2xl font-bold text-gray-800 mt-3 mb-4 line-clamp-1">
                      {recipe.title}
                    </h3>

                    <div className="flex items-center justify-between pt-5 border-t border-gray-50">
                      <div className="flex items-center gap-2 text-gray-500">
                        <Clock size={18} className="text-orange-400" />
                        <span className="font-bold text-sm">
                          {recipe.cookTime || 30} mins
                        </span>
                      </div>
                      <p className="text-xs font-bold text-gray-400">
                        Chef {recipe.createdBy?.username || "Master"}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Favrouits;
