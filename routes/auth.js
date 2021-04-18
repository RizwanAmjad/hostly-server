const _ = require("lodash");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const express = require("express");
const router = express.Router();
const { User } = require("../models/users");

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
  if (!user) return res.status(400).send("Invalid Email or password.");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid Email or password.");

  // if we reach upto this point this means that user is valid
  const token = user.generateAuthToken();
  res.send(token);
});

function validate(user) {
  const schema = Joi.object({
    email: Joi.string().required().min(5).max(255).email(),
    password: Joi.string().required().min(8).max(255),
  });

  return schema.validate(user);
}

module.exports = router;
