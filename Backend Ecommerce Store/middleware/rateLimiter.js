const { RateLimiterRedis, RateLimiterMemory } = require("rate-limiter-flexible");
const { getRedis } = require("../config/redis");

const createLimiter = (keyPrefix, points, duration) => {
  const redis = getRedis();
  if (redis) {
    return new RateLimiterRedis({
      storeClient: redis,
      keyPrefix,
      points,
      duration,
    });
  }
  return new RateLimiterMemory({ keyPrefix, points, duration });
};

const authLimiter = createLimiter("rl:auth", 10, 60);
const apiLimiter = createLimiter("rl:api", 100, 60);

const rateLimit = (limiter) => async (req, res, next) => {
  try {
    const key = req.ip || req.headers["x-forwarded-for"] || "unknown";
    await limiter.consume(key);
    next();
  } catch {
    res.status(429).json({ message: "Too many requests. Please try again later." });
  }
};

module.exports = {
  authRateLimit: rateLimit(authLimiter),
  apiRateLimit: rateLimit(apiLimiter),
};
