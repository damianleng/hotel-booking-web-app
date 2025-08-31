// modules
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");

const roomController = require("./controllers/roomController");

// initialize config.env
dotenv.config({ path: "./config.env" });

// initialize app module
const app = require("./app");

// connect to database using dotenv
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

// connect using mongoose
mongoose
  .connect(DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log("Connected to Hotelkeeping Database");

    roomController.updateBookingRoomStatus();
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

app.use("/api/auth", authRoutes);

// health check
app.get("/health", (_req, res) => res.status(200).send("OK"));

// listen
const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", () => {
  console.log(`App running on port ${port}...`);
});
