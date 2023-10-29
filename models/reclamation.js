const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const reclamationShema = mongoose.Schema({
  reclamation: {
    type: String,
    required: [true, "enter your firstname"],
  },
  firstnameUser: {
    type: String,
  },
  lastnameUser: {
    type: String,
  },
  emailUser: {
    type: String,
  },
});

const reclamation = mongoose.model("reclamation", reclamationShema);
module.exports = reclamation;
