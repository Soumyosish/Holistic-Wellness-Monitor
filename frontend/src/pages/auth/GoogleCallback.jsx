// src/components/auth/GoogleCallback.jsx
import { useEffect } from "react";

const GoogleCallback = () => {
  useEffect(() => {
    const handleCallback = () => {
      try {
        // FIX: Check BOTH hash AND query parameters
        const hash = window.location.hash.substring(1);
        const urlParams = new URLSearchParams(window.location.search);

        console.log("URL Hash:", hash); // Debug
        console.log("URL Search:", window.location.search); // Debug

        // Check for authorization code in query parameters
        const code = urlParams.get("code");

        // Check for access token in hash (fallback)
        const hashParams = new URLSearchParams(hash);
        const accessToken = hashParams.get("access_token");

        console.log("Code from query:", code); // Debug
        console.log("Access token from hash:", accessToken); // Debug

        if (code) {
          // Send authorization code to parent window
          window.opener.postMessage(
            {
              type: "GOOGLE_AUTH_CODE",
              code,
            },
            window.location.origin
          );
        } else if (accessToken) {
          // Fallback: send access token if no code
          window.opener.postMessage(
            {
              type: "GOOGLE_AUTH_SUCCESS",
              accessToken,
            },
            window.location.origin
          );
        } else {
          const error = urlParams.get("error") || hashParams.get("error");
          throw new Error(
            error || "No authorization code or access token received"
          );
        }

        // Close popup
        setTimeout(() => {
          window.close();
        }, 1000);
      } catch (error) {
        console.error("Google callback error:", error);
        window.opener.postMessage(
          {
            type: "GOOGLE_AUTH_ERROR",
            error: error.message,
          },
          window.location.origin
        );

        setTimeout(() => {
          window.close();
        }, 1000);
      }
    };

    handleCallback();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">
          Completing Google authentication...
        </p>
      </div>
    </div>
  );
};

export default GoogleCallback;
