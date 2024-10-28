// server/controllers/authController.js
const UserService = require("../fetch_service/userService");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Fetch user by email
    const user = await UserService.fetchUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.Password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Reset login attempts and set last logged in date
    user.LoginAttempt = 0;
    user.LastLoginAttempt = new Date();

    // Save the updated user information
    await user.save();

    // Generate a token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Respond with token and user details
    res.status(200).json({
      token,
      user: {
        id: user._id,
        email: user.Email,
        name: user.Name,
        phoneNumber: user.PhoneNumber,
        role: user.Role,
        loginAttempts: user.LoginAttempt,
        lastLoggedIn: user.LastLoginAttempt,
      },
    });
  } catch (error) {
    console.error("Error during login:", error); // Log the error details
    res.status(500).json({ message: "Server error" });
  }
};
