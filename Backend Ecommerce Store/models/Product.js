const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, default: "" },
  image: { type: String, default: "" },
  category: { type: String, default: "General" },
  countInStock: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },

  // Seller fields
  seller: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    default: null 
  },
  isApproved: { type: Boolean, default: false },
  approvedAt: { type: Date }

}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);