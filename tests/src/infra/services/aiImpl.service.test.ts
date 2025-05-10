import {
  HttpClient,
  HttpResponse,
} from "../../../../src/domain/protocols/http";
import { AiServiceImpl } from "../../../../src/infra/services/aiImpl.service";
import { ResponseHandler } from "../../../../src/infra/shared/responseHandler.shared";

jest.mock("../../../../src/infra/shared/responseHandler.shared");

describe("AiServiceImpl", () => {
  const mockHttpClient: jest.Mocked<HttpClient> = {
    request: jest.fn(),
  };

  const baseUrl = "https://api.example.com";
  const apiKey = "test-api-key";
  const aiService = new AiServiceImpl(mockHttpClient, baseUrl, apiKey);

  const prompt = "Test prompt";
  const mockResponse: HttpResponse = {
    statusCode: 200,
    body: { data: "mocked response" },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should send a request with the correct structure and return the processed response", async () => {
    mockHttpClient.request.mockResolvedValueOnce(mockResponse);
    (ResponseHandler as jest.Mock).mockReturnValueOnce("processed response");

    const result = await aiService.generateResponse(prompt);

    expect(mockHttpClient.request).toHaveBeenCalledWith({
      url: baseUrl,
      method: "post",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: {
        model: "deepseek/deepseek-r1-zero:free",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      },
    });

    expect(ResponseHandler).toHaveBeenCalledWith(mockResponse);
    expect(result).toBe("processed response");
  });

  it("should throw an error if the httpClient request fails", async () => {
    const error = new Error("Request failed");
    mockHttpClient.request.mockRejectedValueOnce(error);

    await expect(aiService.generateResponse(prompt)).rejects.toThrow(
      error.message,
    );

    expect(mockHttpClient.request).toHaveBeenCalledWith({
      url: baseUrl,
      method: "post",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: {
        model: "deepseek/deepseek-r1-zero:free",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      },
    });
  });

  it("should log an error message when an exception occurs", async () => {
    const error = new Error("Request failed");
    mockHttpClient.request.mockRejectedValueOnce(error);
    const consoleSpy = jest.spyOn(console, "log").mockImplementation();

    await expect(aiService.generateResponse(prompt)).rejects.toThrow(
      error.message,
    );

    expect(consoleSpy).toHaveBeenCalledWith(`Ai service error: ${error}`);
    consoleSpy.mockRestore();
  });
});
