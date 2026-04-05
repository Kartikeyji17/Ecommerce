const express = require("express");
const { 
  loginUser, registerUser, getUsers, toggleAdmin, deleteUser, 
  getAnalytics, applyForSeller, getSellerApplications, 
  updateSellerStatus, getSellerAnalytics,googleLogin
} = require("../controllers/authController");
const { protect, adminOnly, sellerOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// Public
router.post("/login", loginUser);
router.post("/register", registerUser);

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

router.post("/google-login", googleLogin)

module.exports = router;