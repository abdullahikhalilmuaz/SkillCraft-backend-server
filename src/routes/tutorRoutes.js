import express from "express";
import User from "../models/User.js";
import Course from "../models/Course.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// GET /api/tutors - Get all tutors
router.get("/", async (req, res) => {
  try {
    const tutors = await User.find({ role: "tutor", isApproved: true })
      .select("-password")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      tutors,
    });
  } catch (error) {
    console.error("Get tutors error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch tutors",
    });
  }
});

// GET /api/tutors/:id - Get single tutor with their courses
router.get("/:id", async (req, res) => {
  try {
    const tutor = await User.findById(req.params.id)
      .select("-password");

    if (!tutor) {
      return res.status(404).json({
        success: false,
        message: "Tutor not found",
      });
    }

    if (tutor.role !== "tutor") {
      return res.status(400).json({
        success: false,
        message: "User is not a tutor",
      });
    }

    // Get tutor's courses
    const courses = await Course.find({
      instructor: tutor._id,
      published: true,
    }).select("title category level rating students image");

    res.json({
      success: true,
      tutor,
      courses,
    });
  } catch (error) {
    console.error("Get tutor error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch tutor",
    });
  }
});

export default router;