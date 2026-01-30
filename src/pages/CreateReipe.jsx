import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import { Plus, Trash, Clock, Users, Video, Image, ChefHat } from "lucide-react";

const CreateRecipe = () => {
  const navigate = useNavigate();
  const { id: recipeId } = useParams(); // URL se id milegi
  const [title, setTitle] = useState("");
  const [instructions, setInstructions] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [servings, setServings] = useState("");
  const [videoTutorial, setVideoTutorial] = useState("");
  const [ingredients, setIngredients] = useState([""]);
  const [steps, setSteps] = useState([""]);
  const [photos, setPhotos] = useState([""]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first!");
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    if (!recipeId) return;

    const fetchRecipe = async () => {
      try {
        const token = localStorage.getItem("token");
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
        setIngredients(recipe.ingredients.length ? recipe.ingredients : [""]);
        setSteps(recipe.steps.length ? recipe.steps : [""]);
        setPhotos(recipe.photos.length ? recipe.photos : [""]);
      } catch (err) {
        toast.error("Failed to load recipe");
      }
    };

    fetchRecipe();
  }, [recipeId]);

  //  Dynamic Fields Helpers
  const handleAddInput = (state, setState) => setState([...state, ""]);
  const handleRemoveInput = (index, state, setState) => {
    if (state.length > 1) {
      const newArray = state.filter((_, i) => i !== index);
      setState(newArray);
    }
  };
  const handleInputChange = (index, value, state, setState) => {
    const newArray = [...state];
    newArray[index] = value;
    setState(newArray);
  };

  //  Form Submit ---
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!title || !instructions) {
      toast.error("Title and Description are required!");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const recipeData = {
        title,
        instructions,
        cookTime,
        servings,
        videoTutorial,
        ingredients,
        steps,
        photos,
      };

      const url = recipeId
        ? `https://recipe-share-platform-backend.vercel.app/recipes/${recipeId}`
        : "https://recipe-share-platform-backend.vercel.app/recipes";
      const method = recipeId ? "put" : "post";

      await axios({
        method,
        url,
        data: recipeData,
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(
        recipeId
          ? "Recipe updated successfully!"
          : "Recipe added successfully!",
      );
      navigate("/recipe-home");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error saving recipe");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      {/* Hero */}
      <div className="bg-slate-900 text-white py-12 text-center">
        <ChefHat className="mx-auto mb-2" size={48} />
        <h1 className="text-3xl font-bold">
          {recipeId ? "Edit Recipe" : "Add New Recipe"}
        </h1>
        <p className="opacity-90">Share your delicious dish with the world!</p>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10">
        <form onSubmit={onSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Basic Details
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Recipe Name
                </label>
                <input
                  type="text"
                  className="w-full p-3 border rounded-lg mt-1 outline-orange-400"
                  placeholder="e.g. Butter Chicken"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Short Description
                </label>
                <textarea
                  className="w-full p-3 border rounded-lg mt-1 outline-orange-400"
                  rows="3"
                  placeholder="About this recipe..."
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Time & Servings */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border flex items-center gap-3">
              <Clock className="text-orange-500" />
              <input
                type="number"
                placeholder="Time (min)"
                className="w-full outline-none"
                value={cookTime}
                onChange={(e) => setCookTime(e.target.value)}
              />
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border flex items-center gap-3">
              <Users className="text-blue-500" />
              <input
                type="number"
                placeholder="Servings"
                className="w-full outline-none"
                value={servings}
                onChange={(e) => setServings(e.target.value)}
              />
            </div>
          </div>

          {/* Ingredients */}
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Ingredients</h2>
              <button
                type="button"
                onClick={() => handleAddInput(ingredients, setIngredients)}
                className="text-orange-500 flex items-center text-sm font-bold"
              >
                <Plus size={18} /> Add
              </button>
            </div>
            {ingredients.map((item, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder={`Ingredient ${index + 1}`}
                  className="flex-1 p-2 border-b outline-none focus:border-orange-400"
                  value={item}
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
                >
                  <Trash
                    size={18}
                    className="text-gray-300 hover:text-red-500"
                  />
                </button>
              </div>
            ))}
          </div>

          {/* Steps */}
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Preparation Steps</h2>
              <button
                type="button"
                onClick={() => handleAddInput(steps, setSteps)}
                className="text-orange-500 flex items-center text-sm font-bold"
              >
                <Plus size={18} /> Add
              </button>
            </div>
            {steps.map((item, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder={`Step ${index + 1}`}
                  className="flex-1 p-2 border-b outline-none focus:border-orange-400"
                  value={item}
                  onChange={(e) =>
                    handleInputChange(index, e.target.value, steps, setSteps)
                  }
                />
                <button
                  type="button"
                  onClick={() => handleRemoveInput(index, steps, setSteps)}
                >
                  <Trash
                    size={18}
                    className="text-gray-300 hover:text-red-500"
                  />
                </button>
              </div>
            ))}
          </div>

          {/* Media */}
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h2 className="text-lg font-semibold mb-4">Media (URLs)</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-2 border p-2 rounded-lg">
                <Video className="text-gray-400" />
                <input
                  type="text"
                  placeholder="YouTube Video URL"
                  className="w-full outline-none"
                  value={videoTutorial}
                  onChange={(e) => setVideoTutorial(e.target.value)}
                />
              </div>

              {photos.map((url, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 border p-2 rounded-lg"
                >
                  <Image className="text-gray-400" />
                  <input
                    type="text"
                    placeholder="Photo URL"
                    className="w-full outline-none"
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
                    size={16}
                    className="text-gray-300 cursor-pointer"
                    onClick={() => handleRemoveInput(index, photos, setPhotos)}
                  />
                </div>
              ))}

              <button
                type="button"
                onClick={() => handleAddInput(photos, setPhotos)}
                className="text-sm text-gray-500 underline"
              >
                + Add another photo URL
              </button>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-orange-500 text-white py-3 rounded-lg font-bold text-lg hover:bg-orange-600 transition"
            >
              {loading
                ? "Saving..."
                : recipeId
                  ? "Update Recipe"
                  : "Create Recipe"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/recipes")}
              className="px-6 py-3 border rounded-lg text-gray-500 hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRecipe;
