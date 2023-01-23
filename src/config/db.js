const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const MONGO_URL = process.env.MONGO_URI 
const connectDB = async () => {
  try {
    //mongoose.set("strictQuery", false);
    await mongoose.connect(
      MONGO_URL ||
        "mongodb+srv://haroon:DVOCcKoAz3X8fY4o@cluster0.qw3vrho.mongodb.net/recordDB?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("Database Connected");
  } catch (err) {
    console.log("Could not connect to MongoDB");
    console.log(err);
    process.exit(1);
  }
};
module.exports = connectDB;
