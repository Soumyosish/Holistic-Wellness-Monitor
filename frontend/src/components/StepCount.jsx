import React, { useState, useEffect } from "react";
import { Footprints, RefreshCw, Smartphone, X } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import axios from "axios";
import foot from "../assets/foot.png";

const StepCount = () => {
  const [steps, setSteps] = useState(0);
  const [weeklyHistory, setWeeklyHistory] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [tokenClient, setTokenClient] = useState(null);
  const [lastSync, setLastSync] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Check connection status and auto-sync on mount
  useEffect(() => {
    checkConnectionStatus();
    fetchWeeklyStepHistory();
  }, []);

  // Initialize Google OAuth client
  useEffect(() => {
    if (
      !window.google ||
      !window.google.accounts ||
      !window.google.accounts.oauth2
    )
      return;
    const client = window.google.accounts.oauth2.initTokenClient({
      client_id:
        import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID",
      scope: "https://www.googleapis.com/auth/fitness.activity.read",
      callback: async (tokenResponse) => {
        if (tokenResponse?.access_token) {
          await storeTokensInBackend(tokenResponse);
        }
      },
    });
    setTokenClient(client);
  }, []);

  const fetchWeeklyStepHistory = async () => {
    try {
      // First get today's summary to show current steps
      const todayResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/activity/today`,
        { withCredentials: true }
      );
      setSteps(todayResponse.data.steps || 0);

      // Then get weekly stats for the graph
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/activity/weekly-stats`,
        { withCredentials: true }
      );
      
      // Create array of last 7 days
      const today = new Date();
      const last7Days = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        
        // Find data for this date
        const dayData = response.data.summaries.find(s => s.date === dateStr);
        
        last7Days.push({
          date: dayName,
          steps: dayData?.steps || 0,
          fullDate: dateStr
        });
      }
      
      setWeeklyHistory(last7Days);
    } catch (error) {
      console.error("Error fetching weekly step history:", error);
    }
  };

  const checkConnectionStatus = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/activity/google-fit/status`,
        { withCredentials: true }
      );
      
      if (response.data.connected) {
        setIsConnected(true);
        // Auto-sync steps if connected
        await syncStepsFromBackend();
      }
    } catch (error) {
      console.error("Error checking Google Fit status:", error);
    }
  };

  const storeTokensInBackend = async (tokenResponse) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/activity/google-fit/connect`,
        {
          accessToken: tokenResponse.access_token,
          refreshToken: tokenResponse.refresh_token,
          expiryDate: tokenResponse.expires_in 
            ? Date.now() + tokenResponse.expires_in * 1000 
            : null
        },
        { withCredentials: true }
      );

      if (response.data.connected) {
        setIsConnected(true);
        // Sync steps after connecting
        await syncStepsFromBackend();
      }
    } catch (error) {
      console.error("Error storing Google Fit tokens:", error);
    }
  };

  const syncStepsFromBackend = async () => {
    setIsSyncing(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/activity/google-fit/sync`,
        { withCredentials: true }
      );

      const totalSteps = response.data.steps || 0;
      setSteps(totalSteps);
      setLastSync(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

      // Refresh weekly history after sync
      await fetchWeeklyStepHistory();
    } catch (error) {
      console.error("Error syncing steps from backend:", error);
      if (error.response?.status === 400 || error.response?.status === 401) {
        // Token issue or not connected
        setIsConnected(false);
      }
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSyncClick = () => {
    if (!tokenClient) {
      console.warn("Google Identity Services not loaded yet.");
      return;
    }
    if (isConnected) {
      // If already connected, just sync
      syncStepsFromBackend();
    } else {
      // Request new authorization
      tokenClient.requestAccessToken();
    }
  };

  const handleDisconnect = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/activity/google-fit/disconnect`,
        {},
        { withCredentials: true }
      );
      setIsConnected(false);
      setSteps(0);
      setLastSync(null);
      setWeeklyHistory([]);
      // Refresh to show local data
      await fetchWeeklyStepHistory();
    } catch (error) {
      console.error("Error disconnecting Google Fit:", error);
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/90 backdrop-blur-md px-3 py-2 rounded-lg border border-teal-100 shadow-lg">
          <p className="text-xs font-bold text-slate-600 mb-1">{label}</p>
          <p className="text-sm font-black text-teal-600">
            {payload[0].value.toLocaleString()} steps
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-[2.5rem] p-6 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden h-full flex flex-col group transition-all duration-500 hover:shadow-2xl hover:shadow-teal-100/30">
      
      {/* Decorative Background */}
      <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-teal-100/30 rounded-full blur-[40px]"></div>

      {/* Header */}
      <div className="flex justify-between items-start z-10 mb-2">
        <div className="flex items-center gap-2">
           <div className="p-2.5 bg-white rounded-xl shadow-md border border-slate-100 relative overflow-hidden">
             <img 
               src={foot} 
               alt="Steps" 
               className="w-7 h-7 object-contain"
             />
           </div>
           <div>
              <h3 className="font-bold text-slate-800 leading-tight">Activity</h3>
              <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 flex items-center gap-1">
                 {isConnected ? (
                    <><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Google Fit</>
                 ) : (
                    "Local Tracker"
                 )}
              </p>
           </div>
        </div>
        
        <div className="flex gap-1">
          {isConnected && (
            <button 
              onClick={handleDisconnect}
              className="p-2 hover:bg-red-50 rounded-full text-slate-400 hover:text-red-600 transition-colors"
              title="Disconnect Google Fit"
            >
              <X size={16} />
            </button>
          )}
          <button 
             onClick={handleSyncClick}
             disabled={isSyncing}
             className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-teal-600 transition-colors"
             title={isConnected ? "Sync with Google Fit" : "Connect Google Fit"}
          >
             <RefreshCw size={16} className={isSyncing ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Main Counter */}
      <div className="flex-1 flex flex-col justify-center z-10 pl-1">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl sm:text-5xl font-black text-slate-800 tracking-tighter">
            {steps.toLocaleString()}
          </span>
          <span className="text-sm font-semibold text-slate-400 mb-1">steps</span>
        </div>
        <div className="h-1.5 w-full bg-slate-100 rounded-full mt-2 overflow-hidden">
           <div 
             className="h-full bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full transition-all duration-1000 ease-out"
             style={{ width: `${Math.min((steps/10000)*100, 100)}%` }}
           ></div>
        </div>
        <p className="text-xs text-slate-400 mt-1 font-medium">{lastSync ? `Updated ${lastSync}` : 'Goal: 10,000'}</p>
      </div>

      {/* 7-Day Line Graph */}
      <div className="h-24 -mx-2 mt-4 z-10">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">7 Day Trend</div>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={weeklyHistory}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
            <XAxis 
              dataKey="date" 
              tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 600}} 
              axisLine={false} 
              tickLine={false}
              dy={5}
            />
            <YAxis 
              tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 600}} 
              axisLine={false} 
              tickLine={false}
              width={35}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#14b8a6', strokeWidth: 2, strokeDasharray: '5 5' }} />
            <Line 
              type="monotone" 
              dataKey="steps" 
              stroke="#14b8a6" 
              strokeWidth={3}
              dot={{ fill: '#14b8a6', r: 4 }}
              activeDot={{ r: 6, fill: '#0d9488' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StepCount;
