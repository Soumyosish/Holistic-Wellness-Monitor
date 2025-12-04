// controllers/mealController.js
import Meal from "../models/Meal.js";

export const addMeal = async (req, res) => {
  try {
    const { name, calories, protein, carbs, fats, type, date } = req.body;
    const meal = await Meal.create({
      user: req.user._id,
      name, calories, protein, carbs, fats, type,
      date: date || Date.now()
    });
    res.status(201).json(meal);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const getMeals = async (req, res) => {
  try {
    // optional: filter by date
    const { date } = req.query;
    const query = { user: req.user._id };
    if (date) query.date = { $gte: new Date(date), $lt: new Date(new Date(date).getTime() + 24*60*60*1000) };
    const meals = await Meal.find(query).sort({ date: -1 });
    res.json(meals);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const deleteMeal = async (req, res) => {
  try {
    const meal = await Meal.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!meal) return res.status(404).json({ msg: "Meal not found" });
    res.json({ msg: "Deleted", meal });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
