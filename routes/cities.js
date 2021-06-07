const express = require("express");

const { validateCity, City } = require("../models/cities");

const adminAuth = require("../middleware/adminAuth");
const router = express.Router();

router.post("/", adminAuth, async (req, res) => {
  const result = validateCity(req.body);

  if (result.error) {
    return res.status(400).send(result.error);
  }

  // find city
  const city = await City.findOne({ city_name: req.body.city_name });
  if (city) return res.status(400).send("City already exists...");

  try {
    let city = new City(req.body);
    city = await city.save();
    res.send(city);
  } catch (ex) {
    return res.status(500).send("Internal Server error");
  }
});

router.get("/", async (req, res) => {
  const cities = await City.find();
  res.send(cities);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const city = await City.findById(id);
    res.send(city);
  } catch (ex) {
    return res.status(404).send("City not Found...");
  }
});

router.put("/:id", adminAuth, async (req, res) => {
  const id = req.params.id;

  const result = validateCity(req.body);

  if (result.error) {
    return res.status(400).send(result.error);
  }

  try {
    const city = await City.findByIdAndUpdate(id, req.body, {
      useFindAndModify: true,
    });
    res.send(city);
  } catch (e) {
    return res.status(400).send("City not Found...");
  }
});

router.delete("/:id", adminAuth, async (req, res) => {
  const id = req.params.id;

  try {
    const city = await City.findByIdAndDelete(id, req.body);
    res.send(city);
  } catch (e) {
    return res.status(400).send("City not Found...");
  }
});

module.exports = router;
