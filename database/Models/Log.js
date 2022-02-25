const mongoose = require("mongoose");

const logSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
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
  },
  { versionKey: false }
);

const Log = mongoose.model("Log", logSchema);

module.exports = Log;
