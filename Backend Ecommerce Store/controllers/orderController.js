const Order = require("../models/Order");
const asyncHandler = require("../middleware/asyncHandler");

// Create order
const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress, shippingMethod, subtotal, shippingCost, tax, totalPrice } = req.body;

  if (!items || items.length === 0) {
    res.status(400);
    throw new Error("No items in order");
  }

  const order = await Order.create({
    user: req.user._id,
    items,
    shippingAddress,
    shippingMethod,
    subtotal,
    shippingCost,
    tax,
    totalPrice,
  });

  res.status(201).json(order);
});

// Mark order as paid
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  order.isPaid = true;
  order.paidAt = Date.now();
  order.status = 'paid';
  order.stripePaymentIntentId = req.body.paymentIntentId;

  const updatedOrder = await order.save();
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

  // Make sure user owns this order
  if (order.user._id.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized");
  }

  res.json(order);
});

module.exports = { createOrder, updateOrderToPaid, getMyOrders, getOrderById };