import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./src/models/User.js";

dotenv.config();

const ADMIN = {
  name: "Platform Admin",
  email: "admin@skillcraft.com",   // ← change this
  password: "Admin@12345",          // ← change this
};

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const existing = await User.findOne({ email: ADMIN.email });
    if (existing) {
      console.log("Admin already exists:", existing.email);
      process.exit(0);
    }

    const hashed = await bcrypt.hash(ADMIN.password, 12);

    const admin = await User.create({
      name: ADMIN.name,
      email: ADMIN.email,
      password: hashed,
      role: "admin",
      isApproved: true,
    });

    console.log("✅ Admin created:", admin.email);
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
};

run();