const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { auth } = require("../middleware/auth");
const {
  signUp,
  login,
  logout,
  test,
  refresh,
} = require("../controller/userController");

router.post("/signup", signUp);
router.post("/login", login);
router.post("/logout", logout);
router.get("/test", auth, test);
router.get("/refresh", refresh);
// router.get("/me", auth, me);

module.exports = router;
