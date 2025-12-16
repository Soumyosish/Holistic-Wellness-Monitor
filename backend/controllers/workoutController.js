import Workout from "../models/Workout.js";
import Exercise from "../models/Exercise.js";
import DailySummary from "../models/DailySummary.js";



export const getExercises = async (req, res) => {
  try {
    const { muscleGroup, type, query } = req.query;
    const filter = {};
    
    if (muscleGroup) filter.muscleGroup = muscleGroup;
    if (type) filter.type = type;
    if (query) filter.name = { $regex: query, $options: "i" };

    const exercises = await Exercise.find(filter).sort("name");
    res.json(exercises);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const addExercise = async (req, res) => {
  try {
    const exercise = await Exercise.create(req.body);
    res.status(201).json(exercise);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const seedExercises = async (req, res) => {
  try {
    const count = await Exercise.countDocuments();
    if (count > 0) return res.json({ msg: "Exercises already seeded" });

    const exercises = [
      { name: "Push Up", muscleGroup: "chest", type: "strength", difficulty: "beginner", caloriesPerMinute: 8 },
      { name: "Squat", muscleGroup: "legs", type: "strength", difficulty: "beginner", caloriesPerMinute: 8 },
      { name: "Pull Up", muscleGroup: "back", type: "strength", difficulty: "intermediate", caloriesPerMinute: 10 },
      { name: "Plank", muscleGroup: "core", type: "strength", difficulty: "beginner", caloriesPerMinute: 4 },
      { name: "Running", muscleGroup: "cardio", type: "cardio", difficulty: "beginner", caloriesPerMinute: 12 },
      { name: "Cycling", muscleGroup: "cardio", type: "cardio", difficulty: "beginner", caloriesPerMinute: 9 },
      { name: "Burpees", muscleGroup: "full_body", type: "hiit", difficulty: "advanced", caloriesPerMinute: 15 },
      { name: "Lunges", muscleGroup: "legs", type: "strength", difficulty: "beginner", caloriesPerMinute: 7 },
      { name: "Dumbbell Press", muscleGroup: "shoulders", type: "strength", difficulty: "intermediate", caloriesPerMinute: 6 },
      { name: "Deadlift", muscleGroup: "back", type: "strength", difficulty: "advanced", caloriesPerMinute: 10 }
    ];

    await Exercise.insertMany(exercises);
    res.json({ msg: "Exercises seeded successfully", count: exercises.length });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// --- WORKOUTS ---

export const getWorkouts = async (req, res) => {
  try {
    const { date, startDate, endDate } = req.query;
    const query = { user: req.user.id };

    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1);
      query.date = { $gte: start, $lt: end };
    } else if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const workouts = await Workout.find(query)
      .populate("exercises.exercise")
      .sort({ date: -1 });
      
    res.json(workouts);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const addWorkout = async (req, res) => {
  try {
    const { name, type, duration, exercises, notes, date, intensity } = req.body;
    
    // Calculate calories if not provided
    let caloriesBurned = req.body.caloriesBurned;
    if (!caloriesBurned) {
      // Simple estimation: 5-10 cals/min based on intensity
      const multiplier = intensity === "high" ? 10 : intensity === "medium" ? 7 : 4;
      caloriesBurned = duration * multiplier;
    }

    const workout = await Workout.create({
      user: req.user.id,
      name,
      type,
      duration,
      caloriesBurned,
      exercises,
      notes,
      date: date || Date.now(),
      intensity
    });

    // Update Daily Summary
    const dateStr = new Date(workout.date).toISOString().split('T')[0];
    await DailySummary.findOneAndUpdate(
      { user: req.user.id, date: dateStr },
      { 
        $inc: { 
          caloriesBurned: caloriesBurned,
          activeMinutes: duration
        } 
      },
      { upsert: true }
    );

    res.status(201).json(workout);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
};

export const deleteWorkout = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);
    if (!workout) return res.status(404).json({ msg: "Workout not found" });
    if (workout.user.toString() !== req.user.id) return res.status(401).json({ msg: "Not authorized" });

    // Reverse Daily Summary stats
    const dateStr = new Date(workout.date).toISOString().split('T')[0];
    await DailySummary.findOneAndUpdate(
      { user: req.user.id, date: dateStr },
      { 
        $inc: { 
          caloriesBurned: -workout.caloriesBurned,
          activeMinutes: -workout.duration
        } 
      }
    );

    await workout.deleteOne();
    res.json({ msg: "Workout removed" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
