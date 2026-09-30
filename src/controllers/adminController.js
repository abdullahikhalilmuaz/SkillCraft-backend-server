import User from "../models/User.js";
import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
import Category from "../models/Category.js";
import Certificate from "../models/Certificate.js";
import Notification from "../models/Notification.js";
import Review from "../models/Review.js";
import Quiz from "../models/Quiz.js";
import Lesson from "../models/Lesson.js";

// ==========================================
// 1. DASHBOARD OVERVIEW
// ==========================================
export const getDashboardStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalTutors = await User.countDocuments({
      role: "tutor",
      isApproved: true,
    });
    const totalCourses = await Course.countDocuments();
    const activeCourses = await Course.countDocuments({ published: true });

    // Count completed courses from enrollments
    const completedCourses = await Enrollment.countDocuments({
      completed: true,
    });

    const certificatesIssued = await Certificate.countDocuments({
      status: "active",
    });
    const quizAttempts = await Enrollment.aggregate([
      { $group: { _id: null, total: { $sum: "$quizzesAttempted" } } },
    ]);

    // Recent Activities (e.g., recent enrollments or user registrations)
    const recentEnrollments = await Enrollment.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("student", "name")
      .populate("course", "title");

    const recentActivities = recentEnrollments.map((e) => ({
      id: e._id,
      message: `${e.student?.name || "A student"} enrolled in ${e.course?.title || "a course"}`,
      time: e.createdAt,
    }));

    res.json({
      success: true,
      data: {
        totalStudents,
        totalTutors,
        totalCourses,
        activeCourses,
        completedCourses,
        certificatesIssued,
        quizAttempts: quizAttempts[0]?.total || 0,
        recentActivities,
      },
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch dashboard stats" });
  }
};

// ==========================================
// 2. MANAGE STUDENTS
// ==========================================
export const getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student" })
      .select("-password")
      .sort({ createdAt: -1 });
    res.json({ success: true, students });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch students" });
  }
};

export const updateStudentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isApproved } = req.body; // Using isApproved as a proxy for Active/Suspended
    const student = await User.findByIdAndUpdate(
      id,
      { isApproved },
      { new: true },
    ).select("-password");
    if (!student)
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    res.json({ success: true, student });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to update student status" });
  }
};

// ==========================================
// 3. APPROVE TUTORS
// ==========================================
export const getPendingTutors = async (req, res) => {
  try {
    const tutors = await User.find({ role: "tutor", isApproved: false })
      .select("-password")
      .sort({ createdAt: -1 });
    res.json({ success: true, tutors });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch pending tutors" });
  }
};

export const updateTutorStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isApproved } = req.body;
    const tutor = await User.findByIdAndUpdate(
      id,
      { isApproved },
      { new: true },
    ).select("-password");
    if (!tutor)
      return res
        .status(404)
        .json({ success: false, message: "Tutor not found" });
    res.json({ success: true, tutor });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to update tutor status" });
  }
};

// ==========================================
// 4. MANAGE COURSES
// ==========================================
export const getAllCoursesAdmin = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("instructor", "name email")
      .sort({ createdAt: -1 });
    res.json({ success: true, courses });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch courses" });
  }
};

export const toggleCoursePublish = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course)
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    course.published = !course.published;
    await course.save();
    res.json({ success: true, course });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to toggle course status" });
  }
};

export const deleteCourseAdmin = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course)
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });

    // Cleanup associated data
    const lessons = await Lesson.find({ course: course._id }).select("_id");
    const lessonIds = lessons.map((l) => l._id);
    await Quiz.deleteMany({ lesson: { $in: lessonIds } });
    await Lesson.deleteMany({ course: course._id });
    await Enrollment.deleteMany({ course: course._id });
    await Course.findByIdAndDelete(course._id);

    res.json({ success: true, message: "Course deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to delete course" });
  }
};

// ==========================================
// 5. MANAGE CATEGORIES
// ==========================================
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json({ success: true, categories });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch categories" });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, image } = req.body;
    const category = await Category.create({ name, image });
    res.status(201).json({ success: true, category });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to create category" });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { name, image } = req.body;
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, image },
      { new: true },
    );
    if (!category)
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    res.json({ success: true, category });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to update category" });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Category deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to delete category" });
  }
};

// ==========================================
// 6. QUIZ MANAGEMENT
// ==========================================
export const getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find()
      .populate({
        path: "lesson",
        select: "title course",
        populate: { path: "course", select: "title" },
      })
      .sort({ createdAt: -1 });
    res.json({ success: true, quizzes });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch quizzes" });
  }
};

export const updateQuiz = async (req, res) => {
  try {
    const { passMark } = req.body;
    const quiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      { passMark },
      { new: true },
    );
    if (!quiz)
      return res
        .status(404)
        .json({ success: false, message: "Quiz not found" });
    res.json({ success: true, quiz });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update quiz" });
  }
};

export const deleteQuiz = async (req, res) => {
  try {
    await Quiz.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Quiz deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete quiz" });
  }
};

// ==========================================
// 7. CERTIFICATE MANAGEMENT
// ==========================================
export const getAllCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find()
      .populate("student", "name email")
      .populate("course", "title")
      .sort({ createdAt: -1 });
    res.json({ success: true, certificates });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch certificates" });
  }
};

