const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const housekeepingSchema = new Schema({
  KeyID: { type: String, required: true },
  BookingID: { type: String, required: true },
  RoomID: { type: String, required: true },
  KeyCode: { type: String, required: true },
  ValidityPeriod: { type: String, required: true },
  IsActive: { type: Boolean, required: true }
});

const HousekeepingDetail = model("housekeepings", housekeepingSchema);
module.exports = HousekeepingDetail;