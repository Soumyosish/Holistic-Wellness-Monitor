// models/User.js
// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: Number,
  height: Number, // cm
  weight: Number, // kg
  gender: String,
  refreshToken: { type: String }, // store active refresh token
}, { timestamps: true });

export default mongoose.model("User", userSchema);
