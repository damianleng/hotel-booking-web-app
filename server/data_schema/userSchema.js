const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const userSchema = new Schema({
  UserID: { type: String, required: true },
  Name: { type: String, required: true },
  Email: { type: String, required: true },
  Password: { type: String, required: true },
  PhoneNumber: { type: String, required: true },
  Role: { type: String, required: true }
});

const UserDetail = model("users", userSchema);
module.exports = UserDetail;