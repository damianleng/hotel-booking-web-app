// modules
const dotenv = require("dotenv");
const mongoose = require("mongoose");

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
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
