import { Request, Response } from "express";
import { HealthCheckerController } from "../../../../src/api/controllers/healthChecker.controller";
import { makeHealthCheckerUsecase } from "../../../../src/infra/factories/usecases/healthChecker.factory";

jest.mock("../../../../src/infra/factories/usecases/healthChecker.factory");

describe("CheckHealthController", () => {
  let checkHealthController: HealthCheckerController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    checkHealthController = new HealthCheckerController();
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("should return a 200 status with the health check message", async () => {
    const mockExec = jest.fn().mockResolvedValue({ status: "API is working" });
    (makeHealthCheckerUsecase as jest.Mock).mockReturnValue({ exec: mockExec });

    await checkHealthController.healthChecker(
      mockRequest as Request,
      mockResponse as Response,
    );

    expect(makeHealthCheckerUsecase).toHaveBeenCalled();
    expect(mockExec).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: "API is working",
    });
  });

  it("should handle errors and not crash", async () => {
    const mockExec = jest
      .fn()
      .mockRejectedValue(new Error("Something went wrong"));
    (makeHealthCheckerUsecase as jest.Mock).mockReturnValue({ exec: mockExec });

    await expect(
      checkHealthController.healthChecker(
        mockRequest as Request,
        mockResponse as Response,
      ),
    ).rejects.toThrow("Something went wrong");

    expect(makeHealthCheckerUsecase).toHaveBeenCalled();
    expect(mockExec).toHaveBeenCalled();
  });
});
