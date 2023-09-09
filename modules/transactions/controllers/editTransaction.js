const mongoose = require("mongoose");
const validator = require("validator"); //3

const editTransaction = async (req, res) => {
  const transactionModel = mongoose.model("transactions");
  //1 we can add amount and transaction_type
  const { transaction_id, remarks } = req.body;
  //2
  if (!transaction_id) throw "Transaction id is required!";
  //3 goota be mongo's valid id
  if (!validator.isMongoId(transaction_id.toString()))
    throw "Please provide a valid id!";
  //4 make sure the id exist or else throw to errorHandler
  const getTransaction = await transactionModel.findOne({
    _id: transaction_id,
  });

  if (!getTransaction) throw "Transaction not found!";
  //5

  // if (
  //   getTransaction.transaction_id !== "income" &&
  //   getTransaction.transaction_id !== "expense"
  // )
  //   throw "transaction type must be income or expense";
  await transactionModel.updateOne(
    {
      _id: transaction_id, //where, condition
    },
    {
      remarks,
    },
    {
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "Transaction updated successfully!",
  });
};

module.exports = editTransaction;
