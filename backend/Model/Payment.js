const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
  },

  plan: {
    type: String,
    required: true,
  },

  amount: {
    type: Number,
    required: true,
  },

  paymentId: {
    type: String,
    required: true,
  },

  paymentDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Payment", PaymentSchema);