import express from "express";
import { generateHealthReport } from "../controllers/reportController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/generate", generateHealthReport);

export default router;
