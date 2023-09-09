const mongoose = require("mongoose");
const validator = require("validator"); //3

const deleteTransaction = async (req, res) => {
  const transactionModel = mongoose.model("transactions");
  const usersModel = mongoose.model("users"); //5 to update balance when we delete a transaction

  //1 we exctract the id from URL /transactions/_id
  const { transaction_id } = req.params;

  //3 , make sure it's like 64fb7270bcf382cc97759a90, always use toString with validator
  if (!validator.isMongoId(transaction_id.toString()))
    throw "Please provide a valid id!";

  //2 we must check if that id exist in BD or else we throw an exception in errorHandler and return to stop the process
  const getTransaction = await transactionModel.findOne({
    _id: transaction_id, // it must be a valid type of id, mongoose expect the _id that looks similar to the one in MongoDB
  });

  if (!getTransaction) throw "Transaction not found!";

  console.log(getTransaction);

  //5 update the user balance depending on transactiontype we found on findOne
  if (getTransaction.transaction_type === "income") {
    // income logic here, remove from the balance

    await usersModel.updateOne(
      {
        _id: getTransaction.user_id,
      },
      {
        $inc: {
          balance: getTransaction.amount * -1,
        },
      },
      {
        runValidators: true,
      }
    );
  } else {
    // expense logic here, add to the user balance

    await usersModel.updateOne(
      {
        _id: getTransaction.user_id,
      },
      {
        $inc: {
          balance: getTransaction.amount,
        },
      },
      {
        runValidators: true,
      }
    );
  }
  //4
  await transactionModel.deleteOne({
    _id: transaction_id,
  });

  res.status(200).json({
    status: "Deleted successfully!",
  });
};

module.exports = deleteTransaction;
