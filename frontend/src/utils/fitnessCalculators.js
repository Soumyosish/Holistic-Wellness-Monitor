
// Constants
export const ACTIVITY_LEVELS = {
  sedentary: { label: "Sedentary", description: "Little or no exercise" },
  light: { label: "Lightly Active", description: "Exercise 1-3 times/week" },
  moderate: { label: "Moderately Active", description: "Exercise 4-5 times/week" },
  active: { label: "Very Active", description: "Daily exercise or intense exercise 3-4 times/week" },
  extreme: { label: "Extra Active", description: "Intense exercise daily or physical job" }
};

export const GOALS = {
  weight_loss: { label: "Weight Loss", description: "Lose fat comfortably", icon: "TrendingDown" },
  weight_loss_aggressive: { label: "Aggressive Cut", description: "Faster fat loss", icon: "ChevronsDown" },
  maintenance: { label: "Maintenance", description: "Maintain current weight", icon: "Minus" },
  muscle_building: { label: "Muscle Gain", description: "Build muscle mass", icon: "Dumbbell" },
  weight_gain: { label: "Weight Gain", description: "Increase overall size", icon: "TrendingUp" }
};

export const DIET_TYPES = {
  any: "Anything",
  veg: "Vegetarian",
  "non-veg": "Non-Vegetarian",
  vegan: "Vegan"
};

export const BUDGETS = {
  low: "Low Budget",
  medium: "Medium Budget",
  high: "High Budget"
};

// Calculations

export const calculateBMI = (weight, height) => {
  if (!weight || !height) return 0;
  // BMI = weight (kg) / height (m)^2
  const heightInMeters = height / 100;
  return parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(2));
};

export const getBMICategory = (bmi) => {
  if (bmi < 18.5) return { text: "Underweight", color: "text-blue-500" };
  if (bmi < 25) return { text: "Normal Weight", color: "text-green-600" };
  if (bmi < 30) return { text: "Overweight", color: "text-yellow-600" };
  return { text: "Obese", color: "text-red-600" };
};

export const calculateBMR = (weight, height, age, gender) => {
  // Mifflin-St Jeor Equation
  if (!weight || !height || !age) return 0;
  let bmr = (10 * weight) + (6.25 * height) - (5 * age);
  return gender === "female" ? Math.round(bmr - 161) : Math.round(bmr + 5);
};

export const calculateTDEE = (bmr, activityLevel) => {
  const multipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    extreme: 1.9
  };
  return Math.round(bmr * (multipliers[activityLevel] || 1.2));
};

export const calculateIdealWeight = (height, gender) => {
  // Devine Formula
  if (!height) return 0;
  const heightInInches = height / 2.54;
  const base = gender === "female" ? 45.5 : 50;
  const perInch = 2.3;
  if (heightInInches <= 60) return base;
  return parseFloat((base + (perInch * (heightInInches - 60))).toFixed(1));
};

export const calculateDailyCalorieTarget = (tdee, goal) => {
  const adjustments = {
    weight_loss: -500,
    weight_loss_aggressive: -1000,
    maintenance: 0,
    weight_gain: 500,
    muscle_building: 300
  };
  return Math.max(1200, Math.round(tdee + (adjustments[goal] || 0)));
};

export const calculateMacroTargets = (calories, goal) => {
  let ratios = { protein: 0.3, fats: 0.3, carbs: 0.4 }; // Default maintenance
  
  if (goal === "weight_loss" || goal === "weight_loss_aggressive") {
    ratios = { protein: 0.4, fats: 0.3, carbs: 0.3 };
  } else if (goal === "muscle_building" || goal === "weight_gain") {
    ratios = { protein: 0.3, fats: 0.25, carbs: 0.45 };
  }
  
  return {
    protein: Math.round((calories * ratios.protein) / 4),
    fats: Math.round((calories * ratios.fats) / 9),
    carbs: Math.round((calories * ratios.carbs) / 4)
  };
};

export const calculateWaterGoal = (weight, activityLevel) => {
  // Base: 35ml per kg
  let base = weight * 35;
  if (activityLevel === "active" || activityLevel === "extreme") base += 500;
  return Math.round(base);
};

export const calculateStepGoal = (activityLevel) => {
  const goals = {
    sedentary: 5000,
    light: 7500,
    moderate: 10000,
    active: 12500,
    extreme: 15000
  };
  return goals[activityLevel] || 10000;
};
