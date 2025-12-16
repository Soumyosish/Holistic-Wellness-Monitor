import User from "../models/User.js";
import DailySummary from "../models/DailySummary.js";
import Meal from "../models/Meal.js";

/**
 * Generate a health report based on recent data
 */
export const generateHealthReport = async (req, res) => {
  try {
    const userId = req.user._id;
    const { date } = req.query;
    const targetDate = date || new Date().toISOString().split('T')[0];

    // Fetch user profile and today's data
    const user = await User.findById(userId);
    const summary = await DailySummary.findOne({ user: userId, date: targetDate });
    const meals = await Meal.find({ 
      user: userId, 
      date: { 
        $gte: new Date(targetDate), 
        $lt: new Date(new Date(targetDate).getTime() + 24 * 60 * 60 * 1000) 
      } 
    });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // --- Generate Insights (Rule-Based Logic acting as AI) ---
    const insights = [];
    let score = 100;
    const penalties = [];

    // 1. Calories Check
    const calorieGoal = user.dailyCalorieTarget || 2000;
    const caloriesConsumed = summary?.caloriesConsumed || 0;
    const calorieDiff = caloriesConsumed - calorieGoal;

    if (Math.abs(calorieDiff) <= 200) {
      insights.push({
        type: "success",
        title: "Calorie Goal Hit",
        message: "Great job! You are within your daily calorie target range."
      });
    } else if (calorieDiff > 200) {
      insights.push({
        type: "warning",
        title: "Calorie Surplus",
        message: `You've exceeded your goal by ${Math.round(calorieDiff)} calories. Consider a lighter dinner or a walk.`
      });
      score -= 10;
      penalties.push("Calorie surplus");
    } else {
      insights.push({
        type: "warning",
        title: "Calorie Deficit",
        message: `You're under your goal by ${Math.round(Math.abs(calorieDiff))} calories. Make sure to fuel your body!`
      });
      score -= 5; // Smaller penalty for deficit
      penalties.push("Calorie deficit");
    }

    // 2. Macros Check
    const proteinGoal = user.dailyProteinTarget || 150;
    const proteinConsumed = summary?.proteinConsumed || 0;
    
    if (proteinConsumed >= proteinGoal) {
      insights.push({
        type: "success",
        title: "Protein Power",
        message: "You hit your protein target! Muscle recovery is optimized."
      });
    } else if (proteinConsumed < proteinGoal * 0.7) {
      insights.push({
        type: "error",
        title: "Low Protein",
        message: "Protein intake is low. Try adding chicken, eggs, or lentils to your next meal."
      });
      score -= 10;
      penalties.push("Low protein");
    }

    // 3. Hydration Check
    const waterGoal = user.dailyWaterGoal || 2000;
    const waterIntake = summary?.waterIntake || 0;

    if (waterIntake >= waterGoal) {
      insights.push({
        type: "success",
        title: "Hydration Hero",
        message: "Excellent hydration today!"
      });
    } else if (waterIntake < waterGoal / 2) {
      insights.push({
        type: "error",
        title: "Dehydrated",
        message: "You're significantly behind on water. Drink a glass now!"
      });
      score -= 15;
      penalties.push("Severe dehydration");
    } else {
      insights.push({
        type: "warning",
        title: "Drink More Water",
        message: `You need ${Math.round((waterGoal - waterIntake) / 250)} more glasses to hit your goal.`
      });
      score -= 5;
      penalties.push("Slight dehydration");
    }

    // 4. Activity Check
    const stepGoal = user.dailyStepGoal || 10000;
    const steps = summary?.steps || 0;

    if (steps >= stepGoal) {
      insights.push({
        type: "success",
        title: "On the Move",
        message: "Step goal crushed! Your heart thanks you."
      });
    } else if (steps < stepGoal * 0.5) {
      insights.push({
        type: "warning",
        title: "Sedentary Day",
        message: "Movement has been low today. Try to take a 10-minute walk."
      });
      score -= 10;
      penalties.push("Low activity");
    }

    // 5. Sleep Check
    const sleepHours = summary?.sleepHours || 0;
    if (sleepHours > 0) {
      if (sleepHours < 7) {
        insights.push({
          type: "warning",
          title: "Sleep Deprivated",
          message: "You didn't get enough sleep. Focus on recovery today."
        });
        score -= 10;
        penalties.push("Poor sleep");
      } else {
        insights.push({
          type: "success",
          title: "Well Rested",
          message: "Good sleep duration recorded."
        });
      }
    }

    // Ensure score doesn't go below 0
    score = Math.max(0, score);

    // Determine overall status
    let status = "Excellent";
    let color = "green";
    if (score < 50) { status = "Needs Improvement"; color = "red"; }
    else if (score < 80) { status = "Good"; color = "yellow"; }

    const report = {
      date: targetDate,
      overallScore: score,
      status,
      statusColor: color,
      insights,
      summary: {
        calories: { consumed: caloriesConsumed, goal: calorieGoal },
        protein: { consumed: proteinConsumed, goal: proteinGoal },
        water: { consumed: waterIntake, goal: waterGoal },
        steps: { count: steps, goal: stepGoal },
        sleep: { hours: sleepHours }
      },
      penalties // For debugging or detailed view
    };

    res.json(report);

  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({ msg: "Failed to generate report" });
  }
};
