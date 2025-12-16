import User from "../models/User.js";
import {
  calculateBMI,
  calculateBMR,
  calculateTDEE,
  calculateIdealWeight,
  calculateDailyCalorieTarget,
  calculateMacroTargets,
  calculateWaterGoal,
  calculateStepGoal,
} from "../utils/healthCalculations.js";

/**
 * Update user profile with health metrics and calculate all derived values
 */
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { age, height, weight, gender, activityLevel, goal, targetWeight, preferences } = req.body;

    // Validate required fields
    if (!age || !height || !weight || !gender) {
      return res.status(400).json({ 
        message: "Age, height, weight, and gender are required" 
      });
    }

    // Calculate health metrics
    const bmi = calculateBMI(weight, height);
    const bmr = calculateBMR(weight, height, age, gender);
    const tdee = calculateTDEE(bmr, activityLevel || "moderate");
    const idealWeight = calculateIdealWeight(height, gender);
    const dailyCalorieTarget = calculateDailyCalorieTarget(tdee, goal || "maintenance");
    const macroTargets = calculateMacroTargets(dailyCalorieTarget, goal || "maintenance");
    const dailyWaterGoal = calculateWaterGoal(weight, activityLevel || "moderate");
    const dailyStepGoal = calculateStepGoal(activityLevel || "moderate");

    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        age,
        height,
        weight,
        gender,
        activityLevel: activityLevel || "moderate",
        goal: goal || "maintenance",
        targetWeight: targetWeight || idealWeight,
        bmi,
        bmr,
        tdee,
        idealWeight,
        dailyCalorieTarget,
        dailyProteinTarget: macroTargets.protein,
        dailyCarbsTarget: macroTargets.carbs,
        dailyFatsTarget: macroTargets.fats,
        dailyWaterGoal,
        dailyStepGoal,
        preferences: preferences || {},
        profileCompleted: true,
      },
      { new: true, runValidators: true }
    ).select("-password -refreshToken -resetPasswordToken");

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Failed to update profile", error: error.message });
  }
};

/**
 * Get user profile with all calculated metrics
 */
export const getProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).select(
      "-password -refreshToken -resetPasswordToken"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Failed to fetch profile", error: error.message });
  }
};

/**
 * Recalculate all health metrics based on current profile data
 */
export const recalculateMetrics = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user has required data
    if (!user.age || !user.height || !user.weight || !user.gender) {
      return res.status(400).json({ 
        message: "Complete your profile first to calculate metrics" 
      });
    }

    // Recalculate all metrics
    const bmi = calculateBMI(user.weight, user.height);
    const bmr = calculateBMR(user.weight, user.height, user.age, user.gender);
    const tdee = calculateTDEE(bmr, user.activityLevel);
    const idealWeight = calculateIdealWeight(user.height, user.gender);
    const dailyCalorieTarget = calculateDailyCalorieTarget(tdee, user.goal);
    const macroTargets = calculateMacroTargets(dailyCalorieTarget, user.goal);
    const dailyWaterGoal = calculateWaterGoal(user.weight, user.activityLevel);
    const dailyStepGoal = calculateStepGoal(user.activityLevel);

    // Update user
    user.bmi = bmi;
    user.bmr = bmr;
    user.tdee = tdee;
    user.idealWeight = idealWeight;
    user.dailyCalorieTarget = dailyCalorieTarget;
    user.dailyProteinTarget = macroTargets.protein;
    user.dailyCarbsTarget = macroTargets.carbs;
    user.dailyFatsTarget = macroTargets.fats;
    user.dailyWaterGoal = dailyWaterGoal;
    user.dailyStepGoal = dailyStepGoal;

    await user.save();

    const updatedUser = await User.findById(userId).select(
      "-password -refreshToken -resetPasswordToken"
    );

    res.status(200).json({
      message: "Metrics recalculated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error recalculating metrics:", error);
    res.status(500).json({ 
      message: "Failed to recalculate metrics", 
      error: error.message 
    });
  }
};

/**
 * Update user goals and recalculate targets
 */
export const updateGoals = async (req, res) => {
  try {
    const userId = req.user._id;
    const { goal, targetWeight, activityLevel } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update goals
    if (goal) user.goal = goal;
    if (targetWeight) user.targetWeight = targetWeight;
    if (activityLevel) user.activityLevel = activityLevel;

    // Recalculate targets if we have the necessary data
    if (user.bmr && user.activityLevel) {
      const tdee = calculateTDEE(user.bmr, user.activityLevel);
      const dailyCalorieTarget = calculateDailyCalorieTarget(tdee, user.goal);
      const macroTargets = calculateMacroTargets(dailyCalorieTarget, user.goal);
      const dailyWaterGoal = calculateWaterGoal(user.weight, user.activityLevel);
      const dailyStepGoal = calculateStepGoal(user.activityLevel);

      user.tdee = tdee;
      user.dailyCalorieTarget = dailyCalorieTarget;
      user.dailyProteinTarget = macroTargets.protein;
      user.dailyCarbsTarget = macroTargets.carbs;
      user.dailyFatsTarget = macroTargets.fats;
      user.dailyWaterGoal = dailyWaterGoal;
      user.dailyStepGoal = dailyStepGoal;
    }

    await user.save();

    const updatedUser = await User.findById(userId).select(
      "-password -refreshToken -resetPasswordToken"
    );

    res.status(200).json({
      message: "Goals updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating goals:", error);
    res.status(500).json({ message: "Failed to update goals", error: error.message });
  }
};

/**
 * Update user preferences
 */
export const updatePreferences = async (req, res) => {
  try {
    const userId = req.user._id;
    const { dietType, budget, allergies, dislikedFoods } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update preferences
    if (!user.preferences) user.preferences = {};
    
    if (dietType) user.preferences.dietType = dietType;
    if (budget) user.preferences.budget = budget;
    if (allergies) user.preferences.allergies = allergies;
    if (dislikedFoods) user.preferences.dislikedFoods = dislikedFoods;

    await user.save();

    const updatedUser = await User.findById(userId).select(
      "-password -refreshToken -resetPasswordToken"
    );

    res.status(200).json({
      message: "Preferences updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating preferences:", error);
    res.status(500).json({ 
      message: "Failed to update preferences", 
      error: error.message 
    });
  }
};
