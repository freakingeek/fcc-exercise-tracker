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
      type: Date,
    },
  },
  { versionKey: false }
);

const Log = mongoose.model("Log", logSchema);

module.exports = Log;
