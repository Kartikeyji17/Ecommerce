const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("../middleware/asyncHandler");

// REGISTER
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({ name, email, password: hashedPassword });

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    token: generateToken(user._id)
  });
});

// LOGIN
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && await bcrypt.compare(password, user.password)) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id)
    });
  } else {
    res.status(401);
    throw new Error("Invalid credentials");
  }
});

// GET ALL USERS (admin)
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

// TOGGLE ADMIN
const toggleAdmin = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) { res.status(404); throw new Error("User not found"); }
  user.isAdmin = !user.isAdmin;
  await user.save();
  res.json({ message: `User ${user.isAdmin ? 'promoted to' : 'removed from'} admin`, isAdmin: user.isAdmin });
});

// DELETE USER
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) { res.status(404); throw new Error("User not found"); }
  await user.deleteOne();
  res.json({ message: "User deleted" });
});

// ANALYTICS
const getAnalytics = asyncHandler(async (req, res) => {
  const Order = require("../models/Order");
  const Product = require("../models/Product");

  const totalUsers = await User.countDocuments();
  const totalProducts = await Product.countDocuments();
  const totalOrders = await Order.countDocuments();
  const paidOrders = await Order.find({ isPaid: true });
  const totalRevenue = paidOrders.reduce((sum, o) => sum + o.totalPrice, 0);

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const monthlyOrders = await Order.aggregate([
    { $match: { createdAt: { $gte: sixMonthsAgo }, isPaid: true } },
    {
      $group: {
        _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
        revenue: { $sum: "$totalPrice" },
        count: { $sum: 1 }
      }
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } }
  ]);

  const topProducts = await Order.aggregate([
    { $unwind: "$items" },
    { $group: { _id: "$items.name", totalSold: { $sum: "$items.quantity" } } },
    { $sort: { totalSold: -1 } },
    { $limit: 5 }
  ]);

  res.json({ totalUsers, totalProducts, totalOrders, totalRevenue, monthlyOrders, topProducts });
});

module.exports = { registerUser, loginUser, getUsers, toggleAdmin, deleteUser, getAnalytics };