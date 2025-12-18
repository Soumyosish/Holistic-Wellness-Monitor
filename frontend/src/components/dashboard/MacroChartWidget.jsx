import React, { useState, useEffect } from "react";
import axios from "axios";
import MacroChart from "../common/MacroChart";

function MacroChartWidget() {
  const [totals, setTotals] = useState({ protein: 0, carbs: 0, fats: 0 });
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
      setTotals(response.data.totals || { protein: 0, carbs: 0, fats: 0 });
    } catch (error) {
      console.error("Error fetching meals:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl shadow-xl p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <MacroChart
      protein={totals.protein}
      carbs={totals.carbs}
      fats={totals.fats}
    />
  );
}

export default MacroChartWidget;
