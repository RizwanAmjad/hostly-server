const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const { validateMessage, Message } = require("../models/messages");

router.post("/", auth, async (req, res) => {
  req.body.sender_user = req.user._id;
  const io = global.io;

  const { error } = validateMessage(req.body);
  if (error) return res.status(400).send("Validation error occured..");
  const message = new Message(req.body);
  await message.save();

  io.emit(req.body.reciever_user, message);

  res.send(message);
});

router.get("/", auth, async (req, res) => {
  const id = req.user._id;
  const chats = await Message.find({
    $or: [
      {
        sender_user: id,
      },
      {
        reciever_user: id,
      },
    ],
  });
  res.send(chats);
});

router.get("/chats", auth, async (req, res) => {
  const id = req.user._id;

  // let chats = await Message.aggregate([
  //   {
  //     $project: { sender_user: "$sender_user", message_body: "$message_body" },
  //   },
  //   { $sort: { _id: -1 } },
  //   {
  //     $group: {
  //       _id: { sender_user: "$sender_user" },
  //       sender_user: { $first: "$sender_user" },
  //       message_body: { $first: "$message_body" },
  //     },
  //   },
  // ]);
  // await (
  //   await Message.populate(chats, { path: "sender_user" })
  // ).filter((message) => {
  //   message.sender_user != id;
  // });

  let chats = await Message.find({
    $or: [
      {
        sender_user: id,
      },
      {
        reciever_user: id,
      },
    ],
  }).populate(["sender_user"]);

  chats = chats.filter((chat) => chat.reciever_user == id);

  // chats = _.sortedUniqBy({ chats }, function (e) {
  //   e.sender_user._id;
  // });

  res.send(chats);
});

module.exports = router;
