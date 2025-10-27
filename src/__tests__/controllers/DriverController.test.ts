

import { UserRole } from "../../interfaces/IUser";
import { Request, Response } from "express";
import { DriverController } from "../../controllers/DriverController";
import { DriverService } from "../../services/DriverService";
import { successResponse, errorResponse } from "../../utils/responseHandler";

// Mock dependencies
jest.mock("../../services/DriverService");
jest.mock("../../utils/responseHandler");

describe("DriverController", () => {
  let driverController: DriverController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    driverController = new DriverController();
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe("createDriver", () => {
    it("should create a driver successfully", async () => {
      mockRequest.body = { name: "Gajendra", phone: "1234567890" };
      const newDriver = { _id: "someId", ...mockRequest.body };
      (DriverService.prototype.createDriver as jest.Mock).mockResolvedValue(newDriver);

      await driverController.createDriver(mockRequest as Request, mockResponse as Response);

      expect(successResponse).toHaveBeenCalledWith(
        mockResponse,
        newDriver,
        "Driver created successfully",
        201
      );
    });

    it("should handle error while creating driver", async () => {
      mockRequest.body = { name: "Gajendra", phone: "1234567890" };
      const errorMessage = "Error creating driver";
      (DriverService.prototype.createDriver as jest.Mock).mockRejectedValue(new Error(errorMessage));

      await driverController.createDriver(mockRequest as Request, mockResponse as Response);

      expect(errorResponse).toHaveBeenCalledWith(mockResponse, errorMessage, 400);
    });
  });

  describe("getAllDrivers", () => {
    it("should fetch all drivers successfully", async () => {
      const drivers = [{ name: "Gajendra", phone: "1234567890" }];
      (DriverService.prototype.getAllDrivers as jest.Mock).mockResolvedValue(drivers);

      await driverController.getAllDrivers(mockRequest as Request, mockResponse as Response);

      expect(successResponse).toHaveBeenCalledWith(
        mockResponse,
        drivers,
        "Drivers fetched successfully"
      );
    });

    it("should handle error while fetching drivers", async () => {
      const errorMessage = "Error fetching drivers";
      (DriverService.prototype.getAllDrivers as jest.Mock).mockRejectedValue(new Error(errorMessage));

      await driverController.getAllDrivers(mockRequest as Request, mockResponse as Response);

      expect(errorResponse).toHaveBeenCalledWith(mockResponse, errorMessage, 500);
    });
  });

  describe("getDriverRoute", () => {
    it("should fetch driver route successfully", async () => {
        mockRequest.user = { userId: "driverId", role: UserRole.DRIVER };
        const routeData = { route: "Route 66" };
        (DriverService.prototype.getDriverRoute as jest.Mock).mockResolvedValue(routeData);

        await driverController.getDriverRoute(mockRequest as Request, mockResponse as Response);

        expect(successResponse).toHaveBeenCalledWith(
            mockResponse,
            routeData,
            "Driver route fetched successfully"
        );
    });

    it("should return 401 if driver ID is not in token", async () => {
        mockRequest.user = undefined;

        await driverController.getDriverRoute(mockRequest as Request, mockResponse as Response);

        expect(errorResponse).toHaveBeenCalledWith(mockResponse, "Driver ID not found in token", 401);
    });

    it("should return 404 if no route is assigned", async () => {
        mockRequest.user = { userId: "driverId", role: UserRole.DRIVER };
        (DriverService.prototype.getDriverRoute as jest.Mock).mockResolvedValue(null);

        await driverController.getDriverRoute(mockRequest as Request, mockResponse as Response);

        expect(errorResponse).toHaveBeenCalledWith(mockResponse, "No bus/route assigned to this driver", 404);
    });
  });

  describe("getDriverProfile", () => {
    it("should fetch driver profile successfully", async () => {
        mockRequest.user = { userId: "driverId", role: UserRole.DRIVER };
        const driverProfile = { name: "Gajendra", phone: "1234567890" };
        (DriverService.prototype.getDriverProfile as jest.Mock).mockResolvedValue(driverProfile);

        await driverController.getDriverProfile(mockRequest as Request, mockResponse as Response);

        expect(successResponse).toHaveBeenCalledWith(
            mockResponse,
            driverProfile,
            "Driver profile fetched successfully"
        );
    });

    it("should return 404 if driver not found", async () => {
        mockRequest.user = { userId: "driverId", role: UserRole.DRIVER };
        (DriverService.prototype.getDriverProfile as jest.Mock).mockResolvedValue(null);

        await driverController.getDriverProfile(mockRequest as Request, mockResponse as Response);

        expect(errorResponse).toHaveBeenCalledWith(mockResponse, "Driver not found", 404);
    });
  });

  describe("updateDriver", () => {
    it("should update driver successfully", async () => {
        mockRequest.params = { id: "driverId" };
        mockRequest.body = { name: "Gajendra Updated" };
        const updatedDriver = { _id: "driverId", name: "Gajendra Updated" };
        (DriverService.prototype.updateDriver as jest.Mock).mockResolvedValue(updatedDriver);

        await driverController.updateDriver(mockRequest as Request, mockResponse as Response);

        expect(successResponse).toHaveBeenCalledWith(
            mockResponse,
            updatedDriver,
            "Driver updated successfully"
        );
    });

    it("should return 404 if driver to update is not found", async () => {
        mockRequest.params = { id: "nonExistentId" };
        mockRequest.body = { name: "Gajendra Updated" };
        (DriverService.prototype.updateDriver as jest.Mock).mockResolvedValue(null);

        await driverController.updateDriver(mockRequest as Request, mockResponse as Response);

        expect(errorResponse).toHaveBeenCalledWith(mockResponse, "Driver not found", 404);
    });
  });

  describe("deleteDriver", () => {
    it("should delete driver successfully", async () => {
        mockRequest.params = { id: "driverId" };
        const deletedDriver = { _id: "driverId" };
        (DriverService.prototype.deleteDriver as jest.Mock).mockResolvedValue(deletedDriver);

        await driverController.deleteDriver(mockRequest as Request, mockResponse as Response);

        expect(successResponse).toHaveBeenCalledWith(
            mockResponse,
            null,
            "Driver deleted successfully"
        );
    });

    it("should return 404 if driver to delete is not found", async () => {
        mockRequest.params = { id: "nonExistentId" };
        (DriverService.prototype.deleteDriver as jest.Mock).mockResolvedValue(null);

        await driverController.deleteDriver(mockRequest as Request, mockResponse as Response);

        expect(errorResponse).toHaveBeenCalledWith(mockResponse, "Driver not found", 404);
    });
  });
});
