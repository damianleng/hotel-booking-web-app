const bookingController = require("../controllers/bookingController");
const RoomDetail = require("../data_schema/roomSchema");
const BookingDetail = require("../data_schema/bookingSchema");
const bookingService = require("../fetch_service/bookingService");
const emailService = require("../fetch_service/notificationService");
const httpMocks = require("node-mocks-http");

// Mock the bookingService
jest.mock("../fetch_service/bookingService");

// Mock the RoomDetail and BookingDetail
jest.mock("../data_schema/roomSchema");
jest.mock("../data_schema/bookingSchema");

// Mock the authMiddleware
jest.mock("../middleware/authMiddleware", () => {
  return jest.fn((req, res, next) => {
    req.userId = "mockUserId"; // Mock a userId for the request
    next(); // Call next to proceed to the controller
  });
});

// Unit Test for getAvailableRooms
describe("Booking Controller - getAvailableRooms", () => {
  let req, res;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
  });

  test("should return 200 and display all rooms based on different dates", async () => {
    // we choose a different check-in and check-out date
    req.query = {
      checkInDate: "2024-11-07",
      checkOutDate: "2024-11-08",
      maxPeople: "3",
    };

    // Mock RoomDetail to return all rooms that accommodate at least 2 people
    RoomDetail.find.mockResolvedValue([
      { _id: "room1", MaxPeople: 2, Status: "Available" },
      { _id: "room2", MaxPeople: 4, Status: "Available" },
      { _id: "room3", MaxPeople: 3, Status: "Available" }, // This should be included (exact match)
    ]);

    // Mock BookingDetail to return bookings that overlap with previous dates
    // Mock BookingDetail.find to return bookings that overlap with the given date range
    BookingDetail.find.mockResolvedValue([
      {
        RoomID: "room3", // Room3 is booked for the requested dates, should be excluded
        CheckInDate: new Date("2024-11-07"), // Overlaps with the requested check-in date
        CheckOutDate: new Date("2024-11-08"),
      },
    ]);

    await bookingController.getAvailableRooms(req, res);
    const data = JSON.parse(res._getData());

    expect(res.statusCode).toBe(200);
    expect(data.success).toBe(true);
    expect(data.total).toBe(2); // Both rooms should be available
    expect(data.availableRooms.length).toBe(2);
  });

  test("should return room as available when booking does not overlap with search dates", async () => {
    req.query = {
      checkInDate: "2024-11-23", // New user is searching for these dates
      checkOutDate: "2024-11-24",
      maxPeople: "2", // Example search for 2 people
    };

    // Mock RoomDetail.find to return a room that can accommodate 2 people
    RoomDetail.find.mockResolvedValue([
      { _id: "room1", MaxPeople: 2, Status: "Available" }, // Room to be checked
    ]);

    // Mock BookingDetail.find to return a booking for the same room from 21st to 22nd
    BookingDetail.find.mockResolvedValue([]);

    // Call the controller
    await bookingController.getAvailableRooms(req, res);

    // Parse the response
    const data = JSON.parse(res._getData());

    // The room should be available because the booking does not overlap with the search dates (23rd to 24th)
    expect(res.statusCode).toBe(200);
    expect(data.success).toBe(true);
    expect(data.total).toBe(1); // Room1 should be available
    expect(data.availableRooms.length).toBe(1);
    expect(data.availableRooms[0]._id).toBe("room1"); // Room1 is the available room
  });
});

describe("createBooking", () => {
  let req, res;

  beforeEach(() => {
    // Create a sample request
    req = httpMocks.createRequest({
      body: {
        RoomID: "someRoomId",
        checkInDate: "2024-10-25",
        checkOutDate: "2024-10-30",
        RoomType: "Single",
        Guests: 2,
        FirstName: "John",
        LastName: "Doe",
        Email: "john.doe@example.com",
        Phone: "1234567890",
        Address: "123 Main St",
      },
      userId: "someUserId", // Simulating userId from auth middleware
    });

    // Mock a response
    res = httpMocks.createResponse();
  });

  it("should create a booking and update room status successfully", async () => {
    // Mock the createBooking function to return a booking object
    bookingService.createBooking.mockResolvedValue({
      _id: "someBookingId",
      RoomID: req.body.RoomID,
      UserID: req.userId,
      CheckInDate: req.body.checkInDate,
      CheckOutDate: req.body.checkOutDate,
      RoomType: req.body.RoomType,
      Guests: req.body.Guests,
      FirstName: req.body.FirstName,
      LastName: req.body.LastName,
      Email: req.body.Email,
      Phone: req.body.Phone,
      Address: req.body.Address,
    });

    // Mock RoomDetail.findById to return a room object with an Image
    RoomDetail.findById.mockResolvedValue({
      id: req.body.RoomID,
      Status: "Available",
      save: jest.fn(), // mock the save function
    });

    await bookingController.createBooking(req, res);

    // Verify that bookingService.createBooking was called with the correct data
    expect(bookingService.createBooking).toHaveBeenCalledWith({
      ...req.body,
      UserID: req.userId,
    });

    // Verify that RoomDetail.findById was called with the correct RoomID
    expect(RoomDetail.findById).toHaveBeenCalledWith(req.body.RoomID);

    // Verify that room status is updated and saved
    const room = await RoomDetail.findById(req.body.RoomID);
    expect(room.Status).toBe("Reserved");
    expect(room.save).toHaveBeenCalled();

    // Verify response status and json structure
    expect(res.statusCode).toBe(201);
    const data = JSON.parse(res._getData());
    expect(data).toEqual({
      status: "success",
      data: { booking: expect.any(Object) }, // ensure booking object is returned
    });
  });

  it("should return 400 if email is not provided", async () => {
    req.body.Email = ""; // Set Email to an empty string

    await bookingController.createBooking(req, res);

    // Verify response status and error message
    expect(res.statusCode).toBe(400);
    const data = JSON.parse(res._getData());
    expect(data).toEqual({
      status: "fail",
      message: "No recipient email provided in booking data",
    });
  });

  it("should handle errors and return status 500", async () => {
    // Mock the createBooking function to throw an error
    bookingService.createBooking.mockRejectedValue(new Error("Booking failed"));

    await bookingController.createBooking(req, res);

    // Verify that bookingService.createBooking was called
    expect(bookingService.createBooking).toHaveBeenCalledWith({
      ...req.body,
      UserID: req.userId,
    });

    // Verify that error handling is working
    expect(res.statusCode).toBe(500);
    const data = JSON.parse(res._getData());
    expect(data).toEqual({
      status: "fail",
      message: "Booking failed",
    });
  });
});
