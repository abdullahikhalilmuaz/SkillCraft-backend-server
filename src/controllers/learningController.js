import Enrollment from "../models/Enrollment.js";
import Quiz from "../models/Quiz.js";
import Lesson from "../models/Lesson.js";
import Course from "../models/Course.js";

export const enrollInCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    if (!course.published) {
      return res.status(400).json({
        success: false,
        message: "This course is not currently available",
      });
    }

    const existing = await Enrollment.findOne({
      student: req.user._id,
      course: courseId,
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Already enrolled in this course",
        enrollment: existing,
      });
    }

    const enrollment = await Enrollment.create({
      student: req.user._id,
      course: courseId,
    });

    res.status(201).json({
      success: true,
      message: "Successfully enrolled in course",
      enrollment,
    });
  } catch (error) {
    console.error("Enrollment error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to enroll in course",
    });
  }
};

export const completeLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;

    const lesson = await Lesson.findById(lessonId);

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    const enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: lesson.course,
    });

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: "You are not enrolled in this course",
      });
    }

    const alreadyCompleted = enrollment.completedLessons.some(
      (id) => id.toString() === lesson._id.toString(),
    );

    if (!alreadyCompleted) {
      enrollment.completedLessons.push(lesson._id);
    }

    const totalLessons = await Lesson.countDocuments({
      course: lesson.course,
    });

    enrollment.progress =
      totalLessons > 0
        ? Math.round((enrollment.completedLessons.length / totalLessons) * 100)
        : 0;

    enrollment.completed = enrollment.progress === 100;

    await enrollment.save();

    res.json({
      success: true,
      message: "Lesson progress updated",
      progress: enrollment.progress,
      completed: enrollment.completed,
    });
  } catch (error) {
    console.error("Complete lesson error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update lesson progress",
    });
  }
};

export const submitQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { answers = {}, timeSpent = 0 } = req.body;

    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    const lesson = await Lesson.findById(quiz.lesson);

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Quiz lesson not found",
      });
    }

    const enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: lesson.course,
    });

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: "You are not enrolled in this course",
      });
    }

    let correct = 0;

    quiz.questions.forEach((question, index) => {
      const submittedAnswer =
        answers[index] !== undefined
          ? answers[index]
          : answers[question._id.toString()];

      if (Number(submittedAnswer) === Number(question.answer)) {
        correct++;
      }
    });

    const total = quiz.questions.length;

    const score = total > 0 ? Math.round((correct / total) * 100) : 0;

    const previousAttempts = enrollment.quizzesAttempted;

    enrollment.quizzesAttempted += 1;

    enrollment.timeSpent += Number(timeSpent) || 0;

    enrollment.averageScore =
      previousAttempts === 0
        ? score
        : Math.round(
            (enrollment.averageScore * previousAttempts + score) /
              enrollment.quizzesAttempted,
          );

    await enrollment.save();

    res.json({
      success: true,
      result: {
        score,
        correct,
        total,
        passed: score >= quiz.passMark,
        passMark: quiz.passMark,
      },
    });
  } catch (error) {
    console.error("Submit quiz error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to submit quiz",
    });
  }
};

export const getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({
      student: req.user._id,
    })
      .populate("course", "title category level image description instructor")
      .populate("completedLessons", "title order duration")
      .sort({ updatedAt: -1 });

    res.json({
      success: true,
      enrollments,
    });
  } catch (error) {
    console.error("Get enrollments error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch enrollments",
    });
  }
};
