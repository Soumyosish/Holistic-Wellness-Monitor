// routes/workoutRoutes.js
import express from "express";
import { addWorkout, getWorkouts, deleteWorkout } from "../controllers/workoutController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.post("/", addWorkout);
router.get("/", getWorkouts);
router.delete("/:id", deleteWorkout);

export default router;
