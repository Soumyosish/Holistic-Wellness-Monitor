// controllers/workoutController.js
import Workout from "../models/Workout.js";

export const addWorkout = async (req, res) => {
  try {
    const { name, duration, caloriesBurned, date, notes } = req.body;
    const w = await Workout.create({
      user: req.user._id,
      name, duration, caloriesBurned, date: date || Date.now(), notes
    });
    res.status(201).json(w);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const getWorkouts = async (req, res) => {
  try {
    const { date } = req.query;
    const query = { user: req.user._id };
    if (date) query.date = { $gte: new Date(date), $lt: new Date(new Date(date).getTime() + 24*60*60*1000) };
    const items = await Workout.find(query).sort({ date: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const deleteWorkout = async (req, res) => {
  try {
    const w = await Workout.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!w) return res.status(404).json({ msg: "Workout not found" });
    res.json({ msg: "Deleted", w });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
