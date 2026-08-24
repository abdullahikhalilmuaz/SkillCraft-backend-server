import express from "express";

import {
  createQuiz,
  getQuiz,
} from "../controllers/quizController.js";

import {
  protect,
  authorize,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/:id", protect, getQuiz);

router.post(
  "/lesson/:lessonId",
  protect,
  authorize("tutor"),
  createQuiz
);

export default router;