const express = require("express");

const protect = require("../middlewares/authMiddleware");

const {
  createRoom,
  joinRoom,
  getMyRooms,
} = require("../controllers/room.controller");

const router = express.Router();

router.use(protect);

router.post("/", createRoom);
router.post("/join", joinRoom);
router.get("/my-rooms", getMyRooms);

module.exports = router;
