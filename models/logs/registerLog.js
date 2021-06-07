const mongoose = require("mongoose");

const RegisterationLog = mongoose.model(
  "RegisterationLog",
  mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    time: { type: Date, default: Date.now },
  })
);

module.exports = RegisterationLog;
