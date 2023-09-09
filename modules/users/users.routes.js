const express = require("express");
const register = require("./controllers/register");
const login = require("./controllers/login");
const userDashboard = require("./controllers/userDashboard");
const auth = require("../../middleware/auth");
const forgotPassword = require("./controllers/forgotPassword");
const resetPassword = require("./controllers/resetPassword");
const userRoutes = express.Router();

// Routes...
//public routes
userRoutes.post("/register", register); //localhost:8000/api/users/register //that controller will handle it, ctrl+space+click to import it
userRoutes.post("/login", login);

userRoutes.post("/forgotpw", forgotPassword); //emails
userRoutes.post("/resetpw", resetPassword);

//middlware
userRoutes.use(auth);
//everything below this line will be controlled by this auth middleware

//Protected Routes
userRoutes.get("/dashboard", userDashboard);

module.exports = userRoutes; //app.js will use it
