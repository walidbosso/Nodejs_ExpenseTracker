const mongoose = require("mongoose");

const userDashboard = async (req, res) => {
  const usersModel = mongoose.model("users");
  //after finishing with transactions module, addincome/expense and get
  const transactionsModel = mongoose.model("transactions");

  console.log(req.user);
  //we get the req.user that countains user id and name, we take the id to retrieve all data related to that specifi user from DB
  const getUser = await usersModel
    .findOne({
      _id: req.user._id,
    })
    .select("-password"); //  we don't want to include sensitive data in status(200), we exclude password, if you want to exclude name too, "-password -name"
  //if you want to include speicifc attributs, "name email balance" just space between them
  //__v in DB represents version, if we updated that user it will be 1, pure one is 0, we can add timestamp in schema btw as a 2nd parameter

  //we add user transactions to userDashboard now after finishing with it
  const transactions = await transactionsModel
    .find({
      user_id: req.user._id, // what we have in schema: what we get from JWT token, logged in user
    })
    .sort("-createdAt")
    .limit(2); //sort Data from new to old, and only show two transactions

  res.status(200).json({
    status: "success",
    data: getUser,
    transactions, // equicalent to transactions:transactions
  });
};

module.exports = userDashboard;
