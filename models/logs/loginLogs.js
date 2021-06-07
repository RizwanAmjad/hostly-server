const mongoose = require("mongoose");

const LoginLog = mongoose.model(
  "LoginLog",
  mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    time: { type: Date, default: Date.now },
  })
);

module.exports = LoginLog;
