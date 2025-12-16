import React, { useState } from "react";
import heart from "../assets/heart.jpg";
import bloodsugar from "../assets/bloodsugar.jpg";
import bloodpressure from "../assets/bloodpressure.webp";
import heartRate from "../assets/heartrate.jpg";
const HealthOverview = () => {
  const [metrics, setMetrics] = useState({
    bloodSugar: 80,
    heartRate: 72,
    bloodPressure: { systolic: 120, diastolic: 80 },
  });
  const [heartZoom, setHeartZoom] = useState(1); // 1 = 100%
  const updateBloodSugar = (value) => {
    setMetrics((prev) => ({
      ...prev,
      bloodSugar: Math.max(50, Math.min(200, value)),
    }));
  };
  const updateHeartRate = (value) => {
    setMetrics((prev) => ({
      ...prev,
      heartRate: Math.max(40, Math.min(120, value)),
    }));
  };
  const updateBloodPressure = (type, value) => {
    setMetrics((prev) => ({
      ...prev,
      bloodPressure: {
        ...prev.bloodPressure,
        [type]:
          type === "systolic"
            ? Math.max(90, Math.min(180, value))
            : Math.max(60, Math.min(120, value)),
      },
    }));
  };
  const getStatusColor = (value, type) => {
    if (type === "bloodSugar") {
      if (value < 70) return "text-yellow-600 bg-yellow-50 border-yellow-100";
      if (value <= 140) return "text-green-600 bg-green-50 border-green-100";
      return "text-red-600 bg-red-50 border-red-100";
    }
    if (type === "heartRate") {
      if (value < 60) return "text-yellow-600 bg-yellow-50 border-yellow-100";
      if (value <= 100) return "text-green-600 bg-green-50 border-green-100";
      return "text-red-600 bg-red-50 border-red-100";
    }
    return "text-green-600 bg-green-50 border-green-100";
  };
  const getStatusText = (value, type) => {
    if (type === "bloodSugar") {
      if (value < 70) return "Low";
      if (value <= 140) return "Normal";
      return "High";
    }
    if (type === "heartRate") {
      if (value < 60) return "Low";
      if (value <= 100) return "Normal";
      return "High";
    }
    return "Normal";
  };

  return (
    <div className="bg-white/70 backdrop-blur-2xl rounded-[32px] shadow-[0_20px_50px_-12px_rgba(79,70,229,0.1)] p-6 sm:p-7 lg:p-8 border border-white/50 relative overflow-hidden group hover:shadow-[0_25px_60px_-12px_rgba(79,70,229,0.15)] transition-all duration-500">
      {/* Decorative gradient blob */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-fuchsia-100/30 rounded-full blur-3xl pointer-events-none group-hover:bg-fuchsia-100/50 transition-colors duration-700"></div>
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
            Health Overview
          </h2>
          <p className="text-sm text-slate-500 mt-1.5 font-medium">
            Live insight into your key health metrics
          </p>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch relative z-10">
        {/* Left Column: Heart + quick stats */}
        <div className="space-y-6">
          {/* Heart Image Container */}
          <div className="relative h-64 sm:h-80 rounded-[2rem] overflow-hidden border border-white/60 bg-gradient-to-br from-indigo-50/50 via-white/80 to-purple-50/50 shadow-[0_15px_35px_-10px_rgba(99,102,241,0.15)] group/heart transition-transform hover:scale-[1.01] duration-500">
            {/* Zoomable heart image */}
            <img
              src={heart}
              alt="Heart Visualization"
              className="absolute inset-0 w-full h-full object-contain opacity-90 mix-blend-multiply transition-transform duration-500 ease-out p-6"
              style={{ transform: `scale(${heartZoom})` }}
            />
            
            {/* Zoom controls */}
            <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover/heart:opacity-100 transition-opacity duration-300">
              <button
                type="button"
                onClick={() => setHeartZoom((z) => Math.min(1.4, z + 0.1))}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/90 backdrop-blur text-indigo-600 shadow-sm hover:bg-indigo-50 transition-colors"
                aria-label="Zoom in"
              >
                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => setHeartZoom((z) => Math.max(0.8, z - 0.1))}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/90 backdrop-blur text-indigo-600 shadow-sm hover:bg-indigo-50 transition-colors"
                aria-label="Zoom out"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                </svg>
              </button>
            </div>
            
            {/* Decorative subtle grid */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoOTksIDEwMiwgMjQxLCAwLjAzKSIvPjwvc3ZnPg==')] opacity-50 pointer-events-none"></div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-amber-50/80 to-orange-50/50 rounded-2xl p-5 border border-amber-100/60 shadow-[0_8px_20px_-8px_rgba(251,191,36,0.15)] hover:shadow-[0_12px_24px_-8px_rgba(251,191,36,0.25)] transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-amber-700/80 uppercase tracking-wider">
                  Blood Sugar
                </span>
                <div
                  className={`w-2 h-2 rounded-full ${
                    metrics.bloodSugar < 70 ? 'bg-amber-400' : metrics.bloodSugar <= 140 ? 'bg-emerald-400' : 'bg-rose-400'
                  } shadow-[0_0_8px_rgba(251,191,36,0.5)]`}
                />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-bold text-slate-800 tracking-tight">
                  {metrics.bloodSugar}
                </span>
                <span className="text-xs text-slate-500 font-semibold uppercase">
                  mg/dL
                </span>
              </div>
              <div className={`mt-2 text-xs font-medium px-2 py-1 rounded-lg inline-block ${getStatusColor(metrics.bloodSugar, "bloodSugar")}`}>
                {getStatusText(metrics.bloodSugar, "bloodSugar")}
              </div>
            </div>

            <div className="bg-gradient-to-br from-rose-50/80 to-pink-50/50 rounded-2xl p-5 border border-rose-100/60 shadow-[0_8px_20px_-8px_rgba(244,63,94,0.15)] hover:shadow-[0_12px_24px_-8px_rgba(244,63,94,0.25)] transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-rose-700/80 uppercase tracking-wider">
                  Heart Rate
                </span>
                 <div
                  className={`w-2 h-2 rounded-full ${
                    metrics.heartRate < 60 ? 'bg-amber-400' : metrics.heartRate <= 100 ? 'bg-emerald-400' : 'bg-rose-400'
                  } shadow-[0_0_8px_rgba(244,63,94,0.5)]`}
                />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-bold text-slate-800 tracking-tight">
                  {metrics.heartRate}
                </span>
                <span className="text-xs text-slate-500 font-semibold uppercase">
                  bpm
                </span>
              </div>
               <div className={`mt-2 text-xs font-medium px-2 py-1 rounded-lg inline-block ${getStatusColor(metrics.heartRate, "heartRate")}`}>
                {getStatusText(metrics.heartRate, "heartRate")}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Metrics with Sliders */}
        <div className="space-y-5 flex flex-col justify-center">
          {/* Blood Sugar Slider */}
          <div className="bg-white/60 rounded-3xl p-6 border border-white/50 shadow-[0_4px_20px_-4px_rgba(148,163,184,0.1)] hover:shadow-[0_8px_25px_-5px_rgba(148,163,184,0.15)] transition-all duration-300 backdrop-blur-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-100 to-amber-50 border border-orange-200/50 flex items-center justify-center shadow-inner">
                <img
                  src={bloodsugar}
                  alt="Blood sugar"
                  className="w-6 h-6 object-contain drop-shadow-sm"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-800">Blood Sugar</h3>
                  <span className="text-xl font-bold text-slate-700 tabular-nums">{metrics.bloodSugar}</span>
                </div>
                <p className="text-xs text-slate-500 font-medium">Fasting Concentration</p>
              </div>
            </div>
            
            <div className="px-2 relative">
                <input
                type="range"
                min="50"
                max="200"
                value={metrics.bloodSugar}
                onChange={(e) => updateBloodSugar(parseInt(e.target.value))}
                className="w-full h-3 bg-slate-200 rounded-full appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-200/50"
                  style={{
                    background: `linear-gradient(to right, #10b981 0%, #fbbf24 60%, #f43f5e 100%)`
                  }}
                />
                <style jsx>{`
                    input[type=range]::-webkit-slider-thumb {
                        -webkit-appearance: none;
                        height: 20px;
                        width: 20px;
                        border-radius: 50%;
                        background: #fff;
                        border: 3px solid #fff;
                        box-shadow: 0 2px 6px rgba(0,0,0,0.15);
                        margin-top: -4px; 
                    }
                `}</style>
               <div className="flex justify-between text-[10px] font-semibold text-slate-400 mt-2 tracking-wide uppercase">
                <span>Low</span>
                <span>Normal</span>
                <span>High</span>
              </div>
            </div>
          </div>

          {/* Heart Rate Slider */}
          <div className="bg-white/60 rounded-3xl p-6 border border-white/50 shadow-[0_4px_20px_-4px_rgba(148,163,184,0.1)] hover:shadow-[0_8px_25px_-5px_rgba(148,163,184,0.15)] transition-all duration-300 backdrop-blur-sm">
             <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-100 to-pink-50 border border-rose-200/50 flex items-center justify-center shadow-inner">
                <img
                  src={heartRate}
                  alt="Heart rate"
                  className="w-6 h-6 object-contain drop-shadow-sm"
                />
              </div>
               <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-800">Heart Rate</h3>
                  <span className="text-xl font-bold text-slate-700 tabular-nums">{metrics.heartRate}</span>
                </div>
                <p className="text-xs text-slate-500 font-medium">Beats Per Minute</p>
              </div>
            </div>
             <div className="px-2">
                 <input
                type="range"
                min="40"
                max="120"
                value={metrics.heartRate}
                onChange={(e) => updateHeartRate(parseInt(e.target.value))}
                className="w-full h-3 bg-slate-200 rounded-full appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-200/50"
                  style={{
                    background: `linear-gradient(to right, #10b981 0%, #fbbf24 60%, #f43f5e 100%)`
                  }}
              />
              <div className="flex justify-between text-[10px] font-semibold text-slate-400 mt-2 tracking-wide uppercase">
                <span>Resting</span>
                <span>Active</span>
                <span>Peak</span>
              </div>
            </div>
          </div>

          {/* Blood Pressure Slider */}
          <div className="bg-white/60 rounded-3xl p-6 border border-white/50 shadow-[0_4px_20px_-4px_rgba(148,163,184,0.1)] hover:shadow-[0_8px_25px_-5px_rgba(148,163,184,0.15)] transition-all duration-300 backdrop-blur-sm">
             <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-100 to-violet-50 border border-indigo-200/50 flex items-center justify-center shadow-inner">
                <img
                  src={bloodpressure}
                  alt="Blood pressure"
                  className="w-6 h-6 object-contain drop-shadow-sm"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-800">Blood Pressure</h3>
                   <div className="flex items-baseline gap-0.5">
                    <span className="text-xl font-bold text-slate-700 tabular-nums">{metrics.bloodPressure.systolic}</span>
                    <span className="text-slate-400">/</span>
                    <span className="text-lg font-semibold text-slate-600 tabular-nums">{metrics.bloodPressure.diastolic}</span>
                   </div>
                </div>
                <p className="text-xs text-slate-500 font-medium">Systolic & Diastolic</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs text-slate-500 mb-2 font-medium px-1">
                  <span>Systolic</span>
                </div>
                <input
                  type="range"
                  min="90"
                  max="180"
                  value={metrics.bloodPressure.systolic}
                  onChange={(e) =>
                    updateBloodPressure("systolic", parseInt(e.target.value))
                  }
                  className="w-full h-3 bg-slate-200 rounded-full appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-200/50"
                  style={{
                    background: `linear-gradient(to right, #10b981 0%, #fbbf24 60%, #f43f5e 100%)`
                  }}
                />
              </div>
              <div>
                <div className="flex justify-between text-xs text-slate-500 mb-2 font-medium px-1">
                  <span>Diastolic</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="120"
                  value={metrics.bloodPressure.diastolic}
                  onChange={(e) =>
                    updateBloodPressure("diastolic", parseInt(e.target.value))
                  }
                  className="w-full h-3 bg-slate-200 rounded-full appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-violet-200/50"
                  style={{
                    background: `linear-gradient(to right, #10b981 0%, #fbbf24 60%, #f43f5e 100%)`
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Summary */}
      <div className="mt-8 pt-6 border-t border-slate-100/60 relative z-10">
        <h3 className="text-sm font-bold text-slate-700 mb-4 tracking-tight">
          Health Status Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="group bg-emerald-50/50 hover:bg-emerald-50 rounded-2xl p-4 border border-emerald-100/50 transition-colors duration-300">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-100/80 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-0.5">Overall</p>
                <p className="text-sm font-bold text-slate-700">Excellent Condition</p>
              </div>
            </div>
          </div>

          <div className="group bg-sky-50/50 hover:bg-sky-50 rounded-2xl p-4 border border-sky-100/50 transition-colors duration-300">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-sky-100/80 flex items-center justify-center text-sky-600 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-semibold text-sky-600 uppercase tracking-wide mb-0.5">Check-up</p>
                <p className="text-sm font-bold text-slate-700">2 Days Ago</p>
              </div>
            </div>
          </div>

          <div className="group bg-violet-50/50 hover:bg-violet-50 rounded-2xl p-4 border border-violet-100/50 transition-colors duration-300">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-violet-100/80 flex items-center justify-center text-violet-600 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-semibold text-violet-600 uppercase tracking-wide mb-0.5">Next Visit</p>
                <p className="text-sm font-bold text-slate-700">Feb 16, 2026</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthOverview;
