const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");

const AdminSchema = mongoose.Schema({
  name: { type: String, required: true, minlength: 3, maxLength: 255 },
  email: { type: String, required: true, match: /\S+@\S+\.\S+/, unique: true },
  password: { type: String, required: true, minlength: 8, maxLength: 1024 },
  date_created: { type: Date, default: Date.now },
});

AdminSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { _id: this._id, name: this.name, email: this.email, isAdmin: true },
    config.get("jwtPrivateKey")
  );
};

// Joi Validation
function validateAdmin(user) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    email: Joi.string().required().min(5).max(255).email(),
    password: Joi.string().required().min(8).max(255),
  });

  return schema.validate(user);
}
const Admin = mongoose.model("Admin", AdminSchema);

module.exports = { validate: validateAdmin, Admin };
