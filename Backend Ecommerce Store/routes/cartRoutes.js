const express = require("express");
const router = express.Router();
const { getCart, saveCart, clearCart } = require("../controllers/cartController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getCart);
router.put("/", protect, saveCart);
router.delete("/", protect, clearCart);

module.exports = router;
