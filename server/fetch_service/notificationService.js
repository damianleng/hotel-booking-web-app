// use nodemailer
const nodemailer = require("nodemailer");

// set up the transporter with email provider SMTP settings
const transporter = nodemailer.createTransport({
  service: "Gmail", // use Gmail as the mail service
  auth: {
    user: process.env.EMAIL, // Gmail address
    pass: process.env.APP_PASSWORD, // APP PASSWORD
  },
});

// Function to send an email notification
exports.sendEmailNotification = async (to, subject, message) => {
  try {
    // prepare to send message
    const mailOptions = {
      from: process.env.EMAIL,
      to: to,
      subject: subject,
      text: message,
    };

    // send the message
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email: ", error);
  }
};