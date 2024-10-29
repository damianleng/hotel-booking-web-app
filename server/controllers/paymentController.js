const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); // initialize test secret key
const PaymentDetail = require("../data_schema/paymentSchema");

// method to create a payment intent from stripe
exports.createPaymentIntent = async (req, res) => {
  try {
    const { BookingID, Amount, PaymentStatus, PaymentMethod, Currency } = req.body;

        // Ensure Amount is provided and is a number
        if (!Amount || isNaN(Amount)) {
          return res.status(400).json({
            error: 'Invalid amount provided.',
          });
        }
    
    // Create a PaymentIntent in test mode
    const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(Amount * 100),  // Convert to cents
        currency: Currency || "usd",
        payment_method_types: ["card"],  // Only allow card payments
      });

    // Store payment details in the database
    const payment = new PaymentDetail({
        BookingID: BookingID,
        Amount: Amount,
        PaymentStatus: PaymentStatus,  // Payment status can be updated later
        PaymentDate: new Date(),
        PaymentMethod: PaymentMethod,
        StripePaymentID: paymentIntent.id,
        Currency: Currency || 'USD',
      });

    // save to database
    await payment.save();

    // send a response
    res.status(201).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      payment,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};