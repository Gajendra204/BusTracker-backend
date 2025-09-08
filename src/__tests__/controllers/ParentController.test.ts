
import { UserRole } from "../../interfaces/IUser";
import { Request, Response } from "express";
import { ParentController } from "../../controllers/ParentController";
import { ParentService } from "../../services/ParentService";
import { successResponse, errorResponse } from "../../utils/responseHandler";

// Mock dependencies
jest.mock("../../services/ParentService");
jest.mock("../../utils/responseHandler");

describe("ParentController", () => {
  let parentController: ParentController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    parentController = new ParentController();
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe("getParentRoute", () => {
    it("should fetch parent route successfully", async () => {
      mockRequest.user = { userId: 'parentId', role: UserRole.PARENT, phone: "1234567890" };
      const routeData = { route: "Route 1" };
      (ParentService.prototype.getParentRoute as jest.Mock).mockResolvedValue(routeData);

      await parentController.getParentRoute(mockRequest as Request, mockResponse as Response);

      expect(successResponse).toHaveBeenCalledWith(
        mockResponse,
        routeData,
        "Parent route fetched successfully"
      );
    });

    it("should return 401 if parent phone is not in token", async () => {
      mockRequest.user = undefined;

      await parentController.getParentRoute(mockRequest as Request, mockResponse as Response);

      expect(errorResponse).toHaveBeenCalledWith(mockResponse, "Parent phone not found in token", 401);
    });

    it("should handle error while fetching parent route", async () => {
      mockRequest.user = { userId: 'parentId', role: UserRole.PARENT, phone: "1234567890" };
      const errorMessage = "Error fetching parent route";
      (ParentService.prototype.getParentRoute as jest.Mock).mockRejectedValue(new Error(errorMessage));

      await parentController.getParentRoute(mockRequest as Request, mockResponse as Response);

      expect(errorResponse).toHaveBeenCalledWith(mockResponse, errorMessage, 500);
    });
  });

  describe("getParentProfile", () => {
    it("should fetch parent profile successfully", async () => {
        mockRequest.user = { userId: 'parentId', role: UserRole.PARENT, phone: "1234567890" };
        const profileData = { name: "Parent Name" };
        (ParentService.prototype.getParentProfile as jest.Mock).mockResolvedValue(profileData);

        await parentController.getParentProfile(mockRequest as Request, mockResponse as Response);

        expect(successResponse).toHaveBeenCalledWith(
            mockResponse,
            profileData,
            "Parent profile fetched successfully"
        );
    });

    it("should return 404 if parent not found", async () => {
        mockRequest.user = { userId: 'parentId', role: UserRole.PARENT, phone: "1234567890" };
        const errorMessage = "Parent not found";
        (ParentService.prototype.getParentProfile as jest.Mock).mockRejectedValue(new Error(errorMessage));

        await parentController.getParentProfile(mockRequest as Request, mockResponse as Response);

        expect(errorResponse).toHaveBeenCalledWith(mockResponse, errorMessage, 404);
    });
  });

  describe("getParentChildren", () => {
    it("should fetch parent children successfully", async () => {
        mockRequest.user = { userId: 'parentId', role: UserRole.PARENT, phone: "1234567890" };
        const childrenData = [{ name: "Child1" }, { name: "Child2" }];
        (ParentService.prototype.getParentChildren as jest.Mock).mockResolvedValue(childrenData);

        await parentController.getParentChildren(mockRequest as Request, mockResponse as Response);

        expect(successResponse).toHaveBeenCalledWith(
            mockResponse,
            childrenData,
            "Parent children fetched successfully"
        );
    });

    it("should handle error while fetching parent children", async () => {
        mockRequest.user = { userId: 'parentId', role: UserRole.PARENT, phone: "1234567890" };
        const errorMessage = "Error fetching children";
        (ParentService.prototype.getParentChildren as jest.Mock).mockRejectedValue(new Error(errorMessage));

        await parentController.getParentChildren(mockRequest as Request, mockResponse as Response);

        expect(errorResponse).toHaveBeenCalledWith(mockResponse, errorMessage, 500);
    });
  });
});
