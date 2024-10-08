const mongoose = require("mongoose");
const dotenv = require("dotenv");

const { fetchRooms } = require("./fetch_service/roomService");
const { fetchUsers } = require("./fetch_service/userService");
const { fetchBooking } = require("./fetch_service/bookingService");
const { fetchDigitalkey } = require("./fetch_service/digitalkeyService");
const { fetchHousekeeping } = require("./fetch_service/housekeepingService");
const { fetchPayment } = require("./fetch_service/paymentService");

dotenv.config({ path: "./config.env" });

// connect to database using dotenv
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log("Connected to Hotelkeeping Database");
    // Fetch data
    await fetchRooms();
    await fetchUsers();
    await fetchBooking();
    await fetchDigitalkey();
    await fetchHousekeeping();
    await fetchPayment();
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });