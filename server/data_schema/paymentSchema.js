const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const paymentSchema = new Schema({
  PaymentID: { type: String, required: true },
  BookingID: { type: String, required: true },
  Amount: { type: Number, required: true },
  PaymentStatus: { type: String, required: true },
  PaymentDate: { type: Date, required: true },
  PaymentMethod: { type: String, required: true }
});

const PaymentDetail = model("payments", paymentSchema);
module.exports = PaymentDetail;