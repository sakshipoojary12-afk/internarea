const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  userName: String,
  userEmail: String,
  content: String,

  media: String,

  likes: {
    type: Number,
    default: 0,
  },

  shares: {
    type: Number,
    default: 0,
  },

  comments: [
    {
      userName: String,
      text: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Post", PostSchema);