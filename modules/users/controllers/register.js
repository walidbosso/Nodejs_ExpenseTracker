const mongoose = require("mongoose");
const bcrypt = require("bcrypt"); //require!!
const jsonwebtoken = require("jsonwebtoken"); // when we register we login and we must provide token key to access protected routes after middlware
const jwtManager = require("../../../managers/jwtManager");
const nodemailer = require("nodemailer");
const emailManager = require("../../../managers/emailManager");

const register = async (req, res) => {
  const usersModel = mongoose.model("users");

  const { email, password, confirm_password, name, balance } = req.body;

  // validations...

  if (!email) throw "Email must be provided!";
  if (!password) throw "Password must be provided!";
  if (password.length < 5) throw "Password must be at least 5 characters long.";

  if (!name) throw "Name is required";
  if (password !== confirm_password)
    throw "Password and confirmed password doesnot match!";

  const getDuplicateEmail = await usersModel.findOne({
    email: email,
  });

  if (getDuplicateEmail) throw "This email already exists!";

  //await darori hit 12 aydo lwaqt (expensive)
  const hashedPassword = await bcrypt.hash(password, 12); // 12 is number of rounds, hash over hash etc, you cker to crac a number that is not low (easy for hacker to crack) and not too high (expsensive)

  const createdUser = await usersModel.create({
    name: name,
    email: email,
    password: hashedPassword, //hashed
    balance: balance,
  });

  const accessToken = jwtManager(createdUser);
  // old code, now we use it in jwtManager.js
  //await jsonwebtoken.sign(
  //   {
  //     _id: createdUser._id,
  //     name: createdUser.name,
  //   },
  //   process.env.jwt_salt
  // );

  //Nodemailer
  // var transport = nodemailer.createTransport({
  //   host: "sandbox.smtp.mailtrap.io",
  //   port: 2525,
  //   auth: {
  //     user: "3d3f75027b3d06",
  //     pass: "82945ba6f6f768",
  //   },
  // });

  // transport.sendMail({
  //   to: createdUser.email, // its the email we registered with
  //   from: "info@expensetracker.com", // the one who sends, because we use mailtrap we can use anything but in case I had a domain I should have used it
  //   text: "welcome to expense tracker pro, I sent this from my cide NodeJS Masterclass",
  //   html: "<h1> Welcome</h1>",
  //   subject: "NodeJS Masterclass",
  // });
  //we replace the full code of email by function await because its async inside it
  await emailManager(
    createdUser.email,
    "welcome to expense tracker pro, I sent this from my cide NodeJS Masterclass",
    "<h1> Welcome</h1>",
    "NodeJS Masterclass"
  );
  res.status(201).json({
    status: "User registered successfully!",
    accessToken: accessToken,
  });
};

module.exports = register;
