import dotenv from "dotenv";
dotenv.config();

import express from "express";
import connectDb from "./config/db.js";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";
import googleAuthRoutes from "./routes/googleAuthRoutes.js";

import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";

import authRoutes from "./routes/authRoutes.js";
import mealRoutes from "./routes/mealRoutes.js";
import workoutRoutes from "./routes/workoutRoutes.js";
import summaryRoutes from "./routes/summaryRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import userProfileRoutes from "./routes/userProfileRoutes.js";
import foodDatabaseRoutes from "./routes/foodDatabaseRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import rewardsRoutes from "./routes/rewardsRoutes.js";
import newsletterRoutes from "./routes/newsletterRoutes.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// ---- ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/auth", googleAuthRoutes);
app.use("/api/profile", userProfileRoutes);
app.use("/api/meals", mealRoutes);
app.use("/api/foods", foodDatabaseRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/report", reportRoutes);
app.use("/api/workouts", workoutRoutes);
app.use("/api/rewards", rewardsRoutes);
app.use("/api/summary", summaryRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/newsletter", newsletterRoutes);

// ---- health check
app.get("/", (req, res) => res.json({ msg: "API running" }));

// ---- ERROR HANDLERS (must be last)
app.use(notFound);
app.use(errorHandler);

// ---- Connect DB then start server
const start = async () => {
  try {
    await connectDb();
    app.listen(port, () => {
      console.log(`Server started at ${port}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  }
};

start();
