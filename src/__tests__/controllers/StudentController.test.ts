
import { Request, Response } from "express";
import { StudentController } from "../../controllers/StudentController";
import { StudentService } from "../../services/StudentService";
import { successResponse, errorResponse } from "../../utils/responseHandler";

// Mock dependencies
jest.mock("../../services/StudentService");
jest.mock("../../utils/responseHandler");

describe("StudentController", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe("createStudent", () => {
    it("should create a student successfully", async () => {
      mockRequest.params = { routeId: "route1" };
      mockRequest.body = { name: "Student 1" };
      const newStudent = { _id: "student1", ...mockRequest.body };
      (StudentService.prototype.createStudent as jest.Mock).mockResolvedValue(newStudent);

      await StudentController.createStudent(mockRequest as Request, mockResponse as Response);

      expect(successResponse).toHaveBeenCalledWith(
        mockResponse,
        newStudent,
        "Student created successfully",
        201
      );
    });

    it("should handle error while creating student", async () => {
      mockRequest.params = { routeId: "route1" };
      mockRequest.body = { name: "Student 1" };
      const errorMessage = "Error creating student";
      (StudentService.prototype.createStudent as jest.Mock).mockRejectedValue(new Error(errorMessage));

      await StudentController.createStudent(mockRequest as Request, mockResponse as Response);

      expect(errorResponse).toHaveBeenCalledWith(mockResponse, errorMessage, 400);
    });
  });

  describe("getStudentsByRoute", () => {
    it("should fetch students by route successfully", async () => {
      mockRequest.params = { routeId: "route1" };
      mockRequest.query = {};
      const students = [{ name: "Student 1" }];
      (StudentService.prototype.getStudentsByRoute as jest.Mock).mockResolvedValue(students);

      await StudentController.getStudentsByRoute(mockRequest as Request, mockResponse as Response);

      expect(successResponse).toHaveBeenCalledWith(mockResponse, students, "Students fetched successfully");
    });

    it("should handle error if route not found", async () => {
        mockRequest.params = { routeId: "nonexistent" };
        mockRequest.query = {};
        const errorMessage = "Route not found";
        (StudentService.prototype.getStudentsByRoute as jest.Mock).mockRejectedValue(new Error(errorMessage));
  
        await StudentController.getStudentsByRoute(mockRequest as Request, mockResponse as Response);
  
        expect(errorResponse).toHaveBeenCalledWith(mockResponse, errorMessage, 404);
      });
  });

  describe("deleteStudent", () => {
    it("should delete student successfully", async () => {
        mockRequest.params = { id: "student1" };
        (StudentService.prototype.deleteStudent as jest.Mock).mockResolvedValue({});

        await StudentController.deleteStudent(mockRequest as Request, mockResponse as Response);

        expect(successResponse).toHaveBeenCalledWith(mockResponse, null, "Student deleted successfully");
    });

    it("should handle error if student not found", async () => {
        mockRequest.params = { id: "nonexistent" };
        const errorMessage = "Student not found";
        (StudentService.prototype.deleteStudent as jest.Mock).mockRejectedValue(new Error(errorMessage));

        await StudentController.deleteStudent(mockRequest as Request, mockResponse as Response);

        expect(errorResponse).toHaveBeenCalledWith(mockResponse, errorMessage, 404);
    });
  });
});
