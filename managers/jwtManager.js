const jsonwebtoken = require("jsonwebtoken");

const jwtManager = (user) => {
  // we provide a userobject parameter
  const accessToken = jsonwebtoken.sign(
    {
      _id: user._id, // we use the parameter
      name: user.name,
    },
    process.env.jwt_salt
  );

  return accessToken;
};

module.exports = jwtManager;
