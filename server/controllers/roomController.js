// Initialize the room service
const roomService = require("../fetch_service/roomService");

// Get method to get a room by ID
exports.getRoom = async (req, res) => {
  try {
    const roomID = req.params.id; // Get bookingID from the URL params
    const room = await roomService.fetchRoomById(roomID);

    if (!room) {
      return res.status(404).json({
        status: "fail",
        message: "No room found with that ID",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        room,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

// Get method to get all rooms
exports.getAllRooms = async (req, res) => {
  try {
    const result = await roomService.fetchRooms();
    res.status(200).json(result);
  } catch (error) {
    res.status(505).json({ message: error.message });
  }
};

// Post method to create a room
exports.createRoom = async (req, res) => {
  try {
    const roomData = req.body;
    const room = await roomService.createRoom(roomData);

    res.status(201).json({
      status: "success",
      data: {
        room,
      },
    });
  } catch (error) {
    res.status(505).json({
      status: "fail",
      message: error.message,
    });
  }
};

// Patch method to update a room
exports.updateRoom = async (req, res) => {
  try {
    const roomID = req.params.id; // Get bookingID from the URL params
    const updatedData = req.body; // Updated booking data

    const updateRoom = await roomService.updateRoomById(roomID, updatedData);

    if (!updateRoom) {
      return res.status(404).json({
        status: "fail",
        message: "No room found with that ID",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        booking: updateRoom,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

// Delete method to delete a room
exports.deleteRoom = async (req, res) => {
  try {
    const roomID = req.params.id;
    const deleteRoom = await roomService.deleteRoomById(roomID);

    if (!deleteRoom) {
      return res.status(404).json({
        status: "fail",
        message: "No room found with that ID",
      });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};
