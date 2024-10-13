const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    RoomNumber: { type: Number, required: true },
    RoomType: {
      type: String,
      enum: ["Deluxe", "Single", "Double", "Suite", "Studio"],
      required: true,
    },
    Price: { type: Number, required: true },
    Status: {
      type: String,
      enum: ["Available", "Reserved", "Occupied", "Cleaning"],
      default: "Available",
      required: true,
    },
    Description: { type: String },
    Amenities: { type: [String] },
    MaxPeople: {
      type: Number,
      required: true, 
    },
    Image: {
      type: String,
    }
  },
  {
    versionKey: false, // disable the v_field
  }
);

const RoomDetail = mongoose.model("rooms", roomSchema);
module.exports = RoomDetail;
