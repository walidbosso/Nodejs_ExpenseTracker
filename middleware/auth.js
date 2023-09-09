const jsonwebtoken = require("jsonwebtoken"); //6

const auth = (req, res, next) => {
  //1 auth middlware, interrupts any call to a route that exist below it in user routes, and only when next() is called that we can activate the next route, it's made toprotect some kind of routes and make some validations before going to it
  //console.log('Hello from middlware');

  //4 comment everythin except next
  //console.log(req.headers);

  //7 we gonna show our custom error and not invalid token
  try {
    //5 the token provided by the client, its in header, in POSTMAN we go to Auth and bearer Token and we put key there, and here we can take it
    //8 must be inside try if somehow we don't send an auth, No Auth in type instead of Bearer, and replace doesn't work on undefined so it will throw an exception
    const accessToken = req.headers.authorization.replace("Bearer ", "");
    // console.log(accessToken);

    //6 let's verify it we the secret key we have in .env
    const jwt_payload = jsonwebtoken.verify(accessToken, process.env.jwt_salt);
    // console.log(jwt_payload);

    //9 this auth middleware should do is to pass this JWT payload in other functions that will be executed after it.
    req.user = jwt_payload;

    //7
  } catch (e) {
    //401 is unauthorized
    res.status(401).json({
      status: "failed",
      message: "Unauthorized!",
    });
    return; // important sinon will continue code of after catch
  }
  //3 This will stop the code from reaching the next route
  //throw "Won't let you reach the next route, interrputing with auth middlware";

  next(); //2 only when code reached next function then it goes to the next route
};

module.exports = auth;
