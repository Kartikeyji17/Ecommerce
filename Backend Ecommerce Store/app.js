const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");

const { errorHandler } = require("./middleware/errorMiddleware");

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// just to check if the server is running
app.get("/", (req, res) => {
  res.send("API Running");
});

// Error Handler
app.use(errorHandler);

module.exports = app;