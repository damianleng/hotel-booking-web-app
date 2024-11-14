// Initialize mongoose model
const mongoose = require("mongoose");

// Create a booking Schema
const bookingSchema = new mongoose.Schema({
  UserID: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "users",
    required: true,
   },
  RoomID: {
    type: mongoose.Schema.Types.ObjectId, // Reference to Room _id
    ref: "rooms", // Reference the 'rooms' collection
    required: true,
  },
  CheckInDate: { type: Date, required: true },
  CheckOutDate: { type: Date, required: true },
  CheckInTime: {type: String, required: true, default: "16:00"},
  CheckOutTime: {type: String, required: true, default: "12:00"},
  RoomType: { type: String, required: true },
  BookingStatus: { type: String, required: true, default: "Pending" },
  Guests: { type: Number, required: true },
  FirstName: { type: String, required: true },
  LastName: { type: String, required: true },
  Email: { type: String, required: true },
  Phone: { type: String, required: true },
  Address: { type: String, required: true },
  Image: {type: String},
  DigitalKey: {type: Number, required: true}
});

// Build the model and export
const BookingDetail = mongoose.model("bookings", bookingSchema);
module.exports = BookingDetail;
