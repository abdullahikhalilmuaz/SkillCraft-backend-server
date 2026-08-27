import Note from "../models/Note.js";

export const getNote = async (req, res) => {
  try {
    const note = await Note.findOne({
      lesson: req.params.lessonId,
      user: req.user._id,
    });

    res.json({
      success: true,
      note: note || null,
    });
  } catch (error) {
    console.error("Get note error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch note",
    });
  }
};

export const saveNote = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Note content is required",
      });
    }

    const note = await Note.findOneAndUpdate(
      {
        lesson: req.params.lessonId,
        user: req.user._id,
      },
      {
        lesson: req.params.lessonId,
        user: req.user._id,
        content: content.trim(),
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    res.status(201).json({
      success: true,
      note,
    });
  } catch (error) {
    console.error("Save note error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to save note",
    });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own notes",
      });
    }

    await Note.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Note deleted",
    });
  } catch (error) {
    console.error("Delete note error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete note",
    });
  }
};