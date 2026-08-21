const express = require("express");
const { 
  loginUser, registerUser, getUsers, toggleAdmin, deleteUser, 
  getAnalytics, applyForSeller, getSellerApplications, 
  updateSellerStatus, getSellerAnalytics, googleLogin,
  updateProfile, changePassword, getAddresses, createAddress, updateAddress, deleteAddress
} = require("../controllers/authController");
const { protect, adminOnly, sellerOnly } = require("../middleware/authMiddleware");
const { authRateLimit } = require("../middleware/rateLimiter");

const router = express.Router();

// Public
router.post("/login", authRateLimit, loginUser);
router.post("/register", authRateLimit, registerUser);
router.post("/google-login", authRateLimit, googleLogin);

// Admin
router.get("/users", protect, adminOnly, getUsers);
router.put("/users/:id/toggle-admin", protect, adminOnly, toggleAdmin);
router.delete("/users/:id", protect, adminOnly, deleteUser);
router.get("/analytics", protect, adminOnly, getAnalytics);

// Seller applications (admin)
router.get("/seller-applications", protect, adminOnly, getSellerApplications);
router.put("/seller-applications/:id", protect, adminOnly, updateSellerStatus);

// Seller
router.post("/apply-seller", protect, applyForSeller);
router.get("/seller-analytics", protect, sellerOnly, getSellerAnalytics);

// Profile
router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);
router.get("/addresses", protect, getAddresses);
router.post("/addresses", protect, createAddress);
router.put("/addresses/:id", protect, updateAddress);
router.delete("/addresses/:id", protect, deleteAddress);

module.exports = router;