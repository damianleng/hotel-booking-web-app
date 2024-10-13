const express = require('express');
const paymentController = require('../controllers/paymentController'); // Adjust the path based on your folder structure

const router = express.Router();

// POST route for creating a PaymentIntent
router.post('/create-payment-intent', paymentController.createPaymentIntent);

module.exports = router;