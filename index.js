const express = require("express");
const cors = require("cors");
const app = express();
const userRoutes = require("./src/routes/userRoute");
const mealRoutes = require("./src/routes/mealRoute");
const connectDB = require("./src/config/db");
require("dotenv").config();

connectDB();
PORT = process.env.PORT
app.set(cors());
app.use(express.json());
app.use(express.static("client"))
app.get("/", (req, res) => {
  res.send("Welcome to Meal Record Api with NodeJs");
});
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/meal", mealRoutes);


app.listen(PORT, () => {
  console.log("server is running on PORT=", PORT);
});
