import DailySummary from "../models/DailySummary.js";
import User from "../models/User.js";
import { google } from "googleapis";

const getTodayDateIST = () => {
  const now = new Date();
  // Convert to IST (UTC+5:30)
  const istOffset = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds
  const istDate = new Date(now.getTime() + istOffset);
  return istDate.toISOString().split("T")[0];
};

export const getTodaySummary = async (req, res) => {
  try {
    const userId = req.user._id;
    // Use IST date instead of UTC
    const today = getTodayDateIST();

    let summary = await DailySummary.findOne({ user: userId, date: today });

    if (!summary) {
      // Get user's goals
      const user = await User.findById(userId);

      summary = await DailySummary.create({
        user: userId,
        date: today,
        waterGoal: user?.dailyWaterGoal || 2000,
        stepGoal: user?.dailyStepGoal || 10000,
        calorieGoal: user?.dailyCalorieTarget || 2000,
      });
    }

    res.json(summary);
  } catch (error) {
    console.error("Error getting today's summary:", error);
    res.status(500).json({ msg: error.message });
  }
};

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

export const updateWaterIntake = async (req, res) => {
  try {
    const userId = req.user._id;
    const { amount, date } = req.body;
    const targetDate = date || getTodayDateIST();

    // First, get the current summary to check current water intake
    let summary = await DailySummary.findOne({
      user: userId,
      date: targetDate,
    });

    if (!summary) {
      // Create new summary if doesn't exist
      const user = await User.findById(userId);
      summary = await DailySummary.create({
        user: userId,
        date: targetDate,
        waterGoal: user?.dailyWaterGoal || 2000,
        stepGoal: user?.dailyStepGoal || 10000,
        calorieGoal: user?.dailyCalorieTarget || 2000,
      });
    }

    // Calculate new water intake and ensure it doesn't go below 0
    const currentWater = summary.waterIntake || 0;
    const newWaterIntake = Math.max(0, currentWater + amount);

    // Update with the validated value
    summary.waterIntake = newWaterIntake;
    await summary.save();

    res.json(summary);
  } catch (error) {
    console.error("Error updating water intake:", error);
    res.status(500).json({ msg: error.message });
  }
};

