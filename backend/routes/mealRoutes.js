// routes/mealRoutes.js
import express from "express";
import { addMeal, getMeals, deleteMeal } from "../controllers/mealController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.post("/", addMeal);
router.get("/", getMeals);
router.delete("/:id", deleteMeal);

export default router;
