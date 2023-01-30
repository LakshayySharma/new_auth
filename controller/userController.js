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
    let refresh_token = jwt.sign(payload, process.env.RKEY, {
      expiresIn: process.env.RJWT_EXPIRATION,
    });
    let access_token = jwt.sign({ id: user._id }, process.env.SKEY, {
      expiresIn: process.env.JWT_EXPIRATION,
    });
    res.cookie("refresh_token", refresh_token, {
      expires: new Date(Date.now() + 90 * 1000 * 60 * 60 * 24),
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    res.json({
      msg: "Signup successful",
      access_token,
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
      let refresh_token = jwt.sign({ id: user._id }, process.env.RKEY, {
        expiresIn: process.env.RJWT_EXPIRATION,
      });
      let access_token = jwt.sign({ id: user._id }, process.env.SKEY, {
        expiresIn: process.env.JWT_EXPIRATION,
      });
      res.cookie("refresh_token", refresh_token, {
        expires: new Date(Date.now() + 90 * 1000 * 60 * 60 * 24),
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });
      user = await User.findOne({ email: email }).select("-password");
      res.json({
        msg: "Login successful",
        access_token,
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
    res.clearCookie("refresh_token", {
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

exports.refresh = async (req, res) => {
  try {
    let token = req.cookies.refresh_token;
    console.log(token);
    if (!token) {
      return res.status(401).json({ message: "Not authorised" });
    } else {
      let decoded_user = jwt.verify(token, process.env.RKEY);
      let user = await User.findOne({ id: decoded_user.id }).select(
        "-password"
      );
      console.log(user);
      let access_token = jwt.sign({ id: user._id }, process.env.SKEY, {
        expiresIn: process.env.JWT_EXPIRATION,
      });
      res.status(200).json({
        access_token,
      });
    }
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};
