const mongoose = require("mongoose");

async function initialize() {
  await mongoose.connect(`${process.env.MONGO_PATH}/extracker`)
}

module.exports = { initialize };
