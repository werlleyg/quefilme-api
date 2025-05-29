import { Request, Response } from "express";
import { HealthCheckerController } from "../../../../src/api/controllers/healthChecker.controller";
import { makeHealthCheckerUsecase } from "../../../../src/infra/factories/usecases/healthChecker.factory";
import { makeLoggerService } from "../../../../src/infra/factories/services/logger.factory";

jest.mock("../../../../src/infra/factories/usecases/healthChecker.factory");
jest.mock("../../../../src/infra/factories/services/logger.factory");

describe("CheckHealthController", () => {
  let checkHealthController: HealthCheckerController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockLoggerService: any;

  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Setup controller
    checkHealthController = new HealthCheckerController();

    // Setup request mock
    mockRequest = {
      method: "GET",
      baseUrl: "/health",
      ip: "127.0.0.1",
      headers: {
        "user-agent": "test-agent",
      },
      body: {},
      params: {},
      query: {},
    };

    // Setup response mock - Correção aqui
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockImplementation((data) => ({ status: 200, ...data })), // Retorna um objeto com status
    };

    // Setup logger mock
    mockLoggerService = {
      info: jest.fn().mockResolvedValue(undefined),
      error: jest.fn().mockResolvedValue(undefined),
    };
    (makeLoggerService as jest.Mock).mockReturnValue(mockLoggerService);
  });

  it("should return a 200 status with the health check message", async () => {
    // Arrange
    const mockExec = jest.fn().mockResolvedValue({ status: "API is working" });
    (makeHealthCheckerUsecase as jest.Mock).mockReturnValue({ exec: mockExec });

    // Act
    await checkHealthController.healthChecker(
      mockRequest as Request,
      mockResponse as Response,
    );

    // Assert
    expect(makeHealthCheckerUsecase).toHaveBeenCalled();
    expect(mockExec).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: "API is working",
    });

    // Verify logger calls
    expect(mockLoggerService.info).toHaveBeenCalledTimes(2);
    expect(mockLoggerService.info).toHaveBeenNthCalledWith(
      1,
      "REQUEST_STARTED",
      expect.any(Object),
    );
    expect(mockLoggerService.info).toHaveBeenNthCalledWith(
      2,
      "REQUEST_COMPLETED",
      expect.any(Object),
    );
  });

  it("should handle errors and log them properly", async () => {
    // Arrange
    const error = new Error("Something went wrong");
    const mockExec = jest.fn().mockRejectedValue(error);
    (makeHealthCheckerUsecase as jest.Mock).mockReturnValue({ exec: mockExec });

    // Act & Assert
    await expect(
      checkHealthController.healthChecker(
        mockRequest as Request,
        mockResponse as Response,
      ),
    ).rejects.toThrow("Something went wrong");

    // Verify service calls
    expect(makeHealthCheckerUsecase).toHaveBeenCalled();
    expect(mockExec).toHaveBeenCalled();

    // Verify logger calls
    expect(mockLoggerService.info).toHaveBeenCalledTimes(1);
    expect(mockLoggerService.info).toHaveBeenCalledWith(
      "REQUEST_STARTED",
      expect.any(Object),
    );
    expect(mockLoggerService.error).toHaveBeenCalledTimes(1);
    expect(mockLoggerService.error).toHaveBeenCalledWith(
      "REQUEST_ERROR",
      expect.any(Object),
    );
  });

  it("should include proper metadata in logger calls", async () => {
    // Arrange
    const mockExec = jest.fn().mockResolvedValue({ status: "API is working" });
    (makeHealthCheckerUsecase as jest.Mock).mockReturnValue({ exec: mockExec });

    // Act
    await checkHealthController.healthChecker(
      mockRequest as Request,
      mockResponse as Response,
    );

    // Assert logger metadata
    const loggerCalls = mockLoggerService.info.mock.calls;

    // Verify completion log
    expect(loggerCalls[1][1]).toMatchObject({
      metadata: expect.objectContaining({
        controller: "HealthCheckerController",
        method: "healthChecker",
        path: "/health",
        event: "REQUEST_COMPLETED",
        executionTime: expect.any(Number),
        statusCode: "API is working",
      }),
    });
  });
});
