const express = require("express");
const router = express.Router();
const { 
  getProducts, getProductById, createProduct, updateProduct, deleteProduct,
  sellerCreateProduct, getSellerProducts, sellerUpdateProduct,
  sellerDeleteProduct, getPendingProducts, approveProduct
} = require("../controllers/productController");
const { protect, adminOnly, sellerOnly } = require("../middleware/authMiddleware");

// Public
router.get("/", getProducts);
router.get("/:id", getProductById);

// Admin
router.post("/", protect, adminOnly, createProduct);
router.get("/admin/pending", protect, adminOnly, getPendingProducts);
router.put("/admin/:id/approve", protect, adminOnly, approveProduct);
router.put("/:id", protect, adminOnly, updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);

// Seller
router.post("/seller/create", protect, sellerOnly, sellerCreateProduct);
router.get("/seller/my-products", protect, sellerOnly, getSellerProducts);
router.put("/seller/:id", protect, sellerOnly, sellerUpdateProduct);
router.delete("/seller/:id", protect, sellerOnly, sellerDeleteProduct);

module.exports = router;