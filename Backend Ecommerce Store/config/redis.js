const Redis = require("ioredis");
const logger = require("./logger");

let redis = null;

const connectRedis = () => {
  const url = process.env.REDIS_URL;
  if (!url) {
    logger.warn("REDIS_URL not set — caching and cart sync disabled");
    return null;
  }

  redis = new Redis(url, {
    maxRetriesPerRequest: 3,
    lazyConnect: true,
    tls: url.startsWith("rediss://") ? {} : undefined,
  });

  redis.on("connect", () => logger.info("Redis connected"));
  redis.on("error", (err) => logger.error({ err }, "Redis error"));

  return redis.connect().then(() => redis).catch((err) => {
    logger.error({ err }, "Redis connection failed — running without cache");
    redis = null;
    return null;
  });
};

const getRedis = () => redis;

module.exports = { connectRedis, getRedis };
