import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import AuthLayout from "./AuthLayout";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [resetUrl, setResetUrl] = useState(null);
  const { resetPassword, error, setError } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage("");
    setResetUrl(null);

    const result = await resetPassword(email);
    setIsLoading(false);

    if (result.success) {
      setMessage(result.message);
      if (result.resetUrl) {
        setResetUrl(result.resetUrl);
      }
    }
  };

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Enter your email to reset password"
      footerText="Remember your password?"
      footerLinkText="Sign in"
      footerLinkTo="/login"
    >
      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg">
            {message}
            {resetUrl && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-1">Development / Antivirus Fallback</p>
                <p className="text-sm text-blue-800 mb-2">
                  Since actual email sending was blocked (likely by antivirus), here is the link:
                </p>
                <a
                  href={resetUrl}
                  className="block w-full text-center bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition"
                >
                  Reset Password Now
                </a>
              </div>
            )}
          </div>
        )}

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            placeholder="youremail@example.com"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Sending..." : "Reset Password"}
        </button>

        <div className="text-center">
          <Link
            to="/login"
            className="text-sm text-blue-600 hover:text-blue-800 transition"
          >
            ← Back to login
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default ResetPassword;
