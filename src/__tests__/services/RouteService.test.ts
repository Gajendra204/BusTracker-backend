
import { RouteService } from "../../services/RouteService";
import { Route } from "../../models/Route";
import { Bus } from "../../models/Bus";

// Mock models
jest.mock("../../models/Route");
jest.mock("../../models/Bus");

describe("RouteService", () => {
  let routeService: RouteService;

  beforeEach(() => {
    routeService = new RouteService();
    jest.clearAllMocks();
  });

  describe("createRoute", () => {
    it("should create a route successfully", async () => {
      const routeData = { name: "Route 1", stops: [{ order: 1 }] };
      const save = jest.fn().mockResolvedValue(routeData);
      Route.prototype.save = save;

      const result = await routeService.createRoute(routeData.name, routeData.stops);

      expect(save).toHaveBeenCalled();
      expect(result).toEqual(routeData);
    });

    it("should throw an error if stop orders are not unique", async () => {
        const routeData = { name: "Route 1", stops: [{ order: 1 }, { order: 1 }] };

        await expect(routeService.createRoute(routeData.name, routeData.stops)).rejects.toThrow("Stop orders must be unique");
    });

    it("should throw an error if bus not found", async () => {
        const routeData = { name: "Route 1", stops: [{ order: 1 }], busId: "nonexistent" };
        (Bus.findById as jest.Mock).mockResolvedValue(null);

        await expect(routeService.createRoute(routeData.name, routeData.stops, routeData.busId)).rejects.toThrow("Bus not found");
    });
  });

  describe("getAllRoutes", () => {
    it("should return all routes", async () => {
        const routes = [{ name: "Route 1" }];
        const populate = jest.fn().mockResolvedValue(routes);
        (Route.find as jest.Mock).mockReturnValue({ populate });

        const result = await routeService.getAllRoutes();

        expect(Route.find).toHaveBeenCalled();
        expect(populate).toHaveBeenCalledWith("busId", "name busNumber");
        expect(result).toEqual(routes);
    });
  });

  describe("getRouteById", () => {
    it("should return a single route by id", async () => {
        const routeId = "route1";
        const route = { name: "Route 1" };
        const populate2 = jest.fn().mockResolvedValue(route);
        const populate1 = jest.fn().mockReturnValue({ populate: populate2 });
        (Route.findById as jest.Mock).mockReturnValue({ populate: populate1 });

        const result = await routeService.getRouteById(routeId);

        expect(Route.findById).toHaveBeenCalledWith(routeId);
        expect(populate1).toHaveBeenCalledWith("busId", "name busNumber assignedDriver");
        expect(populate2).toHaveBeenCalledWith("busId.assignedDriver", "name phone");
        expect(result).toEqual(route);
    });

    it("should throw an error if route not found", async () => {
        const routeId = "nonexistent";
        const populate2 = jest.fn().mockResolvedValue(null);
        const populate1 = jest.fn().mockReturnValue({ populate: populate2 });
        (Route.findById as jest.Mock).mockReturnValue({ populate: populate1 });

        await expect(routeService.getRouteById(routeId)).rejects.toThrow("Route not found");
    });
  });

  describe("updateRoute", () => {
    it("should update a route successfully", async () => {
        const routeId = "route1";
        const routeData = { name: "Updated Route", stops: [] };
        (Route.findByIdAndUpdate as jest.Mock).mockResolvedValue({ _id: routeId, ...routeData });

        const result = await routeService.updateRoute(routeId, routeData.name, routeData.stops);

        expect(Route.findByIdAndUpdate).toHaveBeenCalled();
        expect(result).toBeDefined();
    });

    it("should throw an error if route to update is not found", async () => {
        const routeId = "nonexistent";
        const routeData = { name: "Updated Route", stops: [] };
        (Route.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

        await expect(routeService.updateRoute(routeId, routeData.name, routeData.stops)).rejects.toThrow("Route not found");
    });
  });

  describe("deleteRoute", () => {
    it("should delete a route successfully", async () => {
        const routeId = "route1";
        (Route.findByIdAndDelete as jest.Mock).mockResolvedValue({ _id: routeId });

        const result = await routeService.deleteRoute(routeId);

        expect(Route.findByIdAndDelete).toHaveBeenCalledWith(routeId);
        expect(result).toBeDefined();
    });

    it("should throw an error if route to delete is not found", async () => {
        const routeId = "nonexistent";
        (Route.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

        await expect(routeService.deleteRoute(routeId)).rejects.toThrow("Route not found");
    });
  });

  describe("assignBusToRoute", () => {
    it("should assign a bus to a route successfully", async () => {
        const routeId = "route1";
        const busId = "bus1";
        (Bus.findById as jest.Mock).mockResolvedValue({ _id: busId });
        (Route.findByIdAndUpdate as jest.Mock).mockResolvedValue({ _id: routeId, busId });

        const result = await routeService.assignBusToRoute(routeId, busId);

        expect(Bus.findById).toHaveBeenCalledWith(busId);
        expect(Route.findByIdAndUpdate).toHaveBeenCalledWith(routeId, { busId }, { new: true });
        expect(result).toBeDefined();
    });

    it("should throw an error if bus to assign is not found", async () => {
        const routeId = "route1";
        const busId = "nonexistent";
        (Bus.findById as jest.Mock).mockResolvedValue(null);

        await expect(routeService.assignBusToRoute(routeId, busId)).rejects.toThrow("Bus not found");
    });

    it("should throw an error if route to assign is not found", async () => {
        const routeId = "nonexistent";
        const busId = "bus1";
        (Bus.findById as jest.Mock).mockResolvedValue({ _id: busId });
        (Route.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

        await expect(routeService.assignBusToRoute(routeId, busId)).rejects.toThrow("Route not found");
    });
  });
});
