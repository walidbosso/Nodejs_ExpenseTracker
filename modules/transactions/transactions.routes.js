const express = require("express"); //1

const auth = require("../../middleware/auth"); //1
const addIncome = require("./controllers/addIncome"); //2
const addExpense = require("./controllers/addExpense");
const getTransactions = require("./controllers/getTransactions");
const deleteTransaction = require("./controllers/deleteTransaction");
const editTransaction = require("./controllers/editTransaction");

//1 to be able to use this rout in app.js
const transactionRoutes = express.Router();

// Routes...

//middlware
transactionRoutes.use(auth); //1

// Protected routes...

transactionRoutes.post("/addIncome", addIncome); //2
transactionRoutes.post("/addExpense", addExpense); //3
transactionRoutes.get("/", getTransactions); //4
transactionRoutes.delete("/:transaction_id", deleteTransaction);
transactionRoutes.patch("/", editTransaction);

module.exports = transactionRoutes; //1
