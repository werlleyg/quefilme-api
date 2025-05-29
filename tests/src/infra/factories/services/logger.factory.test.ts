import { LoggerServiceImpl } from "../../../../../src/infra/services/loggerImpl.service";
import { makeAxiosHttpClient } from "../../../../../src/infra/factories/http/axiosHttpClient.factory";
import {
  LoggerServiceFactory,
  makeLoggerService,
} from "../../../../../src//infra/factories/services/logger.factory";
import { AppConfig } from "../../../../../src//infra/config";
import { LoggerService } from "../../../../../src//domain/services";

// Mocks
jest.mock("../../../../../src/infra/factories/http/axiosHttpClient.factory");
jest.mock("../../../../../src/infra/services/loggerImpl.service");
jest.mock("../../../../../src/infra/config", () => ({
  AppConfig: {
    GRAFANA_URL: "http://mock-grafana.url",
    GRAFANA_API_KEY: "mock-api-key",
  },
}));

describe("LoggerServiceFactory", () => {
  let mockAxiosClient: any;

  beforeEach(() => {
    jest.clearAllMocks();

    // Reset singleton instance
    (LoggerServiceFactory as any).instance = undefined;

    // Setup mock axios client
    mockAxiosClient = {
      request: jest.fn().mockResolvedValue({ statusCode: 200 }),
    };
    (makeAxiosHttpClient as jest.Mock).mockReturnValue(mockAxiosClient);

    // Setup LoggerServiceImpl mock
    (LoggerServiceImpl as jest.Mock).mockImplementation(function (this: any) {
      this.info = jest.fn();
      this.error = jest.fn();
      this.warn = jest.fn();
      this.setLabels = jest.fn();
      return this;
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("getInstance", () => {
    it("should create a new instance when none exists", () => {
      // Act
      const instance = makeLoggerService();

      // Assert
      expect(instance).toBeTruthy();
      expect(LoggerServiceImpl).toHaveBeenCalledWith(
        mockAxiosClient,
        AppConfig.GRAFANA_URL,
        AppConfig.GRAFANA_API_KEY,
      );
      expect(makeAxiosHttpClient).toHaveBeenCalledTimes(1);
    });

    it("should return existing instance on subsequent calls", () => {
      // Act
      const firstInstance = makeLoggerService();
      const secondInstance = makeLoggerService();

      // Assert
      expect(firstInstance).toBe(secondInstance);
      expect(LoggerServiceImpl).toHaveBeenCalledTimes(1);
      expect(makeAxiosHttpClient).toHaveBeenCalledTimes(1);
    });

    it("should create instance with correct configuration", () => {
      // Act
      makeLoggerService();

      // Assert
      expect(LoggerServiceImpl).toHaveBeenCalledWith(
        mockAxiosClient,
        "http://mock-grafana.url",
        "mock-api-key",
      );
    });

    it("should maintain singleton instance across multiple imports", () => {
      // Act
      const instance1 = makeLoggerService();
      const instance2 = makeLoggerService();

      // Assert
      expect(instance1).toBe(instance2);
      expect(LoggerServiceImpl).toHaveBeenCalledTimes(1);
    });

    it("should handle error in instance creation gracefully", () => {
      // Arrange
      const error = new Error("Failed to initialize logger");
      (LoggerServiceImpl as jest.Mock).mockImplementationOnce(() => {
        throw error;
      });

      // Act & Assert
      expect(() => makeLoggerService()).toThrow(error);
    });
  });

  describe("makeLoggerService", () => {
    it("should expose a function that returns the singleton instance", () => {
      // Act
      const instance = makeLoggerService();

      // Assert
      expect(instance).toBeTruthy();
      expect(typeof makeLoggerService).toBe("function");
    });

    it("should always return the same instance", () => {
      // Act
      const results = new Set();
      for (let i = 0; i < 5; i++) {
        results.add(makeLoggerService());
      }

      // Assert
      expect(results.size).toBe(1);
      expect(LoggerServiceImpl).toHaveBeenCalledTimes(1);
    });

    it("should initialize logger with required methods", () => {
      // Act
      const logger = makeLoggerService();

      // Assert
      expect(logger.info).toBeDefined();
      expect(logger.error).toBeDefined();
      expect(logger.warn).toBeDefined();
      expect(logger.setLabels).toBeDefined();
    });
  });
});
