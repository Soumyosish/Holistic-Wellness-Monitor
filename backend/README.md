# Holistic Wellness Monitor - Backend

This is the backend API for the Holistic Wellness Monitor, built with Express.js and MongoDB.

## Project Structure

- `index.js`: Application entry point.
- `config/`: Configuration files (e.g., database connection).
- `controllers/`: Request handlers for each resource.
  - `authController.js`: Registration, Login, Password Reset.
  - `mealController.js`: CRUD for meals and nutrition stats.
  - `workoutController.js`: CRUD for workouts.
  - `activityController.js`: Handles steps, water, and sleep.
  - `rewardController.js`: Gamification and achievements.
- `models/`: Mongoose schemas.
- `routes/`: API route definitions.
- `middlewares/`: Custom Express middlewares (Auth, Error handling).
- `utils/`: Utilities like email services and health calculators.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file based on `.env.example`:
   ```env
   MONGODB_URL=mongodb://localhost:27017/hwm
   JWT_SECRET=your_secret
   PORT=8000
   ```
3. Start the server:
   ```bash
   node index.js
   ```

## API Features

- **JWT Authentication**: Secure access to user data.
- **Google OAuth**: Integration for activity syncing.
- **Progress Tracking**: Aggregates daily and weekly health data.
- **Automated Calculations**: BMI, calorie targets, and macro distributions.
