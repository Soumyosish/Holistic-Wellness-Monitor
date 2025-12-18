import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { User, Target, TrendingUp, Edit, Activity } from "lucide-react";

function ProfileSummaryCard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/profile`,
        { withCredentials: true }
      );
      setProfile(response.data.user);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl shadow-xl p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (!profile?.profileCompleted) {
    return (
      <div className="bg-linear-to-br from-purple-50 to-pink-50 rounded-3xl shadow-xl p-6 border-2 border-purple-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-linear-to-br from-purple-500 to-pink-500 rounded-xl">
            <User className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">
            Complete Your Profile
          </h2>
        </div>
        <p className="text-gray-600 mb-4">
          Set up your health profile to get personalized recommendations and
          track your progress.
        </p>
        <button
          onClick={() => navigate("/profile")}
          className="w-full px-6 py-3 bg-linear-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all"
        >
          Complete Profile →
        </button>
      </div>
    );
  }

  const getBMICategory = (bmi) => {
    if (bmi < 18.5)
      return { text: "Underweight", color: "text-blue-600", bg: "bg-blue-50" };
    if (bmi < 25)
      return { text: "Normal", color: "text-green-600", bg: "bg-green-50" };
    if (bmi < 30)
      return {
        text: "Overweight",
        color: "text-yellow-600",
        bg: "bg-yellow-50",
      };
    return { text: "Obese", color: "text-red-600", bg: "bg-red-50" };
  };

  const bmiCategory = getBMICategory(profile.bmi);

  const goalLabels = {
    weight_loss: "Weight Loss",
    weight_loss_aggressive: "Aggressive Weight Loss",
    maintenance: "Maintain Weight",
    weight_gain: "Weight Gain",
    muscle_building: "Muscle Building",
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-linear-to-br from-purple-500 to-pink-500 rounded-xl">
            <User className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Health Profile</h2>
        </div>
        <button
          onClick={() => navigate("/profile")}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Edit Profile"
        >
          <Edit className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div
          className={`p-4 rounded-xl ${bmiCategory.bg} border-2 border-opacity-20`}
        >
          <div className="text-sm font-semibold text-gray-600 mb-1">BMI</div>
          <div className="text-3xl font-bold text-gray-800">
            {profile.bmi?.toFixed(1)}
          </div>
          <div className={`text-xs font-semibold ${bmiCategory.color} mt-1`}>
            {bmiCategory.text}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-orange-50 border-2 border-orange-200">
          <div className="text-sm font-semibold text-orange-600 mb-1">
            Daily Target
          </div>
          <div className="text-3xl font-bold text-orange-700">
            {profile.dailyCalorieTarget}
          </div>
          <div className="text-xs text-orange-600 mt-1">calories</div>
        </div>
      </div>

      {/* Goal & Activity */}
      <div className="space-y-3">
        <div className="flex items-center gap-3 p-3 bg-linear-to-r from-purple-50 to-pink-50 rounded-xl">
          <Target className="w-5 h-5 text-purple-600" />
          <div>
            <div className="text-xs text-gray-600">Current Goal</div>
            <div className="font-semibold text-gray-800">
              {goalLabels[profile.goal] || profile.goal}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-linear-to-r from-blue-50 to-cyan-50 rounded-xl">
          <Activity className="w-5 h-5 text-blue-600" />
          <div>
            <div className="text-xs text-gray-600">Activity Level</div>
            <div className="font-semibold text-gray-800 capitalize">
              {profile.activityLevel?.replace("_", " ")}
            </div>
          </div>
        </div>
      </div>

      {/* Daily Targets Summary */}
      <div className="mt-6 pt-6 border-t-2 border-gray-100">
        <div className="text-sm font-semibold text-gray-600 mb-3">
          Daily Targets
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-2 rounded-lg bg-red-50">
            <div className="text-xs text-red-600">Protein</div>
            <div className="text-lg font-bold text-red-700">
              {profile.dailyProteinTarget}g
            </div>
          </div>
          <div className="p-2 rounded-lg bg-yellow-50">
            <div className="text-xs text-yellow-600">Carbs</div>
            <div className="text-lg font-bold text-yellow-700">
              {profile.dailyCarbsTarget}g
            </div>
          </div>
          <div className="p-2 rounded-lg bg-indigo-50">
            <div className="text-xs text-indigo-600">Fats</div>
            <div className="text-lg font-bold text-indigo-700">
              {profile.dailyFatsTarget}g
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileSummaryCard;
