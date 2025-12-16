import React, { useState, useEffect } from "react";
import axios from "axios";
import { Droplet, Plus, Minus, CupSoda, Waves } from "lucide-react";

function WaterTracker() {
  const [waterIntake, setWaterIntake] = useState(0);
  const [waterGoal, setWaterGoal] = useState(2000);
  const [loading, setLoading] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    fetchTodaysSummary();
  }, []);

  const fetchTodaysSummary = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/activity/today`,
        { withCredentials: true }
      );
      setWaterIntake(response.data.waterIntake || 0);
      setWaterGoal(response.data.waterGoal || 2000);
    } catch (error) {
      console.error("Error fetching water data:", error);
    } finally {
      setLoading(false);
    }
  };

  const addWater = async (amount) => {
    setIsAnimating(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/activity/water`,
        { amount },
        { withCredentials: true }
      );
      setWaterIntake(response.data.waterIntake);
      setTimeout(() => setIsAnimating(false), 1000);
    } catch (error) {
      console.error("Error adding water:", error);
      setIsAnimating(false);
    }
  };

  const percentage = Math.min((waterIntake / waterGoal) * 100, 100);
  
  // Wave height calculation: 100% full = 0% top, 0% full = 100% top
  const waveTop = 100 - percentage;

  if (loading) return (
    <div className="h-full w-full bg-slate-100 rounded-3xl animate-pulse"></div>
  );

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-cyan-50 to-blue-50 rounded-[2.5rem] shadow-xl border border-white p-0 h-full min-h-[400px] flex flex-col group">
      
      {/* Background Bubbles (Decorative) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
         <div className="absolute bottom-[-20px] left-[10%] w-4 h-4 rounded-full bg-cyan-200/40 animate-float animation-delay-2000"></div>
         <div className="absolute bottom-[-30px] left-[40%] w-8 h-8 rounded-full bg-blue-200/30 animate-float"></div>
         <div className="absolute bottom-[-10px] left-[80%] w-6 h-6 rounded-full bg-cyan-300/30 animate-float animation-delay-4000"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 px-8 pt-8 flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <div className="p-2 bg-white/50 backdrop-blur-md rounded-xl text-cyan-600 shadow-sm">
                <Waves size={20} />
             </div>
             <h2 className="text-xl font-bold text-slate-800 tracking-tight">Hydration</h2>
          </div>
          <p className="text-sm font-medium text-slate-500">Daily Goal: {(waterGoal/1000).toFixed(1)}L</p>
        </div>
        <div className="text-right">
           <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-cyan-600 to-blue-600">
             {percentage.toFixed(0)}<span className="text-lg text-cyan-500">%</span>
           </div>
        </div>
      </div>

      {/* Liquid Wave Container */}
      <div className="relative flex-1 w-full mt-6 mb-24 group-hover:scale-105 transition-transform duration-700 ease-in-out">
         {/* Glass Container Bottle/Shape */}
         <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-64 bg-white/20 backdrop-blur-sm border-2 border-white/40 rounded-[3rem] shadow-inner overflow-hidden z-10">
            
            {/* The Liquid */}
            <div 
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-500 to-cyan-400 transition-all duration-1000 ease-in-out"
              style={{ height: `${percentage}%` }}
            >
               {/* Wave SVG on top of liquid */}
               <div className="absolute top-[-10px] left-0 w-[200%] h-6 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjAwIDEyMCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ibm9uZSI+PHBhdGggZD0iTTAgMjRWYy41LjkuNSAyNC0yNC0yNC01NC45IDAgMTA5LjUgMCA5OS41IDAgMTUyLjUgMCAyLjMgMy44IDUuMyA3LjggOSA5LjggNi42IDMuNSAxMy44IDMuNyAyMC41IDMuNyA2Ny0uNSA4OS0zLjUgOTguNS0zLjUgMTA5LjUtMy41IDEyMDAgMjRWOS41VjBIMHoiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4zIi8+PC9zdmc+')] bg-repeat-x opacity-40 animate-wave"></div>
               <div className="absolute top-[-5px] left-0 w-[200%] h-6 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjAwIDEyMCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ibm9uZSI+PHBhdGggZD0iTTAgMjRWYy41LjkuNSAyNC0yNC0yNC01NC45IDAgMTA5LjUgMCA5OS41IDAgMTUyLjUgMCAyLjMgMy44IDUuMyA3LjggOSA5LjggNi42IDMuNSAxMy44IDMuNyAyMC41IDMuNyA2Ny0uNSA4OS0zLjUgOTguNS0zLjUgMTA5LjUtMy41IDEyMDAgMjRWOS41VjBIMHoiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC41Ii8+PC9zdmc+')] bg-repeat-x opacity-60 animate-wave" style={{ animationDuration: '7s' }}></div>
            </div>
            
            {/* Measurement Lines */}
            <div className="absolute right-0 top-0 bottom-0 w-8 flex flex-col justify-between py-8 pr-3 pointer-events-none">
               {[100, 75, 50, 25].map(tick => (
                  <div key={tick} className="w-full h-px bg-white/40 relative">
                     <span className="absolute right-0 -top-2 text-[10px] font-bold text-white/80">{tick}%</span>
                  </div>
               ))}
            </div>

            {/* Floating text inside */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className={`text-3xl font-black drop-shadow-md transition-colors duration-500 ${percentage > 50 ? 'text-white' : 'text-slate-400/50'}`}>
                {(waterIntake / 1000).toFixed(2)}L
              </span>
            </div>
         </div>
      </div>

      {/* Footer Controls - Glassmorphism Floating Dock */}
      <div className="absolute bottom-6 left-6 right-6">
         <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-2 shadow-lg border border-white/50 flex items-center justify-around gap-2">
            
            <button 
              onClick={() => addWater(-250)}
              className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
            >
              <Minus size={18} />
            </button>

            <div className="h-8 w-px bg-slate-200"></div>

            <button 
              onClick={() => addWater(250)}
              className="flex-1 py-2 px-3 bg-cyan-100 hover:bg-cyan-200 text-cyan-700 rounded-xl font-bold text-sm transition-all hover:shadow-md flex items-center justify-center gap-1 active:scale-95"
            >
              <Plus size={14} strokeWidth={3} /> 250ml
            </button>
            
            <button 
              onClick={() => addWater(500)}
              className="flex-1 py-2 px-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-200 hover:shadow-blue-300 flex items-center justify-center gap-1 active:scale-95"
            >
              <Plus size={14} strokeWidth={3} /> 500ml
            </button>
         </div>
      </div>
    </div>
  );
}

export default WaterTracker;
