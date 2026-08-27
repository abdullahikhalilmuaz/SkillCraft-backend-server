import Quiz from "../models/Quiz.js";
import Lesson from "../models/Lesson.js";

export const createQuiz = async (req, res) => {
  try {
    const { title, questions, passMark } = req.body;

    const lesson = await Lesson.findById(req.params.lessonId).populate(
      "course",
    );

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    if (lesson.course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only modify your own courses",
      });
    }

    const quiz = await Quiz.create({
      lesson: lesson._id,
      title,
      questions,
      passMark,
    });

    res.status(201).json({
      success: true,
      quiz,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to create quiz",
    });
  }
};

export const getQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).select("-questions.answer");

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    res.json({
      success: true,
      quiz,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch quiz",
    });
  }
};

export const getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find()
      .populate("lesson", "title course")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      quizzes,
    });
  } catch (error) {
    console.error("Get quizzes error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch quizzes",
    });
  }
};
