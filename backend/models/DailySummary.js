// models/DailySummary.js
import mongoose from "mongoose";

const summarySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: String, required: true }, // store as YYYY-MM-DD for easy querying
  caloriesConsumed: { type: Number, default: 0 },
  caloriesBurned: { type: Number, default: 0 },
  waterIntake: { type: Number, default: 0 }, // ml
  steps: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model("DailySummary", summarySchema);
