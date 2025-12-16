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
} from "lucide-react";

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

  if (loading)
    return <div className="p-8 text-center">Loading workouts...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Workout Tracker</h1>
          <p className="text-gray-600">Log your fitness activity</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-6 py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Log Workout
        </button>
      </div>

      {/* Workouts List */}
      <div className="space-y-4">
        {workouts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl shadow-sm border border-gray-100">
            <Dumbbell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800">
              No workouts logged
            </h3>
            <p className="text-gray-500 mt-2">
              Start tracking to see your progress!
            </p>
          </div>
        ) : (
          workouts.map((workout) => (
            <div
              key={workout._id}
              className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-4">
                  <div
                    className={`p-4 rounded-xl ${
                      workout.type === "cardio"
                        ? "bg-orange-50 text-orange-600"
                        : workout.type === "strength"
                        ? "bg-blue-50 text-blue-600"
                        : "bg-purple-50 text-purple-600"
                    }`}
                  >
                    {workout.type === "cardio" ? (
                      <Flame className="w-6 h-6" />
                    ) : (
                      <Dumbbell className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {workout.name}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(workout.date).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {workout.duration} min
                      </span>
                      <span className="flex items-center gap-1 text-orange-500 font-medium">
                        <Flame className="w-4 h-4" />
                        {workout.caloriesBurned} cal
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => deleteWorkout(workout._id)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Check Task Status Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Log Workout</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <XCircle className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleCreateWorkout} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Workout Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Morning Run, Leg Day"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  value={newWorkout.name}
                  onChange={(e) =>
                    setNewWorkout({ ...newWorkout, name: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (min)
                  </label>
                  <input
                    type="number"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={newWorkout.duration}
                    onChange={(e) =>
                      setNewWorkout({ ...newWorkout, duration: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
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
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Intensity
                </label>
                <div className="flex gap-2">
                  {["low", "medium", "high"].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() =>
                        setNewWorkout({ ...newWorkout, intensity: level })
                      }
                      className={`flex-1 py-2 rounded-lg capitalize ${
                        newWorkout.intensity === level
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-4 bg-linear-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
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

function XCircle({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="15" y1="9" x2="9" y2="15"></line>
      <line x1="9" y1="9" x2="15" y2="15"></line>
    </svg>
  );
}

export default WorkoutTracker;
