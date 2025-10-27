
import { AuthService } from "../../services/AuthService";
import { AdminAuthService } from "../../services/AdminAuthService";
import { OTPService } from "../../services/OTPService";
import { TokenService } from "../../services/TokenService";
import { IUser, UserRole } from "../../interfaces/IUser";

// Mock dependencies
jest.mock("../../services/AdminAuthService");
jest.mock("../../services/OTPService");
jest.mock("../../services/TokenService");

describe("AuthService", () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
    jest.clearAllMocks();
  });

  describe("registerAdmin", () => {
    it("should call AdminAuthService.registerAdmin", async () => {
      const userData: IUser = { name: "Admin", email: "admin@test.com", password: "password", role: UserRole.ADMIN };
      await authService.registerAdmin(userData);
      expect(AdminAuthService.prototype.registerAdmin).toHaveBeenCalledWith(userData);
    });
  });

  describe("loginAdmin", () => {
    it("should call AdminAuthService.loginAdmin", async () => {
      const email = "admin@test.com";
      const password = "password";
      await authService.loginAdmin(email, password);
      expect(AdminAuthService.prototype.loginAdmin).toHaveBeenCalledWith(email, password);
    });
  });

  describe("findUserByEmail", () => {
    it("should call AdminAuthService.findUserByEmail", async () => {
      const email = "admin@test.com";
      await authService.findUserByEmail(email);
      expect(AdminAuthService.prototype.findUserByEmail).toHaveBeenCalledWith(email);
    });
  });

  describe("sendDriverOTP", () => {
    it("should call OTPService.sendDriverOTP", async () => {
      const phoneNumber = "1234567890";
      await AuthService.sendDriverOTP(phoneNumber);
      expect(OTPService.sendDriverOTP).toHaveBeenCalledWith(phoneNumber);
    });
  });

  describe("sendParentOTP", () => {
    it("should call OTPService.sendParentOTP", async () => {
      const phoneNumber = "1234567890";
      await AuthService.sendParentOTP(phoneNumber);
      expect(OTPService.sendParentOTP).toHaveBeenCalledWith(phoneNumber);
    });
  });

  describe("verifyDriverOTP", () => {
    it("should call OTPService.verifyDriverOTP and TokenService.generateDriverToken", async () => {
      const otpToken = "token";
      const otp = "1234";
      const driver = { _id: "driverId" };
      (OTPService.verifyDriverOTP as jest.Mock).mockResolvedValue(driver);
      await AuthService.verifyDriverOTP(otpToken, otp);
      expect(OTPService.verifyDriverOTP).toHaveBeenCalledWith(otpToken, otp);
      expect(TokenService.generateDriverToken).toHaveBeenCalledWith(driver);
    });
  });

  describe("verifyParentOTP", () => {
    it("should call OTPService.verifyParentOTP and TokenService.generateParentToken", async () => {
      const otpToken = "token";
      const otp = "1234";
      const student = { _id: "studentId" };
      (OTPService.verifyParentOTP as jest.Mock).mockResolvedValue(student);
      await AuthService.verifyParentOTP(otpToken, otp);
      expect(OTPService.verifyParentOTP).toHaveBeenCalledWith(otpToken, otp);
      expect(TokenService.generateParentToken).toHaveBeenCalledWith(student);
    });
  });
});
