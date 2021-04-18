const mongoose = require("mongoose");

const Joi = require("joi");

const MessageSchema = mongoose.Schema({
  message_body: { type: String, required: true },
  sent_time: { type: Date, default: Date.now() },
  sender_user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  reciever_user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Message = mongoose.model("Message", MessageSchema);

// Joi Validation
function validateMessage(message) {
  const schema = Joi.object({
    follower_id: Joi.string().required(),
    following_id: Joi.string().required(),
  });

  return schema.validate(message);
}

module.exports = { validateMessage, Message };
