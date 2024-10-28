const paymentController = require("../controllers/paymentController");
const stripe = require("stripe");
const PaymentDetail = require("../data_schema/paymentSchema");


// Mock stripe
jest.mock("stripe", () => {
  const mockCreate = jest.fn();
  return jest.fn(() => ({
    paymentIntents: {
      create: mockCreate,
    },
  }));
});

// Mock PaymentDetail schema
jest.mock("../data_schema/paymentSchema", () => {
  const saveMock = jest.fn();
  const PaymentDetailMock = jest.fn().mockImplementation(() => {
    return { save: saveMock };
  });
  return PaymentDetailMock;
});


// Unit Test for creating payment intents with Stripe
describe("createPaymentIntent", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        BookingID: "123456",
        Amount: 100,
        PaymentStatus: "pending",
        PaymentMethod: "card",
        Currency: "usd",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks(); // clear all mocks
  });

  it("should successfully create a payment intent and save payment details", async () => {
    // Mock Stripe payment intent creation success
    stripe().paymentIntents.create.mockResolvedValue({
      id: "pi_test_123",
      client_secret: "secret_test_123",
    });

    // Mock save function to resolve successfully
    PaymentDetail().save.mockResolvedValue({
      BookingID: "123456",
      Amount: 100,
      PaymentStatus: "pending",
      PaymentDate: new Date(),
      PaymentMethod: "card",
      StripePaymentID: "pi_test_123",
      Currency: "usd",
    });

    // Call the function
    await paymentController.createPaymentIntent(req, res);

    // Verify Stripe was called with the correct data
    expect(stripe().paymentIntents.create).toHaveBeenCalledWith({
      amount: 10000, // 100 * 100 cents
      currency: "usd",
      payment_method_types: ["card"],
    });

    expect(PaymentDetail().save).toHaveBeenCalled();

    // Check that a successful response was sent
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      clientSecret: "secret_test_123",
      payment: expect.any(Object), // Payment object from the database
    });
  });

  it("should return an error if the amount is invalid", async () => {
    // Set an invalid amount
    req.body.Amount = "invalid";

    await paymentController.createPaymentIntent(req, res);

    // Ensure no Stripe or database calls were made
    expect(stripe().paymentIntents.create).not.toHaveBeenCalled();
    expect(PaymentDetail).not.toHaveBeenCalled();

    // Check that the error response was sent
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Invalid amount provided.",
    });
  });

  it("should return a 500 error if there is an issue creating the payment intent", async () => {
    // Mock Stripe payment intent creation failure
    stripe().paymentIntents.create.mockRejectedValue(new Error("Stripe error"));

    await paymentController.createPaymentIntent(req, res);

    // Check that the response was a 500 error
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Stripe error",
    });
  });
});
