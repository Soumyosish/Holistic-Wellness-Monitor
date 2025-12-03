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
    <div className="bg-white/90 backdrop-blur-xl rounded-[28px] shadow-[0_18px_40px_rgba(15,23,42,0.08)] p-5 sm:p-6 lg:p-7 border border-slate-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 sm:mb-6">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-slate-900">
            Health Overview
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Live insight into your key health metrics
          </p>
        </div>
      </div>
      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-7 items-stretch">
        {/* Left Column: Heart + quick stats */}
        <div className="space-y-5">
          {/* Heart Image Container */}
          <div className="relative h-64 sm:h-72 rounded-3xl overflow-hidden border border-sky-100 bg-linear-to-br from-sky-50 via-white to-indigo-50 shadow-[0_16px_35px_rgba(56,189,248,0.25)]">
            {/* Zoomable heart image */}
            <img
              src={heart}
              alt="Heart Visualization"
              className="absolute inset-0 w-full h-full object-contain opacity-80 mix-blend-multiply transition-transform duration-300 ease-out"
              style={{ transform: `scale(${heartZoom})` }}
            />
            {/* Zoom controls */}
            <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/80 backdrop-blur-sm rounded-full px-2 py-1 shadow-sm">
              <button
                type="button"
                onClick={() => setHeartZoom((z) => Math.max(0.8, z - 0.1))}
                className="w-6 h-6 flex items-center justify-center rounded-full border border-slate-200 text-[#20b2aa] text-sm leading-none font-bold"
              >
                −
              </button>
              <button
                type="button"
                onClick={() => setHeartZoom((z) => Math.min(1.4, z + 0.1))}
                className="w-6 h-6 flex items-center justify-center rounded-full border border-slate-200 text-[#20b2aa] text-sm leading-none font-bold"
              >
                +
              </button>
            </div>
          </div>
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-linear-to-br from-orange-50 via-white to-orange-100 rounded-2xl p-3.5 sm:p-4 border border-orange-100 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-orange-700 uppercase tracking-wide">
                  Blood Sugar
                </span>
                <div
                  className={`text-[10px] font-semibold px-2 py-1 rounded-full border ${getStatusColor(
                    metrics.bloodSugar,
                    "bloodSugar"
                  )}`}
                >
                  {getStatusText(metrics.bloodSugar, "bloodSugar")}
                </div>
              </div>
              <div className="text-2xl font-semibold text-slate-900">
                {metrics.bloodSugar}
                <span className="ml-1 text-xs text-slate-500 font-medium">
                  mg/dL
                </span>
              </div>
              <p className="mt-1 text-[11px] text-slate-400">
                Target range 70–140
              </p>
            </div>
            <div className="bg-linear-to-br from-red-50 via-white to-rose-100 rounded-2xl p-3.5 sm:p-4 border border-rose-100 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-rose-700 uppercase tracking-wide">
                  Heart Rate
                </span>
                <div
                  className={`text-[10px] font-semibold px-2 py-1 rounded-full border ${getStatusColor(
                    metrics.heartRate,
                    "heartRate"
                  )}`}
                >
                  {getStatusText(metrics.heartRate, "heartRate")}
                </div>
              </div>
              <div className="text-2xl font-semibold text-slate-900">
                {metrics.heartRate}
                <span className="ml-1 text-xs text-slate-500 font-medium">
                  bpm
                </span>
              </div>
              <p className="mt-1 text-[11px] text-slate-400">
                Ideal resting 60–100 bpm
              </p>
            </div>
          </div>
        </div>
        {/* Right Column: Detailed Metrics with Sliders */}
        <div className="space-y-4 sm:space-y-5">
          {/* Blood Sugar Slider */}
          <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-orange-100 to-amber-50 border border-orange-200 flex items-center justify-center overflow-hidden">
                  <img
                    src={bloodsugar}
                    alt="Blood sugar"
                    className="w-8 h-8 object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Blood Sugar
                  </h3>
                  <p className="text-[11px] text-slate-400">mg/dL • fasting</p>
                </div>
              </div>
              <div className="text-2xl font-semibold text-slate-900">
                {metrics.bloodSugar}
              </div>
            </div>
            <div className="space-y-2">
              <input
                type="range"
                min="50"
                max="200"
                value={metrics.bloodSugar}
                onChange={(e) => updateBloodSugar(parseInt(e.target.value))}
                className="w-full h-2 bg-linear-to-r from-emerald-400 via-amber-400 to-rose-500 rounded-full appearance-none cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:h-5
                  [&::-webkit-slider-thumb]:w-5
                  [&::-webkit-slider-thumb]:rounded-full
                  [&::-webkit-slider-thumb]:bg-white
                  [&::-webkit-slider-thumb]:border-2
                  [&::-webkit-slider-thumb]:border-sky-500
                  [&::-webkit-slider-thumb]:shadow-md"
              />
              <div className="flex justify-between text-[11px] text-slate-400 px-0.5">
                <span>50</span>
                <span>100</span>
                <span>200</span>
              </div>
            </div>
          </div>
          {/* Heart Rate Slider */}
          <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-rose-100 to-rose-50 border border-rose-200 flex items-center justify-center overflow-hidden">
                  <img
                    src={heartRate}
                    alt="Heart rate"
                    className="w-8 h-8 object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Heart Rate
                  </h3>
                  <p className="text-[11px] text-slate-400">bpm • resting</p>
                </div>
              </div>
              <div className="text-2xl font-semibold text-slate-900">
                {metrics.heartRate}
              </div>
            </div>
            <div className="space-y-2">
              <input
                type="range"
                min="40"
                max="120"
                value={metrics.heartRate}
                onChange={(e) => updateHeartRate(parseInt(e.target.value))}
                className="w-full h-2 bg-linear-to-r from-emerald-400 via-amber-400 to-rose-500 rounded-full appearance-none cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:h-5
                  [&::-webkit-slider-thumb]:w-5
                  [&::-webkit-slider-thumb]:rounded-full
                  [&::-webkit-slider-thumb]:bg-white
                  [&::-webkit-slider-thumb]:border-2
                  [&::-webkit-slider-thumb]:border-sky-500
                  [&::-webkit-slider-thumb]:shadow-md"
              />
              <div className="flex justify-between text-[11px] text-slate-400 px-0.5">
                <span>40</span>
                <span>80</span>
                <span>120</span>
              </div>
            </div>
          </div>
          {/* Blood Pressure Slider */}
          <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-violet-100 to-indigo-50 border border-violet-200 flex items-center justify-center overflow-hidden">
                  <img
                    src={bloodpressure}
                    alt="Blood pressure"
                    className="w-8 h-8 object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Blood Pressure
                  </h3>
                  <p className="text-[11px] text-slate-400">mmHg</p>
                </div>
              </div>
              <div className="text-2xl font-semibold text-slate-900">
                {metrics.bloodPressure.systolic}/
                {metrics.bloodPressure.diastolic}
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                  <span>Systolic</span>
                  <span className="font-medium">
                    {metrics.bloodPressure.systolic}
                  </span>
                </div>
                <input
                  type="range"
                  min="90"
                  max="180"
                  value={metrics.bloodPressure.systolic}
                  onChange={(e) =>
                    updateBloodPressure("systolic", parseInt(e.target.value))
                  }
                  className="w-full h-2 bg-linear-to-r from-emerald-400 via-amber-400 to-rose-500 rounded-full appearance-none cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:h-5
                    [&::-webkit-slider-thumb]:w-5
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:bg-white
                    [&::-webkit-slider-thumb]:border-2
                    [&::-webkit-slider-thumb]:border-sky-500
                    [&::-webkit-slider-thumb]:shadow-md"
                />
              </div>
              <div>
                <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                  <span>Diastolic</span>
                  <span className="font-medium">
                    {metrics.bloodPressure.diastolic}
                  </span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="120"
                  value={metrics.bloodPressure.diastolic}
                  onChange={(e) =>
                    updateBloodPressure("diastolic", parseInt(e.target.value))
                  }
                  className="w-full h-2 bg-linear-to-r from-emerald-400 via-amber-400 to-rose-500 rounded-full appearance-none cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:h-5
                    [&::-webkit-slider-thumb]:w-5
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:bg-white
                    [&::-webkit-slider-thumb]:border-2
                    [&::-webkit-slider-thumb]:border-sky-500
                    [&::-webkit-slider-thumb]:shadow-md"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Status Summary */}
      <div className="mt-7 pt-5 border-t border-slate-100">
        <h3 className="text-sm font-semibold text-slate-900 mb-3.5">
          Health status summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5">
          <div className="bg-linear-to-r from-emerald-50 to-green-50 rounded-2xl p-4 border border-emerald-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-emerald-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-800">
                  Overall health
                </p>
                <p className="text-xs text-emerald-600 font-medium">Good</p>
              </div>
            </div>
          </div>
          <div className="bg-linear-to-r from-sky-50 to-blue-50 rounded-2xl p-4 border border-sky-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-sky-100 flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-sky-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-800">
                  Last check‑up
                </p>
                <p className="text-xs text-sky-600 font-medium">2 days ago</p>
              </div>
            </div>
          </div>
          <div className="bg-linear-to-r from-violet-50 to-fuchsia-50 rounded-2xl p-4 border border-violet-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-violet-100 flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-violet-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-800">
                  Next appointment
                </p>
                <p className="text-xs text-violet-600 font-medium">
                  Feb 16, 2026
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default HealthOverview;
