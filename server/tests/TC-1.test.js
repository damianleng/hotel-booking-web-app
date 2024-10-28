const bookingController = require("../controllers/bookingController");
const RoomDetail = require("../data_schema/roomSchema");
const BookingDetail = require("../data_schema/bookingSchema");
const bookingService = require("../fetch_service/bookingService");
const httpMocks = require("node-mocks-http");

// Mock the bookingService
jest.mock("../fetch_service/bookingService");

// Mock the RoomDetail and BookingDetail
jest.mock("../data_schema/roomSchema");
jest.mock("../data_schema/bookingSchema");

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

// Unit Test for create bookings
describe("createBooking", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        RoomID: "someRoomId",
        userId: "someUserId",
        checkInDate: "2024-10-25",
        checkOutDate: "2024-10-30",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("should create a booking and update room status successfully", async () => {
    // Mock the createBooking function to return a booking object
    bookingService.createBooking.mockResolvedValue({
      id: "someBookingId",
      RoomID: req.body.RoomID,
      userId: req.body.userId,
      checkInDate: req.body.checkInDate,
      checkOutDate: req.body.checkOutDate,
    });

    // Mock RoomDetail.findById to return a room object
    RoomDetail.findById.mockResolvedValue({
      id: req.body.RoomID,
      Status: "Available",
      save: jest.fn(), // mock the save function
    });

    await bookingController.createBooking(req, res);

    // Verify that bookingService.createBooking was called with the correct data
    expect(bookingService.createBooking).toHaveBeenCalledWith(req.body);

    // Verify that RoomDetail.findById was called with the correct RoomID
    expect(RoomDetail.findById).toHaveBeenCalledWith(req.body.RoomID);

    // Verify that room status is updated and saved
    const room = await RoomDetail.findById(req.body.RoomID);
    expect(room.Status).toBe("Reserved");
    expect(room.save).toHaveBeenCalled();

    // Verify response status and json structure
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      status: "success",
      data: { booking: expect.any(Object) }, // ensure booking object is returned
    });
  });

  it("should handle errors and return status 500", async () => {
    // Mock the createBooking function to throw an error
    bookingService.createBooking.mockRejectedValue(new Error("Booking failed"));

    await bookingController.createBooking(req, res);

    // Verify that bookingService.createBooking was called
    expect(bookingService.createBooking).toHaveBeenCalledWith(req.body);

    // Verify that error handling is working
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      status: "fail",
      message: "Booking failed",
    });
  });
});