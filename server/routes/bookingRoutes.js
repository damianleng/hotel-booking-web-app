// Initialize expressJS
const express = require("express");

// Initialize router object
const router = express.Router();

// Initialize booking controller
const bookingController = require("../controllers/bookingController");

// Initialize the middleware
const authenticateUser = require("../middleware/authMiddleware");

// Initialize the role middleware
const authorizeRoles = require("../middleware/roleMiddleware");

// Define availability route first
router.get("/availability", bookingController.getAvailableRooms);

// Define route to get bookings by UserID
router.get("/user-bookings", authenticateUser, bookingController.getBookingsByUserID);

// Booking Routes
router
  .route("/")
  .get(authenticateUser, authorizeRoles("admin"), bookingController.getAllBookings)
  .post(authenticateUser, bookingController.createBooking);

router
  .route("/:id")
  .get(authenticateUser, bookingController.getBooking)
  .patch(authenticateUser, authorizeRoles("admin"), bookingController.updateBooking)
  .delete(authenticateUser, authorizeRoles("admin"), bookingController.deleteBooking);

module.exports = router;
