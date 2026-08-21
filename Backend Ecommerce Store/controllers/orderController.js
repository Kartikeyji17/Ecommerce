const Order = require("../models/Order");
const asyncHandler = require("../middleware/asyncHandler");
const { buildOrderFromItems } = require("../utils/orderPricing");
const fulfillOrder = require("../utils/fulfillOrder");
const { getRedis } = require("../config/redis");

const invalidateProductCache = async () => {
  const redis = getRedis();
  if (redis) await redis.del("products:all");
};

// Create order with server-side pricing
const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress, shippingMethod } = req.body;

  const pricing = await buildOrderFromItems(items, shippingMethod);

  const order = await Order.create({
    user: req.user._id,
    items: pricing.items,
    shippingAddress,
    shippingMethod: shippingMethod || "standard",
    subtotal: pricing.subtotal,
    shippingCost: pricing.shippingCost,
    tax: pricing.tax,
    totalPrice: pricing.totalPrice,
  });

  res.status(201).json(order);
});

// Mark order as paid (client fallback — webhook is source of truth)
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (order.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized");
  }

  const updatedOrder = await fulfillOrder(order._id, req.body.paymentIntentId);
  await invalidateProductCache();
  res.json(updatedOrder);
});

// Get my orders
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

// Get single order
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate("user", "name email");

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (order.user._id.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized");
  }

  res.json(order);
});

module.exports = { createOrder, updateOrderToPaid, getMyOrders, getOrderById, invalidateProductCache };
