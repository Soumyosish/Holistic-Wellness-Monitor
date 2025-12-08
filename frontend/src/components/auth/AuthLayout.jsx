import React from "react";
import { Link } from "react-router-dom";
import image from "../../assets/login.png";

const AuthLayout = ({
  title,
  subtitle,
  children,
  footerText,
  footerLinkText,
  footerLinkTo,
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#d4d7dd]">
      {/* Outer rounded card like screenshot */}
      <div className="w-full max-w-5xl bg-linear-to-r from-[#f7f5f0] to-[#f7f3e8] rounded-4xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">
        {/* Left content (form) */}
        <div className="w-full lg:w-[55%] flex flex-col justify-between px-8 py-8 sm:px-10 sm:py-10">
          {/* Top brand */}
          <div className="flex justify-start mb-6">
            <div className="inline-flex items-center justify-center px-4 py-1 rounded-full border border-gray-300 bg-white/70 text-sm font-semibold text-gray-800 shadow-sm">
              Hollistic Wellness Monitor
            </div>
          </div>

          {/* Main form area */}
          <div className="flex-1 flex flex-col justify-center">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-1 text-sm text-gray-500 max-w-xs">{subtitle}</p>
            )}

            <div className="mt-6 bg-transparent">{children}</div>
          </div>

          {/* Bottom footer links */}
          {(footerText || footerLinkText) && (
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] sm:text-xs text-gray-500">
              <span>
                {footerText}{" "}
                <Link
                  to={footerLinkTo}
                  className="font-medium text-gray-800 underline-offset-2 hover:underline"
                >
                  {footerLinkText}
                </Link>
              </span>
            </div>
          )}
        </div>

        {/* Right image panel */}
        <div className="w-full lg:w-[45%] bg-transparent flex items-stretch justify-stretch">
          <div className="m-4 sm:m-6 lg:m-6 bg-black rounded-4xl overflow-hidden relative flex-1">
            <img
              src={image}
              alt="Sign in illustration"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
