import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, unique: true },
    password: { type: String },
    googleId: { type: String, unique: true, sparse: true },
    picture: { type: String },
    age: Number,
    height: Number,
    weight: Number,
    gender: String,
    provider: { type: String, enum: ["local", "google"], default: "local" },
    refreshToken: { type: String },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
