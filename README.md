# Holistic Wellness Monitor

A full-stack wellness tracking app with features for meals, workouts, sleep, progress graphs, profile management, chatbot assistance, and more.

- Frontend: React + Vite + Tailwind CSS
- Backend: Express + MongoDB (Mongoose)
- Auth: JWT + Google OAuth
- Charts: Recharts
- Icons: lucide-react

## Monorepo Structure

- Root
  - frontend
  - backend

### Frontend

- [frontend](frontend)
  - [.env](frontend/.env)
  - [.env.example](frontend/.env.example)
  - [.gitignore](frontend/.gitignore)
  - [eslint.config.js](frontend/eslint.config.js)
  - [index.html](frontend/index.html)
  - [package.json](frontend/package.json)
  - [README.md](frontend/README.md)
  - [vite.config.js](frontend/vite.config.js)
  - [public](frontend/public)
  - [src](frontend/src)
    - [App.jsx](frontend/src/App.jsx)
    - [index.css](frontend/src/index.css)
    - [main.jsx](frontend/src/main.jsx)
    - [assets/](frontend/src/assets)
    - [components/](frontend/src/components)
      - [layout/](frontend/src/components/layout): Core UI components ([Navbar.jsx](frontend/src/components/layout/Navbar.jsx), [ChatBot.jsx](frontend/src/components/layout/ChatBot.jsx), [ProtectedRoute.jsx](frontend/src/components/layout/ProtectedRoute.jsx), [ScrollToTop.jsx](frontend/src/components/layout/ScrollToTop.jsx))
      - [dashboard/](frontend/src/components/dashboard): Dashboard widgets ([HealthOverview.jsx](frontend/src/components/dashboard/HealthOverview.jsx), [WorkoutWidget.jsx](frontend/src/components/dashboard/WorkoutWidget.jsx), [ProfileSummaryCard.jsx](frontend/src/components/dashboard/ProfileSummaryCard.jsx), [GamificationWidget.jsx](frontend/src/components/dashboard/GamificationWidget.jsx), [MacroChartWidget.jsx](frontend/src/components/dashboard/MacroChartWidget.jsx))
      - [trackers/](frontend/src/components/trackers): Activity trackers ([TodaysMeals.jsx](frontend/src/components/trackers/TodaysMeals.jsx), [StepCount.jsx](frontend/src/components/trackers/StepCount.jsx), [WaterTracker.jsx](frontend/src/components/trackers/WaterTracker.jsx), [SleepTracker.jsx](frontend/src/components/trackers/SleepTracker.jsx))
      - [common/](frontend/src/components/common): Reusable UI elements ([BMICalculator.jsx](frontend/src/components/common/BMICalculator.jsx), [MacroChart.jsx](frontend/src/components/common/MacroChart.jsx))
    - [pages/](frontend/src/pages): Application views
      - [LandingPage.jsx](frontend/src/pages/LandingPage.jsx)
      - [DashBoard.jsx](frontend/src/pages/DashBoard.jsx)
      - [UserProfile.jsx](frontend/src/pages/UserProfile.jsx)
      - [MealTracker.jsx](frontend/src/pages/MealTracker.jsx)
      - [WorkoutTracker.jsx](frontend/src/pages/WorkoutTracker.jsx)
      - [ProgressGraphs.jsx](frontend/src/pages/ProgressGraphs.jsx)
      - [auth/](frontend/src/pages/auth): Authentication views ([Login.jsx](frontend/src/pages/auth/Login.jsx), [Register.jsx](frontend/src/pages/auth/Register.jsx), [ResetPassword.jsx](frontend/src/pages/auth/ResetPassword.jsx), [ResetPasswordConfirm.jsx](frontend/src/pages/auth/ResetPasswordConfirm.jsx), [GoogleCallback.jsx](frontend/src/pages/auth/GoogleCallback.jsx), [AuthLayout.jsx](frontend/src/pages/auth/AuthLayout.jsx))
    - [contexts/AuthContext.jsx](frontend/src/contexts/AuthContext.jsx)
    - [data/health-qa.json](frontend/src/data/health-qa.json)
    - [services/foodApi.js](frontend/src/services/foodApi.js)
    - [utils/fitnessCalculators.js](frontend/src/utils/fitnessCalculators.js)

### Backend

