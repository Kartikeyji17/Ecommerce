const Product = require("../models/Product");

const SHIPPING_RATES = {
  standard: (subtotal) => (subtotal > 50 ? 0 : 9.99),
  express: () => 29.99,
  overnight: () => 99.99,
};

const TAX_RATE = 0.1;

const buildOrderFromItems = async (rawItems, shippingMethod = "standard") => {
  if (!rawItems?.length) {
    const err = new Error("No items in order");
    err.statusCode = 400;
    throw err;
  }

  const items = [];
  let subtotal = 0;

  for (const raw of rawItems) {
    const productId = raw.productId || raw.id;
    const quantity = Number(raw.quantity);

    if (!productId || !quantity || quantity < 1) {
      const err = new Error("Invalid cart item");
      err.statusCode = 400;
      throw err;
    }

    const product = await Product.findById(productId);
    if (!product) {
      const err = new Error(`Product not found: ${productId}`);
      err.statusCode = 404;
      throw err;
    }

    const isVisible =
      product.isApproved || product.seller === null || product.seller === undefined;
    if (!isVisible) {
      const err = new Error(`Product unavailable: ${product.name}`);
      err.statusCode = 400;
      throw err;
    }

    if (product.countInStock < quantity) {
      const err = new Error(`Insufficient stock for ${product.name}`);
      err.statusCode = 400;
      throw err;
    }

    const lineTotal = product.price * quantity;
    subtotal += lineTotal;

    items.push({
      product: product._id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.image,
    });
  }

  const shippingFn = SHIPPING_RATES[shippingMethod] || SHIPPING_RATES.standard;
  const shippingCost = shippingFn(subtotal);
  const tax = subtotal * TAX_RATE;
  const totalPrice = subtotal + shippingCost + tax;

  return { items, subtotal, shippingCost, tax, totalPrice };
};

module.exports = { buildOrderFromItems, SHIPPING_RATES, TAX_RATE };
