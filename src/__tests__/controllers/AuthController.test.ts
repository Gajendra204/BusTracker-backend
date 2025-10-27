import { Request, Response } from "express";
import { AuthController } from "../../controllers/AuthController";
import { AuthService } from "../../services/AuthService";

// Mock AuthService
jest.mock("../../services/AuthService");

describe("AuthController", () => {
  let authController: AuthController;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    authController = new AuthController();
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe("registerAdmin", () => {
    it("should register an admin successfully", async () => {
      const mockRequest = {
        body: { name: "Admin", email: "admin@test.com", password: "12345", schoolName: "ABC School", role: "admin" },
      } as Request;

      (AuthService.prototype.registerAdmin as jest.Mock).mockResolvedValue(mockRequest.body);

      await authController.registerAdmin(mockRequest, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "Admin registered successfully",
        })
      );
    });

    it("should return error if password is missing", async () => {
      const mockRequest = { body: { email: "admin@test.com" } } as Request;

      await authController.registerAdmin(mockRequest, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: "Password is required",
        })
      );
    });
  });

  describe("loginAdmin", () => {
    it("should login admin successfully", async () => {
      const mockRequest = { body: { email: "admin@test.com", password: "12345" } } as Request;

      (AuthService.prototype.loginAdmin as jest.Mock).mockResolvedValue("jwt-token");

      await authController.loginAdmin(mockRequest, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "Login successful",
          data: { token: "jwt-token" },
        })
      );
    });

    it("should return error if login fails", async () => {
      const mockRequest = { body: { email: "admin@test.com", password: "wrong" } } as Request;

      (AuthService.prototype.loginAdmin as jest.Mock).mockRejectedValue(new Error("Invalid credentials"));

      await authController.loginAdmin(mockRequest, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: "Invalid credentials",
        })
      );
    });
  });

  describe("sendDriverOTP", () => {
    it("should send driver OTP successfully", async () => {
      const mockRequest = { body: { phoneNumber: "1234567890" } } as Request;
      (AuthService.sendDriverOTP as jest.Mock).mockResolvedValue({ success: true, otpToken: "otp-123" });

      await authController.sendDriverOTP(mockRequest, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "OTP sent successfully",
          data: { otpToken: "otp-123" },
        })
      );
    });
  });

  describe("verifyDriverOTP", () => {
    it("should verify driver OTP successfully", async () => {
      const mockRequest = { body: { otpToken: "otp-123", otp: "1111" } } as Request;
      (AuthService.verifyDriverOTP as jest.Mock).mockResolvedValue("jwt-driver-token");

      await authController.verifyDriverOTP(mockRequest, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "Driver OTP verified successfully",
          data: { token: "jwt-driver-token" },
        })
      );
    });
  });

  describe("sendParentOTP", () => {
    it("should send parent OTP successfully", async () => {
      const mockRequest = { body: { phoneNumber: "9876543210" } } as Request;
      (AuthService.sendParentOTP as jest.Mock).mockResolvedValue({ success: true, otpToken: "otp-parent" });

      await authController.sendParentOTP(mockRequest, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "OTP sent successfully",
          data: { otpToken: "otp-parent" },
        })
      );
    });
  });

  describe("verifyParentOTP", () => {
    it("should verify parent OTP successfully", async () => {
      const mockRequest = { body: { otpToken: "otp-parent", otp: "2222" } } as Request;
      (AuthService.verifyParentOTP as jest.Mock).mockResolvedValue("jwt-parent-token");

      await authController.verifyParentOTP(mockRequest, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "Parent OTP verified successfully",
          data: { token: "jwt-parent-token" },
        })
      );
    });
  });
});
