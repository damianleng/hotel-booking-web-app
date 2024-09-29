const BookingDetail = require("../data_schema/bookingSchema");

const fetchBooking = async () => {
  try {
    const books = await BookingDetail.find({});
    if (books.length === 0) {
      console.log("No booking found in the collection.");
    } else {
      console.log("Booking Details:", books);
    }
  } catch (error) {
    console.error("Error retrieving booking details:", error);
  }
};

module.exports = { fetchBooking };