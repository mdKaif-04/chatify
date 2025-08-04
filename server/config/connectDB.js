const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const connection = mongoose.connection;
    connection.on("connected", () => {
      console.log("MongoDB connected successfully!");
    });
    connection.on("error", (error) => {
      console.error(`Error while connectin to MongoDB: ${error.message}`);
    });
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
  }
}

module.exports = connectDB;
