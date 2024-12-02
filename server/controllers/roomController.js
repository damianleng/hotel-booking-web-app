// Initialize the room service
const roomService = require("../fetch_service/roomService");
const RoomDetail = require("../data_schema/roomSchema");
const BookingDetail = require("../data_schema/bookingSchema");
const cron = require("node-cron");
const emailService = require("../fetch_service/notificationService")

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

// Function to get currently available rooms
exports.getCurrentlyAvailableRooms = async (req, res) => {
  try {
    // Get the current date
    const currentDate = new Date();

    // Fetch bookings that overlap with the current date
    const bookedRooms = await BookingDetail.find({
      CheckInDate: { $lte: currentDate },
      CheckOutDate: { $gte: currentDate },
    }).select("RoomID");

    // Extract the RoomIDs of booked rooms
    const bookedRoomIds = bookedRooms.map((booking) => booking.RoomID);

    // Find rooms that are not in the list of booked room IDs and have a status of "Available"
    const availableRooms = await RoomDetail.find({
      _id: { $nin: bookedRoomIds },
      Status: "Available",
    });

    res.status(200).json({
      status: "success",
      total: availableRooms.length,
      data: {
        availableRooms,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

// Function to check the status of all rooms
exports.checkAllRoomsStatus = async (req, res) => {
  try {
    // Fetch all rooms from the RoomDetail schema
    const rooms = await RoomDetail.find();

    // Filter rooms that are either Occupied or in Maintenance
    const cleanRooms = rooms.filter((room) => room.Status === "Cleaning");
    const maintenanceRooms = rooms.filter(
      (room) => room.Status === "Maintenance"
    );

    res.status(200).json({
      status: "success",
      total: cleanRooms.length + maintenanceRooms.length,
      data: {
        cleanRooms,
        maintenanceRooms,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.updateBookingRoomStatus = async () => {
  try {
    // get current time
    const currentTime = new Date();

    console.log("Cron job running at time:", currentTime); // Log the current time to see when the job runs

    // fetch all bookings
    const bookings = await BookingDetail.find({});

    console.log("Number of bookings fetched:", bookings.length); // Log the number of bookings

    // iterate through each booking to check and update room
    for (const booking of bookings) {
      const room = await RoomDetail.findById(booking.RoomID);

      const checkInDate = new Date(booking.CheckInDate);
      const [checkInHour, checkInMinute] =
        booking.CheckInTime.split(":").map(Number);
      checkInDate.setUTCHours(checkInHour, checkInMinute, 0, 0); // Set the hours and minutes

      // Parse CheckOutDate and CheckOutTime
      const checkOutDate = new Date(booking.CheckOutDate);
      const [checkOutHour, checkOutMinute] =
        booking.CheckOutTime.split(":").map(Number);
      checkOutDate.setUTCHours(checkOutHour, checkOutMinute, 0, 0); // Set the hours and minutes

      console.log("Check-In Date: ", checkInDate);

      if (currentTime >= checkInDate && currentTime < checkOutDate) {
        booking.RoomStatus = "Occupied";
      } else if (currentTime >= checkOutDate && !booking.RoomCleaned) {
        booking.RoomStatus = "Cleaning";
        await emailService.sendCleanerNotification(room);
      } else if (currentTime >= checkOutDate && booking.RoomCleaned) {
        booking.RoomStatus = "Cleaned";
      } else {
        booking.RoomStatus = "Reserved";
      }
      await booking.save();
    }
    console.log("Room statuses updated successfully.");
  } catch (error) {
    console.error(error);
  }
};

// Schedule the function to run every hour
cron.schedule("0 * * * *", this.updateBookingRoomStatus); // Runs at the start of every hour
