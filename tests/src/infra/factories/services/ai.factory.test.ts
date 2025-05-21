import { AppConfig } from "../../../../../src/infra/config";
import { makeAxiosHttpClient } from "../../../../../src/infra/factories/http/axiosHttpClient.factory";
import { makeAiService } from "../../../../../src/infra/factories/services/ai.factory";
import { AiServiceImpl } from "../../../../../src/infra/services/aiImpl.service";

jest.mock(
  "../../../../../src/infra/factories/http/axiosHttpClient.factory",
  () => ({
    makeAxiosHttpClient: jest.fn(),
  }),
);

jest.mock("../../../../../src/infra/config", () => ({
  AppConfig: {
    BASE_URL_AI_SERVICE: "http://mock-base-url.com",
    AI_SERVICE_KEY: "mock-ai-service-key",
  },
}));

describe("makeAiService", () => {
  it("should return the AiServiceImpl instance", () => {
    // Arrange
    const mockHttpClient = { get: jest.fn(), post: jest.fn() }; // Mock do cliente HTTP
    (makeAxiosHttpClient as jest.Mock).mockReturnValue(mockHttpClient);

    // Act
    const aiService = makeAiService();

    // Assert
    expect(aiService).toBeInstanceOf(AiServiceImpl);
  });

  it("should pass the correct params to AiServiceImpl constructor", () => {
    // Arrange
    const mockHttpClient = {
      get: jest.fn(),
      post: jest.fn(),
      request: jest.fn(),
    }; // Mock do cliente HTTP
    (makeAxiosHttpClient as jest.Mock).mockReturnValue(mockHttpClient);

    // Act
    const aiService = makeAiService();

    // Assert
    expect(makeAxiosHttpClient).toHaveBeenCalled();
    expect(aiService).toEqual(
      new AiServiceImpl(
        mockHttpClient,
        AppConfig.BASE_URL_AI_SERVICE,
        AppConfig.AI_SERVICE_KEY,
      ),
    );
  });
});
