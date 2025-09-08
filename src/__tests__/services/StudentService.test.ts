
import { StudentService } from "../../services/StudentService";
import { Student } from "../../models/Student";
import { Route } from "../../models/Route";

// Mock models
jest.mock("../../models/Student");
jest.mock("../../models/Route");

describe("StudentService", () => {
  let studentService: StudentService;

  beforeEach(() => {
    studentService = new StudentService();
    jest.clearAllMocks();
  });

  describe("createStudent", () => {
    it("should create a student successfully", async () => {
      const studentData = { 
        name: "Student 1", 
        studentClass: "1A", 
        parentName: "Parent 1", 
        parentPhone: "123", 
        pickupLocation: "A", 
        dropoffLocation: "B", 
        routeId: "route1" 
      };
      (Route.findById as jest.Mock).mockResolvedValue({ _id: "route1" });
      const save = jest.fn().mockResolvedValue(studentData);
      Student.prototype.save = save;

      const result = await studentService.createStudent(
        studentData.name, 
        studentData.studentClass, 
        studentData.parentName, 
        studentData.parentPhone, 
        studentData.pickupLocation, 
        studentData.dropoffLocation, 
        studentData.routeId
      );

      expect(Route.findById).toHaveBeenCalledWith(studentData.routeId);
      expect(save).toHaveBeenCalled();
      expect(result).toEqual(studentData);
    });

    it("should throw an error if route not found", async () => {
        const studentData = { routeId: "nonexistent" };
        (Route.findById as jest.Mock).mockResolvedValue(null);

        await expect(studentService.createStudent(
            "", "", "", "", "", "", studentData.routeId
        )).rejects.toThrow("Route not found");
    });
  });

  describe("getStudentsByRoute", () => {
    it("should return students for a given route", async () => {
        const routeId = "route1";
        const students = [{ name: "Student 1" }];
        (Route.findById as jest.Mock).mockResolvedValue({ _id: routeId });
        const sort = jest.fn().mockResolvedValue(students);
        (Student.find as jest.Mock).mockReturnValue({ sort });

        const result = await studentService.getStudentsByRoute(routeId);

        expect(Route.findById).toHaveBeenCalledWith(routeId);
        expect(Student.find).toHaveBeenCalledWith({ routeId });
        expect(sort).toHaveBeenCalledWith({ class: 1, name: 1 });
        expect(result).toEqual(students);
    });

    it("should throw an error if route not found", async () => {
        const routeId = "nonexistent";
        (Route.findById as jest.Mock).mockResolvedValue(null);

        await expect(studentService.getStudentsByRoute(routeId)).rejects.toThrow("Route not found");
    });
  });

  describe("deleteStudent", () => {
    it("should delete a student successfully", async () => {
        const studentId = "student1";
        (Student.findByIdAndDelete as jest.Mock).mockResolvedValue({ _id: studentId });

        const result = await studentService.deleteStudent(studentId);

        expect(Student.findByIdAndDelete).toHaveBeenCalledWith(studentId);
        expect(result).toBeDefined();
    });

    it("should throw an error if student to delete is not found", async () => {
        const studentId = "nonexistent";
        (Student.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

        await expect(studentService.deleteStudent(studentId)).rejects.toThrow("Student not found");
    });
  });
});
