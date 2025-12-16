import express from "express";
import {
  getWorkouts,
  addWorkout,
  deleteWorkout,
  getExercises,
  addExercise,
  seedExercises // Keep public or protect? Protect is better.
} from "../controllers/workoutController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Exercises (Public or Protected)
router.get("/exercises", protect, getExercises);
router.post("/exercises", protect, addExercise);
router.post("/exercises/seed", seedExercises); // Call once to init

// Workouts
router.use(protect);
router.get("/", getWorkouts);
router.post("/", addWorkout);
router.delete("/:id", deleteWorkout);

export default router;
