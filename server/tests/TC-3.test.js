const bookingController = require("../controllers/bookingController");
const BookingDetail = require("../data_schema/bookingSchema");
const bookingService = require("../fetch_service/bookingService");
const httpMocks = require("node-mocks-http");

// Mock the BookingDetail model
jest.mock("../data_schema/bookingSchema");

describe("Booking Controller - getBookingsByUserID", () => {
    let req, res;
  
    beforeEach(() => {
      req = httpMocks.createRequest();
      res = httpMocks.createResponse();
      req.userId = "sampleUserId"; // Mock userId for the request
    });
  
    it("should return 200 and bookings for the user", async () => {
      // Mock BookingDetail.find().populate() to return bookings
      BookingDetail.find.mockImplementation(() => ({
        populate: jest.fn().mockResolvedValue([
          { _id: "booking1", RoomID: "room1", UserID: "sampleUserId" },
          { _id: "booking2", RoomID: "room2", UserID: "sampleUserId" },
        ]),
      }));
  
      await bookingController.getBookingsByUserID(req, res);
  
      const data = JSON.parse(res._getData());
      expect(res.statusCode).toBe(200);
      expect(data.status).toBe("success");
      expect(data.total).toBe(2);
      expect(data.data.bookings.length).toBe(2);
    });
  
    it("should return 404 if no bookings are found", async () => {
      // Mock BookingDetail.find().populate() to return an empty array
      BookingDetail.find.mockImplementation(() => ({
        populate: jest.fn().mockResolvedValue([]),
      }));
  
      await bookingController.getBookingsByUserID(req, res);
  
      const data = JSON.parse(res._getData());
      expect(res.statusCode).toBe(404);
      expect(data.status).toBe("fail");
      expect(data.message).toBe("No bookings found for this user");
    });
  
    it("should handle errors and return status 500", async () => {
      // Mock BookingDetail.find().populate() to throw an error
      BookingDetail.find.mockImplementation(() => ({
        populate: jest.fn().mockRejectedValue(new Error("Database error")),
      }));
  
      await bookingController.getBookingsByUserID(req, res);
  
      const data = JSON.parse(res._getData());
      expect(res.statusCode).toBe(500);
      expect(data.status).toBe("fail");
      expect(data.message).toBe("Database error");
    });
  });
  