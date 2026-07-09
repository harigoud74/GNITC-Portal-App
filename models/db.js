const mongoose = require("mongoose");

// Paste your URI string directly here
const mongoURI = "mongodb://127.0.0.1:27017/StudentAndFaculityDashboard";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(mongoURI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
