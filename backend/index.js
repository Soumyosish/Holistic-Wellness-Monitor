// index.js
import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";

import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";

import authRoutes from "./routes/authRoutes.js";
import mealRoutes from "./routes/mealRoutes.js";
import workoutRoutes from "./routes/workoutRoutes.js";
import summaryRoutes from "./routes/summaryRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// ---- Basic parsers
app.use(express.json());
app.use(cookieParser());

// ---- SECURITY MIDDLEWARES (apply BEFORE routes)
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// ---- ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/meals", mealRoutes);
app.use("/api/workouts", workoutRoutes);
app.use("/api/summary", summaryRoutes);

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