export const revokeCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findByIdAndUpdate(
      req.params.id,
      { status: "revoked" },
      { new: true },
    );
    if (!certificate)
      return res
        .status(404)
        .json({ success: false, message: "Certificate not found" });
    res.json({ success: true, certificate });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to revoke certificate" });
  }
};

// ==========================================
// 8. NOTIFICATIONS SYSTEM
// ==========================================
export const sendNotification = async (req, res) => {
  try {
    const { title, message, audience } = req.body;
    const notification = await Notification.create({
      title,
      message,
      audience,
      sentBy: req.user._id,
    });
    res.status(201).json({ success: true, notification });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to send notification" });
  }
};

export const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.json({ success: true, notifications });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch notifications" });
  }
};

// ==========================================
// 9. REVIEWS & FEEDBACK
// ==========================================
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("user", "name")
      .populate("course", "title")
      .sort({ createdAt: -1 });
    res.json({ success: true, reviews });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch reviews" });
  }
};

export const deleteReview = async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Review deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to delete review" });
  }
};

// ==========================================
// 10. REPORTS & ANALYTICS
// ==========================================
export const getAnalytics = async (req, res) => {
  try {
    // User Analytics
    const totalStudents = await User.countDocuments({ role: "student" });
    const activeStudents = await User.countDocuments({
      role: "student",
      isApproved: true,
    });
    const inactiveStudents = totalStudents - activeStudents;

    // Course Analytics
    const popularCourse = await Enrollment.aggregate([
      { $group: { _id: "$course", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 },
      {
        $lookup: {
          from: "courses",
          localField: "_id",
          foreignField: "_id",
          as: "course",
        },
      },
      { $unwind: "$course" },
      { $project: { title: "$course.title", count: 1 } },
    ]);

    const totalEnrollments = await Enrollment.countDocuments();
    const completedEnrollments = await Enrollment.countDocuments({
      completed: true,
    });
    const completionRate =
      totalEnrollments > 0
        ? Math.round((completedEnrollments / totalEnrollments) * 100)
        : 0;

    // Quiz Analytics
    const quizStats = await Enrollment.aggregate([
      { $match: { quizzesAttempted: { $gt: 0 } } },
      { $group: { _id: null, avgScore: { $avg: "$averageScore" } } },
    ]);
    const averageScore = quizStats[0]?.avgScore
      ? Math.round(quizStats[0].avgScore)
      : 0;

    // Certificate Analytics
    const certificatesGenerated = await Certificate.countDocuments({
      status: "active",
    });

    res.json({
      success: true,
      analytics: {
        user: { totalStudents, activeStudents, inactiveStudents },
        course: { popularCourse: popularCourse[0] || null, completionRate },
        quiz: { averageScore },
        certificate: { certificatesGenerated },
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch analytics" });
  }
};

// ==========================================
// GENERATE CERTIFICATE MANUALLY (Admin)
// ==========================================
export const generateCertificate = async (req, res) => {
  try {
    const { studentId, courseId } = req.body;

    if (!studentId || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Student and course are required",
      });
    }

    // Prevent duplicates
    const existing = await Certificate.findOne({
      student: studentId,
      course: courseId,
      status: "active",
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message:
          "This student already has an active certificate for this course",
      });
    }

    const uniqueId = `SC-${Date.now().toString(36).toUpperCase()}-${Math.random()
      .toString(36)
      .substring(2, 6)
      .toUpperCase()}`;

    const certificate = await Certificate.create({
      student: studentId,
      course: courseId,
      certificateId: uniqueId,
      completionDate: new Date(),
      status: "active",
    });

    const populated = await Certificate.findById(certificate._id)
      .populate("student", "name email")
      .populate("course", "title");

    res.status(201).json({ success: true, certificate: populated });
  } catch (error) {
    console.error("Generate certificate error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate certificate",
    });
  }
};

// ==========================================
// GET DROPDOWN DATA FOR CERTIFICATE FORM
// ==========================================
export const getCertificateFormData = async (req, res) => {
  try {
    const students = await User.find({ role: "student" })
      .select("_id name email")
      .sort({ name: 1 });

    const courses = await Course.find().select("_id title").sort({ title: 1 });

    res.json({ success: true, students, courses });
  } catch (error) {
    console.error("Get form data error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load form data",
    });
  }
};

// ==========================================
// GET SINGLE CERTIFICATE (for print view)
// ==========================================
export const getSingleCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id)
      .populate("student", "name email")
      .populate("course", "title category level");

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found",
      });
    }

    res.json({ success: true, certificate });
  } catch (error) {
    console.error("Get single certificate error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch certificate",
    });
  }
};

// ==========================================
// PUBLIC VERIFY CERTIFICATE (by certificateId string)
// ==========================================
export const verifyCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findOne({
      certificateId: req.params.certificateId.toUpperCase(),
    })
      .populate("student", "name")
      .populate("course", "title category level");

    if (!certificate) {
      return res.status(404).json({
        success: false,
        valid: false,
        message: "No certificate found with that ID",
      });
    }

    res.json({
      success: true,
      valid: certificate.status === "active",
      certificate,
    });
  } catch (error) {
    console.error("Verify certificate error:", error);
    res.status(500).json({
      success: false,
      valid: false,
      message: "Verification failed",
    });
  }
};
