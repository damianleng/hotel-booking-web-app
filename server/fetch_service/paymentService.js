const PaymentDetail = require("../data_schema/paymentSchema");

const fetchPayment = async () => {
  try {
    const payments = await PaymentDetail.find({});
    if (payments.length === 0) {
      console.log("No payments found in the collection.");
    } else {
      console.log("Payment Details:", payments);
    }
  } catch (error) {
    console.error("Error retrieving payment details:", error);
  }
};

module.exports = { fetchPayment };