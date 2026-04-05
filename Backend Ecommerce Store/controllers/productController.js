const Product = require("../models/Product");
const asyncHandler = require("../middleware/asyncHandler");

// Get all products (only approved ones for public)
const getProducts = asyncHandler(async (req, res) => {
  // const products = await Product.find({ isApproved: true }).populate("seller", "name sellerInfo");
  const products = await Product.find({$or: [{ isApproved: true }, { seller: null }]}).populate("seller", "name sellerInfo");
  
  res.json(products);
});

// Get single product
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate("seller", "name sellerInfo");
  if (!product) { res.status(404); throw new Error("Product not found"); }
  res.json(product);
});

// Create product (admin)
const createProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, category, countInStock } = req.body;
  // Admin products are auto-approved
  const product = await Product.create({ 
    name, price, description, image, category, countInStock,
    isApproved: true
  });
  res.status(201).json(product);
});

// Update product (admin)
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) { res.status(404); throw new Error("Product not found"); }
  const { name, price, description, image, category, countInStock } = req.body;
  product.name = name ?? product.name;
  product.price = price ?? product.price;
  product.description = description ?? product.description;
  product.image = image ?? product.image;
  product.category = category ?? product.category;
  product.countInStock = countInStock ?? product.countInStock;
  const updated = await product.save();
  res.json(updated);
});

// Delete product (admin)
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) { res.status(404); throw new Error("Product not found"); }
  await product.deleteOne();
  res.json({ message: "Product deleted" });
});

// SELLER - Create product (pending approval)
const sellerCreateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, category, countInStock } = req.body;
  const product = await Product.create({
    name, price, description, image, category, countInStock,
    seller: req.user._id,
    isApproved: false  // needs admin approval
  });
  res.status(201).json(product);
});

// SELLER - Get their own products
const getSellerProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ seller: req.user._id });
  res.json(products);
});

// SELLER - Update their own product
const sellerUpdateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) { res.status(404); throw new Error("Product not found"); }
  if (product.seller.toString() !== req.user._id.toString()) {
    res.status(403); throw new Error("Not authorized to edit this product");
  }
  const { name, price, description, image, category, countInStock } = req.body;
  product.name = name ?? product.name;
  product.price = price ?? product.price;
  product.description = description ?? product.description;
  product.image = image ?? product.image;
  product.category = category ?? product.category;
  product.countInStock = countInStock ?? product.countInStock;
  product.isApproved = false; // re-approval needed after edit
  const updated = await product.save();
  res.json(updated);
});

// SELLER - Delete their own product
const sellerDeleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) { res.status(404); throw new Error("Product not found"); }
  if (product.seller.toString() !== req.user._id.toString()) {
    res.status(403); throw new Error("Not authorized to delete this product");
  }
  await product.deleteOne();
  res.json({ message: "Product deleted" });
});

// ADMIN - Get all pending products
const getPendingProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isApproved: false, seller: { $ne: null } })
    .populate("seller", "name email sellerInfo");
  res.json(products);
});

// ADMIN - Approve or reject product
const approveProduct = asyncHandler(async (req, res) => {
  const { isApproved } = req.body;
  const product = await Product.findById(req.params.id);
  if (!product) { res.status(404); throw new Error("Product not found"); }
  product.isApproved = isApproved;
  product.approvedAt = isApproved ? new Date() : null;
  await product.save();
  res.json({ message: `Product ${isApproved ? "approved" : "rejected"}`, product });
});

module.exports = { 
  getProducts, getProductById, createProduct, updateProduct, deleteProduct,
  sellerCreateProduct, getSellerProducts, sellerUpdateProduct, 
  sellerDeleteProduct, getPendingProducts, approveProduct
};