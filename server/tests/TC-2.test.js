const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const userService = require("../fetch_service/userService");
const httpMocks = require("node-mocks-http");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Mock the userService
jest.mock("../fetch_service/userService");

// Mock bcrypt and jwt
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

describe("Auth Controller - Register and Login", () => {
  let req, res;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
  });

  afterEach(() => {
    jest.clearAllMocks(); // clear all mocks
  });

  describe("Register User", () => {
    it("should register a new user successfully", async () => {
      req.body = {
        email: "test@example.com",
        password: "Password123!",
        name: "Test User",
        phoneNumber: "1234567890",
        role: "user",
      };

      userService.fetchUserByEmail.mockResolvedValue(null); // No existing user
      bcrypt.hash.mockResolvedValue("hashedPassword");
      userService.registerUser.mockResolvedValue({
        message: "User created successfully.",
        data: { id: "userId", ...req.body, Password: "hashedPassword" },
      });

      await userController.registerUser(req, res);

      expect(userService.fetchUserByEmail).toHaveBeenCalledWith(req.body.email);
      expect(bcrypt.hash).toHaveBeenCalledWith(req.body.password, 12);
      expect(userService.registerUser).toHaveBeenCalledWith({
        Email: req.body.email,
        Password: "hashedPassword",
        Name: req.body.name,
        PhoneNumber: req.body.phoneNumber,
        Role: req.body.role,
        LastLoginAttempt: expect.any(Date),
      });
      expect(res.statusCode).toBe(201);
      expect(res._getJSONData()).toEqual({
        status: "success",
        message: "User created successfully.",
        data: expect.any(Object),
      });
    });

    it("should return 400 if email is already in use", async () => {
      req.body = {
        email: "test@example.com",
        password: "Password123!",
        name: "Test User",
        phoneNumber: "1234567890",
        role: "user",
      };

      userService.fetchUserByEmail.mockResolvedValue({ id: "existingUserId" });

      await userController.registerUser(req, res);

      expect(userService.fetchUserByEmail).toHaveBeenCalledWith(req.body.email);
      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toEqual({
        status: "fail",
        message: "Email already in use",
      });
    });
  });

  describe("Login User", () => {
    it("should login user successfully and return token", async () => {
      req.body = {
        email: "test@example.com",
        password: "Password123!",
      };

      const user = {
        _id: "userId",
        Email: req.body.email,
        Password: "hashedPassword",
        Name: "Test User",
        PhoneNumber: "1234567890",
        Role: "user",
        LoginAttempt: 0,
        LastLoginAttempt: null,
        save: jest.fn().mockResolvedValue(true), // Mock the save method
      };

      userService.fetchUserByEmail.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue("jwtToken");

      await authController.loginUser(req, res);

      expect(userService.fetchUserByEmail).toHaveBeenCalledWith(req.body.email);
      expect(bcrypt.compare).toHaveBeenCalledWith(req.body.password, user.Password);
      expect(jwt.sign).toHaveBeenCalledWith({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual({
        token: "jwtToken",
        user: {
          id: user._id,
          email: user.Email,
          name: user.Name,
          phoneNumber: user.PhoneNumber,
          role: user.Role,
          loginAttempts: user.LoginAttempt,
          lastLoggedIn: user.LastLoginAttempt,
        },
      });
    });

    it("should return 401 if email or password is invalid", async () => {
      req.body = {
        email: "test@example.com",
        password: "Password123!",
      };

      userService.fetchUserByEmail.mockResolvedValue(null);

      await authController.loginUser(req, res);

      expect(userService.fetchUserByEmail).toHaveBeenCalledWith(req.body.email);
      expect(res.statusCode).toBe(401);
      expect(res._getJSONData()).toEqual({ message: "Invalid email or password" });
    });

    it("should return 403 if account is locked", async () => {
      req.body = {
        email: "test@example.com",
        password: "Password123!",
      };

      const user = {
        _id: "userId",
        Email: req.body.email,
        Password: "hashedPassword",
        Name: "Test User",
        PhoneNumber: "1234567890",
        Role: "user",
        LoginAttempt: 5,
        LastLoginAttempt: new Date(),
        save: jest.fn().mockResolvedValue(true), // Mock the save method
      };

      userService.fetchUserByEmail.mockResolvedValue(user);

      await authController.loginUser(req, res);

      expect(userService.fetchUserByEmail).toHaveBeenCalledWith(req.body.email);
      expect(res.statusCode).toBe(403);
      expect(res._getJSONData()).toEqual({ message: "Account locked. Try again later." });
    });
  });
  describe("Integration Test - Register and Login", () => {
    let req, res;
  
    beforeEach(() => {
      req = httpMocks.createRequest();
      res = httpMocks.createResponse();
    });
  
    afterEach(() => {
      jest.clearAllMocks(); // Clear all mocks to avoid interference
    });
  
    it("should register a user and log in successfully", async () => {
      // 1. Register the User
      req.body = {
        email: "integration@example.com",
        password: "Integration123!",
        name: "Integration Test User",
        phoneNumber: "0987654321",
        role: "user",
      };
  
      userService.fetchUserByEmail.mockResolvedValue(null); // No existing user
      bcrypt.hash.mockResolvedValue("hashedPassword");
      userService.registerUser.mockResolvedValue({
        message: "User created successfully.",
        data: { id: "integrationUserId", ...req.body, Password: "hashedPassword" },
      });
  
      await userController.registerUser(req, res);
  
      // Check if registration was successful
      expect(res.statusCode).toBe(201);
      const registerResponse = res._getJSONData();
      expect(registerResponse.status).toBe("success");
      expect(registerResponse.message).toBe("User created successfully.");
  
      // 2. Use the registered user data to log in
      req = httpMocks.createRequest({
        body: {
          email: "integration@example.com",
          password: "Integration123!",
        },
      });
      res = httpMocks.createResponse();
  
      const user = {
        _id: "integrationUserId",
        Email: req.body.email,
        Password: "hashedPassword",
        Name: "Integration Test User",
        PhoneNumber: "0987654321",
        Role: "user",
        LoginAttempt: 0,
        LastLoginAttempt: null,
        save: jest.fn().mockResolvedValue(true), // Mock the save method
      };
  
      userService.fetchUserByEmail.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue("jwtToken");
  
      await authController.loginUser(req, res);
  
      // Check if login was successful and token is returned
      expect(res.statusCode).toBe(200);
      const loginResponse = res._getJSONData();
      expect(loginResponse.token).toBe("jwtToken");
      expect(loginResponse.user).toEqual({
        id: user._id,
        email: user.Email,
        name: user.Name,
        phoneNumber: user.PhoneNumber,
        role: user.Role,
        loginAttempts: user.LoginAttempt,
        lastLoggedIn: user.LastLoginAttempt,
      });
    });
  });
});