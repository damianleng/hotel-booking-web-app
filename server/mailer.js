// use nodemailer
const nodemailer = require("nodemailer");

// Ensure environment variables are loaded
require("dotenv").config({path: "config.env"});

const transporter = nodemailer.createTransport({
  service: "Gmail", // use Gmail as the mail service
  auth: {
    user: process.env.EMAIL, // Gmail address
    pass: process.env.APP_PASSWORD, // App-specific password
  },
});

// Verify the transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("Nodemailer transport verification failed: ", error);
  } else {
    console.log("Nodemailer is ready to send emails: ", success);
  }
});

module.exports = transporter;