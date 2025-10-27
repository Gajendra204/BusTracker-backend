
import { TokenService } from "../../services/TokenService";
import jwt from 'jsonwebtoken';
import { UserRole } from "../../interfaces/IUser";

// Mock jsonwebtoken
jest.mock('jsonwebtoken');

describe("TokenService", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("generateAdminToken", () => {
    it("should generate an admin token", () => {
      const userId = "admin1";
      const role = UserRole.ADMIN;
      TokenService.generateAdminToken(userId, role);
      expect(jwt.sign).toHaveBeenCalledWith({ userId, role }, expect.any(String), { expiresIn: '7d' });
    });
  });

  describe("generateDriverToken", () => {
    it("should generate a driver token", () => {
      const driver = { _id: { toString: () => "driver1" }, phone: "123" };
      TokenService.generateDriverToken(driver);
      expect(jwt.sign).toHaveBeenCalledWith({ userId: "driver1", role: UserRole.DRIVER, phone: "123" }, expect.any(String), { expiresIn: '7d' });
    });
  });

  describe("generateParentToken", () => {
    it("should generate a parent token", () => {
      const student = { _id: { toString: () => "student1" }, parentPhone: "456" };
      TokenService.generateParentToken(student);
      expect(jwt.sign).toHaveBeenCalledWith({ userId: "student1", role: UserRole.PARENT, phone: "456", studentId: student._id }, expect.any(String), { expiresIn: '7d' });
    });
  });

  describe("verifyToken", () => {
    it("should verify a token successfully", () => {
      const token = "some.token.string";
      const decoded = { userId: "user1" };
      (jwt.verify as jest.Mock).mockReturnValue(decoded);
      const result = TokenService.verifyToken(token);
      expect(jwt.verify).toHaveBeenCalledWith(token, expect.any(String));
      expect(result).toEqual(decoded);
    });

    it("should throw an error for an expired token", () => {
        const token = "expired.token.string";
        (jwt.verify as jest.Mock).mockImplementation(() => { throw { name: 'TokenExpiredError' }; });
        expect(() => TokenService.verifyToken(token)).toThrow('Token expired');
    });

    it("should throw an error for an invalid token", () => {
        const token = "invalid.token.string";
        (jwt.verify as jest.Mock).mockImplementation(() => { throw new Error('Invalid signature'); });
        expect(() => TokenService.verifyToken(token)).toThrow('Invalid token');
    });
  });
});
