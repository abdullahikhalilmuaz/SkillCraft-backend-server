import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    content: {
      type: String,
      required: true,
    },

    videoUrl: {
      type: String,
      default: "",
    },

    resources: [
      {
        title: String,
        url: String,
      },
    ],

    order: {
      type: Number,
      default: 1,
    },

    duration: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Lesson", lessonSchema);