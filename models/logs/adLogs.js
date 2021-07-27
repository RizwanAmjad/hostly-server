const mongoose = require("mongoose");

const AdLog = mongoose.model(
  "AdLog",
  mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    time: { type: Date, default: Date.now },
  })
);

module.exports = AdLog;
