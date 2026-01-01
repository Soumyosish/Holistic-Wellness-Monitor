import React, { useState, useMemo } from "react";
import body from "../../assets/humanbody.png";
const BMI_CATEGORIES = {
  underweight: {
    label: "Underweight",
    color: "text-yellow-700",
    bg: "bg-yellow-100",
  },
  normal: {
    label: "Normal Weight",
    color: "text-green-700",
    bg: "bg-green-100",
  },
  overweight: {
    label: "Overweight",
    color: "text-orange-700",
    bg: "bg-orange-100",
  },
  obese: { label: "Obese", color: "text-red-700", bg: "bg-red-100" },
};
const BMICalculator = () => {
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(72);
  const bmi = useMemo(() => {
    const heightM = height / 100;
    return Number((weight / (heightM * heightM)).toFixed(1));
  }, [height, weight]);
  const getBMIStatus = (val) => {
    if (val < 18.5)
      return {
        label: "Underweight",
        color: "text-yellow-700",
        bg: "bg-yellow-100",
      };
    if (val < 25)
      return {
        label: "Normal Weight",
        color: "text-green-700",
        bg: "bg-green-100",
      };
    if (val < 30)
      return {
        label: "Overweight",
        color: "text-orange-700",
        bg: "bg-orange-100",
      };
    return { label: "Obese", color: "text-red-700", bg: "bg-red-100" };
  };
  const status = getBMIStatus(bmi);
  const SCALE_MIN = 15;
  const SCALE_MAX = 40;
  const indicatorPercent = Math.min(
    Math.max(((bmi - SCALE_MIN) / (SCALE_MAX - SCALE_MIN)) * 100),
    100
  );
  const RulerInput = ({
    label,
    value,
    unit,
    min,
    max,
    colorTheme,
    onChange,
  }) => {
    const isOrange = colorTheme === "orange";
    const containerClass = isOrange ? "bg-orange-50" : "bg-blue-50";
    const labelColor = isOrange ? "text-orange-900/60" : "text-blue-900/60";
    const valueColor = isOrange ? "text-gray-800" : "text-gray-800";
    const tickColor = isOrange ? "bg-orange-300" : "bg-blue-300";
    const thumbBorder = isOrange ? "border-orange-400" : "border-blue-400";
    const ticks = Array.from({ length: 13 }).map((_, i) => {
      const isLong = i % 4 === 0;
      return (
        <div
          key={i}
          className={`w-[1.5px] rounded-full ${tickColor} ${
            isLong ? "h-3" : "h-1.5"
          }`}
        />
      );
    });
    return (
      <div
        className={`${containerClass} rounded-2xl p-4 flex flex-col justify-between relative`}
      >
        <div className="flex justify-between items-center mb-1">
          <span
            className={`text-[10px] font-bold uppercase tracking-wider ${labelColor}`}
          >
            {label}
          </span>
          <span className={`text-lg font-bold ${valueColor}`}>
            {value}{" "}
            <span className="text-xs font-medium opacity-60 ml-0.5">
              {unit}
            </span>
          </span>
        </div>
        {/* Ruler Visuals */}
        <div className="relative h-6 flex items-center mt-1">
          <div className="absolute inset-0 flex justify-between items-center px-1">
            {ticks}
          </div>
          {/* The native range input overlaid but transparent */}
          <input
            type="range"
            min={min}
            max={max}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="absolute inset-0 w-full opacity-0 cursor-pointer z-10"
          />
          {/* Custom Thumb Visual */}
          <div
            className="absolute top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-75"
            style={{
              left: `${((value - min) / (max - min)) * 100}%`,
              transform: `translateX(-50%) translateY(-50%)`,
            }}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white border-2 ${thumbBorder} shadow-sm`}
            ></div>
          </div>
        </div>
      </div>
    );
  };
  const BodyPoint = ({ top, left, label, value, side }) => {
    return (
      <div
        className="absolute flex items-center group pointer-events-none"
        style={{ top, left, transform: "translate(-50%, -50%)" }}
      >
        {/* The Dot */}
        <div className="relative z-10 w-3 h-3 bg-blue-600 rounded-full border-2 border-white shadow-sm ring-1 ring-blue-100"></div>
        {/* The Line & Label */}
        {side === "right" ? (
          <div className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center">
            <div className="w-6 h-px bg-blue-300"></div>
            <div className="ml-2 flex flex-col items-start leading-none">
              <span className="text-[10px] text-gray-400 font-medium mb-0.5">
                {label}
              </span>
              <span className="text-sm font-bold text-gray-700">{value}</span>
            </div>
          </div>
        ) : (
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-end">
            <div className="mr-2 flex flex-col items-end leading-none text-right">
              <span className="text-[10px] text-gray-400 font-medium mb-0.5">
                {label}
              </span>
              <span className="text-sm font-bold text-gray-700">{value}</span>
            </div>
            <div className="w-6 h-px bg-blue-300"></div>
          </div>
        )}
      </div>
    );
  };
  return (
    <div className="bg-white w-full rounded-4xl p-6 shadow-sm border border-gray-100 flex flex-col h-full relative">
      <h2 className="text-lg font-bold text-gray-800 mb-6">BMI Calculator</h2>
      {/* Top Section: Inputs & Result */}
      <div className="grid grid-cols-2 gap-x-5 gap-y-5 mb-2 relative z-10">
        <div className="flex flex-col gap-3">
          {/* Height ruler card */}
          <div className="rounded-2xl bg-linear-to-r from-orange-50 to-orange-100 p-3 sm:p-4 shadow-sm">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] sm:text-xs font-medium text-orange-700 uppercase tracking-wide">
                Height
              </span>
              <span className="text-base sm:text-lg font-semibold text-orange-800">
                {height} cm
              </span>
            </div>
            {/* Ruler-style track */}
            <div className="relative mt-1">
              <div className="h-1 bg-orange-200 rounded-full" />
              {/* Tick marks */}
              <div className="absolute inset-0 flex justify-between items-center px-0.5">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-px ${
                      i % 2 === 0 ? "h-3" : "h-2"
                    } bg-orange-400`}
                  />
                ))}
              </div>
              {/* Range input (transparent thumb over ruler) */}
              <input
                type="range"
                min="140"
                max="220"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="absolute inset-0 w-full appearance-none bg-transparent cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:h-4
                  [&::-webkit-slider-thumb]:w-4
                  [&::-webkit-slider-thumb]:rounded-full
                  [&::-webkit-slider-thumb]:bg-white
                  [&::-webkit-slider-thumb]:border
                  [&::-webkit-slider-thumb]:border-orange-500
                  [&::-webkit-slider-thumb]:shadow-md"
              />
            </div>
          </div>
          {/* Weight ruler card */}
          <div className="rounded-2xl bg-linear-to-r from-blue-50 to-blue-100 p-3 sm:p-4 shadow-sm">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] sm:text-xs font-medium text-blue-700 uppercase tracking-wide">
                Weight
              </span>
              <span className="text-base sm:text-lg font-semibold text-blue-800">
                {weight} kg
              </span>
            </div>
            {/* Ruler-style track */}
            <div className="relative mt-1">
              <div className="h-1 bg-blue-200 rounded-full" />
              {/* Tick marks */}
              <div className="absolute inset-0 flex justify-between items-center px-0.5">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-px ${
                      i % 2 === 0 ? "h-3" : "h-2"
                    } bg-blue-400`}
                  />
                ))}
              </div>
              {/* Range input (transparent thumb over ruler) */}
              <input
                type="range"
                min="40"
                max="150"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="absolute inset-0 w-full appearance-none bg-transparent cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:h-4
                  [&::-webkit-slider-thumb]:w-4
                  [&::-webkit-slider-thumb]:rounded-full
                  [&::-webkit-slider-thumb]:bg-white
                  [&::-webkit-slider-thumb]:border
                  [&::-webkit-slider-thumb]:border-blue-500
                  [&::-webkit-slider-thumb]:shadow-md"
              />
            </div>
          </div>
        </div>
        {/* Right Column: Result & Scale */}
        <div className="bg-blue-50/50 rounded-2xl p-4 flex flex-col justify-between border border-blue-50">
          <div>
            <p className="text-[10px] text-gray-500 font-medium mb-1">
              Body Mass Index (BMI)
            </p>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-gray-900 tracking-tight">
                {bmi}
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-1 rounded-full ${status.bg} ${status.color}`}
              >
                {status.label}
              </span>
            </div>
          </div>
          {/* Gradient Scale */}
          <div className="mt-4">
            <div className="relative h-2 rounded-full w-full bg-gray-200 mb-2 overflow-visible">
              {/* Gradient Bar */}
              <div
                className="absolute inset-0 rounded-full opacity-90"
                style={{
                  background: `linear-gradient(to right, 
                    #3b82f6 0%, 
                    #22c55e 35%, 
                    #eab308 55%, 
                    #f97316 75%, 
                    #ef4444 100%)`,
                }}
              ></div>
              {/* Indicator Triangle */}
              <div
                className="absolute top-1/2 w-4 h-4 bg-white border-2 border-blue-600 rounded-full shadow-md z-10 transition-all duration-300 ease-out flex items-center justify-center"
                style={{
                  left: `${indicatorPercent}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full "></div>
              </div>
            </div>
            {/* Scale Labels */}
            <div className="flex justify-between text-[9px] text-gray-400 font-medium px-0.5">
              <span>15</span>
              <span>18.5</span>
              <span>25</span>
              <span>30</span>
              <span>40</span>
            </div>
          </div>
        </div>
      </div>
      {/* Bottom Section: Body Visual */}
      <div className="flex-1 min-h-[300px] mt-4 relative">
        <img
          src={body}
          alt="Holistic Wellness Monitor Logo"
          className="h-full w-full object-cover rounded-xl"
        />
        <BodyPoint
          top="25%"
          left="48%"
          label="Chest (in)"
          value="44.5"
          side="left"
        />
        <BodyPoint top="45%" left="48%" label="Waist" value="34" side="left" />
      </div>
    </div>
  );
};
export default BMICalculator;
