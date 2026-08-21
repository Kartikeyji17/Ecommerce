const express = require("express");
const cors = require("cors");
const logger = require("./config/logger");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const cartRoutes = require("./routes/cartRoutes");
const healthRoutes = require("./routes/healthRoutes");
const { stripeWebhook } = require("./controllers/paymentController");
const { errorHandler } = require("./middleware/errorMiddleware");
const { apiRateLimit } = require("./middleware/rateLimiter");

const app = express();

// Stripe webhook must use raw body — register before express.json()
app.post(
  "/api/payment/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  logger.info({ method: req.method, url: req.url }, "request");
  next();
});

app.use(apiRateLimit);

// Routes
app.use("/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/cart", cartRoutes);

app.get("/", (req, res) => {
  res.send("API Running");
});

app.use(errorHandler);

module.exports = app;
