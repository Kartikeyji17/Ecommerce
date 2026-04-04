const Product = require("../models/Product");
const asyncHandler = require("../middleware/asyncHandler");

// Get all products
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// Get single product
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) { res.status(404); throw new Error("Product not found"); }
  res.json(product);
});

// Create product (admin)
const createProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, category, countInStock } = req.body;
  const product = await Product.create({ name, price, description, image, category, countInStock });
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

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };