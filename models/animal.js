const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const animalSchema = new Schema({
  animalName: String,
  species: { type: mongoose.Types.ObjectId, ref: "Species" }
});

module.exports = mongoose.model("Animal", animalSchema);
