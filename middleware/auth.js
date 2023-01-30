const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.auth = async (req, res, next) => {
  try {
    let token = req.cookies.refresh_token;
    console.log(req.cookies);
    if (!token) {
      return res.status(401).json({ message: "Not authorised" });
    } else {
      console.log(req.headers.authorization);
      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer ")
      ) {
        let aToken = req.headers.authorization.split(" ")[1];
        console.log(aToken);
        let decoded_user = jwt.verify(token, process.env.RKEY);
        let user = await User.findOne({ id: decoded_user.id }).select(
          "-password"
        );
        console.log(user);
        req.user = user;
        next();
      }
    }
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};
