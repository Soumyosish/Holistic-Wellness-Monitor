import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Utensils,
  Plus,
  ChevronRight,
  Coffee,
  Sun,
  Moon,
  Cookie,
  Flame,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useAuth } from "../contexts/AuthContext";

const MEAL_ICONS = {
  breakfast: Coffee,
  lunch: Sun,
  dinner: Moon,
  snack: Cookie,
};

const COLORS = {
  protein: "#10b981", // Emerald 500
  carbs: "#f59e0b", // Amber 500
  fats: "#f43f5e", // Rose 500
};

function TodaysMeals() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [meals, setMeals] = useState([]);
  const [totals, setTotals] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodaysMeals();
  }, []);

  const fetchTodaysMeals = async () => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/meals?date=${today}`,
        { withCredentials: true }
      );
      setMeals(response.data.meals || []);
      setTotals(
        response.data.totals || { calories: 0, protein: 0, carbs: 0, fats: 0 }
      );
    } catch (error) {
      console.error("Error fetching meals:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="h-full w-full bg-slate-50 rounded-[2.5rem] animate-pulse border border-slate-100"></div>
    );

  const calorieGoal = user?.dailyCalorieTarget || 2000;
  const remaining = Math.max(0, calorieGoal - totals.calories);

  // Calculate calories from macros
  const macroCalories = totals.protein * 4 + totals.carbs * 4 + totals.fats * 9;
  // Calculate "Other" calories (e.g. from alcohol or missing macro data)
  const otherCalories = Math.max(0, totals.calories - macroCalories);

  // Create chart data showing only consumed calories (no "Remaining" slice)
  // The pie will naturally show progress as it fills up toward the goal
  const consumedData = [
    { name: "Protein", value: totals.protein * 4, color: COLORS.protein },
    { name: "Carbs", value: totals.carbs * 4, color: COLORS.carbs },
    { name: "Fats", value: totals.fats * 9, color: COLORS.fats },
  ];

  // Filter out zero values for cleaner display
  const chartData = consumedData.filter((item) => item.value > 0);

  // If no data, show a minimal placeholder
  if (chartData.length === 0) {
    chartData.push({ name: "Empty", value: 1, color: "#f1f5f9" });
  }

  // Add "Other" calories if present
  if (otherCalories > 0) {
    chartData.push({ name: "Other", value: otherCalories, color: "#94a3b8" });
  }

  // Calculate percentage of goal achieved
  const percentComplete = Math.min(
    100,
    Math.round((totals.calories / calorieGoal) * 100)
  );

  return (
    <div className="relative overflow-hidden bg-white rounded-[2.5rem] p-6 shadow-xl shadow-slate-200/50 border border-slate-100 h-full flex flex-col transition-all duration-500 hover:shadow-2xl hover:shadow-orange-100/40">
      {/* Organic Gradient Orbs */}
      <div className="absolute -top-10 -right-10 w-48 h-48 bg-orange-100/40 rounded-full blur-[60px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] -left-5 w-32 h-32 bg-emerald-100/30 rounded-full blur-2xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex items-center justify-between z-10 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-linear-to-br from-orange-400 to-amber-500 rounded-2xl shadow-lg shadow-orange-200 text-white">
            <Utensils className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800 leading-tight">
              Nutrition
            </h2>
            <div className="text-xs font-medium text-slate-400 flex items-center gap-1">
              Target: {calorieGoal} kcal
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate("/meals")}
          className="p-2 hover:bg-slate-50 rounded-full text-slate-400 hover:text-orange-500 transition-colors"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Main Content Split */}
      <div className="flex flex-col sm:flex-row gap-6 z-10 flex-1">
        {/* Left: Chart & Stats */}
        <div className="flex-1 flex flex-col items-center justify-center relative">
          <div className="w-40 h-40 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  innerRadius={60}
                  outerRadius={75}
                  paddingAngle={totals.calories > 0 ? 2 : 0}
                  dataKey="value"
                  cornerRadius={8}
                  stroke="none"
                  startAngle={90}
                  endAngle={
                    90 - 360 * Math.min(totals.calories / calorieGoal, 1)
                  }
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                  itemStyle={{ fontSize: "12px", fontWeight: "bold" }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Background ring to show total goal */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[150px] h-[150px] rounded-full border-15 border-slate-100/60"></div>
            </div>

            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-slate-800">
                {Math.round(totals.calories)}
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Kcal
              </span>
            </div>
          </div>

          {/* Macro Legend */}
          <div className="flex gap-4 mt-2">
            <div className="text-center">
              <div className="w-2 h-2 rounded-full bg-emerald-500 mx-auto mb-1"></div>
              <div className="text-xs font-bold text-slate-700">
                {Math.round(totals.protein)}g
              </div>
              <div className="text-[10px] text-slate-400">Pro</div>
            </div>
            <div className="text-center">
              <div className="w-2 h-2 rounded-full bg-amber-500 mx-auto mb-1"></div>
              <div className="text-xs font-bold text-slate-700">
                {Math.round(totals.carbs)}g
              </div>
              <div className="text-[10px] text-slate-400">Carb</div>
            </div>
            <div className="text-center">
              <div className="w-2 h-2 rounded-full bg-rose-500 mx-auto mb-1"></div>
              <div className="text-xs font-bold text-slate-700">
                {Math.round(totals.fats)}g
              </div>
              <div className="text-[10px] text-slate-400">Fat</div>
            </div>
          </div>
        </div>

        {/* Right: Recent Meals List */}
        <div className="flex-1 flex flex-col gap-3 min-w-[200px]">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
            Recent
          </div>

          {meals.length > 0 ? (
            <div className="flex flex-col gap-3">
              {meals.slice(0, 3).map((meal) => {
                const Icon = MEAL_ICONS[meal.type] || Utensils;
                return (
                  <div
                    key={meal._id}
                    className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-50/80 border border-slate-100 hover:bg-white hover:shadow-md hover:border-orange-100 transition-all group cursor-pointer"
                    onClick={() => navigate("/meals")}
                  >
                    <div className="p-2 bg-white rounded-xl shadow-sm text-slate-400 group-hover:text-orange-500 transition-colors">
                      <Icon size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-slate-700 truncate">
                        {meal.name}
                      </div>
                      <div className="text-[10px] font-medium text-slate-400">
                        {Math.round(meal.calories)} kcal
                      </div>
                    </div>
                  </div>
                );
              })}
              {meals.length < 3 && (
                <button
                  onClick={() => navigate("/meals")}
                  className="flex items-center gap-2 p-2.5 rounded-2xl border border-dashed border-slate-200 text-slate-400 hover:text-orange-500 hover:border-orange-200 hover:bg-orange-50 transition-all justify-center text-xs font-bold"
                >
                  <Plus size={14} /> Log another meal
                </button>
              )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <div className="p-3 bg-white rounded-full shadow-sm mb-2 text-slate-300">
                <Utensils size={20} />
              </div>
              <p className="text-xs font-medium text-slate-400 mb-3">
                No meals logged today
              </p>
              <button
                onClick={() => navigate("/meals")}
                className="px-4 py-2 bg-slate-800 text-white text-xs font-bold rounded-xl hover:bg-orange-500 transition-colors shadow-lg shadow-slate-200"
              >
                Add Meal
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TodaysMeals;
