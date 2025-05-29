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

  beforeEach(() => {
    // Setup do mock do HttpClient
    mockHttpClient = {
      request: jest.fn().mockResolvedValue({ statusCode: 200 }),
    };

    // Mock do Date.now para ter timestamps consistentes
    jest.spyOn(Date, "now").mockImplementation(() => 1590711600000); // timestamp fixo

    // Instância do serviço para cada teste
    loggerService = new LoggerServiceImpl(mockHttpClient, baseUrl, apiKey);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("info", () => {
    it("should add INFO log to buffer with correct format", async () => {
      // Arrange
      const description = "Test info log";
      const metadata = { key: "value" };

      // Act
      await loggerService.info(description, { metadata });

      // Assert
      const expectedTimestamp = (
        Math.floor(Date.now() / 1000) * 1000000000
      ).toString();
      expect(loggerService["_logsBuffer"]).toHaveLength(1);
      expect(loggerService["_logsBuffer"][0]).toEqual([
        expectedTimestamp,
        JSON.stringify({
          description,
          type: LoggerTypeEnum.INFO,
          ...metadata,
        }),
      ]);
    });
  });

  describe("warn", () => {
    it("should add WARN log to buffer with correct format", async () => {
      // Arrange
      const description = "Test warn log";
      const metadata = { key: "value" };

      // Act
      await loggerService.warn(description, { metadata });

      // Assert
      const expectedTimestamp = (
        Math.floor(Date.now() / 1000) * 1000000000
      ).toString();
      expect(loggerService["_logsBuffer"]).toHaveLength(1);
      expect(loggerService["_logsBuffer"][0]).toEqual([
        expectedTimestamp,
        JSON.stringify({
          description,
          type: LoggerTypeEnum.WARN,
          ...metadata,
        }),
      ]);
    });
  });

  describe("error", () => {
    it("should add ERROR log to buffer with correct format", async () => {
      // Arrange
      const description = "Test error log";
      const metadata = { key: "value" };

      // Act
      await loggerService.error(description, { metadata });

      // Assert
      const expectedTimestamp = (
        Math.floor(Date.now() / 1000) * 1000000000
      ).toString();
      expect(loggerService["_logsBuffer"]).toHaveLength(1);
      expect(loggerService["_logsBuffer"][0]).toEqual([
        expectedTimestamp,
        JSON.stringify({
          description,
          type: LoggerTypeEnum.ERROR,
          ...metadata,
        }),
      ]);
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
    it("should format log with correct structure", () => {
      // Arrange
      const input = {
        description: "Test log",
        type: LoggerTypeEnum.INFO,
        metadata: { key: "value" },
      };

      // Act
      const result = loggerService["_formatLogger"](input);

      // Assert
      const expectedTimestamp = (
        Math.floor(Date.now() / 1000) * 1000000000
      ).toString();
      expect(result).toEqual([
        expectedTimestamp,
        JSON.stringify({
          description: input.description,
          type: input.type,
          ...input.metadata,
        }),
      ]);
    });
  });

  describe("send", () => {
    it("should send logs to grafana in PROD environment", async () => {
      // Arrange
      const labels = { app: "test-app" };
      const description = "Test log";
      loggerService.setLabels(labels);
      await loggerService.info(description);

      // Act
      await loggerService.send();

      // Assert
      expect(mockHttpClient.request).toHaveBeenCalledWith({
        url: baseUrl,
        method: "post",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: {
          streams: [
            {
              stream: labels,
              values: loggerService["_logsBuffer"],
            },
          ],
        },
      });
    });

    it("should not send logs in non-PROD environment", async () => {
      // Arrange
      (AppConfig.NODE_ENV as any) = NodeEnvEnum.DEV;
      await loggerService.info("Test log");

      // Act
      await loggerService.send();

      // Assert
      expect(mockHttpClient.request).not.toHaveBeenCalled();
    });

    it("should handle multiple logs in buffer", async () => {
      // Arrange
      const labels = { app: "test-app" };
      loggerService.setLabels(labels);
      await loggerService.info("Log 1");
      await loggerService.warn("Log 2");
      await loggerService.error("Log 3");

      // Act
      await loggerService.send();

      // Assert
      const expectedTimestamp = (
        Math.floor(Date.now() / 1000) * 1000000000
      ).toString();
      const expectedValues = [
        [
          expectedTimestamp,
          JSON.stringify({ description: "Log 1", type: LoggerTypeEnum.INFO }),
        ],
        [
          expectedTimestamp,
          JSON.stringify({ description: "Log 2", type: LoggerTypeEnum.WARN }),
        ],
        [
          expectedTimestamp,
          JSON.stringify({ description: "Log 3", type: LoggerTypeEnum.ERROR }),
        ],
      ];

      // Check aditional buffer
      expect(loggerService["_logsBuffer"]).toEqual(expectedValues);
    });
  });
});
