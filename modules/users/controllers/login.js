const mongoose = require("mongoose"); //2
const bcrypt = require("bcrypt"); //7
const jsonwebtoken = require("jsonwebtoken"); //8
const jwtManager = require("../../../managers/jwtManager");

const login = async (req, res) => {
  //1
  const usersModel = mongoose.model("users"); //2

  const { email, password } = req.body; //3

  //5
  const getUser = await usersModel.findOne({
    email: email,
  });

  //6
  if (!getUser) throw "This email doesnot exist in the system!";
  console.log(getUser); //getUser.password

  //7 always await with bcrypt, 1st paramter is plein text (normal) 2nd is the cryptd one
  const comparePassword = await bcrypt.compare(password, getUser.password);
  if (!comparePassword) throw "Email and password do not match!";

  //8
  const accessToken = jwtManager(getUser);

  // await jsonwebtoken.sign(
  //   {
  //     //payload
  //     _id: getUser._id,
  //     name: getUser.name,
  //   }, // secret-key
  //   process.env.jwt_salt
  // );
  // success response
  res.status(200).json({
    //4
    status: "success",
    message: "User logged in successfully!",
    accessToken: accessToken,
  });
};

module.exports = login; //1
