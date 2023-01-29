const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.auth = async (req, res, next) => {
  try {
    let token = req.cookies.token;
    console.log(req.cookies);
    if (!token) {
      return res.status(401).json({ message: "Not authorised" });
    }
    let decoded_user = jwt.verify(token, process.env.SKEY);
    let user = await User.findOne({ id: decoded_user.id });
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};
