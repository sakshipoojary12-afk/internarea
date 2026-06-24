const mongoose = require("mongoose");

const url = "mongodb://127.0.0.1:27017/internshala";

module.exports.connect = async () => {
  try {
    await mongoose.connect(url);
    console.log("Database is connected successfully!");
  } catch (error) {
    console.error("Database connection failed:", error.message);
  }
};