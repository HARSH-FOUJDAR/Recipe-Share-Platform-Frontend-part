import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Star,
  Utensils,
  Clock,
  MessageCircle,
  UserPlus,
  UserCheck,
  Loader2,
  ChevronRight,
  Send,
  Share2,
  PlayCircle, // Video icon ke liye
} from "lucide-react";
import { ClipLoader } from "react-spinners";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";

const RecipeDetail = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");

  const [userRating, setUserRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [hoverStar, setHoverStar] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  const API_BASE = "https://recipe-share-platform-backend-2.onrender.com";
  const token = localStorage.getItem("token");

  const handleShare = async () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: recipe.title,
          text: `Check out this recipe: ${recipe.title}`,
          url: shareUrl,
        });
      } catch (error) {
        console.log("Share cancelled or failed:", error);
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard!");
    }
  };

  const fetchRecipeData = useCallback(async () => {
    try {
      const config = {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      };

      const [recipeRes, commentRes, ratingRes] = await Promise.all([
        axios.get(`${API_BASE}/recipes/${id}`, config),
        axios.get(`${API_BASE}/comments/comment/${id}`, config),
        axios.get(`${API_BASE}/ratings/${id}`),
      ]);

      const data = recipeRes.data.recipe || recipeRes.data;
      setRecipe(data);
      setComments(commentRes.data.comments || []);

      if (data.isFollowing) setIsFollowing(true);

      if (ratingRes.data.rating?.length > 0) {
        const avg = ratingRes.data.rating.reduce((a, b) => a + b.rating, 0) / ratingRes.data.count;
        setAverageRating(avg);
      }
    } catch (err) {
      toast.error("Humm... Something went wrong loading the recipe.");
    } finally {
      setLoading(false);
    }
  }, [id, token]);

  useEffect(() => {
    fetchRecipeData();
  }, [fetchRecipeData]);

  const handleFollow = async () => {
    if (!token) return toast.info("Please log in to follow creators! ");
    setFollowLoading(true);
    const action = isFollowing ? "unfollow" : "follow";

    try {
      await axios.post(
        `${API_BASE}/follow/${action}`,
        { userId: recipe.createdBy._id },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setIsFollowing(!isFollowing);
      toast.success(isFollowing ? "Unfollowed" : "Added to your following list!");
    } catch (err) {
      toast.error("Action failed. Try again?");
    } finally {
      setFollowLoading(false);
    }
  };

  const submitComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      const res = await axios.post(
        `${API_BASE}/comments/comment`,
        { text: commentText, recipeId: id },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setComments([res.data.comment, ...comments]);
      setCommentText("");
      toast.success("Review added! ");
    } catch (err) {
      toast.error("Could not post review.");
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <ClipLoader color="#F87171" size={70} />
        <p className="mt-4 text-gray-500 font-medium italic animate-pulse">Sharpening the knives...</p>
      </div>
    );

  return (
    <div className="bg-gray-50 min-h-screen pb-16 font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 mt-8">
        {/* Banner Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative h-[450px] rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white"
        >
          <img src={recipe.photos?.[0]} className="w-full h-full object-cover" alt="Delicious Food" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent" />
          <div className="absolute bottom-8 left-8 right-8 text-white">
            <button
              onClick={handleShare}
              className="absolute right-5 bottom-10 cursor-pointer bg-white w-12 h-12 text-black justify-center items-center flex rounded-full shadow-lg hover:scale-110 transition-transform"
            >
              <Share2 size={24} />
            </button>
            <div className="flex gap-2 mb-3">
              <span className="bg-orange-500 px-3 py-1 rounded-full text-xs font-bold uppercase">{recipe.category}</span>
              <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs flex items-center gap-1">
                <Clock size={14} /> {recipe.cookTime} mins
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold">{recipe.title}</h1>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-12">
          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-3xl font-bold mb-3 uppercase">
                {recipe.createdBy?.username?.[0]}
              </div>
              <h3 className="text-xl font-bold">{recipe.createdBy?.username}</h3>
              <p className="text-sm text-gray-400 mb-5 font-medium italic">Creator of this masterpiece</p>
              <button
                onClick={handleFollow}
                disabled={followLoading}
                className={`w-full py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all group ${
                  isFollowing ? "bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-600" : "bg-orange-500 text-white shadow-lg shadow-orange-100 hover:bg-orange-600"
                }`}
              >
                {followLoading ? <Loader2 className="animate-spin" size={20} /> : isFollowing ? <UserCheck /> : <UserPlus />}
                {isFollowing ? "Following" : "Follow Chef"}
              </button>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Utensils className="text-orange-500" /> Ingredients
              </h2>
              <ul className="space-y-4">
                {recipe.ingredients?.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-600 text-lg">
                    <ChevronRight className="text-orange-400 mt-1 shrink-0" size={18} /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-8 space-y-10">
            {/* The Process */}
            <section className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-3xl font-bold mb-8 font-serif underline decoration-orange-200 decoration-4">The Process</h2>
              <div className="space-y-8">
                {recipe.steps?.map((step, idx) => (
                  <div key={idx} className="flex gap-6">
                    <span className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center font-black shrink-0 border border-orange-100">{idx + 1}</span>
                    <p className="text-lg text-gray-700 leading-relaxed pt-1">{step}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* --- VIDEO TUTORIAL SECTION ADDED HERE --- */}
            {recipe.videoTutorial && (
              <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-800">
                  <PlayCircle className="text-red-500" /> Video Tutorial
                </h2>
                <div className="relative rounded-2xl overflow-hidden shadow-inner bg-black aspect-video">
                  <video
                    controls
                    className="w-full h-full"
                    controlsList="nodownload"
                    poster={recipe.photos?.[0]} // Video load hone se pehle image dikhegi
                  >
                    <source src={recipe.videoTutorial} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </section>
            )}

            {/* Rating Section */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center">
              <h4 className="text-xl font-bold mb-4">How did it turn out?</h4>
              <div className="flex justify-center gap-2 mb-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <motion.button
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    key={s}
                    onMouseEnter={() => setHoverStar(s)}
                    onMouseLeave={() => setHoverStar(0)}
                    onClick={() => setUserRating(s)}
                  >
                    <Star
                      size={35}
                      className={`transition-colors ${s <= (hoverStar || userRating || averageRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`}
                    />
                  </motion.button>
                ))}
              </div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                Avg Rating: {averageRating.toFixed(1)} / 5
              </p>
            </div>

            {/* Comments Section */}
            <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-blue-600">
                <MessageCircle size={24} /> Reviews
              </h2>
              <form onSubmit={submitComment} className="flex gap-2 mb-8">
                <input
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="flex-1 bg-gray-50 border-none rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-orange-400 transition-all"
                  placeholder="Leave a tip or a compliment..."
                />
                <button className="bg-orange-500 text-white p-4 rounded-2xl hover:bg-orange-600 shadow-md">
                  <Send size={20} />
                </button>
              </form>

              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                <AnimatePresence>
                  {comments.map((c) => (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      key={c._id}
                      className="p-4 rounded-2xl bg-gray-50 flex gap-4 border border-gray-100"
                    >
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold uppercase shrink-0">{c.user?.username?.[0]}</div>
                      <div>
                        <p className="font-bold text-gray-800 text-sm">{c.user?.username}</p>
                        <p className="text-gray-600 text-sm leading-snug">{c.text}</p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RecipeDetail;