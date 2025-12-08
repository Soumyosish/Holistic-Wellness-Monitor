import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import email from "../assets/email.jpg";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import {
  LayoutDashboard,
  Activity,
  Calendar,
  Utensils,
  Settings,
  Search,
  Bell,
  User,
  Maximize2,
  Zap,
  Flame,
  Moon,
  Footprints,
  PlayCircle,
  ArrowRight,
  Play,
  Star,
  CheckCircle,
  ChevronRight,
  Thermometer,
  Heart,
  Droplets,
  TrendingUp,
  Target,
  Scale,
  LineChart as LineChartIcon,
  CloudRain,
  ChevronDown,
  ChevronUp,
  Home,
  Mail,
  Phone,
  MapPin,
  HelpCircle,
  Shield,
  FileText,
  Globe,
  Linkedin,
  Github,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center rounded-full font-medium transition-all focus:outline-none disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    primary:
      "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg shadow-orange-500/25 border border-transparent",
    secondary:
      "bg-white text-black hover:bg-gray-100 border border-transparent",
    outline:
      "bg-transparent border border-white/20 text-white hover:bg-white/10",
    ghost: "bg-transparent text-gray-400 hover:text-white hover:bg-white/5",
  };

  const sizes = {
    sm: "h-8 px-4 text-xs",
    md: "h-10 px-6 text-sm",
    lg: "h-12 px-8 text-base",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
const BMICalculator = () => {
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(72);
  const [bmi, setBmi] = useState(24.9);

  useEffect(() => {
    const heightInMeters = height / 100;
    const calculatedBmi = weight / (heightInMeters * heightInMeters);
    setBmi(calculatedBmi.toFixed(1));
  }, [height, weight]);

  const getBmiStatus = (bmi) => {
    if (bmi < 18.5) return { status: "Underweight", color: "text-yellow-500" };
    if (bmi < 25) return { status: "Normal weight", color: "text-green-500" };
    if (bmi < 30) return { status: "Overweight", color: "text-orange-500" };
    return { status: "Obesity", color: "text-red-500" };
  };

  const bmiStatus = getBmiStatus(bmi);

  return (
    <div className="bg-[#121214] border border-white/5 rounded-3xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <Scale className="text-blue-500" size={20} />
        <h3 className="text-lg font-bold text-white">BMI Calculator</h3>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">HEIGHT</span>
            <span className="text-lg font-bold text-white">{height} cm</span>
          </div>
          <input
            type="range"
            min="100"
            max="220"
            value={height}
            onChange={(e) => setHeight(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>100</span>
            <span>220 cm</span>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">WEIGHT</span>
            <span className="text-lg font-bold text-white">{weight} kg</span>
          </div>
          <input
            type="range"
            min="30"
            max="150"
            value={weight}
            onChange={(e) => setWeight(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-green-500"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>30</span>
            <span>150 kg</span>
          </div>
        </div>
      </div>

      <div className="text-center mb-6">
        <div className="text-4xl font-bold text-white mb-1">{bmi}</div>
        <div className={`text-sm font-medium ${bmiStatus.color}`}>
          {bmiStatus.status}
        </div>
        <div className="text-xs text-gray-500 mt-1">Body Mass Index (BMI)</div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-center">
        <div className="p-3 rounded-xl bg-white/5">
          <div className="text-sm text-gray-400 mb-1">Chest (in)</div>
          <div className="text-lg font-bold text-white">44.5</div>
        </div>
        <div className="p-3 rounded-xl bg-white/5">
          <div className="text-sm text-gray-400 mb-1">Waist</div>
          <div className="text-lg font-bold text-white">34</div>
        </div>
      </div>
    </div>
  );
};

const HealthOverview = () => {
  return (
    <div className="bg-[#121214] border border-white/5 rounded-3xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-white">Health Overview</h3>
          <p className="text-sm text-gray-400">
            Live view of your key health metrics
          </p>
        </div>
        <Button variant="ghost" size="sm">
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-white/5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">
                BLOOD SUGAR (fasting)
              </span>
              <span className="text-lg font-bold text-white">90 mg/dL</span>
            </div>
            <div className="text-xs text-gray-500 mb-3">
              Target range 70-140
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 w-[65%] rounded-full"></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0</span>
              <span>100</span>
              <span>200</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">
                HEART RATE (resting)
              </span>
              <span className="text-lg font-bold text-white">72 bpm</span>
            </div>
            <div className="text-xs text-gray-500 mb-3">
              Healthy range 60-100 bpm
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 w-[72%] rounded-full"></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>40</span>
              <span>60</span>
              <span>100</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">BLOOD PRESSURE</span>
              <span className="text-lg font-bold text-white">120/80</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-gray-500 mb-1">Systolic</div>
                <div className="text-sm font-medium text-white">120 mmHg</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Diastolic</div>
                <div className="text-sm font-medium text-white">80 mmHg</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="p-4 rounded-xl bg-linear-to-br from-blue-500/10 to-purple-500/10 border border-white/5">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="text-red-500" size={20} />
            <h4 className="font-bold text-white">Health Risk Summary</h4>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Overall Health</span>
              <span className="text-sm font-bold text-green-500">Good</span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 w-[85%] rounded-full"></div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-sm text-gray-400">Last check-up</span>
              </div>
              <span className="text-sm text-white">1 day ago</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                <span className="text-sm text-gray-400">Next appointment</span>
              </div>
              <span className="text-sm text-white">Feb 16, 2025</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span className="text-sm text-gray-400">Medications</span>
              </div>
              <span className="text-sm text-white">None</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                <span className="text-sm text-gray-400">Allergies</span>
              </div>
              <span className="text-sm text-white">None</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StepCounter = () => {
  const stepsData = [
    { time: "Morning", steps: 2450, percentage: 70 },
    { time: "Afternoon", steps: 3210, percentage: 90 },
    { time: "Evening", steps: 1506, percentage: 45 },
  ];

  return (
    <div className="bg-[#121214] border border-white/5 rounded-3xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-white">Step Count</h3>
          <p className="text-xs text-gray-400">
            Click title to pull today's steps from Google Fit
          </p>
        </div>
        <div className="p-2 bg-green-500/10 rounded-lg">
          <Footprints className="text-green-500" size={20} />
        </div>
      </div>

      <div className="text-center mb-8">
        <div className="text-5xl font-bold text-white mb-2">7,166</div>
        <div className="text-sm text-gray-400">Today's steps</div>
      </div>

      <div className="space-y-4">
        {stepsData.map((item, index) => (
          <div key={index}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">{item.time}</span>
              <span className="text-white">{item.steps} steps</span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  index === 0
                    ? "bg-blue-500"
                    : index === 1
                    ? "bg-green-500"
                    : "bg-purple-500"
                }`}
                style={{ width: `${item.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-white/5">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Daily Goal</span>
          <span className="text-white">10,000 steps</span>
        </div>
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden mt-2">
          <div className="h-full bg-orange-500 w-[71%] rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

// Water Intake Chart Component
const WaterIntakeChart = () => {
  const waterData = [
    { time: "6 AM", amount: 250, goal: 500 },
    { time: "9 AM", amount: 500, goal: 500 },
    { time: "12 PM", amount: 350, goal: 500 },
    { time: "3 PM", amount: 500, goal: 500 },
    { time: "6 PM", amount: 300, goal: 500 },
    { time: "9 PM", amount: 200, goal: 500 },
  ];

  const totalIntake = waterData.reduce((sum, item) => sum + item.amount, 0);
  const dailyGoal = 2500;
  const percentage = Math.min(100, (totalIntake / dailyGoal) * 100);

  return (
    <div className="bg-[#121214] border border-white/5 rounded-3xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Droplets className="text-blue-500" size={20} />
          <h3 className="text-lg font-bold text-white">Daily Water Intake</h3>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white">{totalIntake}ml</div>
          <div className="text-xs text-gray-400">of {dailyGoal}ml</div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-400">Progress</span>
          <span className="text-white">{percentage.toFixed(0)}%</span>
        </div>
        <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-linear-to-r from-blue-400 to-cyan-400 rounded-full"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>

      <div className="h-48 min-h-48">
        <ResponsiveContainer width="100%" height="100%" minHeight={192}>
          <BarChart data={waterData}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#3f3f46"
              opacity={0.3}
            />
            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#a1a1aa", fontSize: 10 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#a1a1aa", fontSize: 10 }}
              domain={[0, 600]}
            />
            <Tooltip
              cursor={{ fill: "rgba(255,255,255,0.05)" }}
              contentStyle={{
                backgroundColor: "#18181b",
                borderColor: "#3f3f46",
                color: "#fff",
                borderRadius: "8px",
              }}
              formatter={(value) => [`${value}ml`, "Amount"]}
            />
            <Bar dataKey="amount" radius={[4, 4, 0, 0]} fill="#0ea5e9">
              {waterData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.amount >= entry.goal ? "#0ea5e9" : "#3b82f6"}
                />
              ))}
            </Bar>
            <Line
              type="monotone"
              dataKey="goal"
              stroke="#22c55e"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <div className="p-2 rounded-lg bg-blue-500/10">
          <div className="text-xs text-blue-400 mb-1">Morning</div>
          <div className="text-sm font-bold text-white">750ml</div>
        </div>
        <div className="p-2 rounded-lg bg-cyan-500/10">
          <div className="text-xs text-cyan-400 mb-1">Afternoon</div>
          <div className="text-sm font-bold text-white">850ml</div>
        </div>
        <div className="p-2 rounded-lg bg-blue-500/10">
          <div className="text-xs text-blue-400 mb-1">Evening</div>
          <div className="text-sm font-bold text-white">500ml</div>
        </div>
      </div>
    </div>
  );
};

const DataTerminal = () => {
  const [visibleLines, setVisibleLines] = useState([]);
  const [terminalOutput] = useState([
    { id: 1, command: "$ health-monitor --status", type: "command" },
    { id: 2, command: "> SYSTEM STATUS: ONLINE", type: "success" },
    { id: 3, command: "> LAST SYNC: 2 minutes ago", type: "info" },
    { id: 4, command: "> CONNECTED DEVICES: 3", type: "info" },
    {
      id: 5,
      command: "> HEART RATE: 72 BPM [NORMAL]",
      type: "data",
      value: "72",
      unit: "BPM",
    },
    {
      id: 6,
      command: "> BLOOD PRESSURE: 120/80 [OPTIMAL]",
      type: "data",
      value: "120/80",
      unit: "mmHg",
    },
    {
      id: 7,
      command: "> BLOOD SUGAR: 90 mg/dL [NORMAL]",
      type: "data",
      value: "90",
      unit: "mg/dL",
    },
    {
      id: 8,
      command: "> OXYGEN SATURATION: 98% [EXCELLENT]",
      type: "data",
      value: "98",
      unit: "%",
    },
    {
      id: 9,
      command: "> BODY TEMPERATURE: 36.8°C [NORMAL]",
      type: "data",
      value: "36.8",
      unit: "°C",
    },
    {
      id: 10,
      command: "> STRESS LEVEL: 42% [LOW]",
      type: "data",
      value: "42",
      unit: "%",
    },
    { id: 11, command: "$", type: "cursor" },
  ]);

  useEffect(() => {
    const timers = [];
    terminalOutput.forEach((line, index) => {
      const timer = setTimeout(() => {
        setVisibleLines((prev) => [...prev, line.id]);
      }, index * 300); // 300ms delay between each line
      timers.push(timer);
    });

    return () => timers.forEach((timer) => clearTimeout(timer));
  }, [terminalOutput]);

  const getLineColor = (type) => {
    switch (type) {
      case "command":
        return "text-green-400";
      case "success":
        return "text-green-500 font-bold";
      case "info":
        return "text-blue-400";
      case "data":
        return "text-cyan-400";
      case "cursor":
        return "text-green-400";
      default:
        return "text-gray-300";
    }
  };

  return (
    <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl overflow-hidden">
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#121214]">
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
          </div>
          <span className="text-sm font-mono text-gray-400">terminal</span>
        </div>
        <div className="text-xs text-gray-500 font-mono">
          Hollistic Wellness Monitor v2.1.4
        </div>
      </div>

      {/* Terminal Content */}
      <div className="p-6 font-mono">
        <div className="space-y-2">
          {terminalOutput.map((line) => (
            <div
              key={line.id}
              className={`${getLineColor(
                line.type
              )} transition-all duration-500 ${
                visibleLines.includes(line.id)
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-2"
              }`}
              style={{
                transitionDelay: `${line.id * 50}ms`,
              }}
            >
              {line.type === "cursor" ? (
                <span className="animate-pulse">{line.command}</span>
              ) : (
                line.command
              )}
              {line.value && (
                <span className="ml-2 px-2 py-1 rounded text-xs bg-white/5 border border-white/5">
                  {line.value}{" "}
                  <span className="text-gray-400">{line.unit}</span>
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const HeartRateChart = () => {
  const data = [
    { time: "6 PM", value: 72 },
    { time: "7 PM", value: 95 },
    { time: "8 PM", value: 110 },
    { time: "9 PM", value: 85 },
    { time: "10 PM", value: 68 },
    { time: "11 PM", value: 62 },
  ];

  return (
    <div className="h-[150px] min-h-[150px] w-full">
      <ResponsiveContainer width="100%" height="100%" minHeight={150}>
        <LineChart data={data}>
          <Tooltip
            contentStyle={{
              backgroundColor: "#18181b",
              borderColor: "#3f3f46",
              color: "#fff",
            }}
            itemStyle={{ color: "#fb923c" }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#fb923c"
            strokeWidth={3}
            dot={{ fill: "#fb923c", r: 4, strokeWidth: 0 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const SleepChart = () => {
  const data = [
    { day: "Mon", hours: 6.5 },
    { day: "Tue", hours: 7.2 },
    { day: "Wed", hours: 5.8 },
    { day: "Thu", hours: 8.1 },
    { day: "Fri", hours: 6.9 },
    { day: "Sat", hours: 9.0 },
    { day: "Sun", hours: 7.5 },
  ];

  return (
    <div className="h-[180px] min-h-[180px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%" minHeight={180}>
        <BarChart data={data} barSize={12}>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#3f3f46"
            opacity={0.3}
          />
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#a1a1aa", fontSize: 10 }}
            dy={10}
          />
          <Tooltip
            cursor={{ fill: "rgba(255,255,255,0.05)" }}
            contentStyle={{
              backgroundColor: "#18181b",
              borderColor: "#3f3f46",
              color: "#fff",
              borderRadius: "8px",
            }}
          />
          <Bar dataKey="hours" radius={[4, 4, 4, 4]}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.hours > 8 ? "#f97316" : "#52525b"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const ActivityChart = () => {
  const data = [
    { day: "Mon", val: 400 },
    { day: "Tue", val: 300 },
    { day: "Wed", val: 550 },
    { day: "Thu", val: 450 },
    { day: "Fri", val: 600 },
    { day: "Sat", val: 700 },
    { day: "Sun", val: 350 },
  ];

  return (
    <div className="h-[120px] w-full  min-h-[120px]">
      <ResponsiveContainer width="100%" height="100%" minHeight={120}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Tooltip
            contentStyle={{
              backgroundColor: "#18181b",
              borderColor: "#3f3f46",
              color: "#fff",
            }}
          />
          <Area
            type="monotone"
            dataKey="val"
            stroke="#22c55e"
            fillOpacity={1}
            fill="url(#colorVal)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

const AnimatedText = ({ text }) => {
  const [displayText, setDisplayText] = useState("");
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    let index = 0;
    setDisplayText("");
    setIsAnimating(true);

    const interval = setInterval(() => {
      setDisplayText(text.slice(0, index));
      index++;

      if (index > text.length) {
        clearInterval(interval);
        setIsAnimating(false);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [text]);

  return (
    <span className="bg-linear-to-b from-white to-gray-400 bg-clip-text text-transparent">
      {displayText}
      {isAnimating && <span className="animate-pulse ml-1">|</span>}
    </span>
  );
};

const Counter = ({ end, duration = 2000, label, sub, grad, border }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            let startTime = null;

            let targetValue,
              multiplier = 1,
              suffix = "";

            if (typeof end === "string") {
              if (end.includes("h")) {
                targetValue = parseFloat(end.replace("h", ""));
                suffix = "h";
              } else if (end.includes("%")) {
                targetValue = parseFloat(end.replace("%", ""));
                suffix = "%";
              } else if (
                end.includes("K") ||
                end.includes("k") ||
                end.includes("+")
              ) {
                targetValue = parseFloat(end.replace(/[Kk+]/g, ""));
                multiplier = 1000;
                // eslint-disable-next-line no-unused-vars
                suffix = "K+";
              } else {
                targetValue = parseFloat(end.replace(/,/g, ""));
              }
            } else {
              targetValue = end;
            }

            const actualTarget = targetValue * multiplier;

            const animate = (timestamp) => {
              if (!startTime) startTime = timestamp;
              const progress = timestamp - startTime;
              const percentage = Math.min(progress / duration, 1);

              const easeOutQuart = 1 - Math.pow(1 - percentage, 4);

              setCount(Math.floor(easeOutQuart * actualTarget));

              if (progress < duration) {
                requestAnimationFrame(animate);
              } else {
                setCount(actualTarget);
              }
            };

            requestAnimationFrame(animate);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(ref.current);
      }
    };
  }, [end, duration, hasAnimated]);

  const formatNumber = (num) => {
    if (typeof end === "string") {
      if (end.includes("h")) {
        const formatted = (num / 10).toFixed(1);
        return `${formatted}h`;
      } else if (end.includes("%")) {
        const formatted = (num / 10).toFixed(1);
        return `${formatted}%`;
      } else if (end.includes("K") || end.includes("k") || end.includes("+")) {
        if (num >= 1000) {
          return `${(num / 1000).toFixed(0)}K+`;
        }
        return `${num}+`;
      } else {
        return num.toLocaleString();
      }
    }
    return num.toLocaleString();
  };

  return (
    <div
      ref={ref}
      className={`p-8 rounded-2xl bg-linear-to-br ${grad} border ${border} hover:translate-y-[-5px] transition-transform duration-300`}
    >
      <h3 className="text-4xl font-bold text-white mb-2">
        {formatNumber(count)}
      </h3>
      <p className="font-semibold text-gray-200 mb-2">{label}</p>
      <p className="text-xs text-gray-400 leading-relaxed">{sub}</p>
    </div>
  );
};

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How does Holistic Wellness Monitor track my health data?",
      answer:
        "Our platform integrates with various health devices and apps like Google Fit to collect real-time data on your steps, sleep patterns, activity levels, and more. All data is encrypted and stored securely.",
    },
    {
      question: "Is my health data secure and private?",
      answer:
        "Yes, we take data privacy seriously. All your health data is encrypted end-to-end, and we never share your personal information with third parties without your explicit consent.",
    },
    {
      question: "Can I share my health data with my doctor?",
      answer:
        "Yes, you can easily generate and share comprehensive health reports with your healthcare provider through secure, encrypted links. You have full control over what data you share and with whom.",
    },
  ];

  const handleFAQClick = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      className="py-24 px-6 bg-linear-to-b from-[#050505] to-[#0a0a0a]"
      id="faq"
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`bg-[#121214] border rounded-2xl overflow-hidden transition-all duration-300 ${
                openIndex === index
                  ? "border-orange-500/50 shadow-[0_0_30px_rgba(249,115,22,0.3)]"
                  : "border-white/5 hover:border-white/10"
              }`}
            >
              <button
                className="w-full p-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
                onClick={() => handleFAQClick(index)}
              >
                <span className="text-lg font-medium text-white pr-8">
                  {faq.question}
                </span>
                {openIndex === index ? (
                  <ChevronUp className="text-orange-500 shrink-0" size={24} />
                ) : (
                  <ChevronDown className="text-gray-400 shrink-0" size={24} />
                )}
              </button>
              {openIndex === index && (
                <div className="px-6 pb-6 animate-fade-in">
                  <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-12 pt-8 border-t border-white/5">
          <p className="text-gray-400 mb-6">Still have questions?</p>
          <Button
            variant="primary"
            onClick={() => {
              const contactSection = document.getElementById("contact");
              if (contactSection) {
                contactSection.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            Contact Our Support Team
          </Button>
        </div>
      </div>
    </section>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();
  const { user, sendContactMessage } = useAuth();
  const [activeNav, setActiveNav] = useState("home");
  const [formData, setFormData] = useState({ subject: "", message: "" });
  const [status, setStatus] = useState({ type: "", msg: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (window.location.hash === "#contact") {
      scrollToSection("contact");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: "", msg: "" });

    const result = await sendContactMessage(formData);

    if (result.success) {
      setStatus({ type: "success", msg: result.message });
      setFormData({ subject: "", message: "" });
    } else {
      setStatus({ type: "error", msg: result.error });
    }
    setIsSubmitting(false);
  };

  const handleGetStarted = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/register");
    }
  };

  const handleSignIn = () => {
    navigate("/login");
  };

  const scrollToSection = (sectionId) => {
    setActiveNav(sectionId);
    if (sectionId === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (sectionId === "contact") {
      const contactSection = document.getElementById("contact");
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: "smooth" });
      }
    } else if (sectionId === "faq") {
      const faqSection = document.getElementById("faq");
      if (faqSection) {
        faqSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  };
  const renderAuthButtons = () => {
    if (user) {
      return (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-linear-to-tr from-sky-400 to-indigo-400 flex items-center justify-center text-xs font-semibold text-white">
              {user.name?.charAt(0)}
            </div>
            <span className="text-sm font-medium text-gray-300">
              {user.name}
            </span>
          </div>
          <Button
            size="sm"
            onClick={() => navigate("/dashboard")}
            className="relative overflow-hidden group"
          >
            <span className="relative z-10">Dashboard</span>
          </Button>
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-4">
          <button
            className="text-sm font-medium text-gray-300 hover:text-orange-400 transition-colors px-4 py-2 rounded-full hover:bg-white/5"
            onClick={handleSignIn}
          >
            Sign In
          </button>
          <Button
            size="sm"
            onClick={handleGetStarted}
            className="relative overflow-hidden group"
          >
            <span className="relative z-10">Get Started</span>
          </Button>
        </div>
      );
    }
  };
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-orange-500/30 font-sans overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-[#050505]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => {
              navigate("/");
              window.scrollTo({ top: 0, behavior: "smooth" });
              setActiveNav("home");
            }}
          >
            <Activity
              className="text-orange-500 group-hover:scale-110 transition-transform duration-300"
              size={24}
            />
            <span className="text-xl font-bold tracking-tight bg-linear-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
              Holistic Wellness Monitor
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            {[
              { id: "home", label: "Home" },
              { id: "dashboard", label: "Dashboard" },
              { id: "faq", label: "FAQ" },
              { id: "contact", label: "Contact" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === "dashboard") {
                    if (user) {
                      navigate("/dashboard");
                    } else {
                      navigate("/login");
                    }
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  } else {
                    scrollToSection(item.id);
                  }
                }}
                className={`relative px-4 py-2 rounded-full transition-all duration-300 ${
                  activeNav === item.id
                    ? "text-white bg-linear-to-r from-orange-500/20 to-orange-600/10 border border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.3)]"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {item.label}
                {activeNav === item.id && (
                  <span className="absolute inset-0 rounded-full border border-orange-500/50 animate-ping opacity-75"></span>
                )}
              </button>
            ))}
          </div>
          {renderAuthButtons()}
          {/* <div className="flex items-center gap-4">
            <button
              className="text-sm font-medium text-gray-300 hover:text-orange-400 transition-colors px-4 py-2 rounded-full hover:bg-white/5"
              onClick={handleSignIn}
            >
              Sign In
            </button>
            <Button
              size="sm"
              onClick={handleGetStarted}
              className="relative overflow-hidden group"
            >
              <span className="relative z-10">Get Started</span>
              <span className="absolute inset-0 bg-linear-to-r from-orange-600 to-orange-700 translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
            </Button>
          </div> */}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-orange-500/20 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none animate-pulse"></div>
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none animate-pulse delay-1000"></div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 bg-linear-to-b from-white to-gray-400 bg-clip-text text-transparent min-h-[120px] md:min-h-[140px] flex items-center justify-center">
            <AnimatedText text="Health That Speaks Through Visuals" />
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up opacity-0">
            Track every heartbeat, step, sleep, and vital sign with real-time
            insights—all in one intuitive dashboard.
          </p>
        </div>
      </section>

      {/* Health Metrics Section - Terminal Layout */}
      <section className="py-3 px-2 bg-[#08080a]" id="features">
        <div className="max-w-7xl mx-auto">
          {/* Terminal Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in-up opacity-0">
            {/* Left Column - BMI Calculator */}
            <div className="lg:col-span-3">
              <BMICalculator />
            </div>

            {/* Middle Column - Terminal */}
            <div className="lg:col-span-5">
              <DataTerminal />
            </div>

            {/* Right Column - Health Overview */}
            <div className="lg:col-span-4">
              <WaterIntakeChart />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Holistic Wellness Monitor Facts
            </h2>
            <p className="text-gray-400">
              Real data from our community of health-conscious users.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Counter
              end={1400}
              label="Exercises Logged"
              sub="Using visual and time-based tracking"
              grad="from-orange-500/20 to-orange-900/5"
              border="border-orange-500/30"
            />
            <Counter
              end={7.2}
              label="Avg Sleep Tracked"
              sub="Increase in 40% deep sleep modes"
              grad="from-blue-500/20 to-blue-900/5"
              border="border-blue-500/30"
            />
            <Counter
              end={98.7}
              label="% User Retention"
              sub="Users who stick to their daily health goals"
              grad="from-yellow-500/20 to-yellow-900/5"
              border="border-yellow-500/30"
            />
            <Counter
              end="1K+"
              label="Active Users"
              sub="Active daily users across multiple platforms"
              grad="from-red-500/20 to-red-900/5"
              border="border-red-500/30"
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">
            Testimonials
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="p-10 rounded-3xl bg-linear-to-br from-[#18181b] to-black border border-white/5 flex flex-col justify-center text-center lg:text-left animate-fade-in-up opacity-0">
              <div className="text-6xl font-bold text-white mb-2">4.8</div>
              <div className="flex justify-center lg:justify-start gap-1 text-orange-500 mb-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} fill="currentColor" size={20} />
                ))}
              </div>
              <p className="text-sm text-gray-400">
                500+ reviews
                <br />
                Across iOS, Android and TrustPilot
              </p>
            </div>

            {[
              {
                text: "Holistic Wellness Monitor helped me finally connect the dots between my sleep and my mood. The visuals are clear, and I actually want to check it daily.",
                author: "Ishita Bhosle",
                role: "Wellness Coach",
              },
              {
                text: "Tracking steps is easy. But Holistic Wellness Monitor made me rethink why I was tired even after 8 hours of sleep. It's now my daily dashboard.",
                author: "Ashok Kumar",
                role: "UX Researcher",
              },
            ].map((review, i) => (
              <div
                key={i}
                className="p-10 rounded-3xl bg-[#121214] border border-white/5 relative flex flex-col animate-fade-in-up opacity-0"
                style={{ animationDelay: `${(i + 1) * 200}ms` }}
              >
                <p className="text-lg leading-relaxed text-gray-300 mb-8 italic">
                  "{review.text}"
                </p>
                <div className="mt-auto flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden">
                    <img
                      src={`https://picsum.photos/seed/${i + 15}/200`}
                      alt="user"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-sm">
                      {review.author}
                    </h5>
                    <span className="text-xs text-gray-500">{review.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection />
      <section className="py-24 px-6 relative overflow-hidden" id="contact">
        {/* Background glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-orange-500/10 blur-[100px] rounded-full pointer-events-none animate-pulse"></div>

        <div className="max-w-4xl mx-auto glass-panel p-10 md:p-16 rounded-3xl relative z-10 flex flex-col md:flex-row items-center gap-12 animate-fade-in-up opacity-0">
          <div className="flex-1">
            <div className="mb-6 overflow-hidden rounded-2xl">
              <img
                src={email}
                alt="Health Monitoring Dashboard"
                className="w-full h-64 object-cover rounded-2xl hover:scale-105 transition-transform duration-500"
              />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Let's get you <br />
              started
            </h2>
            <p className="text-gray-400 mb-4">
              Join thousands of users who transformed their health journey with
              visual insights.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <CheckCircle size={16} className="text-green-500" />
              <span>Real-time health tracking</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <CheckCircle size={16} className="text-green-500" />
              <span>Secure & private data</span>
            </div>
          </div>

          <div className="flex-1 w-full">
            <div className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Full Name *"
                    className="bg-white/5 border-b border-white/20 px-4 py-3 text-sm focus:border-orange-500 focus:outline-none transition-colors w-full"
                    defaultValue={user?.name || ""}
                    readOnly={!!user}
                  />
                  <input
                    type="email"
                    placeholder="Email *"
                    className="bg-white/5 border-b border-white/20 px-4 py-3 text-sm focus:border-orange-500 focus:outline-none transition-colors w-full"
                    defaultValue={user?.email || ""}
                    readOnly={!!user}
                  />
                </div>
                <input
                  type="text"
                  placeholder="Your Goal (Subject)"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  required
                  className="w-full bg-white/5 border-b border-white/20 px-4 py-3 text-sm focus:border-orange-500 focus:outline-none transition-colors"
                />
                <textarea
                  placeholder="Type Your Message..."
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  required
                  className="w-full bg-white/5 border-b border-white/20 px-4 py-3 text-sm focus:border-orange-500 focus:outline-none transition-colors h-24 resize-none"
                ></textarea>

                {status.msg && (
                  <div
                    className={`text-sm p-3 rounded ${
                      status.type === "success"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {status.msg}
                  </div>
                )}

                <div className="flex items-center justify-between pt-4">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Sending..." : "Send Message"}{" "}
                    <ArrowRight size={14} className="ml-2" />
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 px-6 border-t border-white/5 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <Activity className="text-orange-500" size={28} />
                <span className="text-2xl font-bold">
                  Holistic Wellness Monitor
                </span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-md">
                Track every heartbeat, step, sleep, and vital sign with
                real-time insights—all in one intuitive dashboard.
              </p>
              <div className="flex items-center gap-4">
                <a
                  href="https://linkedin.com/in/soumyosishpal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors hover:scale-110 hover:shadow-[0_0_15px_rgba(37,99,235,0.3)]"
                >
                  <Linkedin
                    size={18}
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                  />
                </a>
                <a
                  href="https://github.com/Soumyosish"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors hover:scale-110 hover:shadow-[0_0_15px_rgba(156,163,175,0.3)]"
                >
                  <Github
                    size={18}
                    className="text-gray-400 hover:text-white transition-colors"
                  />
                </a>
                <a
                  href="mailto:support@holisticwellness.com"
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors hover:scale-110 hover:shadow-[0_0_15px_rgba(249,115,22,0.3)]"
                >
                  <Mail
                    size={18}
                    className="text-gray-400 hover:text-orange-400 transition-colors"
                  />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-bold mb-6 text-lg">Quick Links</h4>
              <ul className="space-y-4">
                <li>
                  <button
                    onClick={() => scrollToSection("home")}
                    className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2 group"
                  >
                    <Home
                      size={16}
                      className="group-hover:text-orange-500 transition-colors"
                    />
                    Home
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      navigate("/dashboard");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2 group"
                  >
                    <LayoutDashboard
                      size={16}
                      className="group-hover:text-orange-500 transition-colors"
                    />
                    Dashboard
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("faq")}
                    className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2 group"
                  >
                    <HelpCircle
                      size={16}
                      className="group-hover:text-orange-500 transition-colors"
                    />
                    FAQ
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("contact")}
                    className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2 group"
                  >
                    <Mail
                      size={16}
                      className="group-hover:text-orange-500 transition-colors"
                    />
                    Contact
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-white font-bold mb-6 text-lg">Contact Us</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 group">
                  <Mail
                    className="text-gray-400 mt-0.5 group-hover:text-orange-500 transition-colors"
                    size={16}
                  />
                  <span className="text-gray-400 text-sm group-hover:text-white transition-colors">
                    support@holisticwellness.com
                  </span>
                </li>
                <li className="flex items-start gap-3 group">
                  <Phone
                    className="text-gray-400 mt-0.5 group-hover:text-orange-500 transition-colors"
                    size={16}
                  />
                  <span className="text-gray-400 text-sm group-hover:text-white transition-colors">
                    +91 9876543210
                  </span>
                </li>
                <li className="flex items-start gap-3 group">
                  <MapPin
                    className="text-gray-400 mt-0.5 group-hover:text-orange-500 transition-colors"
                    size={16}
                  />
                  <span className="text-gray-400 text-sm group-hover:text-white transition-colors">
                    Hollistic Wellness Centre, New Delhi, India
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-16 pt-8 border-t border-white/5">
            <p className="text-gray-500 text-sm text-center">
              Copyright © 2025 Holistic Wellness Monitor. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Custom CSS for animations and glass effect */}
      <style>{`
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  .animate-fade-in-up {
    animation: fadeInUp 0.8s ease forwards;
  }
  
  .animate-fade-in {
    animation: fadeIn 0.3s ease forwards;
  }
  
  .glass-panel {
    background: rgba(24, 24, 27, 0.6);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.05);
  }
  
  @keyframes glow {
    0%, 100% {
      box-shadow: 0 0 5px rgba(249, 115, 22, 0.5);
    }
    50% {
      box-shadow: 0 0 20px rgba(249, 115, 22, 0.8);
    }
  }
  
  .animate-glow {
    animation: glow 2s infinite;
  }
`}</style>
    </div>
  );
};

export default LandingPage;
