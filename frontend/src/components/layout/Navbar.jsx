import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.jpg";
const Navbar = ({ user, logout }) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  // State for menus and modal
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const profileMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setShowMobileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleProfileClick = () => {
    setShowProfileMenu((prev) => !prev);
    setShowMobileMenu(false);
  };

  const handleMobileMenuClick = () => {
    setShowMobileMenu((prev) => !prev);
    setShowProfileMenu(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user || !user.name) return "U";
    return user.name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Get user name or email for display
  const getUserDisplayName = () => {
    if (!user) return "Guest";
    return user.name || user.email?.split("@")[0] || "User";
  };

  // Get user email for display
  const getUserEmail = () => {
    if (!user) return "Not logged in";
    return user.email || "user@example.com";
  };

  // Get user age for display (if available)
  const getUserAge = () => {
    if (!user || !user.age) return "Age not set";
    return `${user.age} Years Old`;
  };

  return (
    <header className="w-full flex justify-center px-2 sm:px-4 pt-3 pb-4 sticky top-0 z-40">
      <div className="w-full max-w-7xl flex items-center justify-between rounded-3xl bg-white/90 backdrop-blur-xl shadow-lg px-3 sm:px-6 py-2 sm:py-3">
        {/* Left: Logo + App name */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => navigate("/")}
            className="p-1.5 sm:p-2 rounded-full text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-300 mr-1 sm:mr-2"
            aria-label="Back to Home"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 sm:h-6 sm:w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>

          <div className="flex items-center justify-center h-9 w-9 sm:h-10 sm:w-10 rounded-xl overflow-hidden bg-linear-to-tr from-sky-500 to-indigo-500 text-white shadow-md">
            <img
              src={logo}
              alt="Holistic Wellness Monitor Logo"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="leading-tight">
            <span className="block text-sm sm:text-lg font-bold bg-linear-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent">
              Holistic
            </span>
            <span className="block text-sm sm:text-lg font-bold bg-linear-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent -mt-0.5">
              Wellness Monitor
            </span>
          </div>
        </div>

        {/* Center: Search bar - Hidden on mobile */}
        <div className="hidden md:flex flex-1 justify-center px-4 lg:px-6">
          <div className="flex items-center w-full max-w-md rounded-full bg-white border border-slate-200 shadow-sm px-4 py-2 gap-3 hover:border-sky-300 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-slate-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="7" />
              <line x1="16.5" y1="16.5" x2="21" y2="21" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search health metrics, reports..."
              className="flex-1 bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="text-slate-400 hover:text-slate-600"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Right: Icons + Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile menu button */}
          <button
            type="button"
            onClick={handleMobileMenuClick}
            className="lg:hidden flex items-center justify-center h-9 w-9 rounded-full bg-white border border-slate-200 shadow-sm text-slate-600 hover:bg-slate-50 transition"
            aria-label="Menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Profile menu */}
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={handleProfileClick}
              className="flex items-center gap-2 sm:gap-3 rounded-full bg-white border border-slate-200 shadow-sm px-3 sm:px-4 py-1.5 sm:py-2 hover:bg-slate-50 transition"
            >
              <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-linear-to-tr from-sky-400 to-indigo-400 flex items-center justify-center text-xs sm:text-sm font-semibold text-white">
                {getUserInitials()}
              </div>
              <div className="hidden lg:flex flex-col leading-tight text-left">
                <span className="text-sm font-medium text-slate-800">
                  {getUserDisplayName()}
                </span>
                <span className="text-xs text-slate-500">
                  {user ? getUserAge() : "Not logged in"}
                </span>
              </div>
              <svg
                className={`h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-500 transition-transform ${
                  showProfileMenu ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Profile dropdown menu */}
            {showProfileMenu && (
              <div className="md:absolute md:right-0 md:mt-2 md:w-56 fixed inset-x-3 top-20 md:inset-auto md:top-auto bg-white rounded-2xl shadow-xl border border-slate-200 z-50 py-2">
                <div className="px-4 py-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-linear-to-tr from-sky-400 to-indigo-400 flex items-center justify-center text-sm font-semibold text-white">
                      {getUserInitials()}
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">
                        {getUserDisplayName()}
                      </p>
                      <p className="text-xs text-slate-500">{getUserEmail()}</p>
                      {user?.age && (
                        <p className="text-xs text-slate-400 mt-1">
                          Age: {user.age}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="py-2">
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setShowProfileMenu(false);
                    }}
                    className="w-full px-4 py-3 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-3"
                  >
                    <svg
                      className="h-5 w-5 text-slate-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span>My Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      navigate("/");
                      setTimeout(() => {
                        const contactSection =
                          document.getElementById("contact");
                        if (contactSection)
                          contactSection.scrollIntoView({ behavior: "smooth" });
                      }, 100);
                      setShowProfileMenu(false);
                    }}
                    className="w-full px-4 py-3 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-3"
                  >
                    <svg
                      className="h-5 w-5 text-slate-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <span>Contact Us</span>
                  </button>
                  <div className="border-t border-slate-100 my-2" />
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 flex items-center gap-3"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

    </header>
  );
};

export default Navbar;
