import express from "express";
import {
  getSummaryByDate,
  updateSummary,
} from "../controllers/summaryController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getSummaryByDate); // ?date=YYYY-MM-DD
router.post("/", updateSummary);

export default router;
