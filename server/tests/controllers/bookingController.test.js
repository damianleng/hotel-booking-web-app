const bookingController = require("../../controllers/bookingController");
const RoomDetail = require("../../data_schema/roomSchema");
const BookingDetail = require("../../data_schema/bookingSchema");
const bookingService = require("../../fetch_service/bookingService");
const httpMocks = require("node-mocks-http");

// Mock the bookingService
jest.mock("../../fetch_service/bookingService");

// Mock the RoomDetail and BookingDetail
jest.mock("../../data_schema/roomSchema");
jest.mock("../../data_schema/bookingSchema");

// Unit Test for getBooking
describe("Booking Controller - getBooking", () => {
  let req, res;

  beforeEach(() => {
    // Create mock request and response objects
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
  });

  test("should return 200 and booking data if booking is found", async () => {
    // Mock request parameters
    req.params.id = "12345";

    // Mock the service function to return booking data
    bookingService.fetchBookingById.mockResolvedValue({
      id: "12345",
      room: "Deuluxe",
      guestName: "John Doe",
    });

    await bookingController.getBooking(req, res);

    // Check the response status and data
    expect(res.statusCode).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data.status).toBe("success");
    expect(data.data.booking.id).toBe("12345");
  });

  test("should return 500 if service throws an error", async () => {
    // Mock request parameters
    req.params.id = "12345";

    // Mock the service function to return booking data
    bookingService.fetchBookingById.mockRejectedValue(
      new Error("Database Error")
    );

    await bookingController.getBooking(req, res);

    // Check the response status and data
    expect(res.statusCode).toBe(500);
    const data = JSON.parse(res._getData());

    expect(data.status).toBe("fail");
    expect(data.message).toBe("Database Error");
  });
});

// Unit Test for getAllBookings
describe("Booking Controller - getAllBookings", () => {
  let req, res;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
  });

  test("should return 200 and all bookings", async () => {
    // Mock the service to return a list of bookings
    bookingService.fetchBookings.mockResolvedValue([
      { id: "12345", room: "Deluxe", guestName: "John Doe" },
      { id: "67890", room: "Suite", guestName: "Jane Smith" },
    ]);

    await bookingController.getAllBookings(req, res);

    expect(res.statusCode).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data).toEqual([
      { id: "12345", room: "Deluxe", guestName: "John Doe" },
      { id: "67890", room: "Suite", guestName: "Jane Smith" },
    ]);
  });

  test("should return 505 if service throws an error", async () => {
    // Mock the service to throw an error
    bookingService.fetchBookings.mockRejectedValue(new Error("Database Error"));

    await bookingController.getAllBookings(req, res);

    expect(res.statusCode).toBe(505);
    const data = JSON.parse(res._getData());
    expect(data.message).toBe("Database Error");
  });
});

// Unit Test for createBooking
describe("Booking Controller - createBooking", () => {
  let req, res;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
  });

  test("Should return 201 and create booking", async () => {
    req.body = {
      RoomID: "room1",
      guestName: "John Doe",
      checkInDate: "2024-11-01",
      checkOutDate: "2024-11-05",
    };

    // Mock bookingService to return a new booking
    bookingService.createBooking.mockResolvedValue({
      id: "12345",
      room: "Deluxe",
      guestName: "John Doe",
    });

    // Mock RoomDetail to return a room
    const roomMock = {
      Status: "Available",
      save: jest.fn(), // Mock the save method
    };
    RoomDetail.findById.mockResolvedValue(roomMock);

    await bookingController.createBooking(req, res);

    expect(res.statusCode).toBe(201);
    const data = JSON.parse(res._getData());
    expect(data.status).toBe("success");
    expect(data.data.booking.id).toBe("12345");

    // Ensure room status was updated
    expect(roomMock.Status).toBe("Reserved");
    expect(roomMock.save).toHaveBeenCalled();
  });

  test("should return 500 if service throws an error", async () => {
    req.body = {
      RoomID: "room1",
      guestName: "John Doe",
    };

    // Mock the service to throw an error
    bookingService.createBooking.mockRejectedValue(new Error("Database Error"));

    await bookingController.createBooking(req, res);

    expect(res.statusCode).toBe(500);
    const data = JSON.parse(res._getData());
    expect(data.status).toBe("fail");
    expect(data.message).toBe("Database Error");
  });
});

