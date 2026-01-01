import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Dumbbell,
  Plus,
  Search,
  Calendar,
  Trash2,
  Clock,
  Flame,
  ChevronRight,
  Activity,
  Trophy,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";

function WorkoutTracker() {
  const [workouts, setWorkouts] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // New Workout State
  const [newWorkout, setNewWorkout] = useState({
    name: "",
    duration: "",
    intensity: "medium",
    type: "strength",
    exercises: [],
  });

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/workouts`,
        { withCredentials: true }
      );
      setWorkouts(response.data);
    } catch (error) {
      console.error("Error fetching workouts:", error);
    } finally {
      setLoading(false);
    }
  };

  const searchExercises = async (query) => {
    if (!query) return;
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/workouts/exercises?query=${query}`,
        { withCredentials: true }
      );
      setExercises(response.data);
    } catch (error) {
      console.error("Error searching exercises:", error);
    }
  };

  const handleCreateWorkout = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/workouts`,
        newWorkout,
        { withCredentials: true }
      );
      setShowAddModal(false);
      fetchWorkouts();
      setNewWorkout({
        name: "",
        duration: "",
        intensity: "medium",
        type: "strength",
        exercises: [],
      });
    } catch (error) {
      console.error("Error creating workout:", error);
    }
  };

  const deleteWorkout = async (id) => {
    if (!confirm("Delete this workout?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/workouts/${id}`, {
        withCredentials: true,
      });
      fetchWorkouts();
    } catch (error) {
      console.error("Error deleting workout:", error);
    }
  };

  const getTotalMinutes = () => {
    return workouts.reduce((acc, curr) => acc + (parseInt(curr.duration) || 0), 0);
  };

  const getTotalCalories = () => {
    return workouts.reduce((acc, curr) => acc + (parseInt(curr.caloriesBurned) || 0), 0);
  };

  if (loading)
    return (
      <div className="min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-indigo-500 animate-pulse font-medium text-lg">
          Loading your fitness journey...
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-800 tracking-tight mb-2">
              Workout Tracker
            </h1>
            <p className="text-slate-500 font-medium text-lg">
              Every step, every rep, bringing you closer to your goals.
            </p>
          </div>
          <div className="flex gap-4">
             <Link
              to="/dashboard"
              className="px-6 py-3 bg-white text-slate-600 font-bold rounded-2xl shadow-sm hover:shadow-md transition-all border border-slate-100 flex items-center gap-2"
            >
              Back to Dashboard
            </Link>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-8 py-3 bg-linear-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:scale-105 transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Log Activity
            </button>
          </div>
        </div>

        {/* Highlight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/80 backdrop-blur-xl rounded-4xl p-6 border border-white shadow-xl shadow-slate-200/50">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl">
                <Trophy className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                  Total Workouts
                </p>
                <h3 className="text-3xl font-black text-slate-700">
                  {workouts.length}
                </h3>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-4xl p-6 border border-white shadow-xl shadow-slate-200/50">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-fuchsia-50 text-fuchsia-600 rounded-2xl">
                <Clock className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                  Active Minutes
                </p>
                <h3 className="text-3xl font-black text-slate-700">
                  {getTotalMinutes()}
                </h3>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-4xl p-6 border border-white shadow-xl shadow-slate-200/50">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-orange-50 text-orange-600 rounded-2xl">
                <Flame className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                  Calories Burned
                </p>
                <h3 className="text-3xl font-black text-slate-700">
                  {getTotalCalories()}
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-700 flex items-center gap-2">
            <Activity className="w-6 h-6 text-indigo-500" />
            Recent Activity
          </h2>

          <div className="space-y-4">
            {workouts.length === 0 ? (
              <div className="text-center py-20 bg-white/60 backdrop-blur-md rounded-[2.5rem] border border-white shadow-sm">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Dumbbell className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-700 mb-2">
                  Quiet lately...
                </h3>
                <p className="text-slate-500 max-w-md mx-auto">
                  Your fitness journey begins with a single step. Log your first
                  workout today!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {workouts.map((workout) => (
                  <div
                    key={workout._id}
                    className="group bg-white/70 backdrop-blur-md hover:bg-white transition-all duration-300 p-6 rounded-4xl border border-white shadow-sm hover:shadow-xl hover:shadow-indigo-100/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                  >
                    <div className="flex items-center gap-5">
                      <div
                        className={`p-4 rounded-2xl shrink-0 ${
                          workout.type === "cardio"
                            ? "bg-orange-50 text-orange-500"
                            : workout.type === "strength"
                            ? "bg-indigo-50 text-indigo-500"
                            : workout.type === "hiit"
                            ? "bg-rose-50 text-rose-500"
                            : "bg-emerald-50 text-emerald-500"
                        }`}
                      >
                        {workout.type === "cardio" ? (
                          <Flame className="w-6 h-6" />
                        ) : workout.type === "strength" ? (
                          <Dumbbell className="w-6 h-6" />
                        ) : (
                          <Zap className="w-6 h-6" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-700 mb-1 group-hover:text-indigo-600 transition-colors">
                          {workout.name}
                        </h3>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-medium text-slate-400">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            {new Date(workout.date).toLocaleDateString(undefined, {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                          <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            {workout.duration} min
                          </span>
                          <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                          <span className="flex items-center gap-1.5 text-orange-400">
                            <Flame className="w-4 h-4" />
                            {workout.caloriesBurned} cal
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0">
                      <div className="flex-1 sm:flex-none text-center sm:text-right px-4 py-2 bg-slate-50 rounded-xl">
                        <span className="text-xs font-bold text-slate-400 uppercase block">
                          Intensity
                        </span>
                        <span
                          className={`font-bold capitalize ${
                            workout.intensity === "high"
                              ? "text-rose-500"
                              : workout.intensity === "medium"
                              ? "text-amber-500"
                              : "text-emerald-500"
                          }`}
                        >
                          {workout.intensity}
                        </span>
                      </div>
                      <button
                        onClick={() => deleteWorkout(workout._id)}
                        className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                        title="Delete Workout"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modern Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity"
            onClick={() => setShowAddModal(false)}
          ></div>
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden relative z-10 animate-in fade-in zoom-in duration-300">
            <div className="p-8 border-b border-slate-50 bg-slate-50/50">
              <h2 className="text-2xl font-black text-slate-800">
                Log New Workout
              </h2>
              <p className="text-slate-500">Record your latest session</p>
            </div>

            <form onSubmit={handleCreateWorkout} className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Workout Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Morning Run, Upper Body Power"
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 text-slate-700 font-medium focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300"
                  value={newWorkout.name}
                  onChange={(e) =>
                    setNewWorkout({ ...newWorkout, name: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Duration (min)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      min="1"
                      className="w-full px-5 py-4 pl-12 rounded-2xl bg-slate-50 border border-slate-100 text-slate-700 font-medium focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
                      value={newWorkout.duration}
                      onChange={(e) =>
                        setNewWorkout({
                          ...newWorkout,
                          duration: e.target.value,
                        })
                      }
                    />
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Type
                  </label>
                  <div className="relative">
                    <select
                      className="w-full px-5 py-4 pl-12 appearance-none rounded-2xl bg-slate-50 border border-slate-100 text-slate-700 font-medium focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
                      value={newWorkout.type}
                      onChange={(e) =>
                        setNewWorkout({ ...newWorkout, type: e.target.value })
                      }
                    >
                      <option value="strength">Strength</option>
                      <option value="cardio">Cardio</option>
                      <option value="hiit">HIIT</option>
                      <option value="flexibility">Flexibility</option>
                      <option value="sport">Sport</option>
                      <option value="yoga">Yoga</option>
                    </select>
                    <Activity className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Intensity Level
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {["low", "medium", "high"].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() =>
                        setNewWorkout({ ...newWorkout, intensity: level })
                      }
                      className={`py-3 rounded-xl font-bold capitalize transition-all ${
                        newWorkout.intensity === level
                          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                          : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-4 text-slate-500 font-bold hover:bg-slate-50 rounded-2xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-2 py-4 bg-linear-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-2xl shadow-xl shadow-indigo-200 hover:shadow-2xl hover:scale-[1.02] transition-all"
                >
                  Save Workout
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default WorkoutTracker;
