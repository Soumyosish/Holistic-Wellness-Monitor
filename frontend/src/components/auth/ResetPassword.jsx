import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import AuthLayout from "./AuthLayout";
import { Mail } from "lucide-react";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [resetUrl, setResetUrl] = useState(null);
  const [emailSent, setEmailSent] = useState(false);
  const { resetPassword, error, setError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage("");
    setResetUrl(null);

    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    const result = await resetPassword(email);
    setIsLoading(false);

    if (result.success) {
      setMessage(result.message);
      setEmailSent(true);

      // If in development mode and resetUrl is provided
      if (result.resetUrl) {
        setResetUrl(result.resetUrl);
      }

      // Clear form
      setEmail("");
    }
  };

  return (
    <AuthLayout
      title="Reset Your Password"
      subtitle="Enter your email to receive password reset instructions"
      footerText="Remember your password?"
      footerLinkText="Sign in"
      footerLinkTo="/login"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg text-sm">
            <p className="font-medium">Error</p>
            <p>{error}</p>
          </div>
        )}

        {message && emailSent && (
          <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-lg text-sm">
            <p className="font-medium mb-2">✓ Email Sent Successfully</p>
            <p>{message}</p>
            {resetUrl && (
              <div className="mt-3 p-3 bg-green-100 rounded text-green-800 break-all">
                <p className="text-xs font-semibold mb-1">
                  Development Mode - Reset Link:
                </p>
                <a
                  href={resetUrl}
                  className="text-blue-600 hover:underline text-xs"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {resetUrl}
                </a>
              </div>
            )}
          </div>
        )}

        {!emailSent && (
          <>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-800 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50/50 hover:bg-gray-50"
                  placeholder="your.email@example.com"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                We'll send you a link to reset your password
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2.5 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm"
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </button>
          </>
        )}

        {emailSent && (
          <button
            type="button"
            onClick={() => {
              setEmailSent(false);
              setMessage("");
              setResetUrl(null);
            }}
            className="w-full bg-gray-200 text-gray-800 py-2.5 px-4 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400/30 transition-all duration-200 font-semibold text-sm"
          >
            Reset Another Account
          </button>
        )}

        <div className="relative py-3">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate("/login")}
          className="w-full border-2 border-gray-300 text-gray-700 py-2.5 px-4 rounded-lg hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 font-semibold text-sm"
        >
          Back to Sign In
        </button>
      </form>
    </AuthLayout>
  );
};

export default ResetPassword;
