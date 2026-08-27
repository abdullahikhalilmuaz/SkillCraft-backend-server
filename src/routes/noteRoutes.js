import express from "express";
import {
  getNote,
  saveNote,
  deleteNote,
} from "../controllers/noteController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/lesson/:lessonId", protect, getNote);
router.post("/lesson/:lessonId", protect, saveNote);
router.delete("/:id", protect, deleteNote);

export default router;