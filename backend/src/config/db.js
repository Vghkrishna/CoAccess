const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true, // Fixed typo (capital U)
      useUnifiedTopology: true,
    });

    console.log(` MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    // Fixed catch block (added 'err')
    console.error(`MongoDB connection error: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
