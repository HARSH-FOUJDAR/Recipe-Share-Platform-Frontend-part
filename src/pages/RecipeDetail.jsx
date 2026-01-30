import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";
import { UserPlus, Heart, MessageCircle, Clock, Utensils } from "lucide-react";
import { ClipLoader } from "react-spinners";
import { Share2 } from "lucide-react";
import { Loader2 } from "lucide-react";
const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [shareCount, setShareCount] = useState(0);
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `https://recipe-share-platform-backend-2.onrender.com/recipes/${id}`,
          { headers: token ? { Authorization: `Bearer ${token}` } : {} },
        );

        const data = res.data.recipe || res.data;
        setRecipe(data);
        setLikesCount(data.likes?.length || 0);

        const currentUserId = res.data.currentUserId;
        setLiked(data.likes?.includes(currentUserId));
      } catch (err) {
        toast.info("Failed to load recipe details plese wait");
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

  const handleLike = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.warning("Please login to like this recipe");
      navigate("/login");
      return;
    }

    try {
      const res = await axios.post(
        `https://recipe-share-platform-backend-2.onrender.com/recipes/${id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setLiked(res.data.liked);
      setLikesCount(res.data.likesCount);
    } catch (err) {
      toast.error("Error updating like");
    }
  };
  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Login to post a review");
      return;
    }

    try {
      const res = await axios.post(
        `https://recipe-share-platform-backend-2.onrender.com/comments/comment`,
        { text: comment, recipeId: id },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setComments((prev) => [res.data.comment, ...prev]);
      setComment("");
      toast.success("Review posted!");
    } catch (err) {
      console.log(err);
      toast.error("Failed to post comment");
    }
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `https://recipe-share-platform-backend-2.onrender.com/comments/comment/${id}`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          },
        );
        setComments(res.data.comments);
      } catch (err) {
        console.log(err);
        toast.error("Failed to load comments");
      }
    };

    fetchComments();
  }, [id]);

  const handleDeletComment = async (commentId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }
    try {
      await axios.delete(
        `https://recipe-share-platform-backend-2.onrender.com/comments/delete/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setComments((prev) => prev.filter((c) => c._id !== commentId));

      toast.success("Comment deleted");
    } catch (err) {
      toast.error("Delet Failed");
      console.log(err);
    }
  };
  const handleShare = async () => {
    const token = localStorage.getItem("token");
    const shareUrl = window.location.href;

    try {
      const res = await axios.post(
        `https://recipe-share-platform-backend-2.onrender.com/recipes/${id}/share`,
        {},
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        },
      );
      setShareCount(res.data.shareCount);

      if (navigator.share) {
        await navigator.share({
          title: recipe.title,
          text: "Check out thsi recipes",
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Recipes link copied!");
      }
    } catch (err) {
      toast.error("Failed to share ");
      console.log(err);
    }
  };
  if (loading)
    return (
      <div className="fixed inset-0 bg-white flex flex-col justify-center items-center z-50">
        <Loader2 color="#ef4444" size={70} />
        <p className="mt-4 text-gray-500 font-medium">
          Cooking up the details...
        </p>
      </div>
    );

  if (!recipe)
    return (
      <div className="text-center mt-20 text-gray-500 italic">
        <div className="fixed inset-0  flex flex-col justify-center items-center z-50">
          <ClipLoader color="#ef4444" size={70} className="w-50" />
          <p className="mt-4 text-2xl text-gray-500 font-medium">
            Cooking up the details...
          </p>
        </div>
      </div>
    );

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <Navbar />

      {/* HERO SECTION */}
      <div className="max-w-7xl mx-auto px-4 mt-8">
        <div className="relative h-[500px] rounded-[2.5rem] overflow-hidden shadow-2xl group">
          <img
            src={recipe.photos?.[0] || "https://via.placeholder.com/1200x500"}
            alt={recipe.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>

          <div className="absolute bottom-8 left-8 right-8 text-white">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="bg-red-500 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                {recipe.category || "Trending"}
              </span>
              <span className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs">
                <Clock size={14} /> {recipe.cookTime || "30"} mins
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-2">
              {recipe.title}
            </h1>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-yellow-400 to-red-500 flex items-center justify-center font-bold text-white shadow-lg">
                {recipe.createdBy?.username?.charAt(0).toUpperCase() || "C"}
              </div>
              <p className="text-lg opacity-90 font-medium">
                by{" "}
                <span className="underline decoration-red-500 underline-offset-4">
                  {recipe.createdBy?.username || "MasterChef"}
                </span>
              </p>
            </div>
          </div>

          {/* QUICK ACTIONS BAR */}
          <div className="absolute top-6 right-6 flex flex-col gap-4">
            <button
              onClick={handleLike}
              className={`p-4 rounded-full shadow-lg transition-all transform hover:scale-110 active:scale-90 cursor-pointer   ${liked ? "bg-red-500 text-white" : "bg-white text-gray-800"}`}
            >
              <Heart fill={liked ? "currentColor" : "none"} size={24} />
            </button>
            <div>
              <button
                onClick={handleShare}
                className="p-4 rounded-full cursor-pointer bg-white text-gray-800 shadow-lg hover:scale-110 transition-all"
              >
                <Share2 size={22} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4">
          <div className="sticky top-24 space-y-8">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Utensils className="text-red-500" /> Ingredients
              </h2>
              <ul className="space-y-4">
                {recipe.ingredients?.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 text-gray-700"
                  >
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-red-400 flex-shrink-0"></span>
                    <span className="text-lg">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-white border-2 border-dashed border-gray-300 rounded-2xl font-bold text-gray-600 hover:border-red-500 hover:text-red-500 transition-all group">
              <UserPlus className="group-hover:rotate-12 transition-transform" />
              Follow Creator
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN - PREPARATION */}
        <div className="lg:col-span-8 space-y-10">
          {/* DESCRIPTION */}
          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Method</h2>
            <p className="text-gray-600 text-xl leading-relaxed italic border-l-4 border-red-500 pl-6 bg-red-50/30 py-4 rounded-r-xl">
              "{recipe.instructions}"
            </p>
          </div>

          {/* STEPS LIST */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Step-by-Step Guide
            </h2>
            <div className="grid gap-6">
              {recipe.steps?.map((step, i) => (
                <div
                  key={i}
                  className="flex gap-6 p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <span className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-xl bg-red-100 text-red-600 font-black text-xl">
                    {i + 1}
                  </span>
                  <p className="text-gray-700 text-lg leading-relaxed pt-1">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* VIDEO SECTION */}
          <video
            controls
            className="rounded-2xl"
            controlsList="nodownload"
            disablePictureInPicture
            onContextMenu={(e) => e.preventDefault()}
          >
            <source src={recipe.videoTutorial} type="video/mp4" />
          </video>

          {/* REVIEWS SECTION */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
              <MessageCircle className="text-indigo-500" /> Community Reviews (
              {comments.length})
            </h2>

            <form
              onSubmit={handleComment}
              className="flex flex-col sm:flex-row gap-3 mb-10"
            >
              <input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="flex-1 bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-red-500 transition-all outline-none"
                placeholder="How was your experience?"
              />
              <button
                type="submit"
                className="bg-red-500 hover:bg-red-600 text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-lg shadow-red-200 flex items-center justify-center"
              >
                Post
              </button>
            </form>

            <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2">
              {comments.length === 0 ? (
                <div className="text-center py-10 text-gray-400 italic">
                  Be the first to share your thoughts!
                </div>
              ) : (
                comments.map((c) => (
                  <div
                    key={c._id}
                    className="flex gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors"
                  >
                    <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold shrink-0 uppercase">
                      {c.user?.username?.charAt(0) || "U"}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">
                        {c.user?.username || "Food Lover"}
                      </p>
                      <p className="text-gray-600 mt-1">{c.text}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
