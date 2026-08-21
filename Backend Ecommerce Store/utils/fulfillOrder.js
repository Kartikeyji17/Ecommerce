const mongoose = require("mongoose");
const Order = require("../models/Order");
const Product = require("../models/Product");
const logger = require("../config/logger");

const fulfillOrder = async (orderId, paymentIntentId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const order = await Order.findById(orderId).session(session);
    if (!order) {
      throw new Error("Order not found");
    }

    if (order.isPaid) {
      await session.commitTransaction();
      return order;
    }

    for (const item of order.items) {
      if (!item.product) continue;
      const product = await Product.findById(item.product).session(session);
      if (!product) continue;

      if (product.countInStock < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}`);
      }

      product.countInStock -= item.quantity;
      await product.save({ session });
    }

    order.isPaid = true;
    order.paidAt = new Date();
    order.status = "paid";
    if (paymentIntentId) {
      order.stripePaymentIntentId = paymentIntentId;
    }

    await order.save({ session });
    await session.commitTransaction();
    logger.info({ orderId, paymentIntentId }, "Order fulfilled");
    return order;
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};

module.exports = fulfillOrder;
