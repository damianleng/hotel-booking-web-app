// use nodemailer
const nodemailer = require("nodemailer");

// set up the transporter with email provider SMTP settings
const transporter = nodemailer.createTransport({
  service: "Gmail", // use Gmail as the mail service
  auth: {
    user: "aurorahotelinfo@gmail.com", // Gmail address
    pass: "tvxz jaif morz lhir", // APP PASSWORD
  },
});

// Function to send an email notification
exports.sendEmailNotification = async (to, subject, message) => {
  try {
    // prepare to send message
    const mailOptions = {
      from: "aurorahotelinfo@gmail.com",
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