import User from "../models/User.js";

// =====================================================
// GET MY PROFILE
// GET /api/profile
// =====================================================

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get profile error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
    });
  }
};

// =====================================================
// UPDATE MY PROFILE
// PUT /api/profile
// =====================================================

export const updateProfile = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      country,
      avatar,
    } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (name !== undefined) {
      user.name = name;
    }

    if (email !== undefined) {
      user.email = email.toLowerCase().trim();
    }

    if (phone !== undefined) {
      user.phone = phone;
    }

    if (country !== undefined) {
      user.country = country;
    }

    if (avatar !== undefined) {
      user.avatar = avatar;
    }

    await user.save();

    const updatedUser = await User.findById(user._id).select("-password");

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "That email address is already in use",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};