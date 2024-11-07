// Initialize expressJS
const express = require("express");

// Initialize router object
const router = express.Router();

// Initialize booking controller
const bookingController = require("../controllers/bookingController");

// Initialize the middleware
const authenticateUser = require("../middleware/authMiddleware");

// Define availability route first
router.get("/availability", bookingController.getAvailableRooms);

// Define route to get bookings by UserID
router.get("/user-bookings", authenticateUser, bookingController.getBookingsByUserID);

// Booking Routes
router
  .route("/")
  .get(bookingController.getAllBookings)
  .post(authenticateUser, bookingController.createBooking);

router
  .route("/:id")
  .get(bookingController.getBooking)
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking);

module.exports = router;
