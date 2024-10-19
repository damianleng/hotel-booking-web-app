// server/controllers/authController.js
const UserService = require('../fetch_service/userService');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserService.fetchUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.Password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({ 
      token, 
      user: { 
        id: user._id, 
        email: user.Email, 
        name: user.Name, 
        phoneNumber: user.PhoneNumber, 
        role: user.Role 
      } 
    });
  } catch (error) {
    console.error('Error during login:', error); // Log the error details
    res.status(500).json({ message: 'Server error' });
  }
};