- [backend](backend)
  - [.env](backend/.env)
  - [.env.example](backend/.env.example)
  - [.gitignore](backend/.gitignore)
  - [index.js](backend/index.js)
  - [package.json](backend/package.json)
  - [config/db.js](backend/config/db.js)
  - [controllers/](backend/controllers)
    - Auth: [authController.js](backend/controllers/authController.js), [googleAuthController.js](backend/controllers/googleAuthController.js)
    - Meals: [mealController.js](backend/controllers/mealController.js) (e.g., [`addMeal`](backend/controllers/mealController.js))
    - Workouts: [workoutController.js](backend/controllers/workoutController.js)
    - Activity: [activityController.js](backend/controllers/activityController.js)
    - Daily Summary: [summaryController.js](backend/controllers/summaryController.js) (e.g., [`getSummaryByDate`](backend/controllers/summaryController.js), [`updateSummary`](backend/controllers/summaryController.js))
    - Food DB: [foodDatabaseController.js](backend/controllers/foodDatabaseController.js)
    - Reports: [reportController.js](backend/controllers/reportController.js)
    - Rewards: [rewardsController.js](backend/controllers/rewardsController.js)
    - Contact: [contactController.js](backend/controllers/contactController.js)
    - Newsletter: [newsletterController.js](backend/controllers/newsletterController.js)
  - [middlewares/](backend/middlewares)
    - [authMiddleware.js](backend/middlewares/authMiddleware.js) (e.g., [`protect`](backend/middlewares/authMiddleware.js))
    - [errorMiddleware.js](backend/middlewares/errorMiddleware.js)
  - [models/](backend/models)
    - [User.js](backend/models/User.js), [Meal.js](backend/models/Meal.js), [Workout.js](backend/models/Workout.js)
    - [Exercise.js](backend/models/Exercise.js)
    - [DailySummary.js](backend/models/DailySummary.js)
    - [FoodDatabase.js](backend/models/FoodDatabase.js)
  - [routes/](backend/routes)
    - [authRoutes.js](backend/routes/authRoutes.js)
    - [googleAuthRoutes.js](backend/routes/googleAuthRoutes.js)
    - [mealRoutes.js](backend/routes/mealRoutes.js)
    - [workoutRoutes.js](backend/routes/workoutRoutes.js)
    - [activityRoutes.js](backend/routes/activityRoutes.js)
    - [summaryRoutes.js](backend/routes/summaryRoutes.js)
    - [foodDatabaseRoutes.js](backend/routes/foodDatabaseRoutes.js)
    - [reportRoutes.js](backend/routes/reportRoutes.js)
    - [rewardsRoutes.js](backend/routes/rewardsRoutes.js)
    - [contactRoutes.js](backend/routes/contactRoutes.js)
    - [newsletterRoutes.js](backend/routes/newsletterRoutes.js)
  - [utils/](backend/utils)
    - [emailService.js](backend/utils/emailService.js)
    - [healthCalculations.js](backend/utils/healthCalculations.js)

## Features

- Nutrition: Log foods, see macro totals, quick stats
  - UI: [MealTracker.jsx](frontend/src/components/MealTracker.jsx), [TodaysMeals.jsx](frontend/src/components/TodaysMeals.jsx), [MacroChartWidget.jsx](frontend/src/components/MacroChartWidget.jsx)
  - API: [mealRoutes.js](backend/routes/mealRoutes.js) → [`addMeal`](backend/controllers/mealController.js), [`getMeals`](backend/controllers/mealController.js), [`getMealStats`](backend/controllers/mealController.js)
  - Food DB: [foodDatabaseRoutes.js](backend/routes/foodDatabaseRoutes.js)
- Workouts: Summary, progress, charts
  - UI: [WorkoutWidget.jsx](frontend/src/components/WorkoutWidget.jsx), [WorkoutTracker.jsx](frontend/src/components/WorkoutTracker.jsx)
  - API: [workoutRoutes.js](backend/routes/workoutRoutes.js)
- Sleep tracking: Today + weekly charts
  - UI: [SleepTracker.jsx](frontend/src/components/SleepTracker.jsx)
  - API: [activityRoutes.js](backend/routes/activityRoutes.js)
- Health overview: vitals, counters
  - UI: [HealthOverview.jsx](frontend/src/components/HealthOverview.jsx), [ProgressGraphs.jsx](frontend/src/components/ProgressGraphs.jsx)
