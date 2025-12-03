// models/Workout.js
import mongoose from "mongoose";

const workoutSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  duration: Number, // minutes
  caloriesBurned: Number,
  date: { type: Date, default: Date.now },
  notes: String
}, { timestamps: true });

export default mongoose.model("Workout", workoutSchema);
