const mongoose = require("mongoose");

const SubscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
},

  plan: {
    type: String,
    enum: ["FREE", "BRONZE", "SILVER", "GOLD"],
    default: "FREE",
},

  subscriptionLimit: {
    type: Number,
    default: 1,
  },

  usedApplications: {
    type: Number,
    default: 0,
  },

  subscriptionDate: {
    type: Date,
    default: null,
  },
});

module.exports = mongoose.model("Subscription", SubscriptionSchema);