import express from "express";
import {
  getWorkouts,
  addWorkout,
  deleteWorkout,
  getExercises,
  addExercise,
  seedExercises,
} from "../controllers/workoutController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Exercises (Public or Protected)
router.get("/exercises", protect, getExercises);
router.post("/exercises", protect, addExercise);
router.post("/exercises/seed", seedExercises);
// Workouts
router.use(protect);
router.get("/", getWorkouts);
router.post("/", addWorkout);
router.delete("/:id", deleteWorkout);

export default router;
