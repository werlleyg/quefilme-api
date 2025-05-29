import { Request, Response, NextFunction } from "express";
import { makeLoggerService } from "../../../../src/infra/factories/services/logger.factory";
import { AppConfig } from "../../../../src/infra/config";
import { LoggerService } from "../../../../src/domain/services";
import { loggerInterceptor } from "../../../../src/infra/interceptors/logger.interceptor";

// Mocks
jest.mock("../../../../src/infra/factories/services/logger.factory");
jest.mock("../../../../src/infra/config", () => ({
  AppConfig: {
    APP_NAME: "test-app",
    NODE_ENV: "test",
  },
}));

describe("loggerInterceptor", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;
  let mockLoggerService: jest.Mocked<LoggerService>;
  let mockEventEmitter: { emit: jest.Mock };

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock do LoggerService
    mockLoggerService = {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      setLabels: jest.fn(),
      send: jest.fn().mockResolvedValue(null),
    };
    (makeLoggerService as jest.Mock).mockReturnValue(mockLoggerService);

    // Mock do Request
    mockRequest = {
      method: "GET",
      baseUrl: "/test",
      path: "/test",
      headers: {},
    };

    // Mock do Response com EventEmitter
    mockEventEmitter = {
      emit: jest.fn(),
    };
    mockResponse = {
      on: jest.fn().mockImplementation((event, callback) => {
        if (event === "finish") {
          // Armazena o callback para poder chamá-lo nos testes
          (mockEventEmitter.emit as jest.Mock).mockImplementation(() =>
            callback(),
          );
        }
        return mockResponse;
      }),
    };

    // Mock do Next
    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should create logger service instance", () => {
    // Act
    loggerInterceptor(
      mockRequest as Request,
      mockResponse as Response,
      mockNext,
    );

    // Assert
    expect(makeLoggerService).toHaveBeenCalledTimes(1);
  });

  it("should set correct labels", () => {
    // Act
    loggerInterceptor(
      mockRequest as Request,
      mockResponse as Response,
      mockNext,
    );

    // Assert
    expect(mockLoggerService.setLabels).toHaveBeenCalledWith({
      app: AppConfig.APP_NAME,
      environment: AppConfig.NODE_ENV,
      method: mockRequest.method,
      path: mockRequest.baseUrl,
    });
  });

  it("should register finish event listener", () => {
    // Act
    loggerInterceptor(
      mockRequest as Request,
      mockResponse as Response,
      mockNext,
    );

    // Assert
    expect(mockResponse.on).toHaveBeenCalledWith(
      "finish",
      expect.any(Function),
    );
  });

  it("should call next middleware", () => {
    // Act
    loggerInterceptor(
      mockRequest as Request,
      mockResponse as Response,
      mockNext,
    );

    // Assert
    expect(mockNext).toHaveBeenCalledTimes(1);
  });

  it("should send logs when request finishes", async () => {
    // Arrange
    loggerInterceptor(
      mockRequest as Request,
      mockResponse as Response,
      mockNext,
    );

    // Act
    await mockEventEmitter.emit();

    // Assert
    expect(mockLoggerService.send).toHaveBeenCalledTimes(1);
  });

  it("should handle different HTTP methods", () => {
    // Arrange
    const methods = ["GET", "POST", "PUT", "DELETE", "PATCH"];

    methods.forEach((method) => {
      mockRequest.method = method;

      // Act
      loggerInterceptor(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      // Assert
      expect(mockLoggerService.setLabels).toHaveBeenCalledWith(
        expect.objectContaining({
          method: method,
        }),
      );
    });
  });

  it("should handle empty baseUrl", () => {
    // Arrange
    mockRequest.baseUrl = "";

    // Act
    loggerInterceptor(
      mockRequest as Request,
      mockResponse as Response,
      mockNext,
    );

    // Assert
    expect(mockLoggerService.setLabels).toHaveBeenCalledWith(
      expect.objectContaining({
        path: "",
      }),
    );
  });

  describe("Integration with LoggerService", () => {
    it("should maintain proper execution order", async () => {
      // Arrange
      const executionOrder: string[] = [];

      mockLoggerService.setLabels.mockImplementation(() => {
        executionOrder.push("setLabels");
      });

      mockLoggerService.send.mockImplementation(async () => {
        executionOrder.push("send");
        return null;
      });

      mockNext.mockImplementation(() => {
        executionOrder.push("next");
      });

      // Act
      loggerInterceptor(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );
      await mockEventEmitter.emit();

      // Assert
      expect(executionOrder).toEqual(["setLabels", "next", "send"]);
    });
  });
});