- BMI calculator: interactive visuals
  - UI: [BMICalculator.jsx](frontend/src/components/BMICalculator.jsx)
- Dashboard: consolidated view
  - UI: [DashBoard.jsx](frontend/src/components/DashBoard.jsx)
- Auth: JWT-based, Google signin
  - UI: [auth/*](frontend/src/components/auth)
  - API: [authRoutes.js](backend/routes/authRoutes.js), [googleAuthRoutes.js](backend/routes/googleAuthRoutes.js)
- Reports & gamification:
  - UI: [GamificationWidget.jsx](frontend/src/components/GamificationWidget.jsx)
  - API: [reportRoutes.js](backend/routes/reportRoutes.js), [rewardsRoutes.js](backend/routes/rewardsRoutes.js)
- Contact & newsletter:
  - UI: [LandingPage.jsx](frontend/src/components/LandingPage.jsx)
  - API: [contactRoutes.js](backend/routes/contactRoutes.js), [newsletterRoutes.js](backend/routes/newsletterRoutes.js)
- Chatbot:
  - UI: [ChatBot.jsx](frontend/src/components/ChatBot.jsx)

## Prerequisites

- Node.js 18+
- MongoDB running locally or cloud (Atlas)

## Environment Variables

Create `.env` files from provided `.env.example` in each folder.

- Backend [.env.example](backend/.env.example):
  - MONGODB_URL=mongodb://localhost:27017/hwm
  - JWT_SECRET=your_jwt_secret
  - PORT=8000
  - FRONTEND_URL=http://localhost:5173
  - Optional Google OAuth: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
  - Optional email: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, FROM_EMAIL

- Frontend [.env.example](frontend/.env.example):
  - VITE_API_URL=http://localhost:8000
  - VITE_GEMINI_API_KEY=your_key_if_used

Ensure `backend/index.js` CORS origin matches `FRONTEND_URL`.

## Installation

- Backend
  - cd backend
  - npm install
  - node index.js (or set a start script to run `index.js`)
- Frontend
  - cd frontend
  - npm install
  - npm run dev

Default ports:
- Backend: 8000 (configure via `.env`)
- Frontend: 5173 (Vite default)

## API Overview

Base: http://localhost:8000/api

- Auth: [authRoutes.js](backend/routes/authRoutes.js)
- Google OAuth: [googleAuthRoutes.js](backend/routes/googleAuthRoutes.js)
- Meals: [mealRoutes.js](backend/routes/mealRoutes.js)
- Workouts: [workoutRoutes.js](backend/routes/workoutRoutes.js)
- Activity: [activityRoutes.js](backend/routes/activityRoutes.js)
- Summary: [summaryRoutes.js](backend/routes/summaryRoutes.js)
- Food DB: [foodDatabaseRoutes.js](backend/routes/foodDatabaseRoutes.js)
- Report: [reportRoutes.js](backend/routes/reportRoutes.js)
- Rewards: [rewardsRoutes.js](backend/routes/rewardsRoutes.js)
- Contact: [contactRoutes.js](backend/routes/contactRoutes.js)
- Newsletter: [newsletterRoutes.js](backend/routes/newsletterRoutes.js)

JWT protection is enforced by [`protect`](backend/middlewares/authMiddleware.js).

## Frontend Notes

- Auth context: [contexts/AuthContext.jsx](frontend/src/contexts/AuthContext.jsx)
- Vite config: [vite.config.js](frontend/vite.config.js)
- ESLint config: [eslint.config.js](frontend/eslint.config.js)

## Known Issues

- Daily summary controller bug:
  - In [`getSummaryByDate`](backend/controllers/summaryController.js) the workouts query uses `req.user._1d` instead of `req.user._id`. Fix to avoid missing workouts aggregation.

- Minor typo:
  - [frontend/index.html](frontend/index.html) includes “Hollistic” in title; consider updating to “Holistic”.

## Development Tips

- Use the integrated terminal to run both servers.
- If using local JWT in the frontend, ensure `localStorage.token` is set and `axios.defaults.headers.common.Authorization` is configured as in [contexts/AuthContext.jsx](frontend/src/contexts/AuthContext.jsx).
- For food search and logging, see [services/foodApi.js](frontend/src/services/foodApi.js) and backend food DB controller/routes.

## License

Proprietary. All rights reserved.