import { Request, Response, NextFunction } from "express";
import { makeLoggerService } from "../../../../src/infra/factories/services/logger.factory";
import { AppConfig } from "../../../../src/infra/config";
import { LoggerService } from "../../../../src/domain/services";
import { observabilityInterceptor } from "../../../../src/infra/interceptors/observability.interceptor";
import { request } from "http";

// Mocks
jest.mock("../../../../src/infra/factories/services/logger.factory");
jest.mock("../../../../src/infra/config", () => ({
  AppConfig: {
    APP_NAME: "test-app",
    NODE_ENV: "test",
  },
}));

describe("observabilityInterceptor", () => {
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
    };
    (makeLoggerService as jest.Mock).mockReturnValue(mockLoggerService);

    // Mock do Request
    mockRequest = {
      method: "GET",
      baseUrl: "/test",
      path: "/test",
      headers: {
        "x-request-id": "12345",
      } as Record<string, string>,
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
    observabilityInterceptor(
      mockRequest as Request,
      mockResponse as Response,
      mockNext,
    );

    // Assert
    expect(makeLoggerService).toHaveBeenCalledTimes(1);
  });

  it("should set correct labels", () => {
    // Act
    observabilityInterceptor(
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
      requestId: mockRequest?.headers?.["x-request-id"],
    });
  });

  it("should call next middleware", () => {
    // Act
    observabilityInterceptor(
      mockRequest as Request,
      mockResponse as Response,
      mockNext,
    );

    // Assert
    expect(mockNext).toHaveBeenCalledTimes(1);
  });

  it("should handle different HTTP methods", () => {
    // Arrange
    const methods = ["GET", "POST", "PUT", "DELETE", "PATCH"];

    methods.forEach((method) => {
      mockRequest.method = method;

      // Act
      observabilityInterceptor(
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
    observabilityInterceptor(
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

      mockNext.mockImplementation(() => {
        executionOrder.push("next");
      });

      // Act
      observabilityInterceptor(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );
      await mockEventEmitter.emit();

      // Assert
      expect(executionOrder).toEqual(["setLabels", "next"]);
    });
  });

  describe("Error scenarios", () => {
    it("should generate uuid when x-request-id is not present", () => {
      // Arrange
      mockRequest.headers = {};

      // Act
      observabilityInterceptor(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      // Assert
      expect(mockLoggerService.setLabels).toHaveBeenCalledWith(
        expect.objectContaining({
          requestId: expect.any(String),
        }),
      );
    });

    it("should handle undefined app configs", () => {
      // Arrange
      const originalAppName = AppConfig.APP_NAME;
      const originalNodeEnv = AppConfig.NODE_ENV;
      (AppConfig as any).APP_NAME = undefined;
      (AppConfig as any).NODE_ENV = undefined;

      // Act
      observabilityInterceptor(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      // Assert
      expect(mockLoggerService.setLabels).toHaveBeenCalledWith(
        expect.objectContaining({
          app: undefined,
          environment: undefined,
        }),
      );

      // Restore
      (AppConfig as any).APP_NAME = originalAppName;
      (AppConfig as any).NODE_ENV = originalNodeEnv;
    });

    it("should throw error when request is undefined", () => {
      // Act & Assert
      expect(() =>
        observabilityInterceptor(
          undefined as unknown as Request,
          mockResponse as Response,
          mockNext,
        ),
      ).toThrow();
    });

    it("should generate new uuid when x-request-id is empty", () => {
      // Arrange
      mockRequest.headers = { "x-request-id": "" };

      // Act
      observabilityInterceptor(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      // Assert
      expect(mockLoggerService.setLabels).toHaveBeenCalledWith(
        expect.objectContaining({
          requestId: expect.stringMatching(
            /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
          ),
        }),
      );
    });

    it("should handle undefined request properties", () => {
      // Arrange
      mockRequest = {
        method: undefined,
        baseUrl: undefined,
        path: undefined,
        headers: {},
      };

      // Act
      observabilityInterceptor(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      // Assert
      expect(mockLoggerService.setLabels).toHaveBeenCalledWith({
        app: AppConfig.APP_NAME,
        environment: AppConfig.NODE_ENV,
        method: undefined,
        path: undefined,
        requestId: expect.any(String),
      });
      expect(mockNext).toHaveBeenCalled();
    });

    it("should handle request with minimal properties", () => {
      // Arrange
      mockRequest = {
        headers: {},
      };

      // Act
      observabilityInterceptor(
        mockRequest as unknown as Request,
        mockResponse as Response,
        mockNext,
      );

      // Assert
      expect(mockLoggerService.setLabels).toHaveBeenCalledWith({
        app: AppConfig.APP_NAME,
        environment: AppConfig.NODE_ENV,
        method: undefined,
        path: undefined,
        requestId: expect.any(String),
      });
      expect(mockNext).toHaveBeenCalled();
    });

    it("should handle empty headers object", () => {
      // Arrange
      mockRequest.headers = {};

      // Act
      observabilityInterceptor(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      // Assert
      expect(mockLoggerService.setLabels).toHaveBeenCalledWith(
        expect.objectContaining({
          requestId: expect.stringMatching(
            /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
          ),
        }),
      );
    });

    it("should handle undefined response object", () => {
      // Act & Assert
      expect(() =>
        observabilityInterceptor(
          mockRequest as Request,
          undefined as unknown as Response,
          mockNext,
        ),
      ).not.toThrow();
      expect(mockNext).toHaveBeenCalled();
    });

    it("should handle undefined APP_NAME", () => {
      // Arrange
      const originalAppName = AppConfig.APP_NAME;
      (AppConfig as any).APP_NAME = undefined;

      // Act
      observabilityInterceptor(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      // Assert
      expect(mockLoggerService.setLabels).toHaveBeenCalledWith(
        expect.objectContaining({
          app: undefined,
        }),
      );

      // Restore
      (AppConfig as any).APP_NAME = originalAppName;
    });

    it("should handle undefined NODE_ENV", () => {
      // Arrange
      const originalNodeEnv = AppConfig.NODE_ENV;
      (AppConfig as any).NODE_ENV = undefined;

      // Act
      observabilityInterceptor(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      // Assert
      expect(mockLoggerService.setLabels).toHaveBeenCalledWith(
        expect.objectContaining({
          environment: undefined,
        }),
      );

      // Restore
      (AppConfig as any).NODE_ENV = originalNodeEnv;
    });

    it("should handle error in makeLoggerService", () => {
      // Arrange
      (makeLoggerService as jest.Mock).mockImplementationOnce(() => {
        throw new Error("Service error");
      });

      // Act & Assert
      expect(() =>
        observabilityInterceptor(
          mockRequest as Request,
          mockResponse as Response,
          mockNext,
        ),
      ).toThrow("Service error");
    });

    it("should handle error in setLabels", () => {
      // Arrange
      mockLoggerService.setLabels.mockImplementationOnce(() => {
        throw new Error("Labels error");
      });

      // Act & Assert
      expect(() =>
        observabilityInterceptor(
          mockRequest as Request,
          mockResponse as Response,
          mockNext,
        ),
      ).toThrow("Labels error");
    });
  });
});
