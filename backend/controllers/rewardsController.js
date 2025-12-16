import DailySummary from "../models/DailySummary.js";
import User from "../models/User.js";

const BADGES = [
  { id: "starter", name: "Getting Started", description: "Logged first activity", icon: "🌱" },
  { id: "week_streak", name: "Week Warrior", description: "7 day streak", icon: "🔥" },
  { id: "month_streak", name: "Monthly Master", description: "30 day streak", icon: "🏆" },
  { id: "hydrated", name: "Hydro Homie", description: "Hit water goal 7 days in a row", icon: "💧" },
  { id: "stepper", name: "Mountain Mover", description: "100k total steps", icon: "👣" },
  { id: "early_bird", name: "Early Bird", description: "Logged sleep before 7am", icon: "🌅" }
];

export const getRewards = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Fetch all summaries sorted by date
    const summaries = await DailySummary.find({ user: userId }).sort({ date: 1 });
    
    // Calculate Streak
    let currentStreak = 0;
    let maxStreak = 0;
    
    // Simple logic: consecutive days with any activity
    if (summaries.length > 0) {
        // Sort effectively (already sorted by query but ensuring)
        // Check gap between dates
        currentStreak = 1;
        let tempStreak = 1;
        
        for (let i = 1; i < summaries.length; i++) {
            const prev = new Date(summaries[i-1].date);
            const curr = new Date(summaries[i].date);
            const diffTime = Math.abs(curr - prev);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
            
            if (diffDays === 1) {
                tempStreak++;
            } else {
                maxStreak = Math.max(maxStreak, tempStreak);
                tempStreak = 1;
            }
        }
        maxStreak = Math.max(maxStreak, tempStreak);
        
        // Check if last summary was today or yesterday to maintain current streak
        const today = new Date().toISOString().split('T')[0];
        const lastDate = summaries[summaries.length - 1].date;
        const last = new Date(lastDate);
        const now = new Date(today);
        const diff = Math.ceil((now - last) / (1000 * 60 * 60 * 24));
        
        if (diff > 1) {
           currentStreak = 0;
        } else {
           currentStreak = tempStreak;
        }
    }

    // Identify Badges
    const earnedBadges = [];
    
    if (summaries.length >= 1) earnedBadges.push("starter");
    if (maxStreak >= 7) earnedBadges.push("week_streak");
    if (maxStreak >= 30) earnedBadges.push("month_streak");
    
    const totalSteps = summaries.reduce((acc, curr) => acc + (curr.steps || 0), 0);
    if (totalSteps > 100000) earnedBadges.push("stepper");

    // Hydration streak logic could be added here
    
    const badgesWithStatus = BADGES.map(badge => ({
        ...badge,
        unlocked: earnedBadges.includes(badge.id)
    }));

    res.json({
        currentStreak,
        maxStreak,
        totalPoints: summaries.length * 10, // 10 points per logged day
        badges: badgesWithStatus
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Failed to fetch rewards" });
  }
};
