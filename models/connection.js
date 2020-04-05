const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const connectionSchema = new Schema({
  Quantity: Number,
  ConnectionTypeID: [{ type: Schema.Types.ObjectId, ref: "connectionType" }],
  LevelID: [{ type: Schema.Types.ObjectId, ref: "level" }],
  CurrentTypeID: [{ type: Schema.Types.ObjectId, ref: "currentType" }],
});

module.exports = mongoose.model("Connection", connectionSchema);
