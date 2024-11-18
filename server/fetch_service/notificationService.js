// use nodemailer
const nodemailer = require("nodemailer");

// set up the transporter with email provider SMTP settings
const transporter = nodemailer.createTransport({
  service: "Gmail", // use Gmail as the mail service
  auth: {
    user: process.env.EMAIL, // Gmail address
    pass: process.env.APP_PASSWORD, // App-specific password
  },
});

// Function to send an email notification with HTML support
exports.sendEmailNotification = async (to, subject, htmlMessage) => {
  try {
    // prepare to send message
    const mailOptions = {
      from: process.env.EMAIL,
      to: to,
      subject: subject,
      html: htmlMessage, // Use 'html' instead of 'text' for HTML content
    };

    // send the message
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

// Function to send an email notification when user successfully booked a room
exports.sendEmailNotificationSuccess = async (booking, room, status) => {
  try {
    await this.sendEmailNotification(
      booking.Email, // Recipient's email
      `${status} ${booking._id}`, // Subject
      `<!DOCTYPE html>
        <html>
          <body style="font-family: Arial, sans-serif; color: #333; background-color: #f9f9f9; padding: 20px;">
            <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
              <h2 style="color: #4CAF50; text-align: center;">Booking Confirmation</h2>
              <p>Here are your stay details for Aurora:</p>
              
              <div style="text-align: center; margin: 20px 0;">
                <img src="${
                  room.Image
                }" alt="Room Image" style="max-width: 100%; border-radius: 8px;">
              </div>
              
              <table style="width: 100%; font-size: 16px; line-height: 1.6;">
                <tr>
                  <td><strong>Confirmation Code:</strong></td>
                  <td>${booking._id}</td>
                </tr>
                <tr>
                  <td><strong>Check-in:</strong></td>
                  <td>${new Date(
                    booking.CheckInDate
                  ).toDateString()} at ${formatTime(booking.CheckInTime)}</td>
                </tr>
                <tr>
                  <td><strong>Check-out:</strong></td>
                  <td>${new Date(
                    booking.CheckOutDate
                  ).toDateString()} at ${formatTime(booking.CheckOutTime)}</td>
                </tr>
                <tr>
                  <td><strong>Room Type:</strong></td>
                  <td>${booking.RoomType}</td>
                </tr>
                <tr>
                  <td><strong>Room Type:</strong></td>
                  <td>${room.RoomNumber}</td>
                </tr>
                <tr>
                  <td><strong>Room Code:</strong></td>
                  <td>${booking.DigitalKey}</td>
                </tr>
                <tr>
                  <td><strong>Guests:</strong></td>
                  <td>${booking.Guests}</td>
                </tr>
              </table>
              
              <div style="margin-top: 20px; padding: 10px; background-color: #e0f7fa; border-left: 4px solid #00796b;">
                <p style="margin: 0;">We will send you an email with building and unit access instructions three days before your arrival.</p>
              </div>
              
              <p style="margin-top: 20px;">Thank you for booking with us! We look forward to your stay.</p>
              <p style="margin-top: 20px;">This is automation email, please don't reply to this email.</p>
            </div>
          </body>
        </html>`
    );
  } catch (error) {
    console.error("Error sending email for confirmation booking!", error);
  }
};

function formatTime(time) {
  const [hours, minutes] = time.split(":").map(Number);
  const amPm = hours >= 12 ? "PM" : "AM";
  const convertedHours = hours % 12 || 12;
  return `${convertedHours}:${minutes.toString().padStart(2, "0")} ${amPm}`;
}