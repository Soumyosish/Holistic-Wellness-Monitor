import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, unique: true },
    password: { type: String },
    googleId: { type: String, unique: true, sparse: true },
    picture: { type: String },
    age: Number,
    height: Number, // in cm
    weight: Number, // in kg
    gender: { type: String, enum: ["male", "female", "other"] },
    provider: { type: String, enum: ["local", "google"], default: "local" },
    refreshToken: { type: String },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    
    // Activity and Goals
    activityLevel: { 
      type: String, 
      enum: ["sedentary", "light", "moderate", "active", "extreme"],
      default: "moderate"
    },
    goal: { 
      type: String, 
      enum: ["weight_loss", "weight_loss_aggressive", "maintenance", "weight_gain", "muscle_building"],
      default: "maintenance"
    },
    targetWeight: Number, // in kg
    
    // Calculated Health Metrics
    bmi: Number,
    bmr: Number, // Basal Metabolic Rate
    tdee: Number, // Total Daily Energy Expenditure
    idealWeight: Number, // in kg
    
    // Daily Targets
    dailyCalorieTarget: Number,
    dailyProteinTarget: Number, // in grams
    dailyCarbsTarget: Number, // in grams
    dailyFatsTarget: Number, // in grams
    dailyWaterGoal: Number, // in ml
    dailyStepGoal: Number,
    
    // Preferences
    preferences: {
      dietType: { type: String, enum: ["veg", "non-veg", "vegan", "any"], default: "any" },
      budget: { type: String, enum: ["low", "medium", "high"], default: "medium" },
      allergies: [String],
      dislikedFoods: [String]
    },
    
    // Profile completion status
    profileCompleted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
