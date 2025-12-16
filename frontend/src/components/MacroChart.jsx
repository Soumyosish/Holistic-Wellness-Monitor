import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const COLORS = {
  protein: "#EF4444", // Red
  carbs: "#F59E0B", // Yellow
  fats: "#6366F1" // Indigo
};

function MacroChart({ protein = 0, carbs = 0, fats = 0 }) {
  const total = protein + carbs + fats;

  if (total === 0) {
    return (
      <div className="bg-white rounded-3xl shadow-xl p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Macro Distribution</h2>
        <div className="flex items-center justify-center h-64 text-gray-400">
          No macro data available
        </div>
      </div>
    );
  }

  const data = [
    { name: "Protein", value: protein, grams: protein, color: COLORS.protein },
    { name: "Carbs", value: carbs, grams: carbs, color: COLORS.carbs },
    { name: "Fats", value: fats, grams: fats, color: COLORS.fats }
  ].filter(item => item.value > 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = ((data.value / total) * 100).toFixed(1);
      return (
        <div className="bg-white p-3 rounded-xl shadow-lg border-2 border-gray-100">
          <p className="font-semibold" style={{ color: data.color }}>
            {data.name}
          </p>
          <p className="text-sm text-gray-600">{data.grams}g ({percentage}%)</p>
        </div>
      );
    }
    return null;
  };

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="font-bold text-sm"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Macro Distribution</h2>
      
      <div className="flex flex-col items-center">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={CustomLabel}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              animationBegin={0}
              animationDuration={800}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Legend with Details */}
        <div className="grid grid-cols-3 gap-4 w-full mt-6">
          <div className="p-4 rounded-xl bg-red-50 border-2 border-red-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-sm font-semibold text-red-600">Protein</span>
            </div>
            <div className="text-2xl font-bold text-red-700">{Math.round(protein)}g</div>
            <div className="text-xs text-red-600 mt-1">
              {((protein / total) * 100).toFixed(1)}%
            </div>
          </div>

          <div className="p-4 rounded-xl bg-yellow-50 border-2 border-yellow-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span className="text-sm font-semibold text-yellow-600">Carbs</span>
            </div>
            <div className="text-2xl font-bold text-yellow-700">{Math.round(carbs)}g</div>
            <div className="text-xs text-yellow-600 mt-1">
              {((carbs / total) * 100).toFixed(1)}%
            </div>
          </div>

          <div className="p-4 rounded-xl bg-indigo-50 border-2 border-indigo-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
              <span className="text-sm font-semibold text-indigo-600">Fats</span>
            </div>
            <div className="text-2xl font-bold text-indigo-700">{Math.round(fats)}g</div>
            <div className="text-xs text-indigo-600 mt-1">
              {((fats / total) * 100).toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Calorie Breakdown */}
        <div className="w-full mt-6 p-4 rounded-xl bg-gray-50 border-2 border-gray-200">
          <div className="text-sm font-semibold text-gray-600 mb-2">Calorie Breakdown</div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-xs text-red-600">Protein</div>
              <div className="text-lg font-bold text-red-700">{Math.round(protein * 4)}</div>
              <div className="text-xs text-gray-500">kcal</div>
            </div>
            <div>
              <div className="text-xs text-yellow-600">Carbs</div>
              <div className="text-lg font-bold text-yellow-700">{Math.round(carbs * 4)}</div>
              <div className="text-xs text-gray-500">kcal</div>
            </div>
            <div>
              <div className="text-xs text-indigo-600">Fats</div>
              <div className="text-lg font-bold text-indigo-700">{Math.round(fats * 9)}</div>
              <div className="text-xs text-gray-500">kcal</div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-300 text-center">
            <div className="text-xs text-gray-600">Total Calories</div>
            <div className="text-2xl font-bold text-gray-800">
              {Math.round((protein * 4) + (carbs * 4) + (fats * 9))}
            </div>
            <div className="text-xs text-gray-500">kcal</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MacroChart;
