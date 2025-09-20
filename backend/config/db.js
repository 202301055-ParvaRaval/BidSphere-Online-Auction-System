// config/db.js
//First we import mongoose
const mongoose = require("mongoose");

//Then we create a function to connect to the database
const connectDB = async () => {
  try {
    // Connect to MongoDB using the connection string from environment variables
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected"); 
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

//Finally we export the connectDB function to be used in server.js
module.exports = connectDB;
