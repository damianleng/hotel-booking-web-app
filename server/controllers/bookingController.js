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
      UserID: req.userId
    }
    
    if (!bookingData.Email) {
      return res.status(400).json({ status: "fail", message: "No recipient email provided in booking data" });
    }

    const booking = await bookingService.createBooking(bookingData);
    const room = await RoomDetail.findById(bookingData.RoomID);

    // Update the room status to the database
    room.Status = "Reserved";
    await room.save();

    // Log the email to ensure it's not undefined
    console.log("Sending email to:", bookingData.Email);

    // Send a confirmation email after booking is successfully created
    await emailService.sendEmailNotification(
      bookingData.Email, // Recipient's email
      `Booking Success! Confirmation Booking: ${booking._id}`, // Subject
      `<!DOCTYPE html>
        <html>
          <body style="font-family: Arial, sans-serif; color: #333; background-color: #f9f9f9; padding: 20px;">
            <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
              <h2 style="color: #4CAF50; text-align: center;">Booking Confirmation</h2>
              <p>Here are your stay details for Aurora:</p>
              
              <div style="text-align: center; margin: 20px 0;">
                <img src="${room.Image}" alt="Room Image" style="max-width: 100%; border-radius: 8px;">
              </div>
              
              <table style="width: 100%; font-size: 16px; line-height: 1.6;">
                <tr>
                  <td><strong>Confirmation Code:</strong></td>
                  <td>${booking._id}</td>
                </tr>
                <tr>
                  <td><strong>Check-in:</strong></td>
                  <td>${new Date(booking.CheckInDate).toDateString()}</td>
                </tr>
                <tr>
                  <td><strong>Check-out:</strong></td>
                  <td>${new Date(booking.CheckOutDate).toDateString()}</td>
                </tr>
                <tr>
                  <td><strong>Room Type:</strong></td>
                  <td>${booking.RoomType}</td>
                </tr>
                <tr>
                  <td><strong>Guests:</strong></td>
                  <td>${booking.Guests}</td>
                </tr>
              </table>
              
              <div style="margin-top: 20px; padding: 10px; background-color: #e0f7fa; border-left: 4px solid #00796b;">
                <p style="margin: 0;">We will send you an email with building and unit access instructions three days before your arrival.</p>
              </div>
              
              <p style="margin-top: 20px;">Thank you for booking with us! We look forward to your stay.</p>
              <p style="margin-top: 20px;">This is automation email, please don't reply to this email.</p>
            </div>
          </body>
        </html>`
    );
    
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
