// controllers/summaryController.js
import DailySummary from "../models/DailySummary.js";
import Meal from "../models/Meal.js";
import Workout from "../models/Workout.js";

export const getSummaryByDate = async (req, res) => {
  try {
    const { date } = req.query; // expect YYYY-MM-DD
    if (!date) return res.status(400).json({ msg: "date query required" });

    const summary = await DailySummary.findOne({ user: req.user._id, date });
    if (summary) return res.json(summary);

    // if not exist create from meals/workouts
    const start = new Date(date);
    const end = new Date(start.getTime() + 24*60*60*1000);

    const meals = await Meal.find({ user: req.user._id, date: { $gte: start, $lt: end }});
    const workouts = await Workout.find({ user: req.user._1d, date: { $gte: start, $lt: end }});

    const caloriesConsumed = meals.reduce((s,m)=> s + (m.calories || 0), 0);
    const caloriesBurned = workouts.reduce((s,w)=> s + (w.caloriesBurned || 0), 0);

    const newSummary = await DailySummary.create({
      user: req.user._id,
      date,
      caloriesConsumed,
      caloriesBurned,
      waterIntake: 0,
      steps: 0
    });

    res.json(newSummary);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const updateSummary = async (req, res) => {
  try {
    const { date, waterIntake, steps } = req.body;
    if (!date) return res.status(400).json({ msg: "date required" });

    const updated = await DailySummary.findOneAndUpdate(
      { user: req.user._id, date },
      { $set: { waterIntake, steps } },
      { upsert: true, new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
