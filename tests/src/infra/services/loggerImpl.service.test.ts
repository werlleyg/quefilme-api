import { LoggerTypeEnum } from "../../../../src/domain/enums";
import { HttpClient } from "../../../../src/domain/protocols/http";
import { AppConfig, NodeEnvEnum } from "../../../../src/infra/config";
import { LoggerServiceImpl } from "../../../../src/infra/services/loggerImpl.service";

// Mock do AppConfig
jest.mock("../../../../src/infra/config", () => ({
  AppConfig: {
    NODE_ENV: "PROD",
  },
  NodeEnvEnum: {
    PROD: "PROD",
    DEV: "DEV",
  },
}));

describe("LoggerServiceImpl", () => {
  let loggerService: LoggerServiceImpl;
  let mockHttpClient: jest.Mocked<HttpClient>;
  const baseUrl = "http://mock-grafana.url";
  const apiKey = "mock-api-key";
  let consoleInfoSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;
  let addLogSpy: jest.SpyInstance;

  beforeEach(() => {
    // Setup do mock do HttpClient
    mockHttpClient = {
      request: jest.fn().mockResolvedValue({ statusCode: 200 }),
    };

    // Mock do console.info e console.error
    consoleInfoSpy = jest.spyOn(console, "info").mockImplementation();
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

    // Mock do Date.now para ter timestamps consistentes
    jest.spyOn(Date, "now").mockImplementation(() => 1590711600000); // timestamp fixo

    // Instância do serviço para cada teste
    loggerService = new LoggerServiceImpl(mockHttpClient, baseUrl, apiKey);

    // Spy no método _addLog
    addLogSpy = jest.spyOn(loggerService as any, "_addLog");
  });

  afterEach(() => {
    jest.restoreAllMocks();
    consoleInfoSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  describe("info", () => {
    it("should call _addLog with INFO log format", async () => {
      // Arrange
      const description = "Test info log";
      const metadata = { key: "value" };
      const expectedTimestamp = (
        Math.floor(Date.now() / 1000) * 1000000000
      ).toString();
      const expectedLog = [
        expectedTimestamp,
        JSON.stringify({
          description,
          type: LoggerTypeEnum.INFO,
          ...metadata,
        }),
      ];

      // Act
      await loggerService.info(description, { metadata });

      // Assert
      expect(addLogSpy).toHaveBeenCalledWith(expectedLog);
    });
  });

  describe("warn", () => {
    it("should call _addLog with WARN log format", async () => {
      // Arrange
      const description = "Test warn log";
      const metadata = { key: "value" };
      const expectedTimestamp = (
        Math.floor(Date.now() / 1000) * 1000000000
      ).toString();
      const expectedLog = [
        expectedTimestamp,
        JSON.stringify({
          description,
          type: LoggerTypeEnum.WARN,
          ...metadata,
        }),
      ];

      // Act
      await loggerService.warn(description, { metadata });

      // Assert
      expect(addLogSpy).toHaveBeenCalledWith(expectedLog);
    });
  });

  describe("error", () => {
    it("should call _addLog with ERROR log format", async () => {
      // Arrange
      const description = "Test error log";
      const metadata = { key: "value" };
      const expectedTimestamp = (
        Math.floor(Date.now() / 1000) * 1000000000
      ).toString();
      const expectedLog = [
        expectedTimestamp,
        JSON.stringify({
          description,
          type: LoggerTypeEnum.ERROR,
          ...metadata,
        }),
      ];

      // Act
      await loggerService.error(description, { metadata });

      // Assert
      expect(addLogSpy).toHaveBeenCalledWith(expectedLog);
    });
  });

  describe("setLabels", () => {
    it("should set labels correctly", () => {
      // Arrange
      const labels = { app: "test-app", env: "prod" };

      // Act
      loggerService.setLabels(labels);

      // Assert
      expect(loggerService["_labels"]).toEqual(labels);
    });

    it("should override existing labels", () => {
      // Arrange
      const initialLabels = { app: "test-app" };
      const newLabels = { app: "new-app", env: "prod" };

      // Act
      loggerService.setLabels(initialLabels);
      loggerService.setLabels(newLabels);

      // Assert
      expect(loggerService["_labels"]).toEqual(newLabels);
    });
  });

  describe("_formatLogger", () => {
    it("should create log entry with correct format", () => {
      // Arrange
      const description = "Test log";
      const type = LoggerTypeEnum.INFO;
      const metadata = { key: "value" };

      // Act
      const result = loggerService["_formatLogger"]({
        description,
        type,
        metadata,
      });

      // Assert
      const expectedTimestamp = (
        Math.floor(Date.now() / 1000) * 1000000000
      ).toString();
      expect(result).toBeInstanceOf(Array);
      expect(result).toHaveLength(2);
      expect(result[0]).toBe(expectedTimestamp);
      expect(typeof result[1]).toBe("string");

      const parsedLog = JSON.parse(result[1] as string);
      expect(parsedLog).toEqual({
        description,
        type,
        key: "value",
      });
    });

    it("should handle log without metadata", () => {
      // Arrange
      const description = "Test log";
      const type = LoggerTypeEnum.INFO;

      // Act
      const result = loggerService["_formatLogger"]({
        description,
        type,
      });

      // Assert
      expect(result).toBeInstanceOf(Array);
      expect(result).toHaveLength(2);
      const parsedLog = JSON.parse(result[1] as string);
      expect(parsedLog).toEqual({
        description,
        type,
      });
    });
  });

  describe("integration tests", () => {
    it("should successfully send logs in PROD environment", async () => {
      // Arrange
      const labels = { app: "test-app" };
      loggerService.setLabels(labels);

      // Act
      await loggerService.info("Test message");

      // Assert
      expect(mockHttpClient.request).toHaveBeenCalledWith(
        expect.objectContaining({
          url: baseUrl,
          method: "post",
          headers: expect.objectContaining({
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          }),
        }),
      );
      expect(consoleInfoSpy).toHaveBeenCalled();
    });

    it("should skip sending logs in non-PROD environment", async () => {
      // Arrange
      (AppConfig.NODE_ENV as any) = NodeEnvEnum.DEV;

      // Act
      await loggerService.info("Test message");

      // Assert
      expect(mockHttpClient.request).not.toHaveBeenCalled();
      expect(consoleInfoSpy).toHaveBeenCalled();
    });

    it("should include labels and metadata in logs", async () => {
      // Arrange
      const labels = { app: "test-app", env: "test" };
      const metadata = { userId: "123", action: "login" };
      loggerService.setLabels(labels);

      // Act
      await loggerService.info("Test message", { metadata });

      // Assert
      const consoleCall = consoleInfoSpy.mock.calls[0][0];
      const logData = JSON.parse(consoleCall);

      expect(logData.streams[0].stream).toEqual(labels);
      expect(JSON.parse(logData.streams[0].values[0][1])).toMatchObject(
        expect.objectContaining({
          userId: "123",
          action: "login",
        }),
      );
    });

    it("should properly handle different log levels", async () => {
      // Act
      await Promise.all([
        loggerService.info("Info message"),
        loggerService.warn("Warning message"),
        loggerService.error("Error message"),
      ]);

      // Assert
      const calls = consoleInfoSpy.mock.calls;
      const logs = calls
        .map((call) => JSON.parse(call[0]).streams[0].values[0][1])
        .map((log) => JSON.parse(log));

      expect(logs).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ type: LoggerTypeEnum.INFO }),
          expect.objectContaining({ type: LoggerTypeEnum.WARN }),
          expect.objectContaining({ type: LoggerTypeEnum.ERROR }),
        ]),
      );
    });
  });

  describe("_formatLogger", () => {
    it("should generate correct timestamp", () => {
      // Arrange
      const input = {
        description: "Test log",
        type: LoggerTypeEnum.INFO,
      };

      // Act
      const result = loggerService["_formatLogger"](input);

      // Assert
      const expectedTimestamp = (
        Math.floor(Date.now() / 1000) * 1000000000
      ).toString();
      expect(result[0]).toBe(expectedTimestamp);
    });

    it("should properly format metadata", () => {
      // Arrange
      const metadata = {
        user: "test",
        action: "login",
        status: "success",
      };
      const input = {
        description: "Test log",
        type: LoggerTypeEnum.INFO,
        metadata,
      };

      // Act
      const result = loggerService["_formatLogger"](input);

      // Assert
      const parsedLog = JSON.parse(result[1]);
      expect(parsedLog).toEqual(
        expect.objectContaining({
          description: input.description,
          type: input.type,
          ...metadata,
        }),
      );
    });
  });
});
