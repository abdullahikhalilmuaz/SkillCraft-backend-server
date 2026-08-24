import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
import Lesson from "../models/Lesson.js";
import Quiz from "../models/Quiz.js";

// GET /api/courses
export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find({ published: true })
      .populate("instructor", "name email avatar")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      courses,
    });
  } catch (error) {
    console.error("Get courses error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch courses",
    });
  }
};

// GET /api/courses/:id
export const getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate(
      "instructor",
      "name email avatar",
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.json({
      success: true,
      course,
    });
  } catch (error) {
    console.error("Get course error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch course",
    });
  }
};

// GET /api/courses/tutor/my-courses
export const getTutorCourses = async (req, res) => {
  try {
    const courses = await Course.find({
      instructor: req.user._id,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      courses,
    });
  } catch (error) {
    console.error("Get tutor courses error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch tutor courses",
    });
  }
};

// GET /api/courses/tutor/stats
export const getTutorStats = async (req, res) => {
  try {
    const courses = await Course.find({
      instructor: req.user._id,
    });

    const courseIds = courses.map((course) => course._id);

    const enrollments = await Enrollment.find({
      course: { $in: courseIds },
    });

    const totalEnrollments = enrollments.length;

    const ratings = courses.filter((course) => Number(course.rating) > 0);

    const averageRating =
      ratings.length > 0
        ? (
            ratings.reduce((sum, course) => sum + Number(course.rating), 0) /
            ratings.length
          ).toFixed(1)
        : "0.0";

    const publishedCourses = courses.filter(
      (course) => course.published,
    ).length;

    const draftCourses = courses.filter((course) => !course.published).length;

    res.json({
      success: true,
      stats: {
        totalCourses: courses.length,
        totalEnrollments,
        averageRating,
        publishedCourses,
        draftCourses,
      },
    });
  } catch (error) {
    console.error("Get tutor stats error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch tutor statistics",
    });
  }
};

// POST /api/courses
export const createCourse = async (req, res) => {
  try {
    const { title, category, level, description, image } = req.body;

    if (!title || !category || !level || !description) {
      return res.status(400).json({
        success: false,
        message: "Title, category, level and description are required",
      });
    }

    const course = await Course.create({
      title,
      category,
      level,
      description,
      image: image || "",
      instructor: req.user._id,
      price: 0,
      published: true,
    });

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    console.error("Create course error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create course",
      error: error.message,
    });
  }
};

// PUT /api/courses/:id
export const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

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

    const { title, category, level, description, image } = req.body;

    if (title !== undefined) course.title = title;
    if (category !== undefined) course.category = category;
    if (level !== undefined) course.level = level;
    if (description !== undefined) course.description = description;
    if (image !== undefined) course.image = image;

    // Payment is intentionally disabled for this FYP.
    course.price = 0;

    await course.save();

    res.json({
      success: true,
      message: "Course updated successfully",
      course,
    });
  } catch (error) {
    console.error("Update course error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update course",
    });
  }
};

// PATCH /api/courses/:id/publish
export const togglePublishCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

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

    course.published = !course.published;

    await course.save();

    res.json({
      success: true,
      message: course.published
        ? "Course published successfully"
        : "Course moved to drafts",
      course,
    });
  } catch (error) {
    console.error("Publish course error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update course status",
    });
  }
};

// DELETE /api/courses/:id
export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own courses",
      });
    }

    const lessons = await Lesson.find({
      course: course._id,
    }).select("_id");

    const lessonIds = lessons.map((lesson) => lesson._id);

    await Quiz.deleteMany({
      lesson: { $in: lessonIds },
    });

    await Lesson.deleteMany({
      course: course._id,
    });

    await Enrollment.deleteMany({
      course: course._id,
    });

    await Course.findByIdAndDelete(course._id);

    res.json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error("Delete course error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete course",
    });
  }
};