export const updateSteps = async (req, res) => {
  try {
    const userId = req.user._id;
    const { steps, date } = req.body;
    const targetDate = date || getTodayDateIST();

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

export const updateSleep = async (req, res) => {
  try {
    const userId = req.user._id;
    const { sleepHours, sleepQuality, sleepStart, sleepEnd, date } = req.body;
    const targetDate = date || getTodayDateIST();

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

export const updateWeight = async (req, res) => {
  try {
    const userId = req.user._id;
    const { weight, date } = req.body;
    const targetDate = date || new Date().toISOString().split("T")[0];

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

export const getWeeklyStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get today's date in IST
    const todayIST = getTodayDateIST();
    const today = new Date(todayIST);

    // Calculate 7 days ago in IST
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 6); // Include today, so -6 days
    const sevenDaysAgoStr = sevenDaysAgo.toISOString().split("T")[0];

    // Fetch summaries for the last 7 days
    const summaries = await DailySummary.find({
      user: userId,
      date: { $gte: sevenDaysAgoStr, $lte: todayIST },
    }).sort({ date: 1 });

    // Calculate averages
    const avgWaterIntake =
      summaries.length > 0
        ? summaries.reduce((sum, s) => sum + (s.waterIntake || 0), 0) /
          summaries.length
        : 0;

    const avgSleepHours =
      summaries.length > 0
        ? summaries.reduce((sum, s) => sum + (s.sleepHours || 0), 0) /
          summaries.length
        : 0;

    const avgSteps =
      summaries.length > 0
        ? summaries.reduce((sum, s) => sum + (s.steps || 0), 0) /
          summaries.length
        : 0;

    res.json({
      summaries,
      avgWaterIntake: Math.round(avgWaterIntake),
      avgSleepHours: parseFloat(avgSleepHours.toFixed(1)),
      avgSteps: Math.round(avgSteps),
    });
  } catch (error) {
    console.error("Error getting weekly stats:", error);
    res.status(500).json({ msg: error.message });
  }
};

const getOAuth2Client = () => {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI || "postmessage"
  );
};

const refreshAccessToken = async (user) => {
  try {
    const oauth2Client = getOAuth2Client();
    oauth2Client.setCredentials({
      refresh_token: user.googleFitRefreshToken,
    });

    const { credentials } = await oauth2Client.refreshAccessToken();

    // Update user with new access token
    user.googleFitAccessToken = credentials.access_token;
    user.googleFitTokenExpiry = new Date(credentials.expiry_date);
    await user.save();

    return credentials.access_token;
  } catch (error) {
    console.error("Error refreshing Google Fit token:", error);
    throw error;
  }
};

export const connectGoogleFit = async (req, res) => {
  try {
    const userId = req.user._id;
    const { code, accessToken, refreshToken, expiryDate } = req.body;

    let tokens = { accessToken, refreshToken, expiryDate };

    // If code is provided, exchange it for tokens
    if (code && !accessToken) {
      const oauth2Client = getOAuth2Client();
      const { tokens: exchangedTokens } = await oauth2Client.getToken(code);
      tokens = {
        accessToken: exchangedTokens.access_token,
        refreshToken: exchangedTokens.refresh_token,
        expiryDate: exchangedTokens.expiry_date,
      };
    }

    if (!tokens.accessToken) {
      return res.status(400).json({ msg: "Access token is required" });
    }

    // Update user with Google Fit tokens
    const user = await User.findByIdAndUpdate(
      userId,
      {
        googleFitAccessToken: tokens.accessToken,
        googleFitRefreshToken: tokens.refreshToken,
        googleFitTokenExpiry: tokens.expiryDate
          ? new Date(tokens.expiryDate)
          : null,
        googleFitConnected: true,
      },
      { new: true }
    );

    res.json({
      msg: "Google Fit connected successfully",
      connected: true,
      user: {
        googleFitConnected: user.googleFitConnected,
      },
    });
  } catch (error) {
    console.error("Error connecting Google Fit:", error);
    res.status(500).json({ msg: error.message });
  }
};

export const disconnectGoogleFit = async (req, res) => {
  try {
    const userId = req.user._id;

    await User.findByIdAndUpdate(userId, {
      googleFitAccessToken: null,
      googleFitRefreshToken: null,
      googleFitTokenExpiry: null,
      googleFitConnected: false,
    });

    res.json({ msg: "Google Fit disconnected successfully", connected: false });
  } catch (error) {
    console.error("Error disconnecting Google Fit:", error);
    res.status(500).json({ msg: error.message });
  }
};

export const getGoogleFitStatus = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select(
      "googleFitConnected googleFitTokenExpiry"
    );

    res.json({
      connected: user.googleFitConnected || false,
      tokenExpiry: user.googleFitTokenExpiry,
    });
  } catch (error) {
    console.error("Error getting Google Fit status:", error);
    res.status(500).json({ msg: error.message });
  }
};

