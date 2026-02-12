RecipeNest – Full-Stack Recipe Sharing Platform
RecipeNest is a professional MERN stack application that allows users to share and discover recipes, follow chefs, and plan meals. It was developed according to the coding assessment guidelines.

Features Implemented
1. Recipe Management & Discovery
Share Recipes: Users can add titles, ingredients, step-by-step instructions, and servings.

Media Integration: Supports photos and YouTube video tutorials.

Advanced Search: Filter recipes based on ingredients, cuisine, and meal type.

Ratings & Reviews: 1-5 star rating and detailed comments system.

2. User & Social Features
User Profiles: Personalized dashboard where users can manage their submitted recipes and favorites.

Follow System: Real-time system to follow and unfollow other chefs.

Favorites: Wishlist feature to save favorite recipes.

3. Meal Planning & Shopping List
Meal Planner: Weekly meal planning tool.

Auto-Generated Shopping List: Automatically generates a shopping list of ingredients from selected recipes, which can be printed.

Tech Stack
Frontend: React.js, TailwindCSS, Framer Motion (Animations), Lucide React (Icons).

Backend: Node.js, Express.js.

Database: MongoDB Atlas.

Auth: JSON Web Tokens (JWT) & BcryptJS.

Deployment: * Frontend: Netlify / Vercel.

Backend: Render. Project Structure
plain text
├── backend/
│ ├── controllers/ # Logic for Recipes, Users, Follows, Favs
│ ├── models/ # Mongoose Schemas (User.model, Recipe.model, etc.)
│ ├── routes/ # Express Endpoints
│ └── middleware/ # Authentication (JWT) & Error Handling
├── frontend/
│ ├── src/
│ │ ├── components/ # Reusable UI (Navbar, RecipeCard, Loader)
│ │ ├── pages/ # Main Views (Home, Profile, MealPlanner)
│ │ └── App.js # React Router setup
└── README.md
⚙️ Setup & Installation
1. Clone the project:
