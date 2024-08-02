// db.js
const mongoose = require("mongoose");
const config = require("config");

const MONGO_DB_URI = config.get("MONGO_DB_URI");

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected...");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
