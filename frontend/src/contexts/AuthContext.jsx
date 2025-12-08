import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext({});

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

const API_BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, "")}/api`
  : "http://localhost:8000/api";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const response = await axios.get(`${API_BASE_URL}/auth/me`);
        setUser(response.data);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password,
      });

      const { user, token } = response.data;
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(user);
      return { success: true, user };
    } catch (error) {
      const message = error.response?.data?.msg || "Login failed";
      setError(message);
      return { success: false, error: message };
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const response = await axios.post(
        `${API_BASE_URL}/auth/register`,
        userData
      );

      const { user, token } = response.data;
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(user);
      return { success: true, user };
    } catch (error) {
      const message = error.response?.data?.msg || "Registration failed";
      setError(message);
      return { success: false, error: message };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
  };

  const resetPassword = async (email) => {
    try {
      setError(null);
      // Use the new route structure
      const response = await axios.post(
        `${API_BASE_URL}/auth/forgot-password`,
        { email }
      );
      return {
        success: true,
        message: response.data.data, // 'Password reset email sent'
        resetUrl: response.data.resetUrl, // Dev mode link
      };
    } catch (error) {
      const message = error.response?.data?.msg || "Reset password failed";
      setError(message);
      return { success: false, error: message };
    }
  };

  const resetPasswordConfirm = async (token, password) => {
    try {
      setError(null);
      const response = await axios.post(
        `${API_BASE_URL}/auth/reset-password/${token}`,
        { password }
      );
      return { success: true, message: response.data.message };
    } catch (error) {
      const message = error.response?.data?.msg || "Password reset failed";
      setError(message);
      return { success: false, error: message };
    }
  };

  const sendContactMessage = async (data) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/contact`, data);
      return { success: true, message: response.data.msg };
    } catch (error) {
      const message = error.response?.data?.msg || "Failed to send message";
      return { success: false, error: message };
    }
  };

  const googleLogin = async (code, redirectUri, mode = "login") => {
    try {
      setError(null);
      const response = await axios.post(`${API_BASE_URL}/auth/google`, {
        code,
        redirect_uri: redirectUri,
        mode,
      });
      const { user, token } = response.data;
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(user);
      return { success: true, user };
    } catch (err) {
      const message = err.response?.data?.msg || "Google login failed";
      setError(message);
      return { success: false, error: message };
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    resetPassword,
    resetPasswordConfirm,
    sendContactMessage,
    googleLogin,
    setError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
