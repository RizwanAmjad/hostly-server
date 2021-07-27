const admiAuth = require("../middleware/adminAuth");
const express = require("express");
const router = express.Router();
const _ = require("lodash");

const LoginLog = require("../models/logs/loginLogs");
const RegisterationLog = require("../models/logs/registerLog");
const AdLogs = require("../models/logs/adLogs");
const AdLog = require("../models/logs/adLogs");

router.get("/login", async (req, res) => {
  const logs = await LoginLog.find();
  const statistics = createStatistics(logs);
  res.send(statistics);
});

router.get("/register", async (req, res) => {
  const logs = await RegisterationLog.find();
  const statistics = createStatistics(logs);
  res.send(statistics);
});

router.get("/ads", async (req, res) => {
  const logs = await AdLog.find();
  const statistics = createStatistics(logs);
  res.send(statistics);
});

function createStatistics(logs) {
  let statistics = logs.map((log) => {
    return { ...log["_doc"], day: log.time.getDay() };
  });

  return _(statistics).countBy("day").value();
}

module.exports = router;
