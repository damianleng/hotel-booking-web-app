const UserDetail = require("../data_schema/userSchema");

// Fetch all users from the database
const fetchUsers = async () => {
  try {
    const users = await UserDetail.find({});
    if (users.length === 0) {
      return { message: "No users found in the collection.", data: [] };
    } else {
      return {
        message: "Users retrieved successfully.",
        data: users,
      };
    }
  } catch (error) {
    console.error("Error retrieving user details:", error);
    throw error;
  }
};

// Fetch user by ID
const fetchUserById = async (userId) => {
  try {
    const user = await UserDetail.findOne({ _id: userId });
    if (!user) {
      return { message: "User not found", data: null };
    }
    return {
      message: "User retrieved successfully.",
      data: user,
    };
  } catch (error) {
    console.error("Error retrieving user details:", error);
    throw error;
  }
};

// Fetch user by email
const fetchUserByEmail = async (email) => {
  try {
    const user = await UserDetail.findOne({ Email: email });
    return user;
  } catch (error) {
    console.error("Error retrieving user details:", error);
    throw error;
  }
};

// Create a new user
const registerUser = async (userData) => {
  try {
    const newUser = new UserDetail(userData);
    await newUser.save();
    return {
      message: "User created successfully.",
      data: newUser,
    };
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

// Update user by ID
const updateUserById = async (userId, updatedData) => {
  try {
    const updatedUser = await UserDetail.findOneAndUpdate(
      { _id: userId },
      updatedData,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedUser) {
      return { message: "User not found", data: null };
    }
    return {
      message: "User updated successfully.",
      data: updatedUser,
    };
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

// Delete user by ID
const deleteUserById = async (userId) => {
  try {
    const deletedUser = await UserDetail.findOneAndDelete({ _id: userId });
    if (!deletedUser) {
      return { message: "User not found", data: null };
    }
    return {
      message: "User deleted successfully.",
      data: deletedUser,
    };
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

module.exports = {
  fetchUsers,
  fetchUserById,
  fetchUserByEmail,
  registerUser,
  updateUserById,
  deleteUserById,
};