const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },

  description: {
    type: String,
  },

  duration: {
    type: Number,
  },

  date: {
    type: String,
  },
}, { versionKey: false });

const User = mongoose.model("User", userSchema);

module.exports = User;
