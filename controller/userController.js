const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.signUp = async (req, res) => {
  try {
    let { name, email, password, passwordConfirm } = req.body;
    let user = new User({ name, email, password, passwordConfirm });
    await user.save();
    let payload = {
      id: user._id,
    };
    let token = await jwt.sign(payload, process.env.SKEY, {
      expiresIn: process.env.JWT_EXPIRATION,
    });
    res.cookie("token", token, {
      expires: new Date(Date.now() + 90 * 60 * 60 * 24),
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    res.json({
      msg: "Signup successful",
      token,
      user,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.login = async (req, res) => {
  try {
    let { email, password } = req.body;
    let user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({
        error: "no such user found",
      });
    }
    let correct = await user.comparePassword(password, user.password);
    if (correct) {
      let token = await jwt.sign({ id: user._id }, process.env.SKEY, {
        expiresIn: process.env.JWT_EXPIRATION,
      });
      res.cookie("token", token, {
        expires: new Date(Date.now() + 90 * 1000 * 60 * 60 * 24),
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });
      user = await User.findOne({ email: email }).select("-password");
      res.json({
        msg: "Login successful",
        token,
        user,
      });
    } else {
      res.status(401).json({
        error: "invalid email or password",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      sameSite: "none",
      secure: true,
    });
    res.json({
      msg: "logout successful",
    });
  } catch (error) {
    console.log(error);
  }
};

exports.test = async (req, res) => {
  let user = req.user;
  res.json({
    authenticated: true,
    user,
  });
};

exports.refresh = async (req, res) => {};
