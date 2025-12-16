// controllers/mealController.js
import Meal from "../models/Meal.js";
import DailySummary from "../models/DailySummary.js";

export const addMeal = async (req, res) => {
  try {
    const { 
      name, calories, protein, carbs, fats, fiber, sugar, sodium,
      servingSize, servingQuantity, type, date, foodId, imageUrl 
    } = req.body;
    
    const meal = await Meal.create({
      user: req.user._id,
      name, 
      calories, 
      protein: protein || 0, 
      carbs: carbs || 0, 
      fats: fats || 0,
      fiber: fiber || 0,
      sugar: sugar || 0,
      sodium: sodium || 0,
      servingSize,
      servingQuantity: servingQuantity || 1,
      type,
      foodId,
      imageUrl,
      date: date || Date.now()
    });

    // Update daily summary
    const dateStr = new Date(meal.date).toISOString().split('T')[0];
    await DailySummary.findOneAndUpdate(
      { user: req.user._id, date: dateStr },
      { $inc: { caloriesConsumed: calories } },
      { upsert: true }
    );

    res.status(201).json(meal);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const getMeals = async (req, res) => {
  try {
    const { date, startDate, endDate, type } = req.query;
    const query = { user: req.user._id };
    
    // Filter by specific date
    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      query.date = { $gte: start, $lte: end };
    }
    
    // Filter by date range
    if (startDate && endDate) {
      query.date = { 
        $gte: new Date(startDate), 
        $lte: new Date(endDate) 
      };
    }
    
    // Filter by meal type
    if (type) {
      query.type = type;
    }
    
    const meals = await Meal.find(query).sort({ date: -1 });
    
    // Calculate totals
    const totals = meals.reduce((acc, meal) => ({
      calories: acc.calories + (meal.calories || 0),
      protein: acc.protein + (meal.protein || 0),
      carbs: acc.carbs + (meal.carbs || 0),
      fats: acc.fats + (meal.fats || 0),
      fiber: acc.fiber + (meal.fiber || 0),
      sugar: acc.sugar + (meal.sugar || 0),
      sodium: acc.sodium + (meal.sodium || 0)
    }), { calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0, sugar: 0, sodium: 0 });
    
    res.json({ meals, totals });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const updateMeal = async (req, res) => {
  try {
    const { 
      name, calories, protein, carbs, fats, fiber, sugar, sodium,
      servingSize, servingQuantity, type, imageUrl 
    } = req.body;
    
    const oldMeal = await Meal.findOne({ _id: req.params.id, user: req.user._id });
    if (!oldMeal) return res.status(404).json({ msg: "Meal not found" });
    
    const meal = await Meal.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      {
        name, 
        calories, 
        protein, 
        carbs, 
        fats,
        fiber,
        sugar,
        sodium,
        servingSize,
        servingQuantity,
        type,
        imageUrl
      },
      { new: true }
    );
    
    // Update daily summary
    const dateStr = new Date(meal.date).toISOString().split('T')[0];
    const calorieDiff = calories - oldMeal.calories;
    await DailySummary.findOneAndUpdate(
      { user: req.user._id, date: dateStr },
      { $inc: { caloriesConsumed: calorieDiff } },
      { upsert: true }
    );
    
    res.json(meal);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const deleteMeal = async (req, res) => {
  try {
    const meal = await Meal.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!meal) return res.status(404).json({ msg: "Meal not found" });
    
    // Update daily summary
    const dateStr = new Date(meal.date).toISOString().split('T')[0];
    await DailySummary.findOneAndUpdate(
      { user: req.user._id, date: dateStr },
      { $inc: { caloriesConsumed: -meal.calories } },
      { upsert: true }
    );
    
    res.json({ msg: "Deleted", meal });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const getMealStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = { user: req.user._id };
    
    if (startDate && endDate) {
      query.date = { 
        $gte: new Date(startDate), 
        $lte: new Date(endDate) 
      };
    }
    
    const meals = await Meal.find(query);
    
    // Group by type
    const byType = meals.reduce((acc, meal) => {
      if (!acc[meal.type]) {
        acc[meal.type] = { count: 0, calories: 0, protein: 0, carbs: 0, fats: 0 };
      }
      acc[meal.type].count++;
      acc[meal.type].calories += meal.calories || 0;
      acc[meal.type].protein += meal.protein || 0;
      acc[meal.type].carbs += meal.carbs || 0;
      acc[meal.type].fats += meal.fats || 0;
      return acc;
    }, {});
    
    // Group by date
    const byDate = meals.reduce((acc, meal) => {
      const dateStr = new Date(meal.date).toISOString().split('T')[0];
      if (!acc[dateStr]) {
        acc[dateStr] = { count: 0, calories: 0, protein: 0, carbs: 0, fats: 0 };
      }
      acc[dateStr].count++;
      acc[dateStr].calories += meal.calories || 0;
      acc[dateStr].protein += meal.protein || 0;
      acc[dateStr].carbs += meal.carbs || 0;
      acc[dateStr].fats += meal.fats || 0;
      return acc;
    }, {});
    
    res.json({ byType, byDate });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

