import DailySummary from "../models/DailySummary.js";
import User from "../models/User.js";

/**
 * Get today's summary or create if doesn't exist
 */
export const getTodaySummary = async (req, res) => {
  try {
    const userId = req.user._id;
    const today = new Date().toISOString().split('T')[0];

    let summary = await DailySummary.findOne({ user: userId, date: today });

    if (!summary) {
      // Get user's goals
      const user = await User.findById(userId);
      
      summary = await DailySummary.create({
        user: userId,
        date: today,
        waterGoal: user?.dailyWaterGoal || 2000,
        stepGoal: user?.dailyStepGoal || 10000,
        calorieGoal: user?.dailyCalorieTarget || 2000
      });
    }

    res.json(summary);
  } catch (error) {
    console.error("Error getting today's summary:", error);
    res.status(500).json({ msg: error.message });
  }
};

/**
 * Get summary for a specific date
 */
export const getSummaryByDate = async (req, res) => {
  try {
    const userId = req.user._id;
    const { date } = req.params;

    const summary = await DailySummary.findOne({ user: userId, date });

    if (!summary) {
      return res.status(404).json({ msg: "No summary found for this date" });
    }

    res.json(summary);
  } catch (error) {
    console.error("Error getting summary:", error);
    res.status(500).json({ msg: error.message });
  }
};

/**
 * Update water intake
 */
export const updateWaterIntake = async (req, res) => {
  try {
    const userId = req.user._id;
    const { amount, date } = req.body;
    const targetDate = date || new Date().toISOString().split('T')[0];

    const summary = await DailySummary.findOneAndUpdate(
      { user: userId, date: targetDate },
      { $inc: { waterIntake: amount } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.json(summary);
  } catch (error) {
    console.error("Error updating water intake:", error);
    res.status(500).json({ msg: error.message });
  }
};

/**
 * Update step count
 */
export const updateSteps = async (req, res) => {
  try {
    const userId = req.user._id;
    const { steps, date } = req.body;
    const targetDate = date || new Date().toISOString().split('T')[0];

    const summary = await DailySummary.findOneAndUpdate(
      { user: userId, date: targetDate },
      { steps },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.json(summary);
  } catch (error) {
    console.error("Error updating steps:", error);
    res.status(500).json({ msg: error.message });
  }
};

/**
 * Update sleep data
 */
export const updateSleep = async (req, res) => {
  try {
    const userId = req.user._id;
    const { sleepHours, sleepQuality, sleepStart, sleepEnd, date } = req.body;
    const targetDate = date || new Date().toISOString().split('T')[0];

    const updateData = {};
    if (sleepHours !== undefined) updateData.sleepHours = sleepHours;
    if (sleepQuality !== undefined) updateData.sleepQuality = sleepQuality;
    if (sleepStart) updateData.sleepStart = new Date(sleepStart);
    if (sleepEnd) updateData.sleepEnd = new Date(sleepEnd);

    const summary = await DailySummary.findOneAndUpdate(
      { user: userId, date: targetDate },
      updateData,
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.json(summary);
  } catch (error) {
    console.error("Error updating sleep:", error);
    res.status(500).json({ msg: error.message });
  }
};

/**
 * Update weight
 */
export const updateWeight = async (req, res) => {
  try {
    const userId = req.user._id;
    const { weight, date } = req.body;
    const targetDate = date || new Date().toISOString().split('T')[0];

    const summary = await DailySummary.findOneAndUpdate(
      { user: userId, date: targetDate },
      { weight },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    // Also update user's current weight
    await User.findByIdAndUpdate(userId, { weight });

    res.json(summary);
  } catch (error) {
    console.error("Error updating weight:", error);
    res.status(500).json({ msg: error.message });
  }
};

/**
 * Get activity history for date range
 */
export const getActivityHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const { startDate, endDate, limit = 30 } = req.query;

    const query = { user: userId };

    if (startDate && endDate) {
      query.date = { $gte: startDate, $lte: endDate };
    }

    const summaries = await DailySummary.find(query)
      .sort({ date: -1 })
      .limit(parseInt(limit));

    res.json(summaries);
  } catch (error) {
    console.error("Error getting activity history:", error);
    res.status(500).json({ msg: error.message });
  }
};

/**
 * Get weekly stats
 */
export const getWeeklyStats = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get last 7 days
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 6);

    const summaries = await DailySummary.find({
      user: userId,
      date: {
        $gte: startDate.toISOString().split('T')[0],
        $lte: endDate.toISOString().split('T')[0]
      }
    }).sort({ date: 1 });

    // Calculate averages
    const stats = {
      avgWaterIntake: 0,
      avgSteps: 0,
      avgSleepHours: 0,
      avgCaloriesConsumed: 0,
      avgCaloriesBurned: 0,
      totalDays: summaries.length,
      summaries
    };

    if (summaries.length > 0) {
      stats.avgWaterIntake = Math.round(
        summaries.reduce((sum, s) => sum + (s.waterIntake || 0), 0) / summaries.length
      );
      stats.avgSteps = Math.round(
        summaries.reduce((sum, s) => sum + (s.steps || 0), 0) / summaries.length
      );
      stats.avgSleepHours = (
        summaries.reduce((sum, s) => sum + (s.sleepHours || 0), 0) / summaries.length
      ).toFixed(1);
      stats.avgCaloriesConsumed = Math.round(
        summaries.reduce((sum, s) => sum + (s.caloriesConsumed || 0), 0) / summaries.length
      );
      stats.avgCaloriesBurned = Math.round(
        summaries.reduce((sum, s) => sum + (s.caloriesBurned || 0), 0) / summaries.length
      );
    }

    res.json(stats);
  } catch (error) {
    console.error("Error getting weekly stats:", error);
    res.status(500).json({ msg: error.message });
  }
};
