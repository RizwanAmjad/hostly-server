const Joi = require("joi");

const mongoose = require("mongoose");

const ImageSchema = mongoose.Schema({
  image_name: { type: String, required: true },
  path: { type: String, required: true },
  hostel_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Image = mongoose.model("Follower", ImageSchema);

// Joi Validation
function validateImage(image) {
  const schema = Joi.object({
    image_name: Joi.string().required(),
    path: Joi.string().required(),
    hostel_id: Joi.string().required(),
  });

  return schema.validate(image);
}

module.exports = { validateImage, Image };
