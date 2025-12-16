import { useState, useEffect } from "react";
import {
  User,
  Activity,
  Target,
  ChevronRight,
  Apple,
  Droplet,
  Footprints,
  Flame,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Legend,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from "recharts";
import {
  ACTIVITY_LEVELS,
  GOALS,
  DIET_TYPES,
  BUDGETS,
  getBMICategory,
} from "../utils/fitnessCalculators";

export default function UserProfile() {
  const { user, updateUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    age: "",
    height: "",
    weight: "",
    gender: "",
    activityLevel: "moderate",
    goal: "maintenance",
    targetWeight: "",
    dietType: "any",
    budget: "medium",
    allergies: [],
    dislikedFoods: [],
  });

  const [allergyInput, setAllergyInput] = useState("");
  const [dislikedFoodInput, setDislikedFoodInput] = useState("");

  const [calculatedMetrics, setCalculatedMetrics] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        age: user.age || "",
        height: user.height || "",
        weight: user.weight || "",
        gender: user.gender || "",
        activityLevel: user.activityLevel || "moderate",
        goal: user.goal || "maintenance",
        targetWeight: user.targetWeight || "",
        dietType: user.preferences?.dietType || "any",
        budget: user.preferences?.budget || "medium",
        allergies: user.preferences?.allergies || [],
        dislikedFoods: user.preferences?.dislikedFoods || [],
      });

      if (user.bmi) {
        setCalculatedMetrics({
          bmi: user.bmi,
          bmr: user.bmr,
          tdee: user.tdee,
          idealWeight: user.idealWeight,
          dailyCalorieTarget: user.dailyCalorieTarget,
          dailyProteinTarget: user.dailyProteinTarget,
          dailyCarbsTarget: user.dailyCarbsTarget,
          dailyFatsTarget: user.dailyFatsTarget,
          dailyWaterGoal: user.dailyWaterGoal,
          dailyStepGoal: user.dailyStepGoal,
        });
      }

      // Check if profile is complete based on flag OR presence of data
      if (user.profileCompleted || (user.age && user.height && user.weight && user.gender)) {
        setCurrentStep(4);
      }
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addAllergy = () => {
    if (
      allergyInput.trim() &&
      !formData.allergies.includes(allergyInput.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        allergies: [...prev.allergies, allergyInput.trim()],
      }));
      setAllergyInput("");
    }
  };

  const removeAllergy = (allergy) => {
    setFormData((prev) => ({
      ...prev,
      allergies: prev.allergies.filter((a) => a !== allergy),
    }));
  };

  const addDislikedFood = () => {
    if (
      dislikedFoodInput.trim() &&
      !formData.dislikedFoods.includes(dislikedFoodInput.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        dislikedFoods: [...prev.dislikedFoods, dislikedFoodInput.trim()],
      }));
      setDislikedFoodInput("");
    }
  };

  const removeDislikedFood = (food) => {
    setFormData((prev) => ({
      ...prev,
      dislikedFoods: prev.dislikedFoods.filter((f) => f !== food),
    }));
  };

  const nextStep = () => {
    if (currentStep === 1) {
      if (
        !formData.age ||
        !formData.height ||
        !formData.weight ||
        !formData.gender
      ) {
        alert("Please fill in all basic information fields");
        return;
      }
    }
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => setCurrentStep((prev) => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/profile`,
        {
          age: parseInt(formData.age),
          height: parseFloat(formData.height),
          weight: parseFloat(formData.weight),
          gender: formData.gender,
          activityLevel: formData.activityLevel,
          goal: formData.goal,
          targetWeight: formData.targetWeight
            ? parseFloat(formData.targetWeight)
            : undefined,
          preferences: {
            dietType: formData.dietType,
            budget: formData.budget,
            allergies: formData.allergies,
            dislikedFoods: formData.dislikedFoods,
          },
        },
        { withCredentials: true }
      );

      if (response.data.user) {
        updateUser(response.data.user);
        setCalculatedMetrics({
          bmi: response.data.user.bmi,
          bmr: response.data.user.bmr,
          tdee: response.data.user.tdee,
          idealWeight: response.data.user.idealWeight,
          dailyCalorieTarget: response.data.user.dailyCalorieTarget,
          dailyProteinTarget: response.data.user.dailyProteinTarget,
          dailyCarbsTarget: response.data.user.dailyCarbsTarget,
          dailyFatsTarget: response.data.user.dailyFatsTarget,
          dailyWaterGoal: response.data.user.dailyWaterGoal,
          dailyStepGoal: response.data.user.dailyStepGoal,
        });
        setCurrentStep(4); // Show results
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // Custom Highlight Tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-xl shadow-lg border border-slate-100 animate-fade-in-up">
          <p className="font-bold text-slate-800">{payload[0].name}</p>
          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: payload[0].fill }}
            ></div>
            <p className="text-indigo-600 font-medium">
              {payload[0].value} {payload[0].payload.unit || ""}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 py-10 px-4 transition-colors duration-500 relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Header - Clean & Minimal */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Your Health Profile
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Personalized insights and daily targets to help you reach your peak
            performance.
          </p>
        </div>

        {/* Progress Steps (Only show if editing) */}
        {currentStep <= 3 && (
          <div className="flex justify-center mb-10">
            <div className="flex items-center space-x-4">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    currentStep >= step
                      ? "bg-indigo-600 scale-125"
                      : "bg-slate-300"
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Steps 1-3 Form Container */}
          {currentStep <= 3 && (
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 md:p-12 transition-all duration-500">
              {/* Step 1: Basic Info */}
              {currentStep === 1 && (
                <div className="space-y-8 animate-fade-in-up">
                  <div className="flex items-center gap-4 mb-8">
                    <span className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                      <User size={24} />
                    </span>
                    <h2 className="text-2xl font-bold text-slate-800">
                      Basic Details
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">
                        Age
                      </label>
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">
                        Gender
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none bg-white"
                        required
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">
                        Height (cm)
                      </label>
                      <input
                        type="number"
                        name="height"
                        value={formData.height}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">
                        Weight (kg)
                      </label>
                      <input
                        type="number"
                        name="weight"
                        value={formData.weight}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-6">
                    <button
                      type="button"
                      onClick={nextStep}
                      className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-indigo-200"
                    >
                      Next Step
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Activity/Goal */}
              {currentStep === 2 && (
                <div className="space-y-8 animate-fade-in-up">
                  <div className="flex items-center gap-4 mb-8">
                    <span className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                      <Target size={24} />
                    </span>
                    <h2 className="text-2xl font-bold text-slate-800">
                      Activity & Goals
                    </h2>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-3">
                        Activity Level
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {Object.entries(ACTIVITY_LEVELS).map(
                          ([key, { label, description }]) => (
                            <label
                              key={key}
                              className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${
                                formData.activityLevel === key
                                  ? "border-emerald-500 bg-emerald-50/50"
                                  : "border-slate-100 hover:border-slate-200"
                              }`}
                            >
                              <input
                                type="radio"
                                name="activityLevel"
                                value={key}
                                checked={formData.activityLevel === key}
                                onChange={handleInputChange}
                                className="hidden"
                              />
                              <div className="font-semibold text-slate-800">
                                {label}
                              </div>
                              <p className="text-xs text-slate-500 mt-1">
                                {description}
                              </p>
                            </label>
                          )
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-3">
                        Goal
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {Object.entries(GOALS).map(
                          ([key, { label, icon: Icon }]) => (
                            <label
                              key={key}
                              className={`flex items-center gap-3 cursor-pointer p-4 rounded-xl border-2 transition-all ${
                                formData.goal === key
                                  ? "border-emerald-500 bg-emerald-50/50"
                                  : "border-slate-100 hover:border-slate-200"
                              }`}
                            >
                              <input
                                type="radio"
                                name="goal"
                                value={key}
                                checked={formData.goal === key}
                                onChange={handleInputChange}
                                className="hidden"
                              />
                              <Icon
                                className={
                                  formData.goal === key
                                    ? "text-emerald-500"
                                    : "text-slate-400"
                                }
                                size={20}
                              />
                              <div className="font-semibold text-slate-800">
                                {label}
                              </div>
                            </label>
                          )
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-6">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="px-6 py-3 text-slate-500 font-semibold hover:text-slate-700"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={nextStep}
                      className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-indigo-200"
                    >
                      Next Step
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Preferences */}
              {currentStep === 3 && (
                <div className="space-y-8 animate-fade-in-up">
                  <div className="flex items-center gap-4 mb-8">
                    <span className="p-3 bg-orange-50 text-orange-600 rounded-xl">
                      <Apple size={24} />
                    </span>
                    <h2 className="text-2xl font-bold text-slate-800">
                      Diet Preferences
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">
                        Diet Type
                      </label>
                      <select
                        name="dietType"
                        value={formData.dietType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none bg-white"
                      >
                        {Object.entries(DIET_TYPES).map(([key, label]) => (
                          <option key={key} value={key}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">
                        Budget
                      </label>
                      <select
                        name="budget"
                        value={formData.budget}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none bg-white"
                      >
                        {Object.entries(BUDGETS).map(([key, label]) => (
                          <option key={key} value={key}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">
                        Allergies
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={allergyInput}
                          onChange={(e) => setAllergyInput(e.target.value)}
                          onKeyPress={(e) =>
                            e.key === "Enter" &&
                            (e.preventDefault(), addAllergy())
                          }
                          className="flex-1 px-4 py-2 rounded-xl border border-slate-200 outline-none"
                          placeholder="Add allergy..."
                        />
                        <button
                          type="button"
                          onClick={addAllergy}
                          className="px-4 py-2 bg-slate-100 rounded-xl hover:bg-slate-200"
                        >
                          +
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.allergies.map((a, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-sm font-medium flex items-center gap-1"
                          >
                            {a}{" "}
                            <button
                              type="button"
                              onClick={() => removeAllergy(a)}
                              className="hover:text-red-800"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">
                        Dislikes
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={dislikedFoodInput}
                          onChange={(e) => setDislikedFoodInput(e.target.value)}
                          onKeyPress={(e) =>
                            e.key === "Enter" &&
                            (e.preventDefault(), addDislikedFood())
                          }
                          className="flex-1 px-4 py-2 rounded-xl border border-slate-200 outline-none"
                          placeholder="Add dislike..."
                        />
                        <button
                          type="button"
                          onClick={addDislikedFood}
                          className="px-4 py-2 bg-slate-100 rounded-xl hover:bg-slate-200"
                        >
                          +
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.dislikedFoods.map((f, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm font-medium flex items-center gap-1"
                          >
                            {f}{" "}
                            <button
                              type="button"
                              onClick={() => removeDislikedFood(f)}
                              className="hover:text-slate-800"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-6">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="px-6 py-3 text-slate-500 font-semibold hover:text-slate-700"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-indigo-200"
                    >
                      {loading ? "Calculations..." : "Generate Profile"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 4: RESULTS DASHBOARD (Chart Heavy) */}
          {currentStep === 4 && calculatedMetrics && (
            <div className="space-y-8 animate-fade-in-up">
              {/* Top Row: Key Charts */}
              <div className="flex justify-end mb-4">
                 <button 
                   onClick={() => setCurrentStep(1)}
                   className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors font-medium shadow-sm"
                 >
                   <span>Edit Profile</span>
                   <ChevronRight size={16} />
                 </button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 1. BMI Radial Gauge */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center justify-center relative overflow-hidden">
                  <h3 className="text-slate-500 font-semibold mb-2 uppercase tracking-wider text-xs z-10">
                    Body Mass Index
                  </h3>
                  <div className="h-[220px] w-full flex justify-center items-center z-10 relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadialBarChart
                        innerRadius="70%"
                        outerRadius="100%"
                        data={[
                          {
                            name: "BMI",
                            value: calculatedMetrics.bmi,
                            fill: getBMICategory(
                              calculatedMetrics.bmi
                            ).color.includes("green")
                              ? "#10b981"
                              : getBMICategory(
                                  calculatedMetrics.bmi
                                ).color.includes("yellow")
                              ? "#f59e0b"
                              : "#ef4444",
                          },
                        ]}
                        startAngle={180}
                        endAngle={0}
                        cy="70%"
                      >
                        <RadialBar
                          minAngle={15}
                          background
                          clockWise={true}
                          dataKey="value"
                          cornerRadius={10}
                        />
                        <PolarAngleAxis
                          type="number"
                          domain={[0, 40]}
                          angleAxisId={0}
                          tick={false}
                        />
                        <RechartsTooltip
                          cursor={false}
                          content={<CustomTooltip />}
                        />
                      </RadialBarChart>
                    </ResponsiveContainer>
                    <div className="absolute top-[60%] left-1/2 transform -translate-x-1/2 -translate-y-[50%] text-center">
                      <span className="text-5xl font-extrabold text-slate-800 tracking-tighter">
                        {calculatedMetrics.bmi}
                      </span>
                      <p
                        className={`text-sm font-bold mt-1 uppercase tracking-wide ${
                          getBMICategory(calculatedMetrics.bmi).color
                        }`}
                      >
                        {getBMICategory(calculatedMetrics.bmi).text}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 2. Macros Donut Chart */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center justify-center lg:col-span-1">
                  <h3 className="text-slate-500 font-semibold mb-2 uppercase tracking-wider text-xs">
                    Macro Distribution
                  </h3>
                  <div className="h-[220px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            {
                              name: "Protein",
                              value: calculatedMetrics.dailyProteinTarget,
                              unit: "g",
                              color: "#10b981",
                            },
                            {
                              name: "Carbs",
                              value: calculatedMetrics.dailyCarbsTarget,
                              unit: "g",
                              color: "#f59e0b",
                            },
                            {
                              name: "Fats",
                              value: calculatedMetrics.dailyFatsTarget,
                              unit: "g",
                              color: "#6366f1",
                            },
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {[
                            { color: "#10b981" },
                            { color: "#f59e0b" },
                            { color: "#6366f1" },
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip content={<CustomTooltip />} />
                        <Legend
                          verticalAlign="bottom"
                          height={36}
                          iconType="circle"
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 3. BMR & Ideal Weight Summary */}
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                        BMR
                      </p>
                      <p className="text-4xl font-extrabold text-slate-800">
                        {calculatedMetrics.bmr}
                      </p>
                      <p className="text-sm text-slate-500 font-medium">
                        kcal / day
                      </p>
                    </div>
                    <div className="h-14 w-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                      <Activity size={28} />
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                        Ideal Weight
                      </p>
                      <p className="text-4xl font-extrabold text-slate-800">
                        {calculatedMetrics.idealWeight}
                      </p>
                      <p className="text-sm text-slate-500 font-medium">kg</p>
                    </div>
                    <div className="h-14 w-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                      <Target size={28} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Row: Detailed Targets Card Blocks */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Daily Calorie Target */}
                <div className="bg-orange-500 rounded-3xl p-6 text-white shadow-xl shadow-orange-500/20 transform hover:-translate-y-1 transition-transform">
                  <div className="flex justify-between items-start mb-6">
                    <span className="p-3 bg-white/20 rounded-2xl">
                      <Flame size={24} />
                    </span>
                    <span className="text-xs font-extrabold bg-white/20 px-3 py-1 rounded-full uppercase tracking-wide">
                      Target
                    </span>
                  </div>
                  <div className="text-4xl font-extrabold mb-1">
                    {calculatedMetrics.dailyCalorieTarget}
                  </div>
                  <div className="text-sm font-medium opacity-90">
                    Calories / day
                  </div>
                </div>

                {/* Daily Water Goal */}
                <div className="bg-cyan-500 rounded-3xl p-6 text-white shadow-xl shadow-cyan-500/20 transform hover:-translate-y-1 transition-transform">
                  <div className="flex justify-between items-start mb-6">
                    <span className="p-3 bg-white/20 rounded-2xl">
                      <Droplet size={24} />
                    </span>
                    <span className="text-xs font-extrabold bg-white/20 px-3 py-1 rounded-full uppercase tracking-wide">
                      Goal
                    </span>
                  </div>
                  <div className="text-4xl font-extrabold mb-1">
                    {(calculatedMetrics.dailyWaterGoal / 1000).toFixed(1)}
                  </div>
                  <div className="text-sm font-medium opacity-90">
                    Liters / day
                  </div>
                </div>

                {/* Daily Step Goal */}
                <div className="bg-emerald-500 rounded-3xl p-6 text-white shadow-xl shadow-emerald-500/20 transform hover:-translate-y-1 transition-transform">
                  <div className="flex justify-between items-start mb-6">
                    <span className="p-3 bg-white/20 rounded-2xl">
                      <Footprints size={24} />
                    </span>
                    <span className="text-xs font-extrabold bg-white/20 px-3 py-1 rounded-full uppercase tracking-wide">
                      Active
                    </span>
                  </div>
                  <div className="text-4xl font-extrabold mb-1">
                    {(calculatedMetrics.dailyStepGoal / 1000).toFixed(0)}k
                  </div>
                  <div className="text-sm font-medium opacity-90">
                    Steps / day
                  </div>
                </div>

                {/* Macro Summary - Clean List */}
                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-center gap-4">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm font-bold text-slate-600">
                      <div className="w-2 h-2 rounded-full bg-emerald-500"></div>{" "}
                      Protein
                    </span>
                    <span className="font-bold text-slate-800">
                      {calculatedMetrics.dailyProteinTarget}g
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm font-bold text-slate-600">
                      <div className="w-2 h-2 rounded-full bg-amber-500"></div>{" "}
                      Carbs
                    </span>
                    <span className="font-bold text-slate-800">
                      {calculatedMetrics.dailyCarbsTarget}g
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm font-bold text-slate-600">
                      <div className="w-2 h-2 rounded-full bg-indigo-500"></div>{" "}
                      Fats
                    </span>
                    <span className="font-bold text-slate-800">
                      {calculatedMetrics.dailyFatsTarget}g
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-6 mt-12 pb-12">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-8 py-4 bg-white text-slate-600 font-bold rounded-2xl border-2 border-slate-100 hover:border-indigo-100 hover:text-indigo-600 hover:shadow-lg transition-all duration-300 min-w-[200px]"
                >
                  Edit Profile
                </button>
                <button
                  type="button"
                  onClick={() => (window.location.href = "/dashboard")}
                  className="px-10 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-500/30 transform hover:-translate-y-1 transition-all duration-300 min-w-[240px] shadow-lg shadow-indigo-900/10 flex items-center justify-center gap-3"
                >
                  Go to Dashboard <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
