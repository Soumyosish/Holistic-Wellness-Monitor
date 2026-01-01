import mongoose from "mongoose";

const summarySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: String, required: true }, // store as YYYY-MM-DD for easy querying

    // Nutrition
    caloriesConsumed: { type: Number, default: 0 },
    caloriesBurned: { type: Number, default: 0 },
    proteinConsumed: { type: Number, default: 0 },
    carbsConsumed: { type: Number, default: 0 },
    fatsConsumed: { type: Number, default: 0 },

    // Hydration
    waterIntake: { type: Number, default: 0 }, // ml
    waterGoal: { type: Number, default: 2000 }, // ml

    // Activity
    steps: { type: Number, default: 0 },
    stepGoal: { type: Number, default: 10000 },
    activeMinutes: { type: Number, default: 0 },

    // Sleep
    sleepHours: { type: Number, default: 0 },
    sleepQuality: { type: Number, min: 1, max: 5 }, // 1-5 rating
    sleepStart: { type: Date },
    sleepEnd: { type: Date },

    // Weight tracking
    weight: { type: Number }, // kg

    // Calculated fields
    netCalories: { type: Number, default: 0 }, // consumed - burned
    calorieGoal: { type: Number, default: 2000 },
  },
  { timestamps: true }
);

// Create compound index for user + date
summarySchema.index({ user: 1, date: 1 }, { unique: true });

export default mongoose.model("DailySummary", summarySchema);
