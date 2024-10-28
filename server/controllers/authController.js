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

    // Check if login attempts are 5 or more
    if (user.LoginAttempt >= 5) {
      const now = new Date();
      const lastAttempt = new Date(user.LastLoginAttempt);
      const timeDiff = (now - lastAttempt) / 1000 / 60; // Time difference in minutes
  
      if (timeDiff < 5) {
        return res.status(403).json({ message: "Account locked. Try again later." });
      } else {
        // Reset login attempts if more than 5 minutes have passed
        user.LoginAttempt = 0;
        user.LastLoginAttempt = null;
        await user.save();
        }
      }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.Password);
    if (!isMatch) {
      if (user.LoginAttempt == 0) {
        user.LastLoginAttempt = new Date();
        await user.save();
      }
      user.LoginAttempt += 1;
      await user.save();
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Reset login attempts and set last logged in date
    user.LoginAttempt = 0;
    user.LastLoginAttempt = null;

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
