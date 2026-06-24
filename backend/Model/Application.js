const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  company: String,
  category: String,
  coverLetter: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["accepted", "pending", "rejected"],
    default: "pending",
  },
  applicationData: Object,
});

module.exports = mongoose.model("Application", applicationSchema);