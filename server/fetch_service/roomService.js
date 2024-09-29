const RoomDetail = require("../data_schema/roomSchema");

const fetchRooms = async () => {
  try {
    const rooms = await RoomDetail.find({});
    if (rooms.length === 0) {
      console.log("No rooms found in the collection.");
    } else {
      console.log("Room Details:", rooms);
    }
  } catch (error) {
    console.error("Error retrieving room details:", error);
  }
};

module.exports = { fetchRooms };