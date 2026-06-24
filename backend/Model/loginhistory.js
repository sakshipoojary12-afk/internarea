const mongoose = require("mongoose");

const loginHistorySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  browser: String,
  os: String,
  device: String,
  ipAddress: String,
  loginTime: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model(
  "LoginHistory",
  loginHistorySchema
);