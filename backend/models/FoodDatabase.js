import mongoose from "mongoose";

const foodDatabaseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: true },
    brand: { type: String },
    category: {
      type: String,
      enum: [
        "fruits",
        "vegetables",
        "grains",
        "protein",
        "dairy",
        "nuts_seeds",
        "beverages",
        "snacks",
        "fast_food",
        "other",
      ],
      default: "other",
    },

    // Nutritional Information (per 100g or per serving)
    servingSize: { type: String, default: "100g" },
    calories: { type: Number, required: true },
    protein: { type: Number, default: 0 }, // grams
    carbs: { type: Number, default: 0 }, // grams
    fats: { type: Number, default: 0 }, // grams
    fiber: { type: Number, default: 0 }, // grams
    sugar: { type: Number, default: 0 }, // grams
    sodium: { type: Number, default: 0 }, // mg

    // Additional nutrients
    cholesterol: { type: Number, default: 0 }, // mg
    saturatedFat: { type: Number, default: 0 }, // grams
    transFat: { type: Number, default: 0 }, // grams
    vitaminA: { type: Number, default: 0 }, // IU
    vitaminC: { type: Number, default: 0 }, // mg
    calcium: { type: Number, default: 0 }, // mg
    iron: { type: Number, default: 0 }, // mg

    // Dietary flags
    isVeg: { type: Boolean, default: true },
    isVegan: { type: Boolean, default: false },
    isGlutenFree: { type: Boolean, default: false },
    isDairyFree: { type: Boolean, default: false },

    // Metadata
    imageUrl: { type: String },
    description: { type: String },
    commonServings: [
      {
        name: String, // e.g., "1 cup", "1 medium apple"
        grams: Number,
      },
    ],

    // Source tracking
    source: {
      type: String,
      enum: ["manual", "usda", "nutritionix", "edamam"],
      default: "manual",
    },
    externalId: { type: String }, // ID from external API

    // Search optimization
    searchTerms: [String], // Alternative names, common misspellings

    // Usage tracking
    popularityScore: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Indexes for faster searching
foodDatabaseSchema.index({ name: "text", searchTerms: "text" });
foodDatabaseSchema.index({ category: 1 });
foodDatabaseSchema.index({ isVeg: 1 });

export default mongoose.model("FoodDatabase", foodDatabaseSchema);
