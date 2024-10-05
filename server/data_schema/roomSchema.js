const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const roomSchema = new Schema({
  RoomID: { type: String, required: true },
  RoomNumber: { type: Number, required: true },
  RoomType: { type: String, required: true },
  Price: { type: Number, required: true },
  Status: { type: String, required: true }
});

const RoomDetail = model("rooms", roomSchema);
module.exports = RoomDetail;