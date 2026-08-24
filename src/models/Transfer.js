const mongoose = require("mongoose");

const transferSchema = new mongoose.Schema(
  {
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    filename: {
      type: String,
      required: true,
    },

    filesize: {
      type: Number,
      required: true,
    },

    mimeType: {
      type: String,
      default: "application/octet-stream",
    },

    sha256: {
      type: String,
      default: null,
    },

    status: {
      type: String,
      enum: ["pending", "transferring", "completed", "failed", "cancelled"],
      default: "pending",
    },

    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Transfer", transferSchema);