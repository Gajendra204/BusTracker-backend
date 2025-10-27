
import { DriverService } from "../../services/DriverService";
import { Driver } from "../../models/Driver";
import { Bus } from "../../models/Bus";
import { Route } from "../../models/Route";
import { Student } from "../../models/Student";

// Mock models
jest.mock("../../models/Driver");
jest.mock("../../models/Bus");
jest.mock("../../models/Route");
jest.mock("../../models/Student");

describe("DriverService", () => {
  let driverService: DriverService;

  beforeEach(() => {
    driverService = new DriverService();
    jest.clearAllMocks();
  });

  describe("createDriver", () => {
    it("should create a driver successfully", async () => {
      const driverData = { name: "John Doe", phone: "1234567890" };
      const save = jest.fn().mockResolvedValue(driverData);
      Driver.prototype.save = save;

      const result = await driverService.createDriver(driverData.name, driverData.phone);

      expect(save).toHaveBeenCalled();
      expect(result).toEqual(driverData);
    });
  });

  describe("getAllDrivers", () => {
    it("should return all drivers", async () => {
      const drivers = [{ name: "John Doe" }];
      (Driver.find as jest.Mock).mockResolvedValue(drivers);

      const result = await driverService.getAllDrivers();

      expect(Driver.find).toHaveBeenCalled();
      expect(result).toEqual(drivers);
    });
  });

  describe("getDriverRoute", () => {
    it("should return driver route data", async () => {
        const driverId = "driver1";
        const bus = { _id: "bus1", name: "Bus 1", busNumber: "B1", capacity: 50, assignedDriver: { name: "John Doe" } };
        const route = { _id: "route1", name: "Route 1", stops: [] };
        const students = [{ _id: "student1", name: "Student 1" }];
        
        const populate = jest.fn().mockResolvedValue(bus);
        (Bus.findOne as jest.Mock).mockReturnValue({ populate });
        (Route.findOne as jest.Mock).mockResolvedValue(route);
        (Student.find as jest.Mock).mockResolvedValue(students);

        const result = await driverService.getDriverRoute(driverId);

        expect(Bus.findOne).toHaveBeenCalledWith({ assignedDriver: driverId });
        expect(Route.findOne).toHaveBeenCalledWith({ busId: bus._id });
        expect(Student.find).toHaveBeenCalledWith({ routeId: route._id });
        expect(result).toBeDefined();
    });

    it("should return null if bus not found", async () => {
        const driverId = "driver1";
        const populate = jest.fn().mockResolvedValue(null);
        (Bus.findOne as jest.Mock).mockReturnValue({ populate });

        const result = await driverService.getDriverRoute(driverId);

        expect(result).toBeNull();
    });

    it("should return null if route not found", async () => {
        const driverId = "driver1";
        const bus = { _id: "bus1" };
        const populate = jest.fn().mockResolvedValue(bus);
        (Bus.findOne as jest.Mock).mockReturnValue({ populate });
        (Route.findOne as jest.Mock).mockResolvedValue(null);

        const result = await driverService.getDriverRoute(driverId);

        expect(result).toBeNull();
    });
  });

  describe("getDriverProfile", () => {
    it("should return driver profile", async () => {
        const driverId = "driver1";
        const driver = { name: "John Doe" };
        (Driver.findById as jest.Mock).mockResolvedValue(driver);

        const result = await driverService.getDriverProfile(driverId);

        expect(Driver.findById).toHaveBeenCalledWith(driverId);
        expect(result).toEqual(driver);
    });
  });

  describe("updateDriver", () => {
    it("should update a driver successfully", async () => {
        const driverId = "driver1";
        const driverData = { name: "John Doe Updated", phone: "0987654321" };
        (Driver.findByIdAndUpdate as jest.Mock).mockResolvedValue({ _id: driverId, ...driverData });

        const result = await driverService.updateDriver(driverId, driverData.name, driverData.phone);

        expect(Driver.findByIdAndUpdate).toHaveBeenCalledWith(driverId, driverData, { new: true });
        expect(result).toBeDefined();
    });
  });

  describe("deleteDriver", () => {
    it("should delete a driver successfully", async () => {
        const driverId = "driver1";
        (Driver.findByIdAndDelete as jest.Mock).mockResolvedValue({ _id: driverId });

        const result = await driverService.deleteDriver(driverId);

        expect(Driver.findByIdAndDelete).toHaveBeenCalledWith(driverId);
        expect(result).toBeDefined();
    });
  });
});
