import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    certificateId: {
      type: String,
      required: true,
      unique: true,
    },
    completionDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["active", "revoked"],
      default: "active",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Certificate", certificateSchema);
