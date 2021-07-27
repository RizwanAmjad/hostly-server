const _ = require("lodash");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const express = require("express");
const router = express.Router();
const { Admin, validate: validateNew } = require("../models/admin");

router.post("/", async (req, res) => {
  // validate the request body
  const result = validate(req.body);
  if (result.error) {
    return res.status(400).send(result.error);
  }

  // make sure user is not already registered
  let admin = await Admin.findOne({
    email: req.body.email,
  });
  if (!admin) return res.status(400).send("Invalid Email or password.");

  const validPassword = await bcrypt.compare(req.body.password, admin.password);
  if (!validPassword) return res.status(400).send("Invalid Email or password.");

  // if we reach upto this point this means that user is valid
  const token = admin.generateAuthToken();
  res.status(200).send(token);
});

router.post("/new", async (req, res) => {
  // validate the request body
  const result = validateNew(req.body);
  if (result.error) {
    return res.status(400).send(result.error);
  }

  // make sure user is not already registered
  let admin = await Admin.findOne({
    email: req.body.email,
  });
  if (admin) return res.status(400).send("Admin already exists...");

  // process the request and save to database
  admin = new Admin(_.pick(req.body, ["name", "email", "password"]));

  const salt = await bcrypt.genSalt(10);
  admin.password = await bcrypt.hash(admin.password, salt);
  await admin.save();
  admin = _.pick(admin, ["_id", "name", "email"]);
  res.send(admin);
});

function validate(admin) {
  const schema = Joi.object({
    email: Joi.string().required().min(5).max(255).email(),
    password: Joi.string().required().min(8).max(255),
  });

  return schema.validate(admin);
}

module.exports = router;
