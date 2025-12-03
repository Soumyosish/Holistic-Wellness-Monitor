// controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { validationResult } from "express-validator";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });
};

export const register = async (req, res) => {
  try {
    
    const { name, email, password, age, height, weight, gender } = req.body;
    const exist = await User.findOne({ email });
    if (exist) return res.status(400).json({ msg: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, age, height, weight, gender });

    const token = generateToken(user._id);

    res.status(201).json({
      user: { id: user._id, name: user.name, email: user.email },
      token
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = generateToken(user._id);
    res.json({
      user: { id: user._id, name: user.name, email: user.email },
      token
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// optionally: get profile
export const getProfile = async (req, res) => {
  res.json(req.user);
};
