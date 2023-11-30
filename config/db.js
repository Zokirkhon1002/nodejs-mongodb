const mongoose = require("mongoose");

// skip Mongoose Deprecation Warning "the strictQuery"
mongoose.set("strictQuery", true);

async function connectToMongoDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Unable to connect to MongoDB:", error);
  }
}

module.exports = connectToMongoDB;
