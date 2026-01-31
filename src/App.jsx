import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgetPassword from "./pages/Forgetpassword";
import Resetpassword from "./pages/Resetpassword";
import CreateRecipe from "./pages/CreateReipe";
import RecipeDetail from "./pages/RecipeDetail";
import MealPlanner from "./pages/MealPlanner";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import RecipeHome from "./pages/RecipeHome";
import MyRecipe from "./pages/MyRecipe";
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/reset-password/:token" element={<Resetpassword />} />

        <Route path="/recipes" element={<CreateRecipe />} />
        <Route path="/edit-recipe/:id" element={<CreateRecipe />} />

        <Route path="/recipe/:id" element={<RecipeDetail />} />
        <Route path="/meal-planner" element={<MealPlanner />} />
        <Route path="/profile" element={<Profile />} />

        <Route path="/recipe-my" element={<MyRecipe />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/recipe-home" element={<RecipeHome />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
