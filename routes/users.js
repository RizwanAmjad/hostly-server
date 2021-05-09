const _ = require("lodash");
const auth = require("../middleware/auth");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const { validate, User } = require("../models/users");

router.post("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});

router.post("/", async (req, res) => {
  // validate the request body
  const result = validate(req.body);
  if (result.error) {
    return res.status(400).send(result.error);
  }

  // make sure user is not already registered
  let user = await User.findOne({
    email: req.body.email,
  });
  if (user) return res.status(400).send("User already exists...");

  // process the request and save to database
  user = new User(
    _.pick(req.body, ["name", "email", "password", "phone_number"])
  );

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();
  user = _.pick(user, ["_id", "name", "email", "phone_number"]);
  res.send(user);
});

module.exports = router;
