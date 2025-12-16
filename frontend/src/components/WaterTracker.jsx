import React, { useState, useEffect } from "react";
import axios from "axios";
import { Droplet, Plus, Minus, CupSoda, Waves, TrendingUp } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

function WaterTracker() {
  const [waterIntake, setWaterIntake] = useState(0);
  const [waterGoal, setWaterGoal] = useState(2000);
  const [weeklyData, setWeeklyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeBar, setActiveBar] = useState(null);

  useEffect(() => {
    fetchTodaysSummary();
    fetchWeeklyData();
  }, []);

  const fetchTodaysSummary = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/activity/today`,
        { withCredentials: true }
      );
      // Ensure water intake is never negative
      setWaterIntake(Math.max(0, response.data.waterIntake || 0));
      setWaterGoal(response.data.waterGoal || 2000);
    } catch (error) {
      console.error("Error fetching water data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeeklyData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/activity/weekly-stats`,
        { withCredentials: true }
      );

      const chartData = response.data.summaries.map((s) => ({
        date: new Date(s.date).toLocaleDateString("en-US", {
          weekday: "short",
        }),
        intake: (s.waterIntake || 0) / 1000, // Convert to liters
        goal: (s.waterGoal || 2000) / 1000,
      }));

      setWeeklyData(chartData);
    } catch (error) {
      console.error("Error fetching weekly water data:", error);
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
      // Ensure water intake is never negative
      setWaterIntake(Math.max(0, response.data.waterIntake || 0));
      setTimeout(() => setIsAnimating(false), 1000);
      // Refresh weekly data
      fetchWeeklyData();
    } catch (error) {
      console.error("Error adding water:", error);
      setIsAnimating(false);
    }
  };

  const percentage = Math.min((waterIntake / waterGoal) * 100, 100);

  // Wave height calculation: 100% full = 0% top, 0% full = 100% top
  const waveTop = 100 - percentage;

  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/90 backdrop-blur-md border border-cyan-100 p-3 rounded-2xl shadow-xl shadow-cyan-100/50">
          <p className="font-bold text-slate-700 mb-1">{label}</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
            <p className="text-cyan-600 font-bold text-sm">
              {payload[0].value.toFixed(2)}L
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  if (loading)
    return (
      <div className="h-full w-full bg-slate-100 rounded-3xl animate-pulse"></div>
    );

  return (
    <div className="relative overflow-hidden bg-linear-to-br from-cyan-50 to-blue-50 rounded-[2.5rem] shadow-xl border border-white p-0 h-full min-h-[400px] flex flex-col group">
      {/* Background Bubbles (Decorative) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -bottom-5 left-[10%] w-4 h-4 rounded-full bg-cyan-200/40 animate-float animation-delay-2000"></div>
        <div className="absolute bottom-[-30px] left-[40%] w-8 h-8 rounded-full bg-blue-200/30 animate-float"></div>
        <div className="absolute -bottom-2.5 left-[80%] w-6 h-6 rounded-full bg-cyan-300/30 animate-float animation-delay-4000"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 px-8 pt-8 flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 bg-white/50 backdrop-blur-md rounded-xl text-cyan-600 shadow-sm">
              <Waves size={20} />
            </div>
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">
              Hydration
            </h2>
          </div>
          <p className="text-sm font-medium text-slate-500">
            Daily Goal: {(waterGoal / 1000).toFixed(1)}L
          </p>
        </div>
        <div className="text-right">
          <div className="text-4xl font-black text-transparent bg-clip-text bg-linear-to-br from-cyan-600 to-blue-600">
            {percentage.toFixed(0)}
            <span className="text-lg text-cyan-500">%</span>
          </div>
        </div>
      </div>

      {/* Liquid Wave Container */}
      <div className="relative flex-1 w-full mt-6 mb-4 group-hover:scale-105 transition-transform duration-700 ease-in-out px-8">
        {/* Glass Container Bottle/Shape */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-48 bg-white/20 backdrop-blur-sm border-2 border-white/40 rounded-[3rem] shadow-inner overflow-hidden z-10">
          {/* The Liquid */}
          <div
            className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-blue-500 to-cyan-400 transition-all duration-1000 ease-in-out"
            style={{ height: `${percentage}%` }}
          >
            {/* Wave SVG on top of liquid */}
            <div className="absolute -top-2.5 left-0 w-[200%] h-6 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjAwIDEyMCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ibm9uZSI+PHBhdGggZD0iTTAgMjRWYy41LjkuNSAyNC0yNC0yNC01NC45IDAgMTA5LjUgMCA5OS41IDAgMTUyLjUgMCAyLjMgMy44IDUuMyA3LjggOSA5LjggNi42IDMuNSAxMy44IDMuNyAyMC41IDMuNyA2Ny0uNSA4OS0zLjUgOTguNS0zLjUgMTA5LjUtMy41IDEyMDAgMjRWOS41VjBIMHoiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4zIi8+PC9zdmc+')] bg-repeat-x opacity-40 animate-wave"></div>
            <div
              className="absolute top-[-5px] left-0 w-[200%] h-6 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjAwIDEyMCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ibm9uZSI+PHBhdGggZD0iTTAgMjRWYy41LjkuNSAyNC0yNC0yNC01NC45IDAgMTA5LjUgMCA5OS41IDAgMTUyLjUgMCAyLjMgMy44IDUuMyA3LjggOSA5LjggNi42IDMuNSAxMy44IDMuNyAyMC41IDMuNyA2Ny0uNSA4OS0zLjUgOTguNS0zLjUgMTA5LjUtMy41IDEyMDAgMjRWOS41VjBIMHoiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC41Ii8+PC9zdmc+')] bg-repeat-x opacity-60 animate-wave"
              style={{ animationDuration: "7s" }}
            ></div>
          </div>

          {/* Floating text inside */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span
              className={`text-2xl font-black drop-shadow-md transition-colors duration-500 ${
                percentage > 50 ? "text-white" : "text-slate-400/50"
              }`}
            >
              {(waterIntake / 1000).toFixed(2)}L
            </span>
          </div>
        </div>
      </div>

      {/* Weekly Trend Bar Chart */}
      <div className="relative z-10 px-8 mb-4">
        <div className="flex justify-between items-end mb-3">
          <div className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp size={12} /> 7 Day Trend
          </div>
        </div>

        <div className="h-24 w-full bg-white/50 rounded-2xl border border-white p-2 shadow-sm">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={weeklyData}
              onMouseMove={(state) => setActiveBar(state.activeTooltipIndex)}
              onMouseLeave={() => setActiveBar(null)}
              barCategoryGap="2%"
            >
              <Tooltip
                cursor={{ fill: "transparent" }}
                content={<CustomTooltip />}
              />
              <XAxis
                dataKey="date"
                tick={{ fill: "#64748b", fontSize: 10, fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
                padding={{ left: 0, right: 0 }}
                dy={5}
              />
              <Bar dataKey="intake" radius={[4, 4, 4, 4]}>
                {weeklyData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      index === activeBar ? "#0891b2" : "url(#waterGradient)"
                    }
                    className="transition-all duration-300"
                  />
                ))}
              </Bar>
              <defs>
                <linearGradient id="waterGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#a5f3fc" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Footer Controls - Glassmorphism Floating Dock */}
      <div className="relative z-10 px-8 pb-6">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-2 shadow-lg border border-white/50 flex items-center justify-around gap-2">
          <button
            onClick={() => addWater(-250)}
            disabled={waterIntake === 0}
            className={`w-10 h-10 flex items-center justify-center rounded-xl transition-colors ${
              waterIntake === 0
                ? "bg-slate-100 text-slate-300 cursor-not-allowed"
                : "hover:bg-red-50 text-slate-400 hover:text-red-500"
            }`}
            title={waterIntake === 0 ? "Cannot go below 0ml" : "Subtract 250ml"}
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
