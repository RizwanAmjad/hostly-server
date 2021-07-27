const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");

const UserSchema = mongoose.Schema({
  name: { type: String, required: true, minlength: 3, maxLength: 255 },
  email: { type: String, required: true, match: /\S+@\S+\.\S+/, unique: true },
  password: { type: String, required: true, minlength: 8, maxLength: 1024 },
  phone_number: { type: Number, required: true },
  date_created: { type: Date, default: Date.now },
});

UserSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { _id: this._id, name: this.name, email: this.email },
    config.get("jwtPrivateKey")
  );
};

// Joi Validation
function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    email: Joi.string().required().min(5).max(255).email(),
    password: Joi.string().required().min(8).max(255),
    phone_number: Joi.number().required(),
  });

  return schema.validate(user);
}
const User = mongoose.model("User", UserSchema);

module.exports = { validate: validateUser, User };
