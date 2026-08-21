const asyncHandler = require("../middleware/asyncHandler");
const { getRedis } = require("../config/redis");

const CART_TTL = 60 * 60 * 24 * 7; // 7 days

const cartKey = (userId) => `cart:${userId}`;

const getCart = asyncHandler(async (req, res) => {
  const redis = getRedis();
  if (!redis) {
    return res.json({ items: [] });
  }

  const data = await redis.get(cartKey(req.user._id));
  res.json(data ? JSON.parse(data) : { items: [] });
});

const saveCart = asyncHandler(async (req, res) => {
  const redis = getRedis();
  if (!redis) {
    return res.json({ message: "Cart saved locally only (Redis unavailable)" });
  }

  const { items } = req.body;
  if (!Array.isArray(items)) {
    res.status(400);
    throw new Error("Invalid cart data");
  }

  await redis.setex(cartKey(req.user._id), CART_TTL, JSON.stringify({ items }));
  res.json({ message: "Cart saved", items });
});

const clearCart = asyncHandler(async (req, res) => {
  const redis = getRedis();
  if (redis) {
    await redis.del(cartKey(req.user._id));
  }
  res.json({ message: "Cart cleared" });
});

module.exports = { getCart, saveCart, clearCart };
