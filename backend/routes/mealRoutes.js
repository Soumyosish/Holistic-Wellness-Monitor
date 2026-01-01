import express from "express";
import {
  addMeal,
  getMeals,
  updateMeal,
  deleteMeal,
  getMealStats,
} from "../controllers/mealController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.post("/", addMeal);
router.get("/", getMeals);
router.get("/stats", getMealStats);
router.put("/:id", updateMeal);
router.delete("/:id", deleteMeal);

export default router;
