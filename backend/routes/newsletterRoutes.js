import express from "express";
import { check } from "express-validator";
import { subscribe } from "../controllers/newsletterController.js";

const router = express.Router();

router.post(
  "/",
  [check("email", "Please include a valid email").isEmail()],
  subscribe
);

export default router;
