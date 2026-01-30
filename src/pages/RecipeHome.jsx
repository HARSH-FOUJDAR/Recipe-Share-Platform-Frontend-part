import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Heart, Clock, Search } from "lucide-react";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
const RecipeHome = () => {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editRecipe, setEditRecipe] = useState(null);

  const [title, setTitle] = useState("");
  const [Description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [steps, setSteps] = useState("");
  const [category, setCategory] = useState("");
  const [cookingTime, setcookTime] = useState("");
  const [photo, setPhoto] = useState("");

  const handelEdit = (recipes) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setEditRecipe(recipes._id);
    setTitle(recipes.title);
    setDescription(recipes.Description);
    setIngredients(recipes.ingredients.join(", "));
    setSteps(recipes.steps);
    setCategory(recipes.category);
    setcookTime(recipes.cookTime);
    setPhoto(recipes.photo);
  };
  const token = localStorage.getItem("token");

  let userId = null;
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      userId = payload.id;
    } catch (e) {
      console.log("Token error");
    }
  }

  // Recipes load karne ka function
  const fetchAllRecipes = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://recipe-share-platform-backend.vercel.app/recipes",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setRecipes(response.data.recipes || response.data);
    } catch (error) {
      toast.info("Please Wait");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      toast("please Login Again Server Slow");
    } else {
      fetchAllRecipes();
    }
  }, []);

  const handleLikeClick = async (e, recipeId) => {
    e.stopPropagation();

    try {
      await axios.post(
        `https://recipe-share-platform-backend.vercel.app/recipes/${recipeId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setRecipes((prevRecipes) =>
        prevRecipes.map((recipe) => {
          if (recipe._id === recipeId) {
            const isAlreadyLiked = recipe.like.includes(userId);

            const updatedLikes = isAlreadyLiked
              ? recipe.like.filter((id) => id !== userId)
              : [...recipe.like, userId];

            return { ...recipe, like: updatedLikes };
          }
          return recipe;
        }),
      );
    } catch (error) {
      toast.error("Like karne mein error aaya");
    }
  };
  // Search filter logic
  const filteredData = recipes.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      <Navbar />
      {/* Hero / Search Section */}
      <div className="bg-slate-900 py-16 px-6 text-center text-white">
        <h1 className="text-4xl font-bold mb-6">Find Your Favorite Recipes</h1>
        <div className="max-w-md mx-auto relative">
          <input
            type="text"
            placeholder="Search dish name..."
            className="w-full p-3 pl-10 rounded-lg text-white border-white border-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
        </div>
      </div>

      {/* Recipe List Grid */}
      <div className="max-w-6xl mx-auto mt-10 px-6">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Latest Recipes
        </h2>

        {loading ? (
          <div className="h-screen flex flex-col justify-center items-center">
            <ClipLoader color="#f97316" size={60} />
            <p className="mt-4 text-gray-500">Loading recipe...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredData.map((recipe) => {
              const isLiked = recipe.like?.includes(userId);

              return (
                <div
                  key={recipe._id}
                  onClick={() => navigate(`/recipe/${recipe._id}`)}
                  className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition"
                >
                  {/* Image */}
                  <img
                    src={recipe.photos || "https://via.placeholder.com/400x250"}
                    alt="recipe"
                    className="w-full h-48 object-cover"
                  />

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-bold text-gray-800">
                        {recipe.title}
                      </h3>
                      <div className="flex flex-col items-center">
                        <button
                          onClick={(e) => handleLikeClick(e, recipe._id)}
                          className="focus:outline-none cursor-pointer"
                        >
                          <Heart
                            size={30}
                            className={
                              isLiked
                                ? "text-red-500 fill-red-500 "
                                : "text-gray-400"
                            }
                          />
                        </button>
                        <span className="text-xs font-bold text-gray-600">
                          {recipe.like?.length || 0}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-500 mt-1">
                      By: {recipe.createdBy?.username || "Unknown"}
                    </p>

                    <div className="flex items-center gap-2 mt-4 text-gray-600">
                      <Clock size={16} />
                      <span className="text-sm">
                        {recipe.cookTime || 20} mins
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && filteredData.length === 0 && (
          <div className="text-center mt-10 text-gray-500">NO Recipe</div>
        )}
      </div>
    </div>
  );
};

export default RecipeHome;
