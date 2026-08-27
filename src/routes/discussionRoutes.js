import express from "express";
import {
  getDiscussions,
  createDiscussion,
  deleteDiscussion,
} from "../controllers/discussionController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/lesson/:lessonId", protect, getDiscussions);
router.post("/lesson/:lessonId", protect, createDiscussion);
router.delete("/:id", protect, deleteDiscussion);

export default router;