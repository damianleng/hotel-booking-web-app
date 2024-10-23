const roomController = require("../../controllers/roomController");
const RoomDetail = require("../../data_schema/roomSchema");
const roomService = require("../../fetch_service/roomService");
const httpMocks = require("node-mocks-http");

// Mock the bookingService
jest.mock("../../fetch_service/roomService");

// Mock the RoomDetail and BookingDetail
jest.mock("../../data_schema/roomSchema");

// Unit Test for getBooking
describe("Room Controller - getRoom", () => {
  let req, res;

  beforeEach(() => {
    // Create mock request and response objects
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
  });

  test("should return 200 and room data if room is found", async () => {
    // Mock request parameters
    req.params.id = "room1";

    // Mock the service function to return booking data
    roomService.fetchRoomById.mockResolvedValue({
      id: "room1",
    });

    await roomController.getRoom(req, res);

    // Check the response status and data
    expect(res.statusCode).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data.status).toBe("success");
    expect(data.data.room.id).toBe("room1");
  });

  test("should return 404 and if room is found", async () => {
    // Mock request parameters
    req.params.id = "room1";

    // Mock the service function to return booking data
    roomService.fetchRoomById.mockResolvedValue(null);

    await roomController.getRoom(req, res);

    // Check the response status and data
    expect(res.statusCode).toBe(404);
    const data = JSON.parse(res._getData());
    expect(data.status).toBe("fail");
    expect(data.message).toBe("No room found with that ID");
  });

  test("should return 500 if roomService throws an error", async () => {
    // Mock request parameters
    req.params.id = "room1";

    // Mock the roomService to throw an error
    roomService.fetchRoomById.mockRejectedValue(new Error("Database Error"));

    await roomController.getRoom(req, res);

    expect(res.statusCode).toBe(500);
    const data = JSON.parse(res._getData());
    expect(data.status).toBe("fail");
    expect(data.message).toBe("Database Error");
  });
});

// Unit Test for getAllRooms
describe("Room Controller - getAllRooms", () => {
  let req, res;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
  });

  test("should return 200 and all rooms", async () => {
    // Mock the roomService to return an array of rooms
    roomService.fetchRooms.mockResolvedValue([
      { _id: "room1", MaxPeople: 2 },
      { _id: "room2", MaxPeople: 4 },
    ]);

    await roomController.getAllRooms(req, res);

    expect(res.statusCode).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data).toEqual([
      { _id: "room1", MaxPeople: 2 },
      { _id: "room2", MaxPeople: 4 },
    ]);
  });

  test("should return 505 if roomService throws an error", async () => {
    // Mock the roomService to throw an error
    roomService.fetchRooms.mockRejectedValue(new Error("Database error"));

    await roomController.getAllRooms(req, res);

    expect(res.statusCode).toBe(505);
    const data = JSON.parse(res._getData());
    expect(data.message).toBe("Database error");
  });
});

describe("Room Controller - createRoom", () => {
  let req, res;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
  });

  test("should return 201 and create a new room", async () => {
    req.body = { MaxPeople: 2, Status: "Available" };

    // Mock the roomService to return the created room
    roomService.createRoom.mockResolvedValue({ _id: "room1", MaxPeople: 2 });

    await roomController.createRoom(req, res);

    expect(res.statusCode).toBe(201);
    const data = JSON.parse(res._getData());
    expect(data.status).toBe("success");
    expect(data.data.room._id).toBe("room1");
  });

  test("should return 505 if roomService throws an error", async () => {
    req.body = { MaxPeople: 2, Status: "Available" };

    // Mock the roomService to throw an error
    roomService.createRoom.mockRejectedValue(new Error("Database error"));

    await roomController.createRoom(req, res);

    expect(res.statusCode).toBe(505);
    const data = JSON.parse(res._getData());
    expect(data.status).toBe("fail");
    expect(data.message).toBe("Database error");
  });
});

describe("Room Controller - updateRoom", () => {
  let req, res;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
  });

  test("should return 200 and update the room if it exists", async () => {
    req.params.id = "room1";
    req.body = { MaxPeople: 3 };

    // Mock the roomService to return the updated room
    roomService.updateRoomById.mockResolvedValue({
      _id: "room1",
      MaxPeople: 3,
    });

    await roomController.updateRoom(req, res);

    expect(res.statusCode).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data.status).toBe("success");
    expect(data.data.booking.MaxPeople).toBe(3);
  });

  test("should return 404 if no room found to update", async () => {
    req.params.id = "room1";
    req.body = { MaxPeople: 3 };

    // Mock the roomService to return null
    roomService.updateRoomById.mockResolvedValue(null);

    await roomController.updateRoom(req, res);

    expect(res.statusCode).toBe(404);
    const data = JSON.parse(res._getData());
    expect(data.status).toBe("fail");
    expect(data.message).toBe("No room found with that ID");
  });

  test("should return 500 if roomService throws an error", async () => {
    req.params.id = "room1";
    req.body = { MaxPeople: 3 };

    // Mock the roomService to throw an error
    roomService.updateRoomById.mockRejectedValue(new Error("Database error"));

    await roomController.updateRoom(req, res);

    expect(res.statusCode).toBe(500);
    const data = JSON.parse(res._getData());
    expect(data.status).toBe("fail");
    expect(data.message).toBe("Database error");
  });
});

describe("Room Controller - deleteRoom", () => {
  let req, res;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
  });

  test("should return 204 and delete the room if it exists", async () => {
    req.params.id = "room1";

    // Mock the roomService to return true for successful deletion
    roomService.deleteRoomById.mockResolvedValue(true);

    await roomController.deleteRoom(req, res);

    expect(res.statusCode).toBe(204);
    expect(res._getData()).toBe("");
  });

  test("should return 404 if no room found to delete", async () => {
    req.params.id = "room1";

    // Mock the roomService to return false (room not found)
    roomService.deleteRoomById.mockResolvedValue(false);

    await roomController.deleteRoom(req, res);

    expect(res.statusCode).toBe(404);
    const data = JSON.parse(res._getData());
    expect(data.status).toBe("fail");
    expect(data.message).toBe("No room found with that ID");
  });

  test("should return 500 if roomService throws an error", async () => {
    req.params.id = "room1";

    // Mock the roomService to throw an error
    roomService.deleteRoomById.mockRejectedValue(new Error("Database error"));

    await roomController.deleteRoom(req, res);

    expect(res.statusCode).toBe(500);
    const data = JSON.parse(res._getData());
    expect(data.status).toBe("fail");
    expect(data.message).toBe("Database error");
  });
});