// Unit Test for updateBooking
describe("Booking Controller - updateBooking", () => {
  let req, res;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
  });

  test("Should return 200 and update booking", async () => {
    req.params.id = "12345";
    req.body = {
      guestName: "John Doe Updated",
      checkInDate: "2024-11-01",
      checkOutDate: "2024-11-10",
    };

    // Mock bookingService to return and updated booking
    bookingService.updateBookingById.mockResolvedValue({
      id: "12345",
      room: "Deluxe",
      guestName: "John Doe Updated",
    });

    await bookingController.updateBooking(req, res);

    expect(res.statusCode).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data.status).toBe("success");
    expect(data.data.booking.id).toBe("12345");
    expect(data.data.booking.guestName).toBe("John Doe Updated");
  });

  test("Should return 404 if booking not found", async () => {
    req.params.id = "99999";

    // Mock bookingService to return null
    bookingService.updateBookingById.mockResolvedValue(null);

    await bookingController.updateBooking(req, res);

    expect(res.statusCode).toBe(404);
    const data = JSON.parse(res._getData());
    expect(data.status).toBe("fail");
    expect(data.message).toBe("No booking found with that ID");
  });

  test("Should return 500 if service throws an error", async () => {
    req.params.id = "12345";
    req.body = {
      guestName: "John Doe Updated",
    };

    // Mock the service to throw an error
    bookingService.updateBookingById.mockRejectedValue(
      new Error("Database Error")
    );

    await bookingController.updateBooking(req, res);

    expect(res.statusCode).toBe(500);
    const data = JSON.parse(res._getData());
    expect(data.status).toBe("fail");
    expect(data.message).toBe("Database Error");
  });
});

// Unit Test for deleteBooking
describe("Booking Controller - deleteBooking", () => {
  let req, res;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
  });

  test("should return 204 and delete booking", async () => {
    req.params.id = "12345";

    // Mock bookingService to indicate successful deletion
    bookingService.deleteBookingById.mockResolvedValue(true);

    await bookingController.deleteBooking(req, res);

    expect(res.statusCode).toBe(204);
    expect(res._getData()).toBe("");
  });

  test("Should return 404 if booking not found", async () => {
    req.params.id = "99999";

    // Mock bookingService to return null
    bookingService.deleteBookingById.mockResolvedValue(null);

    await bookingController.deleteBooking(req, res);

    expect(res.statusCode).toBe(404);
    const data = JSON.parse(res._getData());
    expect(data.status).toBe("fail");
    expect(data.message).toBe("No booking found with that ID");
  });

  test("Should return 500 if service throws an error", async () => {
    req.params.id = "12345";

    // Mock the service to throw an error
    bookingService.deleteBookingById.mockRejectedValue(
      new Error("Database Error")
    );

    await bookingController.deleteBooking(req, res);

    expect(res.statusCode).toBe(500);
    const data = JSON.parse(res._getData());
    expect(data.status).toBe("fail");
    expect(data.message).toBe("Database Error");
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
      checkInDate: "2024-11-23",  // New user is searching for these dates
      checkOutDate: "2024-11-24",
      maxPeople: "2",  // Example search for 2 people
    };
  
    // Mock RoomDetail.find to return a room that can accommodate 2 people
    RoomDetail.find.mockResolvedValue([
      { _id: "room1", MaxPeople: 2, Status: "Available" },  // Room to be checked
    ]);
  
    // Mock BookingDetail.find to return a booking for the same room from 21st to 22nd
    BookingDetail.find.mockResolvedValue([
    ]);
  
    // Call the controller
    await bookingController.getAvailableRooms(req, res);
  
    // Parse the response
    const data = JSON.parse(res._getData());
  
    // The room should be available because the booking does not overlap with the search dates (23rd to 24th)
    expect(res.statusCode).toBe(200);
    expect(data.success).toBe(true);
    expect(data.total).toBe(1);  // Room1 should be available
    expect(data.availableRooms.length).toBe(1);
    expect(data.availableRooms[0]._id).toBe("room1");  // Room1 is the available room
  });
  
});
