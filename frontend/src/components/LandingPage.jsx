import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
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
  MessageSquare,
  AlertCircle,
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

const useScrollAnimation = () => {
  const elementRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(elementRef.current);
      }
    };
  }, []);

  return [elementRef, isVisible];
};

const Blob = ({ className }) => (
  <div
    className={`absolute rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-blob ${className}`}
  ></div>
);

const FadeInSection = ({ children, delay = 0, className = "" }) => {
  const [ref, isVisible] = useScrollAnimation();
  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

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
    <div className="bg-emerald-950/20 backdrop-blur-xl border border-emerald-500/20 rounded-3xl p-6 h-full flex flex-col justify-between hover:border-emerald-500/50 transition-colors duration-500 hover:shadow-[0_0_30px_rgba(16,185,129,0.1)]">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
          <Scale className="text-emerald-500" size={20} />
        </div>
        <h3 className="text-lg font-bold text-white">BMI Calculator</h3>
      </div>

      <div className="space-y-6 mb-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400 font-medium">HEIGHT</span>
            <span className="text-lg font-bold text-white">{height} cm</span>
          </div>
          <input
            type="range"
            min="100"
            max="220"
            value={height}
            onChange={(e) => setHeight(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400 font-medium">WEIGHT</span>
            <span className="text-lg font-bold text-white">{weight} kg</span>
          </div>
          <input
            type="range"
            min="30"
            max="150"
            value={weight}
            onChange={(e) => setWeight(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-green-500 [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(34,197,94,0.5)] transition-all"
          />
        </div>
      </div>

      <div className="text-center mb-6 p-4 rounded-2xl bg-white/5 border border-white/5">
        <div className="text-5xl font-extrabold text-white mb-1 tracking-tight">
          {bmi}
        </div>
        <div
          className={`text-sm font-bold uppercase tracking-wide ${bmiStatus.color}`}
        >
          {bmiStatus.status}
        </div>
        <div className="text-xs text-gray-500 mt-2">Body Mass Index</div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-center">
        <div className="p-3 rounded-xl bg-white/5 border border-white/5">
          <div className="text-xs text-gray-400 mb-1 uppercase tracking-wider">
            Chest
          </div>
          <div className="text-lg font-bold text-white">44.5"</div>
        </div>
        <div className="p-3 rounded-xl bg-white/5 border border-white/5">
          <div className="text-xs text-gray-400 mb-1 uppercase tracking-wider">
            Waist
          </div>
          <div className="text-lg font-bold text-white">34"</div>
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
    <div className="bg-cyan-950/20 backdrop-blur-xl border border-cyan-500/20 rounded-3xl p-6 h-full flex flex-col hover:border-cyan-500/50 transition-colors duration-500 hover:shadow-[0_0_30px_rgba(6,182,212,0.1)]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
            <Droplets className="text-cyan-500" size={20} />
          </div>
          <h3 className="text-lg font-bold text-white">Hydration</h3>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white leading-none">
            {totalIntake}ml
          </div>
          <div className="text-xs text-gray-400">Goal: {dailyGoal}ml</div>
        </div>
      </div>

      <div className="mb-6 relative group cursor-pointer">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-400">Daily Progress</span>
          <span className="text-white font-bold">{percentage.toFixed(0)}%</span>
        </div>
        <div className="h-4 bg-gray-800 rounded-full overflow-hidden border border-white/5">
          <div
            className="h-full bg-linear-to-r from-blue-500 to-cyan-400 rounded-full relative overflow-hidden animate-pulse"
            style={{ width: `${percentage}%` }}
          >
            <div className="absolute top-0 left-0 w-full h-full bg-linear-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
          </div>
        </div>
      </div>

      <div className="h-48 min-h-48 grow">
        <ResponsiveContainer width="100%" height="100%" minHeight={192}>
          <BarChart data={waterData}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#3f3f46"
              opacity={0.1}
            />
            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#71717a", fontSize: 10 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#71717a", fontSize: 10 }}
              domain={[0, 600]}
            />
            <Tooltip
              cursor={{ fill: "rgba(255,255,255,0.05)" }}
              contentStyle={{
                backgroundColor: "#18181b",
                borderColor: "#27272a",
                color: "#fff",
                borderRadius: "12px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
              }}
              formatter={(value) => [`${value}ml`, "Amount"]}
            />
            <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
              {waterData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.amount >= entry.goal ? "#0ea5e9" : "#3b82f6"}
                  opacity={0.8}
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
              opacity={0.5}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <div className="p-2 rounded-xl bg-blue-500/5 border border-blue-500/10">
          <div className="text-[10px] text-blue-400 uppercase tracking-wider mb-1">
            Morning
          </div>
          <div className="text-sm font-bold text-white">750ml</div>
        </div>
        <div className="p-2 rounded-xl bg-cyan-500/5 border border-cyan-500/10">
          <div className="text-[10px] text-cyan-400 uppercase tracking-wider mb-1">
            Afternoon
          </div>
          <div className="text-sm font-bold text-white">850ml</div>
        </div>
        <div className="p-2 rounded-xl bg-blue-500/5 border border-blue-500/10">
          <div className="text-[10px] text-blue-400 uppercase tracking-wider mb-1">
            Evening
          </div>
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

  // Scroll-linked animation logic
  useEffect(() => {
    const handleScroll = () => {
      const element = document.getElementById("data-terminal");
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate how much of the element has been scrolled through
      // 0 = element just entered viewport from bottom
      // 1 = element is fully visible (or centered)
      const start = windowHeight * 0.8; // Start animating when it's 20% up the screen
      const end = windowHeight * 0.2; // Finish when it's near the top

      // Map position to 0-1 range
      const progress = Math.max(
        0,
        Math.min(1, (start - rect.top) / (start - end))
      );

      const totalLines = terminalOutput.length;
      const linesToShow = Math.floor(progress * totalLines);

      const newVisibleLines = terminalOutput
        .slice(0, linesToShow)
        .map((line) => line.id);
      setVisibleLines(newVisibleLines);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial position

    return () => window.removeEventListener("scroll", handleScroll);
  }, [terminalOutput]);

  const getLineColor = (type) => {
    switch (type) {
      case "command":
        return "text-fuchsia-400";
      case "success":
        return "text-emerald-400 font-bold";
      case "info":
        return "text-cyan-400";
      case "data":
        return "text-purple-300";
      case "cursor":
        return "text-fuchsia-500";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div
      id="data-terminal"
      className="bg-[#0a0a0a] border border-fuchsia-500/20 rounded-3xl overflow-hidden h-full flex flex-col shadow-[0_0_50px_rgba(217,70,239,0.15)] hover:border-fuchsia-500/50 transition-colors duration-500"
    >
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-fuchsia-500/20 bg-[#121214]">
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/50 hover:bg-red-500 transition-colors"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/50 hover:bg-yellow-500 transition-colors"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/50 hover:bg-green-500 transition-colors"></div>
          </div>
          <span className="text-xs font-mono text-gray-500 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            terminal
          </span>
        </div>
        <div className="text-xs text-gray-600 font-mono hidden sm:block">
          hwm-cli v2.1.4
        </div>
      </div>

      {/* Terminal Content */}
      <div className="p-6 font-mono font-sm grow overflow-hidden relative">
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-[#0a0a0a]/50 pointer-events-none z-10"></div>
        <div className="space-y-3">
          {terminalOutput.map((line) => (
            <div
              key={line.id}
              className={`${getLineColor(
                line.type
              )} transition-all duration-500 ease-out transform ${
                visibleLines.includes(line.id)
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-4"
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
                <span className="ml-2 px-2 py-0.5 rounded text-[10px] bg-white/5 border border-white/5 font-bold tracking-wider">
                  {line.value}{" "}
                  <span className="text-gray-500 font-normal">{line.unit}</span>
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
      className={`p-8 rounded-2xl bg-linear-to-br ${grad} border ${border} hover:-translate-y-2 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/10 bg-black/40 backdrop-blur-sm group`}
    >
      <h3 className="text-5xl font-extrabold text-white mb-2 tracking-tight group-hover:scale-105 transition-transform origin-left">
        {formatNumber(count)}
      </h3>
      <p className="font-bold text-gray-200 mb-3 text-lg">{label}</p>
      <p className="text-sm text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
        {sub}
      </p>
    </div>
  );
};

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: "How does Holistic Wellness Monitor track my health data?",
      answer:
        "Our platform integrates seamlessly with popular apps like Google Fit. It aggregates real-time data on steps, heart rate, sleep quality, and active calories to provide a unified health dashboard.",
    },
    {
      question: "Is my personal health data secure and private?",
      answer:
        "Security is our top priority. We use military-grade AES-256 encryption for all data transmission and storage. We adhere to strict HIPAA and GDPR compliance standards, ensuring your sensitive health information is never shared with third parties without your explicit consent.",
    },
    {
      question: "Can I generate reports to share with my doctor?",
      answer:
        "Absolutely. You can generate comprehensive PDF health reports with a single click. These reports include trends, vital signs history, and anomaly detection summaries, making it easy for your healthcare provider to understand your long-term health journey. We are implementing it to be updated in the future",
    },
    {
      question: "What are the feature present in the website",
      answer:
        "The user can track steps maintain their health by tracking the daily intake of the food and also have a proper diet plan.",
    },
    {
      question: "Can I solve my doubts?",
      answer:
        "Yes, you have full privileged to the chatbot feature where you can ask your doubts for instant support. We are also having the contact form where you can send your query and we will solve it.",
    },
  ];

  const handleFAQClick = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 px-6 relative" id="faq">
      <div className="absolute inset-0 bg-linear-to-b from-[#020617] to-indigo-950/20 pointer-events-none"></div>
      <div className="max-w-4xl mx-auto relative z-10">
        <FadeInSection>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              <span className="bg-linear-to-r from-cyan-200 via-blue-200 to-indigo-300 bg-clip-text text-transparent">
                Frequently Asked Questions
              </span>
            </h2>
            <p className="text-gray-400">
              Everything you need to know about getting started.
            </p>
          </div>
        </FadeInSection>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FadeInSection key={index} delay={index * 100}>
              <div
                className={`group rounded-2xl border transition-all duration-300 overflow-hidden ${
                  openIndex === index
                    ? "bg-white/5 border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.1)]"
                    : "bg-white/5 border-white/5 hover:border-white/10 hover:bg-white/[0.07]"
                }`}
              >
                <button
                  onClick={() => handleFAQClick(index)}
                  className="w-full text-left p-6 flex flex-row items-center justify-between focus:outline-none"
                >
                  <span
                    className={`text-lg font-semibold transition-colors duration-300 ${
                      openIndex === index ? "text-cyan-300" : "text-gray-200"
                    }`}
                  >
                    {faq.question}
                  </span>
                  <div
                    className={`relative flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${
                      openIndex === index
                        ? "bg-cyan-500/20 rotate-180"
                        : "bg-white/5 group-hover:bg-white/10"
                    }`}
                  >
                    <ChevronDown
                      size={20}
                      className={`transition-colors duration-300 ${
                        openIndex === index ? "text-cyan-400" : "text-gray-400"
                      }`}
                    />
                  </div>
                </button>
                <div
                  className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${
                    openIndex === index ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-6 pb-6 pt-0">
                      <p className="text-gray-400 leading-relaxed border-t border-white/5 pt-4">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeInSection>
          ))}
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

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState("");

  const handleSubscribe = async () => {
    if (!newsletterEmail) return;

    try {
      // Use existing API base URL logic or default
      const API_BASE_URL = import.meta.env.VITE_API_URL
        ? `${import.meta.env.VITE_API_URL.replace(/\/$/, "")}/api`
        : "http://localhost:8000/api";

      const response = await axios.post(`${API_BASE_URL}/newsletter`, {
        email: newsletterEmail,
      });

      if (response.data.success) {
        setNewsletterStatus("You have been subscribed");
        setNewsletterEmail("");
        setTimeout(() => {
          setNewsletterStatus("");
        }, 3000);
      }
    } catch (error) {
      setNewsletterStatus(error.response?.data?.msg || "Subscription failed");
      setTimeout(() => {
        setNewsletterStatus("");
      }, 3000);
    }
  };

  const scrollToSection = (sectionId) => {
    setActiveNav(sectionId);
    if (sectionId === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
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
    <div className="min-h-screen bg-[#020617] text-white selection:bg-cyan-500/30 font-sans overflow-x-hidden relative">
      <div className="fixed inset-0 bg-linear-to-b from-indigo-950/20 via-[#020617] to-[#020617] -z-50 pointer-events-none"></div>
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 transition-all duration-300 supports-backdrop-filter:bg-[#020617]/60">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => {
              navigate("/");
              window.scrollTo({ top: 0, behavior: "smooth" });
              setActiveNav("home");
            }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-300" />
              <Activity
                className="text-cyan-400 relative z-10 group-hover:scale-110 transition-transform duration-300"
                size={28}
              />
            </div>
            <span className="text-xl font-bold tracking-tight bg-linear-to-r from-cyan-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent group-hover:opacity-80 transition-opacity">
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
                className={`relative px-4 py-2 rounded-full transition-all duration-300 overflow-hidden group ${
                  activeNav === item.id
                    ? "text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <div
                  className={`absolute inset-0 bg-linear-to-r from-orange-500/20 to-orange-600/10 transition-opacity duration-300 ${
                    activeNav === item.id
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-100"
                  }`}
                />
                <div
                  className={`absolute inset-0 border border-orange-500/30 rounded-full transition-opacity duration-300 ${
                    activeNav === item.id
                      ? "opacity-100 shadow-[0_0_15px_rgba(249,115,22,0.3)]"
                      : "opacity-0 group-hover:opacity-50"
                  }`}
                />
                <span className="relative z-10">{item.label}</span>
              </button>
            ))}
          </div>
          {renderAuthButtons()}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden min-h-[90vh] flex flex-col justify-center">
        {/* Ambient Glows */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <Blob className="bg-indigo-600/40 w-[500px] h-[500px] top-0 left-1/4 -translate-x-1/2 -translate-y-1/2 blur-[120px] animation-delay-2000 mix-blend-screen" />
          <Blob className="bg-cyan-600/40 w-[500px] h-[500px] bottom-0 right-1/4 translate-x-1/2 translate-y-1/2 blur-[120px] animation-delay-4000 mix-blend-screen" />
          <Blob className="bg-fuchsia-600/30 w-[400px] h-[400px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 blur-[100px] mix-blend-screen" />
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-8 animate-fade-in-up backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span className="text-xs font-bold text-indigo-200 tracking-wide uppercase">
              v2.0 Now Live
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 bg-linear-to-r from-white via-cyan-100 to-indigo-200 bg-clip-text text-transparent min-h-[140px] flex items-center justify-center filter drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
            <AnimatedText text="Health That Speaks Through Visuals" />
          </h1>

          <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-in-up opacity-0 animation-delay-2000 font-light">
            Track every heartbeat, step, sleep, and vital sign with real-time
            insights—all in one intuitive dashboard.
          </p>

          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up opacity-0"
            style={{ animationDelay: "0.4s" }}
          >
            <Button
              size="lg"
              onClick={handleGetStarted}
              className="w-full sm:w-auto text-lg bg-linear-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:shadow-[0_0_50px_rgba(6,182,212,0.6)] hover:-translate-y-1 transition-all duration-300 border-0"
            >
              Start Monitoring Free
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => scrollToSection("features")}
              className="w-full sm:w-auto text-lg hover:-translate-y-1 transition-all duration-300"
            >
              Explore Features
            </Button>
          </div>
        </div>
      </section>

      {/* Health Metrics Section - Terminal Layout */}
      <section className="py-24 px-6 relative" id="features">
        <div className="absolute inset-0 bg-[#08080a] opacity-80 z-0"></div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-linear-to-l from-orange-500/5 to-transparent pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              <span className="bg-linear-to-r from-white to-gray-500 bg-clip-text text-transparent">
                Power in Your Hands
              </span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Advanced visualization tools designed to help you understand your
              body better.
            </p>
          </div>

          {/* Terminal Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column - BMI Calculator */}
            <div className="lg:col-span-3 space-y-6">
              <FadeInSection delay={0}>
                <div className="hover:scale-[1.02] transition-transform duration-500">
                  <BMICalculator />
                </div>
              </FadeInSection>
            </div>

            {/* Middle Column - Terminal */}
            <div className="lg:col-span-5">
              <FadeInSection delay={200}>
                <div className="shadow-2xl shadow-green-500/10 hover:shadow-green-500/20 transition-all duration-500">
                  <DataTerminal />
                </div>
              </FadeInSection>
            </div>

            {/* Right Column - Health Overview */}
            <div className="lg:col-span-4 space-y-6">
              <FadeInSection delay={400}>
                <div className="hover:scale-[1.02] transition-transform duration-500">
                  <WaterIntakeChart />
                </div>
              </FadeInSection>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-6 relative overflow-hidden">
        <Blob className="bg-fuchsia-600/20 w-[600px] h-[600px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 blur-[150px] mix-blend-screen" />
        <div className="max-w-7xl mx-auto relative z-10">
          <FadeInSection>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                <span className="bg-linear-to-r from-cyan-200 via-indigo-300 to-purple-300 bg-clip-text text-transparent">
                  Numbers That Matter
                </span>
              </h2>
              <p className="text-gray-400">
                Real data from our community of health-conscious users.
              </p>
            </div>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FadeInSection delay={100} className="h-full">
              <Counter
                end={1400}
                label="Exercises Logged"
                sub="Using visual and time-based tracking"
                grad="from-amber-500/20 to-orange-600/10"
                border="border-amber-500/20 hover:border-amber-500/50"
              />
            </FadeInSection>
            <FadeInSection delay={200} className="h-full">
              <Counter
                end={7.2}
                label="Avg Sleep Tracked"
                sub="Increase in 40% deep sleep modes"
                grad="from-indigo-500/20 to-blue-600/10"
                border="border-indigo-500/20 hover:border-indigo-500/50"
              />
            </FadeInSection>
            <FadeInSection delay={300} className="h-full">
              <Counter
                end={98.7}
                label="% User Retention"
                sub="Users who stick to their daily health goals"
                grad="from-emerald-500/20 to-teal-600/10"
                border="border-emerald-500/20 hover:border-emerald-500/50"
              />
            </FadeInSection>
            <FadeInSection delay={400} className="h-full">
              <Counter
                end="1K+"
                label="Active Users"
                sub="Active daily users across multiple platforms"
                grad="from-rose-500/20 to-pink-600/10"
                border="border-rose-500/20 hover:border-rose-500/50"
              />
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 border-b border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-white/10 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-6 mb-16">
          <FadeInSection>
            <h2 className="text-3xl md:text-5xl font-bold text-center">
              <span className="bg-linear-to-r from-orange-200 via-rose-200 to-pink-300 bg-clip-text text-transparent">
                Community Trust
              </span>
            </h2>
          </FadeInSection>
        </div>

        {/* Infinite Scroll Container */}
        <div className="relative w-full overflow-hidden">
          {/* Gradients for fading edges */}
          <div className="absolute left-0 top-0 bottom-0 w-12 md:w-32 bg-linear-to-r from-[#050505] to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-12 md:w-32 bg-linear-to-l from-[#050505] to-transparent z-10 pointer-events-none"></div>

          <div className="flex animate-infinite-scroll w-max gap-8 hover:[animation-play-state:paused] py-4">
            {/* Original Set */}
            {[
              {
                rating: "4.8",
                text: "This app revolutionized how I track my health. The visual insights are stunning and easy to understand.",
                author: "Sara Ghosh.",
                role: "Yoga Instructor",
                color: "bg-orange-500",
              },
              {
                rating: "4.5",
                text: "Finally, a wellness monitor that looks as good as it functions. The dark mode is perfect for night checking.",
                author: "Monish Raj",
                role: "Tech Professional",
                color: "bg-blue-500",
              },
              {
                rating: "4.7",
                text: "Data security was my main concern, but HWM's transparent privacy policies put me at ease.",
                author: "Ashok Kumar.",
                role: "Physician",
                color: "bg-green-500",
              },
              {
                rating: "4.9",
                text: "The hydration tracker is a game changer. I've never been this consistent with my water intake.",
                author: "Sivan Singh.",
                role: "Athlete",
                color: "bg-cyan-500",
              },
            ].map((item, i) => (
              <div
                key={`original-${i}`}
                className="w-[350px] md:w-[400px] shrink-0"
              >
                <div className="p-8 rounded-3xl bg-indigo-950/20 backdrop-blur-md border border-indigo-500/10 h-full flex flex-col justify-between hover:border-indigo-500/30 transition-colors duration-500 group hover:shadow-[0_0_20px_rgba(99,102,241,0.1)]">
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <div className="text-4xl font-bold text-white">
                        {item.rating}
                      </div>
                      <div className="flex gap-1 text-orange-500">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} fill="currentColor" size={16} />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-400 leading-relaxed mb-6 italic">
                      "{item.text}"
                    </p>
                  </div>
                  <div className="flex items-center gap-4 pt-6 border-t border-white/5">
                    <div
                      className={`w-10 h-10 rounded-full ${
                        item.color
                      }/20 flex items-center justify-center text-${
                        item.color.split("-")[1]
                      }-500 font-bold`}
                    >
                      {item.author.charAt(0)}
                    </div>
                    <div>
                      <div className="text-white font-medium">
                        {item.author}
                      </div>
                      <div className="text-xs text-gray-500">{item.role}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Duplicate Set for Seamless Loop */}
            {[
              {
                rating: "4.8",
                text: "This app revolutionized how I track my health. The visual insights are stunning and easy to understand.",
                author: "Sarah J.",
                role: "Yoga Instructor",
                color: "bg-orange-500",
              },
              {
                rating: "4.9",
                text: "Finally, a wellness monitor that looks as good as it functions. The dark mode is perfect for night checking.",
                author: "Michael C.",
                role: "Tech Professional",
                color: "bg-blue-500",
              },
              {
                rating: "4.7",
                text: "Data security was my main concern, but HWM's transparent privacy policies put me at ease.",
                author: "Dr. Emily R.",
                role: "Physician",
                color: "bg-green-500",
              },
              {
                rating: "4.9",
                text: "The hydration tracker is a game changer. I've never been this consistent with my water intake.",
                author: "David K.",
                role: "Athlete",
                color: "bg-cyan-500",
              },
            ].map((item, i) => (
              <div
                key={`duplicate-${i}`}
                className="w-[350px] md:w-[400px] shrink-0"
              >
                <div className="p-8 rounded-3xl bg-indigo-950/20 backdrop-blur-md border border-indigo-500/10 h-full flex flex-col justify-between hover:border-indigo-500/30 transition-colors duration-500 group hover:shadow-[0_0_20px_rgba(99,102,241,0.1)]">
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <div className="text-4xl font-bold text-white">
                        {item.rating}
                      </div>
                      <div className="flex gap-1 text-orange-500">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} fill="currentColor" size={16} />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-400 leading-relaxed mb-6 italic">
                      "{item.text}"
                    </p>
                  </div>
                  <div className="flex items-center gap-4 pt-6 border-t border-white/5">
                    <div
                      className={`w-10 h-10 rounded-full ${
                        item.color
                      }/20 flex items-center justify-center text-${
                        item.color.split("-")[1]
                      }-500 font-bold`}
                    >
                      {item.author.charAt(0)}
                    </div>
                    <div>
                      <div className="text-white font-medium">
                        {item.author}
                      </div>
                      <div className="text-xs text-gray-500">{item.role}</div>
                    </div>
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

        <div className="max-w-4xl mx-auto">
          <FadeInSection>
            <div className="glass-panel p-10 md:p-16 rounded-3xl relative z-10 flex flex-col md:flex-row items-center gap-12 bg-slate-900/30 backdrop-blur-2xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] hover:border-white/20 transition-colors duration-500">
              <div className="flex-1">
                <div className="mb-6 overflow-hidden rounded-2xl relative group">
                  <div className="absolute inset-0 bg-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
                  <img
                    src={email}
                    alt="Health Monitoring Dashboard"
                    className="w-full h-64 object-cover rounded-2xl group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-linear-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  Let's get you <br />
                  started
                </h2>
                <p className="text-gray-400 mb-6">
                  Join thousands of users who transformed their health journey
                  with visual insights.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-300">
                    <div className="p-1 rounded-full bg-green-500/10 text-green-500">
                      <CheckCircle size={14} />
                    </div>
                    <span>Real-time health tracking</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-300">
                    <div className="p-1 rounded-full bg-green-500/10 text-green-500">
                      <CheckCircle size={14} />
                    </div>
                    <span>Secure & private data</span>
                  </div>
                </div>
              </div>

              <div className="flex-1 w-full">
                <div className="space-y-4">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Full Name *"
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-orange-500 focus:bg-white/10 focus:outline-none transition-all w-full text-white placeholder-gray-500"
                        defaultValue={user?.name || ""}
                        readOnly={!!user}
                      />
                      <input
                        type="email"
                        placeholder="Email *"
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-orange-500 focus:bg-white/10 focus:outline-none transition-all w-full text-white placeholder-gray-500"
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
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-orange-500 focus:bg-white/10 focus:outline-none transition-all text-white placeholder-gray-500"
                    />
                    <textarea
                      placeholder="Type Your Message..."
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-orange-500 focus:bg-white/10 focus:outline-none transition-all h-32 resize-none text-white placeholder-gray-500"
                    ></textarea>

                    {status.msg && (
                      <div
                        className={`text-sm p-3 rounded-xl ${
                          status.type === "success"
                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                            : "bg-red-500/20 text-red-400 border border-red-500/30"
                        }`}
                      >
                        {status.msg}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full justify-center shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40"
                      >
                        {isSubmitting ? "Sending..." : "Send Message"}{" "}
                        <ArrowRight
                          size={16}
                          className="ml-2 group-hover:translate-x-1 transition-transform"
                        />
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>

      <footer className="py-12 px-6 border-t border-white/5 bg-[#020617] relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-linear-to-r from-transparent via-white/10 to-transparent"></div>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
            {/* Brand Column */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-linear-to-br from-orange-500/20 to-orange-600/10 rounded-xl border border-orange-500/20">
                  <Activity className="text-orange-500" size={24} />
                </div>
                <span className="text-2xl font-bold bg-linear-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  Holistic Wellness Monitor
                </span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed max-w-sm font-light">
                Track every heartbeat, step, sleep, and vital sign with
                real-time insights—all in one intuitive dashboard.
              </p>
              <div className="flex items-center gap-4">
                {[
                  {
                    icon: Linkedin,
                    href: "https://linkedin.com/in/soumyosishpal",
                    color:
                      "hover:text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/20",
                  },
                  {
                    icon: Github,
                    href: "https://github.com/Soumyosish",
                    color:
                      "hover:text-white hover:bg-white/10 hover:border-white/20",
                  },
                  {
                    icon: Mail,
                    href: "mailto:support@holisticwellness.com",
                    color:
                      "hover:text-orange-400 hover:bg-orange-500/10 hover:border-orange-500/20",
                  },
                ].map((social, i) => (
                  <a
                    key={i}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center transition-all duration-300 hover:scale-110 ${social.color}`}
                  >
                    <social.icon
                      size={18}
                      className="text-gray-400 transition-colors"
                    />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-bold mb-6 text-lg tracking-tight">
                Quick Links
              </h4>
              <ul className="space-y-4">
                {[
                  {
                    label: "Home",
                    icon: Home,
                    action: () => scrollToSection("home"),
                  },
                  {
                    label: "Dashboard",
                    icon: LayoutDashboard,
                    action: () => {
                      navigate("/dashboard");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    },
                  },
                  {
                    label: "FAQ",
                    icon: HelpCircle,
                    action: () => scrollToSection("faq"),
                  },
                  {
                    label: "Contact",
                    icon: Mail,
                    action: () => scrollToSection("contact"),
                  },
                ].map((link, i) => (
                  <li key={i}>
                    <button
                      onClick={link.action}
                      className="text-gray-400 hover:text-white transition-all duration-300 text-sm flex items-center gap-3 group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500/0 group-hover:bg-orange-500 transition-all duration-300"></span>
                      <span className="group-hover:translate-x-1 transition-transform">
                        {link.label}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h4 className="text-white font-bold mb-6 text-lg tracking-tight">
                Legal
              </h4>
              <ul className="space-y-4">
                {[
                  "Privacy Policy",
                  "Terms of Service",
                  "Cookie Policy",
                  "Disclaimer",
                ].map((item, i) => (
                  <li key={i}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-all duration-300 text-sm group flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500/0 group-hover:bg-orange-500 transition-all duration-300"></span>
                      <span className="group-hover:translate-x-1 transition-transform">
                        {item}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="text-white font-bold mb-6 text-lg tracking-tight">
                Stay Updated
              </h4>
              <p className="text-gray-400 text-xs mb-4">
                Subscribe to our newsletter for the latest health tips and
                feature updates.
              </p>
              <div className="relative group">
                <input
                  type="email"
                  placeholder="Enter email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:border-orange-500 focus:bg-white/10 focus:outline-none transition-all text-white placeholder-gray-600 pr-10"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSubscribe();
                    }
                  }}
                />
                <button
                  onClick={handleSubscribe}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-orange-500 rounded-lg text-white opacity-0 group-focus-within:opacity-100 transition-all hover:bg-orange-600"
                >
                  <ArrowRight size={14} />
                </button>
              </div>
              {newsletterStatus && (
                <div
                  className={`text-xs mt-2 ${
                    newsletterStatus.includes("success") ||
                    newsletterStatus.includes("subscribed")
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {newsletterStatus}
                </div>
              )}
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm text-center md:text-left">
              &copy; {new Date().getFullYear()} Holistic Wellness Monitor. All
              rights reserved.
            </p>
            <div className="flex items-center gap-1.5 text-sm text-gray-500 bg-white/5 px-4 py-2 rounded-full border border-white/5">
              <span>Made with</span>
              <Heart
                size={14}
                className="text-red-500 fill-red-500 animate-pulse"
              />
              <span>by Soumyosish Pal</span>
            </div>
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
