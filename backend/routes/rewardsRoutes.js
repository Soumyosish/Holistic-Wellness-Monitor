import express from "express";
import { getRewards } from "../controllers/rewardsController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.use(protect);
router.get("/", getRewards);

export default router;
