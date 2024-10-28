const userService = require("../fetch_service/userService");
const bcrypt = require("bcryptjs");

exports.getAllUsers = async (req, res) => {
  try {
    const result = await userService.fetchUsers();
    res.status(200).json({
      status: "success",
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.getUser = async (req, res) => {
  try {
    const result = await userService.fetchUserById(req.params.id);
    if (!result.data) {
      return res.status(404).json({
        status: "fail",
        message: result.message,
      });
    }
    res.status(200).json({
      status: "success",
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.registerUser = async (req, res) => {
  try {
    const { email, password, name, phoneNumber, role } = req.body;

    // Check if the user already exists
    const existingUser = await userService.fetchUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        status: "fail",
        message: "Email already in use",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create a new user
    const newUser = {
      Email: email,
      Password: hashedPassword,
      Name: name,
      PhoneNumber: phoneNumber,
      Role: role,
      LastLoginAttempt: new Date(),
    };

    const result = await userService.registerUser(newUser);

    res.status(201).json({
      status: "success",
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    console.error("Error during registration:", error); // Log the error details
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const result = await userService.updateUserById(req.params.id, req.body);
    if (!result.data) {
      return res.status(404).json({
        status: "fail",
        message: result.message,
      });
    }
    res.status(200).json({
      status: "success",
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const result = await userService.deleteUserById(req.params.id);
    if (!result.data) {
      return res.status(404).json({
        status: "fail",
        message: result.message,
      });
    }
    res.status(204).json({
      status: "success",
      message: result.message,
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};
