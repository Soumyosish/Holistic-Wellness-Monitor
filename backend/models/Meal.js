// models/Meal.js
import mongoose from "mongoose";

const mealSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  calories: { type: Number, required: true },
  protein: Number,
  carbs: Number,
  fats: Number,
  type: { type: String, enum: ["breakfast","lunch","dinner","snack"], default: "snack" },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model("Meal", mealSchema);
