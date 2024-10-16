// Modules
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const bookingRoutes = require("./routes/bookingRoutes");
const roomRoutes = require("./routes/roomRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const userRoutes = require("./routes/userRoutes");

// Initialize expressJS and port
const app = express();

// middleware for body parser as json format
app.use(bodyParser.json());
app.use(cors());

app.use(express.json());
app.use(bodyParser.json());

// Routes
app.use("/api/bookings", bookingRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/users", userRoutes);

module.exports = app;
