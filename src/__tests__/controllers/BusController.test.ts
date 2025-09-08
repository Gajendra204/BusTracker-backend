import { Request, Response } from "express";
import { BusController } from "../../controllers/BusController";
import { BusService } from "../../services/BusService";
import { successResponse, errorResponse } from "../../utils/responseHandler";

// Mock dependencies
jest.mock("../../services/BusService");
jest.mock("../../utils/responseHandler");

describe("BusController", () => {
  let busController: BusController;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    busController = new BusController();
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe("createBus", () => {
    it("should create a bus successfully", async () => {
      const mockRequest = { body: { number: "BUS101" } } as Request;
      (BusService.prototype.createBus as jest.Mock).mockResolvedValue(mockRequest.body);

      await busController.createBus(mockRequest, mockResponse as Response);

      expect(successResponse).toHaveBeenCalledWith(
        mockResponse,
        mockRequest.body,
        "Bus created successfully",
        200
      );
    });

    it("should handle error while creating bus", async () => {
      const mockRequest = { body: {} } as Request;
      (BusService.prototype.createBus as jest.Mock).mockRejectedValue(new Error("Create failed"));

      await busController.createBus(mockRequest, mockResponse as Response);

      expect(errorResponse).toHaveBeenCalledWith(mockResponse, "Create failed", 400);
    });
  });

  describe("getAllBuses", () => {
    it("should fetch all buses successfully", async () => {
      const mockRequest = {} as Request;
      const buses = [{ id: "1", number: "BUS101" }];
      (BusService.prototype.getAllBuses as jest.Mock).mockResolvedValue(buses);

      await busController.getAllBuses(mockRequest, mockResponse as Response);

      expect(successResponse).toHaveBeenCalledWith(
        mockResponse,
        buses,
        "Buses fetched successfully",
        200
      );
    });

    it("should handle error while fetching buses", async () => {
      (BusService.prototype.getAllBuses as jest.Mock).mockRejectedValue(new Error("DB error"));

      await busController.getAllBuses({} as Request, mockResponse as Response);

      expect(errorResponse).toHaveBeenCalledWith(mockResponse, "DB error", 500);
    });
  });

  describe("assignDriverToBus", () => {
    it("should assign driver successfully", async () => {
      const mockRequest = { body: { busId: "1", driverId: "D1" } } as Request;
      const result = { id: "1", driverId: "D1" };
      (BusService.prototype.assignDriver as jest.Mock).mockResolvedValue(result);

      await busController.assignDriverToBus(mockRequest, mockResponse as Response);

      expect(successResponse).toHaveBeenCalledWith(
        mockResponse,
        result,
        "Driver assigned successfully",
        200
      );
    });

    it("should handle error while assigning driver", async () => {
      const mockRequest = { body: { busId: "1", driverId: "D1" } } as Request;
      (BusService.prototype.assignDriver as jest.Mock).mockRejectedValue(new Error("Assign failed"));

      await busController.assignDriverToBus(mockRequest, mockResponse as Response);

      expect(errorResponse).toHaveBeenCalledWith(mockResponse, "Assign failed", 400);
    });
  });

  describe("updateBus", () => {
    it("should update bus successfully", async () => {
      const mockRequest = { params: { id: "1" }, body: { number: "BUS202" } } as unknown as Request;
      const updatedBus = { id: "1", number: "BUS202" };
      (BusService.prototype.updateBus as jest.Mock).mockResolvedValue(updatedBus);

      await busController.updateBus(mockRequest, mockResponse as Response);

      expect(successResponse).toHaveBeenCalledWith(
        mockResponse,
        updatedBus,
        "Bus updated successfully",
        200
      );
    });

    it("should handle error while updating bus", async () => {
      const mockRequest = { params: { id: "1" }, body: {} } as unknown as Request;
      (BusService.prototype.updateBus as jest.Mock).mockRejectedValue(new Error("Update failed"));

      await busController.updateBus(mockRequest, mockResponse as Response);

      expect(errorResponse).toHaveBeenCalledWith(mockResponse, "Update failed", 400);
    });
  });

  describe("deleteBus", () => {
    it("should delete bus successfully", async () => {
      const mockRequest = { params: { id: "1" } } as unknown as Request;
      (BusService.prototype.deleteBus as jest.Mock).mockResolvedValue(undefined);

      await busController.deleteBus(mockRequest, mockResponse as Response);

      expect(successResponse).toHaveBeenCalledWith(
        mockResponse,
        null,
        "Bus deleted successfully"
      );
    });

    it("should handle error while deleting bus", async () => {
      const mockRequest = { params: { id: "1" } } as unknown as Request;
      (BusService.prototype.deleteBus as jest.Mock).mockRejectedValue(new Error("Delete failed"));

      await busController.deleteBus(mockRequest, mockResponse as Response);

      expect(errorResponse).toHaveBeenCalledWith(mockResponse, "Delete failed", 400);
    });
  });
});
