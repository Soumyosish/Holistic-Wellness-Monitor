import express from "express";
import {
  updateProfile,
  getProfile,
  recalculateMetrics,
  updateGoals,
  updatePreferences,
} from "../controllers/userProfileController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get user profile
router.get("/", getProfile);

// Update complete profile
router.put("/", updateProfile);

// Recalculate health metrics
router.post("/recalculate", recalculateMetrics);

// Update goals
router.patch("/goals", updateGoals);

// Update preferences
router.patch("/preferences", updatePreferences);

export default router;
