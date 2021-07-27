const Joi = require("joi");
const mongoose = require("mongoose");

const CitySchema = mongoose.Schema({
  city_name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
});

const City = mongoose.model("City", CitySchema);

// Joi Validation
function validateCity(city) {
  const schema = Joi.object({
    city_name: Joi.string().required(),
    description: Joi.string().required(),
  });

  return schema.validate(city);
}

module.exports = { validateCity, City };
