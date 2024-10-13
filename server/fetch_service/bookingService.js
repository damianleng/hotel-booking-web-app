// Initialize booking service
const BookingDetail = require("../data_schema/bookingSchema");

// Fetch booking by Id
exports.fetchBookingById = async (bookingId) => {
  return await BookingDetail.findOne({ _id: bookingId }); // find by id
};

// Fetch all bookings
exports.fetchBookings = async () => {
  try {
    const bookings = await BookingDetail.find({});
    if (bookings.length === 0) {
      return { message: "No bookings found in the collection.", data: [] };
    } else {
      // return as json format
      return {
        message: "Booking details retrieved successfully.",
        data: bookings,
      };
    }
    // catch errors
  } catch (error) {
    // throw the error to handle by the controller
    console.error("Error retrieving booking details:", error);
  }
};

// function to create booking and save to model
exports.createBooking = async (bookingData) => {
  const newBooking = new BookingDetail(bookingData);
  return await newBooking.save();
};

// function to update booking to model
exports.updateBookingById = async (bookingId, updatedData) => {
  return await BookingDetail.findOneAndUpdate({ _id: bookingId }, updatedData, {
    new: true,
    runValidators: true,
  });
};

// function to delete booking by Id
exports.deleteBookingById = async (bookingId) => {
  return await BookingDetail.findOneAndDelete({ _id: bookingId });
};