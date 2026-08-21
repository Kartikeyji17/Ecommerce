const User = require("../models/User");
const Address = require("../models/Address");
const bcrypt = require("bcryptjs");
const asyncHandler = require("../middleware/asyncHandler");

const updateProfile = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name?.trim()) {
    res.status(400);
    throw new Error("Name is required");
  }

  const user = await User.findById(req.user._id);
  user.name = name.trim();
  await user.save();

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    isSeller: user.isSeller,
    sellerStatus: user.sellerStatus,
  });
});

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    res.status(400);
    throw new Error("Current and new password are required");
  }

  if (newPassword.length < 6) {
    res.status(400);
    throw new Error("New password must be at least 6 characters");
  }

  const user = await User.findById(req.user._id);
  const isMatch = await bcrypt.compare(currentPassword, user.password);

  if (!isMatch) {
    res.status(401);
    throw new Error("Current password is incorrect");
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.json({ message: "Password updated successfully" });
});

const getAddresses = asyncHandler(async (req, res) => {
  const addresses = await Address.find({ user: req.user._id }).sort({ isDefault: -1 });
  res.json(addresses);
});

const createAddress = asyncHandler(async (req, res) => {
  const { label, address, city, state, zipCode, isDefault } = req.body;

  if (!address || !city || !state || !zipCode) {
    res.status(400);
    throw new Error("All address fields are required");
  }

  if (isDefault) {
    await Address.updateMany({ user: req.user._id }, { isDefault: false });
  }

  const created = await Address.create({
    user: req.user._id,
    label: label || "Home",
    address,
    city,
    state,
    zipCode,
    isDefault: !!isDefault,
  });

  res.status(201).json(created);
});

const updateAddress = asyncHandler(async (req, res) => {
  const addr = await Address.findById(req.params.id);
  if (!addr || addr.user.toString() !== req.user._id.toString()) {
    res.status(404);
    throw new Error("Address not found");
  }

  const { label, address, city, state, zipCode, isDefault } = req.body;

  if (isDefault) {
    await Address.updateMany({ user: req.user._id }, { isDefault: false });
  }

  addr.label = label ?? addr.label;
  addr.address = address ?? addr.address;
  addr.city = city ?? addr.city;
  addr.state = state ?? addr.state;
  addr.zipCode = zipCode ?? addr.zipCode;
  addr.isDefault = isDefault ?? addr.isDefault;

  await addr.save();
  res.json(addr);
});

const deleteAddress = asyncHandler(async (req, res) => {
  const addr = await Address.findById(req.params.id);
  if (!addr || addr.user.toString() !== req.user._id.toString()) {
    res.status(404);
    throw new Error("Address not found");
  }

  await addr.deleteOne();
  res.json({ message: "Address deleted" });
});

module.exports = {
  updateProfile,
  changePassword,
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
};
