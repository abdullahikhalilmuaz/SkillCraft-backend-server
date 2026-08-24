const express = require("express");
const protect = require("../middlewares/auth.middleware");
const {
  createTransfer,
  getTransfers,
  getTransferStats,
  updateTransferStatus,
  getRecentTransfers,
} = require("../controllers/transfer.controller");

const router = express.Router();

router.use(protect);

router.get("/", getTransfers);
router.get("/stats", getTransferStats);
router.get("/recent", getRecentTransfers);
router.post("/", createTransfer);
router.patch("/:id/status", updateTransferStatus);

module.exports = router;
