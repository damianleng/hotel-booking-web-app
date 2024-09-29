const mongoose = require("mongoose");
const { fetchRooms } = require("./fetch_service/roomService");
const { fetchUsers } = require("./fetch_service/userService");
const { fetchBooking } = require("./fetch_service/bookingService");
const { fetchDigitalkey } = require("./fetch_service/digitalkeyService");
const { fetchHousekeeping } = require("./fetch_service/housekeepingService");

// Use .env file to store sensitive data
const mongoUri = `mongodb+srv://admin:mIgakKO2YvR7AiOc@hotelkeeping.9aykv.mongodb.net/hotelkeeping?retryWrites=true&w=majority&appName=hotelkeeping`; // Single database for all collections

mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log("Connected to Hotelkeeping Database");

    // Fetch data
    await fetchRooms();
    await fetchUsers();
    await fetchBooking();
    await fetchDigitalkey();
    await fetchHousekeeping();
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });