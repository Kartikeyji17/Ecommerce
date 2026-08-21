const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  label: { type: String, default: "Home" }, // e.g. "Home", "Work"
  firstName: String,
  lastName: String,
  address: String,
  city: String,
  state: String,
  zipCode: String,
  phone: String,
  isDefault: { type: Boolean, default: false },
});

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, index: true },
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
  },

  addresses: [addressSchema],

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);