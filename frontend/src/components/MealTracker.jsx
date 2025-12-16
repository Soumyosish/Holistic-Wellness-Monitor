import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  Plus, Search, Trash2, Edit2, 
  X, Save, ArrowLeft, Utensils,
  Flame, Droplet, Wheat, Activity
} from "lucide-react";
import { foodApi } from "../services/foodApi";

function MealTracker() {
  const navigate = useNavigate();
  const [meals, setMeals] = useState([]);
  const [totals, setTotals] = useState({ calories: 0, protein: 0, carbs: 0, fats: 0 });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingMeal, setEditingMeal] = useState(null);
  
  const [baseNutrients, setBaseNutrients] = useState(null);

  const [newMeal, setNewMeal] = useState({
    name: "",
    calories: "",
    protein: "",
    carbs: "",
    fats: "",
    servingSize: "",
    servingQuantity: 1,
    type: "snack", // Defaulting to snack for backend compatibility
    foodId: ""
  });

  useEffect(() => {
    fetchMeals();
  }, [selectedDate]);

  useEffect(() => {
    if (baseNutrients && newMeal.servingQuantity) {
      const qty = parseFloat(newMeal.servingQuantity) || 0;
      setNewMeal(prev => ({
        ...prev,
        calories: (baseNutrients.calories * qty).toFixed(1),
        protein: (baseNutrients.protein * qty).toFixed(1),
        carbs: (baseNutrients.carbs * qty).toFixed(1),
        fats: (baseNutrients.fat * qty).toFixed(1)
      }));
    }
  }, [newMeal.servingQuantity, baseNutrients]);

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

  const handleSearch = async (query) => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const results = await foodApi.search(query);
      setSearchResults(results);
    } catch (error) {
      console.error("Search failed", error);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      handleSearch(searchQuery);
    }, 400);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const selectFood = (food) => {
    setBaseNutrients(food);
    setNewMeal({
      ...newMeal,
      name: food.label,
      calories: food.calories.toFixed(1),
      protein: food.protein.toFixed(1),
      carbs: food.carbs.toFixed(1),
      fats: food.fat.toFixed(1),
      servingSize: food.servingUnit,
      servingQuantity: 1, 
      foodId: food.foodId
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
        { ...newMeal, date: selectedDate },
        { withCredentials: true }
      );
      setShowAddModal(false);
      resetForm();
      fetchMeals();
    } catch (error) {
      alert(error.response?.data?.msg || "Failed to add meal");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
     setNewMeal({
        name: "", calories: "", protein: "", carbs: "", fats: "",
        servingSize: "", servingQuantity: 1, type: "snack", foodId: ""
      });
      setBaseNutrients(null);
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
      alert("Failed to update meal");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMeal = async (id) => {
    if(!confirm("Delete this food entry?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/meals/${id}`, { withCredentials: true });
      fetchMeals();
    } catch(err) { console.error(err); }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 px-4 font-outfit transition-colors duration-500">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col gap-6 mb-10 animate-fade-in-up">
          <div className="flex justify-between items-center">
             <button 
               onClick={() => navigate('/dashboard')}
               className="p-3 bg-white/80 hover:bg-white text-slate-700 rounded-full shadow-sm hover:shadow-md transition-all group"
             >
               <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
             </button>
             
             <div className="flex items-center gap-3 bg-white/60 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/40 shadow-sm">
                <span className="text-slate-500 font-medium text-sm">Viewing:</span>
                <input 
                  type="date" 
                  value={selectedDate} 
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-transparent border-none text-slate-800 font-bold focus:ring-0 cursor-pointer p-0"
                />
             </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-end gap-4">
            <div>
              <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight mb-2">Food Intake</h1>
              <p className="text-slate-600 text-lg">Log your nutrition for a healthier you.</p>
            </div>
            
            <button 
               onClick={() => setShowAddModal(true)}
               className="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl shadow-lg shadow-slate-200 transition-all transform hover:-translate-y-1 flex items-center gap-2"
             >
               <Plus size={20} /> Add Food
             </button>
          </div>
        </div>

        {/* Daily Totals Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10 animate-fade-in-up delay-100">
           {[
             { label: "Calories", val: Math.round(totals.calories), unit: "kcal", icon: Flame, color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-100" },
             { label: "Protein", val: Math.round(totals.protein), unit: "g", icon: Activity, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
             { label: "Carbs", val: Math.round(totals.carbs), unit: "g", icon: Wheat, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
             { label: "Fats", val: Math.round(totals.fats), unit: "g", icon: Droplet, color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-100" },
           ].map((stat, idx) => (
             <div key={idx} className={`relative overflow-hidden p-6 rounded-[2rem] bg-white/80 border ${stat.border} shadow-sm group hover:shadow-md transition-all`}>
                <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${stat.color}`}>
                   <stat.icon size={80} />
                </div>
                <div className="relative z-10">
                   <div className={`flex items-center gap-2 mb-2 ${stat.color}`}>
                      <stat.icon size={18} />
                      <span className="text-xs font-bold uppercase tracking-widest">{stat.label}</span>
                   </div>
                   <div className="flex items-baseline gap-1">
                      <span className={`text-4xl font-black ${stat.color}`}>{stat.val}</span>
                      <span className="text-slate-400 font-medium text-sm">{stat.unit}</span>
                   </div>
                </div>
             </div>
           ))}
        </div>

        {/* Unified Meals List */}
        <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/50 shadow-xl animate-fade-in-up delay-200 min-h-[400px]">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-slate-800">Daily Log</h3>
              <span className="text-slate-500 font-medium">{meals.length} entries</span>
           </div>

           {meals.length > 0 ? (
             <div className="space-y-4">
                {meals.map((meal, index) => (
                   <div key={meal._id} className="group flex flex-col md:flex-row md:items-center justify-between p-5 rounded-2xl bg-white border border-slate-100 hover:border-indigo-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.04)] transition-all duration-300">
                      
                      <div className="flex items-center gap-5">
                         <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-xl shadow-inner">
                            {/* Simple icon logic based on name or random */}
                            {['🍎','🥩','🍚','🥬'][index % 4]}
                         </div>
                         <div>
                            <h4 className="font-bold text-slate-800 text-xl mb-1">{meal.name}</h4>
                            <div className="flex gap-3 text-sm text-slate-500 font-medium">
                               <span>{meal.calories} kcal</span>
                               <span className="w-1 h-1 rounded-full bg-slate-300 self-center"></span>
                               <span>{meal.servingQuantity} x {meal.servingSize || 'serving'}</span>
                            </div>
                         </div>
                      </div>

                      <div className="flex items-center gap-6 mt-4 md:mt-0">
                         {/* Pill Macros */}
                         <div className="flex gap-2">
                            {[
                               { l: 'P', v: meal.protein, c: 'bg-emerald-100 text-emerald-700' },
                               { l: 'C', v: meal.carbs, c: 'bg-blue-100 text-blue-700' },
                               { l: 'F', v: meal.fats, c: 'bg-purple-100 text-purple-700' }
                            ].map(m => (
                               <div key={m.l} className={`px-3 py-1 rounded-lg text-xs font-bold ${m.c}`}>
                                  {m.l}: {Math.round(m.v)}g
                               </div>
                            ))}
                         </div>

                         {/* Actions */}
                         <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => { setEditingMeal(meal); setShowEditModal(true); }} className="p-2 hover:bg-slate-100 text-slate-500 hover:text-indigo-600 rounded-lg transition-colors"><Edit2 size={18} /></button>
                            <button onClick={() => handleDeleteMeal(meal._id)} className="p-2 hover:bg-slate-100 text-slate-500 hover:text-rose-600 rounded-lg transition-colors"><Trash2 size={18} /></button>
                         </div>
                      </div>

                   </div>
                ))}
             </div>
           ) : (
             <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6 text-slate-300">
                   <Utensils size={32} />
                </div>
                <h4 className="text-xl font-bold text-slate-800 mb-2">No food logged yet</h4>
                <p className="text-slate-500 max-w-md mx-auto">Start tracking your nutrition by adding your first food item for today.</p>
                <button onClick={() => setShowAddModal(true)} className="mt-8 text-indigo-600 font-bold hover:underline">Add Food Now</button>
             </div>
           )}
        </div>

        {/* Add Meal Modal (Simplified) */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
             <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" onClick={() => setShowAddModal(false)}></div>
             <div className="bg-white rounded-[2rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto relative shadow-2xl animate-fade-in-up">
                <div className="sticky top-0 bg-white/95 backdrop-blur-md z-10 p-6 border-b border-slate-100 flex justify-between items-center">
                   <h2 className="text-2xl font-bold text-slate-800">Log Food</h2>
                   <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={24} className="text-slate-500" /></button>
                </div>

                <div className="p-8">
                   {/* Search Section */}
                   <div className="mb-8">
                      <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Search Database</label>
                      <div className="relative group">
                         <Search className="absolute left-4 top-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                         <input 
                           type="text"
                           value={searchQuery}
                           onChange={(e) => setSearchQuery(e.target.value)}
                           placeholder="What did you eat? (e.g. Avocado Toast)"
                           className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all outline-none placeholder:text-slate-400"
                         />
                         {isSearching && <div className="absolute right-4 top-4 animate-spin text-indigo-500"><Utensils size={20} /></div>}
                      </div>
                      
                      {searchResults.length > 0 && (
                         <div className="mt-2 bg-white border border-slate-100 rounded-xl shadow-xl overflow-hidden max-h-60 overflow-y-auto z-20 absolute w-[calc(100%-4rem)]">
                            {searchResults.map((food, i) => (
                               <div key={i} onClick={() => selectFood(food)} className="flex items-center gap-3 p-3 hover:bg-indigo-50 cursor-pointer border-b border-slate-50 last:border-0 transition-colors">
                                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-xl">🥗</div>
                                  <div>
                                     <p className="font-bold text-slate-700">{food.label}</p>
                                     <p className="text-xs text-slate-500">{Math.round(food.calories)} kcal • {food.servingUnit}</p>
                                  </div>
                               </div>
                            ))}
                         </div>
                      )}
                   </div>

                   <form onSubmit={handleAddMeal} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-semibold text-slate-600 ml-1">Food Name</label>
                            <input 
                              required 
                              value={newMeal.name} 
                              onChange={e => setNewMeal({...newMeal, name: e.target.value})}
                              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 outline-none" 
                            />
                         </div>
                         {/* Hidden Type Select - Defaults to Snack in state */}
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                         <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-600 ml-1">Quantity</label>
                            <input 
                              type="number" step="0.1" min="0"
                              value={newMeal.servingQuantity}
                              onChange={e => setNewMeal({...newMeal, servingQuantity: e.target.value})}
                              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 outline-none"
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-600 ml-1">Unit</label>
                            <input 
                              value={newMeal.servingSize}
                              onChange={e => setNewMeal({...newMeal, servingSize: e.target.value})}
                              placeholder="e.g. grams"
                              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 outline-none"
                            />
                         </div>
                      </div>

                      <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                         <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Nutrition Facts (Total)</h4>
                         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {['calories', 'protein', 'carbs', 'fats'].map(nut => (
                               <div key={nut} className="relative">
                                  <label className="text-xs font-semibold text-slate-500 capitalize">{nut}</label>
                                  <input 
                                    type="number" 
                                    value={newMeal[nut]}
                                    onChange={e => setNewMeal({...newMeal, [nut]: e.target.value})}
                                    className="w-full mt-1 px-3 py-2 rounded-lg bg-white border border-slate-200 text-sm font-bold text-slate-700 outline-none focus:border-indigo-500"
                                  />
                               </div>
                            ))}
                         </div>
                      </div>

                      <button type="submit" disabled={loading} className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg shadow-slate-200 transition-all transform hover:-translate-y-1">
                         {loading ? "Saving..." : "Log Food Entry"}
                      </button>
                   </form>
                </div>
             </div>
          </div>
        )}

        {/* Edit Modal (Preserved & Simplified) */}
        {showEditModal && editingMeal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" onClick={() => setShowEditModal(false)}></div>
            <div className="bg-white rounded-[2rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto relative shadow-2xl animate-fade-in-up">
              <div className="sticky top-0 bg-white/95 backdrop-blur-md z-10 p-6 border-b border-slate-100 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800">Edit Food</h2>
                <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={24} className="text-slate-500" /></button>
              </div>

              <form onSubmit={handleUpdateMeal} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="text-sm font-semibold text-slate-600 ml-1">Food Name</label>
                    <input
                      type="text"
                      value={editingMeal.name}
                      onChange={(e) => setEditingMeal({ ...editingMeal, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 outline-none"
                      required
                    />
                  </div>
                  {/* Calories & Macros inputs same as before, ensuring text-slate-800 */}
                   <div>
                    <label className="text-sm font-semibold text-slate-600 ml-1">Calories</label>
                    <input type="number" value={editingMeal.calories} onChange={(e) => setEditingMeal({ ...editingMeal, calories: parseFloat(e.target.value) })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none" required />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-600 ml-1">Protein</label>
                    <input type="number" value={editingMeal.protein} onChange={(e) => setEditingMeal({ ...editingMeal, protein: parseFloat(e.target.value) || 0 })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-600 ml-1">Carbs</label>
                    <input type="number" value={editingMeal.carbs} onChange={(e) => setEditingMeal({ ...editingMeal, carbs: parseFloat(e.target.value) || 0 })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-600 ml-1">Fats</label>
                    <input type="number" value={editingMeal.fats} onChange={(e) => setEditingMeal({ ...editingMeal, fats: parseFloat(e.target.value) || 0 })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 outline-none" />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                  <button type="button" onClick={() => setShowEditModal(false)} className="px-6 py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-colors">Cancel</button>
                  <button type="submit" disabled={loading} className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg transition-all transform hover:-translate-y-1">Save</button>
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
