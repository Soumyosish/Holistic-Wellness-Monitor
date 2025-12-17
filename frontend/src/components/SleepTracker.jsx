import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Moon,
  Star,
  TrendingUp,
  CloudMoon,
  Clock,
  ChevronRight,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from "recharts";

function SleepTracker() {
  const [sleepData, setSleepData] = useState({
    sleepHours: 0,
    sleepQuality: 0,
  });
  const [weeklyData, setWeeklyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeBar, setActiveBar] = useState(null);

  useEffect(() => {
    fetchSleepData();
    fetchWeeklyData();
  }, []);

  const fetchSleepData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/activity/today`,
        { withCredentials: true }
      );
      setSleepData({
        sleepHours: response.data.sleepHours || 0,
        sleepQuality: response.data.sleepQuality || 0,
      });
    } catch (error) {
      console.error("Error fetching sleep data:", error);
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
        hours: s.sleepHours || 0,
        quality: s.sleepQuality || 0,
      }));

      setWeeklyData(chartData);
    } catch (error) {
      console.error("Error fetching weekly sleep data:", error);
    }
  };

  const updateSleep = async (hours, quality) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/activity/sleep`,
        { sleepHours: hours, sleepQuality: quality },
        { withCredentials: true }
      );
      setSleepData({
        sleepHours: response.data.sleepHours,
        sleepQuality: response.data.sleepQuality,
      });
      fetchWeeklyData();
    } catch (error) {
      console.error("Error updating sleep:", error);
    }
  };

  const score =
    sleepData.sleepHours >= 7
      ? "Optimal"
      : sleepData.sleepHours >= 6
      ? "Good"
      : "Low";

  // Custom Tooltip for Light Theme
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/90 backdrop-blur-md border border-indigo-100 p-3 rounded-2xl shadow-xl shadow-indigo-100/50">
          <p className="font-bold text-slate-700 mb-1">{label}</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
            <p className="text-indigo-600 font-bold text-sm">
              {payload[0].value} hrs
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  if (loading)
    return (
      <div className="h-full w-full bg-slate-50 rounded-[2.5rem] animate-pulse border border-slate-100"></div>
    );

  return (
    <div className="relative overflow-hidden bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-8 h-full min-h-[400px] flex flex-col group transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-100/50">
      {/* Decorative Gradients */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-fuchsia-100/40 rounded-full blur-[80px] -mr-16 -mt-16 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-100/40 rounded-full blur-[80px] -ml-16 -mb-16 pointer-events-none"></div>

      {/* Header */}
      <div className="flex items-center justify-between z-10 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-2xl">
              <Moon size={20} fill="currentColor" className="opacity-80" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">
              Sleep Health
            </h2>
          </div>
          <p className="text-sm font-medium text-slate-400 pl-1">
            Rest & Recovery
          </p>
        </div>

        <div className="text-right">
          <div className="flex items-baseline gap-1 justify-end">
            <span className="text-4xl font-black text-slate-800 tracking-tighter">
              {sleepData.sleepHours}
            </span>
            <span className="text-sm font-bold text-slate-400">h</span>
          </div>
          <div
            className={`text-xs font-bold px-3 py-1 rounded-full inline-block ${
              sleepData.sleepHours >= 7
                ? "bg-emerald-100 text-emerald-600"
                : "bg-amber-100 text-amber-600"
            }`}
          >
            {score} Rest
          </div>
        </div>
      </div>

      {/* Interactive Logger */}
      <div className="bg-slate-50/80 backdrop-blur-sm rounded-3xl p-5 border border-slate-100 mb-6 z-10">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Clock size={12} /> Log Last Night
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative w-24 group/input">
            <input
              type="number"
              min="0"
              step="0.5"
              defaultValue={sleepData.sleepHours}
              className="w-full bg-white text-slate-700 border border-slate-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 text-center font-bold font-mono shadow-sm transition-all"
              onBlur={(e) =>
                updateSleep(
                  Math.max(0, parseFloat(e.target.value) || 0),
                  sleepData.sleepQuality || 3
                )
              }
            />
          </div>

          <div className="flex-1 flex justify-between items-center bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => updateSleep(sleepData.sleepHours, star)}
                className={`transition-all duration-300 hover:scale-125 hover:-translate-y-1 p-1 ${
                  star <= (sleepData.sleepQuality || 0)
                    ? "text-amber-400 drop-shadow-sm"
                    : "text-slate-200 hover:text-amber-200"
                }`}
              >
                <Star
                  size={20}
                  fill={
                    star <= (sleepData.sleepQuality || 0)
                      ? "currentColor"
                      : "currentColor"
                  }
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Modern Bar Chart */}
      <div className="flex-1 min-h-[200px] flex flex-col z-10 w-full">
        <div className="flex justify-between items-end mb-4">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp size={12} /> 7 Day Trend
          </div>
        </div>

        <div className="flex-1 w-full bg-white/50 rounded-2xl border border-white p-2 shadow-sm min-h-[150px]">
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
                tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
                padding={{ left: 0, right: 0 }}
                dy={10}
              />
              <ReferenceLine
                y={8}
                stroke="#10b981"
                strokeDasharray="3 3"
                opacity={0.3}
              />
              <Bar dataKey="hours" radius={[6, 6, 6, 6]}>
                {weeklyData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index === activeBar ? "#6366f1" : "url(#barGradient)"}
                    className="transition-all duration-300"
                  />
                ))}
              </Bar>
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#c7d2fe" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default SleepTracker;
