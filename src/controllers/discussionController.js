import Discussion from "../models/Discussion.js";
import Lesson from "../models/Lesson.js";
import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";

export const getDiscussions = async (req, res) => {
  try {
    const discussions = await Discussion.find({
      lesson: req.params.lessonId,
    })
      .sort({ createdAt: -1 })
      .populate("user", "name");

    res.json({
      success: true,
      discussions,
    });
  } catch (error) {
    console.error("Get discussions error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch discussions",
    });
  }
};

export const createDiscussion = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    // Check if lesson exists
    const lesson = await Lesson.findById(req.params.lessonId);
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    // Check if user is enrolled in the course
    const enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: lesson.course,
    });

    if (!enrollment && req.user.role !== "tutor" && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You must be enrolled in this course to post",
      });
    }

    const discussion = await Discussion.create({
      lesson: req.params.lessonId,
      user: req.user._id,
      userName: req.user.name,
      message: message.trim(),
    });

    const populated = await Discussion.findById(discussion._id).populate(
      "user",
      "name"
    );

    res.status(201).json({
      success: true,
      discussion: populated,
    });
  } catch (error) {
    console.error("Create discussion error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create discussion",
    });
  }
};

export const deleteDiscussion = async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: "Discussion not found",
      });
    }

    // Only author, tutor, or admin can delete
    if (
      discussion.user.toString() !== req.user._id.toString() &&
      req.user.role !== "tutor" &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own messages",
      });
    }

    await Discussion.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Discussion deleted",
    });
  } catch (error) {
    console.error("Delete discussion error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete discussion",
    });
  }
};