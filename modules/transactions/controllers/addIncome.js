const mongoose = require("mongoose"); //2
const validator = require("validator"); //4

//1
const addIncome = async (req, res) => {
  const usersModel = mongoose.model("users"); //2
  const transactionsModel = mongoose.model("transactions"); //2 make sure it matches the string in mongoose.model
  //3
  const { amount, remarks } = req.body;
  //3 validations
  if (!amount) throw "Amount is required!";
  if (!remarks) throw "Remarks is required!";

  if (remarks.length < 5) throw "Remarks must be at least 5 characters long!";

  //4 validations using validator package, check if amount is a numpber
  //always convert to string when using validator!! or else it will throw an error we xpect string but u provided a number
  // console.log(validator.isNumeric(amount.toString())); //true/false
  if (!validator.isNumeric(amount.toString()))
    throw "Amount must be a valid number.";
  //6
  if (amount < 0) throw "Amount must not be negative";

  //5 create, and we neen await
  await transactionsModel.create({
    user_id: req.user._id, //we got it from JWT, we'll assign the transiction to the loggedin user
    amount: amount, //req.body
    remarks: remarks, //req.body
    transaction_type: "income", //addIncome
  });

  await usersModel.updateOne(
    //await because its DB
    {
      _id: req.user._id, // 1st parameter condition  WHERE
    },
    {
      //2nd parameter what we gonna update
      //inc yaeni +=, balance and amount must be both type Number in schema/ or you could paseInd(amount)for example
      $inc: {
        balance: amount,
      },
    },
    {
      //3rd parameters
      //activate the validators in schema always in update
      runValidators: true,
    }
  );

  res.status(200).json({
    //1
    status: "success",
    message: "Income added successfully!",
  });
};

module.exports = addIncome; //1
