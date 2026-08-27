import express from "express";
import {
  getTutorStudents,
  getTutorActivity,
  getTutorEngagement,
  getTutorTopCourses,
  getTutorAnalyticsOverview,
} from "../controllers/tutorAnalyticsController.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/overview", protect, authorize("tutor"), getTutorAnalyticsOverview);
router.get("/students", protect, authorize("tutor"), getTutorStudents);
router.get("/activity", protect, authorize("tutor"), getTutorActivity);
router.get("/engagement", protect, authorize("tutor"), getTutorEngagement);
router.get("/top-courses", protect, authorize("tutor"), getTutorTopCourses);

export default router;