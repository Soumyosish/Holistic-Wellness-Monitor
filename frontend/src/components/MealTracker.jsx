import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  Plus, 
  Search, 
  Trash2, 
  Edit2, 
  Coffee, 
  Sun, 
  Moon, 
  Cookie,
  X,
  Save
} from "lucide-react";

const MEAL_TYPES = {
  breakfast: { label: "Breakfast", icon: Coffee, color: "from-yellow-400 to-orange-400" },
  lunch: { label: "Lunch", icon: Sun, color: "from-orange-400 to-red-400" },
  dinner: { label: "Dinner", icon: Moon, color: "from-indigo-400 to-purple-400" },
  snack: { label: "Snack", icon: Cookie, color: "from-pink-400 to-rose-400" }
};

function MealTracker() {
  const [meals, setMeals] = useState([]);
  const [totals, setTotals] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingMeal, setEditingMeal] = useState(null);
  
  const [newMeal, setNewMeal] = useState({
    name: "",
    calories: "",
    protein: "",
    carbs: "",
    fats: "",
    fiber: "",
    sugar: "",
    sodium: "",
    servingSize: "",
    servingQuantity: 1,
    type: "breakfast",
    foodId: ""
  });

  useEffect(() => {
    fetchMeals();
  }, [selectedDate]);

  const fetchMeals = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/meals?date=${selectedDate}`,
        { withCredentials: true }
      );
      setMeals(response.data.meals || []);
      setTotals(response.data.totals || { calories: 0, protein: 0, carbs: 0, fats: 0 });
    } catch (error) {
      console.error("Error fetching meals:", error);
    }
  };

  const searchFoods = async (query) => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/foods/search?query=${query}&limit=10`
      );
      setSearchResults(response.data);
    } catch (error) {
      console.error("Error searching foods:", error);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      searchFoods(searchQuery);
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const selectFood = (food) => {
    setNewMeal({
      ...newMeal,
      name: food.name,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fats: food.fats,
      fiber: food.fiber || 0,
      sugar: food.sugar || 0,
      sodium: food.sodium || 0,
      servingSize: food.servingSize,
      foodId: food._id
    });
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleAddMeal = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/meals`,
        {
          ...newMeal,
          calories: parseFloat(newMeal.calories) * newMeal.servingQuantity,
          protein: parseFloat(newMeal.protein || 0) * newMeal.servingQuantity,
          carbs: parseFloat(newMeal.carbs || 0) * newMeal.servingQuantity,
          fats: parseFloat(newMeal.fats || 0) * newMeal.servingQuantity,
          fiber: parseFloat(newMeal.fiber || 0) * newMeal.servingQuantity,
          sugar: parseFloat(newMeal.sugar || 0) * newMeal.servingQuantity,
          sodium: parseFloat(newMeal.sodium || 0) * newMeal.servingQuantity,
          date: selectedDate
        },
        { withCredentials: true }
      );

      setShowAddModal(false);
      setNewMeal({
        name: "",
        calories: "",
        protein: "",
        carbs: "",
        fats: "",
        fiber: "",
        sugar: "",
        sodium: "",
        servingSize: "",
        servingQuantity: 1,
        type: "breakfast",
        foodId: ""
      });
      fetchMeals();
    } catch (error) {
      console.error("Error adding meal:", error);
      alert(error.response?.data?.msg || "Failed to add meal");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateMeal = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/meals/${editingMeal._id}`,
        editingMeal,
        { withCredentials: true }
      );

      setShowEditModal(false);
      setEditingMeal(null);
      fetchMeals();
    } catch (error) {
      console.error("Error updating meal:", error);
      alert(error.response?.data?.msg || "Failed to update meal");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMeal = async (mealId) => {
    if (!confirm("Are you sure you want to delete this meal?")) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/meals/${mealId}`,
        { withCredentials: true }
      );
      fetchMeals();
    } catch (error) {
      console.error("Error deleting meal:", error);
      alert(error.response?.data?.msg || "Failed to delete meal");
    }
  };

  const openEditModal = (meal) => {
    setEditingMeal({ ...meal });
    setShowEditModal(true);
  };

  const groupedMeals = meals.reduce((acc, meal) => {
    if (!acc[meal.type]) acc[meal.type] = [];
    acc[meal.type].push(meal);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-2">
              Meal Tracker
            </h1>
            <p className="text-gray-600">Track your daily nutrition and reach your goals</p>
          </div>
          
          <div className="flex gap-4 items-center">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:outline-none"
            />
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Meal
            </button>
          </div>
        </div>

        {/* Daily Totals */}
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Daily Totals</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200">
              <div className="text-sm font-semibold text-orange-600 mb-1">Calories</div>
              <div className="text-3xl font-bold text-orange-700">{Math.round(totals.calories)}</div>
              <div className="text-xs text-orange-600">kcal</div>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200">
              <div className="text-sm font-semibold text-red-600 mb-1">Protein</div>
              <div className="text-3xl font-bold text-red-700">{Math.round(totals.protein)}</div>
              <div className="text-xs text-red-600">grams</div>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-200">
              <div className="text-sm font-semibold text-yellow-600 mb-1">Carbs</div>
              <div className="text-3xl font-bold text-yellow-700">{Math.round(totals.carbs)}</div>
              <div className="text-xs text-yellow-600">grams</div>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100 border-2 border-indigo-200">
              <div className="text-sm font-semibold text-indigo-600 mb-1">Fats</div>
              <div className="text-3xl font-bold text-indigo-700">{Math.round(totals.fats)}</div>
              <div className="text-xs text-indigo-600">grams</div>
            </div>
          </div>
        </div>

        {/* Meals by Type */}
        <div className="space-y-6">
          {Object.entries(MEAL_TYPES).map(([type, { label, icon: Icon, color }]) => (
            <div key={type} className="bg-white rounded-3xl shadow-xl p-6">
              <div className={`flex items-center gap-3 mb-4 pb-3 border-b-2 border-gray-100`}>
                <div className={`p-2 rounded-xl bg-gradient-to-br ${color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">{label}</h3>
                <span className="ml-auto text-sm text-gray-500">
                  {groupedMeals[type]?.length || 0} items
                </span>
              </div>

              {groupedMeals[type] && groupedMeals[type].length > 0 ? (
                <div className="space-y-3">
                  {groupedMeals[type].map((meal) => (
                    <div
                      key={meal._id}
                      className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800">{meal.name}</div>
                        <div className="text-sm text-gray-600 mt-1">
                          {meal.servingQuantity > 1 && `${meal.servingQuantity}x `}
                          {meal.servingSize && `(${meal.servingSize})`}
                        </div>
                        <div className="flex gap-4 mt-2 text-xs">
                          <span className="text-orange-600 font-semibold">
                            {Math.round(meal.calories)} cal
                          </span>
                          <span className="text-red-600">P: {Math.round(meal.protein)}g</span>
                          <span className="text-yellow-600">C: {Math.round(meal.carbs)}g</span>
                          <span className="text-indigo-600">F: {Math.round(meal.fats)}g</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(meal)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteMeal(meal._id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  No {label.toLowerCase()} added yet
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Add Meal Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white p-6 border-b-2 border-gray-100 flex justify-between items-center rounded-t-3xl">
                <h2 className="text-2xl font-bold text-gray-800">Add Meal</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleAddMeal} className="p-6 space-y-6">
                {/* Food Search */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Search Food Database
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:outline-none"
                      placeholder="Search for foods..."
                    />
                  </div>

                  {searchResults.length > 0 && (
                    <div className="mt-2 bg-white border-2 border-gray-200 rounded-xl max-h-60 overflow-y-auto">
                      {searchResults.map((food) => (
                        <button
                          key={food._id}
                          type="button"
                          onClick={() => selectFood(food)}
                          className="w-full text-left p-3 hover:bg-gray-50 border-b border-gray-100 last:border-0"
                        >
                          <div className="font-semibold text-gray-800">{food.name}</div>
                          <div className="text-sm text-gray-600">
                            {food.calories} cal | P: {food.protein}g | C: {food.carbs}g | F: {food.fats}g
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Manual Entry */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Food Name *
                    </label>
                    <input
                      type="text"
                      value={newMeal.name}
                      onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Meal Type *
                    </label>
                    <select
                      value={newMeal.type}
                      onChange={(e) => setNewMeal({ ...newMeal, type: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:outline-none"
                    >
                      {Object.entries(MEAL_TYPES).map(([key, { label }]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Serving Size
                    </label>
                    <input
                      type="text"
                      value={newMeal.servingSize}
                      onChange={(e) => setNewMeal({ ...newMeal, servingSize: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:outline-none"
                      placeholder="e.g., 100g, 1 cup"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Quantity *
                    </label>
                    <input
                      type="number"
                      value={newMeal.servingQuantity}
                      onChange={(e) => setNewMeal({ ...newMeal, servingQuantity: parseFloat(e.target.value) || 1 })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:outline-none"
                      min="0.1"
                      step="0.1"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Calories (per serving) *
                    </label>
                    <input
                      type="number"
                      value={newMeal.calories}
                      onChange={(e) => setNewMeal({ ...newMeal, calories: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Protein (g)
                    </label>
                    <input
                      type="number"
                      value={newMeal.protein}
                      onChange={(e) => setNewMeal({ ...newMeal, protein: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Carbs (g)
                    </label>
                    <input
                      type="number"
                      value={newMeal.carbs}
                      onChange={(e) => setNewMeal({ ...newMeal, carbs: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Fats (g)
                    </label>
                    <input
                      type="number"
                      value={newMeal.fats}
                      onChange={(e) => setNewMeal({ ...newMeal, fats: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t-2 border-gray-100">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading ? "Adding..." : (
                      <>
                        <Save className="w-5 h-5" />
                        Add Meal
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Meal Modal */}
        {showEditModal && editingMeal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white p-6 border-b-2 border-gray-100 flex justify-between items-center rounded-t-3xl">
                <h2 className="text-2xl font-bold text-gray-800">Edit Meal</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleUpdateMeal} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Food Name *
                    </label>
                    <input
                      type="text"
                      value={editingMeal.name}
                      onChange={(e) => setEditingMeal({ ...editingMeal, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Meal Type *
                    </label>
                    <select
                      value={editingMeal.type}
                      onChange={(e) => setEditingMeal({ ...editingMeal, type: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:outline-none"
                    >
                      {Object.entries(MEAL_TYPES).map(([key, { label }]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Calories *
                    </label>
                    <input
                      type="number"
                      value={editingMeal.calories}
                      onChange={(e) => setEditingMeal({ ...editingMeal, calories: parseFloat(e.target.value) })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Protein (g)
                    </label>
                    <input
                      type="number"
                      value={editingMeal.protein}
                      onChange={(e) => setEditingMeal({ ...editingMeal, protein: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Carbs (g)
                    </label>
                    <input
                      type="number"
                      value={editingMeal.carbs}
                      onChange={(e) => setEditingMeal({ ...editingMeal, carbs: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Fats (g)
                    </label>
                    <input
                      type="number"
                      value={editingMeal.fats}
                      onChange={(e) => setEditingMeal({ ...editingMeal, fats: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t-2 border-gray-100">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading ? "Saving..." : (
                      <>
                        <Save className="w-5 h-5" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MealTracker;
