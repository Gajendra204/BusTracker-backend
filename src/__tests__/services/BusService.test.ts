
import { BusService } from "../../services/BusService";
import { Bus } from "../../models/Bus";

// Mock the Bus model
jest.mock("../../models/Bus");

describe("BusService", () => {
  let busService: BusService;

  beforeEach(() => {
    busService = new BusService();
    jest.clearAllMocks();
  });

  describe("createBus", () => {
    it("should create a bus successfully", async () => {
      const busData = { name: "Bus 1", busNumber: "B1", capacity: 50 };
      const save = jest.fn().mockResolvedValue(undefined);
      const populate = jest.fn().mockResolvedValue(busData);
      Bus.prototype.save = save;
      Bus.populate = populate;

      const result = await busService.createBus(busData);

      expect(save).toHaveBeenCalled();
      expect(populate).toHaveBeenCalled();
      expect(result).toEqual(busData);
    });
  });

  describe("getAllBuses", () => {
    it("should return all buses", async () => {
      const buses = [{ name: "Bus 1" }];
      const populate = jest.fn().mockResolvedValue(buses);
      (Bus.find as jest.Mock).mockReturnValue({ populate });

      const result = await busService.getAllBuses();

      expect(Bus.find).toHaveBeenCalled();
      expect(populate).toHaveBeenCalledWith("assignedDriver");
      expect(result).toEqual(buses);
    });
  });

  describe("assignDriver", () => {
    it("should assign a driver to a bus", async () => {
      const busId = "bus1";
      const driverId = "driver1";
      const updatedBus = { _id: busId, assignedDriver: driverId };
      const populate = jest.fn().mockResolvedValue(updatedBus);
      (Bus.findByIdAndUpdate as jest.Mock).mockReturnValue({ populate });

      const result = await busService.assignDriver(busId, driverId);

      expect(Bus.findByIdAndUpdate).toHaveBeenCalledWith(busId, { assignedDriver: driverId }, { new: true });
      expect(populate).toHaveBeenCalledWith("assignedDriver");
      expect(result).toEqual(updatedBus);
    });

    it("should throw an error if bus not found", async () => {
        const busId = "nonexistent";
        const driverId = "driver1";
        const populate = jest.fn().mockResolvedValue(null);
        (Bus.findByIdAndUpdate as jest.Mock).mockReturnValue({ populate });
  
        await expect(busService.assignDriver(busId, driverId)).rejects.toThrow("Bus not found");
      });
  });

  describe("updateBus", () => {
    it("should update a bus successfully", async () => {
        const busId = "bus1";
        const busData = { name: "Updated Bus", number: "B2", capacity: 60 };
        const updatedBus = { _id: busId, ...busData };
        const populate = jest.fn().mockResolvedValue(updatedBus);
        (Bus.findByIdAndUpdate as jest.Mock).mockReturnValue({ populate });

        const result = await busService.updateBus(busId, busData);

        expect(Bus.findByIdAndUpdate).toHaveBeenCalled();
        expect(populate).toHaveBeenCalledWith("assignedDriver");
        expect(result).toEqual(updatedBus);
    });

    it("should throw an error if bus to update is not found", async () => {
        const busId = "nonexistent";
        const busData = { name: "Updated Bus", number: "B2", capacity: 60 };
        const populate = jest.fn().mockResolvedValue(null);
        (Bus.findByIdAndUpdate as jest.Mock).mockReturnValue({ populate });

        await expect(busService.updateBus(busId, busData)).rejects.toThrow("Bus not found");
    });
  });

  describe("deleteBus", () => {
    it("should delete a bus successfully", async () => {
        const busId = "bus1";
        (Bus.findByIdAndDelete as jest.Mock).mockResolvedValue({ _id: busId });

        const result = await busService.deleteBus(busId);

        expect(Bus.findByIdAndDelete).toHaveBeenCalledWith(busId);
        expect(result).toEqual({ _id: busId });
    });

    it("should throw an error if bus to delete is not found", async () => {
        const busId = "nonexistent";
        (Bus.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

        await expect(busService.deleteBus(busId)).rejects.toThrow("Bus not found");
    });
  });
});
