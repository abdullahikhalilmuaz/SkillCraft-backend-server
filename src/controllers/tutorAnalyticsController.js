import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
import Lesson from "../models/Lesson.js";
import Quiz from "../models/Quiz.js";
import User from "../models/User.js";

// GET /api/tutor/analytics/overview
export const getTutorAnalyticsOverview = async (req, res) => {
  try {
    const tutorId = req.user._id;

    // Get tutor's courses
    const courses = await Course.find({ instructor: tutorId });
    const courseIds = courses.map((c) => c._id);

    // Get enrollments for tutor's courses
    const enrollments = await Enrollment.find({
      course: { $in: courseIds },
    });

    const totalStudents = enrollments.length;
    const completedEnrollments = enrollments.filter((e) => e.completed).length;
    const completionRate = totalStudents > 0
      ? Math.round((completedEnrollments / totalStudents) * 100)
      : 0;

    const totalProgress = enrollments.reduce((sum, e) => sum + (e.progress || 0), 0);
    const averageProgress = totalStudents > 0
      ? Math.round(totalProgress / totalStudents)
      : 0;

    // Get average rating
    const ratedCourses = courses.filter((c) => c.rating > 0);
    const averageRating = ratedCourses.length > 0
      ? parseFloat(
          (ratedCourses.reduce((sum, c) => sum + c.rating, 0) / ratedCourses.length).toFixed(1)
        )
      : 0;

    // Get total lessons and quizzes
    const lessons = await Lesson.find({ course: { $in: courseIds } });
    const quizzes = await Quiz.find({ lesson: { $in: lessons.map((l) => l._id) } });

    res.json({
      success: true,
      data: {
        totalCourses: courses.length,
        totalStudents,
        activeStudents: enrollments.filter((e) => e.progress > 0 && e.progress < 100).length,
        averageProgress,
        completionRate,
        averageRating,
        totalLessons: lessons.length,
        totalQuizzes: quizzes.length,
      },
    });
  } catch (error) {
    console.error("Get tutor analytics overview error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch analytics overview",
    });
  }
};

// GET /api/tutor/analytics/students
export const getTutorStudents = async (req, res) => {
  try {
    const tutorId = req.user._id;

    const courses = await Course.find({ instructor: tutorId }).select("_id");
    const courseIds = courses.map((c) => c._id);

    const enrollments = await Enrollment.find({
      course: { $in: courseIds },
    })
      .populate("student", "name email avatar")
      .populate("course", "title")
      .sort({ updatedAt: -1 })
      .limit(100);

    const students = enrollments.map((e) => ({
      id: e.student._id,
      name: e.student.name,
      email: e.student.email,
      avatar: e.student.avatar,
      course: e.course.title,
      progress: e.progress || 0,
      completed: e.completed,
      lastActive: e.updatedAt,
    }));

    res.json({
      success: true,
      students,
      total: students.length,
    });
  } catch (error) {
    console.error("Get tutor students error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch students",
    });
  }
};

// GET /api/tutor/analytics/activity
export const getTutorActivity = async (req, res) => {
  try {
    const tutorId = req.user._id;

    const courses = await Course.find({ instructor: tutorId }).select("_id");
    const courseIds = courses.map((c) => c._id);

    // Get recent enrollments
    const enrollments = await Enrollment.find({
      course: { $in: courseIds },
    })
      .populate("student", "name")
      .populate("course", "title")
      .sort({ createdAt: -1 })
      .limit(10);

    const recentActivity = enrollments.map((e) => ({
      student: e.student.name,
      action: e.completed ? "completed" : "enrolled",
      course: e.course.title,
      time: e.createdAt,
    }));

    res.json({
      success: true,
      activity: recentActivity,
    });
  } catch (error) {
    console.error("Get tutor activity error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch activity",
    });
  }
};

// GET /api/tutor/analytics/engagement
export const getTutorEngagement = async (req, res) => {
  try {
    const tutorId = req.user._id;

    const courses = await Course.find({ instructor: tutorId }).select("_id");
    const courseIds = courses.map((c) => c._id);

    // Get all enrollments for tutor's courses
    const enrollments = await Enrollment.find({
      course: { $in: courseIds },
    });

    // Calculate weekly engagement (last 7 days)
    const today = new Date();
    const weeklyData = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      
      const count = enrollments.filter((e) => {
        const updated = new Date(e.updatedAt);
        return updated >= date && updated < nextDate;
      }).length;
      
      weeklyData.push(count);
    }

    // Calculate max for scaling
    const maxValue = Math.max(...weeklyData, 5);
    const scaledData = weeklyData.map((v) => Math.round((v / maxValue) * 100));

    res.json({
      success: true,
      data: scaledData,
    });
  } catch (error) {
    console.error("Get tutor engagement error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch engagement data",
    });
  }
};

// GET /api/tutor/analytics/top-courses
export const getTutorTopCourses = async (req, res) => {
  try {
    const tutorId = req.user._id;

    const courses = await Course.find({ instructor: tutorId })
      .select("title rating students")
      .sort({ students: -1 })
      .limit(5);

    const topCourses = courses.map((c) => ({
      title: c.title,
      students: c.students || 0,
      rating: c.rating || 0,
    }));

    res.json({
      success: true,
      courses: topCourses,
    });
  } catch (error) {
    console.error("Get tutor top courses error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch top courses",
    });
  }
};