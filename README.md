RecipeNest – Full-Stack Recipe Sharing Platform
RecipeNest ek professional MERN stack application hai jo users ko recipes share karne, discover karne, chefs ko follow karne aur meal planning karne ki suvidha deta hai. Ise coding assessment ke guidelines ke mutabiq develop kiya gaya hai.

 Features Implemented
1. Recipe Management & Discovery
Share Recipes: Users title, ingredients, step-by-step instructions, aur servings add kar sakte hain.

Media Integration: Photos aur YouTube video tutorials support.

Advanced Search: Ingredients, cuisine, aur meal type ke basis par filter karne ki suvidha.

Ratings & Reviews: 1-5 star star rating aur detailed comments system.

2. User & Social Features
User Profiles: Personalized dashboard jahan submitted recipes aur favorites manage hote hain.

Follow System: Naye chefs ko follow aur unfollow karne ka real-time system.

Favorites: Pasandida recipes ko save karne ke liye wishlist feature.

3. Meal Planning & Shopping List
Meal Planner: Weekly meal planning tool.

Auto-Generated Shopping List: Selected recipes ke ingredients ki automatically list generate hoti hai jise print kiya ja sakta hai.

 Tech Stack
Frontend: React.js, TailwindCSS, Framer Motion (Animations), Lucide React (Icons).

Backend: Node.js, Express.js.

Database: MongoDB Atlas.

Auth: JSON Web Tokens (JWT) & BcryptJS.

Deployment: * Frontend: Netlify / Vercel.

Backend: Render.

 Project Structure
Plaintext
├── backend/
│   ├── controllers/      # Logic for Recipes, Users, Follows, Favs
│   ├── models/           # Mongoose Schemas (User.model, Recipe.model, etc.)
│   ├── routes/           # Express Endpoints
│   └── middleware/       # Authentication (JWT) & Error Handling
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable UI (Navbar, RecipeCard, Loader)
│   │   ├── pages/        # Main Views (Home, Profile, MealPlanner)
│   │   └── App.js        # React Router setup
└── README.md
⚙️ Setup & Installation
1. Clone the project:

Bash
cd recipe-nest
2. Backend Setup:

Bash
cd backend
npm install
npm start
3. Frontend Setup:

Bash
cd frontend
npm install
npm start
