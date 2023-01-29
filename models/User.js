const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const userSchema = mongoose.Schema({
  name: {
    type: "string",
    required: [true, "please provide a name"],
  },
  email: {
    type: "string",
    required: [true, "please provide a email address"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "please provide valid email address"],
  },
  password: {
    type: "string",
    required: [true, "please provide a password"],
    minlength: 8,
  },
  passwordConfirm: {
    type: "string",
    required: [true, "please confirm your password"],
    validate: {
      validator: function (item) {
        return item === this.password;
      },
      message: "Passwords are not same",
    },
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.comparePassword = async function (candidatePass, userPass) {
  return await bcrypt.compare(candidatePass, userPass);
};

module.exports = User = mongoose.model("User", userSchema);
