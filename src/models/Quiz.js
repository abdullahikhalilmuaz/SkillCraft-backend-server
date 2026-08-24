import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },

    options: {
      type: [String],
      required: true,
    },

    answer: {
      type: Number,
      required: true,
    },
  },
  { _id: true }
);

const quizSchema = new mongoose.Schema(
  {
    lesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    questions: [questionSchema],

    passMark: {
      type: Number,
      default: 50,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Quiz", quizSchema);