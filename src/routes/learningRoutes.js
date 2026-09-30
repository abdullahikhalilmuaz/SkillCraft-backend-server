import express from "express";

import {
  enrollInCourse,
  completeLesson,
  submitQuiz,
  getMyEnrollments,
  getMyCertificates, // ← ADDED
  getMyCertificateById, // ← ADDED
} from "../controllers/learningController.js";

import { protect, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/my-courses", protect, authorize("student"), getMyEnrollments);

router.get(
  "/my-certificates",
  protect,
  authorize("student"),
  getMyCertificates,
);

router.get(
  "/certificates/:id",
  protect,
  authorize("student"),
  getMyCertificateById,
);

router.post("/enroll/:courseId", protect, authorize("student"), enrollInCourse);

router.post(
  "/lesson/:lessonId/complete",
  protect,
  authorize("student"),
  completeLesson,
);

router.post("/quiz/:quizId/submit", protect, authorize("student"), submitQuiz);

export default router;
