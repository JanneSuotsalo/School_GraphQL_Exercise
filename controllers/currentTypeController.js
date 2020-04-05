"use strict";
const currentTypeModel = require("../models/currentType");

const currentType_list_get = async (req, res) => {
  try {
    const currentTypes = await currentTypeModel.find();
    res.json(currentTypes);
  } catch (e) {
    console.error("currentType_list_get", e.message);
    res.status(500).json({ message: e.message });
  }
};

const currentType_get = async (req, res) => {
  try {
    const currentTypes = await currentTypeModel.findById(req.params.id);
    res.json(currentTypes);
  } catch (e) {
    console.error("currentType_list_get_1", e.message);
    res.status(500).json({ message: e.message });
  }
};

const currentType_post = (req, res) => {
  res.send("With this endpoint you can add currentTypes");
};

module.exports = {
  currentType_list_get,
  currentType_get,
  currentType_post,
};
