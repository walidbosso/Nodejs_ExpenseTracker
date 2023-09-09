const mongoose = require("mongoose"); //2
const emailManager = require("../../../managers/emailManager");
// const nodemailer = require("nodemailer"); //7

const forgotPassword = async (req, res) => {
  //1
  const usersModel = mongoose.model("users"); //2

  //3 validation, we analyse the request from client
  const { email } = req.body;

  if (!email) throw "Email is required!";

  //4 if they send email, we look for it in DB findOne
  const getUser = await usersModel.findOne({
    email: email, //condition
  });

  if (!getUser) throw "This email doesnot exist in the system!";
  //6
  const resetCode = Math.floor(10000 + Math.random() * 90000);

  await usersModel.updateOne(
    {
      email: email, //condition
    },
    {
      reset_code: resetCode, // what we gonna update, //5 you should add it in schema
    },
    {
      runValidators: true,
    }
  );
  // //7
  // var transport = nodemailer.createTransport({
  //   host: "sandbox.smtp.mailtrap.io",
  //   port: 2525,
  //   auth: {
  //     user: "3d3f75027b3d06",
  //     pass: "82945ba6f6f768",
  //   },
  // });

  // //8 send the rest code in email to client// email from payload request, u can use user.email, same
  // const a = await transport.sendMail({
  //   to: email,
  //   from: "info@expensetracker.com",
  //   text: "Your password reset code is " + resetCode,
  //   html: "Your password reset code is " + resetCode,
  //   subject:
  //     "Reset your password - Expense tracker PRO",
  // });
  // //console.log(a);

  //we replace the full code of email by function await because its async inside it
  await emailManager(
    email,
    "Your password reset code is " + resetCode,
    "<h1> Your password reset code is " + resetCode + "</h1>",
    "Reset your password - Expense tracker PRO NodeJS Masterclass"
  );

  res.status(200).json({
    //1
    status: "Reset code sent to email successfully!",
  });
};

module.exports = forgotPassword; //1
