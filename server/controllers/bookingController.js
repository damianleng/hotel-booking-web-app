// Initialize the models
const RoomDetail = require("../data_schema/roomSchema");
const BookingDetail = require("../data_schema/bookingSchema");

// Initialize the services
const bookingService = require("../fetch_service/bookingService");
const emailService = require("../fetch_service/notificationService");

// Get method to get a booking by ID
exports.getBooking = async (req, res) => {
  try {
    const bookingID = req.params.id; // Get bookingID from the URL params
    const booking = await bookingService.fetchBookingById(bookingID);

    if (!booking) {
      return res.status(404).json({
        status: "fail",
        message: "No booking found with that ID",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        booking,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

// Get method to get all bookings
exports.getAllBookings = async (req, res) => {
  try {
    const result = await bookingService.fetchBookings();
    res.status(200).json(result);
  } catch (error) {
    res.status(505).json({ message: error.message });
  }
};

// Post method to create a booking
exports.createBooking = async (req, res) => {
  try {
    // const bookingData = req.body;
    const bookingData = {
      ...req.body,
      UserID: req.userId,
    };

    if (!bookingData.Email) {
      return res.status(400).json({
        status: "fail",
        message: "No recipient email provided in booking data",
      });
    }

    const booking = await bookingService.createBooking(bookingData);
    const room = await RoomDetail.findById(bookingData.RoomID);
    const status = "Booking Success! Confirmation Booking:";

    // Log the email to ensure it's not undefined
    console.log("Sending email to:", bookingData.Email);

    // Send a confirmation email after booking is successfully created
    await emailService.sendEmailNotificationSuccess(booking, room, status);

    res.status(201).json({
      status: "success",
      data: {
        booking,
      },
    });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

// Patch method to update a booking
exports.updateBooking = async (req, res) => {
  try {
    const bookingID = req.params.id; // Get bookingID from the URL params
    const updatedData = req.body; // Updated booking data

    const updateBooking = await bookingService.updateBookingById(
      bookingID,
      updatedData
    );

    if (!updateBooking) {
      return res.status(404).json({
        status: "fail",
        message: "No booking found with that ID",
      });
    }

    // get the latest bookings and room
    const booking = await BookingDetail.findById(bookingID);
    const room = await RoomDetail.findById(booking.RoomID);
    const status = "Booking Update! Updated Confirmation Booking:";

    // Send a confirmation email after booking is successfully updated
    await emailService.sendEmailNotificationSuccess(booking, room, status);

    res.status(200).json({
      status: "success",
      data: {
        booking: updateBooking,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

// Delete method to delete a booking
exports.deleteBooking = async (req, res) => {
  try {
    const bookingID = req.params.id;
    const deleteBooking = await bookingService.deleteBookingById(bookingID);

    if (!deleteBooking) {
      return res.status(404).json({
        status: "fail",
        message: "No booking found with that ID",
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

// this function will also check if a room status is reserved or occupied
exports.getAvailableRooms = async (req, res) => {
  try {
    const { checkInDate, checkOutDate, maxPeople } = req.query;

    // validate the maxPeople parameter
    if (!maxPeople || isNaN(maxPeople) || maxPeople <= 0) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide a valid number for maxPeople",
      });
    }

    // fetch all rooms
    const rooms = await RoomDetail.find({
      MaxPeople: { $gte: parseInt(maxPeople) },
    });

    // Fetch bookings that overlap with the given data range
    const bookedRooms = await BookingDetail.find({
      $or: [
        {
          CheckInDate: { $lte: new Date(checkOutDate) },
          CheckOutDate: { $gte: new Date(checkInDate) },
        },
      ],
    });

    // Extract the RoomIDs of booked rooms
    const bookedRoomIds = bookedRooms.map((booking) => booking.RoomID);

    // Filter avaialbe rooms by checking if the RoomID is not in the bookedRoomIds list
    const availableRooms = rooms.filter(
      (room) =>
        !bookedRoomIds.map((id) => id.toString()).includes(room._id.toString())
    ); // Note that we convert the bookedRoomIds to a string so that the filter function and includes function work

    res.status(200).json({
      success: true,
      total: availableRooms.length,
      availableRooms: availableRooms,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// this function will get user bookings by their booking
// Method to get bookings by UserID
exports.getBookingsByUserID = async (req, res) => {
  try {
    const userID = req.userId; // Get UserID from the URL params

    // Query the BookingDetail model to find all bookings for the given UserID
    const bookings = await BookingDetail.find({ UserID: userID }).populate(
      "RoomID"
    );

    if (!bookings || bookings.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "No bookings found for this user",
      });
    }

    res.status(200).json({
      status: "success",
      total: bookings.length,
      data: {
        bookings,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};