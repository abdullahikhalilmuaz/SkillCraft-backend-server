const { v4: uuidv4 } = require("uuid");

const Room = require("../models/Room");

const generateRoomCode = () => {
  return uuidv4().replace(/-/g, "").substring(0, 8).toUpperCase();
};

const createRoom = async (req, res) => {
  try {
    const { name = "Untitled Room", expiryHours = 24 } = req.body;

    const expiresAt = new Date(
      Date.now() + Number(expiryHours) * 60 * 60 * 1000,
    );

    const room = await Room.create({
      roomCode: generateRoomCode(),
      name,
      owner: req.user.id,
      members: [req.user.id],
      expiresAt,
    });

    res.status(201).json({
      success: true,
      room,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to create room",
    });
  }
};

const joinRoom = async (req, res) => {
  try {
    const { roomCode } = req.body;

    if (!roomCode) {
      return res.status(400).json({
        success: false,
        message: "Room code is required",
      });
    }

    const room = await Room.findOne({
      roomCode: roomCode.toUpperCase(),
    });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    if (room.status === "expired" || room.expiresAt <= new Date()) {
      room.status = "expired";
      await room.save();

      return res.status(410).json({
        success: false,
        message: "This room has expired",
      });
    }

    if (!room.members.some((member) => member.toString() === req.user.id)) {
      room.members.push(req.user.id);
      await room.save();
    }

    res.json({
      success: true,
      message: "Joined room successfully",
      room,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to join room",
    });
  }
};

const getMyRooms = async (req, res) => {
  try {
    const rooms = await Room.find({
      members: req.user.id,
      status: "active",
      expiresAt: { $gt: new Date() },
    })
      .populate("members", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      rooms,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch rooms",
    });
  }
};

module.exports = {
  createRoom,
  joinRoom,
  getMyRooms,
};
