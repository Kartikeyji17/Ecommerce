const express = require("express");
const router = express.Router();
const {
  updateProfile,
  changePassword,
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
} = require("../controllers/profileController");
const { protect } = require("../middleware/authMiddleware");

router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);
router.get("/addresses", protect, getAddresses);
router.post("/addresses", protect, createAddress);
router.put("/addresses/:id", protect, updateAddress);
router.delete("/addresses/:id", protect, deleteAddress);

module.exports = router;
