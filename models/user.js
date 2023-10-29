const mongoose = require("mongoose");
//const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userShema = mongoose.Schema({
  firstname: {
    type: String,
    required: [true, "enter your firstname"],
  },
  lastname: {
    type: String,
    required: [true, "enter your lastname"],
  },
  phone: {
    type: Number,
    required: [true, "enter your phone"],
  },
  post: {
    type: String,
    required: [true, "enter your post"],
  },
  grade: {
    type: String,
    required: [true, "enter your grade"],
  },

  email: {
    type: String,
    required: [true, "enter your email"],
  },
  password: {
    type: String,
    required: [true, "enter your password"],
  },
});

userShema.methods.hashPassword = async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
};

const user = mongoose.model("user", userShema);
module.exports = user;
