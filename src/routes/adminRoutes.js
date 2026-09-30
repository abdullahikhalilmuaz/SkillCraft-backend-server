import express from "express";
import {
  getDashboardStats,
  getAllStudents,
  updateStudentStatus,
  getPendingTutors,
  updateTutorStatus,
  getAllCoursesAdmin,
  toggleCoursePublish,
  deleteCourseAdmin,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getAllQuizzes,
  updateQuiz,
  deleteQuiz,
  getAllCertificates,
  revokeCertificate,
  generateCertificate,
  getCertificateFormData,
  getSingleCertificate, // ← ADDED
  verifyCertificate, // ← ADDED
  sendNotification,
  getAllNotifications,
  getAllReviews,
  deleteReview,
  getAnalytics,
} from "../controllers/adminController.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public verify route (no auth) — must come BEFORE router.use(protect)
router.get("/certificates/verify/:certificateId", verifyCertificate);

router.use(protect);
router.use(authorize("admin"));

// 1. Dashboard
router.get("/dashboard", getDashboardStats);

// 2. Manage Students
router.get("/students", getAllStudents);
router.put("/students/:id/status", updateStudentStatus);

// 3. Approve Tutors
router.get("/tutors/pending", getPendingTutors);
router.put("/tutors/:id/status", updateTutorStatus);

// 4. Manage Courses
router.get("/courses", getAllCoursesAdmin);
router.patch("/courses/:id/publish", toggleCoursePublish);
router.delete("/courses/:id", deleteCourseAdmin);

// 5. Manage Categories
router.get("/categories", getCategories);
router.post("/categories", createCategory);
router.put("/categories/:id", updateCategory);
router.delete("/categories/:id", deleteCategory);

// 6. Quiz Management
router.get("/quizzes", getAllQuizzes);
router.put("/quizzes/:id", updateQuiz);
router.delete("/quizzes/:id", deleteQuiz);

// 7. Certificate Management
router.get("/certificates", getAllCertificates);
router.get("/certificates/form-data", getCertificateFormData);
router.post("/certificates", generateCertificate);
router.get("/certificates/:id", getSingleCertificate); // ← ADDED
router.patch("/certificates/:id/revoke", revokeCertificate);

// 8. Notifications
router.get("/notifications", getAllNotifications);
router.post("/notifications", sendNotification);

// 9. Reviews
router.get("/reviews", getAllReviews);
router.delete("/reviews/:id", deleteReview);

// 10. Reports & Analytics
router.get("/analytics", getAnalytics);

export default router;
