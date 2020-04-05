"use strict";
const stationModel = require("../models/station");

// Get limited stations by limit number or all stations defined by polygon
const station_list_get = async (req, res) => {
  try {
    let limit;
    let bottomLeft;
    let topRight;

    if (req.query.limit == undefined) {
      limit = 10;
    } else {
      limit = req.query.limit;
    }

    // If certain geo points aren't specified, returns limited list
    if (req.query.bottomLeft != undefined && req.query.topRight != undefined) {
      bottomLeft = JSON.parse(req.query.bottomLeft);
      topRight = JSON.parse(req.query.topRight);
      getStationsByPolygon(res, bottomLeft, topRight);
    } else {
      getLimitedStations(res, limit, req.query);
    }
  } catch (e) {
    console.error("station_list_get", e.message);
    res.status(500).json({ message: e.message });
  }
};

// Get one station
const station_get = async (req, res) => {
  try {
    const stations = await stationModel
      .findById(req.params.id)
      .populate({
        path: "Connections",
        populate: { path: "ConnectionTypeID" },
      })
      .populate({
        path: "Connections",
        populate: { path: "CurrentTypeID" },
      })
      .populate({
        path: "Connections",
        populate: { path: "LevelID" },
      });
    res.json(stations);
  } catch (e) {
    console.error("station_list_get_1", e.message);
    res.status(500).json({ message: e.message });
  }
};

// Post new station
const station_post = async (req, res) => {
  const station = await stationModel.create({
    Title: "New station2",
    AdressLine1: "New adress2",
    Town: "Vantaa",
    StateOrProvince: "Uusimaa",
    Postcode: "0112",
    Connections: [{ _id: "5e801055e946a010940921ab", Quantity: 1 }],
    Location: {
      type: "Point",
      coordinates: [25.054394209001, 60.2309710515013],
    },
  });
  res.send("New station added with id: " + station._id);
};

// Modify station
const station_modify = async (req, res) => {
  try {
    const station = await stationModel.findByIdAndUpdate(
      req.params.id,
      req.query
    );
    res.send(`modified station ${station.Title} with id ${station._id}`);
  } catch (e) {
    res.status(500).json({ message: e.message });
    console.error("station_modify", e.message);
  }
};

// Delete station
const station_delete = async (req, res) => {
  try {
    const station = await stationModel.findById(req.params.id);
    res.send(`deleted station ${station.Title} with id ${station._id}`);
    await stationModel.findByIdAndDelete(req.params.id);
  } catch (e) {
    res.status(500).json({ message: e.message });
    console.error("station_modify", e.message);
  }
};

//Helping functions

const getLimitedStations = async (res, limit, query) => {
  res.json(
    await stationModel
      .find()
      .populate({
        path: "Connections",
        populate: { path: "ConnectionTypeID" },
      })
      .populate({
        path: "Connections",
        populate: { path: "CurrentTypeID" },
      })
      .populate({
        path: "Connections",
        populate: { path: "LevelID" },
      })
      .skip(Number.parseInt(query.start))
      .limit(Number.parseInt(limit))
  );
};

const getStationsByPolygon = async (res, bottomLeft, topRight) => {
  res.json(
    await stationModel
      .find()
      .populate({
        path: "Connections",
        populate: { path: "ConnectionTypeID" },
      })
      .populate({
        path: "Connections",
        populate: { path: "CurrentTypeID" },
      })
      .populate({
        path: "Connections",
        populate: { path: "LevelID" },
      })
      .where("Location")
      .within({
        box: [
          [bottomLeft.lng, bottomLeft.lat],
          [topRight.lng, topRight.lat],
        ],
      })
  );
};

module.exports = {
  station_list_get,
  station_get,
  station_post,
  station_modify,
  station_delete,
};