export const syncGoogleFitSteps = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user.googleFitConnected || !user.googleFitAccessToken) {
      return res.status(400).json({ msg: "Google Fit not connected" });
    }

    // Check if token is expired and refresh if needed
    if (user.googleFitTokenExpiry && new Date() > user.googleFitTokenExpiry) {
      await refreshAccessToken(user);
      // Reload user after token refresh
      await user.reload();
    }

    // Get OAuth2 client
    const oauth2Client = getOAuth2Client();
    oauth2Client.setCredentials({
      access_token: user.googleFitAccessToken,
    });

    const fitness = google.fitness({ version: "v1", auth: oauth2Client });

    // Get today's date elements in IST
    const getISTDateParts = (date) => {
      const parts = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).formatToParts(date);

      const year = parts.find((p) => p.type === "year").value;
      const month = parts.find((p) => p.type === "month").value;
      const day = parts.find((p) => p.type === "day").value;
      return { year, month, day };
    };

    const now = new Date();
    const { year, month, day } = getISTDateParts(now);
    const todayIST = `${year}-${month}-${day}`;

    // Construct exact ISO strings with +05:30 offset
    // This creates unambiguous moments in time
    const todayEndString = `${year}-${month}-${day}T23:59:59.999+05:30`;
    const endTimeMillis = new Date(todayEndString).getTime();

    // Calculate 6 days ago
    const todayDateObj = new Date(todayEndString); // This reads it as the correct moment
    const sevenDaysAgoObj = new Date(todayDateObj);
    sevenDaysAgoObj.setDate(todayDateObj.getDate() - 6);

    // Get IST parts for the start date
    const startParts = getISTDateParts(sevenDaysAgoObj);
    const startDateString = `${startParts.year}-${startParts.month}-${startParts.day}T00:00:00.000+05:30`;
    const startTimeMillis = new Date(startDateString).getTime();
    // Calculate IST-aligned timestamps using pure UTC math
    // Goal: Align buckets to IST Midnight (18:30 UTC of previous day)
    
    const now = new Date();
    // Get current UTC timestamp
    const nowUTC = now.getTime();
    
    // IST Offset in millis
    const IST_OFFSET = 5.5 * 60 * 60 * 1000;
    
    // Calculate "Current IST Time" in millis (conceptually)
    const nowIST = nowUTC + IST_OFFSET;
    
    // Find the end of today in IST (next midnight)
    // Floor to day boundary
    const millisPerDay = 24 * 60 * 60 * 1000;
    const todayStartIST = Math.floor(nowIST / millisPerDay) * millisPerDay;
    const todayEndIST = todayStartIST + millisPerDay;
    
    // Convert back to UTC epoch
    // IST Midnight = UTC 18:30 (prev day). 
    // If todayStartIST is aligned to 00:00, subtracting offset gives UTC epoch
    const todayStartEpoch = todayStartIST - IST_OFFSET;
    const todayEndEpoch = todayEndIST - IST_OFFSET; // End of today (23:59:59.999 approx)
    
    // We want 7 days history relative to TODAY
    // Start Time = Today Start - 6 days
    const startTimeMillis = todayStartEpoch - (6 * millisPerDay);
    const endTimeMillis = todayEndEpoch; // Includes all of today

    // Fetch step data from Google Fit for last 7 days
    const response = await fitness.users.dataset.aggregate({
      userId: "me",
      requestBody: {
        aggregateBy: [
          {
            dataTypeName: "com.google.step_count.delta",
          },
        ],
        bucketByTime: { durationMillis: 24 * 60 * 60 * 1000 },
        aggregateBy: [{
          dataTypeName: 'com.google.step_count.delta',
        }],
        bucketByTime: { durationMillis: millisPerDay },
        startTimeMillis,
        endTimeMillis,
      },
    });

    let todaySteps = 0;
    
    // Convert today's IST start to string YYYY-MM-DD for comparison
    const todayDateObj = new Date(todayStartIST); // Treating logic-time as UTC for formatting purposes works if we stick to UTC methods
    const todayISO = new Date(nowUTC + IST_OFFSET).toISOString().split('T')[0];

    // Process each daily bucket
    if (response.data.bucket) {
      for (const bucket of response.data.bucket) {
        let dailySteps = 0;
        const bucketStartTime = parseInt(bucket.startTimeMillis);

        // Determine the date of this bucket in IST
        // Center of the bucket check to avoid edge cases
        const midBucketTime = bucketStartTime + 12 * 60 * 60 * 1000;
        const { year, month, day } = getISTDateParts(new Date(midBucketTime));
        
        // Calculate the central date of this bucket in IST coordinates
        // Bucket Start (UTC) + Offset = Bucket Start (IST)
        // This should be 00:00:00 IST
        const bucketStartIST = bucketStartTime + IST_OFFSET;
        
        // create Date object from this "IST timestamp"
        // standard Date methods on this will give UTC breakdown which matches IST date elements
        // e.g. 00:00 IST (representation) -> Date(00:00).getUTCHours() === 0
        const dateObj = new Date(bucketStartIST);
        const year = dateObj.getUTCFullYear();
        const month = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getUTCDate()).padStart(2, '0');
        const bucketDate = `${year}-${month}-${day}`;

        const datasets = bucket.dataset || [];
        datasets.forEach((ds) => {
          (ds.point || []).forEach((pt) => {
            if (pt.value && pt.value.length > 0 && pt.value[0].intVal) {
              dailySteps += pt.value[0].intVal;
            }
          });
        });

        // Update DailySummary for this specific date
        await DailySummary.findOneAndUpdate(
          { user: userId, date: bucketDate },
          { steps: dailySteps },
          { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        if (bucketDate === todayISO) {
          todaySteps = dailySteps;
        }
      }
    }

    // Get the updated summary for today
    const summary = await DailySummary.findOne({
      user: userId,
      date: todayIST,
    });
    const summary = await DailySummary.findOne({ user: userId, date: todayISO });

    res.json({
      steps: todaySteps,
      lastSync: new Date(),
      summary,
    });
  } catch (error) {
    console.error("Error syncing Google Fit steps:", error);
    res.status(500).json({ msg: "Failed to sync Google Fit data" });
  }
};
