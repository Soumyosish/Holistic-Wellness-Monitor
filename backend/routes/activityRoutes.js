import express from "express";
import {
  getTodaySummary,
  getSummaryByDate,
  updateWaterIntake,
  updateSteps,
  updateSleep,
  updateWeight,
  getActivityHistory,
  getWeeklyStats,
} from "../controllers/activityController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get summaries
router.get("/today", getTodaySummary);
router.get("/weekly-stats", getWeeklyStats);
router.get("/history", getActivityHistory);
router.get("/:date", getSummaryByDate);

// Update activities
router.post("/water", updateWaterIntake);
router.post("/steps", updateSteps);
router.post("/sleep", updateSleep);
router.post("/weight", updateWeight);

export default router;
