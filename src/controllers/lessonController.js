import Course from "../models/Course.js";
import Lesson from "../models/Lesson.js";

export const createLesson = async (req, res) => {
  try {
    const {
      title,
      description,
      content,
      videoUrl,
      order,
      duration,
      resources,
    } = req.body;

    const course = await Course.findById(req.params.courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only modify your own courses",
      });
    }

    const lesson = await Lesson.create({
      course: course._id,
      title,
      description,
      content,
      videoUrl,
      order,
      duration,
      resources: resources || [],
    });

    await Course.findByIdAndUpdate(course._id, {
      $inc: { lessons: 1 },
    });

    res.status(201).json({
      success: true,
      message: "Lesson created successfully",
      lesson,
    });
  } catch (error) {
    console.error("Create lesson error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create lesson",
    });
  }
};

export const getLessons = async (req, res) => {
  try {
    const lessons = await Lesson.find({
      course: req.params.courseId,
    }).sort({ order: 1 });

    res.json({
      success: true,
      lessons,
    });
  } catch (error) {
    console.error("Get lessons error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch lessons",
    });
  }
};
