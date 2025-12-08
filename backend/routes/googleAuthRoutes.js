import express from "express";
import {
  getGoogleAuthUrl,
  googleCallback,
  exchangeCode,
} from "../controllers/googleAuthController.js";

const router = express.Router();

// GET auth url
router.get("/google/url", getGoogleAuthUrl);

// OAuth callback (server redirect flow)
router.get("/google/callback", googleCallback);

// POST exchange code (client sends code obtained in popup)
router.post("/google", exchangeCode);

export default router;
