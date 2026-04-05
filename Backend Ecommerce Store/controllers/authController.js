const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("../middleware/asyncHandler");

// REGISTER
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) { res.status(400); throw new Error("User already exists"); }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword });
  res.json({
    _id: user._id, name: user.name, email: user.email,
    isAdmin: user.isAdmin, isSeller: user.isSeller,
    sellerStatus: user.sellerStatus, token: generateToken(user._id)
  });
});

// LOGIN
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && await bcrypt.compare(password, user.password)) {
    res.json({
      _id: user._id, name: user.name, email: user.email,
      isAdmin: user.isAdmin, isSeller: user.isSeller,
      sellerStatus: user.sellerStatus, token: generateToken(user._id)
    });
  } else {
    res.status(401); throw new Error("Invalid credentials");
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

// APPLY TO BECOME SELLER
const applyForSeller = asyncHandler(async (req, res) => {
  const { shopName, shopDescription } = req.body;
  const user = await User.findById(req.user._id);
  if (!user) { res.status(404); throw new Error("User not found"); }
  if (user.sellerStatus === "pending") { res.status(400); throw new Error("Application already pending"); }
  if (user.isSeller) { res.status(400); throw new Error("Already a seller"); }
  user.sellerStatus = "pending";
  user.sellerInfo = { shopName, shopDescription, appliedAt: new Date() };
  await user.save();
  res.json({ message: "Seller application submitted successfully" });
});

// GET ALL SELLER APPLICATIONS (admin)
const getSellerApplications = asyncHandler(async (req, res) => {
  const sellers = await User.find({ 
    sellerStatus: { $in: ["pending", "approved", "rejected"] } 
  }).select("-password");
  res.json(sellers);
});

// APPROVE OR REJECT SELLER (admin)
const updateSellerStatus = asyncHandler(async (req, res) => {
  const { status } = req.body; // "approved" or "rejected"
  const user = await User.findById(req.params.id);
  if (!user) { res.status(404); throw new Error("User not found"); }
  user.sellerStatus = status;
  user.isSeller = status === "approved";
  await user.save();
  res.json({ message: `Seller ${status} successfully`, sellerStatus: user.sellerStatus });
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
    { $group: { _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } }, revenue: { $sum: "$totalPrice" }, count: { $sum: 1 } } },
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

// SELLER ANALYTICS (seller's own revenue)
const getSellerAnalytics = asyncHandler(async (req, res) => {
  const Order = require("../models/Order");
  const Product = require("../models/Product");

  // Get seller's products
  const sellerProducts = await Product.find({ seller: req.user._id });
  const sellerProductIds = sellerProducts.map(p => p._id.toString());

  // Get orders containing seller's products
  const allOrders = await Order.find({ isPaid: true });
  let totalRevenue = 0;
  let totalSold = 0;
  const productStats = {};

  allOrders.forEach(order => {
    order.items.forEach(item => {
      if (sellerProductIds.includes(item.product?.toString())) {
        totalRevenue += item.price * item.quantity;
        totalSold += item.quantity;
        if (!productStats[item.name]) {
          productStats[item.name] = { totalSold: 0, revenue: 0 };
        }
        productStats[item.name].totalSold += item.quantity;
        productStats[item.name].revenue += item.price * item.quantity;
      }
    });
  });

  const topProducts = Object.entries(productStats)
    .map(([name, stats]) => ({ name, ...stats }))
    .sort((a, b) => b.totalSold - a.totalSold)
    .slice(0, 5);

  res.json({
    totalProducts: sellerProducts.length,
    totalRevenue,
    totalSold,
    topProducts
  });
});

module.exports = { 
  registerUser, loginUser, getUsers, toggleAdmin, deleteUser, 
  getAnalytics, applyForSeller, getSellerApplications, 
  updateSellerStatus, getSellerAnalytics 
};