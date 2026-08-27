import express from "express";

import {
  createQuiz,
  getQuiz,
  getQuizzes,
} from "../controllers/quizController.js";

import { protect, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getQuizzes);

router.get("/:id", protect, getQuiz);

router.post("/lesson/:lessonId", protect, authorize("tutor"), createQuiz);

export default router;
