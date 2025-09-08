
import { ParentService } from "../../services/ParentService";
import { Student } from "../../models/Student";
import { Route } from "../../models/Route";
import { Bus } from "../../models/Bus";

// Mock models
jest.mock("../../models/Student");
jest.mock("../../models/Route");
jest.mock("../../models/Bus");

describe("ParentService", () => {
  let parentService: ParentService;

  beforeEach(() => {
    parentService = new ParentService();
    jest.clearAllMocks();
  });

  describe("getParentRoute", () => {
    it("should return parent route data", async () => {
      const parentPhone = "1234567890";
      const student = { _id: "student1", routeId: "route1" };
      const route = { _id: "route1", busId: "bus1" };
      const bus = { _id: "bus1", assignedDriver: { _id: "driver1" } };

      (Student.find as jest.Mock).mockResolvedValue([student]);
      (Route.findById as jest.Mock).mockResolvedValue(route);
      const populate = jest.fn().mockResolvedValue(bus);
      (Bus.findById as jest.Mock).mockReturnValue({ populate });

      const result = await parentService.getParentRoute(parentPhone);

      expect(Student.find).toHaveBeenCalledWith({ parentPhone });
      expect(Route.findById).toHaveBeenCalledWith(student.routeId);
      expect(Bus.findById).toHaveBeenCalledWith(route.busId);
      expect(result).toBeDefined();
    });

    it("should throw an error if no student found", async () => {
        const parentPhone = "1234567890";
        (Student.find as jest.Mock).mockResolvedValue([]);
  
        await expect(parentService.getParentRoute(parentPhone)).rejects.toThrow("No student found for this parent");
      });
  });

  describe("getParentProfile", () => {
    it("should return parent profile data", async () => {
        const parentPhone = "1234567890";
        const students = [{ parentName: "Parent Name" }];
        (Student.find as jest.Mock).mockResolvedValue(students);

        const result = await parentService.getParentProfile(parentPhone);

        expect(Student.find).toHaveBeenCalledWith({ parentPhone });
        expect(result).toBeDefined();
        expect(result.parentName).toBe("Parent Name");
    });

    it("should throw an error if no students found", async () => {
        const parentPhone = "1234567890";
        (Student.find as jest.Mock).mockResolvedValue([]);

        await expect(parentService.getParentProfile(parentPhone)).rejects.toThrow("No students found for this parent");
    });
  });

  describe("getParentChildren", () => {
    it("should return parent children data", async () => {
        const parentPhone = "1234567890";
        const students = [{ name: "Child 1" }];
        const populate = jest.fn().mockResolvedValue(students);
        (Student.find as jest.Mock).mockReturnValue({ populate });

        const result = await parentService.getParentChildren(parentPhone);

        expect(Student.find).toHaveBeenCalledWith({ parentPhone });
        expect(populate).toHaveBeenCalledWith("routeId");
        expect(result).toEqual(students);
    });
  });
});
