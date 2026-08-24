const transferRoutes = require("./src/routes/transfer.routes");
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const roomRoutes = require("./routes/room.routes");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());

app.post("/test", (req, res) => {
  console.log(req.body);

  res.json({
    body: req.body,
  });
});



app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "PeerLink API is running",
    timestamp: new Date().toISOString(),
  });
});

// app.use("/api/transfers", transferRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);

module.exports = app;