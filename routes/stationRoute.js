"use strict";
// stationRoute
const express = require("express");
const router = express.Router();
const stationController = require("../controllers/stationController");

router.get("/", stationController.station_list_get);

router.get("/:id", stationController.station_get);

router.post("/", stationController.station_post);

router.patch("/:id", stationController.station_modify);

router.delete("/:id", stationController.station_delete);

module.exports = router;
