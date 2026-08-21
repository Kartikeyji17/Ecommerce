const express = require("express");
const mongoose = require("mongoose");
const { getRedis } = require("../config/redis");

const router = express.Router();

router.get("/", async (req, res) => {
  const redis = getRedis();
  let redisOk = false;

  if (redis) {
    try {
      const pong = await redis.ping();
      redisOk = pong === "PONG";
    } catch {
      redisOk = false;
    }
  }

  const mongoOk = mongoose.connection.readyState === 1;

  const status = mongoOk ? "ok" : "degraded";
  res.status(mongoOk ? 200 : 503).json({
    status,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    services: {
      mongodb: mongoOk ? "connected" : "disconnected",
      redis: redis ? (redisOk ? "connected" : "error") : "disabled",
    },
  });
});

module.exports = router;
