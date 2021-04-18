const Joi = require("joi");

const mongoose = require("mongoose");

const FollowerSchema = mongoose.Schema({
  follower_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  following_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Followers = mongoose.model("Follower", FollowerSchema);

// Joi Validation
function validateFollower(follower) {
  const schema = Joi.object({
    follower_id: Joi.string().required(),
    following_id: Joi.string().required(),
  });

  return schema.validate(follower);
}

module.exports = { validateFollower, Followers };
