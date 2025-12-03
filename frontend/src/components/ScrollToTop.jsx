import React, { useState, useEffect } from "react";
const ScrollToTop = ({ hide }) => {
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);
  return (
    <div className="fixed top-120 right-6 z-50">
      {" "}
      {/* Changed z-40 to z-50 */}
      {!hide && isVisible && (
        <button
          onClick={scrollToTop}
          className="group relative flex items-center justify-center w-12 h-12 bg-linear-to-br from-blue-500 to-blue-300 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Scroll to top"
        >
          {/* Arrow Icon */}
          <svg
            className="w-5 h-5 transform transition-transform duration-300 group-hover:-translate-y-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block">
            <div className="relative">
              <div className="bg-gray-800 text-white text-xs py-1 px-2 rounded-lg whitespace-nowrap">
                Scroll to top
                <div className="absolute top-full right-3 -mt-1 border-4 border-transparent border-t-gray-800"></div>
              </div>
            </div>
          </div>
          {/* Pulse animation */}
          <span className="absolute inset-0 rounded-xl animate-ping bg-blue-400 opacity-20"></span>
        </button>
      )}
    </div>
  );
};
export default ScrollToTop;
