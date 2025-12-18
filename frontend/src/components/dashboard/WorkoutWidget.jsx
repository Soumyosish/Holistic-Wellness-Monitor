import React, { useState, useEffect } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useNavigate } from "react-router-dom";
import { Dumbbell, ArrowRight, Activity } from "lucide-react";

function WorkoutWidget() {
  const [workoutData, setWorkoutData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/workouts`,
        { withCredentials: true }
      );
      processWorkoutData(response.data);
    } catch (error) {
      console.error("Error fetching workouts:", error);
    } finally {
      setLoading(false);
    }
  };

  const processWorkoutData = (workouts) => {
    const typeCount = {};
    workouts.forEach((workout) => {
      const type = workout.type || "other";
      typeCount[type] = (typeCount[type] || 0) + 1;
    });

    const data = Object.keys(typeCount).map((type) => ({
      name: type.charAt(0).toUpperCase() + type.slice(1),
      value: typeCount[type],
    }));

    setWorkoutData(data);
  };

  const COLORS = ["#6366f1", "#ec4899", "#8b5cf6", "#f43f5e", "#10b981"];

  if (loading)
    return (
      <div className="h-full w-full bg-slate-50 rounded-[2.5rem] animate-pulse border border-slate-100 min-h-[400px]"></div>
    );

  return (
    <div
      onClick={() => navigate("/workouts")}
      className="relative overflow-hidden bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-8 h-full min-h-[400px] flex flex-col cursor-pointer group transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-100/50 hover:scale-[1.02]"
    >
      {/* Decorative Gradients */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full blur-[80px] -mr-16 -mt-16 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-fuchsia-50/50 rounded-full blur-[80px] -ml-16 -mb-16 pointer-events-none"></div>

      {/* Header */}
      <div className="flex items-center justify-between z-10 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl shadow-inner shadow-indigo-100">
            <Dumbbell size={24} className="stroke-[2.5px]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">
              Workouts
            </h2>
            <p className="text-sm font-medium text-slate-400">Activity Split</p>
          </div>
        </div>
        <div className="p-2 bg-slate-50 text-slate-300 rounded-full group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
          <ArrowRight size={20} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10">
        {workoutData.length > 0 ? (
          <div className="w-full h-64 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={workoutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {workoutData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      className="drop-shadow-sm"
                    />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white/90 backdrop-blur-xl border border-slate-100 p-3 rounded-2xl shadow-xl">
                          <p className="font-bold text-slate-700">
                            {payload[0].name}
                          </p>
                          <p className="text-indigo-600 text-sm font-bold">
                            {payload[0].value} Workouts
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Label */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <Activity className="w-8 h-8 text-slate-300 mx-auto mb-1" />
            </div>
          </div>
        ) : (
          <div className="text-center text-slate-400 py-10">
            <Dumbbell className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>No workouts logged yet</p>
          </div>
        )}

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-3 mt-4">
          {workoutData.slice(0, 3).map((entry, index) => (
            <div
              key={index}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100"
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              ></span>
              {entry.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default WorkoutWidget;
