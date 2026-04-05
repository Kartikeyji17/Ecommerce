const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  isAdmin: { type: Boolean, default: false },

  // Seller fields
  isSeller: { type: Boolean, default: false },
  sellerStatus: { 
    type: String, 
    enum: ["none", "pending", "approved", "rejected"], 
    default: "none" 
  },
  sellerInfo: {
    shopName: { type: String, default: "" },
    shopDescription: { type: String, default: "" },
    appliedAt: { type: Date }
  }

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);