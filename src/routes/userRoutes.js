import express from "express";

import { getProfile, updateProfile } from "../controllers/userController.js";

import { protect, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/profile", protect, getProfile);

router.put("/profile", protect, updateProfile);

router.get("/student-area", protect, authorize("student"), (req, res) => {
  res.json({
    success: true,
    message: "Welcome to the student area.",
    user: req.user,
  });
});

router.get("/tutor-area", protect, authorize("tutor"), (req, res) => {
  res.json({
    success: true,
    message: "Welcome to the tutor area.",
    user: req.user,
  });
});

router.get("/admin-area", protect, authorize("admin"), (req, res) => {
  res.json({
    success: true,
    message: "Welcome to the admin area.",
    user: req.user,
  });
});

export default router;
