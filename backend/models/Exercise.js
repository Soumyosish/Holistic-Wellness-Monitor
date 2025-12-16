import mongoose from "mongoose";

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  muscleGroup: {
    type: String,
    enum: [
      "chest",
      "back",
      "legs",
      "shoulders",
      "arms",
      "core",
      "cardio",
      "full_body",
    ],
    required: true,
  },
  type: {
    type: String,
    enum: ["strength", "cardio", "flexibility", "hiit"],
    default: "strength",
  },
  equipment: { type: String, default: "none" },
  difficulty: {
    type: String,
    enum: ["beginner", "intermediate", "advanced"],
    default: "beginner",
  },
  caloriesPerMinute: { type: Number, default: 5 }, // estimated
  instructions: [String],
  imageUrl: String,
  youtubeUrl: String,
});

export default mongoose.model("Exercise", exerciseSchema);
