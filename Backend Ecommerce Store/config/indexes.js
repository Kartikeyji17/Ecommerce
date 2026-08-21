const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const logger = require("./logger");

const ensureIndexes = async () => {
  try {
    await User.syncIndexes();
    await Product.syncIndexes();
    await Order.syncIndexes();
    logger.info("MongoDB indexes synced");
  } catch (err) {
    logger.error({ err }, "Failed to sync indexes");
  }
};

module.exports = ensureIndexes;
