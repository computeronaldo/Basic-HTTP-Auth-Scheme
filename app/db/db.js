const mongoose = require("mongoose");
require("dotenv").config({ path: ".env.development" });

const MONGODB_URI = process.env.MONGODB_CONNECTION_URI;

async function connectToMongoDB() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

module.exports = connectToMongoDB;
