import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import AuthLayout from "./AuthLayout";
import { Eye, EyeOff, Lock } from "lucide-react";
import axios from "axios";

const ResetPasswordConfirm = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [validating, setValidating] = useState(true);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const { token } = useParams();
  const navigate = useNavigate();
  const { resetPasswordConfirm, error, setError } = useAuth();

  const API_BASE_URL = import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL.replace(/\/$/, "")}/api`
    : "http://localhost:8000/api";

  // Validate token on mount
  useEffect(() => {
    const validateToken = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/auth/reset-password/${token}`
        );
        if (response.status === 200) {
          console.log("✓ Token is valid");
        }
      } catch (err) {
        const errorMsg =
          err.response?.data?.msg || "Invalid or expired reset link";
        setError(errorMsg);
        console.error("❌ Token validation failed:", errorMsg);
        setTimeout(() => navigate("/reset-password"), 2000);
      } finally {
        setValidating(false);
      }
    };

    if (token) {
      validateToken();
    } else {
      setError("No reset token provided");
      setValidating(false);
      setTimeout(() => navigate("/reset-password"), 2000);
    }
  }, [token, navigate, setError, API_BASE_URL]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage("");

    // Validation
    if (!password || !confirmPassword) {
      setError("Please enter and confirm your password");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    const result = await resetPasswordConfirm(token, password);
    setIsLoading(false);

    if (result.success) {
      setSuccess(true);
      setMessage(
        result.message ||
          "Password successfully reset! Redirecting to login..."
      );
      setPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        navigate("/login");
      }, 2500);
    }
  };

  if (validating) {
    return (
      <AuthLayout
        title="Validating..."
        subtitle="Please wait while we verify your reset link"
      >
        <div className="flex flex-col items-center justify-center py-12">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-blue-200 border-t-blue-600"></div>
          <p className="mt-4 text-gray-600 font-medium">
            Validating reset link...
          </p>
          <p className="text-sm text-gray-500 mt-1">
            This may take a few seconds
          </p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Set Your New Password"
      subtitle="Create a strong password for your account"
      footerText="Remember your password?"
      footerLinkText="Sign in"
      footerLinkTo="/login"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && !success && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg text-sm animate-in">
            <p className="font-medium">⚠ Error</p>
            <p>{error}</p>
          </div>
        )}

        {message && success && (
          <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-lg text-sm animate-in">
            <p className="font-medium">✓ Success</p>
            <p>{message}</p>
          </div>
        )}

        {!success && (
          <>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-800 mb-2"
              >
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50/50 hover:bg-gray-50"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Must be at least 6 characters
              </p>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-semibold text-gray-800 mb-2"
              >
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50/50 hover:bg-gray-50"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                  disabled={isLoading}
                >
                  {showConfirmPassword ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Must match the password above
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-900">
                <span className="font-semibold">💡 Password Tips:</span>
                <br />• Use at least one uppercase letter
                <br />• Include numbers and special characters
                <br />• Avoid using your name or email
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2.5 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm"
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </button>
          </>
        )}

        {success && (
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-2.5 px-4 rounded-lg hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:ring-offset-2 transition-all duration-200 font-semibold text-sm"
          >
            Go to Sign In
          </button>
        )}
      </form>
    </AuthLayout>
  );
};

export default ResetPasswordConfirm;
