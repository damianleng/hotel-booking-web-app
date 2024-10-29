const mongoose = require("mongoose");

const { Schema, model } = mongoose;

// Create the user object model
const userSchema = new Schema({
  Name: { type: String, required: true },
  Email: { type: String, required: true },
  Password: { type: String, required: true },
  PhoneNumber: { type: String, required: true },
  Role: { type: String, required: true },
  LoginAttempt: {type: Number, required: true, default: 0},
  LastLoginAttempt: {type: Date}
});

const UserDetail = model("users", userSchema);
module.exports = UserDetail;