import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "skillcraft",
    allowed_formats: ["jpg", "png", "jpeg", "gif", "mp4", "mov", "avi"],
    resource_type: "auto",
  },
});

const upload = multer({ storage });

router.post("/image", protect, upload.single("file"), (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, message: "No file uploaded" });
  }
  res.json({ success: true, url: req.file.path });
});

router.post("/video", protect, upload.single("file"), (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, message: "No file uploaded" });
  }
  res.json({ success: true, url: req.file.path });
});

export default router;
