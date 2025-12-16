import express from "express";
import {
  searchFood,
  getFoodById,
  addFood,
  getPopularFoods,
  getFoodsByCategory,
  seedFoodDatabase,
} from "../controllers/foodDatabaseController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/search", searchFood);
router.get("/popular", getPopularFoods);
router.get("/category/:category", getFoodsByCategory);
router.get("/:id", getFoodById);

// Protected routes
router.post("/", protect, addFood);
router.post("/seed", seedFoodDatabase); // Can be called once to populate database

export default router;
