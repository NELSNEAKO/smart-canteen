const mongoose = require('mongoose');

const url = "mongodb+srv://Janjo:0524231031@cluster0.ju82l.mongodb.net/smart-canteen?retryWrites=true&w=majority";

const connectDB = async () => {
  try {
    await mongoose.connect(url); // No need for deprecated options
    console.log("✅ MongoDB Connected Successfully!");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
