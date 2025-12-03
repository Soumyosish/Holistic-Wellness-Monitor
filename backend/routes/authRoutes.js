// routes/authRoutes.js
// import express from "express";
// import { register, login, getProfile } from "../controllers/authController.js";
// import { protect } from "../middlewares/authMiddleware.js";

// const router = express.Router();

// router.post("/register", register);
// router.post("/login", login);
// router.get("/me", protect, getProfile);

// export default router;



import express from "express";
import { body } from "express-validator";
import { register, login, getProfile } from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// REGISTER validation
router.post(
  "/register",
  [
    body("name")
      .notEmpty()
      .withMessage("Name is required"),

    body("email")
      .isEmail()
      .withMessage("Valid email is required"),

    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  register
);

// LOGIN validation
router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Valid email required"),

    body("password")
      .notEmpty()
      .withMessage("Password is required"),
  ],
  login
);

// GET PROFILE
router.get("/me", protect, getProfile);

export default router;
