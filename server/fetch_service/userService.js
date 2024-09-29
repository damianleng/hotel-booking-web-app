const UserDetail = require("../data_schema/userSchema");

const fetchUsers = async () => {
  try {
    const users = await UserDetail.find({});
    if (users.length === 0) {
      console.log("No users found in the collection.");
    } else {
      console.log("User Details:", users);
    }
  } catch (error) {
    console.error("Error retrieving user details:", error);
  }
};

module.exports = { fetchUsers };