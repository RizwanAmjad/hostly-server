const { string } = require("joi");
const Joi = require("joi");
const mongoose = require("mongoose");

const HostelSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  address: { type: String, required: true },
  room_price: { type: Number, required: true },
  available_rooms: { type: Number, required: true },

  images: { type: Array },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  city: { type: mongoose.Schema.Types.ObjectId, ref: "City" },
});

const Hostel = mongoose.model("Hostel", HostelSchema);

// Joi Validation
function validateHostel(hostel) {
  const schema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    address: Joi.string().required(),
    room_price: Joi.number().required(),
    images: Joi.array().items(Joi.string()),
    available_rooms: Joi.number().required(),
    user: Joi.string().required(),
    city: Joi.string().required(),
  });

  return schema.validate(hostel);
}

module.exports = { validateHostel, Hostel };
