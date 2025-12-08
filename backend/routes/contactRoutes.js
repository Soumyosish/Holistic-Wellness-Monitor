import express from "express";
import { sendContactMessage } from "../controllers/contactController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, sendContactMessage);

export default router;
