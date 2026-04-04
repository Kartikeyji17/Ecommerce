const asyncHandler = require("../middleware/asyncHandler");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Create payment intent
const createPaymentIntent = asyncHandler(async (req, res) => {
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    res.status(400);
    throw new Error("Invalid amount");
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // convert to cents
    currency: "usd",
    automatic_payment_methods: { enabled: true },
  });

  res.json({ clientSecret: paymentIntent.client_secret });
});

module.exports = { createPaymentIntent };