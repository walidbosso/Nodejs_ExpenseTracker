const mongoose = require("mongoose");

const getTransactions = async (req, res) => {
  const transactionModel = mongoose.model("transactions");

  //2 To access the Path Parameters/ the query string provided in URL after ?  mark, to filter find, on this case we want specific transaction_type
  console.log(req.query);

  //1 we get the transactions of the loggedin user, req.user provided from auth middlware
  const transactions = await transactionModel.find({
    user_id: req.user._id, //1
    ...req.query, //2 spread, it will read it for us instead of writing it manually, but it must identic to the one u have in sschema, the attribut name
    // ...req.query is same as transaction_type: 'income', balance:100, it reads the Path parameters and spread it here
  });
  //1
  res.status(200).json({
    status: "success",
    data:
      transactions.length > 0
        ? transactions
        : "no transactions yet, try to add some income or expense",
  });
};

module.exports = getTransactions;
