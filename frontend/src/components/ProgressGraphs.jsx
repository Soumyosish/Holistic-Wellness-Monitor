import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { TrendingUp, Droplet, Flame, Scale } from "lucide-react";

function ProgressGraphs() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState(30); // days

  useEffect(() => {
    fetchHistory();
  }, [timeRange]);

  const fetchHistory = async () => {
    try {
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - timeRange);
      const startDateStr = startDate.toISOString().split('T')[0];

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/activity/history?startDate=${startDateStr}&endDate=${endDate}&limit=${timeRange}`,
        { withCredentials: true }
      );
      
      // format dates
      const formattedData = response.data.map(item => ({
        ...item,
        date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        netCalories: (item.caloriesConsumed || 0) - (item.caloriesBurned || 0)
      })).reverse(); // API returns descending

      setData(formattedData);
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading progress data...</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Your Progress</h1>
        <select 
          className="px-4 py-2 border rounded-lg bg-white"
          value={timeRange}
          onChange={(e) => setTimeRange(Number(e.target.value))}
        >
          <option value={7}>Last 7 Days</option>
          <option value={30}>Last 30 Days</option>
          <option value={90}>Last 3 Months</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Weight Trend */}
        <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
              <Scale className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Weight Trend</h2>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.filter(d => d.weight)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" fontSize={12} stroke="#9ca3af" />
                <YAxis domain={['auto', 'auto']} fontSize={12} stroke="#9ca3af" />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Line type="monotone" dataKey="weight" stroke="#6366f1" strokeWidth={3} dot={{ fill: '#6366f1' }} accentHeight={0} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Calorie Balance */}
        <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100">
          <div className="flex items-center gap-2 mb-6">
             <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
              <Flame className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Calorie Balance</h2>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" fontSize={12} stroke="#9ca3af" />
                <YAxis fontSize={12} stroke="#9ca3af" />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Legend />
                <Bar dataKey="caloriesConsumed" name="In" fill="#f97316" radius={[4, 4, 0, 0]} />
                <Bar dataKey="caloriesBurned" name="Out" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Water Intake */}
        <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <Droplet className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Hydration History</h2>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorWater" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" fontSize={12} stroke="#9ca3af" />
                <YAxis fontSize={12} stroke="#9ca3af" />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="waterIntake" stroke="#3b82f6" fillOpacity={1} fill="url(#colorWater)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Steps History */}
        <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-green-100 rounded-lg text-green-600">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Daily Steps</h2>
          </div>
          <div className="h-72">
             <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" fontSize={12} stroke="#9ca3af" />
                <YAxis fontSize={12} stroke="#9ca3af" />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="steps" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ProgressGraphs;
