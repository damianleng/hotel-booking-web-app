const RoomDetail = require("../data_schema/roomSchema");

// Fetch room by Id
exports.fetchRoomById = async (roomId) => {
  return await RoomDetail.findOne({ _id: roomId }); // find by id
};

// Fetch all rooms from database
exports.fetchRooms = async () => {
  try {
    const rooms = await RoomDetail.find({});
    if (rooms.length === 0) {
      return { message: "No rooms found in the collection.", data: [] };
    } else {
      return {
        message: "Rooms retrieved successfully.",
        data: rooms,
      };
    }
  } catch (error) {
    console.error("Error retrieving room details:", error);
  }
};

// create room and save to database
exports.createRoom = async (roomData) => {
  const newRoom = new RoomDetail(roomData);
  return await newRoom.save();
};

// function to update room in database
exports.updateRoomById = async (roomId, updatedData) => {
  return await RoomDetail.findOneAndUpdate({ _id: roomId }, updatedData, {
    new: true,
    runValidators: true,
  });
};

// function to delete room by id in database
exports.deleteRoomById = async (roomId) => {
  return await RoomDetail.findOneAndDelete({ _id: roomId });
};
