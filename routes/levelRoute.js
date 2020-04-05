"use strict";
// levelRoute
const express = require("express");
const router = express.Router();
const levelController = require("../controllers/levelController");

router.get("/", levelController.level_list_get);

router.get("/:id", levelController.level_get);

router.post("/", levelController.level_post);

module.exports = router;
