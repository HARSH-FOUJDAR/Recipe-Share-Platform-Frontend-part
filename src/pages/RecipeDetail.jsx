import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";
import {
  Star,
  Utensils,
  Clock,
  MessageCircle,
  Share2,
  Trash2,
} from "lucide-react";
import { ClipLoader } from "react-spinners";
import { motion } from "framer-motion";

const RecipeDetail = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");

  const [userRating, setUserRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [hover, setHover] = useState(0);

  const API_BASE = "https://recipe-share-platform-backend-2.onrender.com";

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        };

        const [recipeRes, commentRes, ratingRes] = await Promise.all([
          axios.get(`${API_BASE}/recipes/${id}`, config),
          axios.get(`${API_BASE}/comments/comment/${id}`, config),
          axios.get(`${API_BASE}/ratings/${id}`),
        ]);

        setRecipe(recipeRes.data.recipe || recipeRes.data);
        setComments(commentRes.data.comments || []);

        if (ratingRes.data.rating && ratingRes.data.rating.length > 0) {
          const avg =
            ratingRes.data.rating.reduce((acc, curr) => acc + curr.rating, 0) /
            ratingRes.data.count;
          setAverageRating(avg);
        }
      } catch (err) {
        console.error(err);
        toast.error("Error loading recipe data");
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, [id]);

  const handleRate = async (ratingValue) => {
    const token = localStorage.getItem("token");
    if (!token) return toast.warning("Please login to rate this recipe");

    try {
      await axios.post(
        `${API_BASE}/ratings/rating`,
        { recipeId: id, rating: ratingValue },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setUserRating(ratingValue);
      toast.success("Rating updated!");
    } catch (err) {
      toast.error("Failed to save rating");
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(
        `${API_BASE}/comments/comment`,
        { text: comment, recipeId: id },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setComments([res.data.comment, ...comments]);
      setComment("");
      toast.success("Review posted!");
    } catch (err) {
      toast.error("Failed to post comment");
    }
  };

  if (loading)
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-white">
        <ClipLoader color="#ef4444" size={80} />
        <p className="mt-4 text-gray-500 font-medium italic">
          Preparing your feast...
        </p>
      </div>
    );

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 mt-8">
        {/* HERO SECTION */}
        <div className="relative h-[500px] rounded-[2.5rem] overflow-hidden shadow-2xl group">
          <img
            src={recipe.photos?.[0] || "https://via.placeholder.com/1200x500"}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            alt={recipe.title}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <div className="absolute bottom-10 left-10 text-white">
            <h1 className="text-5xl md:text-7xl font-black mb-4">
              {recipe.title}
            </h1>
            <div className="flex items-center gap-4">
              <span className="bg-red-500 px-4 py-1 rounded-full text-sm font-bold uppercase">
                {recipe.category}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={18} /> {recipe.cookTime} mins
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-12">
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Utensils className="text-red-500" /> Ingredients
              </h2>
              <ul className="space-y-4">
                {recipe.ingredients?.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-3 text-gray-700 text-lg"
                  >
                    <span className="h-2 w-2 rounded-full bg-red-400" /> {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center">
              <h3 className="text-xl font-bold mb-4">Rate this Recipe</h3>
              <div className="flex justify-center gap-2 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    whileTap={{ scale: 0.8 }}
                    key={star}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                    onClick={() => handleRate(star)}
                  >
                    <Star
                      size={35}
                      className={`transition-colors ${
                        star <= (hover || userRating || averageRating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-200"
                      }`}
                    />
                  </motion.button>
                ))}
              </div>
              <p className="text-gray-500 font-medium">
                Average: {averageRating.toFixed(1)}
              </p>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-10">
            <section>
              <h2 className="text-3xl font-bold mb-6">Preparation Method</h2>
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <p className="text-xl text-gray-600 leading-relaxed italic mb-8 border-l-4 border-red-500 pl-4">
                  "{recipe.instructions}"
                </p>
                <div className="space-y-6">
                  {recipe.steps?.map((step, i) => (
                    <div key={i} className="flex gap-6 items-start">
                      <span className="bg-red-100 text-red-600 font-bold px-4 py-2 rounded-xl">
                        {i + 1}
                      </span>
                      <p className="text-lg text-gray-700 pt-1">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* REVIEWS */}
            <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <MessageCircle className="text-blue-500" /> Community Reviews
              </h2>
              <form onSubmit={handleComment} className="flex gap-4 mb-8">
                <input
                  className="flex-1 bg-gray-50 border-none rounded-2xl px-6 py-4 outline-none ring-2 ring-transparent focus:ring-red-500 transition-all"
                  placeholder="Share your experience..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <button
                  type="submit"
                  className="bg-red-500 text-white px-8 py-4 rounded-2xl font-bold hover:bg-red-600 transition-all shadow-lg"
                >
                  Post
                </button>
              </form>

              <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2">
                {comments.map((c) => (
                  <div
                    key={c._id}
                    className="p-4 rounded-2xl bg-gray-50 flex justify-between items-start group"
                  >
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center font-bold text-red-600">
                        {c.user?.username?.[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold">{c.user?.username}</p>
                        <p className="text-gray-600">{c.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
