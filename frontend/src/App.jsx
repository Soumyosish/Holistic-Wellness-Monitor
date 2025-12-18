import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/DashBoard";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ResetPassword from "./pages/auth/ResetPassword";
import ResetPasswordConfirm from "./pages/auth/ResetPasswordConfirm";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import GoogleCallback from "./pages/auth/GoogleCallback";
import UserProfile from "./pages/UserProfile";
import MealTracker from "./pages/MealTracker";
import WorkoutTracker from "./pages/WorkoutTracker";
import ProgressGraphs from "./pages/ProgressGraphs";

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/reset-password/:token"
            element={<ResetPasswordConfirm />}
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/meals"
            element={
              <ProtectedRoute>
                <MealTracker />
              </ProtectedRoute>
            }
          />
          <Route
            path="/workouts"
            element={
              <ProtectedRoute>
                <WorkoutTracker />
              </ProtectedRoute>
            }
          />
          <Route
            path="/progress"
            element={
              <ProtectedRoute>
                <ProgressGraphs />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
          <Route path="/auth/google/callback" element={<GoogleCallback />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
