const express = require("express");

const { validateHostel, Hostel } = require("../models/hostel");
const auth = require("../middleware/auth");
const router = express.Router();

router.post("/", auth, async (req, res) => {
  // validate the request body
  const result = validateHostel(req.body);
  console.log(result);
  if (result.error) {
    res.status(400).send(result.error);
    return;
  }
  // process the request and save to database
  let hostel = new Hostel(req.body);
  hostel = await hostel.save();
  res.send(hostel);
});

router.get("/", async (req, res) => {
  const hostels = await Hostel.find().populate(["user", "city"]);
  res.send(hostels);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  if (!id) return res.status(400);

  const hostels = await Hostel.findById(id).populate(["user", "city"]);

  if (!hostels) return res.status(404).send("Course not found...");

  res.send(hostels);
});

module.exports = router;
