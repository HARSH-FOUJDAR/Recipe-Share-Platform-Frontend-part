import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";
import {
  FaUtensils,
  FaRegCalendarAlt,
  FaEdit,
  FaTrash,
  FaStickyNote,
} from "react-icons/fa";
import { Loader2 } from "lucide-react";
import axios from "axios";

const MealPlanner = () => {
  const [date, setDate] = useState("");
  const [breakfast, setBreakfast] = useState("");
  const [lunch, setLunch] = useState("");
  const [dinner, setDinner] = useState("");
  const [notes, setNotes] = useState("");
  const [mealPlans, setMealPlans] = useState([]);
  const [editPlanId, setEditPlanId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recipes, setRecipes] = useState([]);
  const API_BASE = "https://recipe-share-platform-backend.vercel.app/meals";
  const token = localStorage.getItem("token");

  const fetchRecipe = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "https://recipe-share-platform-backend.vercel.app/recipes/myRecipe",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        },
      );
      toast.success(res.data);
      setRecipes(res.data.recipes || res.data);
    }catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchRecipe();
  }, []);

  const fetchMealPlans = async () => {
    try {
      const res = await fetch(`${API_BASE}/mealplan`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setMealPlans(data.mealPlans);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMealPlans();
  }, []);

  const clearForm = () => {
    setBreakfast("");
    setLunch("");
    setDinner("");
    setNotes("");
    setDate("");
    setEditPlanId(null);
  };

  const handleCreateOrUpdate = async () => {
    if (!date || !breakfast || !lunch || !dinner) {
      toast.warning("Please fill all required fields");
      return;
    }

    const payload = { date, meals: { breakfast, lunch, dinner }, notes };
    const url = editPlanId
      ? `${API_BASE}/mealplan/${editPlanId}`
      : `${API_BASE}/createmealplan`;
    const method = editPlanId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        clearForm();
        fetchMealPlans();
      } else toast.error(data.message);
    } catch (err) {
      toast.error("Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      const res = await fetch(`${API_BASE}/mealplan/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        toast.success("Deleted successfully");
        setMealPlans((prev) => prev.filter((p) => p._id !== id));
      }
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const Ingredients = (selectedRecipeName) => {
    const recipe = recipes.find(
      (r) => (r.title || r.name) === selectedRecipeName,
    );
    return recipe ? recipe.ingredients : [];
  };

  const handleEdit = (plan) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setEditPlanId(plan._id);
    setDate(plan.date.slice(0, 10));
    setBreakfast(plan.meals.breakfast);
    setLunch(plan.meals.lunch);
    setDinner(plan.meals.dinner);
    setNotes(plan.notes || "");
  };
  if (loading)
    return (
      <div className="min-h-screen  flex items-center justify-center gap-5">
        <Loader2 className="text-red-500 animate-spin" size={100} />
        <p className="text-2xl mt-4">Please Wait....</p>
      </div>
    );
  return (
    <div className="min-h-screen bg-slate-50 pb-10">
      <Navbar />
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
            <FaUtensils className="text-indigo-600" /> Meal Planner
          </h1>
        </header>

        <div className="grid  gap-8">
          {/* FORM */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-2xl shadow-md sticky top-8 border border-slate-100">
              <h2 className="text-lg font-bold mb-4 border-b pb-2">
                {editPlanId ? "Edit Plan" : "New Plan"}
              </h2>
              <div className="space-y-4">
                <label className="text-sm font-bold text-slate-600 block mb-1">
                  Date
                </label>
                <input
                  type="date"
                  className="w-full p-3 bg-orange-50 border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-400 outline-none"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
                <div className="mb-4">
                  <label className="text-sm font-bold text-slate-600 block mb-1">
                    BreakFast
                  </label>
                  <select
                    className="w-full p-3 bg-orange-50 border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-400 outline-none"
                    value={breakfast}
                    onChange={(e) => setBreakfast(e.target.value)}
                  >
                    <option value="">Select Breakfast</option>
                    {recipes.map((r) => (
                      <option key={r._id} value={r.title || r.name}>
                        {r.title || r.name}
                      </option>
                    ))}
                  </select>
                  {breakfast && (
                    <div className="mt-2 p-3 bg-white border border-orange-100 rounded-lg shadow-sm">
                      <p className="text-xs font-bold text-orange-600 uppercase mb-1">
                        Ingredients Needed:
                      </p>
                      <ul className="text-xs text-slate-600 list-disc ml-4">
                        {Ingredients(breakfast).map((ing, index) => (
                          <li key={index}>{ing}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <label className="text-sm font-bold text-slate-600 block mb-1">
                    Lunch
                  </label>
                  <select
                    className="w-full p-3 bg-orange-50 border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-400 outline-none"
                    value={lunch}
                    onChange={(e) => setLunch(e.target.value)}
                  >
                    <option value="">Select Lunch</option>
                    {recipes.map((r) => (
                      <option key={r._id} value={r.title || r.name}>
                        {r.title || r.name}
                      </option>
                    ))}
                  </select>
                  {lunch && (
                    <div className="mt-2 p-3 bg-white border border-orange-100 rounded-lg shadow-sm">
                      <p className="text-xs font-bold text-orange-600 uppercase mb-1">
                        Ingredients Needed:
                      </p>
                      <ul className="text-xs text-slate-600 list-disc ml-4">
                        {Ingredients(lunch).map((ing, index) => (
                          <li key={index}>{ing}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <label className="text-sm font-bold text-slate-600 block mb-1">
                    Dinner
                  </label>
                  <select
                    className="w-full p-3 bg-orange-50 border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-400 outline-none"
                    value={dinner}
                    onChange={(e) => setDinner(e.target.value)}
                  >
                    <option value="">Select Dinner</option>
                    {recipes.map((r) => (
                      <option key={r._id} value={r.title || r.name}>
                        {r.title || r.name}
                      </option>
                    ))}
                  </select>

                  {dinner && (
                    <div className="mt-2 p-3 bg-white border border-orange-100 rounded-lg shadow-sm">
                      <p className="text-xs font-bold text-orange-600 uppercase mb-1">
                        Ingredients Needed:
                      </p>
                      <ul className="text-xs text-slate-600 list-disc ml-4">
                        {Ingredients(dinner).map((ing, index) => (
                          <li key={index}>{ing}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <label className="text-sm font-bold text-slate-600 block mb-1">
                  Note
                </label>
                <textarea
                  placeholder="Notes"
                  className="w-full p-3 bg-orange-50 border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-400 outline-none"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
                <button
                  onClick={handleCreateOrUpdate}
                  className={`w-full py-3 rounded-xl font-bold text-white ${editPlanId ? "bg-orange-500" : "bg-indigo-600"}`}
                >
                  {editPlanId ? "Update Plan" : "Save Plan"}
                </button>
                {editPlanId && (
                  <button
                    onClick={clearForm}
                    className="w-full text-slate-500 text-sm"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* LIST */}
          <div className="lg:col-span-3 space-y-6">
            {mealPlans.map((plan) => (
              <div
                key={plan._id}
                className="bg-white p-6 rounded-2xl shadow-sm border group"
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="font-bold text-indigo-600">
                    {new Date(plan.date).toDateString()}
                  </span>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <button
                      onClick={() => handleEdit(plan)}
                      className="text-orange-500 p-2 hover:bg-orange-50 rounded-lg"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(plan._id)}
                      className="text-red-500 p-2 hover:bg-red-50 rounded-lg"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <strong>B:</strong> {plan.meals.breakfast}
                    <div className="mt-5 flex flex-wrap gap-3">
                      {recipes
                        .find(
                          (r) => (r.title || r.name) === plan.meals.breakfast,
                        )
                        ?.ingredients?.map((ing, i) => (
                          <span
                            key={i}
                            className="text-md bg-white border px-5 py-2 rounded text-slate-600"
                          >
                            {ing}
                          </span>
                        ))}
                    </div>
                  </div>

                  <div className="p-2 bg-slate-50 rounded-lg">
                    <strong>L:</strong> {plan.meals.lunch}
                    <div className="mt-2 flex flex-wrap gap-3">
                      {recipes
                        .find(
                          (r) => (r.title || r.name) === plan.meals.breakfast,
                        )
                        ?.ingredients?.map((ing, i) => (
                          <span
                            key={i}
                            className="text-md bg-white border px-1.5 py-0.5 rounded text-slate-500"
                          >
                            {ing}
                          </span>
                        ))}
                    </div>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <strong>D:</strong> {plan.meals.dinner}
                    <div className="mt-2 flex flex-wrap gap-3">
                      {recipes
                        .find(
                          (r) => (r.title || r.name) === plan.meals.breakfast,
                        )
                        ?.ingredients?.map((ing, i) => (
                          <span
                            key={i}
                            className="text-md bg-white border px-1.5 py-0.5 rounded text-slate-500"
                          >
                            {ing}
                          </span>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealPlanner;
