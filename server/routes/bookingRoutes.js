// Initialize expressJS
const express = require("express");

// Initialize router object
const router = express.Router();



// Initialize booking controller
const bookingController = require("../controllers/bookingController");

// Define availability route first
router.get('/availability', bookingController.getAvailableRooms);

// Booking Routes
router
  .route("/")
  .get(bookingController.getAllBookings)
  .post(bookingController.createBooking);

router
  .route("/:id")
  .get(bookingController.getBooking)
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking);


module.exports = router;
