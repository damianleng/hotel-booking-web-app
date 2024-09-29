const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const bookingSchema = new Schema({
  BookingID: { type: String, required: true },
  UserID: { type: String, required: true },
  RoomID: { type: String, required: true },
  CheckInDate: { type: Date, required: true },
  CheckOutDate: { type: Date, required: true },
  BookingStatus: { type: String, required: true }
});

const BookingDetail = model("bookings", bookingSchema);
module.exports = BookingDetail;