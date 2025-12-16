import mongoose from "mongoose";

const workoutSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true }, // e.g., "Morning Cardio", "Leg Day"
  type: { 
    type: String, 
    enum: ["strength", "cardio", "flexibility", "hiit", "sport", "other"],
    default: "other"
  },
  duration: { type: Number, required: true }, // minutes
  caloriesBurned: { type: Number }, // calculated or manual
  date: { type: Date, default: Date.now },
  intensity: { type: String, enum: ["low", "medium", "high"], default: "medium" },
  
  exercises: [{
    exercise: { type: mongoose.Schema.Types.ObjectId, ref: "Exercise" },
    name: String, // fallback if not from DB
    sets: [{
      reps: Number,
      weight: Number, // kg
      duration: Number, // seconds (for static holds or cardio)
      distance: Number // km (for cardio)
    }]
  }],
  
  notes: String
}, { timestamps: true });

export default mongoose.model("Workout", workoutSchema);
