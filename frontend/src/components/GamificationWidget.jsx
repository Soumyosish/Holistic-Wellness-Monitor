import React, { useState, useEffect } from "react";
import axios from "axios";
import { Award, Flame, Star, Trophy, Crown, Medal } from "lucide-react";

function GamificationWidget() {
  const [data, setData] = useState({
    currentStreak: 0,
    totalPoints: 0,
    badges: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRewards();
  }, []);

  const fetchRewards = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/rewards`,
        { withCredentials: true }
      );
      setData(response.data);
    } catch (error) {
      console.error("Error fetching rewards:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
     <div className="h-full w-full bg-slate-50 rounded-[2.5rem] animate-pulse border border-slate-100"></div>
  );

  const unlockedBadges = data.badges.filter(b => b.unlocked);
  // Calculate level progress (simple logic for display)
  const nextLevel = Math.floor(data.totalPoints / 1000) + 1;
  const progress = (data.totalPoints % 1000) / 10; // 0-100%

  return (
    <div className="relative overflow-hidden bg-white rounded-[2.5rem] p-6 shadow-xl shadow-slate-200/50 border border-slate-100 h-full flex flex-col group transition-all duration-500 hover:shadow-2xl hover:shadow-amber-100/40">
      
      {/* Golden Glow Background */}
      <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-amber-100/40 rounded-full blur-[60px] pointer-events-none"></div>
      <div className="absolute bottom-[-20px] left-[-20px] w-32 h-32 bg-yellow-100/30 rounded-full blur-[40px] pointer-events-none"></div>

      {/* Header */}
      <div className="flex items-center justify-between z-10 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-amber-300 to-yellow-500 rounded-2xl shadow-lg shadow-amber-200 text-white transform group-hover:rotate-12 transition-transform duration-300">
            <Trophy className="w-5 h-5" fill="currentColor" fillOpacity={0.2} strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800 leading-tight">Achievements</h2>
            <div className="text-xs font-semibold text-amber-500 flex items-center gap-1">
               Level {nextLevel - 1} <span className="text-slate-300">•</span> {data.totalPoints} XP
            </div>
          </div>
        </div>
        
        {/* Streak Counter */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-600 rounded-full border border-orange-100 shadow-sm">
          <Flame className="w-3.5 h-3.5 fill-current animate-pulse" />
          <span className="text-xs font-bold">{data.currentStreak} Day Streak</span>
        </div>
      </div>

      {/* Level Progress */}
      <div className="mb-6 z-10">
         <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
            <span>Level Progress</span>
            <span>{Math.round(progress)}% to Lvl {nextLevel}</span>
         </div>
         <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div 
               className="h-full bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full shadow-lg shadow-amber-200"
               style={{ width: `${progress}%` }}
            ></div>
         </div>
      </div>

      {/* Badge Grid */}
      <div className="grid grid-cols-4 gap-3 z-10">
        {unlockedBadges.slice(0, 4).map(badge => (
          <div key={badge.id} className="flex flex-col items-center group/badge">
             <div className="relative mb-2">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 flex items-center justify-center text-2xl shadow-sm transition-all duration-300 group-hover/badge:scale-110 group-hover/badge:shadow-md group-hover/badge:border-amber-200">
                   {badge.icon}
                </div>
                {/* Shine effect */}
                <div className="absolute inset-0 bg-white/50 rounded-2xl opacity-0 group-hover/badge:opacity-100 animate-pulse"></div>
             </div>
             <div className="text-[10px] font-bold text-slate-600 text-center leading-tight px-1 line-clamp-2">
                {badge.name}
             </div>
          </div>
        ))}
        
        {/* Upcoming Locked Badge Placeholder */}
        {unlockedBadges.length < 4 && (
           <div className="flex flex-col items-center opacity-50 grayscale">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-dashed border-slate-300 flex items-center justify-center mb-2">
                 <Medal size={20} className="text-slate-400" />
              </div>
              <div className="text-[10px] font-medium text-slate-400 text-center">Locked</div>
           </div>
        )}

        {unlockedBadges.length === 0 && (
          <div className="col-span-4 text-center py-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-xs text-slate-400">
            Log your first activity to unlock badges!
          </div>
        )}
      </div>
    </div>
  );
}

export default GamificationWidget;
