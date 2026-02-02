import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import {
  Plus,
  Trash,
  Clock,
  Users,
  Video,
  Image,
  ChefHat,
  ArrowLeft,
} from "lucide-react";

const CreateRecipe = () => {
  const navigate = useNavigate();
  const { id: recipeId } = useParams();
  const [title, setTitle] = useState("");
  const [instructions, setInstructions] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [servings, setServings] = useState("");
  const [videoTutorial, setVideoTutorial] = useState("");
  const [ingredients, setIngredients] = useState([""]);
  const [steps, setSteps] = useState([""]);
  const [photos, setPhotos] = useState([""]);
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      toast.error("Please login first!");
      navigate("/login");
    }
  }, [navigate, token]);

  useEffect(() => {
    if (!recipeId || !token) return;

    const fetchRecipe = async () => {
      try {
        const res = await axios.get(
          `https://recipe-share-platform-backend-2.onrender.com/recipes/${recipeId}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        const recipe = res.data.recipe || res.data;

        setTitle(recipe.title || "");
        setInstructions(recipe.instructions || "");
        setCookTime(recipe.cookTime || "");
        setServings(recipe.servings || "");
        setVideoTutorial(recipe.videoTutorial || "");
        setIngredients(recipe.ingredients?.length ? recipe.ingredients : [""]);
        setSteps(recipe.steps?.length ? recipe.steps : [""]);
        setPhotos(recipe.photos?.length ? recipe.photos : [""]);
        setCategory(recipe.category || "");
      } catch (err) {
        toast.error("Failed to load recipe data");
      }
    };
    fetchRecipe();
  }, [recipeId, token]);

  // Dynamic Input Helpers
  const handleAddInput = (state, setState) => setState([...state, ""]);
  const handleRemoveInput = (index, state, setState) => {
    if (state.length > 1) setState(state.filter((_, i) => i !== index));
  };
  const handleInputChange = (index, value, state, setState) => {
    const newArray = [...state];
    newArray[index] = value;
    setState(newArray);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!title || !category) {
      toast.error("Title and Category are required!");
      return;
    }

    setLoading(true);
    try {
      const recipeData = {
        title,
        instructions,
        cookTime,
        servings,
        videoTutorial,
        ingredients,
        steps,
        photos,
        category,
      };

      const url = recipeId
        ? `https://recipe-share-platform-backend-2.onrender.com/recipes/${recipeId}`
        : "https://recipe-share-platform-backend-2.onrender.com/recipes";

      const method = recipeId ? "put" : "post";

      await axios({
        method,
        url,
        data: recipeData,
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(recipeId ? "Recipe updated!" : "Recipe created!");
      navigate("/recipe-home");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      {/* Main Content Area - Desktop Sidebar width adjustment */}
      <div className="lg:ml-[280px] transition-all duration-300 pb-20">
        {/* Header Section */}
        <div className="bg-orange-500 text-white py-10 px-6 text-center shadow-lg relative">
          <button
            onClick={() => navigate(-1)}
            className="absolute left-6 top-10 p-2 bg-white/20 rounded-full hover:bg-white/30 md:flex hidden"
          >
            <ArrowLeft size={20} />
          </button>
          <ChefHat className="mx-auto mb-3" size={50} />
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            {recipeId ? "Update Your Recipe" : "Share Your Recipe"}
          </h1>
          <p className="mt-2 text-orange-100">
            Make the world taste your magic!
          </p>
        </div>

        <div className="max-w-4xl mx-auto px-4 md:px-8 mt-5">
          <form onSubmit={onSubmit} className="space-y-8">
            {/* 1. Basic Info Card */}
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
              <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                <div className="w-2 h-6 bg-orange-500 rounded-full"></div>{" "}
                General Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="text-sm font-bold text-gray-600 ml-1">
                    Recipe Title
                  </label>
                  <input
                    type="text"
                    className="w-full p-4 border-2 border-gray-50 rounded-2xl mt-1 focus:border-orange-400 outline-none transition-all bg-gray-50/50"
                    placeholder="e.g. Grandma's Secret Pasta"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-gray-600 ml-1">
                    Recipe Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-4 border-2 border-gray-50 rounded-2xl mt-1 focus:border-orange-400 outline-none transition-all bg-gray-50/50"
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Dessert">Desserts</option>
                    <option value="Quick Snack">Quick Snack</option>
                  </select>
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-sm font-bold text-gray-600 ml-1">
                      Time (Min)
                    </label>
                    <div className="flex items-center bg-gray-50/50 border-2 border-gray-50 rounded-2xl px-4 mt-1 focus-within:border-orange-400">
                      <Clock size={18} className="text-gray-400" />
                      <input
                        type="number"
                        placeholder="30"
                        className="w-full p-4 bg-transparent outline-none"
                        value={cookTime}
                        required
                        onChange={(e) => setCookTime(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="text-sm font-bold text-gray-600 ml-1">
                      Servings
                    </label>
                    <div className="flex items-center bg-gray-50/50 border-2 border-gray-50 rounded-2xl px-4 mt-1 focus-within:border-orange-400">
                      <Users size={18} className="text-gray-400" />
                      <input
                        type="number"
                        placeholder="2"
                        required
                        className="w-full p-4 bg-transparent outline-none"
                        value={servings}
                        onChange={(e) => setServings(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-bold text-gray-600 ml-1">
                    Description
                  </label>
                  <textarea
                    className="w-full p-4 border-2 border-gray-50 rounded-2xl mt-1 focus:border-orange-400 outline-none transition-all bg-gray-50/50"
                    rows="3"
                    placeholder="What makes this recipe special?"
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* 2. Ingredients Card */}
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Ingredients</h2>
                <button
                  type="button"
                  onClick={() => handleAddInput(ingredients, setIngredients)}
                  className="bg-orange-100 text-orange-600 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1 hover:bg-orange-200 transition-colors"
                >
                  <Plus size={18} /> Add Item
                </button>
              </div>
              <div className="space-y-3">
                {ingredients.map((item, index) => (
                  <div key={index} className="flex gap-3 group">
                    <input
                      type="text"
                      placeholder={`Ingredient ${index + 1}`}
                      className="flex-1 p-3 bg-gray-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-orange-200 transition-all"
                      value={item}
                      required
                      onChange={(e) =>
                        handleInputChange(
                          index,
                          e.target.value,
                          ingredients,
                          setIngredients,
                        )
                      }
                    />
                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveInput(index, ingredients, setIngredients)
                      }
                      className="p-3 text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <Trash size={20} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Steps Card */}
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  Preparation Steps
                </h2>
                <button
                  type="button"
                  onClick={() => handleAddInput(steps, setSteps)}
                  className="bg-orange-100 text-orange-600 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1 hover:bg-orange-200 transition-colors"
                >
                  <Plus size={18} /> Add Step
                </button>
              </div>
              <div className="space-y-4">
                {steps.map((item, index) => (
                  <div key={index} className="flex gap-4 items-start group">
                    <span className="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mt-2 flex-shrink-0">
                      {index + 1}
                    </span>
                    <textarea
                      placeholder="Explain this step..."
                      className="flex-1 p-3 bg-gray-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-orange-200 transition-all"
                      value={item}
                      onChange={(e) =>
                        handleInputChange(
                          index,
                          e.target.value,
                          steps,
                          setSteps,
                        )
                      }
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveInput(index, steps, setSteps)}
                      className="p-3 text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <Trash size={20} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Media Section */}
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
              <h2 className="text-xl font-bold mb-6 text-gray-800">
                Media & Links
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl">
                  <Video className="text-gray-400" />
                  <input
                    type="text"
                    placeholder="YouTube URL (Optional)"
                    className="w-full bg-transparent outline-none"
                    value={videoTutorial}
                    onChange={(e) => setVideoTutorial(e.target.value)}
                  />
                </div>
                {photos.map((url, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl"
                  >
                    <Image className="text-gray-400" />
                    <input
                      type="text"
                      placeholder="Photo URL"
                      className="w-full bg-transparent outline-none"
                      value={url}
                      onChange={(e) =>
                        handleInputChange(
                          index,
                          e.target.value,
                          photos,
                          setPhotos,
                        )
                      }
                    />
                    <Trash
                      size={18}
                      className="text-gray-300 cursor-pointer hover:text-red-500"
                      onClick={() =>
                        handleRemoveInput(index, photos, setPhotos)
                      }
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => handleAddInput(photos, setPhotos)}
                  className="text-sm font-bold text-orange-500 ml-1"
                >
                  + Add more photos
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row gap-4">
              <button
                disabled={loading}
                className="flex-1 bg-orange-500 text-white py-5 rounded-2xl font-black text-xl hover:bg-orange-600 shadow-lg shadow-orange-200 transition-all disabled:opacity-50"
              >
                {loading
                  ? "Processing..."
                  : recipeId
                    ? "Update Recipe"
                    : "Publish Now"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/recipe-home")}
                className="px-10 py-5 bg-white border-2 border-gray-100 text-gray-500 rounded-2xl font-bold hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateRecipe;
