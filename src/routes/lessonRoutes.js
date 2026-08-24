import express from "express";

import {
  createLesson,
  getLessons,
} from "../controllers/lessonController.js";

import {
  protect,
  authorize,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get(
  "/course/:courseId",
  getLessons
);

router.post(
  "/course/:courseId",
  protect,
  authorize("tutor"),
  createLesson
);

export default router;