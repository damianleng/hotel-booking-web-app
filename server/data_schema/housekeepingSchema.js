const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const housekeepingSchema = new Schema({
  TaskID: { type: String, required: true },
  RoomID: { type: String, required: true },
  CleanerID: { type: String, required: true },
  AssignedDate: { type: Date, required: true },
  TaskStatus: { type: String, required: true }
});

const HousekeepingDetail = model("housekeepings", housekeepingSchema);
module.exports = HousekeepingDetail;