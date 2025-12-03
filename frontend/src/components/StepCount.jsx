import React, { useState, useEffect } from "react";
import foot from "../assets/foot.png";
const StepCount = () => {
  const [steps, setSteps] = useState(7166);
  const [history, setHistory] = useState([
    20, 35, 45, 30, 60, 75, 50, 45, 60, 80, 55, 40,
  ]);
  const [isConnected, setIsConnected] = useState(false);
  const [tokenClient, setTokenClient] = useState(null);
  const [lastSync, setLastSync] = useState(null);
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
      console.log("Google Fit raw aggregate response:", data);
      let totalSteps = 0;
      if (data.bucket && data.bucket.length > 0) {
        const datasets = data.bucket[0].dataset || [];
        console.log("All datasets:", datasets);
        datasets.forEach((ds) => {
          (ds.point || []).forEach((pt) => {
            if (pt.value && pt.value.length > 0 && pt.value[0].intVal) {
              totalSteps += pt.value[0].intVal;
            }
          });
        });
      }
      console.log("Computed totalSteps for today (all sources):", totalSteps);
      if (totalSteps > 0) {
        setSteps(totalSteps);
        setLastSync(new Date().toLocaleTimeString());
        const newHistory = history.map(
          () => Math.floor(Math.random() * 60) + 25
        );
        setHistory(newHistory);
      }
    } catch (error) {
      console.error("Error fetching steps:", error);
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
  return (
    <div className="bg-white rounded-4xl p-5 sm:p-6 border border-slate-100 shadow-md relative overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-start z-10">
        <div>
          <h3
            onClick={handleSyncClick}
            className="font-semibold text-slate-900 mb-1 cursor-pointer hover:text-sky-600 transition-colors select-none flex items-center gap-2 text-sm sm:text-base"
            title="Click to sync with Google Fit"
          >
            Step Count
            <span
              className={`inline-flex w-2 h-2 rounded-full ${
                isConnected ? "bg-emerald-400" : "bg-slate-300"
              }`}
              title={isConnected ? "Live" : "Not connected"}
            />
          </h3>
          <p className="text-[11px] text-slate-400">
            Click title to pull today&apos;s steps from Google Fit
          </p>
          {lastSync && (
            <p className="text-[10px] text-slate-400 mt-1">
              Synced at {lastSync}
            </p>
          )}
        </div>
      </div>
      {/* Steps value */}
      <div className="flex items-end gap-2 mt-6 z-10">
        <span className="text-4xl sm:text-5xl font-bold text-slate-900 leading-none">
          {steps.toLocaleString()}
        </span>
        <span className="text-xs sm:text-sm text-slate-400 font-medium mb-1.5">
          Today&apos;s steps
        </span>
      </div>
      {/* Graph */}
      <div className="mt-4 sm:mt-5">
        <div className="flex items-end gap-1.5 h-16 sm:h-20 opacity-80 z-10">
          {history.map((h, i) => (
            <div
              key={i}
              style={{ height: `${h}%` }}
              className="flex-1 bg-linear-to-t from-sky-400 via-sky-300 to-sky-200 rounded-t-full transition-all duration-500"
            />
          ))}
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 mt-1.5 px-0.5">
          <span>Morning</span>
          <span>Afternoon</span>
          <span>Evening</span>
        </div>
      </div>
      <img
        src={foot}
        className="absolute top-3 right-3 w-20 sm:w-24 opacity-25 -rotate-12 mix-blend-multiply pointer-events-none"
        alt="Steps illustration"
      />
    </div>
  );
};
export default StepCount;
