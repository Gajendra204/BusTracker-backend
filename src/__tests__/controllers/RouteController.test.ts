
import { Request, Response } from "express";
import { RouteController } from "../../controllers/RouteController";
import { RouteService } from "../../services/RouteService";
import { successResponse, errorResponse } from "../../utils/responseHandler";

// Mock dependencies
jest.mock("../../services/RouteService");
jest.mock("../../utils/responseHandler");

describe("RouteController", () => {
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

  describe("createRoute", () => {
    it("should create a route successfully", async () => {
      mockRequest.body = { name: "Route 1", stops: [], busId: "bus1" };
      const newRoute = { _id: "route1", ...mockRequest.body };
      (RouteService.prototype.createRoute as jest.Mock).mockResolvedValue(newRoute);

      await RouteController.createRoute(mockRequest as Request, mockResponse as Response);

      expect(successResponse).toHaveBeenCalledWith(
        mockResponse,
        newRoute,
        "Route created successfully",
        201
      );
    });

    it("should handle error while creating route", async () => {
      mockRequest.body = { name: "Route 1" };
      const errorMessage = "Error creating route";
      (RouteService.prototype.createRoute as jest.Mock).mockRejectedValue(new Error(errorMessage));

      await RouteController.createRoute(mockRequest as Request, mockResponse as Response);

      expect(errorResponse).toHaveBeenCalledWith(mockResponse, errorMessage, 400);
    });
  });

  describe("getRoutes", () => {
    it("should fetch all routes successfully", async () => {
      const routes = [{ name: "Route 1" }];
      (RouteService.prototype.getAllRoutes as jest.Mock).mockResolvedValue(routes);

      await RouteController.getRoutes(mockRequest as Request, mockResponse as Response);

      expect(successResponse).toHaveBeenCalledWith(mockResponse, routes, "Routes fetched successfully");
    });

    it("should handle error while fetching routes", async () => {
        const errorMessage = "Error fetching routes";
        (RouteService.prototype.getAllRoutes as jest.Mock).mockRejectedValue(new Error(errorMessage));
  
        await RouteController.getRoutes(mockRequest as Request, mockResponse as Response);
  
        expect(errorResponse).toHaveBeenCalledWith(mockResponse, errorMessage, 500);
      });
  });

  describe("getRouteById", () => {
    it("should fetch a single route successfully", async () => {
        mockRequest.params = { id: "route1" };
        const route = { name: "Route 1" };
        (RouteService.prototype.getRouteById as jest.Mock).mockResolvedValue(route);

        await RouteController.getRouteById(mockRequest as Request, mockResponse as Response);

        expect(successResponse).toHaveBeenCalledWith(mockResponse, route, "Route fetched successfully");
    });

    it("should handle error if route not found", async () => {
        mockRequest.params = { id: "nonexistent" };
        const errorMessage = "Route not found";
        (RouteService.prototype.getRouteById as jest.Mock).mockRejectedValue(new Error(errorMessage));

        await RouteController.getRouteById(mockRequest as Request, mockResponse as Response);

        expect(errorResponse).toHaveBeenCalledWith(mockResponse, errorMessage, 404);
    });
  });

  describe("updateRoute", () => {
    it("should update route successfully", async () => {
        mockRequest.params = { id: "route1" };
        mockRequest.body = { name: "Updated Route 1" };
        const updatedRoute = { _id: "route1", name: "Updated Route 1" };
        (RouteService.prototype.updateRoute as jest.Mock).mockResolvedValue(updatedRoute);

        await RouteController.updateRoute(mockRequest as Request, mockResponse as Response);

        expect(successResponse).toHaveBeenCalledWith(mockResponse, updatedRoute, "Route updated successfully");
    });

    it("should handle error while updating route", async () => {
        mockRequest.params = { id: "route1" };
        mockRequest.body = { name: "Updated Route 1" };
        const errorMessage = "Update failed";
        (RouteService.prototype.updateRoute as jest.Mock).mockRejectedValue(new Error(errorMessage));

        await RouteController.updateRoute(mockRequest as Request, mockResponse as Response);

        expect(errorResponse).toHaveBeenCalledWith(mockResponse, errorMessage, 400);
    });
  });

  describe("deleteRoute", () => {
    it("should delete route successfully", async () => {
        mockRequest.params = { id: "route1" };
        const deletedRoute = { _id: "route1" };
        (RouteService.prototype.deleteRoute as jest.Mock).mockResolvedValue(deletedRoute);

        await RouteController.deleteRoute(mockRequest as Request, mockResponse as Response);

        expect(successResponse).toHaveBeenCalledWith(mockResponse, null, "Route deleted successfully");
    });

    it("should handle error while deleting route", async () => {
        mockRequest.params = { id: "route1" };
        const errorMessage = "Delete failed";
        (RouteService.prototype.deleteRoute as jest.Mock).mockRejectedValue(new Error(errorMessage));

        await RouteController.deleteRoute(mockRequest as Request, mockResponse as Response);

        expect(errorResponse).toHaveBeenCalledWith(mockResponse, errorMessage, 400);
    });
  });

  describe("assignBusToRoute", () => {
    it("should assign bus to route successfully", async () => {
        mockRequest.params = { id: "route1" };
        mockRequest.body = { busId: "bus1" };
        const updatedRoute = { _id: "route1", busId: "bus1" };
        (RouteService.prototype.assignBusToRoute as jest.Mock).mockResolvedValue(updatedRoute);

        await RouteController.assignBusToRoute(mockRequest as Request, mockResponse as Response);

        expect(successResponse).toHaveBeenCalledWith(mockResponse, updatedRoute, "Bus assigned to route successfully");
    });

    it("should handle error while assigning bus to route", async () => {
        mockRequest.params = { id: "route1" };
        mockRequest.body = { busId: "bus1" };
        const errorMessage = "Assign failed";
        (RouteService.prototype.assignBusToRoute as jest.Mock).mockRejectedValue(new Error(errorMessage));

        await RouteController.assignBusToRoute(mockRequest as Request, mockResponse as Response);

        expect(errorResponse).toHaveBeenCalledWith(mockResponse, errorMessage, 400);
    });
  });
});
