import React, { useState } from "react";
import Navbar from "./Navbar";
import BMICalculator from "./BMICalculator";
import HealthOverview from "./HealthOverview";
import StepCount from "./StepCount";
import ChatBot from "./ChatBot";
import ScrollToTop from "./ScrollToTop";
import "../index.css";
function DashBoard() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  return (
    <div className="min-h-screen bg-linear-to-br from-sky-100 via-indigo-100 to-violet-100">
      <Navbar />
      <main className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-6 lg:gap-6">
          <div className="flex">
            <BMICalculator />
          </div>
          <div className="flex flex-col gap-5">
            <HealthOverview />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StepCount />
          </div>
        </div>
        <ChatBot isOpen={isChatOpen} setIsOpen={setIsChatOpen} />
        <ScrollToTop hide={isChatOpen} />
      </main>
    </div>
  );
}
export default DashBoard;
