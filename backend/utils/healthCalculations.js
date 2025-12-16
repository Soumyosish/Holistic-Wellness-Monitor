/**
 * Calculate Body Mass Index (BMI)
 * @param {number} weight - Weight in kg
 * @param {number} height - Height in cm
 * @returns {number} BMI value
 */
export const calculateBMI = (weight, height) => {
  if (!weight || !height || weight <= 0 || height <= 0) return 0;
  const heightInMeters = height / 100;
  return parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(2));
};

/**
 * Get BMI category
 * @param {number} bmi - BMI value
 * @returns {string} BMI category
 */
export const getBMICategory = (bmi) => {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal weight";
  if (bmi < 30) return "Overweight";
  return "Obese";
};

/**
 * Calculate Basal Metabolic Rate (BMR) using Mifflin-St Jeor Equation
 * @param {number} weight - Weight in kg
 * @param {number} height - Height in cm
 * @param {number} age - Age in years
 * @param {string} gender - 'male' or 'female'
 * @returns {number} BMR in calories/day
 */
export const calculateBMR = (weight, height, age, gender) => {
  if (!weight || !height || !age || !gender) return 0;

  const baseBMR = 10 * weight + 6.25 * height - 5 * age;
  const bmr = gender.toLowerCase() === "male" ? baseBMR + 5 : baseBMR - 161;

  return Math.round(bmr);
};

export const ACTIVITY_LEVELS = {
  sedentary: { value: 1.2, label: "Sedentary (little or no exercise)" },
  light: { value: 1.375, label: "Lightly active (exercise 1-3 days/week)" },
  moderate: {
    value: 1.55,
    label: "Moderately active (exercise 3-5 days/week)",
  },
  active: { value: 1.725, label: "Very active (exercise 6-7 days/week)" },
  extreme: {
    value: 1.9,
    label: "Extremely active (physical job or training twice/day)",
  },
};

/**
 * Calculate Total Daily Energy Expenditure (TDEE)
 * @param {number} bmr - Basal Metabolic Rate
 * @param {string} activityLevel - Activity level key
 * @returns {number} TDEE in calories/day
 */
export const calculateTDEE = (bmr, activityLevel) => {
  if (!bmr || !activityLevel) return 0;
  const multiplier = ACTIVITY_LEVELS[activityLevel]?.value || 1.2;
  return Math.round(bmr * multiplier);
};

/**
 * Calculate Ideal Weight using Devine Formula
 * @param {number} height - Height in cm
 * @param {string} gender - 'male' or 'female'
 * @returns {number} Ideal weight in kg
 */
export const calculateIdealWeight = (height, gender) => {
  if (!height || !gender || height <= 0) return 0;

  const heightInInches = height / 2.54;
  const baseHeight = 60; // 5 feet in inches

  if (heightInInches <= baseHeight) {
    return gender.toLowerCase() === "male" ? 50 : 45.5;
  }

  const baseWeight = gender.toLowerCase() === "male" ? 50 : 45.5;
  const additionalWeight = 2.3 * (heightInInches - baseHeight);

  return parseFloat((baseWeight + additionalWeight).toFixed(1));
};

export const GOAL_TYPES = {
  weight_loss: {
    value: -500,
    label: "Weight Loss",
    description: "Lose 0.5 kg per week",
  },
  weight_loss_aggressive: {
    value: -750,
    label: "Aggressive Weight Loss",
    description: "Lose 0.75 kg per week",
  },
  maintenance: {
    value: 0,
    label: "Maintain Weight",
    description: "Maintain current weight",
  },
  weight_gain: {
    value: 300,
    label: "Weight Gain",
    description: "Gain 0.25 kg per week",
  },
  muscle_building: {
    value: 500,
    label: "Muscle Building",
    description: "Gain 0.5 kg per week with strength training",
  },
};

/**
 * Calculate daily calorie target based on TDEE and goal
 * @param {number} tdee - Total Daily Energy Expenditure
 * @param {string} goal - Goal type key
 * @returns {number} Daily calorie target
 */
export const calculateDailyCalorieTarget = (tdee, goal) => {
  if (!tdee || !goal) return 0;
  const adjustment = GOAL_TYPES[goal]?.value || 0;
  const target = tdee + adjustment;

  // Ensure minimum calorie intake (1200 for women, 1500 for men as general guideline)
  return Math.max(target, 1200);
};

/**
 * Calculate recommended macro distribution
 * @param {number} dailyCalories - Daily calorie target
 * @param {string} goal - Goal type
 * @returns {object} Macro targets in grams
 */
export const calculateMacroTargets = (dailyCalories, goal) => {
  if (!dailyCalories) return { protein: 0, carbs: 0, fats: 0 };

  let proteinPercent, carbsPercent, fatsPercent;

  // Adjust macro ratios based on goal
  if (goal === "muscle_building") {
    // Higher protein for muscle building
    proteinPercent = 0.3;
    carbsPercent = 0.45;
    fatsPercent = 0.25;
  } else if (goal === "weight_loss" || goal === "weight_loss_aggressive") {
    // Higher protein to preserve muscle during weight loss
    proteinPercent = 0.35;
    carbsPercent = 0.35;
    fatsPercent = 0.3;
  } else {
    // Balanced for maintenance
    proteinPercent = 0.25;
    carbsPercent = 0.45;
    fatsPercent = 0.3;
  }

  // Calculate grams (protein: 4 cal/g, carbs: 4 cal/g, fats: 9 cal/g)
  const protein = Math.round((dailyCalories * proteinPercent) / 4);
  const carbs = Math.round((dailyCalories * carbsPercent) / 4);
  const fats = Math.round((dailyCalories * fatsPercent) / 9);

  return { protein, carbs, fats };
};

/**
 * Calculate water intake goal based on weight and activity level
 * @param {number} weight - Weight in kg
 * @param {string} activityLevel - Activity level key
 * @returns {number} Daily water goal in ml
 */
export const calculateWaterGoal = (weight, activityLevel) => {
  if (!weight) return 2000; // Default 2L

  // Base: 30-35ml per kg of body weight
  let baseWater = weight * 33;

  // Add extra for activity level
  const activityBonus = {
    sedentary: 0,
    light: 250,
    moderate: 500,
    active: 750,
    extreme: 1000,
  };

  const bonus = activityBonus[activityLevel] || 0;
  return Math.round(baseWater + bonus);
};

/**
 * Calculate recommended step goal based on activity level
 * @param {string} activityLevel - Activity level key
 * @returns {number} Daily step goal
 */
export const calculateStepGoal = (activityLevel) => {
  const stepGoals = {
    sedentary: 5000,
    light: 7500,
    moderate: 10000,
    active: 12500,
    extreme: 15000,
  };

  return stepGoals[activityLevel] || 10000;
};
