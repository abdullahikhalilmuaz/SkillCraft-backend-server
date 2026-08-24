const Transfer = require("../models/Transfer");

const createTransfer = async (req, res) => {
  try {
    const { roomId, receiverId, filename, filesize, mimeType } = req.body;

    const transfer = await Transfer.create({
      room: roomId,
      sender: req.user.id,
      receiver: receiverId,
      filename,
      filesize,
      mimeType: mimeType || "application/octet-stream",
      status: "pending",
    });

    res.status(201).json({
      success: true,
      transfer,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to create transfer",
    });
  }
};

const getTransfers = async (req, res) => {
  try {
    const { limit = 50, page = 1 } = req.query;
    const skip = (page - 1) * limit;

    const transfers = await Transfer.find({
      $or: [{ sender: req.user.id }, { receiver: req.user.id }],
    })
      .populate("sender", "name email")
      .populate("receiver", "name email")
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(skip);

    const total = await Transfer.countDocuments({
      $or: [{ sender: req.user.id }, { receiver: req.user.id }],
    });

    res.json({
      success: true,
      transfers,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch transfers",
    });
  }
};

const getTransferStats = async (req, res) => {
  try {
    const transfers = await Transfer.find({
      $or: [{ sender: req.user.id }, { receiver: req.user.id }],
    });

    const total = transfers.length;
    const sent = transfers.filter(
      (t) => t.sender.toString() === req.user.id,
    ).length;
    const received = transfers.filter(
      (t) => t.receiver.toString() === req.user.id,
    ).length;
    const completed = transfers.filter((t) => t.status === "completed").length;
    const failed = transfers.filter((t) => t.status === "failed").length;
    const totalSize = transfers.reduce((acc, t) => acc + t.filesize, 0);

    // Calculate % changes (mock for now - would need previous period data)
    const stats = {
      total,
      sent,
      received,
      completed,
      failed,
      totalSize: formatBytes(totalSize),
      totalSizeBytes: totalSize,
      successRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      changes: {
        total: "+12%",
        sent: "+8%",
        received: "+15%",
        size: "+22%",
      },
    };

    res.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch transfer stats",
    });
  }
};

const updateTransferStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, sha256 } = req.body;

    const transfer = await Transfer.findById(id);
    if (!transfer) {
      return res.status(404).json({
        success: false,
        message: "Transfer not found",
      });
    }

    transfer.status = status;
    if (sha256) transfer.sha256 = sha256;
    if (status === "completed") {
      transfer.completedAt = new Date();
    }
    await transfer.save();

    res.json({
      success: true,
      transfer,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to update transfer",
    });
  }
};

const getRecentTransfers = async (req, res) => {
  try {
    const transfers = await Transfer.find({
      $or: [{ sender: req.user.id }, { receiver: req.user.id }],
    })
      .populate("sender", "name email")
      .populate("receiver", "name email")
      .sort({ createdAt: -1 })
      .limit(3);

    res.json({
      success: true,
      transfers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch recent transfers",
    });
  }
};

function formatBytes(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

module.exports = {
  createTransfer,
  getTransfers,
  getTransferStats,
  updateTransferStatus,
  getRecentTransfers,
};
