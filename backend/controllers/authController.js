import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import { validationResult } from "express-validator";
import { sendEmail } from "../utils/emailService.js";
import {
  calculateBMI,
  calculateBMR,
  calculateTDEE,
  calculateIdealWeight,
  calculateDailyCalorieTarget,
  calculateMacroTargets,
  calculateWaterGoal,
  calculateStepGoal,
} from "../utils/healthCalculations.js";

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
    if (exist) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);
    
    // Default values if data is present
    let healthData = {};
    if (age && height && weight && gender) {
      const bmi = calculateBMI(weight, height);
      const bmr = calculateBMR(weight, height, age, gender);
      const tdee = calculateTDEE(bmr, "moderate");
      const idealWeight = calculateIdealWeight(height, gender);
      const dailyCalorieTarget = calculateDailyCalorieTarget(tdee, "maintenance");
      const macroTargets = calculateMacroTargets(dailyCalorieTarget, "maintenance");
      const dailyWaterGoal = calculateWaterGoal(weight, "moderate");
      const dailyStepGoal = calculateStepGoal("moderate");

      healthData = {
        bmi,
        bmr,
        tdee,
        idealWeight,
        dailyCalorieTarget,
        dailyProteinTarget: macroTargets.protein,
        dailyCarbsTarget: macroTargets.carbs,
        dailyFatsTarget: macroTargets.fats,
        dailyWaterGoal,
        dailyStepGoal,
        profileCompleted: true,
        activityLevel: "moderate",
        goal: "maintenance",
        targetWeight: idealWeight
      };
    }

    const user = await User.create({
      name,
      email,
      password: hashed,
      age,
      height,
      weight,
      gender,
      ...healthData
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
        profileCompleted: user.profileCompleted,
        bmi: user.bmi,
        dailyCalorieTarget: user.dailyCalorieTarget,
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
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

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
        profileCompleted: user.profileCompleted,
        bmi: user.bmi,
        dailyCalorieTarget: user.dailyCalorieTarget,
      },
      token,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    res.json(req.user);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ msg: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ msg: "User with this email does not exist" });
    }

    // Generate reset token
    const token = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour expiry
    await user.save();

    console.log(`✓ Reset token generated for: ${user.email}`);

    // Build reset URL
    const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
    const resetUrl = `${FRONTEND_URL.replace(/\/$/, "")}/reset-password/${token}`;

    const message = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0066cc;">Password Reset Request</h2>
        <p>You have requested to reset your password for your Holistic Wellness Monitor account.</p>
        <p>Click the link below to create a new password:</p>
        <p style="margin: 20px 0;">
          <a href="${resetUrl}" style="background-color: #0066cc; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
            Reset Password
          </a>
        </p>
        <p style="color: #666; font-size: 14px;">Or copy this link: <br><code>${resetUrl}</code></p>
        <p style="color: #999; font-size: 12px;">This link will expire in 1 hour.</p>
        <p style="color: #666; font-size: 14px;">If you did not request this reset, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin-top: 30px;">
        <p style="color: #999; font-size: 12px;">Holistic Wellness Monitor Team</p>
      </div>
    `;

    // Send email
    const emailResult = await sendEmail({
      to: user.email,
      subject: "Password Reset Request - Holistic Wellness Monitor",
      html: message,
    });

    console.log(
      `✓ Email sent (${emailResult.isSimulated ? "SIMULATED" : "ACTUAL"})`
    );

    res.status(200).json({
      success: true,
      message: emailResult.isSimulated
        ? "Password reset link generated (Development Mode - Check console)"
        : "Password reset email sent successfully",
      resetUrl: emailResult.isSimulated ? resetUrl : undefined,
    });
  } catch (err) {
    console.error("❌ Forgot password error:", err);
    res
      .status(500)
      .json({
        msg: "An error occurred while processing your request",
        error: err.message,
      });
  }
};

export const validateResetToken = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({ msg: "Token is required" });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ msg: "Invalid or expired reset token" });
    }

    res.status(200).json({
      success: true,
      message: "Token is valid",
      email: user.email,
    });
  } catch (err) {
    console.error("❌ Token validation error:", err);
    res
      .status(500)
      .json({
        msg: "An error occurred while validating token",
        error: err.message,
      });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const { token } = req.params;

    if (!password || password.length < 6) {
      return res
        .status(400)
        .json({ msg: "Password must be at least 6 characters" });
    }

    if (!token) {
      return res.status(400).json({ msg: "Token is required" });
    }

    // Find user with valid token
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ msg: "Invalid or expired reset token" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    console.log(`✓ Password reset successful for: ${user.email}`);

    res.status(200).json({
      success: true,
      message:
        "Password reset successful! You can now login with your new password.",
    });
  } catch (err) {
    console.error("❌ Password reset error:", err);
    res
      .status(500)
      .json({
        msg: "An error occurred while resetting password",
        error: err.message,
      });
  }
};
