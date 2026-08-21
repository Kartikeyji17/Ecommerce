const asyncHandler = require("../middleware/asyncHandler");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Order = require("../models/Order");
const fulfillOrder = require("../utils/fulfillOrder");
const { invalidateProductCache } = require("./orderController");
const logger = require("../config/logger");

// Create payment intent tied to an existing order
const createPaymentIntent = asyncHandler(async (req, res) => {
  const { orderId } = req.body;

  if (!orderId) {
    res.status(400);
    throw new Error("orderId is required");
  }

  const order = await Order.findById(orderId);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (order.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized");
  }

  if (order.isPaid) {
    res.status(400);
    throw new Error("Order already paid");
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(order.totalPrice * 100),
    currency: "usd",
    automatic_payment_methods: { enabled: true },
    metadata: { orderId: order._id.toString(), userId: req.user._id.toString() },
  });

  order.stripePaymentIntentId = paymentIntent.id;
  await order.save();

  res.json({ clientSecret: paymentIntent.client_secret, orderId: order._id });
});

// Stripe webhook — raw body required (mounted separately in app.js)
const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    logger.error({ err }, "Stripe webhook signature verification failed");
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    const orderId = paymentIntent.metadata?.orderId;

    if (orderId) {
      try {
        await fulfillOrder(orderId, paymentIntent.id);
        await invalidateProductCache();
        logger.info({ orderId }, "Order paid via webhook");
      } catch (err) {
        logger.error({ err, orderId }, "Webhook fulfillment failed");
        return res.status(500).json({ message: "Fulfillment failed" });
      }
    }
  }

  res.json({ received: true });
};

module.exports = { createPaymentIntent, stripeWebhook };
