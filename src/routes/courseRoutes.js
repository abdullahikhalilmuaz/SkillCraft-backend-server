import express from "express";

import {
  createCourse,
  getCourses,
  getCourse,
  getTutorCourses,
  getTutorStats,
  updateCourse,
  togglePublishCourse,
  deleteCourse,
} from "../controllers/courseController.js";

import { protect, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getCourses);

router.get("/:id", getCourse);

router.post("/", protect, authorize("tutor"), createCourse);

router.get("/tutor/my-courses", protect, authorize("tutor"), getTutorCourses);

router.get("/tutor/stats", protect, authorize("tutor"), getTutorStats);

router.put("/:id", protect, authorize("tutor"), updateCourse);

router.patch("/:id/publish", protect, authorize("tutor"), togglePublishCourse);

router.delete("/:id", protect, authorize("tutor"), deleteCourse);

export default router;
