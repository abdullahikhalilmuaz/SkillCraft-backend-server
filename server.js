import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./src/config/db.js";

import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import profileRoutes from "./src/routes/profileRoutes.js";
import courseRoutes from "./src/routes/courseRoutes.js";
import lessonRoutes from "./src/routes/lessonRoutes.js";
import quizRoutes from "./src/routes/quizRoutes.js";
import learningRoutes from "./src/routes/learningRoutes.js";
import tutorRoutes from "./src/routes/tutorRoutes.js";

dotenv.config();

const app = express();

connectDB();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "https://skillcraft-platform.onrender.com",
    credentials: true,
  }),
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "AI Learning System API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/learning", learningRoutes);

app.use("/api/tutors", tutorRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
  });
});

app.use((err, req, res, next) => {
  console.error("Unhandled server error:", err);

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});