import mongoose from "mongoose";

const mealSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    calories: { type: Number, required: true },
    protein: { type: Number, default: 0 }, // in grams
    carbs: { type: Number, default: 0 }, // in grams
    fats: { type: Number, default: 0 }, // in grams
    fiber: { type: Number, default: 0 }, // in grams
    sugar: { type: Number, default: 0 }, // in grams
    sodium: { type: Number, default: 0 }, // in mg
    servingSize: { type: String }, // e.g., "1 cup", "100g"
    servingQuantity: { type: Number, default: 1 },
    type: {
      type: String,
      enum: ["breakfast", "lunch", "dinner", "snack"],
      default: "snack",
    },
    foodId: { type: String }, // Reference to food database or external API
    date: { type: Date, default: Date.now },
    imageUrl: { type: String }, // Optional meal image
  },
  { timestamps: true }
);

export default mongoose.model("Meal", mealSchema);
