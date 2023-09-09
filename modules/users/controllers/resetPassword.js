const mongoose = require("mongoose");
const bcrypt = require("bcrypt"); //5
const emailManager = require("../../../managers/emailManager");

const resetPassword = async (req, res) => {
  const usersModel = mongoose.model("users");

  //2 validation, analyse request of client
  const { email, new_password, reset_code } = req.body;

  if (!email) throw "Email is required";
  if (!new_password) throw "Please provide new password!";
  if (!reset_code) throw "Reset code is required!"; // if you provide "" or null also this exception will be thrown
  if (new_password.length < 5)
    throw "Password must be at least 5 characters long!";

  //3 find with 2 conditions
  const getUserWithResetCode = await usersModel.findOne({
    email: email,
    reset_code: reset_code, // he must have email AND code, if not the process will stop with the exception thrown
  });

  if (!getUserWithResetCode) throw "Reset code does not match!";
  //5
  const hashedPassword = await bcrypt.hash(new_password, 12);
  //4
  await usersModel.updateOne(
    {
      email: email,
    },
    {
      password: hashedPassword, //5
      reset_code: "", // or else h'll keep reseting, and don't worry if he provides "" the exception will be thrown
    },
    {
      runValidators: true, //never forget it in updzate
    }
  );

  //msg of validation
  await emailManager(
    email,
    "Your password has been reseted If you didnt do this, contact us",
    "Your password has been reseted If you didnt do this, contact us",
    "Password reseted successfuly"
  );
  res.status(200).json({
    status: "success",
    message: "Password reseted succesfully!",
  });
};

module.exports = resetPassword;
