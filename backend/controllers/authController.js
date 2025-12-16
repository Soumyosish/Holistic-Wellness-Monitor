import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { validationResult } from "express-validator";
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};
export const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        msg: errors.array()[0].msg,
        errors: errors.array(),
      });
    }
    const { name, email, password, age, height, weight, gender } = req.body;
    const exist = await User.findOne({ email });
    if (exist) return res.status(400).json({ msg: "User already exists" });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashed,
      age,
      height,
      weight,
      gender,
    });
    const token = generateToken(user._id);
    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        height: user.height,
        weight: user.weight,
        gender: user.gender,
      },
      token,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
export const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        msg: errors.array()[0].msg,
        errors: errors.array(),
      });
    }
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });
    const token = generateToken(user._id);
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        age: user.age,
        height: user.height,
        weight: user.weight,
        gender: user.gender,
      },
      token,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
export const getProfile = async (req, res) => {
  res.json(req.user);
};
import crypto from "crypto";
import { sendEmail } from "../utils/emailService.js";

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "Email does not exist" });
    }
    const token = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Use env variable or default
    const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
    const resetUrl = `${FRONTEND_URL.replace(
      /\/$/,
      ""
    )}/reset-password/${token}`;

    const message = `
      <p>You requested a password reset</p>
      <p>Click <a href="${resetUrl}">here</a> to reset your password.</p>
    `;

    // --- EMAIL SENDING LOGIC ---
    try {
      await sendEmail({
        to: user.email,
        subject: "Password Reset",
        html: message,
      });

      // Check if simulated by checking env (simplified for response)
      const isSimulated = !process.env.EMAIL_USER || !process.env.EMAIL_PASS;

      res.status(200).json({
        success: true,
        data: isSimulated
          ? "Password reset email sent (Simulated)"
          : "Password reset email sent",
        resetUrl: isSimulated ? resetUrl : undefined,
      });
    } catch (err) {
      console.error("Email send error:", err);
      // Clean up fields on failure
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      return res.status(500).json({ msg: "Email could not be sent" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
};

// Reset Password Confirm Controller
export const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const { token } = req.params;

    console.log("Reset password attempt:", { token });

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ msg: "Invalid or expired token" });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ success: true, message: "Password reset successful" });
  } catch (err) {
    console.error("Error in reset-password:", err);
    res.status(500).json({ msg: "Server error" });
  }
};
