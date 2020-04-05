"use strict";
const levelModel = require("../models/level");

const level_list_get = async (req, res) => {
  try {
    const levels = await levelModel.find();
    res.json(levels);
  } catch (e) {
    console.error("level_list_get", e.message);
    res.status(500).json({ message: e.message });
  }
};

const level_get = async (req, res) => {
  try {
    const levels = await levelModel.findById(req.params.id);
    res.json(levels);
  } catch (e) {
    console.error("level_list_get_1", e.message);
    res.status(500).json({ message: e.message });
  }
};

const level_post = (req, res) => {
  res.send("With this endpoint you can add levels");
};

module.exports = {
  level_list_get,
  level_get,
  level_post,
};
