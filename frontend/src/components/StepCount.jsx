import React, { useState, useEffect } from "react";
import { Footprints, RefreshCw, Smartphone } from "lucide-react";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import foot from "../assets/foot.png";

const StepCount = () => {
  const [steps, setSteps] = useState(7166);
  // Initial dummy history - will be replaced by real data if available
  const [history, setHistory] = useState([
    { time: '6am', steps: 0 },
    { time: '9am', steps: 1200 },
    { time: '12pm', steps: 3500 },
    { time: '3pm', steps: 5100 },
    { time: '6pm', steps: 6800 },
    { time: '9pm', steps: 7166 },
  ]);
  const [isConnected, setIsConnected] = useState(false);
  const [tokenClient, setTokenClient] = useState(null);
  const [lastSync, setLastSync] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);

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
          setIsConnected(true);
          await fetchStepData(tokenResponse.access_token);
        }
      },
    });
    setTokenClient(client);
  }, []);

  const fetchStepData = async (accessToken) => {
    setIsSyncing(true);
    try {
      const now = new Date();
      const startOfDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      ).getTime();
      const endOfDay = now.getTime();
      const response = await fetch(
        "https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            aggregateBy: [
              {
                dataTypeName: "com.google.step_count.delta",
              },
            ],
            bucketByTime: { durationMillis: 24 * 60 * 60 * 1000 },
            startTimeMillis: startOfDay,
            endTimeMillis: endOfDay,
          }),
        }
      );
      const data = await response.json();
      let totalSteps = 0;
      if (data.bucket && data.bucket.length > 0) {
        const datasets = data.bucket[0].dataset || [];
        datasets.forEach((ds) => {
          (ds.point || []).forEach((pt) => {
            if (pt.value && pt.value.length > 0 && pt.value[0].intVal) {
              totalSteps += pt.value[0].intVal;
            }
          });
        });
      }
      
      if (totalSteps > 0) {
        setSteps(totalSteps);
        setLastSync(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        // Simulate a history update based on total steps for the graph
        const newHistory = [
           { time: '6am', steps: Math.floor(totalSteps * 0.1) },
           { time: '9am', steps: Math.floor(totalSteps * 0.3) },
           { time: '12pm', steps: Math.floor(totalSteps * 0.5) },
           { time: '3pm', steps: Math.floor(totalSteps * 0.7) },
           { time: '6pm', steps: Math.floor(totalSteps * 0.9) },
           { time: 'Now', steps: totalSteps },
        ];
        setHistory(newHistory);
      }
    } catch (error) {
      console.error("Error fetching steps:", error);
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
      tokenClient.requestAccessToken({ prompt: "" });
    } else {
      tokenClient.requestAccessToken();
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg border border-teal-100 shadow-sm text-xs font-bold text-teal-600">
          {payload[0].value.toLocaleString()} steps
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-[2.5rem] p-6 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden h-full flex flex-col group transition-all duration-500 hover:shadow-2xl hover:shadow-teal-100/30">
      
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-teal-50/50 to-emerald-50/50 pointer-events-none"></div>
      <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-teal-100/30 rounded-full blur-[40px]"></div>

      {/* Header */}
      <div className="flex justify-between items-start z-10 mb-2">
        <div className="flex items-center gap-2">
           <div className="p-2 bg-gradient-to-br from-teal-400 to-emerald-400 rounded-xl shadow-lg shadow-teal-200 text-white">
             <Footprints size={18} fill="currentColor" fillOpacity={0.6} />
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
        
        <button 
           onClick={handleSyncClick}
           disabled={isSyncing}
           className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-teal-600 transition-colors"
           title="Sync with Google Fit"
        >
           <RefreshCw size={16} className={isSyncing ? "animate-spin" : ""} />
        </button>
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

      {/* Graph Area */}
      <div className="h-20 -mx-2 mt-4 z-10 opacity-70 group-hover:opacity-100 transition-opacity">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={history}>
            <defs>
              <linearGradient id="colorSteps" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#ccfbf1', strokeWidth: 2 }} />
            <Area 
               type="monotone" 
               dataKey="steps" 
               stroke="#14b8a6" 
               strokeWidth={2}
               fillOpacity={1} 
               fill="url(#colorSteps)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StepCount;
