const express = require("express");
const router = express.Router();
const { createOrder, updateOrderToPaid, getMyOrders, getOrderById } = require("../controllers/orderController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const Order = require("../models/Order");

router.post("/", protect, createOrder);
router.get("/myorders", protect, getMyOrders);
router.get("/admin/all", protect, adminOnly, async (req, res) => {
  const orders = await Order.find()
    .populate("user", "name email")
    .sort({ createdAt: -1 });
  res.json(orders);
});
router.put("/:id/pay", protect, updateOrderToPaid);
router.put("/:id/status", protect, adminOnly, async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) { res.status(404); throw new Error("Order not found"); }
  order.status = req.body.status;
  await order.save();
  res.json(order);
});
router.get("/:id", protect, getOrderById);

module.exports = router;