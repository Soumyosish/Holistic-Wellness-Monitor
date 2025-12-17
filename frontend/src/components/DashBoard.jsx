import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "./Navbar";
import BMICalculator from "./BMICalculator";
import HealthOverview from "./HealthOverview";
import StepCount from "./StepCount";
import ProfileSummaryCard from "./ProfileSummaryCard";
import TodaysMeals from "./TodaysMeals";
import MacroChartWidget from "./MacroChartWidget";
import WaterTracker from "./WaterTracker";
import SleepTracker from "./SleepTracker";
import WorkoutWidget from "./WorkoutWidget";
import GamificationWidget from "./GamificationWidget";
import ChatBot from "./ChatBot";
import ScrollToTop from "./ScrollToTop";
import "../index.css";

function DashBoard() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-linear-to-br from-sky-100 via-indigo-100 to-violet-100">
      <Navbar user={user} logout={logout} />
      <main className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {/* Row 1: BMI (Left) & Health Overview (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6 mb-6">
          <BMICalculator />
          <HealthOverview />
        </div>

        {/* Row 2: Nutrition, Steps, Achievements (One Line) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <TodaysMeals />
          <StepCount />
          <GamificationWidget />
        </div>

        {/* Row 3: Water, Sleep & Workouts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <WaterTracker />
          <SleepTracker />
          <WorkoutWidget />
        </div>

        <ChatBot isOpen={isChatOpen} setIsOpen={setIsChatOpen} />
        <ScrollToTop hide={isChatOpen} />
      </main>
    </div>
  );
}

export default DashBoard;
