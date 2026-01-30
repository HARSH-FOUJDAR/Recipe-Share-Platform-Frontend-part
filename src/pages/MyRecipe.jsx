import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { toast } from "react-toastify";
import { Loader2, Search, Edit3, Trash2, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const myRecipe = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Backend URL Base
  const API_BASE = "https://recipe-share-platform-backend-2.onrender.com";

  useEffect(() => {
    const fetchMyRecipe = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Please login first");
          navigate("/login");
          return;
        }

        const res = await axios.get(`${API_BASE}/recipes/myRecipe`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Ensure we are setting an array
        setRecipes(res.data.recipes || []);
      } catch (err) {
        toast.error("Failed to load your recipes");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyRecipe();
  }, [navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this recipe?")) return;
    
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE}/recipes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setRecipes((prev) => prev.filter((recipe) => recipe._id !== id));
      toast.success("Recipe deleted successfully");
    } catch (err) {
      toast.error("Failed to delete recipe");
    }
  };

  const filteredData = recipes.filter((item) =>
    item.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="text-emerald-500 animate-spin" size={60} />
        <p className="text-xl font-medium text-gray-600 mt-4">Loading your kitchen...</p>
      </div>
    );

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      
      {/* Header Section */}
      <div className="bg-slate-900 py-16 px-6 text-center text-white">
        <h1 className="text-4xl font-extrabold mb-6 tracking-tight">Your Recipe Collection</h1>
        <div className="max-w-md mx-auto relative">
          <input
            type="text"
            placeholder="Search your dishes..."
            className="w-full p-4 pl-12 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 backdrop-blur-sm transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-4 top-4 text-gray-400" size={20} />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {recipes.length === 0 ? (
          <div className="text-center mt-10">
            <p className="text-gray-500 text-xl italic">You haven’t created any recipes yet 🍳</p>
            <button 
              onClick={() => navigate("/add-recipe")} 
              className="mt-4 text-emerald-600 font-bold hover:underline"
            >
              Start Cooking Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredData.map((recipe) => (
              <div
                key={recipe._id}
                className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-48">
                  <img
                    src={recipe.photos?.[0] || "https://via.placeholder.com/400x300"}
                    className="w-full h-full object-cover"
                    alt={recipe.title}
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 text-xs font-bold text-gray-700 shadow-sm">
                    <Clock size={14} className="text-emerald-500" /> {recipe.cookTime} mins
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-bold text-xl text-gray-800 truncate mb-4">
                    {recipe.title}
                  </h3>

                  <div className="flex gap-3">
                    <button
                      onClick={() => navigate(`/edit-recipe/${recipe._id}`)}
                      className="flex-1 flex justify-center items-center gap-2 bg-emerald-50 text-emerald-600 py-3 rounded-xl font-bold hover:bg-emerald-100 transition-colors cursor-pointer"
                    >
                      <Edit3 size={18} />
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(recipe._id)}
                      className="flex items-center justify-center bg-red-50 text-red-500 p-3 rounded-xl hover:bg-red-100 transition-colors cursor-pointer"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default myRecipe;