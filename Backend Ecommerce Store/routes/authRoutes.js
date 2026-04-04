const express = require("express");
const { loginUser, registerUser, getUsers, toggleAdmin, deleteUser, getAnalytics } = require("../controllers/authController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.get("/users", protect, adminOnly, getUsers);
router.put("/users/:id/toggle-admin", protect, adminOnly, toggleAdmin);
router.delete("/users/:id", protect, adminOnly, deleteUser);
router.get("/analytics", protect, adminOnly, getAnalytics);

module.exports = router;