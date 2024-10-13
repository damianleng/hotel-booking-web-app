const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const paymentSchema = new Schema({
  BookingID: { type: String },
  Amount: { type: Number, required: true },
  PaymentStatus: { type: String },
  PaymentDate: { type: Date },
  PaymentMethod: { type: String },
  Currency: {type: String, required: true, default: 'USD'},
  StripePaymentID: {type: String},
  ReceiptURL: {type: String},
  CustomerID: {type: String}
});

const PaymentDetail = model("payments", paymentSchema);
module.exports = PaymentDetail;