require("express-async-errors");
const express = require("express");
const cors = require("cors"); // before deploying, check pdf
const errorHandler = require("./handlers/errorHandler");
const mongoose = require("mongoose");
const userRoutes = require("./modules/users/users.routes");
const transactionRoutes = require("./modules/transactions/transactions.routes");
require("dotenv").config();

//Connection to MDB DB
mongoose
  .connect(process.env.mongo_connection, {})
  .then(() => {
    console.log("Connection to MongoDB successfull!!");
  })
  .catch(() => {
    console.log("Connection to MongoDB failed!!");
  });
require("./models/users.model");
require("./models/transactions.model");

//express
const app = express();
//cors
app.use(cors());
//express to read json instead of xml
app.use(express.json());

//Routes
app.use("/api/users", userRoutes); // userRoutes of folder modules/users will handle /api/users
app.use("/api/transactions", transactionRoutes); // transationRoutes of folder modules/transactions will handle /api/transactions

//endof all routes
app.all("*", (req, res, next) => {
  res.status(404).json({
    status: "failed",
    message: "Error 404 not found",
  });
});
app.use(errorHandler);

app.listen(8000, () => {
  console.log("Server started successfully");
});
